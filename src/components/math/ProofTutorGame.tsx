'use client';

import React, { useState } from 'react';
import { InlineLaTeX } from '@/components/math/LaTeXRenderer';
import { Trophy, CheckCircle2, XCircle, HelpCircle, Sparkles, RotateCcw, ArrowRight, Award } from 'lucide-react';

interface ProofChallenge {
  id: string;
  title: string;
  theoremLatex: string;
  goal: string;
  steps: Array<{
    stepNumber: number;
    prompt: string;
    options: Array<{
      id: string;
      text: string;
      latex?: string;
      isCorrect: boolean;
      explanation: string;
    }>;
  }>;
}

export const proofChallenges: ProofChallenge[] = [
  {
    id: 'challenge-cauchy-schwarz',
    title: '柯西-施瓦茨不等式形式化推导挑战',
    theoremLatex: '|\\langle u, v \\rangle|^2 \\le \\langle u, u \\rangle \\cdot \\langle v, v \\rangle',
    goal: '在实内积空间 V 中，利用内积正定性证明柯西不等式',
    steps: [
      {
        stepNumber: 1,
        prompt: '第一步：为了利用内积的正定性 \\(\\langle w, w \\rangle \\ge 0\\)，我们应当构造怎样的一个关于实参数 \\(t\\) 的向量？',
        options: [
          {
            id: 'opt-1a',
            text: '构造关于参数 t 的差向量 w = u - t v',
            latex: 'w = u - tv \\implies \\|u - tv\\|^2 \\ge 0',
            isCorrect: true,
            explanation: '正确！利用实参数 t 线性组合可构造关于 t 的一元二次非负函数。',
          },
          {
            id: 'opt-1b',
            text: '直接展开 \\(\\langle u+v, u+v \\rangle\\)',
            isCorrect: false,
            explanation: '错误。直接展开只能得到 \\|u+v\\|^2 = \\|u\\|^2 + 2\\langle u,v \\rangle + \\|v\\|^2，无法导出乘积不等式。',
          },
          {
            id: 'opt-1c',
            text: '假设向量 u 与 v 互相正交',
            isCorrect: false,
            explanation: '错误。正交只是极特殊的情形，不能作为一般性证明的起点。',
          },
        ],
      },
      {
        stepNumber: 2,
        prompt: '第二步：展开范数平方 \\(f(t) = \\|u - tv\\|^2 = \\langle u-tv, u-tv \\rangle\\)，得到的关于 \\(t\\) 的二次函数表达式是什么？',
        options: [
          {
            id: 'opt-2a',
            text: '标准二次型：At^2 + Bt + C',
            latex: 'f(t) = \\langle v,v \\rangle t^2 - 2\\langle u,v \\rangle t + \\langle u,u \\rangle \\ge 0',
            isCorrect: true,
            explanation: '正确！由内积的双线性性，展开得 A = \\|v\\|^2, B = -2\\langle u,v \\rangle, C = \\|u\\|^2。',
          },
          {
            id: 'opt-2b',
            text: 'f(t) = t^2 (u \\cdot v) + t(u+v)',
            isCorrect: false,
            explanation: '错误。内积展开并不包含单纯的向量求和项。',
          },
        ],
      },
      {
        stepNumber: 3,
        prompt: '第三步：因为对任意实数 \\(t\\)，二次函数 \\(f(t) \\ge 0\\) 恒非负，该多项式的判别式 \\(\\Delta = B^2 - 4AC\\) 必须满足什么条件？',
        options: [
          {
            id: 'opt-3a',
            text: '判别式必有 Delta <= 0',
            latex: '\\Delta = 4|\\langle u,v \\rangle|^2 - 4\\|u\\|^2\\|v\\|^2 \\le 0 \\implies |\\langle u,v \\rangle|^2 \\le \\|u\\|^2\\|v\\|^2',
            isCorrect: true,
            explanation: '完美通关！函数图象恒在 x 轴上方或与 x 轴相切，判别式小于等于 0 导出柯西-施瓦茨不等式！',
          },
          {
            id: 'opt-3b',
            text: '判别式 Delta > 0',
            isCorrect: false,
            explanation: '错误。若 Delta > 0 则二次方程有两个相异实根，图像会穿越 x 轴导致部分区域为负值，与正定性矛盾。',
          },
        ],
      },
    ],
  },
  {
    id: 'challenge-lagrange',
    title: '拉格朗日群论定理陪集划分推导挑战',
    theoremLatex: '|G| = [G : H] \\cdot |H|',
    goal: '证明有限群 G 的子群 H 的阶整除群阶 |G|',
    steps: [
      {
        stepNumber: 1,
        prompt: '第一步：在群 G 上定义元素间的哪种等价关系？',
        options: [
          {
            id: 'lag-1a',
            text: '同余等价关系 a ~ b <=> a^-1 b in H',
            latex: 'a \\sim b \\iff a^{-1}b \\in H',
            isCorrect: true,
            explanation: '正确！该等价关系将群 G 完全划分为左陪集 aH 的不相交之并。',
          },
          {
            id: 'lag-1b',
            text: '定义 a ~ b <=> ab = e',
            isCorrect: false,
            explanation: '错误。这只能配对互逆元素，不能形成子群陪集划分。',
          },
        ],
      },
      {
        stepNumber: 2,
        prompt: '第二步：如何证明每个左陪集 \\(aH\\) 的元素个数严格等于 \\(|H|\\)？',
        options: [
          {
            id: 'lag-2a',
            text: '构造映射 h |-> ah，由群中左消去律证明其为双射 (Bijection)',
            latex: '\\phi: H \\to aH, \\; h \\mapsto ah \\implies |aH| = |H|',
            isCorrect: true,
            explanation: '正确！左乘 a 构成集合间的双射，故所有陪集大小相同。',
          },
          {
            id: 'lag-2b',
            text: '直接使用抽屉原理',
            isCorrect: false,
            explanation: '错误。需要严格建立双射映射并验证单射与满射。',
          },
        ],
      },
    ],
  },
];

export default function ProofTutorGame() {
  const [activeChallengeIdx, setActiveChallengeIdx] = useState(0);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const challenge = proofChallenges[activeChallengeIdx];
  const step = challenge.steps[currentStepIdx];

  const handleSelectOption = (optId: string) => {
    if (isAnswered) return;
    setSelectedOptionId(optId);
    setIsAnswered(true);

    const chosen = step.options.find((o) => o.id === optId);
    if (chosen?.isCorrect) {
      setScore((s) => s + 100);
    }
  };

  const handleNextStep = () => {
    if (currentStepIdx < challenge.steps.length - 1) {
      setCurrentStepIdx((idx) => idx + 1);
      setSelectedOptionId(null);
      setIsAnswered(false);
    } else {
      setCompleted(true);
    }
  };

  const handleReset = () => {
    setCurrentStepIdx(0);
    setSelectedOptionId(null);
    setIsAnswered(false);
    setCompleted(false);
    setScore(0);
  };

  const switchChallenge = (idx: number) => {
    setActiveChallengeIdx(idx);
    handleReset();
  };

  const chosenOption = step?.options.find((o) => o.id === selectedOptionId);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-sm">
              形式化证明交互式推导闯关 (Interactive Proof Tutor Game)
            </h3>
            <p className="text-xs text-slate-400">
              扮演数学家，在每一步逻辑推导中选择正确的引理与策略，完成定理严格机器验证
            </p>
          </div>
        </div>

        {/* Score & Challenge Switcher */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold">
            得分: {score} pts
          </div>
          <div className="flex items-center gap-1.5">
            {proofChallenges.map((c, idx) => (
              <button
                key={c.id}
                onClick={() => switchChallenge(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeChallengeIdx === idx
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                {c.title.split('形式化')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Theorem Header */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-300 font-bold">{challenge.title}</span>
          <span className="text-slate-500 font-mono">
            Step {currentStepIdx + 1} of {challenge.steps.length}
          </span>
        </div>
        <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 text-cyan-200 text-center font-mono text-xs">
          <InlineLaTeX formula={challenge.theoremLatex} displayMode={true} />
        </div>
        <p className="text-xs text-slate-400">{challenge.goal}</p>
      </div>

      {/* Game Step Area */}
      {!completed ? (
        <div className="space-y-4">
          <div className="text-sm font-semibold text-slate-200 leading-relaxed">
            {step.prompt}
          </div>

          {/* Options Grid */}
          <div className="space-y-3">
            {step.options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              let btnStyle = 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-200';

              if (isAnswered) {
                if (opt.isCorrect) {
                  btnStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 shadow-md shadow-emerald-500/20';
                } else if (isSelected && !opt.isCorrect) {
                  btnStyle = 'bg-rose-950/60 border-rose-500 text-rose-200';
                } else {
                  btnStyle = 'bg-slate-950/40 border-slate-800/60 text-slate-500';
                }
              }

              return (
                <div
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer text-xs space-y-2 ${btnStyle}`}
                >
                  <div className="flex items-center justify-between font-medium">
                    <span>{opt.text}</span>
                    {isAnswered && opt.isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    {isAnswered && isSelected && !opt.isCorrect && <XCircle className="w-4 h-4 text-rose-400" />}
                  </div>

                  {opt.latex && (
                    <div className="p-2 bg-slate-950 rounded border border-slate-800 text-cyan-300 font-mono overflow-x-auto">
                      <InlineLaTeX formula={opt.latex} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Explanation Banner */}
          {isAnswered && chosenOption && (
            <div
              className={`p-4 rounded-xl text-xs space-y-1 animate-in fade-in ${
                chosenOption.isCorrect
                  ? 'bg-emerald-950/30 border border-emerald-500/40 text-emerald-200'
                  : 'bg-rose-950/30 border border-rose-500/40 text-rose-200'
              }`}
            >
              <div className="font-bold flex items-center gap-1.5">
                {chosenOption.isCorrect ? (
                  <>
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>推导正确！(+100 分)</span>
                  </>
                ) : (
                  <>
                    <HelpCircle className="w-4 h-4 text-rose-400" />
                    <span>推导有误</span>
                  </>
                )}
              </div>
              <p className="leading-relaxed text-slate-300">{chosenOption.explanation}</p>
            </div>
          )}

          {/* Next Button */}
          {isAnswered && (
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleNextStep}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
              >
                <span>{currentStepIdx < challenge.steps.length - 1 ? '进入下一步推导' : '完成通关'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Completed Celebration Screen */
        <div className="p-8 rounded-2xl bg-slate-900/80 border border-amber-500/40 text-center space-y-4 animate-in zoom-in-95">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto">
            <Award className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-100">🎉 恭喜通关！完成形式化推导</h3>
          <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
            你已成功完成 {challenge.title} 的所有演绎步骤。获得数学形式化掌握勋章与 {score} 点声望奖励！
          </p>
          <div className="pt-2">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>重新挑战本定理</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
