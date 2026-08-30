'use client';

import React, { useState } from 'react';
import { InlineLaTeX } from '@/components/math/LaTeXRenderer';
import { useLanguage } from '@/context/LanguageContext';
import { AlertTriangle, Sparkles, BookOpen, ExternalLink, Filter, Lightbulb, Compass } from 'lucide-react';

export interface CounterExampleItem {
  id: string;
  nameZh: string;
  nameEn: string;
  discipline: string;
  disciplineEn: string;
  disprovenOrMonster: '病态反例 (Monster)' | '著名猜想反例 (Disproven)';
  formulaLatex: string;
  targetTheoremOrConjecture: string;
  targetTheoremOrConjectureEn: string;
  whyCrucial: string;
  whyCrucialEn: string;
  significance: string;
  significanceEn: string;
}

// EN display labels for the zh-coded counterexample identity keys
const MONSTER_TYPE_LABELS: Record<CounterExampleItem['disprovenOrMonster'], string> = {
  '病态反例 (Monster)': 'Pathological Monster',
  '著名猜想反例 (Disproven)': 'Disproven Conjecture',
};

export const counterExamples: CounterExampleItem[] = [
  {
    id: 'weierstrass-function',
    nameZh: '魏尔斯特拉斯处处不可微函数',
    nameEn: "Weierstrass's Nowhere-Differentiable Function",
    discipline: '实分析与分形几何',
    disciplineEn: 'Real Analysis & Fractal Geometry',
    disprovenOrMonster: '病态反例 (Monster)',
    formulaLatex: 'f(x) = \\sum_{n=0}^{\\infty} a^n \\cos(b^n \\pi x), \\quad (ab > 1 + \\frac{3}{2}\\pi)',
    targetTheoremOrConjecture: '“连续函数必定在大多数点处存在切线” 的直觉信念',
    targetTheoremOrConjectureEn: 'The intuitive belief that "a continuous function must have a tangent line at most points"',
    whyCrucial: '十九世纪前数学界普遍相信连续函数除少数尖点外处处可导。魏尔斯特拉斯于 1872 年构造了这条处处连绵不绝但处处都是无穷尖刺的病态曲线，彻底震撼了数学界，推动了实分析严格化。',
    whyCrucialEn: 'Before the nineteenth century, mathematicians widely believed that a continuous function had to be differentiable except at a few corners. In 1872 Weierstrass constructed this pathological curve — unbroken everywhere, yet bristling with infinite sharp spikes at every point — stunning the mathematical world and driving the rigorization of real analysis.',
    significance: '催生了严格的 ε-δ 分析学基础与现代分形几何 (Fractal Geometry)。',
    significanceEn: 'Gave birth to the rigorous ε-δ foundations of analysis and to modern fractal geometry.',
  },
  {
    id: 'euler-sum-powers',
    nameZh: '欧拉幂和猜想反例',
    nameEn: "Euler's Sum of Powers Conjecture Counterexample",
    discipline: '丢番图方程与数论',
    disciplineEn: 'Diophantine Equations & Number Theory',
    disprovenOrMonster: '著名猜想反例 (Disproven)',
    formulaLatex: '27^5 + 84^5 + 110^5 + 133^5 = 144^5',
    targetTheoremOrConjecture: '欧拉猜想：至少需要 n 个 n 次幂之和才能等于另一个 n 次幂',
    targetTheoremOrConjectureEn: "Euler's conjecture: at least n nth powers are needed for their sum to equal another nth power (a generalization of Fermat's Last Theorem)",
    whyCrucial: '欧拉于 1769 年提出该猜想（费马大定理的推广）。1966 年 Lander 与 Parkin 通过早期超级计算机搜寻，发现 4 个 5 次幂相加即可得到 144^5，证伪了欧拉沉睡两百年的猜想。',
    whyCrucialEn: "Euler proposed the conjecture in 1769 as a generalization of Fermat's Last Theorem. In 1966, Lander and Parkin used an early supercomputer search to find that just four fifth powers suffice — 27^5 + 84^5 + 110^5 + 133^5 = 144^5 — disproving Euler's conjecture after two hundred years.",
    significance: '展示了计算机辅助形式化搜索在数论中的巨大威力和猜想验证价值。',
    significanceEn: 'Showcased the enormous power of computer-assisted formal search in number theory and its value for testing conjectures.',
  },
  {
    id: 'dirichlet-function',
    nameZh: '狄利克雷函数',
    nameEn: 'Dirichlet Function (Everywhere Discontinuous)',
    discipline: '测度论与积分学',
    disciplineEn: 'Measure Theory & Integration',
    disprovenOrMonster: '病态反例 (Monster)',
    formulaLatex: 'D(x) = \\begin{cases} 1, & x \\in \\mathbb{Q} \\\\ 0, & x \\in \\mathbb{R} \\setminus \\mathbb{Q} \\end{cases}',
    targetTheoremOrConjecture: '黎曼积分的普遍适用性',
    targetTheoremOrConjectureEn: 'The universal applicability of the Riemann integral',
    whyCrucial: '由于有理数在实数轴上处处稠密，任何区间的达布大和恒为 1，小和恒为 0，导致黎曼不可积。但由勒贝格测度论，有理数测度为 0，狄利克雷函数几乎处处等于 0，因此勒贝格积分严格为 0。',
    whyCrucialEn: "Because the rationals are dense on the real line, the Darboux upper sum over any interval is always 1 and the lower sum always 0, so the function is not Riemann integrable. Yet by Lebesgue's measure theory the rationals have measure zero: the Dirichlet function equals 0 almost everywhere, so its Lebesgue integral is exactly 0.",
    significance: '直接促成了现代勒贝格测度与勒贝格积分理论的创立。',
    significanceEn: 'Directly led to the creation of modern Lebesgue measure and Lebesgue integration theory.',
  },
  {
    id: 'polya-conjecture',
    nameZh: '波利亚猜想反例 (n = 906180359)',
    nameEn: "Pólya Conjecture Counterexample",
    discipline: '解析数论',
    disciplineEn: 'Analytic Number Theory',
    disprovenOrMonster: '著名猜想反例 (Disproven)',
    formulaLatex: 'L(n) = \\sum_{k=1}^{n} \\lambda(k) \\le 0, \\quad \\text{在 } n = 906180359 \\text{ 处首次失效}',
    targetTheoremOrConjecture: '波利亚猜想：具有奇数个素因子的正整数总是不多于具有偶数个素因子的正整数',
    targetTheoremOrConjectureEn: "Pólya's conjecture: positive integers with an odd number of prime factors are never more numerous than those with an even number",
    whyCrucial: '波利亚于 1919 年提出。该猜想在数亿量级内完全吻合，直到 1980 年田中实通过深度计算证明在接近 10 亿时 L(n) > 0。',
    whyCrucialEn: "Pólya formulated the conjecture in 1919. It held across hundreds of millions of values, until 1980, when Minoru Tanaka's deep computation proved that L(n) > 0 just below one billion.",
    significance: '深刻警示：在数论中，哪怕经过数亿次经验验证的规律，也绝不能替代严格的形式化机器证明！',
    significanceEn: 'A sobering warning: in number theory, no amount of empirical verification — not even hundreds of millions of confirming cases — can ever replace a rigorous formal machine proof.',
  },
  {
    id: 'thomae-function',
    nameZh: '托马埃爆米花函数',
    nameEn: "Thomae's Popcorn / Ruler Function",
    discipline: '实函数论',
    disciplineEn: 'Theory of Real Functions',
    disprovenOrMonster: '病态反例 (Monster)',
    formulaLatex: 'T(x) = \\begin{cases} 1/q, & x = p/q \\in \\mathbb{Q} \\text{ (最简)} \\\\ 0, & x \\in \\mathbb{R} \\setminus \\mathbb{Q} \\end{cases}',
    targetTheoremOrConjecture: '“不连续点的集合不能是有理数集” 的直觉',
    targetTheoremOrConjectureEn: 'The intuition that "the set of discontinuity points cannot be the set of rational numbers"',
    whyCrucial: '该函数在所有无理点处严格连续，但在所有有理点处严格不连续！并且它是黎曼可积的，积分为 0。',
    whyCrucialEn: 'The function is strictly continuous at every irrational point, yet strictly discontinuous at every rational point — and it is Riemann integrable, with integral 0.',
    significance: '完美展示了点集拓扑与实分析中 Baire 纲定理在不连续点集分析中的应用。',
    significanceEn: 'A perfect showcase of applying the Baire category theorem from point-set topology and real analysis to the study of sets of discontinuity points.',
  },
];

export default function CounterExampleGallery() {
  const { isZh } = useLanguage();
  const [selectedId, setSelectedId] = useState<string>(counterExamples[0].id);
  const activeItem = counterExamples.find((c) => c.id === selectedId) || counterExamples[0];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-sm">
              {isZh ? '数学反例与病态怪兽殿堂 (Mathematical Counterexamples & Monsters)' : 'Hall of Mathematical Counterexamples & Monsters'}
            </h3>
            <p className="text-xs text-slate-400">
              {isZh
                ? '探索打破直觉的经典数学反例，洞察公理与定理每一条假设不可或缺的深层缘由'
                : 'Explore classic counterexamples that defy intuition, and see why every hypothesis behind an axiom or theorem is indispensable.'}
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-rose-400 font-bold bg-rose-950/40 px-3 py-1.5 rounded-xl border border-rose-500/30">
          {isZh ? `收录 ${counterExamples.length} 个经典反例` : `${counterExamples.length} classic counterexamples`}
        </span>
      </div>

      {/* Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {counterExamples.map((item) => (
          <button
            key={item.id}
            onClick={() => setSelectedId(item.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedId === item.id
                ? 'bg-rose-500 text-slate-950 font-bold shadow-lg shadow-rose-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            {isZh ? item.nameZh : item.nameEn}
          </button>
        ))}
      </div>

      {/* Active Card Body */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-5">
        {/* Title & Metadata */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-semibold">
                {isZh ? activeItem.disprovenOrMonster : MONSTER_TYPE_LABELS[activeItem.disprovenOrMonster]}
              </span>
              <span className="text-xs text-slate-400 font-mono">{isZh ? activeItem.discipline : activeItem.disciplineEn}</span>
            </div>
            <h4 className="text-lg font-bold text-slate-100 mt-1">{isZh ? activeItem.nameZh : activeItem.nameEn}</h4>
            {isZh && <p className="text-xs text-slate-400 font-mono">{activeItem.nameEn}</p>}
          </div>
        </div>

        {/* Mathematical Definition Formula */}
        <div className="p-4 rounded-xl bg-slate-950 border border-rose-500/30 text-rose-200 font-mono text-xs overflow-x-auto text-center">
          <InlineLaTeX formula={activeItem.formulaLatex} displayMode={true} />
        </div>

        {/* Challenged Belief */}
        <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200 space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-amber-300">
            <Lightbulb className="w-4 h-4" /> {isZh ? '被证伪或击碎的直觉猜想：' : 'Disproven or shattered intuition:'}
          </div>
          <p>{isZh ? activeItem.targetTheoremOrConjecture : activeItem.targetTheoremOrConjectureEn}</p>
        </div>

        {/* Why Crucial & Historical Significance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2">
            <h5 className="font-bold text-slate-200 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-rose-400" />
              <span>{isZh ? '构造机制与反例缘由' : 'Construction & Rationale'}</span>
            </h5>
            <p className="text-slate-300 leading-relaxed">{isZh ? activeItem.whyCrucial : activeItem.whyCrucialEn}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2">
            <h5 className="font-bold text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isZh ? '对现代数学发展的深远影响' : 'Lasting Impact on Modern Mathematics'}</span>
            </h5>
            <p className="text-slate-300 leading-relaxed">{isZh ? activeItem.significance : activeItem.significanceEn}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
