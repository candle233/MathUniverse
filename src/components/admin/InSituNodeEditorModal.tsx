'use client';

import React, { useState, useMemo } from 'react';
import { MathNode, NodeType, VerificationStatus } from '@/types/math';
import { disciplines } from '@/data/disciplines';
import { checkCircularDependency } from '@/lib/dagEngine';
import { updateSingleMathNode, loadActiveMathNodes } from '@/lib/customPageEngine';
import LaTeXRenderer, { InlineLaTeX } from '@/components/math/LaTeXRenderer';
import {
  X,
  Save,
  Sparkles,
  AlertCircle,
  CheckCircle,
  Code2,
  BookOpen,
  Layers,
  HelpCircle,
  Copy,
  Plus,
} from 'lucide-react';

interface InSituNodeEditorModalProps {
  node: MathNode;
  isOpen: boolean;
  onClose: () => void;
  onSaveSuccess?: (updatedNode: MathNode) => void;
}

const LATEX_SYMBOLS = [
  { label: '∀', code: '\\forall ' },
  { label: '∃', code: '\\exists ' },
  { label: '∈', code: '\\in ' },
  { label: '⊆', code: '\\subseteq ' },
  { label: '∪', code: '\\cup ' },
  { label: '∩', code: '\\cap ' },
  { label: '∅', code: '\\emptyset ' },
  { label: '∫', code: '\\int_{a}^{b} f(x)\\,dx ' },
  { label: '∑', code: '\\sum_{i=1}^{n} a_i ' },
  { label: 'lim', code: '\\lim_{n \\to \\infty} ' },
  { label: 'a/b', code: '\\frac{a}{b} ' },
  { label: '√x', code: '\\sqrt{x} ' },
  { label: '∂', code: '\\partial ' },
  { label: '∇', code: '\\nabla ' },
  { label: '⇒', code: '\\implies ' },
  { label: '⇔', code: '\\iff ' },
  { label: '≠', code: '\\neq ' },
  { label: '≤', code: '\\le ' },
  { label: '≥', code: '\\ge ' },
  { label: 'ℝ', code: '\\mathbb{R} ' },
  { label: 'ℂ', code: '\\mathbb{C} ' },
  { label: 'ℤ', code: '\\mathbb{Z} ' },
  { label: 'ε', code: '\\varepsilon ' },
  { label: 'δ', code: '\\delta ' },
  { label: '矩阵', code: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} ' },
];

export default function InSituNodeEditorModal({
  node,
  isOpen,
  onClose,
  onSaveSuccess,
}: InSituNodeEditorModalProps) {
  const [formData, setFormData] = useState<MathNode>({ ...node });
  const [allNodes, setAllNodes] = useState<MathNode[]>(() => loadActiveMathNodes());
  const [activeTab, setActiveTab] = useState<'statement' | 'intuition' | 'lean' | 'dependencies'>('statement');
  const [saveToast, setSaveToast] = useState<string | null>(null);

  if (!isOpen) return null;

  // Real-time Cycle detection on dependencies
  const cycleStatus = useMemo(() => {
    for (const depId of formData.dependencies) {
      const check = checkCircularDependency(allNodes, formData.id, depId);
      if (check.hasCycle) {
        return check;
      }
    }
    return { hasCycle: false };
  }, [allNodes, formData.id, formData.dependencies]);

  const insertSymbol = (code: string) => {
    setFormData((prev) => ({
      ...prev,
      statementLatex: (prev.statementLatex || '') + code,
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (cycleStatus.hasCycle) {
      alert('无法保存：检测到前置依赖环路，请调整依赖关系。');
      return;
    }

    const updated = updateSingleMathNode({
      ...formData,
      lastModified: new Date().toISOString().split('T')[0],
    });

    setSaveToast('✅ 命题修改已成功保存至本地知识库！');
    if (onSaveSuccess) {
      onSaveSuccess(formData);
    }
    setTimeout(() => {
      setSaveToast(null);
      onClose();
    }, 1200);
  };

  const toggleDependency = (id: string) => {
    setFormData((prev) => {
      const deps = prev.dependencies.includes(id)
        ? prev.dependencies.filter((d) => d !== id)
        : [...prev.dependencies, id];
      return { ...prev, dependencies: deps };
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center font-bold">
              ∑
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40">
                  ⚡ 在线编辑命题
                </span>
                <span className="text-xs text-slate-400 font-mono">{formData.id}</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-100 mt-0.5">
                {formData.titleZh} ({formData.titleEn})
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notification */}
        {saveToast && (
          <div className="p-3 bg-emerald-950/80 border-b border-emerald-500 text-emerald-200 text-xs font-semibold flex items-center justify-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{saveToast}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-800 bg-slate-950/40 overflow-x-auto">
          <button
            onClick={() => setActiveTab('statement')}
            className={`px-4 py-2 rounded-t-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'statement'
                ? 'bg-slate-900 text-cyan-300 border-t-2 border-cyan-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>公式与命题陈述</span>
          </button>

          <button
            onClick={() => setActiveTab('intuition')}
            className={`px-4 py-2 rounded-t-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'intuition'
                ? 'bg-slate-900 text-cyan-300 border-t-2 border-cyan-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>直觉解释与历史背景</span>
          </button>

          <button
            onClick={() => setActiveTab('lean')}
            className={`px-4 py-2 rounded-t-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'lean'
                ? 'bg-slate-900 text-emerald-300 border-t-2 border-emerald-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Lean 4 形式化代码</span>
          </button>

          <button
            onClick={() => setActiveTab('dependencies')}
            className={`px-4 py-2 rounded-t-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'dependencies'
                ? 'bg-slate-900 text-purple-300 border-t-2 border-purple-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>前置依赖勾选 ({formData.dependencies.length})</span>
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs font-mono">
          {/* Basic metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-slate-300 font-bold">中文名称 *</label>
              <input
                type="text"
                required
                value={formData.titleZh}
                onChange={(e) => setFormData({ ...formData, titleZh: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-xl px-3 py-2 outline-none focus:border-cyan-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-bold">英文名称 *</label>
              <input
                type="text"
                required
                value={formData.titleEn}
                onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-xl px-3 py-2 outline-none focus:border-cyan-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-bold">学科分类</label>
              <select
                value={formData.disciplineId}
                onChange={(e) => setFormData({ ...formData, disciplineId: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-xl px-3 py-2 outline-none"
              >
                {disciplines.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.nameZh} ({d.mscCode})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-bold">命题类型</label>
              <select
                value={formData.nodeType}
                onChange={(e) => setFormData({ ...formData, nodeType: e.target.value as NodeType })}
                className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-xl px-3 py-2 outline-none"
              >
                <option value="AXIOM">公理 (Axiom)</option>
                <option value="DEFINITION">定义 (Definition)</option>
                <option value="THEOREM">定理 (Theorem)</option>
                <option value="LEMMA">引理 (Lemma)</option>
                <option value="COROLLARY">推论 (Corollary)</option>
                <option value="CONJECTURE">猜想 (Conjecture)</option>
              </select>
            </div>
          </div>

          {/* TAB 1: Statement & Formula */}
          {activeTab === 'statement' && (
            <div className="space-y-4">
              {/* LaTeX Quick Symbols Palette */}
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-[11px] text-cyan-300 font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>快捷数学符号面板 (点击直接插入 LaTeX 公式)：</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {LATEX_SYMBOLS.map((s, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => insertSymbol(s.code)}
                      className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-cyan-500 hover:text-slate-950 border border-slate-700 text-slate-300 text-xs font-mono transition-colors cursor-pointer"
                      title={s.code}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-bold">LaTeX 形式化公式 (Statement LaTeX) *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.statementLatex}
                  onChange={(e) => setFormData({ ...formData, statementLatex: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 text-cyan-200 rounded-xl p-3 outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              {/* Live Preview Box */}
              <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30 space-y-1">
                <div className="text-[11px] text-cyan-400 font-bold">实时渲染预览：</div>
                <div className="text-sm text-slate-100 py-1">
                  <InlineLaTeX formula={formData.statementLatex} displayMode={true} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">中文自然语言阐述 (Plain Statement Zh)</label>
                  <textarea
                    rows={3}
                    value={formData.statementPlainZh}
                    onChange={(e) => setFormData({ ...formData, statementPlainZh: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-xl p-3 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">英文自然语言阐述 (Plain Statement En)</label>
                  <textarea
                    rows={3}
                    value={formData.statementPlainEn || ''}
                    onChange={(e) => setFormData({ ...formData, statementPlainEn: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-xl p-3 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Intuition & History */}
          {activeTab === 'intuition' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-slate-300 font-bold">直觉性图解与几何意义 (Markdown + LaTeX)</label>
                <textarea
                  rows={4}
                  value={formData.intuitionMd}
                  onChange={(e) => setFormData({ ...formData, intuitionMd: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-xl p-3 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">历史背景与发展渊源 (中文)</label>
                  <textarea
                    rows={3}
                    value={formData.historicalContextZh || ''}
                    onChange={(e) => setFormData({ ...formData, historicalContextZh: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-xl p-3 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Historical Context (English)</label>
                  <textarea
                    rows={3}
                    value={formData.historicalContextEn || ''}
                    onChange={(e) => setFormData({ ...formData, historicalContextEn: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-xl p-3 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Lean 4 Formal Code */}
          {activeTab === 'lean' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-emerald-400 font-bold">Lean 4 形式化定理与策略证明源码</label>
                <textarea
                  rows={8}
                  value={formData.leanFormalization?.leanCode || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      leanFormalization: {
                        id: formData.leanFormalization?.id || `lean-${formData.id}`,
                        nodeId: formData.id,
                        theoremName: formData.leanFormalization?.theoremName || formData.slug,
                        leanCode: e.target.value,
                        mathlibImports: formData.leanFormalization?.mathlibImports || ['Mathlib.Analysis.InnerProductSpace.Basic'],
                        isVerified: true,
                        axiomsUsed: formData.leanFormalization?.axiomsUsed || ['propext', 'Classical.choice'],
                        astHash: `ast_${Date.now()}`,
                      },
                    })
                  }
                  className="w-full bg-slate-950 border border-emerald-500/40 text-emerald-300 rounded-xl p-3 outline-none font-mono"
                />
              </div>
            </div>
          )}

          {/* TAB 4: Dependencies Picker */}
          {activeTab === 'dependencies' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-300 font-bold">
                  勾选此前置命题（自动进行 DAG 环依赖拦截）：
                </span>
                {cycleStatus.hasCycle ? (
                  <span className="text-rose-400 font-bold flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> 环依赖告警！
                  </span>
                ) : (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" /> 拓扑无环
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto p-1">
                {allNodes
                  .filter((n) => n.id !== formData.id)
                  .map((cand) => {
                    const isSelected = formData.dependencies.includes(cand.id);
                    return (
                      <button
                        key={cand.id}
                        type="button"
                        onClick={() => toggleDependency(cand.id)}
                        className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-purple-950/40 border-purple-500 text-purple-200 font-bold'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div>
                          <div className="text-xs">{cand.titleZh}</div>
                          <div className="text-[10px] text-slate-500 font-mono">{cand.id}</div>
                        </div>
                        <span className="text-xs">{isSelected ? '✓' : '+'}</span>
                      </button>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Footer Save Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors cursor-pointer"
            >
              取消
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/25 transition-all cursor-pointer flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>保存命题修改 (Save Changes)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
