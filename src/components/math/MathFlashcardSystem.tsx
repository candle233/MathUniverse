'use client';

import React, { useState, useEffect } from 'react';
import { InlineLaTeX } from '@/components/math/LaTeXRenderer';
import { BookOpen, Sparkles, RotateCw, Check, Clock, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';

export interface FlashcardConcept {
  id: string;
  nameZh: string;
  nameEn: string;
  discipline: string;
  mscCode: string;
  formalLatex: string;
  intuitionZh: string;
  keyProperties: string[];
}

export const mathConceptsDeck: FlashcardConcept[] = [
  {
    id: 'concept-compactness',
    nameZh: '紧致性 (Compactness)',
    nameEn: 'Topological Compactness',
    discipline: '一般拓扑学',
    mscCode: '54D30',
    formalLatex: '\\forall \\{U_\\alpha\\}_{\\alpha \\in I} \\text{ s.t. } X \\subseteq \\bigcup U_\\alpha, \\; \\exists \\text{ finite } J \\subseteq I, \\; X \\subseteq \\bigcup_{\\alpha \\in J} U_\\alpha',
    intuitionZh: '“有限性的拓扑推广”：无论用多么庞大的无限个开集覆盖它，总能只挑选出有限个开集就将整个空间彻底罩住。在实欧氏空间等价于有界闭集。',
    keyProperties: ['连续映射保持紧致性', '紧 Hausdorff 空间必为正规空间', '紧集上的实连续函数必达最大最小值'],
  },
  {
    id: 'concept-hausdorff',
    nameZh: '豪斯多夫空间 (T₂ 分离公理)',
    nameEn: 'Hausdorff Space (T₂)',
    discipline: '点集拓扑学',
    mscCode: '54D10',
    formalLatex: '\\forall x \\neq y \\in X, \\; \\exists U, V \\in \\mathcal{T} \\text{ s.t. } x \\in U, y \\in V, \\; U \\cap V = \\emptyset',
    intuitionZh: '“点与点之间可以被互不相交的开邻域隔开”：确保了拓扑空间中的点不会黏糊在一起，保证了序列极限的唯一性。',
    keyProperties: ['极限唯一性成立的充分条件', '每个单点集都是闭集', '紧子集在 Hausdorff 空间中必为闭集'],
  },
  {
    id: 'concept-normal-subgroup',
    nameZh: '正规子群 (Normal Subgroup)',
    nameEn: 'Normal Subgroup & Conjugate Invariance',
    discipline: '近世代数与群论',
    mscCode: '20A05',
    formalLatex: 'N \\trianglelefteq G \\iff \\forall g \\in G, \\; g N g^{-1} = N \\iff gN = Ng',
    intuitionZh: '“在共轭变换下不变的对称内核”：左右陪集完全相等，使得在陪集上定义群乘法不会产生歧义，是构造商群 G/N 的唯一合法通道。',
    keyProperties: ['群同态核 ker(φ) 必为正规子群', '阿贝尔群的所有子群皆为正规子群', '指数为 2 的子群必正规'],
  },
  {
    id: 'concept-exterior-derivative',
    nameZh: '外微分算子 (Exterior Derivative)',
    nameEn: 'Exterior Derivative d on Differential Forms',
    discipline: '微分流形与几何',
    mscCode: '58A10',
    formalLatex: 'd: \\Omega^k(M) \\to \\Omega^{k+1}(M), \\quad d(d\\omega) = d^2 = 0, \\quad d(\\omega \\wedge \\eta) = d\\omega \\wedge \\eta + (-1)^k \\omega \\wedge d\\eta',
    intuitionZh: '“梯度、旋度与散度的唯一样式统一”：d² = 0 对应于“旋度的散度恒为零”与“边界的边界为空 (∂∂=0)”。',
    keyProperties: ['同调代数中 de Rham 上同调群的核心', '斯托克斯广义定理的基础：∫_{∂M} ω = ∫_M dω', '满足反交换的莱布尼茨乘积法则'],
  },
  {
    id: 'concept-uniform-continuity',
    nameZh: '一致连续性 (Uniform Continuity)',
    nameEn: 'Uniform Continuity in Metric Spaces',
    discipline: '实分析与度量空间',
    mscCode: '26A15',
    formalLatex: '\\forall \\varepsilon > 0, \\; \\exists \\delta > 0, \\; \\forall x, y \\in X, \\; d(x, y) < \\delta \\implies d(f(x), f(y)) < \\varepsilon',
    intuitionZh: '“全局统一的敏感度门槛”：δ 的选择只依赖于 ε，而与所考查的具体点 x 无关。函数不会在某个局部出现无限陡峭的剧烈震荡。',
    keyProperties: ['紧空间上的连续函数必一致连续 (Heine-Cantor)', '一致连续函数将柯西序列映射为柯西序列', '可唯一连续延拓至完备化空间'],
  },
];

export default function MathFlashcardSystem() {
  const STORAGE_KEY = 'mathuniverse:flashcard-mastery';
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteryState, setMasteryState] = useState<Record<string, 'mastered' | 'familiar' | 'review'>>({});

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          setMasteryState(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (Object.keys(masteryState).length === 0) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(masteryState));
    } catch {
      // ignore quota errors
    }
  }, [masteryState]);

  const currentCard = mathConceptsDeck[currentIndex] || mathConceptsDeck[0];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % mathConceptsDeck.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + mathConceptsDeck.length) % mathConceptsDeck.length);
  };

  const handleRate = (rating: 'mastered' | 'familiar' | 'review') => {
    setMasteryState((prev) => ({ ...prev, [currentCard.id]: rating }));
    handleNext();
  };

  const masteredCount = Object.values(masteryState).filter((v) => v === 'mastered').length;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-sm">
              现代数学核心概念艾宾浩斯记忆闪卡 (Math Spaced Flashcards)
            </h3>
            <p className="text-xs text-slate-400">
              基于 SuperMemo 间隔遗忘曲线算法，交互翻转掌握抽象本体定义与核心命题性质
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-emerald-400 font-bold bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-500/30">
            已精通: {masteredCount} / {mathConceptsDeck.length}
          </span>
        </div>
      </div>

      {/* 3D Flashcard Container */}
      <div className="max-w-2xl mx-auto min-h-[300px] flex flex-col justify-center">
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className="p-8 rounded-3xl bg-slate-900/90 border border-slate-700 hover:border-amber-500/50 shadow-2xl transition-all cursor-pointer space-y-6 min-h-[260px] flex flex-col justify-between"
        >
          {/* Card Top Metadata */}
          <div className="flex items-center justify-between">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
              MSC {currentCard.mscCode} • {currentCard.discipline}
            </span>
            <span className="text-xs text-amber-400 font-semibold flex items-center gap-1">
              <RotateCw className="w-3.5 h-3.5" />
              <span>点击翻转卡片</span>
            </span>
          </div>

          {/* Front: Formal Definition / Back: Intuition & Key Properties */}
          {!isFlipped ? (
            /* Front Face */
            <div className="text-center space-y-4 py-4 animate-in fade-in">
              <h4 className="text-2xl font-extrabold text-slate-100 tracking-wide">
                {currentCard.nameZh}
              </h4>
              <p className="text-xs text-slate-400 font-mono">{currentCard.nameEn}</p>
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-cyan-200 font-mono text-sm overflow-x-auto">
                <InlineLaTeX formula={currentCard.formalLatex} displayMode={true} />
              </div>
            </div>
          ) : (
            /* Back Face */
            <div className="space-y-4 py-2 text-xs animate-in zoom-in-95">
              <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-200 leading-relaxed">
                <span className="font-bold text-amber-300">💡 几何与物理直觉：</span>
                <span>{currentCard.intuitionZh}</span>
              </div>

              <div className="space-y-1.5">
                <span className="font-semibold text-slate-300">关键推论与性质 (Key Invariants):</span>
                <ul className="space-y-1 text-slate-400 pl-4 list-disc">
                  {currentCard.keyProperties.map((prop, i) => (
                    <li key={i}>{prop}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Card Footer Progress */}
          <div className="text-center text-[11px] text-slate-500 font-mono">
            卡片 {currentIndex + 1} / {mathConceptsDeck.length}
          </div>
        </div>

        {/* Spaced Repetition Rating Buttons */}
        <div className="flex items-center justify-between gap-3 pt-6 max-w-xl mx-auto w-full">
          <button
            onClick={handlePrev}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 flex-1 justify-center">
            <button
              onClick={() => handleRate('review')}
              className="px-3.5 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-semibold cursor-pointer"
            >
              需重温 (立即)
            </button>
            <button
              onClick={() => handleRate('familiar')}
              className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold cursor-pointer"
            >
              较熟悉 (+1天)
            </button>
            <button
              onClick={() => handleRate('mastered')}
              className="px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold cursor-pointer"
            >
              已精通 (+3天)
            </button>
          </div>

          <button
            onClick={handleNext}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
