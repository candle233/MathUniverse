'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Surface3DMesh, Attractor3DTrajectory } from '../../types/sandbox.ts';
import { generateParametricSurfaceMesh, solveODE_RK4, ParametricSurfaceType } from '../../lib/mathCompute.ts';
import { useLanguage } from '@/context/LanguageContext';
import { RotateCw, Play, Pause, Layers, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface Plot3DSurfaceProps {
  surfaceMesh?: Surface3DMesh;
  attractorTrajectory?: Attractor3DTrajectory;
  defaultType?: ParametricSurfaceType | 'lorenz_attractor';
  width?: number;
  height?: number;
  className?: string;
}

export default function Plot3DSurface({
  surfaceMesh: customMesh,
  attractorTrajectory: customAttractor,
  defaultType = 'mobius',
  width = 600,
  height = 400,
  className = '',
}: Plot3DSurfaceProps) {
  const { isZh } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Surface or Attractor selection
  const [activeSurfaceType, setActiveSurfaceType] = useState<ParametricSurfaceType | 'lorenz_attractor'>(defaultType);
  const [wireframe, setWireframe] = useState<boolean>(false);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [zoom, setZoom] = useState<number>(1.1);

  // Euler Angles (rotation)
  const [rotX, setRotX] = useState<number>(0.6);
  const [rotY, setRotY] = useState<number>(0.8);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Generate current active mesh
  const currentMesh = React.useMemo(() => {
    if (customMesh) return customMesh;
    if (activeSurfaceType === 'lorenz_attractor') return null;
    return generateParametricSurfaceMesh(activeSurfaceType, 28, 28);
  }, [customMesh, activeSurfaceType]);

  // Generate current active attractor
  const currentAttractor = React.useMemo(() => {
    if (customAttractor) return customAttractor;
    if (activeSurfaceType === 'lorenz_attractor') {
      const ode = solveODE_RK4({
        system: 'lorenz',
        params: { sigma: 10, rho: 28, beta: 8 / 3 },
        initialState: [0.1, 0.0, 0.0],
        tSpan: [0, 35],
        dt: 0.015,
      });
      return {
        system: 'lorenz' as const,
        trajectory: ode.trajectory as Array<[number, number, number]>,
        t: ode.t,
      };
    }
    return null;
  }, [customAttractor, activeSurfaceType]);

  // Animation Loop for Auto-Rotation
  useEffect(() => {
    let animId: number;
    const loop = () => {
      if (autoRotate && !isDragging) {
        setRotY((y) => (y + 0.008) % (2 * Math.PI));
      }
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [autoRotate, isDragging]);

  // Render 3D Canvas Projection
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = (canvas.clientWidth || width) * dpr;
    canvas.height = (canvas.clientHeight || height) * dpr;
    ctx.scale(dpr, dpr);

    const w = canvas.clientWidth || width;
    const h = canvas.clientHeight || height;

    // Background gradient
    const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 20, w / 2, h / 2, w / 1.2);
    bgGrad.addColorStop(0, '#0f172a');
    bgGrad.addColorStop(1, '#020617');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // 3D Projection Matrix
    const cosX = Math.cos(rotX);
    const sinX = Math.sin(rotX);
    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);

    const project = (x: number, y: number, z: number): { px: number; py: number; depth: number } => {
      // Rotate around Y axis
      const x1 = cosY * x + sinY * z;
      const y1 = y;
      const z1 = -sinY * x + cosY * z;

      // Rotate around X axis
      const x2 = x1;
      const y2 = cosX * y1 - sinX * z1;
      const z2 = sinX * y1 + cosX * z1;

      // Perspective projection
      const fov = 400;
      const cameraDist = 8;
      const scale = (fov / (z2 + cameraDist)) * zoom * (w / 600) * 45;

      const px = w / 2 + x2 * scale;
      const py = h / 2 - y2 * scale;

      return { px, py, depth: z2 };
    };

    // 1. Render 3D Attractor Trajectory
    if (currentAttractor && currentAttractor.trajectory.length > 1) {
      const traj = currentAttractor.trajectory;
      ctx.lineWidth = 1.6;

      for (let i = 1; i < traj.length; i++) {
        const p0 = project(traj[i - 1][0] * 0.1, traj[i - 1][1] * 0.1, (traj[i - 1][2] - 25) * 0.1);
        const p1 = project(traj[i][0] * 0.1, traj[i][1] * 0.1, (traj[i][2] - 25) * 0.1);

        const hue = (180 + (i / traj.length) * 160) % 360;
        ctx.strokeStyle = `hsl(${hue}, 90%, 65%)`;
        ctx.beginPath();
        ctx.moveTo(p0.px, p0.py);
        ctx.lineTo(p1.px, p1.py);
        ctx.stroke();
      }
      return;
    }

    // 2. Render 3D Parametric Mesh
    if (currentMesh) {
      const { vertices, faces } = currentMesh;

      // Project all vertices
      const projected = vertices.map((v) => project(v.x, v.y, v.z));

      // Painter's Algorithm: Sort faces by depth
      const sortedFaces = faces
        .map((face) => {
          const [i0, i1, i2, i3] = face.indices;
          const p0 = projected[i0];
          const p1 = projected[i1];
          const p2 = projected[i2];
          const p3 = projected[i3];
          const avgDepth = (p0.depth + p1.depth + p2.depth + p3.depth) / 4;
          return { face, p0, p1, p2, p3, avgDepth };
        })
        .sort((a, b) => b.avgDepth - a.avgDepth);

      // Light source vector
      const lx = 0.577,
        ly = 0.577,
        lz = 0.577;

      sortedFaces.forEach(({ p0, p1, p2, p3 }) => {
        // Calculate screen-space normal for shading
        const v1x = p1.px - p0.px;
        const v1y = p1.py - p0.py;
        const v2x = p2.px - p0.px;
        const v2y = p2.py - p0.py;
        const cross = v1x * v2y - v1y * v2x;

        // Simple normal lighting approximation
        const intensity = Math.max(0.2, Math.min(1.0, 0.4 + 0.6 * Math.abs(cross / 1500)));

        ctx.beginPath();
        ctx.moveTo(p0.px, p0.py);
        ctx.lineTo(p1.px, p1.py);
        ctx.lineTo(p2.px, p2.py);
        ctx.lineTo(p3.px, p3.py);
        ctx.closePath();

        if (!wireframe) {
          const r = Math.round(14 * intensity + 20);
          const g = Math.round(165 * intensity + 30);
          const b = Math.round(233 * intensity + 20);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.82)`;
          ctx.fill();
        }

        ctx.strokeStyle = wireframe ? '#38bdf8' : 'rgba(14, 116, 144, 0.5)';
        ctx.lineWidth = wireframe ? 1.0 : 0.6;
        ctx.stroke();
      });
    }
  }, [currentMesh, currentAttractor, rotX, rotY, zoom, wireframe, width, height]);

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    setRotY((y) => y + dx * 0.01);
    setRotX((x) => Math.max(-1.5, Math.min(1.5, x + dy * 0.01)));
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div className={`relative rounded-xl border border-slate-800 bg-slate-950 overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />

      {/* Surface Type Selector */}
      <div className="absolute top-2 left-2 flex flex-wrap gap-1 bg-slate-900/90 p-1.5 rounded-lg border border-slate-800 backdrop-blur-md max-w-[80%]">
        {[
          { id: 'mobius', label: isZh ? '莫比乌斯带' : 'Möbius strip' },
          { id: 'torus', label: isZh ? '环面 (Torus)' : 'Torus' },
          { id: 'hyperbolic_paraboloid', label: isZh ? '双曲抛物面 (马鞍面)' : 'Hyperbolic paraboloid (saddle)' },
          { id: 'catenoid', label: isZh ? '悬链面' : 'Catenoid' },
          { id: 'helicoid', label: isZh ? '正螺旋面' : 'Helicoid' },
          { id: 'enneper', label: isZh ? '恩内佩尔极小曲面' : 'Enneper surface' },
          { id: 'lorenz_attractor', label: isZh ? 'Lorenz 3D 混沌吸引子' : 'Lorenz attractor' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSurfaceType(item.id as any)}
            className={`px-2 py-1 rounded text-[10px] font-semibold transition-all cursor-pointer ${
              activeSurfaceType === item.id
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Control Buttons */}
      <div className="absolute top-2 right-2 flex items-center gap-1 bg-slate-900/90 p-1 rounded-lg border border-slate-800 backdrop-blur-md">
        <button
          onClick={() => setAutoRotate((r) => !r)}
          className={`p-1.5 rounded transition-colors ${
            autoRotate ? 'text-cyan-400 bg-slate-800' : 'text-slate-400 hover:text-slate-200'
          }`}
          title={autoRotate ? (isZh ? '暂停旋转' : 'Pause rotation') : (isZh ? '自动旋转' : 'Auto-rotate')}
        >
          {autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>
        <button
          onClick={() => setWireframe((w) => !w)}
          className={`p-1.5 rounded transition-colors ${
            wireframe ? 'text-cyan-400 bg-slate-800' : 'text-slate-400 hover:text-slate-200'
          }`}
          title={isZh ? '切换线框模式' : 'Toggle wireframe'}
        >
          <Layers className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setZoom((z) => Math.min(3, z * 1.2))}
          className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200"
          title={isZh ? '放大' : 'Zoom in'}
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(0.4, z / 1.2))}
          className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200"
          title={isZh ? '缩小' : 'Zoom out'}
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => {
            setRotX(0.6);
            setRotY(0.8);
            setZoom(1.1);
          }}
          className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200"
          title={isZh ? '重置视角' : 'Reset View'}
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="absolute bottom-2 right-2 text-[10px] font-mono text-slate-500 pointer-events-none">
        {isZh ? '拖拽鼠标交互式旋转 · 3D 矩阵投影渲染' : 'Drag to rotate interactively · 3D matrix projection rendering'}
      </div>
    </div>
  );
}
