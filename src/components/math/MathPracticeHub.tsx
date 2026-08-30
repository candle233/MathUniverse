'use client';

import React, { useState } from 'react';
import { InlineLaTeX } from '@/components/math/LaTeXRenderer';
import { useLanguage } from '@/context/LanguageContext';
import { Trophy, CheckCircle2, XCircle, HelpCircle, ArrowRight, Sparkles, Award, RotateCcw } from 'lucide-react';

export interface PracticeProblem {
  id: string;
  discipline: string;
  disciplineEn: string;
  difficulty: '入门' | '进阶' | '挑战';
  titleZh: string;
  titleEn: string;
  questionLatex: string;
  questionLatexEn: string;
  options: Array<{
    id: string;
    textLatex: string;
    textLatexEn: string;
    isCorrect: boolean;
  }>;
  hint: string;
  hintEn: string;
  fullExplanationLatex: string;
  fullExplanationLatexEn: string;
}

// EN display labels for the zh-coded difficulty identity keys
const DIFFICULTY_LABELS: Record<PracticeProblem['difficulty'], string> = {
  '入门': 'Introductory',
  '进阶': 'Intermediate',
  '挑战': 'Challenge',
};

export const practiceProblems: PracticeProblem[] = [
  {
    id: 'prob-cauchy-schwarz',
    discipline: '实分析与内积空间',
    disciplineEn: 'Real Analysis & Inner Product Spaces',
    difficulty: '入门',
    titleZh: '柯西-施瓦茨不等式的等号成立条件',
    titleEn: 'Equality Condition of the Cauchy–Schwarz Inequality',
    questionLatex: '\\text{在实内积空间 } V \\text{ 中，不等式 } |\\langle u, v \\rangle| \\le \\|u\\| \\|v\\| \\text{ 等号成立的充要条件是：}',
    questionLatexEn: '\\text{In a real inner product space } V, \\text{ the inequality } |\\langle u, v \\rangle| \\le \\|u\\| \\|v\\| \\text{ holds with equality if and only if:}',
    options: [
      { id: 'opt-1', textLatex: 'u \\text{ 与 } v \\text{ 正交，即 } \\langle u, v \\rangle = 0', textLatexEn: 'u \\text{ and } v \\text{ are orthogonal, i.e. } \\langle u, v \\rangle = 0', isCorrect: false },
      { id: 'opt-2', textLatex: 'u \\text{ 与 } v \\text{ 线性相关 (共线)，即 } \\exists \\lambda \\in \\mathbb{R}, u = \\lambda v \\lor v = \\lambda u', textLatexEn: 'u \\text{ and } v \\text{ are linearly dependent (collinear), i.e. } \\exists \\lambda \\in \\mathbb{R}, u = \\lambda v \\lor v = \\lambda u', isCorrect: true },
      { id: 'opt-3', textLatex: '\\|u\\| = \\|v\\|', textLatexEn: '\\|u\\| = \\|v\\|', isCorrect: false },
      { id: 'opt-4', textLatex: 'u + v = 0', textLatexEn: 'u + v = 0', isCorrect: false },
    ],
    hint: '考虑二次多项式 P(t) = ‖t u + v‖² ≥ 0 的判别式 Δ = 0 的几何意义。',
    hintEn: 'Consider the geometric meaning of the vanishing discriminant Δ = 0 of the quadratic polynomial P(t) = ‖t u + v‖² ≥ 0.',
    fullExplanationLatex: '\\text{构造 } P(t) = \\|t u + v\\|^2 = t^2 \\|u\\|^2 + 2t \\langle u, v \\rangle + \\|v\\|^2 \\ge 0\\text{。等号成立意味着存在实根 } t_0 \\text{ 使得 } \\|t_0 u + v\\|^2 = 0 \\iff t_0 u + v = 0\\text{，即两向量线性相关。}',
    fullExplanationLatexEn: '\\text{Construct } P(t) = \\|t u + v\\|^2 = t^2 \\|u\\|^2 + 2t \\langle u, v \\rangle + \\|v\\|^2 \\ge 0. \\text{ Equality means there is a real root } t_0 \\text{ with } \\|t_0 u + v\\|^2 = 0 \\iff t_0 u + v = 0, \\text{ i.e. the two vectors are linearly dependent.}',
  },
  {
    id: 'prob-lagrange-group',
    discipline: '近世代数与群论',
    disciplineEn: 'Modern Algebra & Group Theory',
    difficulty: '进阶',
    titleZh: '有限群中元素的阶与群阶的关系',
    titleEn: 'Element Orders vs. Group Order in Finite Groups',
    questionLatex: '\\text{设 } G \\text{ 为 } 35 \\text{ 阶有限群 (} |G| = 35 \\text{)，对任意非单位元 } g \\in G \\setminus \\{e\\} \\text{，其阶 } \\mathrm{ord}(g) \\text{ 可能的取值只能为：}',
    questionLatexEn: '\\text{Let } G \\text{ be a finite group of order } 35 \\text{ (} |G| = 35 \\text{). For any non-identity } g \\in G \\setminus \\{e\\}, \\text{ the possible values of } \\mathrm{ord}(g) \\text{ are:}',
    options: [
      { id: 'opt-1', textLatex: '2, 3, 5, 7', textLatexEn: '2, 3, 5, 7', isCorrect: false },
      { id: 'opt-2', textLatex: '5、7 \\text{ 或 } 35', textLatexEn: '5, 7 \\text{ or } 35', isCorrect: true },
      { id: 'opt-3', textLatex: '5 \\text{ 或 } 7', textLatexEn: '5 \\text{ or } 7', isCorrect: false },
      { id: 'opt-4', textLatex: '任意小于 35 的正整数', textLatexEn: '\\text{Any positive integer less than } 35', isCorrect: false },
    ],
    hint: '根据拉格朗日定理，子群的阶整除群的阶。元素的阶等于其生成的循环子群 ⟨g⟩ 的阶。',
    hintEn: 'By Lagrange\'s theorem, the order of a subgroup divides the order of the group. The order of an element equals the order of the cyclic subgroup ⟨g⟩ it generates.',
    fullExplanationLatex: '\\text{由拉格朗日定理，} \\mathrm{ord}(g) \\mid |G| = 35 = 5 \\times 7\\text{。因为 } g \\neq e\\text{，阶不能为 1。又 } 5 \\nmid (7-1)\\text{，故 35 阶群必为循环群，存在 } 5\\text{、}7\\text{、}35 \\text{ 阶的元素，因此非单位元的阶只能为 } 5\\text{、}7 \\text{ 或 } 35\\text{。}',
    fullExplanationLatexEn: '\\text{By Lagrange\'s theorem, } \\mathrm{ord}(g) \\mid |G| = 35 = 5 \\times 7. \\text{ Since } g \\neq e, \\text{ the order cannot be } 1. \\text{ Moreover } 5 \\nmid (7-1), \\text{ so every group of order } 35 \\text{ is cyclic and contains elements of orders } 5, 7, 35; \\text{ hence the order of a non-identity element is } 5, 7 \\text{ or } 35.',
  },
  {
    id: 'prob-euler-totient',
    discipline: '初等数论',
    disciplineEn: 'Elementary Number Theory',
    difficulty: '进阶',
    titleZh: '欧拉函数与费马小定理推论',
    titleEn: 'Euler\'s Theorem & a Fermat Little Theorem Corollary',
    questionLatex: '\\text{计算同余式 } 2^{100} \\pmod{13} \\text{ 的最小非负余数：}',
    questionLatexEn: '\\text{Compute the least nonnegative residue of } 2^{100} \\pmod{13}:',
    options: [
      { id: 'opt-1', textLatex: '3', textLatexEn: '3', isCorrect: true },
      { id: 'opt-2', textLatex: '1', textLatexEn: '1', isCorrect: false },
      { id: 'opt-3', textLatex: '9', textLatexEn: '9', isCorrect: false },
      { id: 'opt-4', textLatex: '5', textLatexEn: '5', isCorrect: false },
    ],
    hint: '13 为素数，根据费马小定理：2^{12} ≡ 1 (mod 13)。将指数 100 对 12 取模。',
    hintEn: '13 is prime, so by Fermat\'s little theorem 2^{12} ≡ 1 (mod 13). Reduce the exponent 100 modulo 12.',
    fullExplanationLatex: '100 = 8 \\times 12 + 4 \\implies 2^{100} = (2^{12})^8 \\cdot 2^4 \\equiv 1^8 \\cdot 16 \\equiv 3 \\pmod{13}。',
    fullExplanationLatexEn: '100 = 8 \\times 12 + 4 \\implies 2^{100} = (2^{12})^8 \\cdot 2^4 \\equiv 1^8 \\cdot 16 \\equiv 3 \\pmod{13}.',
  },
  {
    id: 'prob-cantor-cardinal',
    discipline: '公理集合论与逻辑',
    disciplineEn: 'Axiomatic Set Theory & Logic',
    difficulty: '挑战',
    titleZh: '幂集基数的严格阶梯',
    titleEn: 'The Strict Cardinality Ladder of Power Sets',
    questionLatex: '\\text{设 } A \\text{ 为任意非空集合，} \\mathcal{P}(A) \\text{ 为其幂集，则关于基数大小必有：}',
    questionLatexEn: '\\text{Let } A \\text{ be any nonempty set and } \\mathcal{P}(A) \\text{ its power set. Then the cardinalities necessarily satisfy:}',
    options: [
      { id: 'opt-1', textLatex: '|A| < |\\mathcal{P}(A)|', textLatexEn: '|A| < |\\mathcal{P}(A)|', isCorrect: true },
      { id: 'opt-2', textLatex: '|A| = |\\mathcal{P}(A)| \\text{ (当 A 为无限集时)}', textLatexEn: '|A| = |\\mathcal{P}(A)| \\text{ (when } A \\text{ is infinite)}', isCorrect: false },
      { id: 'opt-3', textLatex: '|\\mathcal{P}(A)| \\le |A|', textLatexEn: '|\\mathcal{P}(A)| \\le |A|', isCorrect: false },
      { id: 'opt-4', textLatex: '|\\mathcal{P}(A)| = 2 |A|', textLatexEn: '|\\mathcal{P}(A)| = 2 |A|', isCorrect: false },
    ],
    hint: '对角线反证法：构造 B = {x ∈ A | x ∉ f(x)}，证明不存在任何满射 f: A → P(A)。',
    hintEn: 'Diagonal argument by contradiction: construct B = {x ∈ A | x ∉ f(x)} and show that no surjection f: A → P(A) exists.',
    fullExplanationLatex: '\\text{康托尔定理证明了无论 } A \\text{ 是有限集还是无限集，都不存在满射 } f: A \\to \\mathcal{P}(A)\\text{，因此 } |A| < |\\mathcal{P}(A)| = 2^{|A|} \\text{ 严格成立。}',
    fullExplanationLatexEn: "\\text{Cantor's theorem shows that, whether } A \\text{ is finite or infinite, no surjection } f: A \\to \\mathcal{P}(A) \\text{ exists; hence } |A| < |\\mathcal{P}(A)| = 2^{|A|} \\text{ holds strictly.}",
  },
];

export default function MathPracticeHub() {
  const { isZh } = useLanguage();
  const [activeProbIndex, setActiveProbIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [userScore, setUserScore] = useState(0);
  const [answeredMap, setAnsweredMap] = useState<Record<number, string>>({});

  const currentProb = practiceProblems[activeProbIndex] || practiceProblems[0];

  const handleSelectOption = (optId: string) => {
    if (answeredMap[activeProbIndex]) return; // already answered
    setSelectedOptionId(optId);
    const chosen = currentProb.options.find((o) => o.id === optId);
    if (chosen?.isCorrect) {
      setUserScore((s) => s + 25);
    }
    setAnsweredMap((prev) => ({ ...prev, [activeProbIndex]: optId }));
    setShowExplanation(true);
  };

  const handleNext = () => {
    const nextIdx = (activeProbIndex + 1) % practiceProblems.length;
    setActiveProbIndex(nextIdx);
    setSelectedOptionId(answeredMap[nextIdx] || null);
    setShowHint(false);
    setShowExplanation(Boolean(answeredMap[nextIdx]));
  };

  const handleReset = () => {
    setActiveProbIndex(0);
    setSelectedOptionId(null);
    setShowHint(false);
    setShowExplanation(false);
    setUserScore(0);
    setAnsweredMap({});
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-sm">
              {isZh ? '全学科数学推导挑战与实战演练场 (Math Practice Arena)' : 'Math Practice Arena'}
            </h3>
            <p className="text-xs text-slate-400">
              {isZh
                ? '包含分析学、近世代数、数论与集合论核心概念题，即时检验严谨数学直觉与推导力'
                : 'Core concept questions from analysis, modern algebra, number theory, and set theory — test your rigor and derivation skills instantly'}
            </p>
          </div>
        </div>

        {/* Score & Reset */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-400" />
            <span>{isZh ? `得分: ${userScore} / 100 分` : `Score: ${userScore} / 100`}</span>
          </div>

          <button
            onClick={handleReset}
            className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            title={isZh ? '重置练习' : 'Reset practice'}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Question Progress Tabs */}
      <div className="flex items-center gap-2">
        {practiceProblems.map((p, idx) => {
          const isAnswered = Boolean(answeredMap[idx]);
          const isCurrent = activeProbIndex === idx;
          return (
            <button
              key={p.id}
              onClick={() => {
                setActiveProbIndex(idx);
                setSelectedOptionId(answeredMap[idx] || null);
                setShowHint(false);
                setShowExplanation(Boolean(answeredMap[idx]));
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                isCurrent
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : isAnswered
                  ? 'bg-slate-900 text-emerald-400 border border-emerald-500/30'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <span>{isZh ? `第 ${idx + 1} 题` : `Q${idx + 1}`}</span>
              {isAnswered && <CheckCircle2 className="w-3 h-3" />}
            </button>
          );
        })}
      </div>

      {/* Question Card */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
              {isZh ? currentProb.discipline : currentProb.disciplineEn}
            </span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${
                currentProb.difficulty === '入门'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : currentProb.difficulty === '进阶'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-purple-500/20 text-purple-300 border-purple-500/40'
              }`}
            >
              {isZh ? currentProb.difficulty : DIFFICULTY_LABELS[currentProb.difficulty]}
            </span>
          </div>
          <span className="text-xs font-mono text-slate-500">
            {activeProbIndex + 1} / {practiceProblems.length}
          </span>
        </div>

        <div>
          <h4 className="text-base font-bold text-slate-100">{isZh ? currentProb.titleZh : currentProb.titleEn}</h4>
          <div className="mt-2 text-sm text-cyan-200 font-mono">
            <InlineLaTeX formula={isZh ? currentProb.questionLatex : currentProb.questionLatexEn} />
          </div>
        </div>

        {/* Options */}
        <div className="space-y-2.5">
          {currentProb.options.map((opt) => {
            const isSelected = selectedOptionId === opt.id;
            const isAnswered = Boolean(answeredMap[activeProbIndex]);

            return (
              <div
                key={opt.id}
                onClick={() => handleSelectOption(opt.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 text-xs ${
                  isSelected && opt.isCorrect
                    ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200 shadow-md shadow-emerald-500/10'
                    : isSelected && !opt.isCorrect
                    ? 'bg-rose-950/40 border-rose-500 text-rose-200'
                    : isAnswered && opt.isCorrect
                    ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-300'
                    : 'bg-slate-950 hover:bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                <div className="font-mono">
                  <InlineLaTeX formula={isZh ? opt.textLatex : opt.textLatexEn} />
                </div>

                {isAnswered && opt.isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                {isAnswered && isSelected && !opt.isCorrect && (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
              </div>
            );
          })}
        </div>

        {/* Hint toggle */}
        {!showExplanation && (
          <div className="flex justify-start">
            <button
              onClick={() => setShowHint(!showHint)}
              className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{showHint ? (isZh ? '收起提示' : 'Hide hint') : isZh ? '查看推导提示 (Hint)' : 'Show hint'}</span>
            </button>
          </div>
        )}

        {showHint && !showExplanation && (
          <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200 animate-in fade-in">
            💡 {isZh ? currentProb.hint : currentProb.hintEn}
          </div>
        )}

        {/* Full Explanation */}
        {showExplanation && (
          <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/40 text-xs space-y-2 animate-in fade-in">
            <div className="font-bold text-cyan-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> {isZh ? '严格推导与解析：' : 'Rigorous derivation & analysis:'}
            </div>
            <div className="text-slate-300 leading-relaxed font-mono">
              <InlineLaTeX formula={isZh ? currentProb.fullExplanationLatex : currentProb.fullExplanationLatexEn} />
            </div>
          </div>
        )}

        {/* Next Question button */}
        {Boolean(answeredMap[activeProbIndex]) && (
          <div className="pt-2 flex justify-end">
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer"
            >
              <span>{isZh ? '下一题' : 'Next question'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
