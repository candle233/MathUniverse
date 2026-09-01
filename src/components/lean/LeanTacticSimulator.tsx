'use client';

import React, { useState } from 'react';
import { Sparkles, Terminal, CheckCircle2, Play, RotateCcw, HelpCircle, Code2, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface TacticScenario {
  id: string;
  name: string;
  nameEn: string;
  statement: string;
  initialHypotheses: Array<{ name: string; type: string }>;
  initialTarget: string;
  steps: Array<{
    tactic: string;
    description: string;
    descriptionEn: string;
    resultHypotheses: Array<{ name: string; type: string }>;
    resultTarget: string;
    isCompleted?: boolean;
  }>;
}

export const tacticScenarios: TacticScenario[] = [
  {
    id: 'prop-and-intro',
    name: '命题逻辑：合取引入 (P → Q → P ∧ Q)',
    nameEn: 'Propositional logic: conjunction intro (P → Q → P ∧ Q)',
    statement: 'theorem and_intro (P Q : Prop) : P → Q → P ∧ Q',
    initialHypotheses: [
      { name: 'P', type: 'Prop' },
      { name: 'Q', type: 'Prop' },
    ],
    initialTarget: 'P → Q → P ∧ Q',
    steps: [
      {
        tactic: 'intro hP hQ',
        description: '将蕴含式的前件引入为局部假设 hP : P 与 hQ : Q',
        descriptionEn: 'Introduces the antecedents of the implication as the local hypotheses hP : P and hQ : Q',
        resultHypotheses: [
          { name: 'P', type: 'Prop' },
          { name: 'Q', type: 'Prop' },
          { name: 'hP', type: 'P' },
          { name: 'hQ', type: 'Q' },
        ],
        resultTarget: 'P ∧ Q',
      },
      {
        tactic: 'exact ⟨hP, hQ⟩',
        description: '以合取构造子 ⟨hP, hQ⟩ 直接封闭目标项',
        descriptionEn: 'Closes the goal term directly with the conjunction constructor ⟨hP, hQ⟩',
        resultHypotheses: [
          { name: 'hP', type: 'P' },
          { name: 'hQ', type: 'Q' },
        ],
        resultTarget: 'Goals accomplished! 🎉',
        isCompleted: true,
      },
    ],
  },
  {
    id: 'prop-or-comm',
    name: '析取对称性：(P ∨ Q → Q ∨ P)',
    nameEn: 'Disjunction symmetry (P ∨ Q → Q ∨ P)',
    statement: 'theorem or_comm (P Q : Prop) : P ∨ Q → Q ∨ P',
    initialHypotheses: [
      { name: 'P', type: 'Prop' },
      { name: 'Q', type: 'Prop' },
    ],
    initialTarget: 'P ∨ Q → Q ∨ P',
    steps: [
      {
        tactic: 'intro h',
        description: '引入析取假设 h : P ∨ Q',
        descriptionEn: 'Introduces the disjunction hypothesis h : P ∨ Q',
        resultHypotheses: [
          { name: 'h', type: 'P ∨ Q' },
        ],
        resultTarget: 'Q ∨ P',
      },
      {
        tactic: 'rcases h with hP | hQ',
        description: '对析取命题进行分情况讨论 (Case Analysis)',
        descriptionEn: 'Splits the disjunction into cases (case analysis)',
        resultHypotheses: [
          { name: 'case 1 (hP)', type: 'hP : P ⊢ Q ∨ P' },
          { name: 'case 2 (hQ)', type: 'hQ : Q ⊢ Q ∨ P' },
        ],
        resultTarget: '· exact Or.inr hP\n· exact Or.inl hQ',
      },
      {
        tactic: 'exact Or.inr hP',
        description: '完成全部子目标验证',
        descriptionEn: 'Discharges the remaining subgoal',
        resultHypotheses: [],
        resultTarget: 'Goals accomplished! 🎉',
        isCompleted: true,
      },
    ],
  },
  {
    id: 'nat-add-zero',
    name: '皮亚诺算术：零元恒等式 (n + 0 = n)',
    nameEn: 'Peano arithmetic: additive identity (n + 0 = n)',
    statement: 'theorem nat_add_zero (n : ℕ) : n + 0 = n',
    initialHypotheses: [
      { name: 'n', type: 'ℕ' },
    ],
    initialTarget: 'n + 0 = n',
    steps: [
      {
        tactic: 'rfl',
        description: '依加法定义，n + 0 规约为定义等价 (Definitional Equality)，通过反射律直接关闭证明',
        descriptionEn: 'By the definition of addition, n + 0 reduces by definitional equality, so reflexivity closes the proof directly',
        resultHypotheses: [
          { name: 'n', type: 'ℕ' },
        ],
        resultTarget: 'Goals accomplished! 🎉',
        isCompleted: true,
      },
    ],
  },
  {
    id: 'topology-limit-unique',
    name: '拓扑空间：Hausdorff 空间极限唯一性',
    nameEn: 'Topology: Uniqueness of limits in T2 space',
    statement: 'theorem limit_unique [TopologicalSpace α] [T2Space α] (h₁ : Tendsto f atTop (𝓝 l₁)) (h₂ : Tendsto f atTop (𝓝 l₂)) : l₁ = l₂',
    initialHypotheses: [
      { name: 'α', type: 'Type*' },
      { name: '[T2Space α]', type: 'Hausdorff separation' },
      { name: 'f', type: 'ℕ → α' },
      { name: 'l₁, l₂', type: 'α' },
    ],
    initialTarget: 'Tendsto f atTop (𝓝 l₁) → Tendsto f atTop (𝓝 l₂) → l₁ = l₂',
    steps: [
      {
        tactic: 'intro h₁ h₂',
        description: '引入两极限收敛假设 h₁ 与 h₂ 到局部上下文',
        descriptionEn: 'Introduces the convergence hypotheses h₁ and h₂ into the local context',
        resultHypotheses: [
          { name: 'h₁', type: 'Tendsto f atTop (𝓝 l₁)' },
          { name: 'h₂', type: 'Tendsto f atTop (𝓝 l₂)' },
        ],
        resultTarget: 'l₁ = l₂',
      },
      {
        tactic: 'exact tendsto_nhds_unique h₁ h₂',
        description: '直接调用 Mathlib Hausdorff 分离定理 tendsto_nhds_unique 封闭证明',
        descriptionEn: 'Applies Mathlib Hausdorff uniqueness lemma tendsto_nhds_unique to close goal',
        resultHypotheses: [],
        resultTarget: 'Goals accomplished! 🎉 (Q.E.D.)',
        isCompleted: true,
      },
    ],
  },
  {
    id: 'algebra-group-inv-inv',
    name: '近世代数：群双重逆元恒等式 ((g⁻¹)⁻¹ = g)',
    nameEn: 'Abstract algebra: double inverse identity ((g⁻¹)⁻¹ = g)',
    statement: 'theorem inv_inv_eq [Group G] (g : G) : (g⁻¹)⁻¹ = g',
    initialHypotheses: [
      { name: 'G', type: 'Type*' },
      { name: '[Group G]', type: 'Group structure' },
      { name: 'g', type: 'G' },
    ],
    initialTarget: '(g⁻¹)⁻¹ = g',
    steps: [
      {
        tactic: 'have h : (g⁻¹)⁻¹ * g⁻¹ = 1 := inv_mul_cancel (g⁻¹)',
        description: '建立逆元左乘单位元引理 h : (g⁻¹)⁻¹ * g⁻¹ = 1',
        descriptionEn: 'Establishes the left-inverse identity lemma h',
        resultHypotheses: [
          { name: 'g', type: 'G' },
          { name: 'h', type: '(g⁻¹)⁻¹ * g⁻¹ = 1' },
        ],
        resultTarget: '(g⁻¹)⁻¹ = g',
      },
      {
        tactic: 'rw [← mul_one (g⁻¹)⁻¹, ← mul_inv_cancel g, ← mul_assoc, h, one_mul]',
        description: '连续重写结合律与单位元公理消去中间项',
        descriptionEn: 'Successively rewrites associativity and identity axioms to simplify',
        resultHypotheses: [],
        resultTarget: 'Goals accomplished! 🎉 (Q.E.D.)',
        isCompleted: true,
      },
    ],
  },
];

export default function LeanTacticSimulator() {
  const { isZh } = useLanguage();
  const [selectedScenarioIdx, setSelectedScenarioIdx] = useState(0);
  const [currentStepIdx, setCurrentStepIdx] = useState(-1);

  const scenario = tacticScenarios[selectedScenarioIdx];

  const currentHypotheses =
    currentStepIdx === -1
      ? scenario.initialHypotheses
      : scenario.steps[currentStepIdx].resultHypotheses;

  const currentTarget =
    currentStepIdx === -1
      ? scenario.initialTarget
      : scenario.steps[currentStepIdx].resultTarget;

  const isComplete =
    currentStepIdx >= 0 && scenario.steps[currentStepIdx].isCompleted;

  const handleApplyNext = () => {
    if (currentStepIdx < scenario.steps.length - 1) {
      setCurrentStepIdx((idx) => idx + 1);
    }
  };

  const handleReset = () => {
    setCurrentStepIdx(-1);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-sm">
              {isZh
                ? '证明策略状态机模拟器 (Demo · 模拟 Lean 4 状态机)'
                : 'Proof Tactic State Machine Simulator (Demo · simulated Lean 4)'}
            </h3>
            <p className="text-xs text-slate-400">
              {isZh
                ? '交互式演示每一步策略（intro / rw / rcases / exact）如何实时转换上下文假设与目标'
                : 'Interactive demo of how each tactic (intro / rw / rcases / exact) transforms the context hypotheses and goal in real time'}
            </p>
          </div>
        </div>

        {/* Scenario Switcher */}
        <div className="flex flex-wrap items-center gap-1.5">
          {tacticScenarios.map((sc, idx) => (
            <button
              key={sc.id}
              onClick={() => {
                setSelectedScenarioIdx(idx);
                setCurrentStepIdx(-1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedScenarioIdx === idx
                  ? 'bg-teal-500 text-slate-950 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              {(isZh ? sc.name : sc.nameEn).split(isZh ? '：' : ':')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Theorem Header */}
      <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono text-cyan-300">
        <code>{scenario.statement}</code>
      </div>

      {/* Main Proof State Screen */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left: Tactic Step Execution */}
        <div className="md:col-span-6 space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span>{isZh ? '策略执行链条 (Tactics Sequence):' : 'Tactic sequence:'}</span>
            <button
              onClick={handleReset}
              className="text-[11px] text-slate-500 hover:text-slate-300 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /> {isZh ? '重置证明' : 'Reset proof'}
            </button>
          </div>

          <div className="space-y-2">
            {scenario.steps.map((step, idx) => {
              const isExecuted = idx <= currentStepIdx;
              const isCurrent = idx === currentStepIdx;

              return (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isCurrent
                      ? 'bg-teal-950/40 border-teal-500/50 text-teal-200 shadow-md shadow-teal-500/10'
                      : isExecuted
                      ? 'bg-slate-900/60 border-slate-700/60 text-slate-300'
                      : 'bg-slate-950/40 border-slate-800/40 text-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-xs font-bold mb-1">
                    <span className={isExecuted ? 'text-teal-400' : 'text-slate-500'}>
                      {idx + 1}. {step.tactic}
                    </span>
                    {isExecuted && <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />}
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans">{isZh ? step.description : step.descriptionEn}</p>
                </div>
              );
            })}
          </div>

          {!isComplete && (
            <button
              onClick={handleApplyNext}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20 transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{isZh ? '执行下一步策略' : 'Run next tactic'} ({scenario.steps[currentStepIdx + 1]?.tactic})</span>
            </button>
          )}
        </div>

        {/* Right: Live Proof State Window */}
        <div className="md:col-span-6 space-y-4">
          <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Code2 className="w-4 h-4 text-emerald-400" />
            <span>{isZh ? '演示：模拟的证明状态（非真实 LSP）' : 'Demo: simulated proof state (not a real LSP)'}</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-4 shadow-inner min-h-[220px]">
            {/* Hypotheses */}
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-500 block mb-1">
                Context Hypotheses:
              </span>
              {currentHypotheses.length > 0 ? (
                <div className="space-y-1">
                  {currentHypotheses.map((h, i) => (
                    <div key={i} className="text-slate-300 flex items-center gap-2">
                      <span className="text-purple-400 font-bold">{h.name}</span>
                      <span className="text-slate-600">:</span>
                      <span className="text-cyan-300">{h.type}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-slate-600 text-[11px]">{isZh ? '无上下文假设' : 'No context hypotheses'}</span>
              )}
            </div>

            <div className="border-t border-slate-800 pt-3">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 block mb-1">
                Target Goal:
              </span>
              <div
                className={`p-2.5 rounded-lg border text-xs ${
                  isComplete
                    ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300 font-bold flex items-center gap-2'
                    : 'bg-slate-900 border-slate-800 text-amber-300'
                }`}
              >
                {isComplete && <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />}
                <span>{currentTarget}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
