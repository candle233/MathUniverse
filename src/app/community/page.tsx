'use client';

import React from 'react';
import PullRequestViewer from '@/components/community/PullRequestViewer';
import SubmitPrModal from '@/components/community/SubmitPrModal';
import MathPracticeHub from '@/components/math/MathPracticeHub';
import ZfcCampaignQuest from '@/components/math/ZfcCampaignQuest';
import FallacyDetectiveLab from '@/components/math/FallacyDetectiveLab';
import { GitPullRequest, Trophy, ShieldCheck, Award, Star, Users } from 'lucide-react';

const topScholars = [
  { rank: 1, name: 'Henri Poincaré', reputation: 21000, proofs: 42, role: '代数拓扑首席评审', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100' },
  { rank: 2, name: 'Pierre de Fermat', reputation: 19200, proofs: 38, role: '数论领域专家', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
  { rank: 3, name: 'Évariste Galois', reputation: 18900, proofs: 29, role: '抽象代数评审', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100' },
  { rank: 4, name: 'Joseph-Louis Lagrange', reputation: 17500, proofs: 35, role: '分析与群论专家', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100' },
  { rank: 5, name: 'Gottfried Leibniz', reputation: 16800, proofs: 45, role: '微积分奠基评审', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' },
];

export default function CommunityPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <GitPullRequest className="w-4 h-4" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
              同行评审 PR 演示 (Demo · Local Drafts Only)
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            演示模式：没有真实后端、声望系统或评审委员会。提交的 PR 草稿仅存于本机 localStorage。
          </p>
        </div>

        {/* Submit PR Action Button */}
        <SubmitPrModal />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: PR Viewer */}
        <div className="lg:col-span-8 space-y-6">
          <PullRequestViewer />
        </div>

        {/* Right Column: Scholar Leaderboard & Rules */}
        <div className="lg:col-span-4 space-y-6">
          {/* Sample leaderboard (demo data — no real reputation backend exists) */}
          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-950 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-bold text-slate-100 text-sm flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>示例学者榜 (Demo Data)</span>
              </h3>
              <span className="text-[11px] text-slate-500">仅为占位条目</span>
            </div>

            <div className="space-y-3">
              {topScholars.map((s) => (
                <div key={s.rank} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-5 h-5 rounded-full font-mono font-bold flex items-center justify-center text-[11px] ${
                      s.rank === 1 ? 'bg-amber-500 text-slate-950' : s.rank === 2 ? 'bg-slate-300 text-slate-950' : s.rank === 3 ? 'bg-amber-700 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {s.rank}
                    </span>
                    <div>
                      <h4 className="font-bold text-slate-200">{s.name}</h4>
                      <p className="text-[10px] text-slate-400">{s.role}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-amber-400 font-mono font-bold">{s.reputation.toLocaleString()} ★</span>
                    <p className="text-[10px] text-slate-500 font-mono">{s.proofs} 份贡献</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reputation Rules Card (demo: not actually applied anywhere) */}
          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-950 space-y-3 text-xs shadow-xl">
            <h3 className="font-bold text-slate-100 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-purple-400" />
              <span>声望规则示意 (Demo · 实际未启用)</span>
            </h3>
            <p className="text-[11px] text-slate-500">
              下列规则仅为说明示例，没有可累加的真实声望系统；当前演示不记录用户贡献。
            </p>
            <ul className="space-y-2 text-slate-400">
              <li className="flex items-center justify-between p-2 rounded-lg bg-slate-900/50">
                <span>提交并合并新的严谨证明（示意）</span>
                <span className="text-slate-500 font-mono">+50 ★</span>
              </li>
              <li className="flex items-center justify-between p-2 rounded-lg bg-slate-900/50">
                <span>完成 Lean 4 机器形式化验证（示意）</span>
                <span className="text-slate-500 font-mono">+100 ★</span>
              </li>
              <li className="flex items-center justify-between p-2 rounded-lg bg-slate-900/50">
                <span>提出被采纳的直觉与几何动机（示意）</span>
                <span className="text-slate-500 font-mono">+25 ★</span>
              </li>
              <li className="flex items-center justify-between p-2 rounded-lg bg-slate-900/50">
                <span>参与 PR 同行评审与投票（示意）</span>
                <span className="text-slate-500 font-mono">+10 ★</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Interactive Mathematical Practice Arena */}
      <MathPracticeHub />

      {/* ZFC to Modern Math RPG Campaign */}
      <ZfcCampaignQuest />

      {/* Mathematical Fallacy Detective Lab */}
      <FallacyDetectiveLab />
    </div>
  );
}
