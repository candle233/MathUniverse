'use client';

import React, { useState } from 'react';
import { NumericalVerificationContract, VerificationResult } from '../../types/sandbox.ts';
import {
  verificationContracts,
  executeVerificationContract,
  getVerificationContractsForNode,
} from '../../lib/mathCompute.ts';
import { ShieldCheck, Play, CheckCircle2, XCircle, Clock, Zap, Cpu, Sparkles, Terminal } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface NodeVerificationPanelProps {
  nodeId?: string;
  onRunPyodideVerification?: (contract: NumericalVerificationContract) => Promise<VerificationResult | void>;
  pyodideReady?: boolean;
  className?: string;
}

export default function NodeVerificationPanel({
  nodeId,
  onRunPyodideVerification,
  pyodideReady = false,
  className = '',
}: NodeVerificationPanelProps) {
  const { isZh } = useLanguage();
  const contracts = nodeId ? getVerificationContractsForNode(nodeId) : verificationContracts;
  const [results, setResults] = useState<Record<string, VerificationResult>>({});
  const [runningContractId, setRunningContractId] = useState<string | null>(null);
  const [executionMode, setExecutionMode] = useState<'typescript' | 'pyodide'>('typescript');

  const handleRunVerification = async (contract: NumericalVerificationContract) => {
    setRunningContractId(contract.id);

    try {
      if (executionMode === 'pyodide' && onRunPyodideVerification && pyodideReady) {
        const pyResult = await onRunPyodideVerification(contract);
        if (pyResult) {
          setResults((prev) => ({ ...prev, [contract.id]: pyResult }));
        }
      } else {
        // Run TypeScript 0ms native verification
        const tsResult = executeVerificationContract(contract, {}, isZh ? 'zh' : 'en');
        setResults((prev) => ({ ...prev, [contract.id]: tsResult }));
      }
    } catch (err) {
      console.error('Verification error:', err);
    } finally {
      setRunningContractId(null);
    }
  };

  const handleRunAll = async () => {
    for (const contract of contracts) {
      await handleRunVerification(contract);
    }
  };

  return (
    <div className={`rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-4 ${className}`}>
      {/* Panel Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-200 text-sm">
              {isZh ? '命题形式化与数值自动化验证套件 (Automated Verification Suite)' : 'Automated Verification Suite (formal & numerical)'}
            </h4>
            <p className="text-xs text-slate-400">
              {isZh ? '多模态验证体系：高维蒙特卡洛抽样、微积分数值误差界、同余式大整数代数检验' : 'Multi-modal verification: high-dimensional Monte-Carlo sampling, numerical calculus error bounds, and big-integer congruence checks'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode toggle */}
          <div className="flex items-center bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setExecutionMode('typescript')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors cursor-pointer ${
                executionMode === 'typescript'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="w-3 h-3" /> TS (0ms)
            </button>
            <button
              onClick={() => setExecutionMode('pyodide')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors cursor-pointer ${
                executionMode === 'pyodide'
                  ? 'bg-blue-500 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Terminal className="w-3 h-3" /> Pyodide / SymPy
            </button>
          </div>

          <button
            onClick={handleRunAll}
            disabled={runningContractId !== null}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5" /> {isZh ? '运行全量验证' : 'Run all checks'}
          </button>
        </div>
      </div>

      {/* Contract List */}
      <div className="space-y-3">
        {contracts.length === 0 ? (
          <div className="p-6 text-center text-slate-500 text-xs font-mono">
            {isZh ? '当前节点未挂载数值验证契约，显示全局标准数学定理验证套件。' : 'No verification contracts attached to this node — showing the global standard theorem suite.'}
          </div>
        ) : (
          contracts.map((contract) => {
            const res = results[contract.id];
            const isRunning = runningContractId === contract.id;

            return (
              <div
                key={contract.id}
                className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all space-y-2.5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono text-[11px]">
                      {contract.testType}
                    </span>
                    <span className="font-semibold text-slate-200 text-xs">{isZh ? contract.claimName : contract.claimNameEn || contract.claimName}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {res && (
                      <span
                        className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold ${
                          res.passed
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        }`}
                      >
                        {res.passed ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> {isZh ? '验证通过 (PASSED)' : 'PASSED'}
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 text-rose-400" /> {isZh ? '验证失败 (FAILED)' : 'FAILED'}
                          </>
                        )}
                      </span>
                    )}

                    <button
                      onClick={() => handleRunVerification(contract)}
                      disabled={isRunning}
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-300 hover:text-white text-xs font-mono transition-colors cursor-pointer"
                    >
                      <Play className="w-3 h-3 text-emerald-400" />
                      {isRunning ? (isZh ? '计算中...' : 'Running...') : (isZh ? '测试本项' : 'Run test')}
                    </button>
                  </div>
                </div>

                <div className="text-xs text-slate-400 font-mono bg-slate-950/80 p-2.5 rounded-lg border border-slate-800/60">
                  <span className="text-slate-500">{isZh ? '数学断言: ' : 'Claim: '}</span>
                  <span className="text-slate-300">{contract.expectedResultDesc}</span>
                </div>

                {res && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] font-mono pt-1">
                    <div className="p-2 rounded bg-slate-950 border border-slate-800">
                      <span className="text-slate-500 block">{isZh ? '最大绝对误差 (Max Error)' : 'Max absolute error'}</span>
                      <span className="text-cyan-300 font-bold">{res.maxError.toExponential(3)}</span>
                    </div>
                    <div className="p-2 rounded bg-slate-950 border border-slate-800">
                      <span className="text-slate-500 block">{isZh ? '有效采样规模 (Samples)' : 'Sample count'}</span>
                      <span className="text-purple-300 font-bold">{res.sampleCount}{isZh ? ' 组独立样本' : ' independent samples'}</span>
                    </div>
                    <div className="p-2 rounded bg-slate-950 border border-slate-800">
                      <span className="text-slate-500 block">{isZh ? '验证耗时 (Execution Time)' : 'Execution time'}</span>
                      <span className="text-amber-300 font-bold">{res.durationMs} ms</span>
                    </div>
                  </div>
                )}

                {res?.details && (
                  <p className="text-[11px] text-slate-400 leading-relaxed pl-1">{res.details}</p>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
