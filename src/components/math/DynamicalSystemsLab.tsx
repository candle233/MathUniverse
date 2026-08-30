'use client';

import React, { useState, useRef, useEffect } from 'react';
import { InlineLaTeX } from '@/components/math/LaTeXRenderer';
import { useLanguage } from '@/context/LanguageContext';
import { Activity, Play, Pause, RotateCcw, Sliders, Sparkles, Compass, MousePointer } from 'lucide-react';

export interface DynamicalSystemModel {
  id: string;
  nameZh: string;
  nameEn: string;
  discipline: string;
  disciplineEn: string;
  formulaLatex: string;
  description: string;
  descriptionEn: string;
  defaultParams: { a: number; b: number; c: number; d: number };
  paramLabels: { a: string; b: string; c?: string; d?: string };
  paramLabelsEn: { a: string; b: string; c?: string; d?: string };
  derivative: (x: number, y: number, params: { a: number; b: number; c: number; d: number }) => { dx: number; dy: number };
  xRange: [number, number];
  yRange: [number, number];
}

export const dynamicalModels: DynamicalSystemModel[] = [
  {
    id: 'lotka-volterra',
    nameZh: 'Lotka-Volterra 捕食者-猎物模型',
    nameEn: 'Predator-Prey Dynamical System',
    discipline: '生物数学与非线性动力学',
    disciplineEn: 'Biomathematics & Nonlinear Dynamics',
    formulaLatex: '\\dot{x} = \\alpha x - \\beta x y, \\quad \\dot{y} = \\delta x y - \\gamma y',
    description: '生态学经典捕食系统，相空间呈现由哈密顿量守恒决定的闭合周期性同心轨道。',
    descriptionEn: 'Classic ecological predator-prey system; the phase space shows closed periodic concentric orbits governed by Hamiltonian conservation.',
    defaultParams: { a: 1.0, b: 0.5, c: 0.5, d: 1.0 },
    paramLabels: { a: 'α (猎物自然出生率)', b: 'β (猎物被捕食率)', c: 'δ (捕食者繁殖转化率)', d: 'γ (捕食者自然死亡率)' },
    paramLabelsEn: { a: 'α (Prey natural birth rate)', b: 'β (Prey predation rate)', c: 'δ (Predator reproduction rate)', d: 'γ (Predator natural death rate)' },
    derivative: (x, y, p) => ({
      dx: p.a * x - p.b * x * y,
      dy: p.c * x * y - p.d * y,
    }),
    xRange: [0, 6],
    yRange: [0, 6],
  },
  {
    id: 'van-der-pol',
    nameZh: 'Van der Pol 自激振荡器 (极限环)',
    nameEn: 'Van der Pol Oscillator (Limit Cycle)',
    discipline: '非线性力学与电路理论',
    disciplineEn: 'Nonlinear Mechanics & Circuit Theory',
    formulaLatex: '\\dot{x} = y, \\quad \\dot{y} = \\mu (1 - x^2) y - x',
    description: '具有非线性阻尼的二阶系统，无论初值在环内或环外，轨线最终都会收敛于孤立的稳定极限环。',
    descriptionEn: 'A second-order system with nonlinear damping — trajectories starting inside or outside the ring always converge to the isolated stable limit cycle.',
    defaultParams: { a: 1.2, b: 1.0, c: 0, d: 0 },
    paramLabels: { a: 'μ (非线性阻尼强度)', b: 'ω (固有振动频率)' },
    paramLabelsEn: { a: 'μ (Nonlinear damping strength)', b: 'ω (Natural oscillation frequency)' },
    derivative: (x, y, p) => ({
      dx: y,
      dy: p.a * (1 - x * x) * y - p.b * x,
    }),
    xRange: [-4, 4],
    yRange: [-4, 4],
  },
  {
    id: 'damped-pendulum',
    nameZh: '大角度非线性单摆相平面',
    nameEn: 'Nonlinear Damped Pendulum',
    discipline: '经典力学与动力系统',
    disciplineEn: 'Classical Mechanics & Dynamical Systems',
    formulaLatex: '\\dot{\\theta} = \\omega, \\quad \\dot{\\omega} = -\\frac{g}{L}\\sin\\theta - k\\omega',
    description: '考虑大角度正弦非线性恢复力与空气阻尼，相空间清晰展现中心点、鞍点与分界线 (Separatrix)。',
    descriptionEn: 'With a large-angle sinusoidal restoring force and air damping, the phase space clearly reveals centers, saddle points, and the separatrix.',
    defaultParams: { a: 1.0, b: 0.25, c: 0, d: 0 },
    paramLabels: { a: 'g/L (摆长重力常数)', b: 'k (阻尼阻力系数)' },
    paramLabelsEn: { a: 'g/L (Pendulum gravity constant)', b: 'k (Damping drag coefficient)' },
    derivative: (x, y, p) => ({
      dx: y,
      dy: -p.a * Math.sin(x) - p.b * y,
    }),
    xRange: [-Math.PI * 2, Math.PI * 2],
    yRange: [-4, 4],
  },
  {
    id: 'duffing-oscillator',
    nameZh: 'Duffing 双稳态双势阱振子',
    nameEn: 'Duffing Bistable Oscillator',
    discipline: '非线性振动与混沌分岔',
    disciplineEn: 'Nonlinear Vibration & Chaotic Bifurcation',
    formulaLatex: '\\dot{x} = y, \\quad \\dot{y} = x - x^3 - \\delta y',
    description: '双势阱系统 V(x) = -x²/2 + x⁴/4，拥有两个稳定的焦点和一个不稳定的原点鞍点。',
    descriptionEn: 'Double-well system V(x) = -x²/2 + x⁴/4 with two stable foci and an unstable saddle point at the origin.',
    defaultParams: { a: 0.3, b: 1.0, c: 0, d: 0 },
    paramLabels: { a: 'δ (粘性阻尼系数)', b: 'α (三次硬化弹性模量)' },
    paramLabelsEn: { a: 'δ (Viscous damping coefficient)', b: 'α (Cubic hardening modulus)' },
    derivative: (x, y, p) => ({
      dx: y,
      dy: p.b * x - x * x * x - p.a * y,
    }),
    xRange: [-3, 3],
    yRange: [-3, 3],
  },
];

interface TrajectoryPoint {
  x: number;
  y: number;
}

export default function DynamicalSystemsLab() {
  const { isZh } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedModelId, setSelectedModelId] = useState<string>('lotka-volterra');
  const [isRunning, setIsRunning] = useState(true);

  const model = dynamicalModels.find((m) => m.id === selectedModelId) || dynamicalModels[0];
  const [params, setParams] = useState(model.defaultParams);
  const trajectoriesRef = useRef<TrajectoryPoint[][]>([]);

  // Reset params & trajectories when switching models
  useEffect(() => {
    setParams(model.defaultParams);
    // Add default initial seeds
    if (model.id === 'lotka-volterra') {
      trajectoriesRef.current = [
        [{ x: 2, y: 1 }],
        [{ x: 3, y: 1.5 }],
        [{ x: 1, y: 2 }],
      ];
    } else if (model.id === 'van-der-pol') {
      trajectoriesRef.current = [
        [{ x: 0.2, y: 0.2 }],
        [{ x: 3.0, y: 3.0 }],
        [{ x: -2.5, y: -2.0 }],
      ];
    } else {
      trajectoriesRef.current = [
        [{ x: 1.0, y: 1.0 }],
        [{ x: -1.0, y: 1.0 }],
        [{ x: 0.5, y: -1.5 }],
      ];
    }
  }, [model.id]);

  // Coordinate transformation helpers
  const toScreenX = (x: number, width: number) => {
    const [minX, maxX] = model.xRange;
    return ((x - minX) / (maxX - minX)) * width;
  };

  const toScreenY = (y: number, height: number) => {
    const [minY, maxY] = model.yRange;
    return height - ((y - minY) / (maxY - minY)) * height;
  };

  const toMathCoords = (screenX: number, screenY: number, width: number, height: number) => {
    const [minX, maxX] = model.xRange;
    const [minY, maxY] = model.yRange;
    const x = minX + (screenX / width) * (maxX - minX);
    const y = minY + ((height - screenY) / height) * (maxY - minY);
    return { x, y };
  };

  // Main Render & RK4 Integration Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw Axis & Background Grid
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.4)';
      ctx.lineWidth = 1;

      // X-axis & Y-axis
      const originX = toScreenX(0, width);
      const originY = toScreenY(0, height);

      if (originX >= 0 && originX <= width) {
        ctx.beginPath();
        ctx.moveTo(originX, 0);
        ctx.lineTo(originX, height);
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
        ctx.stroke();
      }
      if (originY >= 0 && originY <= height) {
        ctx.beginPath();
        ctx.moveTo(0, originY);
        ctx.lineTo(width, originY);
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
        ctx.stroke();
      }

      // 2. Draw Vector Field Quiver Arrows
      const gridCols = 24;
      const gridRows = 18;
      const [minX, maxX] = model.xRange;
      const [minY, maxY] = model.yRange;

      for (let i = 0; i <= gridCols; i++) {
        const mx = minX + (i / gridCols) * (maxX - minX);
        for (let j = 0; j <= gridRows; j++) {
          const my = minY + (j / gridRows) * (maxY - minY);
          const { dx, dy } = model.derivative(mx, my, params);
          const len = Math.sqrt(dx * dx + dy * dy);
          if (len === 0) continue;

          const sx = toScreenX(mx, width);
          const sy = toScreenY(my, height);

          const arrowLen = 14;
          const u = (dx / len) * arrowLen;
          const v = -(dy / len) * arrowLen;

          // Color by vector magnitude
          const speedNorm = Math.min(1.0, len / 6.0);
          ctx.strokeStyle = `rgba(56, 189, 248, ${0.15 + speedNorm * 0.45})`;
          ctx.fillStyle = `rgba(56, 189, 248, ${0.15 + speedNorm * 0.45})`;
          ctx.lineWidth = 1;

          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(sx + u, sy + v);
          ctx.stroke();
        }
      }

      // 3. RK4 Step for All Active Trajectories
      if (isRunning) {
        const dt = 0.02;
        trajectoriesRef.current = trajectoriesRef.current.map((traj) => {
          if (traj.length === 0) return traj;
          const curr = traj[traj.length - 1];

          // Runge-Kutta 4th Order
          const k1 = model.derivative(curr.x, curr.y, params);
          const k2 = model.derivative(curr.x + 0.5 * dt * k1.dx, curr.y + 0.5 * dt * k1.dy, params);
          const k3 = model.derivative(curr.x + 0.5 * dt * k2.dx, curr.y + 0.5 * dt * k2.dy, params);
          const k4 = model.derivative(curr.x + dt * k3.dx, curr.y + dt * k3.dy, params);

          const nextX = curr.x + (dt / 6) * (k1.dx + 2 * k2.dx + 2 * k3.dx + k4.dx);
          const nextY = curr.y + (dt / 6) * (k1.dy + 2 * k2.dy + 2 * k3.dy + k4.dy);

          // Cap length to 600 points
          const nextTraj = [...traj, { x: nextX, y: nextY }];
          if (nextTraj.length > 600) nextTraj.shift();
          return nextTraj;
        });
      }

      // 4. Draw Trajectory Lines & Particles
      const colors = ['#38bdf8', '#c084fc', '#34d399', '#fbbf24', '#f87171', '#a78bfa'];

      trajectoriesRef.current.forEach((traj, idx) => {
        if (traj.length < 2) return;
        const color = colors[idx % colors.length];

        ctx.strokeStyle = color;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(toScreenX(traj[0].x, width), toScreenY(traj[0].y, height));

        for (let i = 1; i < traj.length; i++) {
          ctx.lineTo(toScreenX(traj[i].x, width), toScreenY(traj[i].y, height));
        }
        ctx.stroke();

        // Draw animated leading particle head
        const head = traj[traj.length - 1];
        const hx = toScreenX(head.x, width);
        const hy = toScreenY(head.y, height);

        ctx.beginPath();
        ctx.arc(hx, hy, 4.5, 0, 2 * Math.PI);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isRunning, model, params]);

  // Click Canvas to spawn new trajectory
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;

    const { x, y } = toMathCoords(sx, sy, canvas.width, canvas.height);
    trajectoriesRef.current.push([{ x, y }]);
  };

  const handleClearTrajectories = () => {
    trajectoriesRef.current = [];
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl p-6 space-y-6">
      {/* Header & Model Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-sm">
              {isZh ? '常微分方程与动力系统相平面实验室 (Phase Portrait & Dynamical Lab)' : 'Phase Portrait & Dynamical Systems Lab'}
            </h3>
            <p className="text-xs text-slate-400">
              {isZh
                ? '基于 RK4 高阶龙格-库塔数值积分，实时渲染向量场、周期极限环、平衡点与混沌分岔'
                : 'Powered by RK4 (Runge-Kutta) numerical integration — live vector fields, limit cycles, equilibrium points, and chaotic bifurcation'}
            </p>
          </div>
        </div>

        {/* Model Tabs */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {dynamicalModels.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedModelId(m.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedModelId === m.id
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              {isZh ? m.nameZh.split(' ')[0] : m.nameEn}
            </button>
          ))}
        </div>
      </div>

      {/* Description & LaTeX Formula Card */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="space-y-1 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-200 text-sm">{isZh ? model.nameZh : model.nameEn}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
              {isZh ? model.discipline : model.disciplineEn}
            </span>
          </div>
          <p className="text-slate-400">{isZh ? model.description : model.descriptionEn}</p>
        </div>

        <div className="p-3 rounded-xl bg-slate-950 border border-cyan-500/30 text-cyan-200 font-mono text-xs overflow-x-auto">
          <InlineLaTeX formula={model.formulaLatex} />
        </div>
      </div>

      {/* Canvas Viewport */}
      <div className="relative w-full h-[460px] bg-slate-950 rounded-2xl border border-slate-800 math-grid-pattern overflow-hidden cursor-crosshair">
        <canvas
          ref={canvasRef}
          width={840}
          height={460}
          onClick={handleCanvasClick}
          className="w-full h-full block"
        />

        {/* Interactive Click Hint */}
        <div className="absolute top-3 left-3 p-2 px-3 rounded-xl glass-panel text-[11px] text-slate-300 flex items-center gap-1.5 pointer-events-none">
          <MousePointer className="w-3.5 h-3.5 text-cyan-400" />
          <span>{isZh ? '点击相平面任意点即可释放新的动力流线粒子' : 'Click anywhere on the phase plane to release a new flow-line particle'}</span>
        </div>

        {/* Controls Overlay */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              isRunning
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-700'
            }`}
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isRunning ? (isZh ? '暂停模拟' : 'Pause Simulation') : (isZh ? '继续积分' : 'Resume Integration')}</span>
          </button>

          <button
            onClick={handleClearTrajectories}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isZh ? '清空轨迹' : 'Clear Trajectories'}</span>
          </button>
        </div>
      </div>

      {/* Parameter Control Sliders */}
      <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-slate-300">
            <span>{(isZh ? model.paramLabels : model.paramLabelsEn).a}:</span>
            <span className="text-cyan-400 font-bold">{params.a.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min={0.1}
            max={3.0}
            step={0.05}
            value={params.a}
            onChange={(e) => setParams((p) => ({ ...p, a: parseFloat(e.target.value) }))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-slate-300">
            <span>{(isZh ? model.paramLabels : model.paramLabelsEn).b}:</span>
            <span className="text-purple-400 font-bold">{params.b.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min={0.1}
            max={3.0}
            step={0.05}
            value={params.b}
            onChange={(e) => setParams((p) => ({ ...p, b: parseFloat(e.target.value) }))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-400"
          />
        </div>
      </div>
    </div>
  );
}
