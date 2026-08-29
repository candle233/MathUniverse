'use client';

import React, { useState } from 'react';
import { Sparkles, Terminal, CheckCircle2, Play, RotateCcw, HelpCircle, Code2, ArrowRight } from 'lucide-react';

interface TacticScenario {
  id: string;
  name: string;
  statement: string;
  initialHypotheses: Array<{ name: string; type: string }>;
  initialTarget: string;
  steps: Array<{
    tactic: string;
    description: string;
    resultHypotheses: Array<{ name: string; type: string }>;
    resultTarget: string;
    isCompleted?: boolean;
  }>;
}

export const tacticScenarios: TacticScenario[] = [
  {
    id: 'prop-and-intro',
    name: '命题逻辑：合取引入 (P → Q → P ∧ Q)',
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
        resultHypotheses: [
          { name: 'h', type: 'P ∨ Q' },
        ],
        resultTarget: 'Q ∨ P',
      },
      {
        tactic: 'rcases h with hP | hQ',
        description: '对析取命题进行分情况讨论 (Case Analysis)',
        resultHypotheses: [
          { name: 'case 1 (hP)', type: 'hP : P ⊢ Q ∨ P' },
          { name: 'case 2 (hQ)', type: 'hQ : Q ⊢ Q ∨ P' },
        ],
        resultTarget: '· exact Or.inr hP\n· exact Or.inl hQ',
      },
      {
        tactic: 'exact Or.inr hP',
        description: '完成全部子目标验证',
        resultHypotheses: [],
        resultTarget: 'Goals accomplished! 🎉',
        isCompleted: true,
      },
    ],
  },
  {
    id: 'nat-add-zero',
    name: '皮亚诺算术：零元恒等式 (n + 0 = n)',
    statement: 'theorem nat_add_zero (n : ℕ) : n + 0 = n',
    initialHypotheses: [
      { name: 'n', type: 'ℕ' },
    ],
    initialTarget: 'n + 0 = n',
    steps: [
      {
        tactic: 'rfl',
        description: '依加法定义，n + 0 规约为定义等价 (Definitional Equality)，通过反射律直接关闭证明',
        resultHypotheses: [
          { name: 'n', type: 'ℕ' },
        ],
        resultTarget: 'Goals accomplished! 🎉',
        isCompleted: true,
      },
    ],
  },
];

export default function LeanTacticSimulator() {
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
              证明策略状态机模拟器 (Demo · 模拟 Lean 4 状态机)
            </h3>
            <p className="text-xs text-slate-400">
              交互式演示每一步策略（intro / rw / rcases / exact）如何实时转换上下文假设与目标
            </p>
          </div>
        </div>

        {/* Scenario Switcher */}
        <div className="flex items-center gap-1.5">
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
              {sc.name.split('：')[0]}
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
            <span>策略执行链条 (Tactics Sequence):</span>
            <button
              onClick={handleReset}
              className="text-[11px] text-slate-500 hover:text-slate-300 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /> 重置证明
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
                  <p className="text-[11px] text-slate-400 font-sans">{step.description}</p>
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
              <span>执行下一步策略 ({scenario.steps[currentStepIdx + 1]?.tactic})</span>
            </button>
          )}
        </div>

        {/* Right: Live Proof State Window */}
        <div className="md:col-span-6 space-y-4">
          <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Code2 className="w-4 h-4 text-emerald-400" />
            <span>演示：模拟的证明状态（非真实 LSP）</span>
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
                <span className="text-slate-600 text-[11px]">无上下文假设</span>
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
