'use client';

import React, { useState, useMemo } from 'react';
import {
  numericalIntegrate,
  numericalDerivative,
  computeTaylorSeries,
  computeFourierSeries,
  analyzeMatrix,
  gramSchmidt,
  solveODE_RK4,
  generateVectorFieldGrid,
  analyzeNumber,
} from '@/lib/mathCompute';
import { PlotDataPayload } from '@/types/sandbox';
import LaTeXRenderer, { InlineLaTeX } from '@/components/math/LaTeXRenderer';
import Plot2DCanvas from './Plot2DCanvas';
import Plot3DSurface from './Plot3DSurface';
import NodeVerificationPanel from './NodeVerificationPanel';
import { useLanguage } from '@/context/LanguageContext';
import {
  Calculator,
  Activity,
  Grid,
  Hash,
  Sliders,
  Sparkles,
  Layers,
  Cpu,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export default function MathComputeEngine() {
  const { isZh } = useLanguage();
  const [activeTab, setActiveTab] = useState<'calculus' | 'matrix' | 'ode' | 'number' | 'verification'>('calculus');

  // Calculus State
  const [funcChoice, setFuncChoice] = useState<'sin' | 'cos' | 'exp' | 'geom' | 'poly'>('sin');
  const [x0, setX0] = useState(0);
  const [taylorOrder, setTaylorOrder] = useState(5);
  const [evalX, setEvalX] = useState(1.0);
  const [fourierType, setFourierType] = useState<'square' | 'triangle' | 'sawtooth'>('square');
  const [fourierHarmonics, setFourierHarmonics] = useState(5);
  const [calcMode, setCalcMode] = useState<'taylor' | 'fourier'>('taylor');

  // Matrix State
  const [matrixSize, setMatrixSize] = useState<2 | 3>(2);
  const [m2x2, setM2x2] = useState<number[][]>([
    [3, 1],
    [2, 2],
  ]);
  const [m3x3, setM3x3] = useState<number[][]>([
    [1, 2, 0],
    [0, 3, 1],
    [2, 0, 1],
  ]);

  // ODE State
  const [odeSystem, setOdeSystem] = useState<'lorenz' | 'lotka_volterra' | 'van_der_pol' | 'pendulum'>('lotka_volterra');
  const [odeParam1, setOdeParam1] = useState(1.1);
  const [odeParam2, setOdeParam2] = useState(0.4);

  // Number Theory State
  const [inputNumber, setInputNumber] = useState(360);

  // 1. Calculus Evaluation
  const selectedFunc = useMemo(() => {
    switch (funcChoice) {
      case 'sin':
        return { fn: Math.sin, latex: 'f(x) = \\sin(x)', name: isZh ? '正弦函数 sin(x)' : 'Sine sin(x)' };
      case 'cos':
        return { fn: Math.cos, latex: 'f(x) = \\cos(x)', name: isZh ? '余弦函数 cos(x)' : 'Cosine cos(x)' };
      case 'exp':
        return { fn: Math.exp, latex: 'f(x) = e^x', name: isZh ? '指数函数 e^x' : 'Exponential e^x' };
      case 'geom':
        return { fn: (x: number) => 1 / (1 - x), latex: 'f(x) = \\frac{1}{1-x}', name: isZh ? '几何级数母函数 1/(1-x)' : 'Geometric generating function 1/(1-x)' };
      case 'poly':
        return { fn: (x: number) => x ** 3 - 3 * x + 1, latex: 'f(x) = x^3 - 3x + 1', name: isZh ? '三次多项式 x³ - 3x + 1' : 'Cubic polynomial x³ - 3x + 1' };
    }
  }, [funcChoice, isZh]);

  const taylorTerms = useMemo(() => {
    return computeTaylorSeries(selectedFunc.fn, x0, taylorOrder);
  }, [selectedFunc, x0, taylorOrder]);

  const derivValue = useMemo(() => {
    return numericalDerivative(selectedFunc.fn, evalX);
  }, [selectedFunc, evalX]);

  const integralValue = useMemo(() => {
    return numericalIntegrate(selectedFunc.fn, 0, evalX);
  }, [selectedFunc, evalX]);

  // Calculus 2D Plot Payload
  const calculusPlotPayload: PlotDataPayload = useMemo(() => {
    if (calcMode === 'fourier') {
      const fourierPts = computeFourierSeries(fourierType, fourierHarmonics, [-Math.PI, Math.PI], 200);
      return {
        mode: '2d_curve',
        title: isZh
          ? `傅里叶级数谐波叠加 (${fourierType}, 阶数 N = ${fourierHarmonics})`
          : `Fourier series harmonic superposition (${fourierType}, order N = ${fourierHarmonics})`,
        xRange: [-Math.PI - 0.2, Math.PI + 0.2],
        yRange: [-2, 2],
        curves: [{ id: 'fourier', label: `Fourier N=${fourierHarmonics}`, color: '#a855f7', points: fourierPts, strokeWidth: 2.5 }],
      };
    }

    // Taylor vs Target curve
    const targetPts: Array<{ x: number; y: number }> = [];
    const taylorPts: Array<{ x: number; y: number }> = [];
    const steps = 120;
    const xMin = x0 - 3;
    const xMax = x0 + 3;

    for (let i = 0; i <= steps; i++) {
      const x = xMin + (i / steps) * (xMax - xMin);
      targetPts.push({ x, y: selectedFunc.fn(x) });

      let tVal = 0;
      taylorTerms.forEach((t) => {
        tVal += t.coef * Math.pow(x - x0, t.order);
      });
      taylorPts.push({ x, y: tVal });
    }

    return {
      mode: '2d_taylor_comparison',
      title: isZh
        ? `泰勒多项式逼近对比: ${selectedFunc.name} (展开中心 x₀ = ${x0}, 阶数 N = ${taylorOrder})`
        : `Taylor polynomial approximation: ${selectedFunc.name} (center x₀ = ${x0}, order N = ${taylorOrder})`,
      xRange: [xMin, xMax],
      yRange: [-4, 4],
      curves: [
        { id: 'target', label: selectedFunc.name, color: '#38bdf8', points: targetPts, strokeWidth: 2 },
        { id: 'taylor', label: `T_${taylorOrder}(x)`, color: '#f59e0b', points: taylorPts, strokeWidth: 2, dashPattern: [4, 4] },
      ],
    };
  }, [calcMode, fourierType, fourierHarmonics, isZh, selectedFunc, x0, taylorOrder, taylorTerms]);

  // 2. Matrix Analysis
  const activeMatrix = matrixSize === 2 ? m2x2 : m3x3;
  const matrixAnalysis = useMemo(() => {
    try {
      return analyzeMatrix(activeMatrix);
    } catch {
      return null;
    }
  }, [activeMatrix]);

  const gramSchmidtResult = useMemo(() => {
    return gramSchmidt(activeMatrix);
  }, [activeMatrix]);

  // 3. ODE Simulation & Vector Field
  const odeResult = useMemo(() => {
    if (odeSystem === 'lorenz') {
      return solveODE_RK4({
        system: 'lorenz',
        params: { sigma: 10, rho: odeParam1 * 25, beta: odeParam2 * 3 },
        initialState: [0.1, 0.0, 0.0],
        tSpan: [0, 30],
        dt: 0.015,
      });
    } else if (odeSystem === 'lotka_volterra') {
      return solveODE_RK4({
        system: 'lotka_volterra',
        params: { alpha: odeParam1, beta: odeParam2, delta: 0.1, gamma: 0.4 },
        initialState: [10, 5, 0],
        tSpan: [0, 40],
        dt: 0.05,
      });
    } else if (odeSystem === 'van_der_pol') {
      return solveODE_RK4({
        system: 'van_der_pol',
        params: { mu: odeParam1 * 2 },
        initialState: [0.5, 0.0, 0],
        tSpan: [0, 30],
        dt: 0.04,
      });
    } else {
      return solveODE_RK4({
        system: 'pendulum',
        params: { g: 9.81, L: odeParam1, damp: odeParam2 },
        initialState: [1.0, 0.0, 0],
        tSpan: [0, 20],
        dt: 0.02,
      });
    }
  }, [odeSystem, odeParam1, odeParam2]);

  const odePlotPayload: PlotDataPayload = useMemo(() => {
    const trajPts = odeResult.trajectory.map(([x, y]) => ({ x, y }));
    const fX = (x: number, y: number) => {
      if (odeSystem === 'lotka_volterra') return odeParam1 * x - odeParam2 * x * y;
      if (odeSystem === 'van_der_pol') return y;
      return y;
    };
    const fY = (x: number, y: number) => {
      if (odeSystem === 'lotka_volterra') return 0.1 * x * y - 0.4 * y;
      if (odeSystem === 'van_der_pol') return odeParam1 * 2 * (1 - x * x) * y - x;
      return -(9.81 / odeParam1) * Math.sin(x) - odeParam2 * y;
    };

    const arrows = generateVectorFieldGrid(fX, fY, [-4, 12], [-4, 12], 12);

    return {
      mode: '2d_vector_field',
      title: isZh ? `RK4 相平面轨迹与向量场 (${odeSystem})` : `RK4 phase-plane trajectory & vector field (${odeSystem})`,
      xRange: [-2, 14],
      yRange: [-2, 12],
      vectorField: { grid: arrows },
      curves: [{ id: 'traj', label: isZh ? '相轨迹' : 'Phase trajectory', color: '#06b6d4', points: trajPts, strokeWidth: 2 }],
    };
  }, [isZh, odeResult, odeSystem, odeParam1, odeParam2]);

  // 4. Number Theory Analysis
  const numberAnalysis = useMemo(() => {
    return analyzeNumber(inputNumber);
  }, [inputNumber]);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-6 shadow-2xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-sm">
              {isZh ? '纯客户端数学计算与符号算法引擎 (Client-Side Math Compute Lab)' : 'Client-Side Math Compute & Symbolic Algorithm Lab'}
            </h3>
            <p className="text-xs text-slate-400">
              {isZh ? '0ms 本地高精度执行：高阶泰勒级数展开、矩阵特征值谱分析、RK4 相空间动力系统与数论轨道' : '0ms local high-precision execution: Taylor expansions, matrix eigenvalue spectra, RK4 dynamical systems and number-theory orbits'}
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 flex-wrap">
          <button
            onClick={() => setActiveTab('calculus')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'calculus'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>{isZh ? '微积分与级数' : 'Calculus & Series'}</span>
          </button>
          <button
            onClick={() => setActiveTab('matrix')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'matrix'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>{isZh ? '矩阵与正交化' : 'Matrix & Orthogonalization'}</span>
          </button>
          <button
            onClick={() => setActiveTab('ode')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'ode'
                ? 'bg-purple-500 text-white shadow-md shadow-purple-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>{isZh ? 'RK4 动力系统' : 'RK4 Dynamical Systems'}</span>
          </button>
          <button
            onClick={() => setActiveTab('number')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'number'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Hash className="w-3.5 h-3.5" />
            <span>{isZh ? '数论分析' : 'Number Theory'}</span>
          </button>
          <button
            onClick={() => setActiveTab('verification')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'verification'
                ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isZh ? '定理自动化验证' : 'Automated Verification'}</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Calculus */}
      {activeTab === 'calculus' && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 pb-2">
            <button
              onClick={() => setCalcMode('taylor')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                calcMode === 'taylor' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 text-slate-400'
              }`}
            >
              {isZh ? '泰勒多项式展开 (Taylor Series)' : 'Taylor Series'}
            </button>
            <button
              onClick={() => setCalcMode('fourier')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                calcMode === 'fourier' ? 'bg-purple-500 text-white' : 'bg-slate-900 text-slate-400'
              }`}
            >
              {isZh ? '傅里叶级数谐波合成 (Fourier Synthesis)' : 'Fourier Synthesis'}
            </button>
          </div>

          {calcMode === 'taylor' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                  <div>
                    <label className="text-slate-400 font-medium block mb-1.5">{isZh ? '选择目标函数：' : 'Target function:'}</label>
                    <select
                      value={funcChoice}
                      onChange={(e) => setFuncChoice(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-lg p-2 outline-none font-medium cursor-pointer"
                    >
                      <option value="sin">{isZh ? '正弦函数 sin(x)' : 'Sine sin(x)'}</option>
                      <option value="cos">{isZh ? '余弦函数 cos(x)' : 'Cosine cos(x)'}</option>
                      <option value="exp">{isZh ? '指数函数 e^x' : 'Exponential e^x'}</option>
                      <option value="geom">{isZh ? '母函数 1/(1-x)' : 'Generating fn 1/(1-x)'}</option>
                      <option value="poly">{isZh ? '多项式 x³ - 3x + 1' : 'Polynomial x³ - 3x + 1'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-400 font-medium block mb-1.5">{isZh ? `展开中心 x₀ = ${x0}：` : `Expansion center x₀ = ${x0}:`}</label>
                    <input
                      type="range"
                      min={-2}
                      max={2}
                      step={0.5}
                      value={x0}
                      onChange={(e) => setX0(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 font-medium block mb-1.5">{isZh ? `泰勒阶数 N = ${taylorOrder}：` : `Taylor order N = ${taylorOrder}:`}</label>
                    <input
                      type="range"
                      min={1}
                      max={8}
                      step={1}
                      value={taylorOrder}
                      onChange={(e) => setTaylorOrder(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-cyan-500/30 space-y-3">
                  <span className="text-xs font-bold text-cyan-300">
                    {isZh ? '泰勒多项式公式展开:' : 'Taylor polynomial expansion:'}
                  </span>
                  <div className="p-3 bg-slate-950 rounded-lg text-sm text-cyan-200 font-mono overflow-x-auto">
                    <InlineLaTeX
                      formula={`T_{${taylorOrder}}(x) = ${taylorTerms.map((t) => t.latexTerm).filter(Boolean).join(' ') || '0'}`}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                      <span className="text-slate-400 block mb-1">{isZh ? `五点中心差分导数 f'(${evalX}):` : `Five-point central-difference derivative f'(${evalX}):`}</span>
                      <span className="text-emerald-400 font-mono font-bold text-base">{derivValue.toFixed(6)}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                      <span className="text-slate-400 block mb-1">{isZh ? `辛普森积分 ∫₀^${evalX} f(x)dx:` : `Simpson integral ∫₀^${evalX} f(x)dx:`}</span>
                      <span className="text-purple-400 font-mono font-bold text-base">{integralValue.value.toFixed(6)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6">
                <Plot2DCanvas payload={calculusPlotPayload} height={320} />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-6 space-y-4">
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3 text-xs">
                  <label className="text-slate-400 font-medium block">{isZh ? '波形类型:' : 'Waveform:'}</label>
                  <div className="flex gap-2">
                    {['square', 'triangle', 'sawtooth'].map((t) => (
                      <button
                        key={t}
                        onClick={() => setFourierType(t as any)}
                        className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer ${
                          fourierType === t ? 'bg-purple-500 text-white' : 'bg-slate-950 text-slate-400'
                        }`}
                      >
                        {isZh
                          ? (t === 'square' ? '方波 (Square)' : t === 'triangle' ? '三角波 (Triangle)' : '锯齿波 (Sawtooth)')
                          : (t === 'square' ? 'Square' : t === 'triangle' ? 'Triangle' : 'Sawtooth')}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-1 pt-2">
                    <div className="flex justify-between text-slate-300 font-mono">
                      <span>{isZh ? '谐波级数 N:' : 'Harmonics N:'}</span>
                      <span className="text-purple-300 font-bold">{fourierHarmonics}</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={25}
                      step={1}
                      value={fourierHarmonics}
                      onChange={(e) => setFourierHarmonics(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-400"
                    />
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6">
                <Plot2DCanvas payload={calculusPlotPayload} height={320} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Matrix */}
      {activeTab === 'matrix' && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-medium">{isZh ? '矩阵阶数:' : 'Matrix size:'}</span>
            <button
              onClick={() => setMatrixSize(2)}
              className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                matrixSize === 2 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 text-slate-400'
              }`}
            >
              2 × 2
            </button>
            <button
              onClick={() => setMatrixSize(3)}
              className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                matrixSize === 3 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 text-slate-400'
              }`}
            >
              3 × 3
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center gap-8">
            <div className="space-y-2">
              <span className="text-xs text-slate-400 font-medium block">{isZh ? '输入矩阵 A:' : 'Input matrix A:'}</span>
              <div className={`grid gap-2 ${matrixSize === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                {activeMatrix.map((row, r) =>
                  row.map((val, c) => (
                    <input
                      key={`${r}-${c}`}
                      type="number"
                      value={val}
                      onChange={(e) => {
                        const nextVal = parseFloat(e.target.value) || 0;
                        if (matrixSize === 2) {
                          const next = m2x2.map((rw) => [...rw]);
                          next[r][c] = nextVal;
                          setM2x2(next);
                        } else {
                          const next = m3x3.map((rw) => [...rw]);
                          next[r][c] = nextVal;
                          setM3x3(next);
                        }
                      }}
                      className="w-16 h-12 bg-slate-950 border border-slate-700 rounded-lg text-center text-slate-200 font-mono font-bold text-sm focus:border-emerald-500 outline-none"
                    />
                  ))
                )}
              </div>
            </div>

            {matrixAnalysis && (
              <div className="flex-1 space-y-3 text-xs">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono">
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">{isZh ? '行列式 det(A)' : 'Determinant det(A)'}</span>
                    <span className="text-emerald-400 font-bold text-base">
                      {matrixAnalysis.determinant.toFixed(4)}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">{isZh ? '矩阵迹 tr(A)' : 'Trace tr(A)'}</span>
                    <span className="text-cyan-400 font-bold text-base">{matrixAnalysis.trace.toFixed(4)}</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">{isZh ? '矩阵秩 rank(A)' : 'Matrix rank (A)'}</span>
                    <span className="text-purple-400 font-bold text-base">{matrixAnalysis.rank}</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                  <span className="text-slate-400 font-semibold block text-[11px]">{isZh ? '特征值谱 (Eigenvalues λ):' : 'Eigenvalue spectrum (λ):'}</span>
                  <div className="flex flex-wrap gap-2 text-xs font-mono text-emerald-300">
                    {matrixAnalysis.eigenvalues.map((ev, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                        λ_{i + 1} = {ev.real.toFixed(3)}
                        {ev.imag !== 0 ? ` ${ev.imag > 0 ? '+' : '-'} ${Math.abs(ev.imag).toFixed(3)}i` : ''}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: ODE */}
      {activeTab === 'ode' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setOdeSystem('lotka_volterra')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                  odeSystem === 'lotka_volterra' ? 'bg-purple-500 text-white' : 'bg-slate-900 text-slate-400'
                }`}
              >
                {isZh ? 'Lotka-Volterra 捕食者-猎物' : 'Lotka-Volterra predator–prey'}
              </button>
              <button
                onClick={() => setOdeSystem('lorenz')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                  odeSystem === 'lorenz' ? 'bg-purple-500 text-white' : 'bg-slate-900 text-slate-400'
                }`}
              >
                {isZh ? 'Lorenz 3D 混沌吸引子' : 'Lorenz 3D chaotic attractor'}
              </button>
              <button
                onClick={() => setOdeSystem('van_der_pol')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                  odeSystem === 'van_der_pol' ? 'bg-purple-500 text-white' : 'bg-slate-900 text-slate-400'
                }`}
              >
                {isZh ? 'Van der Pol 极限环' : 'Van der Pol limit cycle'}
              </button>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="text-slate-400">{isZh ? '参数 α / σ:' : 'Parameter α / σ:'}</span>
              <input
                type="range"
                min={0.2}
                max={2.5}
                step={0.1}
                value={odeParam1}
                onChange={(e) => setOdeParam1(parseFloat(e.target.value))}
                className="w-24 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-400"
              />
              <span className="text-purple-300 font-bold">{odeParam1.toFixed(1)}</span>
            </div>
          </div>

          {odeSystem === 'lorenz' ? (
            <Plot3DSurface defaultType="lorenz_attractor" height={360} />
          ) : (
            <Plot2DCanvas payload={odePlotPayload} height={360} />
          )}
        </div>
      )}

      {/* Tab 4: Number Theory */}
      {activeTab === 'number' && (
        <div className="space-y-6">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
            <span className="text-slate-300 font-medium">{isZh ? '输入正整数 n:' : 'Positive integer n:'}</span>
            <input
              type="number"
              value={inputNumber}
              onChange={(e) => setInputNumber(parseInt(e.target.value) || 1)}
              className="w-32 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-100 font-mono font-bold outline-none"
            />
            <span className="text-slate-500 font-mono">
              {numberAnalysis.isPrime ? (isZh ? '🟢 质数 (Prime)' : '🟢 Prime') : (isZh ? '🟠 合数 (Composite)' : '🟠 Composite')}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 block">{isZh ? '质因数分解 (Prime Factorization)' : 'Prime Factorization'}</span>
              <span className="text-amber-400 font-bold text-base">
                {numberAnalysis.factors.map((f) => `${f.prime}^${f.power}`).join(' × ') || '1'}
              </span>
            </div>
            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 block">{isZh ? '欧拉函数 φ(n)' : "Euler's totient φ(n)"}</span>
              <span className="text-cyan-400 font-bold text-base">{numberAnalysis.eulerTotient}</span>
            </div>
            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 block">{isZh ? 'Collatz 3n+1 停机步数' : 'Collatz 3n+1 stopping steps'}</span>
              <span className="text-purple-400 font-bold text-base">{numberAnalysis.collatzSteps}{isZh ? ' 步到达 1' : ' steps to reach 1'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Automated Verification Suite */}
      {activeTab === 'verification' && (
        <NodeVerificationPanel />
      )}
    </div>
  );
}
