'use client';

import React, { useState } from 'react';
import { initialMathNodes } from '@/data/seedData';
import { GitPullRequest, Plus, Sparkles, Check, X, FileText, CheckCircle2, ArrowRight } from 'lucide-react';
import { InlineLaTeX } from '@/components/math/LaTeXRenderer';

export default function SubmitPrModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState(initialMathNodes[0]?.id || 'thm-cauchy-schwarz');
  const [targetField, setTargetField] = useState<'statementLatex' | 'intuitionMd' | 'leanCode'>('intuitionMd');
  const [prTitle, setPrTitle] = useState('优化直觉几何解释与补充物理背景');
  const [prRationale, setPrRationale] = useState('补充了二维与三维空间中的投影几何对应关系，提升初学者认知友好度。');
  const [newValue, setNewValue] = useState(
    '在几何上，柯西-施瓦茨不等式表征了两向量夹角余弦绝对值恒小于等于 1（|cos θ| ≤ 1）。当且仅当两向量共线时等号成立。'
  );
  const [isSubmitted, setIsSubmitted] = useState(false);

  const selectedNode = initialMathNodes.find((n) => n.id === selectedNodeId) || initialMathNodes[0];

  const oldValue =
    targetField === 'statementLatex'
      ? selectedNode.statementLatex
      : targetField === 'intuitionMd'
      ? selectedNode.intuitionMd
      : selectedNode.leanFormalization?.leanCode || '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This demo has no backend: persist the proposal to localStorage only.
    // The form values are NOT sent to any review committee.
    try {
      if (typeof window !== 'undefined') {
        const draft = {
          id: `pr-demo-${Date.now()}`,
          nodeId: selectedNodeId,
          targetField,
          title: prTitle,
          rationale: prRationale,
          oldValue,
          newValue,
          createdAt: new Date().toISOString(),
        };
        const key = 'mathuniverse:local-prs';
        const existing = JSON.parse(window.localStorage.getItem(key) || '[]');
        existing.push(draft);
        window.localStorage.setItem(key, JSON.stringify(existing));
      }
    } catch {
      // localStorage may be disabled; we still show the success screen for demo flow.
    }
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setIsOpen(false);
    }, 2500);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-slate-950 font-bold text-xs shadow-lg shadow-purple-500/20 transition-all cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        <span>提交修订 PR (Propose Changes)</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                  <GitPullRequest className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 text-sm">演示：草拟词条修订提案 (Local Draft)</h3>
                  <p className="text-xs text-slate-400">
                    没有后端：提交后仅保存到你本机的 localStorage，不会广播到任何审阅委员会。
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form Body */}
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-auto flex-1 text-xs">
                {/* Node & Target Field Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-semibold">目标数学命题:</label>
                    <select
                      value={selectedNodeId}
                      onChange={(e) => setSelectedNodeId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 outline-none focus:border-purple-500 font-medium"
                    >
                      {initialMathNodes.map((n) => (
                        <option key={n.id} value={n.id}>
                          {n.titleZh} ({n.titleEn})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-semibold">修订目标字段:</label>
                    <select
                      value={targetField}
                      onChange={(e) => setTargetField(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 outline-none focus:border-purple-500 font-medium"
                    >
                      <option value="intuitionMd">直觉动机与几何解释 (Intuition)</option>
                      <option value="statementLatex">LaTeX 形式化陈述 (Statement)</option>
                      <option value="leanCode">Lean 4 形式化证明源码 (Lean 4)</option>
                    </select>
                  </div>
                </div>

                {/* PR Title */}
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">修订标题 (PR Title):</label>
                  <input
                    type="text"
                    required
                    value={prTitle}
                    onChange={(e) => setPrTitle(e.target.value)}
                    placeholder="简述修改重点..."
                    className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 outline-none focus:border-purple-500"
                  />
                </div>

                {/* Rationale */}
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">修订理由与动机 (Rationale & References):</label>
                  <textarea
                    rows={2}
                    value={prRationale}
                    onChange={(e) => setPrRationale(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-xl p-3 outline-none focus:border-purple-500 resize-none"
                  />
                </div>

                {/* Side-by-Side Diff Preview */}
                <div className="space-y-2">
                  <label className="text-slate-300 font-semibold">Git 风格修订前后 Diff 对比:</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Old Value */}
                    <div className="p-3 bg-rose-950/20 border border-rose-500/30 rounded-xl space-y-1">
                      <div className="text-[11px] text-rose-400 font-bold font-mono">- 当前版本 (Current)</div>
                      <div className="text-slate-400 font-mono text-[11px] max-h-24 overflow-auto">{oldValue}</div>
                    </div>

                    {/* New Value Editor */}
                    <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-xl space-y-1">
                      <div className="text-[11px] text-emerald-400 font-bold font-mono">+ 提议新版本 (Proposed)</div>
                      <textarea
                        rows={3}
                        value={newValue}
                        onChange={(e) => setNewValue(e.target.value)}
                        className="w-full bg-transparent border-0 text-emerald-300 font-mono text-[11px] outline-none resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-slate-950 font-bold text-xs shadow-lg shadow-purple-500/20 cursor-pointer"
                  >
                    <GitPullRequest className="w-3.5 h-3.5" />
                    <span>保存草稿到本地</span>
                  </button>
                </div>
              </form>
            ) : (
              /* Success Screen */
              <div className="p-12 text-center space-y-4 animate-in zoom-in-95">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-100">草稿已保存到本机（演示）</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  提案仅存在于你本机的 localStorage（键名 <span className="font-mono">mathuniverse:local-prs</span>）。
                  本演示没有后端，没有审阅委员会，也不会自动合并。
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
