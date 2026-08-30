'use client';

import React, { useState, useMemo } from 'react';
import { Search, Copy, Check, BookOpen, Layers, Sparkles, ExternalLink, Code2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export interface MathlibLemma {
  name: string;
  module: string;
  typeSignature: string;
  docstring: string;
  docstringEn: string;
  discipline: string;
  disciplineEn: string;
}

export const mathlibIndex: MathlibLemma[] = [
  {
    name: 'abs_real_inner_le_norm',
    module: 'Mathlib.Analysis.InnerProductSpace.Basic',
    typeSignature: 'theorem abs_real_inner_le_norm (x y : E) : |⟪x, y⟫_ℝ| ≤ ‖x‖ * ‖y‖',
    docstring: '柯西-施瓦茨不等式在实内积空间上的基础引理。',
    docstringEn: 'The basic lemma behind the Cauchy-Schwarz inequality in a real inner product space.',
    discipline: '线性代数 / 泛函分析',
    disciplineEn: 'Linear Algebra / Functional Analysis',
  },
  {
    name: 'tendsto_nhds_unique',
    module: 'Mathlib.Topology.Order.Basic',
    typeSignature: 'theorem tendsto_nhds_unique [T2Space α] (h₁ : Tendsto f l (𝓝 a)) (h₂ : Tendsto f l (𝓝 b)) : a = b',
    docstring: 'Hausdorff (T2) 拓扑空间中极限的唯一性定理。',
    docstringEn: 'Uniqueness of limits in a Hausdorff (T2) topological space.',
    discipline: '点集拓扑 / 实分析',
    disciplineEn: 'Point-Set Topology / Real Analysis',
  },
  {
    name: 'integral_eq_sub_of_hasDerivAt',
    module: 'Mathlib.MeasureTheory.Integral.IntervalIntegral',
    typeSignature: 'theorem integral_eq_sub_of_hasDerivAt (h : ∀ x ∈ [[a, b]], HasDerivAt F (f x) x) : ∫ x in a..b, f x = F b - F a',
    docstring: '连续函数在闭区间上的微积分基本定理 (牛顿-莱布尼茨公式)。',
    docstringEn: 'The fundamental theorem of calculus (Newton-Leibniz formula) for a function with a derivative on a closed interval.',
    discipline: '实分析 / 测度与积分',
    disciplineEn: 'Real Analysis / Measure & Integration',
  },
  {
    name: 'QuotientGroup.quotientKerEquivRange',
    module: 'Mathlib.GroupTheory.QuotientGroup',
    typeSignature: 'def quotientKerEquivRange (φ : G →* H) : G ⧸ φ.ker ≃* φ.range',
    docstring: '群的第一同构定理：商群 G/ker φ 典范同构于同态像 φ.range。',
    docstringEn: 'The first isomorphism theorem for groups: G/ker φ is canonically isomorphic to the image φ.range.',
    discipline: '近世代数 / 群论',
    disciplineEn: 'Abstract Algebra / Group Theory',
  },
  {
    name: 'ZMod.pow_card_sub_one_eq_one',
    module: 'Mathlib.FieldTheory.Finite.Basic',
    typeSignature: 'theorem pow_card_sub_one_eq_one [Fact (Nat.Prime p)] (ha : a ≠ 0) : a ^ (p - 1) = 1',
    docstring: '有限域 Z/pZ 中非零元素的费马小定理。',
    docstringEn: "Fermat's little theorem for nonzero elements of the finite field Z/pZ.",
    discipline: '代数数论 / 有限域',
    disciplineEn: 'Algebraic Number Theory / Finite Fields',
  },
  {
    name: 'isCompact_iff_isClosed_isBounded',
    module: 'Mathlib.Topology.MetricSpace.Basic',
    typeSignature: 'theorem isCompact_iff_isClosed_isBounded (s : Set ℝ) : IsCompact s ↔ IsClosed s ∧ Bornology.IsBounded s',
    docstring: '海涅-博雷尔定理：实数空间中的紧致性等价于有界闭集。',
    docstringEn: "The Heine-Borel theorem: in the real numbers, compactness is equivalent to being closed and bounded.",
    discipline: '度量空间 / 拓扑学',
    disciplineEn: 'Metric Spaces / Topology',
  },
  {
    name: 'Subgroup.card_subgroup_dvd_card',
    module: 'Mathlib.GroupTheory.Index',
    typeSignature: 'theorem card_subgroup_dvd_card [Fintype G] (H : Subgroup G) : Fintype.card H ∣ Fintype.card G',
    docstring: '拉格朗日定理：有限群中任意子群的阶整除群的阶。',
    docstringEn: "Lagrange's theorem: the order of any subgroup of a finite group divides the order of the group.",
    discipline: '近世代数 / 有限群',
    disciplineEn: 'Abstract Algebra / Finite Groups',
  },
  {
    name: 'Continuous.comp',
    module: 'Mathlib.Topology.Basic',
    typeSignature: 'theorem Continuous.comp {f : α → β} {g : β → γ} (hg : Continuous g) (hf : Continuous f) : Continuous (g ∘ f)',
    docstring: '连续映射的复合仍然连续。',
    docstringEn: 'The composition of continuous maps is continuous.',
    discipline: '拓扑学',
    disciplineEn: 'Topology',
  },
];

export default function MathlibFinder() {
  const { isZh } = useLanguage();
  const [query, setQuery] = useState('');
  const [copiedName, setCopiedName] = useState<string | null>(null);

  const filteredLemmas = useMemo(() => {
    if (!query.trim()) return mathlibIndex;
    const q = query.toLowerCase().trim();
    return mathlibIndex.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.module.toLowerCase().includes(q) ||
        l.typeSignature.toLowerCase().includes(q) ||
        l.docstring.toLowerCase().includes(q) ||
        l.docstringEn.toLowerCase().includes(q) ||
        l.discipline.toLowerCase().includes(q) ||
        l.disciplineEn.toLowerCase().includes(q)
    );
  }, [query]);

  const handleCopy = (code: string, name: string) => {
    navigator.clipboard.writeText(code);
    setCopiedName(name);
    setTimeout(() => setCopiedName(null), 1500);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-sm">
              {isZh
                ? 'Lean 4 官方 Mathlib 定理检索助手 (Mathlib Assistant)'
                : 'Lean 4 Mathlib Assistant (official lemmas)'}
            </h3>
            <p className="text-xs text-slate-400">
              {isZh
                ? '快速检索 Mathlib 模块引用、定理类型签名与官方形式化证明模式'
                : 'Quickly look up Mathlib modules, theorem type signatures, and official formalization patterns'}
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-500 font-mono">Mathlib 4.14.0 Index</div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={
            isZh
              ? '搜索 Mathlib 定理、模块路径或数学概念 (如 inner, compact, quotient, 费马)...'
              : 'Search Mathlib theorems, module paths, or math concepts (e.g. inner, compact, quotient, Fermat)...'
          }
          className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-emerald-500 transition-colors"
        />
      </div>

      {/* Lemmas List */}
      <div className="space-y-3 max-h-96 overflow-auto pr-1">
        {filteredLemmas.map((item) => {
          const isCopied = copiedName === item.name;
          return (
            <div
              key={item.name}
              className="p-4 rounded-xl border border-slate-800/90 bg-slate-900/50 hover:bg-slate-900 hover:border-emerald-500/40 transition-all space-y-2 group"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-emerald-300 group-hover:text-emerald-200">
                    {item.name}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                    {isZh ? item.discipline : item.disciplineEn}
                  </span>
                </div>

                <button
                  onClick={() =>
                    handleCopy(`import ${item.module}\n\n-- ${item.name}\n${item.typeSignature}`, item.name)
                  }
                  className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-emerald-950/80 hover:text-emerald-300 text-slate-300 transition-colors cursor-pointer"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">{isZh ? '已复制源码' : 'Copied'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-slate-400" />
                      <span>{isZh ? '复制 Lean 声明' : 'Copy Lean declaration'}</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs text-slate-300">{isZh ? item.docstring : item.docstringEn}</p>

              {/* Type Signature */}
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-[11px] font-mono text-cyan-300 overflow-x-auto">
                <code>{item.typeSignature}</code>
              </div>

              <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono">
                <Layers className="w-3 h-3 text-slate-500" />
                <span>Import: {item.module}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
