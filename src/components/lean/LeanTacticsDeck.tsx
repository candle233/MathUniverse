'use client';

import React, { useState } from 'react';
import { Terminal, Copy, Check, Sparkles, BookOpen, Lightbulb, ChevronRight, ChevronLeft, Play } from 'lucide-react';
import { InlineLaTeX } from '@/components/math/LaTeXRenderer';

export interface LeanTacticCard {
  tactic: string;
  nameZh: string;
  category: '基础推理' | '等式重写' | '自动化求解' | '结构解构' | '经典逻辑';
  description: string;
  whenToUse: string;
  codeSnippet: string;
  exampleGoal: string;
}

export const leanTacticsData: LeanTacticCard[] = [
  {
    tactic: 'intro',
    nameZh: '引入假设 / 量词前件',
    category: '基础推理',
    description: '将目标中的全称量词 ∀x 或蕴含前件 P → Q 引入为当前上下文的已知假设。',
    whenToUse: '目标形式为 ∀ x, P x 或 P → Q 时作为证明的第一步。',
    exampleGoal: '⊢ P → Q',
    codeSnippet: 'intro hP\n-- 上下文新增 hP : P，目标变为 ⊢ Q',
  },
  {
    tactic: 'exact',
    nameZh: '精准匹配已知假设',
    category: '基础推理',
    description: '当上下文中的某条假设或某个引理的类型与当前证明目标完全一致时，直接闭合目标。',
    whenToUse: '上下文已有 h : P 且目标正是 ⊢ P 时。',
    exampleGoal: 'h : P ⊢ P',
    codeSnippet: 'exact h\n-- 目标直接宣告完成 🎉',
  },
  {
    tactic: 'apply',
    nameZh: '反向应用引理 / 后件反推',
    category: '基础推理',
    description: '若已知引理 h : A → B 且当前目标为 ⊢ B，执行 apply h 会将目标反向替换为子目标 ⊢ A。',
    whenToUse: '已知充分条件引理并希望将其作为证明桥梁时。',
    exampleGoal: 'h : A → B ⊢ B',
    codeSnippet: 'apply h\n-- 目标转化为子目标 ⊢ A',
  },
  {
    tactic: 'rw',
    nameZh: '等价重写 (Rewrite)',
    category: '等式重写',
    description: '利用等式假设 h : a = b 将目标或某假设中的 a 全部替换为 b (或使用 rw [← h] 反向替换)。',
    whenToUse: '目标或假设中含有可化简代换的已知等式时。',
    exampleGoal: 'h : a = b ⊢ a + c = 0',
    codeSnippet: 'rw [h]\n-- 目标重写为 ⊢ b + c = 0',
  },
  {
    tactic: 'simp',
    nameZh: '符号自动简化 (Simplifier)',
    category: '自动化求解',
    description: '调用 Mathlib 核心 simp 规则库对目标进行递归代数展开、逻辑化简与模式匹配。',
    whenToUse: '包含大量布尔逻辑、集合并交、代数群律等基础恒等式时。',
    exampleGoal: '⊢ x + 0 = x ∧ True ∧ Set.univ ∩ s = s',
    codeSnippet: 'simp\n-- 自动应用数以百计的基础化简引理',
  },
  {
    tactic: 'linarith',
    nameZh: '线性实数/有理数不等式求解器',
    category: '自动化求解',
    description: '基于傅里叶-莫茨金消元法 (Fourier-Motzkin)，自动从上下文线性不等式中导出目标或矛盾。',
    whenToUse: '涉及实数、有理数或整数的线性不等式系统 (如 2*x + y ≤ 5, x > 1 ⊢ y < 3)。',
    exampleGoal: 'h1 : a ≤ b, h2 : b < c ⊢ a < c',
    codeSnippet: 'linarith\n-- 自动完成多变量线性规划推导',
  },
  {
    tactic: 'ring',
    nameZh: '多项式交换环代数等式求解器',
    category: '自动化求解',
    description: '在任何交换半环 (Commutative Semiring) 上展开多项式并验证两端形式恒等。',
    whenToUse: '展开复杂的代数多项式，如 (a + b)^2 = a^2 + 2*a*b + b^2。',
    exampleGoal: '⊢ (x + y) * (x - y) = x^2 - y^2',
    codeSnippet: 'ring\n-- 自动标准化为多项式典范形式',
  },
  {
    tactic: 'rcases / obtain',
    nameZh: '结构解构与存在量词拆解',
    category: '结构解构',
    description: '拆解析取假设 h : P ∨ Q、合取假设 h : P ∧ Q 或存在量词 h : ∃ x, P x。',
    whenToUse: '假设中包含存在量词 ∃ 或逻辑或 ∨ 时。',
    exampleGoal: 'h : ∃ x, x > 0 ⊢ ...',
    codeSnippet: 'obtain ⟨x, hx⟩ := h\n-- 得到具体的证人 x 以及性质 hx : x > 0',
  },
  {
    tactic: 'by_contra',
    nameZh: '经典排中律反证法 (Proof by Contradiction)',
    category: '经典逻辑',
    description: '引入目标的否定假设 h : ¬P，并将当前证明目标转化为推导荒谬矛盾 ⊢ False。',
    whenToUse: '直接推导困难，假设其反面容易构造矛盾时。',
    exampleGoal: '⊢ P',
    codeSnippet: 'by_contra h\n-- 上下文新增 h : ¬P，新目标为 ⊢ False',
  },
  {
    tactic: 'constructor',
    nameZh: '合取与等价性拆分 (Split Target)',
    category: '结构解构',
    description: '当目标为合取 ⊢ P ∧ Q 或充要条件 ⊢ P ↔ Q 时，将其拆分为两个独立的证明子分支。',
    whenToUse: '目标包含 ∧ 或 ↔ 时。',
    exampleGoal: '⊢ P ∧ Q',
    codeSnippet: 'constructor\n-- 分支 1: ⊢ P\n-- 分支 2: ⊢ Q',
  },
];

export default function LeanTacticsDeck() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const categories = ['all', '基础推理', '等式重写', '自动化求解', '结构解构', '经典逻辑'];

  const filteredTactics =
    selectedCategory === 'all'
      ? leanTacticsData
      : leanTacticsData.filter((t) => t.category === selectedCategory);

  const currentTactic = filteredTactics[currentIndex] || filteredTactics[0];

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
              Lean 4 核心证明策略互动速查卡片 (Tactics Mastery Deck)
            </h3>
            <p className="text-xs text-slate-400">
              交互式探索 Lean 4 最核心的 10 大推导策略，直观掌握状态机转换机制
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
              {cat === 'all' ? '全部策略' : cat}
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
                    {t.category}
                  </span>
                </div>
                <div className="text-[11px] text-slate-300 truncate">{t.nameZh}</div>
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
                    {currentTactic.category}
                  </span>
                </div>
                <h4 className="font-bold text-slate-200 text-sm mt-1">{currentTactic.nameZh}</h4>
              </div>

              <span className="text-xs font-mono text-slate-500">
                {currentIndex + 1} / {filteredTactics.length}
              </span>
            </div>

            {/* Description & When to use */}
            <div className="space-y-3 text-xs">
              <p className="text-slate-300 leading-relaxed">{currentTactic.description}</p>
              <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-200 flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-amber-300">适用证明场景：</span>
                  <span>{currentTactic.whenToUse}</span>
                </div>
              </div>
            </div>

            {/* Code Snippet */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>代码示例与目标转换 (Proof State Effect):</span>
                <button
                  onClick={() => handleCopy(currentTactic.codeSnippet)}
                  className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 cursor-pointer"
                >
                  {copiedCode === currentTactic.codeSnippet ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" /> 已复制
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" /> 复制代码
                    </>
                  )}
                </button>
              </div>
              <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-300 leading-relaxed overflow-x-auto">
                {currentTactic.codeSnippet}
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
              <span>上一张</span>
            </button>

            <button
              onClick={handleNext}
              className="flex items-center gap-1 px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-md shadow-emerald-500/20 transition-colors cursor-pointer"
            >
              <span>下一张</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
