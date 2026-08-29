'use client';

import React, { useState } from 'react';
import { Proof, MathNode } from '@/types/math';
import LaTeXRenderer, { InlineLaTeX } from '@/components/math/LaTeXRenderer';
import { Lightbulb, CheckSquare, MessageSquare, ThumbsUp, User, ChevronDown, ChevronUp, Send, ShieldCheck } from 'lucide-react';

interface ProofViewerProps {
  node: MathNode;
}

export default function ProofViewer({ node }: ProofViewerProps) {
  const [activeProofIndex, setActiveProofIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'intuition' | 'rigorous'>('rigorous');
  const [expandedStep, setExpandedStep] = useState<number | null>(1);
  const [activeCommentStep, setActiveCommentStep] = useState<number | null>(null);
  
  // Local comment mock state
  const [stepComments, setStepComments] = useState<Record<number, Array<{ id: string; user: string; text: string; time: string }>>>({
    1: [
      { id: 'c1', user: 'Serre_Fan', text: '这一步中引入的二次型构造非常巧妙，在复空间需要注意共轭对称性。', time: '2小时前' }
    ],
    2: [
      { id: 'c2', user: 'AnalysisRookie', text: '请问如果判别式等于 0，是否意味着两个向量严格共线？', time: '5小时前' }
    ]
  });
  const [newCommentText, setNewCommentText] = useState('');

  const currentProof = node.proofs[activeProofIndex] || node.proofs[0];

  const handleAddComment = (stepIdx: number) => {
    if (!newCommentText.trim()) return;
    setStepComments((prev) => ({
      ...prev,
      [stepIdx]: [
        ...(prev[stepIdx] || []),
        { id: `c-${Date.now()}`, user: 'You (Researcher)', text: newCommentText.trim(), time: '刚刚' }
      ]
    }));
    setNewCommentText('');
  };

  if (!currentProof) {
    return (
      <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center text-slate-400">
        该节点暂无证明记录，欢迎提交首个 Pull Request！
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
      {/* Top Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 bg-slate-900 border-b border-slate-800">
        {/* Proof Version Selector */}
        <div className="flex items-center gap-2 flex-wrap">
          {node.proofs.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => setActiveProofIndex(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeProofIndex === idx
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {p.title}
            </button>
          ))}
        </div>

        {/* Intuition vs Rigorous Mode Toggle */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setViewMode('intuition')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'intuition'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>直觉与动机 (Intuition)</span>
          </button>
          <button
            onClick={() => setViewMode('rigorous')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'rigorous'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>严谨推导 (Rigorous Proof)</span>
          </button>
        </div>
      </div>

      {/* Author & Verification Info Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-2.5 bg-slate-900/40 border-b border-slate-800/80 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold text-[10px]">
            {currentProof.author.name[0]}
          </div>
          <span className="text-slate-300 font-medium">{currentProof.author.name}</span>
          <span className="text-amber-400 font-mono text-[11px]">★ {currentProof.author.reputation}</span>
          {currentProof.author.isModerator && (
            <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-medium border border-purple-500/30">
              领域专家
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {currentProof.verification === 'PEER_REVIEWED' && (
            <span className="text-amber-400 flex items-center gap-1 text-xs">
              <ShieldCheck className="w-3.5 h-3.5" />
              标记为人工同行评审通过（演示）
            </span>
          )}
          {currentProof.verification === 'FORMALLY_VERIFIED' && (
            <span className="text-emerald-400 flex items-center gap-1 text-xs">
              <ShieldCheck className="w-3.5 h-3.5" />
              标记为形式化通过（演示 · 未运行真实 Lean 内核）
            </span>
          )}
          {(currentProof.verification === 'UNVERIFIED' || currentProof.verification === 'VERIFICATION_FAILED') && (
            <span className="text-slate-400 flex items-center gap-1 text-xs">
              <ShieldCheck className="w-3.5 h-3.5" />
              未评审
            </span>
          )}
          <button className="flex items-center gap-1 text-slate-400 hover:text-cyan-400 text-xs">
            <ThumbsUp className="w-3.5 h-3.5" /> {currentProof.upvotes}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6">
        {viewMode === 'intuition' ? (
          /* Intuition View */
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-200 text-xs leading-relaxed">
              <div className="font-semibold flex items-center gap-1.5 mb-1 text-amber-300">
                <Lightbulb className="w-4 h-4" /> 为什么这个结论是自然的？
              </div>
              <div className="leading-relaxed">
                <LaTeXRenderer content={currentProof.motivation} />
              </div>
            </div>

            {node.intuitionMd && (
              <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed">
                <LaTeXRenderer content={node.intuitionMd} />
              </div>
            )}
          </div>
        ) : (
          /* Rigorous Proof View */
          <div className="space-y-6">
            {/* Full Derivation text */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 leading-relaxed text-sm text-slate-200">
              <LaTeXRenderer content={currentProof.rigorousProof} />
            </div>

            {/* Step by Step Breakdown & Inline Commenting */}
            {currentProof.steps && currentProof.steps.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300 pb-1 border-b border-slate-800">
                  <span>拆解推导步骤与行内讨论 (Step-level Inline Annotations):</span>
                  <span className="text-slate-500">点击右侧气泡可针对某一步发起研讨</span>
                </div>

                <div className="space-y-3">
                  {currentProof.steps.map((step) => {
                    const isOpen = expandedStep === step.stepIndex;
                    const comments = stepComments[step.stepIndex] || [];
                    const isCommenting = activeCommentStep === step.stepIndex;

                    return (
                      <div
                        key={step.id}
                        className="rounded-xl border border-slate-800 bg-slate-900/80 overflow-hidden transition-all"
                      >
                        <div
                          onClick={() => setExpandedStep(isOpen ? null : step.stepIndex)}
                          className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-slate-800/50"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-300 font-mono font-bold text-xs flex items-center justify-center border border-cyan-500/40">
                              {step.stepIndex}
                            </span>
                            <span className="font-semibold text-slate-200 text-xs">
                              {step.explanation}
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveCommentStep(isCommenting ? null : step.stepIndex);
                              }}
                              className="flex items-center gap-1 text-slate-400 hover:text-cyan-300 text-xs px-2 py-1 rounded bg-slate-800"
                            >
                              <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                              <span>{comments.length} 讨论</span>
                            </button>
                            {isOpen ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                          </div>
                        </div>

                        {isOpen && (
                          <div className="px-4 pb-4 pt-1 border-t border-slate-800/80 space-y-3">
                            <div className="p-3 rounded-lg bg-slate-950 text-xs text-cyan-300 font-mono overflow-x-auto">
                              <InlineLaTeX formula={step.latexText} displayMode={true} />
                            </div>

                            {/* Inline Discussion Drawer */}
                            {isCommenting && (
                              <div className="p-3.5 rounded-xl bg-slate-950 border border-cyan-500/30 space-y-3 animate-in fade-in">
                                <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                                  <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                                  <span>针对 Step {step.stepIndex} 的学术研讨：</span>
                                </div>

                                {/* Comment List */}
                                <div className="space-y-2 max-h-48 overflow-auto">
                                  {comments.map((c) => (
                                    <div key={c.id} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-1">
                                      <div className="flex items-center justify-between text-slate-400 text-[11px]">
                                        <span className="text-cyan-300 font-medium">{c.user}</span>
                                        <span>{c.time}</span>
                                      </div>
                                      <p className="text-slate-300">{c.text}</p>
                                    </div>
                                  ))}
                                </div>

                                {/* New Comment Input */}
                                <div className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    value={newCommentText}
                                    onChange={(e) => setNewCommentText(e.target.value)}
                                    placeholder="输入你的数学推导疑问或修正建议 (支持 LaTeX $...$)"
                                    className="flex-1 bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 outline-none focus:border-cyan-400"
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddComment(step.stepIndex)}
                                  />
                                  <button
                                    onClick={() => handleAddComment(step.stepIndex)}
                                    className="p-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-colors cursor-pointer"
                                  >
                                    <Send className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
