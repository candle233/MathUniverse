'use client';

import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import {
  Sparkles,
  RotateCw,
  Layers,
  Sliders,
  Box,
  Eye,
  Move,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Minimize2,
  Download,
} from 'lucide-react';
import { InlineLaTeX } from '@/components/math/LaTeXRenderer';
import { useLanguage } from '@/context/LanguageContext';

export interface SurfaceDefinition {
  id: string;
  nameZh: string;
  nameEn: string;
  discipline: string;
  disciplineEn: string;
  formulaLatex: string;
  description: string;
  descriptionEn: string;
  generateMesh: (uSteps: number, vSteps: number, paramA: number) => {
    points: Array<{ x: number; y: number; z: number }>;
    faces: number[][];
    isCurve?: boolean;
  };
}

export const surfaceDefinitions: SurfaceDefinition[] = [
  {
    id: 'mobius',
    nameZh: '莫比乌斯带',
    nameEn: 'Möbius Strip',
    discipline: '微分拓扑学',
    disciplineEn: 'Differential Topology',
    formulaLatex: 'x(u,v) = \\left(1 + \\frac{v}{2}\\cos\\frac{u}{2}\\right)\\cos u, \\quad z(u,v) = \\frac{v}{2}\\sin\\frac{u}{2}',
    description: '单侧不可定向流形 (Non-orientable manifold)，欧拉示性数 χ = 0。',
    descriptionEn: 'One-sided non-orientable manifold with Euler characteristic χ = 0.',
    generateMesh: (uSteps, vSteps, paramA) => {
      const points: Array<{ x: number; y: number; z: number }> = [];
      const faces: number[][] = [];
      for (let i = 0; i <= uSteps; i++) {
        const u = (i / uSteps) * 2 * Math.PI;
        for (let j = 0; j <= vSteps; j++) {
          const v = (j / vSteps) * 2 - 1; // v in [-1, 1]
          const x = (1 + (v / 2) * Math.cos(u / 2)) * Math.cos(u) * 1.6;
          const y = (1 + (v / 2) * Math.cos(u / 2)) * Math.sin(u) * 1.6;
          const z = (v / 2) * Math.sin(u / 2) * 1.6 * paramA;
          points.push({ x, y, z });
        }
      }
      for (let i = 0; i < uSteps; i++) {
        for (let j = 0; j < vSteps; j++) {
          const idx = i * (vSteps + 1) + j;
          faces.push([idx, idx + 1, idx + vSteps + 2, idx + vSteps + 1]);
        }
      }
      return { points, faces };
    },
  },
  {
    id: 'saddle',
    nameZh: '双曲抛物面 (马鞍面)',
    nameEn: 'Hyperbolic Paraboloid',
    discipline: '微分几何',
    disciplineEn: 'Differential Geometry',
    formulaLatex: 'z = \\frac{x^2 - y^2}{2.5}',
    description: '高斯曲率 K < 0 的直纹曲面 (Ruled surface)，原点为极小极大的双曲鞍点。',
    descriptionEn: 'A ruled surface with Gaussian curvature K < 0; the origin is a hyperbolic saddle point of minimax type.',
    generateMesh: (uSteps, vSteps, paramA) => {
      const points: Array<{ x: number; y: number; z: number }> = [];
      const faces: number[][] = [];
      for (let i = 0; i <= uSteps; i++) {
        const x = ((i / uSteps) * 2 - 1) * 1.8;
        for (let j = 0; j <= vSteps; j++) {
          const y = ((j / vSteps) * 2 - 1) * 1.8;
          const z = ((x * x - y * y) / 2.5) * paramA;
          points.push({ x, y, z });
        }
      }
      for (let i = 0; i < uSteps; i++) {
        for (let j = 0; j < vSteps; j++) {
          const idx = i * (vSteps + 1) + j;
          faces.push([idx, idx + 1, idx + vSteps + 2, idx + vSteps + 1]);
        }
      }
      return { points, faces };
    },
  },
  {
    id: 'torus',
    nameZh: '环面 (Torus)',
    nameEn: '2-Torus (Genus 1)',
    discipline: '代数拓扑学',
    disciplineEn: 'Algebraic Topology',
    formulaLatex: 'x = (R + r\\cos v)\\cos u, \\quad z = r\\sin v',
    description: '亏格 g = 1 的紧致无界二维流形，同胚于圆周直积 S¹ × S¹。',
    descriptionEn: 'A compact genus-1 two-dimensional manifold, homeomorphic to the product of two circles S¹ × S¹.',
    generateMesh: (uSteps, vSteps, paramA) => {
      const points: Array<{ x: number; y: number; z: number }> = [];
      const faces: number[][] = [];
      const R = 1.4;
      const r = 0.6 * (paramA / 1.5);
      for (let i = 0; i <= uSteps; i++) {
        const u = (i / uSteps) * 2 * Math.PI;
        for (let j = 0; j <= vSteps; j++) {
          const v = (j / vSteps) * 2 * Math.PI;
          const x = (R + r * Math.cos(v)) * Math.cos(u);
          const y = (R + r * Math.cos(v)) * Math.sin(u);
          const z = r * Math.sin(v);
          points.push({ x, y, z });
        }
      }
      for (let i = 0; i < uSteps; i++) {
        for (let j = 0; j < vSteps; j++) {
          const idx = i * (vSteps + 1) + j;
          faces.push([idx, idx + 1, idx + vSteps + 2, idx + vSteps + 1]);
        }
      }
      return { points, faces };
    },
  },
  {
    id: 'riemann',
    nameZh: '黎曼球面 (S²)',
    nameEn: 'Riemann Sphere',
    discipline: '复分析',
    disciplineEn: 'Complex Analysis',
    formulaLatex: '\\mathbb{S}^2 \\cong \\hat{\\mathbb{C}} = \\mathbb{C} \\cup \\{\\infty\\}',
    description: '复平面的单点紧化，黎曼面上全纯函数与亚纯函数的基本定义域。',
    descriptionEn: 'The one-point compactification of the complex plane — the fundamental domain for holomorphic and meromorphic functions on the Riemann sphere.',
    generateMesh: (uSteps, vSteps, paramA) => {
      const points: Array<{ x: number; y: number; z: number }> = [];
      const faces: number[][] = [];
      const r = 1.6;
      for (let i = 0; i <= uSteps; i++) {
        const theta = (i / uSteps) * Math.PI;
        for (let j = 0; j <= vSteps; j++) {
          const phi = (j / vSteps) * 2 * Math.PI;
          const x = r * Math.sin(theta) * Math.cos(phi);
          const y = r * Math.sin(theta) * Math.sin(phi);
          const z = r * Math.cos(theta) * paramA;
          points.push({ x, y, z });
        }
      }
      for (let i = 0; i < uSteps; i++) {
        for (let j = 0; j < vSteps; j++) {
          const idx = i * (vSteps + 1) + j;
          faces.push([idx, idx + 1, idx + vSteps + 2, idx + vSteps + 1]);
        }
      }
      return { points, faces };
    },
  },
  {
    id: 'monkey-saddle',
    nameZh: '猴鞍面 (Monkey Saddle)',
    nameEn: 'Monkey Saddle',
    discipline: '微分几何 / 奇点理论',
    disciplineEn: 'Differential Geometry / Singularity Theory',
    formulaLatex: 'z = x^3 - 3xy^2 = \\mathrm{Re}(w^3)',
    description: '三阶退化马鞍面，拥有三个向下的凹槽（供猴子的两条腿和一条尾巴放置）。',
    descriptionEn: 'A third-order degenerate saddle with three downward depressions (room for a monkey’s two legs and its tail).',
    generateMesh: (uSteps, vSteps, paramA) => {
      const points: Array<{ x: number; y: number; z: number }> = [];
      const faces: number[][] = [];
      for (let i = 0; i <= uSteps; i++) {
        const x = ((i / uSteps) * 2 - 1) * 1.5;
        for (let j = 0; j <= vSteps; j++) {
          const y = ((j / vSteps) * 2 - 1) * 1.5;
          const z = (x * x * x - 3 * x * y * y) * 0.5 * paramA;
          points.push({ x, y, z });
        }
      }
      for (let i = 0; i < uSteps; i++) {
        for (let j = 0; j < vSteps; j++) {
          const idx = i * (vSteps + 1) + j;
          faces.push([idx, idx + 1, idx + vSteps + 2, idx + vSteps + 1]);
        }
      }
      return { points, faces };
    },
  },
  {
    id: 'catenoid',
    nameZh: '悬链面 (Catenoid)',
    nameEn: 'Catenoid Minimal Surface',
    discipline: '极小曲面理论',
    disciplineEn: 'Minimal Surface Theory',
    formulaLatex: 'x = c\\cosh(v/c)\\cos u, \\quad z = v',
    description: '欧拉于 1744 年发现的除平面外唯一的旋转极小曲面 (Mean curvature H = 0)。',
    descriptionEn: 'Discovered by Euler in 1744 — the only surface of revolution besides the plane that is minimal (mean curvature H = 0).',
    generateMesh: (uSteps, vSteps, paramA) => {
      const points: Array<{ x: number; y: number; z: number }> = [];
      const faces: number[][] = [];
      const c = 0.7 * (paramA / 1.5);
      for (let i = 0; i <= uSteps; i++) {
        const u = (i / uSteps) * 2 * Math.PI;
        for (let j = 0; j <= vSteps; j++) {
          const v = ((j / vSteps) * 2 - 1) * 1.2;
          const x = c * Math.cosh(v / c) * Math.cos(u);
          const y = c * Math.cosh(v / c) * Math.sin(u);
          const z = v * 1.2;
          points.push({ x, y, z });
        }
      }
      for (let i = 0; i < uSteps; i++) {
        for (let j = 0; j < vSteps; j++) {
          const idx = i * (vSteps + 1) + j;
          faces.push([idx, idx + 1, idx + vSteps + 2, idx + vSteps + 1]);
        }
      }
      return { points, faces };
    },
  },
  {
    id: 'helicoid',
    nameZh: '螺旋面 (Helicoid)',
    nameEn: 'Helicoid Minimal Surface',
    discipline: '极小曲面理论',
    disciplineEn: 'Minimal Surface Theory',
    formulaLatex: 'x = \\rho\\cos\\theta, \\quad z = c\\theta',
    description: '直纹极小曲面，通过等距连续变形与悬链面互为共轭极小曲面。',
    descriptionEn: 'A ruled minimal surface, conjugate to the catenoid through an isometric continuous deformation.',
    generateMesh: (uSteps, vSteps, paramA) => {
      const points: Array<{ x: number; y: number; z: number }> = [];
      const faces: number[][] = [];
      const c = 0.5 * paramA;
      for (let i = 0; i <= uSteps; i++) {
        const theta = ((i / uSteps) * 2 - 1) * Math.PI;
        for (let j = 0; j <= vSteps; j++) {
          const rho = ((j / vSteps) * 2 - 1) * 1.5;
          const x = rho * Math.cos(theta);
          const y = rho * Math.sin(theta);
          const z = c * theta;
          points.push({ x, y, z });
        }
      }
      for (let i = 0; i < uSteps; i++) {
        for (let j = 0; j < vSteps; j++) {
          const idx = i * (vSteps + 1) + j;
          faces.push([idx, idx + 1, idx + vSteps + 2, idx + vSteps + 1]);
        }
      }
      return { points, faces };
    },
  },
  {
    id: 'lorenz',
    nameZh: '洛伦兹吸引子',
    nameEn: 'Lorenz Strange Attractor',
    discipline: '动力系统 / 混沌理论',
    disciplineEn: 'Dynamical Systems / Chaos Theory',
    formulaLatex: '\\dot{x} = \\sigma(y - x), \\quad \\dot{y} = x(\\rho - z) - y, \\quad \\dot{z} = xy - \\beta z',
    description: '非线性耗散动力系统混沌解，具有豪斯多夫分形维数 d ≈ 2.06。',
    descriptionEn: 'Chaotic solution of a nonlinear dissipative dynamical system with Hausdorff fractal dimension d ≈ 2.06.',
    generateMesh: (uSteps, vSteps, paramA) => {
      const points: Array<{ x: number; y: number; z: number }> = [];
      let lx = 0.1,
        ly = 0.0,
        lz = 0.0;
      const sigma = 10,
        rho = 28,
        beta = 8 / 3;
      const dt = 0.01;
      for (let i = 0; i < 900; i++) {
        const dx = sigma * (ly - lx) * dt;
        const dy = (lx * (rho - lz) - ly) * dt;
        const dz = (lx * ly - beta * lz) * dt;
        lx += dx;
        ly += dy;
        lz += dz;
        points.push({ x: lx * 0.08, y: ly * 0.08, z: (lz - 25) * 0.08 * paramA });
      }
      return { points, faces: [], isCurve: true };
    },
  },
];

export default function ThreeMathSurface({ surface = 'mobius' }: { surface?: string }) {
  const { isZh } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fullscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [selectedId, setSelectedId] = useState<string>(surface);
  const [isRotating, setIsRotating] = useState(true);
  const isRotatingRef = useRef(true);
  useEffect(() => {
    isRotatingRef.current = isRotating;
  }, [isRotating]);

  const [wireframe, setWireframe] = useState(false);
  const [paramA, setParamA] = useState(1.5);
  const [zoom, setZoom] = useState(1.0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Canvas dimensions state
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 800, height: 460 });

  const rotationRef = useRef({ x: 0.5, y: 0.6 });
  const isDraggingRef = useRef(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });

  const currentSurface = surfaceDefinitions.find((s) => s.id === selectedId) || surfaceDefinitions[0];

  // Generate 3D point grid based on mathematical formulas
  const meshData = useMemo(() => {
    const uRes = isFullscreen ? 48 : 36;
    const vRes = isFullscreen ? 24 : 18;
    return currentSurface.generateMesh(uRes, vRes, paramA);
  }, [currentSurface, paramA, isFullscreen]);

  // Automatically update canvas size on container resize
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateSize = () => {
      const rect = container.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setCanvasDimensions({
          width: Math.floor(rect.width),
          height: Math.floor(rect.height),
        });
      }
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(container);
    window.addEventListener('resize', updateSize);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  const resetView = useCallback(() => {
    rotationRef.current = { x: 0.5, y: 0.6 };
    setZoom(1.0);
  }, []);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      } else if (e.key === ' ' && isFullscreen) {
        setIsRotating((r) => !r);
      } else if ((e.key === 'w' || e.key === 'W') && isFullscreen) {
        setWireframe((w) => !w);
      } else if (e.key === '0' && isFullscreen) {
        resetView();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, resetView]);

  // Animation & Rendering Loop
  useEffect(() => {
    let animId: number;

    const render = () => {
      const activeCanvas = isFullscreen ? fullscreenCanvasRef.current : canvasRef.current;
      if (activeCanvas) {
        const ctx = activeCanvas.getContext('2d');
        if (ctx) {
          if (isFullscreen) {
            activeCanvas.width = window.innerWidth * 0.94;
            activeCanvas.height = window.innerHeight * 0.76;
          }

          ctx.clearRect(0, 0, activeCanvas.width, activeCanvas.height);

          if (isRotatingRef.current && !isDraggingRef.current) {
            rotationRef.current.x += 0.006;
            rotationRef.current.y += 0.008;
          }

          const cx = activeCanvas.width / 2;
          const cy = activeCanvas.height / 2;
          const scale = 110 * zoom * (activeCanvas.width / 800);
          const rotation = rotationRef.current;

          // 3D rotation matrices
          const cosX = Math.cos(rotation.x);
          const sinX = Math.sin(rotation.x);
          const cosY = Math.cos(rotation.y);
          const sinY = Math.sin(rotation.y);

          // Project points to 2.5D screen space
          const projected = meshData.points.map((p) => {
            const x1 = p.x * cosY + p.z * sinY;
            const y1 = p.y;
            const z1 = -p.x * sinY + p.z * cosY;

            const x2 = x1;
            const y2 = y1 * cosX - z1 * sinX;
            const z2 = y1 * sinX + z1 * cosX;

            const fov = 4.0;
            const distance = fov + z2;
            const projScale = distance > 0.1 ? (fov / distance) * scale : scale;

            return {
              sx: cx + x2 * projScale,
              sy: cy + y2 * projScale,
              depth: z2,
            };
          });

          if (meshData.isCurve) {
            // Draw 3D trajectory curve (Lorenz)
            ctx.beginPath();
            for (let i = 0; i < projected.length - 1; i++) {
              const p1 = projected[i];
              const p2 = projected[i + 1];
              const grad = ctx.createLinearGradient(p1.sx, p1.sy, p2.sx, p2.sy);
              const hue = 180 + (i % 120);
              grad.addColorStop(0, `hsl(${hue}, 90%, 65%)`);
              grad.addColorStop(1, `hsl(${hue + 5}, 90%, 65%)`);
              ctx.strokeStyle = grad;
              ctx.lineWidth = isFullscreen ? 2.2 : 1.6;
              ctx.beginPath();
              ctx.moveTo(p1.sx, p1.sy);
              ctx.lineTo(p2.sx, p2.sy);
              ctx.stroke();
            }
          } else {
            // Sort faces by depth for painter's algorithm
            const sortedFaces = meshData.faces
              .map((faceIndices) => {
                const avgDepth =
                  faceIndices.reduce((sum, idx) => sum + (projected[idx]?.depth || 0), 0) / faceIndices.length;
                return { indices: faceIndices, depth: avgDepth };
              })
              .sort((a, b) => b.depth - a.depth);

            sortedFaces.forEach(({ indices, depth }) => {
              const p0 = projected[indices[0]];
              const p1 = projected[indices[1]];
              const p2 = projected[indices[2]];
              const p3 = projected[indices[3]];

              if (!p0 || !p1 || !p2 || !p3) return;

              ctx.beginPath();
              ctx.moveTo(p0.sx, p0.sy);
              ctx.lineTo(p1.sx, p1.sy);
              ctx.lineTo(p2.sx, p2.sy);
              ctx.lineTo(p3.sx, p3.sy);
              ctx.closePath();

              if (wireframe) {
                ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
                ctx.lineWidth = 1;
                ctx.stroke();
              } else {
                const normLight = Math.max(0.15, Math.min(0.9, (depth + 2.0) / 4.0));
                const r = Math.floor(20 + normLight * 40);
                const g = Math.floor(100 + normLight * 120);
                const b = Math.floor(180 + normLight * 75);

                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.78)`;
                ctx.fill();
                ctx.strokeStyle = `rgba(${r + 30}, ${g + 30}, ${b + 20}, 0.35)`;
                ctx.lineWidth = 0.8;
                ctx.stroke();
              }
            });
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [meshData, wireframe, zoom, isFullscreen]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    lastMouseRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastMouseRef.current.x;
    const dy = e.clientY - lastMouseRef.current.y;
    rotationRef.current.x += dy * 0.01;
    rotationRef.current.y += dx * 0.01;
    lastMouseRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.12 : 1 / 1.12;
    setZoom((z) => Math.max(0.2, Math.min(5, z * factor)));
  };

  const handleDownloadSnapshot = () => {
    const activeCanvas = isFullscreen ? fullscreenCanvasRef.current : canvasRef.current;
    if (!activeCanvas) return;
    const url = activeCanvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `mathuniverse_3d_manifold_${Date.now()}.png`;
    a.click();
  };

  return (
    <>
      <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl p-6 space-y-6">
        {/* Header & Surface Selector */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Box className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm">
                {isZh ? '3D 微分流形与经典极小曲面工作室 (3D Differential Manifolds Studio)' : '3D Differential Manifolds & Minimal Surfaces Studio'}
              </h3>
              <p className="text-xs text-slate-400">
                {isZh
                  ? '交互式 360° 拖拽观察流形曲率、拓扑单侧性、极小曲面与混沌吸引子'
                  : 'Interactively drag through 360° to observe manifold curvature, one-sided topology, minimal surfaces, and chaotic attractors'}
              </p>
            </div>
          </div>

          {/* Surface Select Tabs */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {surfaceDefinitions.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedId(s.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedId === s.id
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                {isZh ? s.nameZh.split(' ')[0] : s.nameEn}
              </button>
            ))}
          </div>
        </div>

        {/* Surface Description & LaTeX Box */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-cyan-300 font-bold">{isZh ? currentSurface.nameZh : currentSurface.nameEn}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                {isZh ? currentSurface.discipline : currentSurface.disciplineEn}
              </span>
            </div>
            <p className="text-slate-400 mt-1">{isZh ? currentSurface.description : currentSurface.descriptionEn}</p>
          </div>

          {/* LaTeX Parametric Equation */}
          <div className="p-2.5 px-3 rounded-lg bg-slate-950 border border-cyan-500/30 text-cyan-200 font-mono text-xs overflow-x-auto">
            <InlineLaTeX formula={currentSurface.formulaLatex} />
          </div>
        </div>

        {/* 3D Canvas Viewport */}
        <div
          ref={containerRef}
          className="relative w-full h-[460px] bg-slate-950 rounded-2xl border border-slate-800 math-grid-pattern overflow-hidden cursor-grab active:cursor-grabbing"
        >
          <canvas
            ref={canvasRef}
            width={canvasDimensions.width}
            height={canvasDimensions.height}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
            className="w-full h-full block"
          />

          {/* Floating Controls Overlay */}
          <div className="absolute bottom-3 left-3 flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsRotating(!isRotating)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                isRotating
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  : 'bg-slate-900 text-slate-400 border-slate-700'
              }`}
            >
              <RotateCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
              <span>{isRotating ? (isZh ? '自转开启' : 'Auto-Rotate On') : (isZh ? '自转暂停' : 'Auto-Rotate Paused')}</span>
            </button>

            {!meshData.isCurve && (
              <button
                onClick={() => setWireframe(!wireframe)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                  wireframe
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                    : 'bg-slate-900 text-slate-400 border-slate-700'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{wireframe ? (isZh ? '线框骨架' : 'Wireframe') : (isZh ? '实体着色' : 'Solid Shading')}</span>
              </button>
            )}

            <button
              onClick={() => setZoom((z) => Math.min(4, z * 1.2))}
              className="p-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-cyan-300 transition-colors cursor-pointer"
              title={isZh ? '放大' : 'Zoom in'}
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoom((z) => Math.max(0.3, z / 1.2))}
              className="p-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-cyan-300 transition-colors cursor-pointer"
              title={isZh ? '缩小' : 'Zoom out'}
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={resetView}
              className="p-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-cyan-300 transition-colors cursor-pointer"
              title={isZh ? '重置视角' : 'Reset view'}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleDownloadSnapshot}
              className="p-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-cyan-300 transition-colors cursor-pointer"
              title={isZh ? '导出 PNG' : 'Export PNG'}
            >
              <Download className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsFullscreen(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition-all cursor-pointer"
              title={isZh ? '全屏放大 3D 流形视图' : 'Expand to Fullscreen'}
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>{isZh ? '全屏放大' : 'Fullscreen'}</span>
            </button>
          </div>

          {/* Drag Hint */}
          <div className="absolute bottom-3 right-3 p-2 px-3 rounded-xl glass-panel text-[11px] text-slate-400 flex items-center gap-1.5 pointer-events-none">
            <Move className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isZh ? '按住鼠标左键 360° 自由旋转 · 滚轮缩放' : 'Drag to rotate · Scroll to zoom'}</span>
          </div>
        </div>

        {/* Parameter Adjustment Slider */}
        <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center justify-between gap-4 text-xs font-mono">
          <span className="text-slate-300 flex items-center gap-1.5 font-semibold">
            <Sliders className="w-4 h-4 text-cyan-400" /> {isZh ? '曲面形变与缩放参数 (Param Factor):' : 'Surface Deformation & Scale (Param Factor):'}
          </span>
          <div className="flex items-center gap-3 flex-1 max-w-sm">
            <input
              type="range"
              min={0.4}
              max={2.8}
              step={0.1}
              value={paramA}
              onChange={(e) => setParamA(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <span className="text-cyan-300 font-bold px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
              {paramA.toFixed(1)}x
            </span>
          </div>
        </div>
      </div>

      {/* Fullscreen Magnification Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-slate-950/95 backdrop-blur-2xl p-4 sm:p-6 animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-md shadow-cyan-500/10">
                <Box className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-100 text-base">
                  {isZh ? currentSurface.nameZh : currentSurface.nameEn} — 3D 微分几何流形高清全屏工作室
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  {isZh ? currentSurface.description : currentSurface.descriptionEn}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setIsRotating((r) => !r)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                  isRotating
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                <RotateCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
                <span>{isRotating ? (isZh ? '自转开启' : 'Rotate On') : (isZh ? '自转暂停' : 'Rotate Paused')}</span>
              </button>

              {!meshData.isCurve && (
                <button
                  onClick={() => setWireframe((w) => !w)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                    wireframe
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>{wireframe ? (isZh ? '线框骨架' : 'Wireframe') : (isZh ? '实体着色' : 'Solid')}</span>
                </button>
              )}

              <button
                onClick={() => setZoom((z) => Math.min(5, z * 1.2))}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium cursor-pointer"
              >
                <ZoomIn className="w-3.5 h-3.5" />
                <span>{isZh ? '放大' : 'Zoom In'}</span>
              </button>

              <button
                onClick={() => setZoom((z) => Math.max(0.3, z / 1.2))}
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
            <span className="text-xs text-slate-400 font-mono">{isZh ? '切换流形模型:' : 'Switch Manifold:'}</span>
            {surfaceDefinitions.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedId === item.id
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {isZh ? item.nameZh.split(' ')[0] : item.nameEn}
              </button>
            ))}
          </div>

          {/* Viewport */}
          <div className="flex-1 w-full relative my-3 rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl flex items-center justify-center">
            <canvas
              ref={fullscreenCanvasRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
              className="w-full h-full block cursor-grab active:cursor-grabbing"
            />

            {/* LaTeX Floating Formula */}
            <div className="absolute bottom-4 left-4 p-3 rounded-2xl bg-slate-900/90 border border-cyan-500/40 text-cyan-200 font-mono text-xs backdrop-blur-md shadow-2xl">
              <InlineLaTeX formula={currentSurface.formulaLatex} />
            </div>
          </div>

          {/* Footer Tips */}
          <div className="flex items-center justify-between text-xs text-slate-500 font-mono pt-2 border-t border-slate-800/80">
            <span>{isZh ? '💡 快捷键提示: [拖拽] 360° 旋转 · [滚轮] 放大/缩小 · [空格] 启停自动旋转 · [W] 切换线框 · [0] 重置 · [ESC] 退出' : '💡 Tips: [Drag] 360° Rotate · [Scroll] Zoom · [Space] Toggle Rotation · [W] Wireframe · [0] Reset · [ESC] Exit'}</span>
            <span className="text-cyan-400 font-bold">{isZh ? '高精度曲面剖分渲染' : 'High-Precision Mesh Tessellation'}</span>
          </div>
        </div>
      )}
    </>
  );
}
