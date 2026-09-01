'use client';

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { Surface3DMesh, Attractor3DTrajectory } from '../../types/sandbox';
import { generateParametricSurfaceMesh, solveODE_RK4, ParametricSurfaceType } from '../../lib/mathCompute';
import { useLanguage } from '@/context/LanguageContext';
import {
  Play,
  Pause,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Minimize2,
  Download,
  Box,
} from 'lucide-react';

interface Plot3DSurfaceProps {
  surfaceMesh?: Surface3DMesh;
  attractorTrajectory?: Attractor3DTrajectory;
  defaultType?: ParametricSurfaceType | 'lorenz_attractor';
  width?: number;
  height?: number;
  className?: string;
  allowFullscreen?: boolean;
}

export default function Plot3DSurface({
  surfaceMesh: customMesh,
  attractorTrajectory: customAttractor,
  defaultType = 'mobius',
  width = 600,
  height = 400,
  className = '',
  allowFullscreen = true,
}: Plot3DSurfaceProps) {
  const { isZh } = useLanguage();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fullscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Surface or Attractor selection
  const [activeSurfaceType, setActiveSurfaceType] = useState<ParametricSurfaceType | 'lorenz_attractor'>(defaultType);
  const [wireframe, setWireframe] = useState<boolean>(false);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [zoom, setZoom] = useState<number>(1.1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [containerSize, setContainerSize] = useState<{ width: number; height: number }>({
    width,
    height,
  });

  // Euler Angles (rotation)
  const [rotX, setRotX] = useState<number>(0.6);
  const [rotY, setRotY] = useState<number>(0.8);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Update container size on resize
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect) {
          setContainerSize({
            width: Math.max(200, Math.floor(entry.contentRect.width)),
            height: Math.max(160, Math.floor(entry.contentRect.height || height)),
          });
        }
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [height]);

  // Generate current active mesh
  const currentMesh = useMemo(() => {
    if (customMesh) return customMesh;
    if (activeSurfaceType === 'lorenz_attractor') return null;
    const meshResolution = isFullscreen ? 36 : 28;
    return generateParametricSurfaceMesh(activeSurfaceType, meshResolution, meshResolution);
  }, [customMesh, activeSurfaceType, isFullscreen]);

  // Generate current active attractor
  const currentAttractor = useMemo(() => {
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

  const resetView = useCallback(() => {
    setRotX(0.6);
    setRotY(0.8);
    setZoom(1.1);
  }, []);

  // Keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      } else if (e.key === ' ' && isFullscreen) {
        setAutoRotate((r) => !r);
      } else if ((e.key === 'w' || e.key === 'W') && isFullscreen) {
        setWireframe((w) => !w);
      } else if (e.key === '0' && isFullscreen) {
        resetView();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, resetView]);

  // Render 3D Canvas Projection
  const renderToCanvas = useCallback(
    (canvas: HTMLCanvasElement | null, w: number, h: number) => {
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      // Background gradient
      const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 20, w / 2, h / 2, w / 1.1);
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
        const fov = 420;
        const cameraDist = 8;
        const scale = (fov / (z2 + cameraDist)) * zoom * (w / 600) * 45;

        const px = w / 2 + x2 * scale;
        const py = h / 2 - y2 * scale;

        return { px, py, depth: z2 };
      };

      // 1. Render 3D Attractor Trajectory
      if (currentAttractor && currentAttractor.trajectory.length > 1) {
        const traj = currentAttractor.trajectory;
        ctx.lineWidth = w > 800 ? 2.2 : 1.6;

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
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.84)`;
            ctx.fill();
          }

          ctx.strokeStyle = wireframe ? '#38bdf8' : 'rgba(14, 116, 144, 0.55)';
          ctx.lineWidth = wireframe ? 1.0 : 0.6;
          ctx.stroke();
        });
      }
    },
    [currentAttractor, currentMesh, rotX, rotY, zoom, wireframe]
  );

  // Render normal canvas
  useEffect(() => {
    if (!isFullscreen && canvasRef.current) {
      renderToCanvas(canvasRef.current, containerSize.width, containerSize.height);
    }
  }, [isFullscreen, renderToCanvas, containerSize]);

  // Render fullscreen canvas
  useEffect(() => {
    if (isFullscreen && fullscreenCanvasRef.current) {
      const modalW = window.innerWidth * 0.94;
      const modalH = window.innerHeight * 0.78;
      renderToCanvas(fullscreenCanvasRef.current, modalW, modalH);
    }
  }, [isFullscreen, renderToCanvas, rotX, rotY, zoom, wireframe]);

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

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.12 : 1 / 1.12;
    setZoom((z) => Math.max(0.2, Math.min(6, z * factor)));
  };

  // Download snapshot
  const handleDownloadSnapshot = () => {
    const activeCanvas = isFullscreen ? fullscreenCanvasRef.current : canvasRef.current;
    if (!activeCanvas) return;
    const url = activeCanvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `mathuniverse_3d_surface_${Date.now()}.png`;
    a.click();
  };

  const surfaceOptions = [
    { id: 'mobius', label: isZh ? '莫比乌斯带' : 'Möbius strip' },
    { id: 'torus', label: isZh ? '环面 (Torus)' : 'Torus' },
    { id: 'hyperbolic_paraboloid', label: isZh ? '双曲抛物面 (马鞍面)' : 'Hyperbolic paraboloid' },
    { id: 'catenoid', label: isZh ? '悬链面' : 'Catenoid' },
    { id: 'helicoid', label: isZh ? '正螺旋面' : 'Helicoid' },
    { id: 'enneper', label: isZh ? '恩内佩尔极小曲面' : 'Enneper surface' },
    { id: 'lorenz_attractor', label: isZh ? 'Lorenz 3D 混沌吸引子' : 'Lorenz attractor' },
  ];

  return (
    <>
      <div
        ref={containerRef}
        style={{ height }}
        className={`relative w-full rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-inner group ${className}`}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full block cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          onDoubleClick={resetView}
        />

        {/* Surface Type Selector */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800 backdrop-blur-md max-w-[75%] shadow-lg">
          {surfaceOptions.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSurfaceType(item.id as any)}
              className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
                activeSurfaceType === item.id
                  ? 'bg-cyan-500 text-slate-950 shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Control Buttons */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 backdrop-blur-md shadow-lg">
          <button
            onClick={() => setAutoRotate((r) => !r)}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              autoRotate ? 'text-cyan-400 bg-slate-800' : 'text-slate-400 hover:text-slate-200'
            }`}
            title={autoRotate ? (isZh ? '暂停旋转' : 'Pause rotation') : (isZh ? '自动旋转' : 'Auto-rotate')}
          >
            {autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => setWireframe((w) => !w)}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              wireframe ? 'text-cyan-400 bg-slate-800' : 'text-slate-400 hover:text-slate-200'
            }`}
            title={isZh ? '切换线框模式' : 'Toggle wireframe'}
          >
            <Layers className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.min(5, z * 1.2))}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 cursor-pointer"
            title={isZh ? '放大' : 'Zoom in'}
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(0.2, z / 1.2))}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 cursor-pointer"
            title={isZh ? '缩小' : 'Zoom out'}
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={resetView}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 cursor-pointer"
            title={isZh ? '重置视角' : 'Reset View'}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleDownloadSnapshot}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 cursor-pointer"
            title={isZh ? '导出 PNG 高清快照' : 'Export PNG Snapshot'}
          >
            <Download className="w-3.5 h-3.5" />
          </button>
          {allowFullscreen && (
            <button
              onClick={() => setIsFullscreen(true)}
              className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 transition-all font-bold cursor-pointer"
              title={isZh ? '全屏放大 3D 曲面' : 'Expand to Fullscreen Modal'}
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="absolute bottom-2.5 right-2.5 text-[10px] font-mono text-slate-500 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800/80 pointer-events-none">
          {((zoom || 1) * 100).toFixed(0)}% · {isZh ? '拖拽旋转 · 滚轮缩放' : 'Drag to rotate · Scroll to zoom'}
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-slate-950/95 backdrop-blur-2xl p-4 sm:p-6 animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-md shadow-purple-500/10">
                <Box className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-100 text-base">
                  {isZh ? '3D 微分几何曲面与动力系统高清全屏视图' : '3D Differential Geometry & Attractor Fullscreen View'}
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  {isZh
                    ? `当前曲面: ${surfaceOptions.find((o) => o.id === activeSurfaceType)?.label} · 360° 拖拽观察 · 滚轮缩放`
                    : `Active: ${surfaceOptions.find((o) => o.id === activeSurfaceType)?.label} · 360° Drag · Wheel Zoom`}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setAutoRotate((r) => !r)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                  autoRotate
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                {autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{autoRotate ? (isZh ? '暂停旋转' : 'Pause') : (isZh ? '自动旋转' : 'Rotate')}</span>
              </button>

              <button
                onClick={() => setWireframe((w) => !w)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                  wireframe
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{isZh ? '线框模式' : 'Wireframe'}</span>
              </button>

              <button
                onClick={() => setZoom((z) => Math.min(6, z * 1.2))}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium cursor-pointer"
              >
                <ZoomIn className="w-3.5 h-3.5" />
                <span>{isZh ? '放大' : 'Zoom In'}</span>
              </button>

              <button
                onClick={() => setZoom((z) => Math.max(0.2, z / 1.2))}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium cursor-pointer"
              >
                <ZoomOut className="w-3.5 h-3.5" />
                <span>{isZh ? '缩小' : 'Zoom Out'}</span>
              </button>

              <button
                onClick={resetView}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isZh ? '重置视角' : 'Reset'}</span>
              </button>

              <button
                onClick={handleDownloadSnapshot}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isZh ? '导出 PNG' : 'Export PNG'}</span>
              </button>

              <button
                onClick={() => setIsFullscreen(false)}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-slate-950 border border-rose-500/40 text-xs font-bold transition-all cursor-pointer"
              >
                <Minimize2 className="w-3.5 h-3.5" />
                <span>{isZh ? '退出全屏 (ESC)' : 'Exit (ESC)'}</span>
              </button>
            </div>
          </div>

          {/* Surface Pill Switcher */}
          <div className="flex items-center gap-1.5 flex-wrap pt-3">
            <span className="text-xs text-slate-400 font-mono">{isZh ? '切换曲面模型:' : 'Switch Model:'}</span>
            {surfaceOptions.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSurfaceType(item.id as any)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeSurfaceType === item.id
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Viewport */}
          <div className="flex-1 w-full relative my-3 rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl flex items-center justify-center">
            <canvas
              ref={fullscreenCanvasRef}
              className="w-full h-full block cursor-grab active:cursor-grabbing"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
              onDoubleClick={resetView}
            />

            {/* Rotational Info */}
            <div className="absolute bottom-4 left-4 flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs font-mono text-cyan-300 backdrop-blur-md">
              <span>
                θx = {((rotX * 180) / Math.PI).toFixed(1)}°, θy = {((rotY * 180) / Math.PI).toFixed(1)}°
              </span>
              <span className="text-slate-500">|</span>
              <span>Zoom = {((zoom || 1) * 100).toFixed(0)}%</span>
            </div>
          </div>

          {/* Footer Tips */}
          <div className="flex items-center justify-between text-xs text-slate-500 font-mono pt-2 border-t border-slate-800/80">
            <span>{isZh ? '💡 快捷键提示: [拖拽] 360° 旋转 · [滚轮] 放大/缩小 · [空格] 启停自动旋转 · [W] 切换线框 · [ESC] 退出' : '💡 Tips: [Drag] 360° Rotate · [Scroll] Zoom · [Space] Toggle Rotation · [W] Wireframe · [ESC] Exit'}</span>
            <span className="text-purple-400 font-bold">{isZh ? '3D 矩阵透视投影渲染' : '3D Matrix Perspective Projection'}</span>
          </div>
        </div>
      )}
    </>
  );
}
