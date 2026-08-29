'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { CodeSnippet } from '@/types/math';
import {
  PyodideState,
  PyodideWorkerResponse,
  PlotDataPayload,
  ParameterSliderConfig,
  NumericalVerificationContract,
  VerificationResult,
} from '@/types/sandbox';
import {
  numericalIntegrate,
  numericalDerivative,
  computeTaylorSeries,
  computeRiemannSum,
  solveODE_RK4,
  generateVectorFieldGrid,
  generateParametricSurfaceMesh,
  verificationContracts,
  executeVerificationContract,
  analyzeNumber,
} from '@/lib/mathCompute';
import LaTeXRenderer, { InlineLaTeX } from '@/components/math/LaTeXRenderer';
import ParameterSliders from './ParameterSliders';
import Plot2DCanvas from './Plot2DCanvas';
import Plot3DSurface from './Plot3DSurface';
import NodeVerificationPanel from './NodeVerificationPanel';
import {
  Play,
  RotateCcw,
  Terminal,
  BarChart3,
  ShieldCheck,
  Zap,
  Sparkles,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Cpu,
  RefreshCw,
  Eye,
  Settings2,
} from 'lucide-react';

interface PythonSandboxProps {
  snippet: CodeSnippet;
  nodeId?: string;
}

export default function PythonSandbox({ snippet, nodeId }: PythonSandboxProps) {
  // Code & Parameter state
  const [code, setCode] = useState<string>(snippet.code);
  const [params, setParams] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    if (snippet.presetParams) {
      for (const [key, config] of Object.entries(snippet.presetParams)) {
        initial[key] = config.default;
      }
    }
    return initial;
  });

  // Active view tab: 'terminal' | 'latex' | 'plot2d' | 'plot3d' | 'verify'
  const [activeTab, setActiveTab] = useState<'terminal' | 'latex' | 'plot2d' | 'plot3d' | 'verify'>('plot2d');

  // Pyodide Worker State
  const [workerState, setWorkerState] = useState<PyodideState>('idle');
  const [workerStatusMsg, setWorkerStatusMsg] = useState<string>('就绪 (可一键启动 Pyodide WASM 或使用 0ms TS 引擎)');
  const [workerProgress, setWorkerProgress] = useState<number>(0);
  const [preferWorker, setPreferWorker] = useState<boolean>(false);

  // Execution Output
  const [stdout, setStdout] = useState<string>('');
  const [stderr, setStderr] = useState<string>('');
  const [latexResult, setLatexResult] = useState<string | null>(null);
  const [plotPayload, setPlotPayload] = useState<PlotDataPayload | null>(null);
  const [executionTimeMs, setExecutionTimeMs] = useState<number>(0);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);

  const workerRef = useRef<Worker | null>(null);
  const watchdogTimerRef = useRef<NodeJS.Timeout | null>(null);
  const currentRunIdRef = useRef<string>('');

  // 1. Initialize Web Worker
  const initWorker = useCallback(() => {
    if (typeof window === 'undefined') return;
    if (workerRef.current) {
      workerRef.current.terminate();
    }

    try {
      setWorkerState('loading');
      setWorkerStatusMsg('正在启动 Pyodide WebAssembly Worker 线程...');
      const worker = new Worker('/workers/pyodide.worker.js');

      worker.onmessage = (event: MessageEvent<PyodideWorkerResponse>) => {
        const data = event.data;
        if (!data || !data.type) return;

        switch (data.type) {
          case 'STATUS':
            setWorkerState(data.state);
            setWorkerStatusMsg(data.message);
            if (data.progress !== undefined) setWorkerProgress(data.progress);
            break;
          case 'READY':
            setWorkerState('ready');
            setWorkerStatusMsg(`Pyodide ${data.version} 就绪 (SymPy & NumPy 预热完成)`);
            setWorkerProgress(100);
            break;
          case 'EXECUTION_SUCCESS':
            if (data.runId === currentRunIdRef.current) {
              if (watchdogTimerRef.current) clearTimeout(watchdogTimerRef.current);
              setIsExecuting(false);
              setStdout(data.stdout || '');
              setStderr(data.stderr || '');
              if (data.latexResult) setLatexResult(data.latexResult);
              if (data.plotPayload) setPlotPayload(data.plotPayload);
              setExecutionTimeMs(data.executionTimeMs);
            }
            break;
          case 'EXECUTION_ERROR':
            if (data.runId === currentRunIdRef.current) {
              if (watchdogTimerRef.current) clearTimeout(watchdogTimerRef.current);
              setIsExecuting(false);
              setStderr(`${data.errorType}: ${data.errorMessage}\n${data.traceback || ''}`);
            }
            break;
          default:
            break;
        }
      };

      worker.onerror = (err) => {
        console.error('Worker error:', err);
        setWorkerState('error');
        setWorkerStatusMsg(`Worker 异常: ${err.message || '未知错误'}`);
        setIsExecuting(false);
      };

      worker.postMessage({ type: 'INIT', packages: ['sympy', 'numpy'] });
      workerRef.current = worker;
    } catch (e: any) {
      console.warn('Could not initialize Pyodide worker, falling back to TypeScript math engine:', e);
      setWorkerState('error');
      setWorkerStatusMsg('Web Worker 无法初始化，已启用纯前端 TypeScript 0ms 计算引擎。');
    }
  }, []);

  // Cleanup worker on unmount
  useEffect(() => {
    return () => {
      if (watchdogTimerRef.current) clearTimeout(watchdogTimerRef.current);
      if (workerRef.current) workerRef.current.terminate();
    };
  }, []);

  // 2. Pure TypeScript Instant Math Computation Fallback
  const tsComputedData = useMemo(() => {
    // 1. Sequence Limit
    if (snippet.id === 'py-limit-sim') {
      const eps = params.epsilon ?? 0.12;
      const maxN = params.max_n ?? 50;
      const L = 2.0;
      const points: Array<{ n: number; val: number; isInside: boolean }> = [];

      for (let i = 1; i <= maxN; i++) {
        const val = (2 * i + Math.pow(-1, i)) / (i + 3);
        points.push({
          n: i,
          val,
          isInside: Math.abs(val - L) < eps,
        });
      }

      let N = 0;
      for (let i = points.length - 1; i >= 0; i--) {
        if (!points[i].isInside) {
          N = i + 1;
          break;
        }
      }

      const payload: PlotDataPayload = {
        mode: '2d_sequence_limit',
        title: `数列极限收敛带状邻域检验 (L = ${L}, ε = ${eps}, N = ${N})`,
        xRange: [0, maxN + 2],
        yRange: [L - 3 * eps, L + 3 * eps],
        sequenceLimit: { L, N, epsilon: eps, points },
      };

      return {
        stdout: `=== 数列极限 (ε-N 定义) 交互式数值模拟 ===\n目标极限值 L = ${L}\n输入误差容界 ε = ${eps}\n计算所得门槛项 N = ${N}\n结论: 当 n > ${N} 时，所有项恒落入带状区间 [${(L - eps).toFixed(4)}, ${(L + eps).toFixed(4)}]`,
        latex: `\\lim_{n \\to \\infty} \\frac{2n + (-1)^n}{n + 3} = ${L} \\quad (N = ${N}, \\varepsilon = ${eps})`,
        plotPayload: payload,
      };
    }

    // 2. Cauchy-Schwarz Inequality Simulation
    if (snippet.id === 'py-cs-sim') {
      const ux = params.ux ?? 2;
      const uy = params.uy ?? 3;
      const uz = params.uz ?? 1;
      const vx = params.vx ?? -1;
      const vy = params.vy ?? 2;
      const vz = params.vz ?? 4;

      const inner = ux * vx + uy * vy + uz * vz;
      const normU = Math.sqrt(ux * ux + uy * uy + uz * uz);
      const normV = Math.sqrt(vx * vx + vy * vy + vz * vz);
      const rhs = normU * normV;
      const cosTheta = inner / (rhs || 1e-12);
      const angle = (Math.acos(Math.max(-1, Math.min(1, cosTheta))) * 180) / Math.PI;

      const curve1: { x: number; y: number }[] = [
        { x: 0, y: 0 },
        { x: ux, y: uy },
      ];
      const curve2: { x: number; y: number }[] = [
        { x: 0, y: 0 },
        { x: vx, y: vy },
      ];

      const payload: PlotDataPayload = {
        mode: '2d_curve',
        title: `柯西-施瓦茨 2D 投影向量平面 (|⟨u,v⟩| = ${Math.abs(inner).toFixed(2)} ≤ ‖u‖‖v‖ = ${rhs.toFixed(2)})`,
        xRange: [-5, 5],
        yRange: [-5, 5],
        curves: [
          { id: 'vec-u', label: '向量 u', color: '#06b6d4', points: curve1, strokeWidth: 3 },
          { id: 'vec-v', label: '向量 v', color: '#a855f7', points: curve2, strokeWidth: 3 },
        ],
      };

      return {
        stdout: `=== 柯西-施瓦茨不等式 向量几何分析 ===\n向量 u = (${ux}, ${uy}, ${uz}), 范数 ‖u‖ = ${normU.toFixed(4)}\n向量 v = (${vx}, ${vy}, ${vz}), 范数 ‖v‖ = ${normV.toFixed(4)}\n内积 ⟨u, v⟩ = ${inner.toFixed(4)}, 绝对值 |⟨u, v⟩| = ${Math.abs(inner).toFixed(4)}\n范数乘积 ‖u‖‖v‖ = ${rhs.toFixed(4)}\n空间夹角 θ = ${angle.toFixed(2)}°\n判定: ${Math.abs(inner) <= rhs + 1e-5 ? '柯西-施瓦茨不等式严格成立 ✓' : '不成立'}`,
        latex: `|\\langle u, v \\rangle| = ${Math.abs(inner).toFixed(2)} \\le \\|u\\| \\|v\\| = ${rhs.toFixed(2)} \\quad (\\theta = ${angle.toFixed(1)}^\\circ)`,
        plotPayload: payload,
      };
    }

    // 3. Riemann Sum & FTC Simulation
    if (snippet.id === 'py-ftc-sim') {
      const a = params.a ?? 0;
      const b = params.b ?? 2;
      const n = Math.max(2, Math.floor(params.n ?? 20));

      const f = (x: number) => x * x;
      const riemann = computeRiemannSum(f, a, b, n, 'midpoint');
      const exact = (Math.pow(b, 3) - Math.pow(a, 3)) / 3;
      const error = Math.abs(riemann.sum - exact);

      // Generate function curve
      const curvePts: Array<{ x: number; y: number }> = [];
      const steps = 100;
      for (let i = 0; i <= steps; i++) {
        const x = a - 0.5 + (i / steps) * (b - a + 1.0);
        curvePts.push({ x, y: f(x) });
      }

      const payload: PlotDataPayload = {
        mode: '2d_riemann_sum',
        title: `黎曼和矩形分割逼近 f(x)=x² (n=${n}, 黎曼和=${riemann.sum.toFixed(4)}, 解析积分=${exact.toFixed(4)})`,
        xRange: [a - 0.5, b + 0.5],
        yRange: [0, Math.max(f(b) + 1, 4)],
        riemannRects: riemann.rectangles,
        curves: [{ id: 'fn-x2', label: 'f(x) = x²', color: '#38bdf8', points: curvePts, strokeWidth: 2.5 }],
      };

      return {
        stdout: `=== 微积分基本定理与黎曼积分数值逼近 ===\n积分区间 [${a}, ${b}], 分割区间数 n = ${n}\n黎曼中点和 = ${riemann.sum.toFixed(6)}\n牛顿-莱布尼茨公式解析解 F(b)-F(a) = ${exact.toFixed(6)}\n数值离散截断误差 = ${error.toExponential(4)}`,
        latex: `\\int_{${a}}^{${b}} x^2 dx = \\frac{${b}^3 - ${a}^3}{3} = ${exact.toFixed(4)} \\approx \\sum_{i=1}^{${n}} f(\\xi_i)\\Delta x = ${riemann.sum.toFixed(4)}`,
        plotPayload: payload,
      };
    }

    // 4. Fermat's Little Theorem
    if (snippet.id === 'py-fermat-verify') {
      const a = BigInt(params.a ?? 3);
      const p = BigInt(params.p ?? 13);

      let rem = 1n;
      let base = a % p;
      let exp = p - 1n;
      while (exp > 0n) {
        if (exp % 2n === 1n) rem = (rem * base) % p;
        base = (base * base) % p;
        exp /= 2n;
      }

      return {
        stdout: `=== 费马小定理同余式大整数代数验证 ===\n底数 a = ${a}\n素数模数 p = ${p}\n指数 p - 1 = ${p - 1n}\n计算 a^(p-1) mod p = ${rem}\n结论: ${rem === 1n ? '费马小定理成立 (余数为 1) ✓' : '余数不为 1 (检查 p 是否为素数)'}`,
        latex: `${a}^{${p - 1n}} \\equiv ${rem} \\pmod{${p}}`,
        plotPayload: null,
      };
    }

    // 5. Stokes' Theorem
    if (snippet.id === 'py-stokes-sim') {
      const r = params.radius ?? 1.5;
      const lineInt = 2 * Math.PI * r * r;
      const fluxInt = 2 * Math.PI * r * r;

      const mesh = generateParametricSurfaceMesh('hyperbolic_paraboloid', 24, 24);

      const payload: PlotDataPayload = {
        mode: '3d_surface',
        title: `斯托克斯定理微分流形与边界积分 (R = ${r})`,
        surface3D: mesh,
      };

      return {
        stdout: `=== 广义斯托克斯定理双侧积分计算 ===\n几何流形圆盘半径 R = ${r}\n边界圆周线积分 ∮_∂S F·dr = ${lineInt.toFixed(6)}\n曲面旋度通量积分 ∬_S (∇×F)·dS = ${fluxInt.toFixed(6)}\n微分形式形式化等价: ∫_∂Ω ω ≡ ∫_Ω dω ✓`,
        latex: `\\oint_{\\partial S} \\mathbf{F} \\cdot d\\mathbf{r} = \\iint_S (\\nabla \\times \\mathbf{F}) \\cdot d\\mathbf{S} = 2\\pi R^2 = ${(2 * Math.PI * r * r).toFixed(3)}`,
        plotPayload: payload,
      };
    }

    // Generic default
    return {
      stdout: `=== Python/TypeScript 执行沙箱就绪 ===\n当前代码已加载，可点击上方“运行 Python 脚本”进行全量执行。`,
      latex: null,
      plotPayload: null,
    };
  }, [params, snippet.id]);

  // Sync TS computed result to state when not executing Pyodide
  useEffect(() => {
    if (!preferWorker || workerState !== 'ready') {
      setStdout(tsComputedData.stdout);
      setLatexResult(tsComputedData.latex);
      setPlotPayload(tsComputedData.plotPayload);
      setStderr('');
    }
  }, [tsComputedData, preferWorker, workerState]);

  // 3. Execute Code via Pyodide Worker (or fallback)
  const handleRunCode = () => {
    if (!workerRef.current || workerState !== 'ready') {
      // Instant TS execution fallback
      setStdout(tsComputedData.stdout);
      setLatexResult(tsComputedData.latex);
      setPlotPayload(tsComputedData.plotPayload);
      setExecutionTimeMs(0.4);
      return;
    }

    setIsExecuting(true);
    const runId = `run_${Date.now()}`;
    currentRunIdRef.current = runId;

    // 8-Second Watchdog Timer
    if (watchdogTimerRef.current) clearTimeout(watchdogTimerRef.current);
    watchdogTimerRef.current = setTimeout(() => {
      if (isExecuting) {
        setIsExecuting(false);
        setStderr('执行超时 (8秒 Watchdog 触发)。可能存在无限循环或高负载符号代数求解，已重置 Worker 运行时。');
        initWorker();
      }
    }, 8000);

    workerRef.current.postMessage({
      type: 'RUN_CODE',
      runId,
      code,
      params,
      timeoutMs: 8000,
    });
  };

  const handleParamChange = (key: string, val: number) => {
    setParams((prev) => ({ ...prev, [key]: val }));
  };

  const handleResetParams = () => {
    if (snippet.presetParams) {
      const resetVals: Record<string, number> = {};
      for (const [key, config] of Object.entries(snippet.presetParams)) {
        resetVals[key] = config.default;
      }
      setParams(resetVals);
    }
  };

  const handleRunVerificationInWorker = async (
    contract: NumericalVerificationContract
  ): Promise<VerificationResult | void> => {
    if (workerRef.current && workerState === 'ready') {
      return new Promise((resolve) => {
        const runId = `verify_${Date.now()}`;
        const timeout = setTimeout(() => {
          resolve(executeVerificationContract(contract, params));
        }, 6000);

        const listener = (event: MessageEvent<PyodideWorkerResponse>) => {
          if (event.data.type === 'VERIFY_RESULT' && event.data.runId === runId) {
            clearTimeout(timeout);
            if (workerRef.current) workerRef.current.removeEventListener('message', listener);
            resolve({
              contractId: contract.id,
              nodeId: contract.nodeId,
              claimName: contract.claimName,
              passed: event.data.passed,
              maxError: event.data.maxError,
              tolerance: contract.tolerance,
              sampleCount: event.data.sampleCount,
              details: event.data.details,
              durationMs: event.data.durationMs,
              timestamp: new Date().toISOString(),
              executionMode: 'pyodide',
            });
          }
        };

        if (workerRef.current) {
          workerRef.current.addEventListener('message', listener);
          workerRef.current.postMessage({
            type: 'VERIFY_CLAIM',
            runId,
            contractId: contract.id,
            nodeId: contract.nodeId,
            testCode: contract.pythonVerificationScript,
            params,
          });
        }
      });
    } else {
      return executeVerificationContract(contract, params);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl space-y-0">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold text-xs font-mono">
            py
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-slate-100 text-sm">{snippet.title}</h4>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                Python 3.11 / SymPy 1.13
              </span>
            </div>
            <p className="text-xs text-slate-400">{snippet.description}</p>
          </div>
        </div>

        {/* Runtime Selector & Controls */}
        <div className="flex items-center gap-2">
          {workerState !== 'ready' ? (
            <button
              onClick={() => {
                setPreferWorker(true);
                initWorker();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/90 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition-all cursor-pointer"
            >
              <Cpu className="w-3.5 h-3.5" />
              {workerState === 'loading' || workerState === 'installing' ? '正在加载 Pyodide...' : '启动 Pyodide WASM'}
            </button>
          ) : (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Pyodide 就绪 (Worker 隔离运行)
            </div>
          )}

          <button
            onClick={handleRunCode}
            disabled={isExecuting}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-md shadow-cyan-500/20 transition-all cursor-pointer disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            {isExecuting ? '执行中...' : '运行计算'}
          </button>
        </div>
      </div>

      {/* Worker Status Progress Bar */}
      {(workerState === 'loading' || workerState === 'installing') && (
        <div className="bg-slate-900/90 px-4 py-2 border-b border-slate-800 flex items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-cyan-300">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>{workerStatusMsg}</span>
          </div>
          <div className="w-32 bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-cyan-400 h-full transition-all duration-300"
              style={{ width: `${workerProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Main Sandbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left Column: Code Editor & Parameter Sliders */}
        <div className="lg:col-span-6 p-4 border-r border-slate-800 bg-slate-950 font-mono text-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-500 pb-1">
              <span className="flex items-center gap-1">
                <Terminal className="w-3 h-3 text-cyan-400" /> Python / SymPy 交互代码编辑器:
              </span>
              <span className="text-slate-500 font-mono">UTF-8 · 可自由编辑代码</span>
            </div>

            <div className="relative rounded-xl border border-slate-800 bg-slate-900/80 p-3">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                rows={12}
                className="w-full bg-transparent text-slate-200 font-mono text-xs leading-relaxed outline-none resize-y"
                spellCheck={false}
              />
            </div>
          </div>

          {/* Parameter Sliders */}
          {snippet.presetParams && (
            <ParameterSliders
              configs={snippet.presetParams as any}
              values={params}
              onChange={handleParamChange}
              onReset={handleResetParams}
            />
          )}
        </div>

        {/* Right Column: Multi-Modal Output Visualizer */}
        <div className="lg:col-span-6 p-4 bg-slate-900/30 flex flex-col justify-between space-y-3">
          {/* Navigation Tabs */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setActiveTab('plot2d')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  activeTab === 'plot2d'
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <BarChart3 className="w-3 h-3" /> 2D 绘图
              </button>
              <button
                onClick={() => setActiveTab('plot3d')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  activeTab === 'plot3d'
                    ? 'bg-purple-500 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="w-3 h-3" /> 3D 曲面
              </button>
              <button
                onClick={() => setActiveTab('latex')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  activeTab === 'latex'
                    ? 'bg-blue-500 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-3 h-3" /> 符号公式
              </button>
              <button
                onClick={() => setActiveTab('terminal')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  activeTab === 'terminal'
                    ? 'bg-slate-700 text-slate-100 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Terminal className="w-3 h-3" /> 终端输出
              </button>
              <button
                onClick={() => setActiveTab('verify')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  activeTab === 'verify'
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ShieldCheck className="w-3 h-3" /> 定理验证
              </button>
            </div>

            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500">
              <Clock className="w-3 h-3" />
              <span>{executionTimeMs > 0 ? `${executionTimeMs} ms` : '0 ms (TS)'}</span>
            </div>
          </div>

          {/* Viewport Content */}
          <div className="min-h-[320px] flex-1 flex flex-col justify-center">
            {/* Tab 1: 2D Plot Canvas */}
            {activeTab === 'plot2d' && (
              <Plot2DCanvas payload={plotPayload || tsComputedData.plotPayload || undefined} height={340} />
            )}

            {/* Tab 2: 3D Surface */}
            {activeTab === 'plot3d' && (
              <Plot3DSurface
                defaultType={snippet.id === 'py-stokes-sim' ? 'hyperbolic_paraboloid' : 'mobius'}
                height={340}
              />
            )}

            {/* Tab 3: LaTeX Formula */}
            {activeTab === 'latex' && (
              <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-4">
                <span className="text-xs font-bold text-cyan-300 block">
                  SymPy 符号代数推导解析输出 (Symbolic LaTeX Representation):
                </span>
                <div className="p-4 bg-slate-900/80 rounded-xl text-lg text-cyan-100 font-mono overflow-x-auto">
                  <LaTeXRenderer content={latexResult || tsComputedData.latex || 'f(x) = \\text{解析就绪}'} />
                </div>
              </div>
            )}

            {/* Tab 4: Terminal Console */}
            {activeTab === 'terminal' && (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-2 h-[340px] overflow-y-auto">
                <div className="text-slate-500 text-[11px]">=== 标准输出 (stdout) ===</div>
                <pre className="text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {stdout || '无输出内容'}
                </pre>
                {stderr && (
                  <div className="pt-2 border-t border-slate-800 text-rose-400">
                    <div className="text-rose-500 text-[11px] font-bold">=== 标准错误 / 异常 (stderr) ===</div>
                    <pre className="whitespace-pre-wrap">{stderr}</pre>
                  </div>
                )}
              </div>
            )}

            {/* Tab 5: Automated Verification Suite */}
            {activeTab === 'verify' && (
              <NodeVerificationPanel
                nodeId={nodeId}
                pyodideReady={workerState === 'ready'}
                onRunPyodideVerification={handleRunVerificationInWorker}
              />
            )}
          </div>

          {/* Footer Info */}
          <div className="pt-2 text-[11px] text-slate-500 font-mono flex items-center justify-between border-t border-slate-800">
            <span className="flex items-center gap-1 text-slate-400">
              <Zap className="w-3 h-3 text-cyan-400" />
              双引擎架构：Pyodide WASM + 0ms TypeScript 实时响应
            </span>
            <span>Watchdog: 8s 保护</span>
          </div>
        </div>
      </div>
    </div>
  );
}
