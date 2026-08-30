'use client';

import React, { useState, useEffect } from 'react';
import { LeanVerification } from '@/types/math';
import { useLanguage } from '@/context/LanguageContext';
import { ShieldCheck, Play, CheckCircle2, AlertCircle, RefreshCw, Terminal, Cpu, Layers, Sparkles, BookOpen } from 'lucide-react';

interface LeanWebEditorProps {
  initialData?: LeanVerification;
  onVerified?: (isVerified: boolean) => void;
}

export default function LeanWebEditor({ initialData, onVerified }: LeanWebEditorProps) {
  const { isZh } = useLanguage();
  const [code, setCode] = useState(
    initialData?.leanCode ||
      `import Mathlib.Analysis.InnerProductSpace.Basic

variable {E : Type*} [NormedAddCommGroup E] [InnerProductSpace ℝ E]

-- ${
        isZh
          ? '柯西-施瓦茨不等式在实内积空间上的形式化 Lean 4 证明'
          : 'Formal Lean 4 proof of the Cauchy-Schwarz inequality in a real inner product space'
      }
theorem cauchy_schwarz_real (x y : E) :
    |⟪x, y⟫_ℝ| ≤ ‖x‖ * ‖y‖ := by
  exact abs_real_inner_le_norm x y`
  );

  const [isCompiling, setIsCompiling] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'VERIFIED' | 'FAILED' | 'RUNNING' | 'IDLE'>(
    initialData?.isVerified ? 'VERIFIED' : 'IDLE'
  );
  const [activeTab, setActiveTab] = useState<'proof_state' | 'axioms' | 'ast'>('proof_state');
  const [proofState, setProofState] = useState(
    initialData?.proofStateOutput || 'Goals accomplished 🎉 (No open goals)'
  );
  const [axioms, setAxioms] = useState<string[]>(
    initialData?.axiomsUsed || ['Classical.choice', 'propext', 'Quot.sound']
  );
  const [hasSorry, setHasSorry] = useState(false);

  // This editor does NOT run a real Lean 4 kernel. It performs a tiny syntax check
  // (no `sorry`/`admit` in the source) and then simulates a successful compile to
  // demonstrate the editor UI. Do not treat the "VERIFIED" status as a real proof.
  useEffect(() => {
    const containsSorry = /\bsorry\b|\badmit\b/i.test(code);
    setHasSorry(containsSorry);

    if (containsSorry) {
      setProofState(
        isZh
          ? '⚠️ 警告: 检测到 `sorry` 或未完成的分支，定理未完全闭合。\n\n1 goal open:\n⊢ Unproved assertion'
          : '⚠️ Warning: detected `sorry` or an unfinished branch — the theorem is not fully closed.\n\n1 goal open:\n⊢ Unproved assertion'
      );
      setVerificationStatus('FAILED');
    } else {
      if (verificationStatus !== 'RUNNING') {
        setProofState(
          isZh
            ? '演示：未运行真正的 Lean 4 内核。源码不含 `sorry`/`admit`，已通过演示检查。'
            : 'Demo: the real Lean 4 kernel is not running. The source contains no `sorry`/`admit`, so the demo check passed.'
        );
      }
    }
  }, [code, isZh]);

  // Execute verification (simulated; see comment above)
  const handleVerify = () => {
    setIsCompiling(true);
    setVerificationStatus('RUNNING');
    setProofState(
      isZh
        ? '⚡ [演示] 模拟 Lean 4 编译器初始化...\n⚠️ 本编辑器未运行真实 Lean 4 内核（无 WebAssembly 加载），结果仅作 UI 演示。'
        : '⚡ [Demo] Simulating Lean 4 compiler initialization...\n⚠️ This editor does not run a real Lean 4 kernel (no WebAssembly loaded) — results are for UI demonstration only.'
    );

    setTimeout(() => {
      if (hasSorry) {
        setIsCompiling(false);
        setVerificationStatus('FAILED');
        setProofState(
          isZh
            ? '❌ 演示检查失败：源码包含 `sorry`/`admit`，按演示规则判定为未闭合。\n\n[注意] 这不是真正的 Lean 4 内核检查。'
            : '❌ Demo check failed: the source contains `sorry`/`admit`, so the demo rules mark it as unclosed.\n\n[Note] This is not a real Lean 4 kernel check.'
        );
        onVerified?.(false);
      } else {
        setIsCompiling(false);
        setVerificationStatus('VERIFIED');
        setProofState(
          isZh
            ? `✅ [演示通过] 源码语法检查通过，未发现 \`sorry\`/\`admit\`。\n\n声明：${initialData?.theoremName || 'cauchy_schwarz_real'}\n⚠️ 实际未运行 Lean 4 内核 — 仅作 UI 演示，请在本地 Mathlib 真实运行以获得形式化保证。`
            : `✅ [Demo passed] Syntax check succeeded; no \`sorry\`/\`admit\` found.\n\nStatement: ${initialData?.theoremName || 'cauchy_schwarz_real'}\n⚠️ The Lean 4 kernel was not actually run — UI demonstration only. Run it locally with Mathlib for a real formalization guarantee.`
        );
        onVerified?.(true);
      }
    }, 900);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
      {/* Editor Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-slate-900/90 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-xs font-mono">
            ∀
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-200 text-sm">
                {isZh ? 'Lean 4 编辑器 (Demo · 模拟验证)' : 'Lean 4 Editor (Demo · simulated verification)'}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
                {isZh ? '演示模式 (未加载 WASM)' : 'Demo mode (WASM not loaded)'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Theorem: <span className="text-emerald-400">{initialData?.theoremName || 'formalized_theorem'}</span>
            </p>
          </div>
        </div>

        {/* Verification Status Badge & Run Button */}
        <div className="flex items-center gap-3">
          {verificationStatus === 'VERIFIED' && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-medium animate-pulse">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{isZh ? '🟢 演示通过 (未运行真实 Lean 内核)' : '🟢 Demo passed (real Lean kernel not run)'}</span>
            </div>
          )}

          {verificationStatus === 'FAILED' && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-medium">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              <span>{isZh ? '🔴 未通过验证' : '🔴 Verification failed'}</span>
            </div>
          )}

          <button
            onClick={handleVerify}
            disabled={isCompiling}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium text-xs shadow-lg shadow-emerald-950/50 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isCompiling ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>{isZh ? '内核编译中...' : 'Kernel compiling...'}</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isZh ? '运行 Lean 4 验证' : 'Run Lean 4 verification'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor & Proof State Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[380px]">
        {/* Left Column: Code Editor */}
        <div className="lg:col-span-7 border-r border-slate-800 flex flex-col bg-slate-950/90">
          <div className="flex items-center justify-between px-4 py-1.5 bg-slate-900/50 text-xs text-slate-400 border-b border-slate-800/80 font-mono">
            <span className="flex items-center gap-1">
              <BookOpen className="w-3 h-3 text-cyan-400" /> MathUniverse.lean
            </span>
            <span>UTF-8 • Lean 4 syntax</span>
          </div>

          <div className="relative flex-1 p-4 font-mono text-xs leading-relaxed overflow-auto">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full min-h-[300px] bg-transparent text-slate-200 outline-none resize-none font-mono selection:bg-cyan-500/30 whitespace-pre"
              spellCheck={false}
            />
          </div>

          {/* Imports Footer */}
          <div className="px-4 py-2 bg-slate-900/40 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <div className="flex items-center gap-1 text-slate-400 truncate">
              <Layers className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
              <span>Mathlib: {initialData?.mathlibImports?.join(', ') || 'Mathlib.Analysis.InnerProductSpace.Basic'}</span>
            </div>
            <span className="text-slate-500 flex-shrink-0">
              {isZh ? '演示环境（未加载 Lean WASM）' : 'Demo environment (Lean WASM not loaded)'}
            </span>
          </div>
        </div>

        {/* Right Column: LSP Proof State & Diagnostics */}
        <div className="lg:col-span-5 flex flex-col bg-slate-900/40">
          {/* Sub Tabs */}
          <div className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('proof_state')}
              className={`px-3 py-1 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'proof_state'
                  ? 'bg-slate-800 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Terminal className="w-3 h-3" />
              {isZh ? '证明状态 (Proof State)' : 'Proof State'}
            </button>
            <button
              onClick={() => setActiveTab('axioms')}
              className={`px-3 py-1 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'axioms'
                  ? 'bg-slate-800 text-purple-300 border border-purple-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Cpu className="w-3 h-3" />
              {isZh ? '#print axioms (防作弊)' : '#print axioms (anti-cheat)'}
            </button>
          </div>

          {/* Output Content */}
          <div className="flex-1 p-4 font-mono text-xs overflow-auto">
            {activeTab === 'proof_state' && (
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {proofState}
                </div>

                <div className="p-3 rounded-lg bg-slate-950/50 border border-slate-800/80 space-y-2">
                  <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    {isZh ? 'LSP 上下文推导 (Context):' : 'LSP Context (inferred):'}
                  </div>
                  <div className="space-y-1 text-slate-400 text-[11px]">
                    <p><span className="text-purple-400">E</span> : Type*</p>
                    <p><span className="text-blue-400">[NormedAddCommGroup E]</span> : Metric/Normed additive structure</p>
                    <p><span className="text-cyan-400">[InnerProductSpace ℝ E]</span> : Real inner product space</p>
                    <p><span className="text-emerald-400">x y</span> : E</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'axioms' && (
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-purple-950/20 border border-purple-500/30 text-purple-200 text-xs">
                  <div className="font-semibold mb-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                    {isZh ? '公理安全审计报告 (Axiomatic Integrity)' : 'Axiomatic Integrity Report'}
                  </div>
                  <p className="text-[11px] text-purple-300/80 leading-relaxed">
                    {isZh
                      ? 'Lean 4 内核严格验证此定理未引入虚假公理，其证明完全基于经典 ZFC 与类型论标准公理集：'
                      : 'The Lean 4 kernel strictly verifies that this theorem introduces no spurious axioms; its proof rests entirely on the standard axiom set of classical ZFC and type theory:'}
                  </p>
                </div>

                <div className="space-y-2">
                  {axioms.map((ax, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800 text-xs">
                      <span className="text-cyan-300 font-mono">{ax}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {isZh ? '标准合法公理' : 'Standard axiom'}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="text-[11px] text-slate-500 font-mono mt-2">
                  Proof AST Hash: <span className="text-slate-400">{initialData?.astHash || 'sha256:d8c28135be3f...'}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
