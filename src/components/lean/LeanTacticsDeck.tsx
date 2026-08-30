'use client';

import React, { useState } from 'react';
import { Terminal, Copy, Check, Sparkles, BookOpen, Lightbulb, ChevronRight, ChevronLeft, Play } from 'lucide-react';
import { InlineLaTeX } from '@/components/math/LaTeXRenderer';
import { useLanguage } from '@/context/LanguageContext';

export interface LeanTacticCard {
  tactic: string;
  nameZh: string;
  nameEn: string;
  category: '基础推理' | '等式重写' | '自动化求解' | '结构解构' | '经典逻辑';
  description: string;
  descriptionEn: string;
  whenToUse: string;
  whenToUseEn: string;
  codeSnippet: string;
  codeSnippetEn: string;
  exampleGoal: string;
}

// EN display labels for the zh-coded category identity keys
const CATEGORY_LABELS: Record<LeanTacticCard['category'], string> = {
  '基础推理': 'Basic Reasoning',
  '等式重写': 'Equational Rewriting',
  '自动化求解': 'Automated Solving',
  '结构解构': 'Structural Deconstruction',
  '经典逻辑': 'Classical Logic',
};

export const leanTacticsData: LeanTacticCard[] = [
  {
    tactic: 'intro',
    nameZh: '引入假设 / 量词前件',
    nameEn: 'Introduce a hypothesis / antecedent',
    category: '基础推理',
    description: '将目标中的全称量词 ∀x 或蕴含前件 P → Q 引入为当前上下文的已知假设。',
    descriptionEn: 'Moves a universal quantifier ∀x or an implication antecedent P → Q from the goal into the context as a known hypothesis.',
    whenToUse: '目标形式为 ∀ x, P x 或 P → Q 时作为证明的第一步。',
    whenToUseEn: 'Use as the first step when the goal has the form ∀ x, P x or P → Q.',
    exampleGoal: '⊢ P → Q',
    codeSnippet: 'intro hP\n-- 上下文新增 hP : P，目标变为 ⊢ Q',
    codeSnippetEn: 'intro hP\n-- hP : P is added to the context, goal becomes ⊢ Q',
  },
  {
    tactic: 'exact',
    nameZh: '精准匹配已知假设',
    nameEn: 'Match a known hypothesis exactly',
    category: '基础推理',
    description: '当上下文中的某条假设或某个引理的类型与当前证明目标完全一致时，直接闭合目标。',
    descriptionEn: 'Closes the goal directly when a hypothesis or lemma in the context has exactly the type of the current goal.',
    whenToUse: '上下文已有 h : P 且目标正是 ⊢ P 时。',
    whenToUseEn: 'Use when the context already has h : P and the goal is exactly ⊢ P.',
    exampleGoal: 'h : P ⊢ P',
    codeSnippet: 'exact h\n-- 目标直接宣告完成 🎉',
    codeSnippetEn: 'exact h\n-- the goal is discharged immediately 🎉',
  },
  {
    tactic: 'apply',
    nameZh: '反向应用引理 / 后件反推',
    nameEn: 'Apply a lemma backwards',
    category: '基础推理',
    description: '若已知引理 h : A → B 且当前目标为 ⊢ B，执行 apply h 会将目标反向替换为子目标 ⊢ A。',
    descriptionEn: 'Given a lemma h : A → B and a current goal ⊢ B, apply h replaces the goal with the subgoal ⊢ A.',
    whenToUse: '已知充分条件引理并希望将其作为证明桥梁时。',
    whenToUseEn: 'Use when you have a sufficient-condition lemma and want to use it as a proof bridge.',
    exampleGoal: 'h : A → B ⊢ B',
    codeSnippet: 'apply h\n-- 目标转化为子目标 ⊢ A',
    codeSnippetEn: 'apply h\n-- the goal is reduced to the subgoal ⊢ A',
  },
  {
    tactic: 'rw',
    nameZh: '等价重写 (Rewrite)',
    nameEn: 'Rewrite with an equation',
    category: '等式重写',
    description: '利用等式假设 h : a = b 将目标或某假设中的 a 全部替换为 b (或使用 rw [← h] 反向替换)。',
    descriptionEn: 'Uses the equation h : a = b to replace every a with b in the goal or a hypothesis (rw [← h] rewrites backwards).',
    whenToUse: '目标或假设中含有可化简代换的已知等式时。',
    whenToUseEn: 'Use when the goal or a hypothesis contains a known equation that can be substituted.',
    exampleGoal: 'h : a = b ⊢ a + c = 0',
    codeSnippet: 'rw [h]\n-- 目标重写为 ⊢ b + c = 0',
    codeSnippetEn: 'rw [h]\n-- the goal is rewritten to ⊢ b + c = 0',
  },
  {
    tactic: 'simp',
    nameZh: '符号自动简化 (Simplifier)',
    nameEn: 'Automatic simplification',
    category: '自动化求解',
    description: '调用 Mathlib 核心 simp 规则库对目标进行递归代数展开、逻辑化简与模式匹配。',
    descriptionEn: 'Applies the core Mathlib simp rule set to recursively expand algebra, simplify logic, and pattern-match the goal.',
    whenToUse: '包含大量布尔逻辑、集合并交、代数群律等基础恒等式时。',
    whenToUseEn: 'Use when the goal is full of boolean logic, set unions/intersections, algebraic group laws, and similar basic identities.',
    exampleGoal: '⊢ x + 0 = x ∧ True ∧ Set.univ ∩ s = s',
    codeSnippet: 'simp\n-- 自动应用数以百计的基础化简引理',
    codeSnippetEn: 'simp\n-- hundreds of basic simplification lemmas are applied automatically',
  },
  {
    tactic: 'linarith',
    nameZh: '线性实数/有理数不等式求解器',
    nameEn: 'Linear inequality solver',
    category: '自动化求解',
    description: '基于傅里叶-莫茨金消元法 (Fourier-Motzkin)，自动从上下文线性不等式中导出目标或矛盾。',
    descriptionEn: 'Based on Fourier-Motzkin elimination, it automatically derives the goal or a contradiction from the linear inequalities in the context.',
    whenToUse: '涉及实数、有理数或整数的线性不等式系统 (如 2*x + y ≤ 5, x > 1 ⊢ y < 3)。',
    whenToUseEn: 'Use for linear inequality systems over the reals, rationals, or integers (e.g. 2*x + y ≤ 5, x > 1 ⊢ y < 3).',
    exampleGoal: 'h1 : a ≤ b, h2 : b < c ⊢ a < c',
    codeSnippet: 'linarith\n-- 自动完成多变量线性规划推导',
    codeSnippetEn: 'linarith\n-- the multi-variable linear derivation is completed automatically',
  },
  {
    tactic: 'ring',
    nameZh: '多项式交换环代数等式求解器',
    nameEn: 'Polynomial identity solver',
    category: '自动化求解',
    description: '在任何交换半环 (Commutative Semiring) 上展开多项式并验证两端形式恒等。',
    descriptionEn: 'Expands polynomials over any commutative semiring and verifies that both sides are identically equal.',
    whenToUse: '展开复杂的代数多项式，如 (a + b)^2 = a^2 + 2*a*b + b^2。',
    whenToUseEn: 'Use to expand complicated algebraic polynomial identities, e.g. (a + b)^2 = a^2 + 2*a*b + b^2.',
    exampleGoal: '⊢ (x + y) * (x - y) = x^2 - y^2',
    codeSnippet: 'ring\n-- 自动标准化为多项式典范形式',
    codeSnippetEn: 'ring\n-- both sides are normalized to the canonical polynomial form automatically',
  },
  {
    tactic: 'rcases / obtain',
    nameZh: '结构解构与存在量词拆解',
    nameEn: 'Deconstruct structure / existentials',
    category: '结构解构',
    description: '拆解析取假设 h : P ∨ Q、合取假设 h : P ∧ Q 或存在量词 h : ∃ x, P x。',
    descriptionEn: 'Splits a disjunction h : P ∨ Q, a conjunction h : P ∧ Q, or an existential h : ∃ x, P x.',
    whenToUse: '假设中包含存在量词 ∃ 或逻辑或 ∨ 时。',
    whenToUseEn: 'Use when a hypothesis contains an existential ∃ or a disjunction ∨.',
    exampleGoal: 'h : ∃ x, x > 0 ⊢ ...',
    codeSnippet: 'obtain ⟨x, hx⟩ := h\n-- 得到具体的证人 x 以及性质 hx : x > 0',
    codeSnippetEn: 'obtain ⟨x, hx⟩ := h\n-- yields a concrete witness x together with hx : x > 0',
  },
  {
    tactic: 'by_contra',
    nameZh: '经典排中律反证法 (Proof by Contradiction)',
    nameEn: 'Proof by contradiction',
    category: '经典逻辑',
    description: '引入目标的否定假设 h : ¬P，并将当前证明目标转化为推导荒谬矛盾 ⊢ False。',
    descriptionEn: 'Introduces the negated goal h : ¬P and reduces the proof to deriving the absurdity ⊢ False.',
    whenToUse: '直接推导困难，假设其反面容易构造矛盾时。',
    whenToUseEn: 'Use when a direct derivation is hard but assuming the negation makes a contradiction easy to build.',
    exampleGoal: '⊢ P',
    codeSnippet: 'by_contra h\n-- 上下文新增 h : ¬P，新目标为 ⊢ False',
    codeSnippetEn: 'by_contra h\n-- h : ¬P is added to the context and the new goal is ⊢ False',
  },
  {
    tactic: 'constructor',
    nameZh: '合取与等价性拆分 (Split Target)',
    nameEn: 'Split conjunction / iff goals',
    category: '结构解构',
    description: '当目标为合取 ⊢ P ∧ Q 或充要条件 ⊢ P ↔ Q 时，将其拆分为两个独立的证明子分支。',
    descriptionEn: 'When the goal is a conjunction ⊢ P ∧ Q or an iff ⊢ P ↔ Q, splits it into two independent subgoals.',
    whenToUse: '目标包含 ∧ 或 ↔ 时。',
    whenToUseEn: 'Use when the goal contains ∧ or ↔.',
    exampleGoal: '⊢ P ∧ Q',
    codeSnippet: 'constructor\n-- 分支 1: ⊢ P\n-- 分支 2: ⊢ Q',
    codeSnippetEn: 'constructor\n-- branch 1: ⊢ P\n-- branch 2: ⊢ Q',
  },
];

export default function LeanTacticsDeck() {
  const { isZh } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const categories: Array<'all' | LeanTacticCard['category']> = ['all', '基础推理', '等式重写', '自动化求解', '结构解构', '经典逻辑'];

  const filteredTactics =
    selectedCategory === 'all'
      ? leanTacticsData
      : leanTacticsData.filter((t) => t.category === selectedCategory);

  const currentTactic = filteredTactics[currentIndex] || filteredTactics[0];
  const activeSnippet = isZh ? currentTactic.codeSnippet : currentTactic.codeSnippetEn;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredTactics.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredTactics.length) % filteredTactics.length);
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1500);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-sm">
              {isZh
                ? 'Lean 4 核心证明策略互动速查卡片 (Tactics Mastery Deck)'
                : 'Lean 4 Tactics Mastery Deck (interactive quick reference)'}
            </h3>
            <p className="text-xs text-slate-400">
              {isZh
                ? '交互式探索 Lean 4 最核心的 10 大推导策略，直观掌握状态机转换机制'
                : 'Explore the ten core Lean 4 proof tactics interactively and watch each one transform the proof state'}
            </p>
          </div>
        </div>

        {/* Category filter tabs */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentIndex(0);
              }}
              className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat === 'all' ? (isZh ? '全部策略' : 'All tactics') : isZh ? cat : CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Flashcard View */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        {/* Left: Tactic List Sidebar */}
        <div className="md:col-span-4 space-y-2 max-h-[340px] overflow-y-auto pr-1">
          {filteredTactics.map((t, idx) => (
            <div
              key={t.tactic}
              onClick={() => setCurrentIndex(idx)}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                currentIndex === idx
                  ? 'bg-emerald-950/40 border-emerald-500/60 shadow-lg shadow-emerald-500/10'
                  : 'bg-slate-900/50 border-slate-800/80 hover:bg-slate-900 text-slate-400'
              }`}
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-emerald-300 text-xs">{t.tactic}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-950 text-slate-400 border border-slate-800">
                    {isZh ? t.category : CATEGORY_LABELS[t.category]}
                  </span>
                </div>
                <div className="text-[11px] text-slate-300 truncate">{isZh ? t.nameZh : t.nameEn}</div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </div>
          ))}
        </div>

        {/* Right: Active Tactic Card Presentation */}
        <div className="md:col-span-8 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            {/* Header info */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="text-xl font-mono font-extrabold text-emerald-400">
                    {currentTactic.tactic}
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-medium">
                    {isZh ? currentTactic.category : CATEGORY_LABELS[currentTactic.category]}
                  </span>
                </div>
                <h4 className="font-bold text-slate-200 text-sm mt-1">{isZh ? currentTactic.nameZh : currentTactic.nameEn}</h4>
              </div>

              <span className="text-xs font-mono text-slate-500">
                {currentIndex + 1} / {filteredTactics.length}
              </span>
            </div>

            {/* Description & When to use */}
            <div className="space-y-3 text-xs">
              <p className="text-slate-300 leading-relaxed">{isZh ? currentTactic.description : currentTactic.descriptionEn}</p>
              <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-200 flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-amber-300">{isZh ? '适用证明场景：' : 'When to use: '}</span>
                  <span>{isZh ? currentTactic.whenToUse : currentTactic.whenToUseEn}</span>
                </div>
              </div>
            </div>

            {/* Code Snippet */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>{isZh ? '代码示例与目标转换 (Proof State Effect):' : 'Code sample and goal transformation (proof state effect):'}</span>
                <button
                  onClick={() => handleCopy(activeSnippet)}
                  className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 cursor-pointer"
                >
                  {copiedCode === activeSnippet ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" /> {isZh ? '已复制' : 'Copied'}
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" /> {isZh ? '复制代码' : 'Copy code'}
                    </>
                  )}
                </button>
              </div>
              <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-300 leading-relaxed overflow-x-auto">
                {activeSnippet}
              </pre>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
            <button
              onClick={handlePrev}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{isZh ? '上一张' : 'Prev'}</span>
            </button>

            <button
              onClick={handleNext}
              className="flex items-center gap-1 px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-md shadow-emerald-500/20 transition-colors cursor-pointer"
            >
              <span>{isZh ? '下一张' : 'Next'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
