'use client';

import React, { useState } from 'react';
import { PullRequest } from '@/types/math';
import { GitPullRequest, CheckCircle, XCircle, MessageSquare, ThumbsUp, ShieldCheck, Clock, User, ArrowRight } from 'lucide-react';
import { InlineLaTeX } from '@/components/math/LaTeXRenderer';
import { useLanguage } from '@/context/LanguageContext';

// Local demo shape: the mock PR data carries extra EN display fields alongside
// the zh fields required by the shared PullRequest type.
interface MockPullRequest extends PullRequest {
  nodeTitleEn: string;
  titleEn: string;
  descriptionEn: string;
  reviewers: Array<PullRequest['reviewers'][number] & { commentEn?: string }>;
}

const mockPullRequests: MockPullRequest[] = [
  {
    id: 'pr-101',
    nodeId: 'thm-cauchy-schwarz',
    nodeTitle: '柯西-施瓦茨不等式',
    nodeTitleEn: 'Cauchy–Schwarz Inequality',
    author: {
      id: 'u-cauchy',
      name: 'Augustin Cauchy',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
      reputation: 14200,
    },
    title: '添加复内积空间中的共轭对称性严谨证明',
    titleEn: 'Add a rigorous conjugate-symmetry proof for complex inner product spaces',
    description: '原证明仅覆盖了实内积空间，本 PR 补充了复数域上的共轭二次型展开，确保在完备复 Hilbert 空间中依然成立。',
    descriptionEn: 'The original proof covers only real inner product spaces; this PR adds the conjugate quadratic-form expansion over the complex field, so the inequality also holds in complete complex Hilbert spaces.',
    status: 'OPEN',
    createdAt: '2026-08-24 14:30',
    diff: {
      field: 'proof',
      oldValue: `\\langle u, v \\rangle = \\langle v, u \\rangle \\implies \\Delta = B^2 - 4AC \\le 0`,
      newValue: `\\langle u, v \\rangle = \\overline{\\langle v, u \\rangle} \\implies \\|u - \\lambda v\\|^2 \\ge 0 \\quad (\\forall \\lambda \\in \\mathbb{C})`,
    },
    upvotes: 48,
    downvotes: 1,
    reviewers: [
      {
        name: 'David Hilbert',
        decision: 'APPROVED',
        comment: '证明严谨无误，复内积的共轭处理完全符合 Mathlib 规范。',
        commentEn: 'The proof is airtight — the conjugate treatment of the complex inner product fully matches Mathlib conventions.',
      },
    ],
  },
  {
    id: 'pr-102',
    nodeId: 'thm-stokes',
    nodeTitle: '一般化斯托克斯公式',
    nodeTitleEn: 'Generalized Stokes Theorem',
    author: {
      id: 'u-cartan',
      name: 'Élie Cartan',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      reputation: 22800,
    },
    title: '完善边界定向 (Induced Orientation) 的代数拓扑形式化',
    titleEn: 'Refine the algebraic-topology formalization of induced boundary orientation',
    description: '补充了外微分算子 d 在紧支微分形式下的分部积分引理。',
    descriptionEn: 'Adds the integration-by-parts lemma for the exterior derivative d on compactly supported differential forms.',
    status: 'MERGED',
    createdAt: '2026-08-22 09:15',
    diff: {
      field: 'statementLatex',
      oldValue: `\\int_{\\partial \\Omega} \\omega = \\int_{\\Omega} d\\omega`,
      newValue: `\\int_{\\partial \\Omega} \\iota^* \\omega = \\int_{\\Omega} \\mathrm{d}\\omega`,
    },
    upvotes: 95,
    downvotes: 0,
    reviewers: [
      {
        name: 'Henri Poincaré',
        decision: 'APPROVED',
        comment: '完美的拓扑注记。',
        commentEn: 'A flawless topological remark.',
      },
    ],
  },
];

export default function PullRequestViewer() {
  const { isZh } = useLanguage();
  const [prs, setPrs] = useState<MockPullRequest[]>(mockPullRequests);
  const [selectedPr, setSelectedPr] = useState<MockPullRequest>(prs[0]);
  const [userVoted, setUserVoted] = useState<string | null>(null);

  const handleApprove = (prId: string) => {
    setUserVoted('APPROVED');
    setPrs((prev) =>
      prev.map((pr) =>
        pr.id === prId
          ? {
              ...pr,
              upvotes: pr.upvotes + 1,
              reviewers: [
                ...pr.reviewers,
                {
                  name: 'You (Reviewer)',
                  decision: 'APPROVED' as const,
                  comment: '人工同行评审通过，赞成合并。',
                  commentEn: 'Manual peer review passed — approve for merge.',
                },
              ],
            }
          : pr
      )
    );
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <GitPullRequest className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-sm">{isZh ? 'Git 风格同行评审与合并请求 (Pull Requests)' : 'Git-Style Peer Review & Pull Requests'}</h3>
            <p className="text-xs text-slate-400">{isZh ? '去中心化的学术同行评审机制，支持 LaTeX 源码与逻辑依赖精确 Diff 对比' : 'Decentralized academic peer review with exact LaTeX source and logical-dependency diffs'}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            {isZh ? '通过合并奖励: +50 声望' : 'Merged reward: +50 reputation'}
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[480px]">
        {/* Left Column: PR List */}
        <div className="lg:col-span-5 border-r border-slate-800 bg-slate-950/80 p-3 space-y-2 overflow-auto">
          {prs.map((pr) => {
            const isSelected = selectedPr.id === pr.id;
            return (
              <div
                key={pr.id}
                onClick={() => setSelectedPr(pr)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 border-cyan-500/50 shadow-lg'
                    : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-900/80'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-mono text-cyan-400 font-semibold">{pr.id}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      pr.status === 'MERGED'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}
                  >
                    {pr.status === 'MERGED' ? (isZh ? '已合并 (Merged)' : 'Merged') : isZh ? '审核中 (Open)' : 'Open'}
                  </span>
                </div>

                <h4 className="font-semibold text-slate-200 text-xs mb-1 line-clamp-1">{isZh ? pr.title : pr.titleEn}</h4>
                <p className="text-[11px] text-slate-400 mb-2">
                  {isZh ? '关联定理: ' : 'Related theorem: '}
                  {isZh ? pr.nodeTitle : pr.nodeTitleEn}
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1.5 border-t border-slate-800/60">
                  <span>{isZh ? '作者: ' : 'By '}{pr.author.name}</span>
                  <span>👍 {pr.upvotes} {isZh ? '票' : 'votes'}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Selected PR Diff & Review */}
        <div className="lg:col-span-7 p-5 bg-slate-900/30 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            {/* PR Title & Metadata */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono text-cyan-400">{selectedPr.id}</span>
                <span className="text-xs text-slate-400 font-mono">{isZh ? '提交于 ' : 'Submitted '}{selectedPr.createdAt}</span>
              </div>
              <h3 className="font-bold text-slate-100 text-base">{isZh ? selectedPr.title : selectedPr.titleEn}</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">{isZh ? selectedPr.description : selectedPr.descriptionEn}</p>
            </div>

            {/* Visual LaTeX Diff Box */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden text-xs">
              <div className="px-3.5 py-2 bg-slate-900 border-b border-slate-800 font-mono text-[11px] text-slate-400 flex items-center justify-between">
                <span>{isZh ? 'LaTeX 源码 Diff 对比 (Semantic Diff)' : 'LaTeX Source Diff (Semantic Diff)'}</span>
                <span>Field: {selectedPr.diff.field}</span>
              </div>

              {/* Red Deletion */}
              <div className="p-3 bg-rose-950/20 border-b border-rose-500/20 text-rose-300 font-mono flex items-start gap-2">
                <span className="font-bold text-rose-400 select-none">-</span>
                <div className="flex-1 overflow-x-auto">
                  <InlineLaTeX formula={selectedPr.diff.oldValue} />
                </div>
              </div>

              {/* Green Addition */}
              <div className="p-3 bg-emerald-950/20 text-emerald-300 font-mono flex items-start gap-2">
                <span className="font-bold text-emerald-400 select-none">+</span>
                <div className="flex-1 overflow-x-auto">
                  <InlineLaTeX formula={selectedPr.diff.newValue} />
                </div>
              </div>
            </div>

            {/* Reviewers Feedback */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>{isZh ? '同行审阅者意见 (Peer Review Records):' : 'Peer Review Records:'}</span>
              </div>

              <div className="space-y-2">
                {selectedPr.reviewers.map((rev, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-200 font-medium">{rev.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {rev.decision}
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px]">{isZh ? rev.comment : rev.commentEn || rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Review Action Footer */}
          <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-slate-400">
              {isZh ? '当前投票数: ' : 'Current votes: '}
              <span className="text-emerald-400 font-bold font-mono">+{selectedPr.upvotes}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleApprove(selectedPr.id)}
                disabled={userVoted === 'APPROVED'}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/50 transition-all cursor-pointer disabled:opacity-50"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>{userVoted === 'APPROVED' ? (isZh ? '已投票赞成' : 'Vote cast') : isZh ? '赞成并同意合并 (Approve PR)' : 'Approve & Merge'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
