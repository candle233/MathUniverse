'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Compass, Sparkles, ArrowRight, ShieldCheck, BookOpen, Clock, Layers } from 'lucide-react';

export interface TimelineEpoch {
  id: string;
  eraZh: string;
  eraEn: string;
  period: string;
  coreTheme: string;
  color: string;
  milestones: Array<{
    year: string;
    mathematician: string;
    achievementZh: string;
    achievementEn: string;
    impact: string;
    linkedNodeSlug?: string;
  }>;
}

export const mathEpochs: TimelineEpoch[] = [
  {
    id: 'epoch-classical',
    eraZh: '古希腊公理化奠基纪元',
    eraEn: 'Axiomatic Foundations Era',
    period: '公元前 500 年 — 公元 300 年',
    coreTheme: '从经验测量向严谨演绎逻辑与第一性原理公理体系跃迁',
    color: 'from-amber-500 to-yellow-600',
    milestones: [
      {
        year: 'c. 500 BC',
        mathematician: '毕达哥拉斯 (Pythagoras)',
        achievementZh: '勾股定理与无理数不可通约性发现',
        achievementEn: 'Pythagorean Theorem & Discovery of Irrationals',
        impact: '揭示了数与几何形体的深刻对偶，引发第一次数学危机。',
        linkedNodeSlug: 'pythagorean-theorem',
      },
      {
        year: 'c. 300 BC',
        mathematician: '欧几里得 (Euclid of Alexandria)',
        achievementZh: '《几何原本》公理化体系与素数无限性证明',
        achievementEn: 'Elements & Infinitude of Primes',
        impact: '人类历史上首个严谨形式化演绎推理典范，奠定两千年公理化传统。',
        linkedNodeSlug: 'infinitude-of-primes',
      },
    ],
  },
  {
    id: 'epoch-calculus',
    eraZh: '微积分发明与分析严格化革命',
    eraEn: 'Calculus & Rigorous Analysis Revolution',
    period: '1665 年 — 1860 年',
    coreTheme: '无穷小算法的发明与 ε-δ 极限严谨化重塑',
    color: 'from-cyan-500 to-blue-600',
    milestones: [
      {
        year: '1675',
        mathematician: '莱布尼茨 (Leibniz) & 牛顿 (Newton)',
        achievementZh: '微积分基本定理 (FTC) 与无穷小微商算法',
        achievementEn: 'Fundamental Theorem of Calculus',
        impact: '统一了微分切线与积分求积两大对偶问题，推动工业革命。',
        linkedNodeSlug: 'fundamental-theorem-of-calculus',
      },
      {
        year: '1748',
        mathematician: '欧拉 (Leonhard Euler)',
        achievementZh: '欧拉恒等式 e^{iπ} + 1 = 0 与无穷级数分析',
        achievementEn: "Euler's Identity & Foundations of Analysis",
        impact: '将算术、代数、几何与复分析五大基础常数完美熔于一炉。',
        linkedNodeSlug: 'eulers-identity',
      },
      {
        year: '1821',
        mathematician: '柯西 (Cauchy) & 魏尔斯特拉斯 (Weierstrass)',
        achievementZh: 'ε-δ 极限语言与实分析严格化',
        achievementEn: 'ε-δ Rigorization & Cauchy-Schwarz Inequality',
        impact: '驱散无穷小之谜，将微积分建立在严格算术化极限之上。',
        linkedNodeSlug: 'cauchy-schwarz-inequality',
      },
    ],
  },
  {
    id: 'epoch-algebra-set',
    eraZh: '近世代数与现代集合论革命',
    eraEn: 'Abstract Algebra & Set Theory Revolution',
    period: '1832 年 — 1930 年',
    coreTheme: '对称性的群论刻画、超穷基数与几何拓扑的多维展开',
    color: 'from-purple-500 to-indigo-600',
    milestones: [
      {
        year: '1832',
        mathematician: '伽罗瓦 (Évariste Galois)',
        achievementZh: '群论创立与高次代数方程根式不可解性',
        achievementEn: 'Group Theory & Galois Solvability',
        impact: '开创抽象代数先河，用对称置换群揭示代数方程根的深层结构。',
        linkedNodeSlug: 'definition-group',
      },
      {
        year: '1874',
        mathematician: '康托尔 (Georg Cantor)',
        achievementZh: '对角线反证法与超穷数理论 (|A| < |P(A)|)',
        achievementEn: 'Set Theory & Transfinite Cardinalities',
        impact: '证明了无穷亦有阶梯，创立公理集合论作为整个现代数学的大厦基石。',
        linkedNodeSlug: 'cantors-theorem',
      },
    ],
  },
  {
    id: 'epoch-formal-lean',
    eraZh: '形式化验证与计算机数学纪元',
    eraEn: 'Formal Verification & Interactive Theorem Proving',
    period: '1976 年 — 至今',
    coreTheme: '构造性类型论、范畴论与依赖类型交互式定理证明器 (Lean 4)',
    color: 'from-emerald-500 to-teal-600',
    milestones: [
      {
        year: '1976 - 2005',
        mathematician: 'Appel-Haken / Gonthier',
        achievementZh: '四色定理与开普勒猜想全形式化验证',
        achievementEn: 'Four Color Theorem & Kepler Conjecture Formal Proof',
        impact: '计算机辅助证明首次确立不可动摇的数学机器信度。',
      },
      {
        year: '2013 - 至今',
        mathematician: 'Leonardo de Moura & Mathlib 共同体',
        achievementZh: 'Lean 4 证明器与全人类数学数字化形式化进程',
        achievementEn: 'Lean 4 & Formalization of Modern Mathematics',
        impact: '将人类数学知识库转化为零算力可执行、可机械验证的形式化本体图谱。',
      },
    ],
  },
];

export default function MathTimeline() {
  const [selectedEpochId, setSelectedEpochId] = useState<string>(mathEpochs[0].id);
  const activeEpoch = mathEpochs.find((e) => e.id === selectedEpochId) || mathEpochs[0];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-sm">
              人类数学思想史演进年表与巨人之链 (Lineage of Mathematical Giants)
            </h3>
            <p className="text-xs text-slate-400">
              从古希腊公理化奠基、微积分革命、抽象代数崛起，到现代 Lean 4 形式化验证全景脉络
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-cyan-400 font-bold bg-cyan-950/40 px-3 py-1.5 rounded-xl border border-cyan-500/30">
          跨越 2500 年思想长河
        </span>
      </div>

      {/* Epoch Selection Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {mathEpochs.map((ep) => (
          <button
            key={ep.id}
            onClick={() => setSelectedEpochId(ep.id)}
            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer space-y-1 ${
              selectedEpochId === ep.id
                ? 'bg-slate-900 border-cyan-500 shadow-lg shadow-cyan-500/10'
                : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-400'
            }`}
          >
            <div className="text-[10px] font-mono text-cyan-400 font-semibold">{ep.period}</div>
            <div className="font-bold text-slate-200 text-xs">{ep.eraZh}</div>
          </button>
        ))}
      </div>

      {/* Active Epoch Detailed Milestone Timeline */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="text-lg font-bold text-slate-100">{activeEpoch.eraZh}</h4>
            <span className="text-xs text-slate-400 font-mono">({activeEpoch.eraEn})</span>
          </div>
          <p className="text-xs text-cyan-300 font-medium">🌟 纪元核心命题：{activeEpoch.coreTheme}</p>
        </div>

        {/* Milestones Flow */}
        <div className="space-y-4 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
          {activeEpoch.milestones.map((m, idx) => (
            <div key={idx} className="relative pl-9 space-y-1 group">
              {/* Timeline Dot */}
              <div className="absolute left-1.5 top-1.5 w-4 h-4 rounded-full bg-slate-950 border-2 border-cyan-400 group-hover:scale-125 transition-transform" />

              <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 hover:border-cyan-500/40 transition-all space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-400">{m.year}</span>
                    <span className="font-bold text-slate-200 text-xs">{m.mathematician}</span>
                  </div>
                  {m.linkedNodeSlug && (
                    <Link
                      href={`/node/${m.linkedNodeSlug}`}
                      className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer"
                    >
                      <span>进入知识库节点</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  )}
                </div>

                <div className="font-semibold text-cyan-200 text-xs">{m.achievementZh}</div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{m.impact}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
