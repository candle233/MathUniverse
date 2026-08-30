'use client';

import React, { useEffect, useState } from 'react';
import { InlineLaTeX } from '@/components/math/LaTeXRenderer';
import { useLanguage } from '@/context/LanguageContext';
import { Bot, Sparkles, Copy, Check, ArrowRight, ShieldCheck, BookOpen, Layers, Terminal } from 'lucide-react';

export interface TranslationPreset {
  title: string;
  titleEn: string;
  naturalLanguage: string;
  naturalLanguageEn: string;
  mscCode: string;
  discipline: string;
  disciplineEn: string;
  latexStatement: string;
  leanCode: string;
  leanCodeEn: string;
  dependencies: string[];
}

export const translationPresets: TranslationPreset[] = [
  {
    title: '商群良好定义性 (Normal Subgroup Quotient)',
    titleEn: 'Quotient Group Well-Definedness',
    naturalLanguage: '设 G 为群，H 为 G 的正规子群。证明在陪集乘法 (aH)(bH) = (ab)H 下，商集 G/H 构成一个良定义的群。',
    naturalLanguageEn: 'Let G be a group and H a normal subgroup of G. Show that under coset multiplication (aH)(bH) = (ab)H, the quotient set G/H forms a well-defined group.',
    mscCode: '20A05',
    discipline: '近世代数与群论',
    disciplineEn: 'Abstract Algebra & Group Theory',
    latexStatement: 'H \\trianglelefteq G \\implies (G / H, \\cdot) \\text{ is a well-defined group, where } (aH)(bH) = (ab)H',
    leanCode: `import Mathlib.Algebra.Group.QuotientGroup

open QuotientGroup

variable {G : Type*} [Group G] (H : Subgroup G) [H.Normal]

/-- 正规子群商群的良定义性与群结构 -/
theorem quotient_group_well_defined : Group (G ⧸ H) := by
  infer_instance`,
    leanCodeEn: `import Mathlib.Algebra.Group.QuotientGroup

open QuotientGroup

variable {G : Type*} [Group G] (H : Subgroup G) [H.Normal]

/-- Well-definedness and group structure of the quotient by a normal subgroup -/
theorem quotient_group_well_defined : Group (G ⧸ H) := by
  infer_instance`,
    dependencies: ['def-group-axioms', 'def-normal-subgroup', 'thm-lagrange'],
  },
  {
    title: '紧致度量空间的一致连续性 (Heine-Cantor)',
    titleEn: 'Heine-Cantor Uniform Continuity',
    naturalLanguage: '若函数 f 在紧致度量空间 X 上连续，则 f 在 X 上必一致连续。',
    naturalLanguageEn: 'If a function f is continuous on a compact metric space X, then f is uniformly continuous on X.',
    mscCode: '54E45',
    discipline: '一般拓扑学与度量空间',
    disciplineEn: 'General Topology & Metric Spaces',
    latexStatement: '(X, d) \\text{ compact } \\land f \\in C(X, Y) \\implies f \\text{ is uniformly continuous on } X',
    leanCode: `import Mathlib.Topology.MetricSpace.Basic
import Mathlib.Topology.Compactness.Compact

open Metric

variable {X Y : Type*} [MetricSpace X] [MetricSpace Y]

/-- Heine-Cantor 定理: 紧空间上的连续函数必一致连续 -/
theorem heine_cantor {f : X → Y} (hCompact : IsCompact (Set.univ : Set X))
    (hCont : Continuous f) : UniformContinuous f := by
  exact IsCompact.uniformContinuousOn_of_continuous hCompact hCont.continuousOn`,
    leanCodeEn: `import Mathlib.Topology.MetricSpace.Basic
import Mathlib.Topology.Compactness.Compact

open Metric

variable {X Y : Type*} [MetricSpace X] [MetricSpace Y]

/-- Heine-Cantor theorem: a continuous function on a compact space is uniformly continuous -/
theorem heine_cantor {f : X → Y} (hCompact : IsCompact (Set.univ : Set X))
    (hCont : Continuous f) : UniformContinuous f := by
  exact IsCompact.uniformContinuousOn_of_continuous hCompact hCont.continuousOn`,
    dependencies: ['def-compactness', 'def-uniform-continuity', 'thm-heine-borel'],
  },
  {
    title: '代数基本定理 (Fundamental Theorem of Algebra)',
    titleEn: 'Fundamental Theorem of Algebra',
    naturalLanguage: '任意复系数非齐次多项式在复数域 C 内至少存在一个复根。',
    naturalLanguageEn: 'Every non-constant polynomial with complex coefficients has at least one complex root in the field C.',
    mscCode: '12D05',
    discipline: '复分析与多项式代数',
    disciplineEn: 'Complex Analysis & Polynomial Algebra',
    latexStatement: '\\forall P \\in \\mathbb{C}[z], \\; \\deg(P) \\ge 1 \\implies \\exists z_0 \\in \\mathbb{C}, \\; P(z_0) = 0',
    leanCode: `import Mathlib.Analysis.Complex.Polynomial.Basic

open Polynomial

/-- 代数基本定理: 复数域代数闭包 -/
theorem fundamental_theorem_of_algebra (P : ℂ[X]) (hDeg : 0 < degree P) :
    ∃ z : ℂ, IsRoot P z := by
  exact Complex.exists_root_of_degree_pos hDeg`,
    leanCodeEn: `import Mathlib.Analysis.Complex.Polynomial.Basic

open Polynomial

/-- Fundamental theorem of algebra: the complex field is algebraically closed -/
theorem fundamental_theorem_of_algebra (P : ℂ[X]) (hDeg : 0 < degree P) :
    ∃ z : ℂ, IsRoot P z := by
  exact Complex.exists_root_of_degree_pos hDeg`,
    dependencies: ['def-complex-field', 'thm-liouville', 'thm-cauchy-integral'],
  },
];

export default function AiMathTranslator() {
  const { isZh } = useLanguage();
  const [inputText, setInputText] = useState(
    isZh ? translationPresets[0].naturalLanguage : translationPresets[0].naturalLanguageEn
  );
  const [activePreset, setActivePreset] = useState<TranslationPreset>(translationPresets[0]);
  const [isTranslating, setIsTranslating] = useState(false);
  const [copiedLatex, setCopiedLatex] = useState(false);
  const [copiedLean, setCopiedLean] = useState(false);

  // Re-seed the textarea when the locale changes (the useState initializer above
  // runs before the stored locale is resolved). Only untouched preset text is
  // replaced; content the user has typed or edited is preserved as-is.
  useEffect(() => {
    setInputText((current) => {
      const matched = translationPresets.find(
        (p) => p.naturalLanguage === current || p.naturalLanguageEn === current
      );
      if (!matched) return current;
      return isZh ? matched.naturalLanguage : matched.naturalLanguageEn;
    });
  }, [isZh]);

  const handleSelectPreset = (preset: TranslationPreset) => {
    setActivePreset(preset);
    setInputText(isZh ? preset.naturalLanguage : preset.naturalLanguageEn);
  };

  const handleRunTranslate = () => {
    setIsTranslating(true);
    setTimeout(() => {
      setIsTranslating(false);
    }, 600);
  };

  const handleCopyLatex = () => {
    navigator.clipboard.writeText(activePreset.latexStatement);
    setCopiedLatex(true);
    setTimeout(() => setCopiedLatex(false), 1500);
  };

  const handleCopyLean = () => {
    navigator.clipboard.writeText(isZh ? activePreset.leanCode : activePreset.leanCodeEn);
    setCopiedLean(true);
    setTimeout(() => setCopiedLean(false), 1500);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-sm">
              {isZh
                ? '自然语言 $\to$ LaTeX / Lean 4 转译模板库 (Demo · 模板示例)'
                : 'Natural-Language → LaTeX / Lean 4 Template Library (Demo · sample templates)'}
            </h3>
            <p className="text-xs text-slate-400">
              {isZh
                ? '演示：未接入大模型。下方是基于精选数学命题的预设转译模板，不是 LLM 实时翻译。'
                : 'Demo: no LLM is connected. The presets below are curated translation templates for selected mathematical statements, not live LLM translations.'}
            </p>
          </div>
        </div>

        {/* Preset quick buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {translationPresets.map((p) => (
            <button
              key={p.title}
              onClick={() => handleSelectPreset(p)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activePreset.title === p.title
                  ? 'bg-purple-500 text-slate-950 font-bold shadow-md shadow-purple-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              {isZh ? p.title.split(' ')[0] : p.titleEn}
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>{isZh ? '自然语言命题 / 证明草稿输入:' : 'Natural-language statement / proof draft input:'}</span>
        </label>
        <div className="flex gap-2">
          <textarea
            rows={3}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              isZh
                ? '输入自然语言数学定理（如：设 V 为实内积空间，若 u, v 正交则 ||u+v||^2 = ||u||^2 + ||v||^2）...'
                : 'Enter a natural-language theorem (e.g. Let V be a real inner product space; if u, v are orthogonal then ||u+v||^2 = ||u||^2 + ||v||^2)...'
            }
            className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-3.5 outline-none focus:border-purple-500 resize-none font-medium leading-relaxed"
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleRunTranslate}
            disabled={isTranslating}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-slate-950 font-bold text-xs shadow-lg shadow-purple-500/20 transition-all cursor-pointer"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isTranslating ? 'animate-spin' : ''}`} />
            <span>{isZh ? (isTranslating ? '加载预设模板中...' : '应用选中的预设模板') : isTranslating ? 'Loading preset template...' : 'Apply selected preset template'}</span>
          </button>
        </div>
      </div>

      {/* Translation Results Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Metadata & LaTeX */}
        <div className="lg:col-span-5 space-y-4 p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 font-semibold font-mono">
              MSC {activePreset.mscCode} • {isZh ? activePreset.discipline : activePreset.disciplineEn}
            </span>
            <button
              onClick={handleCopyLatex}
              className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 cursor-pointer"
            >
              {copiedLatex ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedLatex ? (isZh ? '已复制' : 'Copied') : isZh ? '复制 LaTeX' : 'Copy LaTeX'}</span>
            </button>
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-300">{isZh ? 'LaTeX 规范形式化陈述:' : 'Canonical LaTeX statement:'}</span>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-purple-500/30 text-cyan-200 text-xs overflow-x-auto text-center font-mono">
              <InlineLaTeX formula={activePreset.latexStatement} displayMode={true} />
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isZh ? '预测所需 DAG 前置依赖本体:' : 'Predicted DAG prerequisite dependencies:'}</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {activePreset.dependencies.map((dep) => (
                <span
                  key={dep}
                  className="px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-800 text-[10px] font-mono text-emerald-300"
                >
                  {dep}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Lean 4 Skeleton */}
        <div className="lg:col-span-7 space-y-3 p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isZh ? 'Lean 4 形式化定理骨架 (Mathlib 4 Compatible):' : 'Lean 4 formalized theorem skeleton (Mathlib 4 compatible):'}</span>
            </span>
            <button
              onClick={handleCopyLean}
              className="flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 cursor-pointer"
            >
              {copiedLean ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedLean ? (isZh ? '已复制' : 'Copied') : isZh ? '复制 Lean 4' : 'Copy Lean 4'}</span>
            </button>
          </div>

          <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-300 leading-relaxed overflow-x-auto max-h-[260px]">
            {isZh ? activePreset.leanCode : activePreset.leanCodeEn}
          </pre>
        </div>
      </div>
    </div>
  );
}
