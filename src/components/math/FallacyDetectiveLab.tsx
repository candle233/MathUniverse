'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { InlineLaTeX } from '@/components/math/LaTeXRenderer';
import {
  getFallacyCases,
  getFallacyCategories,
  accuseProofStep,
  getCaseStats,
  loadFallacyLabProgress,
  saveFallacyLabProgress,
  resetFallacyLabProgress,
} from '@/lib/fallacyEngine';
import type {
  FallacyType,
  FallacyCase,
  AccusationResult,
  FallacyLabProgress,
  FallacyStep,
} from '@/types/fallacy';
import {
  ShieldAlert,
  Search,
  CheckCircle2,
  XCircle,
  Award,
  AlertTriangle,
  Copy,
  Check,
  Filter,
  RefreshCw,
  BookOpen,
  FileCode,
  Bug,
  Scale,
} from 'lucide-react';

export default function FallacyDetectiveLab() {
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState<FallacyLabProgress>(loadFallacyLabProgress);
  const [selectedCaseIdx, setSelectedCaseIdx] = useState(0);
  const [selectedStepIdx, setSelectedStepIdx] = useState<number | null>(null);
  const [selectedFlawCategory, setSelectedFlawCategory] = useState<FallacyType | null>(null);
  const [accusationResult, setAccusationResult] = useState<AccusationResult | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'ALL' | FallacyType>('ALL');
  const [copiedLean, setCopiedLean] = useState(false);

  useEffect(() => {
    setMounted(true);
    const loaded = loadFallacyLabProgress();
    setProgress(loaded);
  }, []);

  const allCases = useMemo(() => getFallacyCases(), []);
  const allCategories = useMemo(() => getFallacyCategories(), []);

  const filteredCases = useMemo(() => {
    if (activeCategoryFilter === 'ALL') return allCases;
    return allCases.filter((c) => c.flawType === activeCategoryFilter);
  }, [allCases, activeCategoryFilter]);

  const currentCase: FallacyCase = useMemo(() => {
    return filteredCases[selectedCaseIdx] || filteredCases[0] || allCases[0];
  }, [filteredCases, selectedCaseIdx, allCases]);

  const stats = useMemo(() => {
    return getCaseStats(progress.solvedCaseIds);
  }, [progress.solvedCaseIds]);

  const isCurrentCaseSolved = useMemo(() => {
    return progress.solvedCaseIds.includes(currentCase.id);
  }, [progress.solvedCaseIds, currentCase.id]);

  const updateProgress = (newProg: FallacyLabProgress) => {
    setProgress(newProg);
    saveFallacyLabProgress(newProg);
  };

  const handleAccuse = () => {
    if (selectedStepIdx === null) {
      alert('请先在右侧推导步骤列表中点击您怀疑存在漏洞的步骤！');
      return;
    }

    const result = accuseProofStep(currentCase.id, selectedStepIdx, selectedFlawCategory || undefined);
    setAccusationResult(result);

    if (result.isFlawedStep) {
      const alreadySolved = progress.solvedCaseIds.includes(currentCase.id);
      const newSolved = alreadySolved ? progress.solvedCaseIds : [...progress.solvedCaseIds, currentCase.id];
      const newScore = progress.detectiveScore + result.pointsEarned;
      const newStats = getCaseStats(newSolved);

      const updatedProg: FallacyLabProgress = {
        solvedCaseIds: newSolved,
        attemptedCount: progress.attemptedCount + 1,
        detectiveScore: newScore,
        badgeTitle: newStats.detectiveTitle,
        lastUpdated: new Date().toISOString(),
      };
      updateProgress(updatedProg);
    } else {
      updateProgress({
        ...progress,
        attemptedCount: progress.attemptedCount + 1,
        lastUpdated: new Date().toISOString(),
      });
    }
  };

  const handleCopyLean = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedLean(true);
    setTimeout(() => setCopiedLean(false), 2000);
  };

  const handleReset = () => {
    if (confirm('确定要重置所有逻辑侦探案件进度吗？')) {
      const reset = resetFallacyLabProgress();
      updateProgress(reset);
      setSelectedStepIdx(null);
      setSelectedFlawCategory(null);
      setAccusationResult(null);
    }
  };

  if (!mounted) {
    return (
      <div className="p-8 text-center text-slate-400 font-mono text-xs animate-pulse">
        正在加载数学悖论与伪推导档案库...
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-6 shadow-2xl">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500/30 to-red-600/10 border border-rose-500/40 flex items-center justify-center text-rose-400 shadow-lg shadow-rose-500/10">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-100 text-sm md:text-base">
                数学伪证明侦探与漏洞鉴别实验室 (Mathematical Fallacy Detective Lab)
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                6 大经典悖论
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              深度勘验从“隐藏除以零”、“发散级数重排”、“割线跨越”到“弧长下半连续性”与“积分号下求导奇异性”的推导死穴
            </p>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-1.5">
            <Scale className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-bold text-purple-300">{stats.detectiveTitle}</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-mono font-bold text-amber-300">
              破案: {stats.solvedCount} / {stats.totalCases} ({stats.solvedPercent}%)
            </span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-1.5 font-mono text-xs text-slate-300">
            <span>积分: </span>
            <strong className="text-rose-400 font-bold">{progress.detectiveScore} PTS</strong>
          </div>

          <button
            onClick={handleReset}
            title="重置侦探案卷"
            className="p-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 shrink-0">
          <Filter className="w-3.5 h-3.5" /> 分类筛选：
        </span>
        <button
          onClick={() => {
            setActiveCategoryFilter('ALL');
            setSelectedCaseIdx(0);
            setAccusationResult(null);
            setSelectedStepIdx(null);
          }}
          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeCategoryFilter === 'ALL'
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50'
              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          全部 6 宗案件
        </button>
        {allCategories.map((cat) => (
          <button
            key={cat.type}
            onClick={() => {
              setActiveCategoryFilter(cat.type);
              setSelectedCaseIdx(0);
              setAccusationResult(null);
              setSelectedStepIdx(null);
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeCategoryFilter === cat.type
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {cat.nameZh}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {filteredCases.map((c, idx) => {
          const isSelected = selectedCaseIdx === idx;
          const isSolved = progress.solvedCaseIds.includes(c.id);

          return (
            <button
              key={c.id}
              onClick={() => {
                setSelectedCaseIdx(idx);
                setSelectedStepIdx(null);
                setSelectedFlawCategory(null);
                setAccusationResult(null);
              }}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-rose-500/20 border-rose-500/70 shadow-lg shadow-rose-500/10 text-rose-300 ring-1 ring-rose-500/40'
                  : isSolved
                  ? 'bg-emerald-950/20 border-emerald-500/40 hover:border-emerald-500/70 text-slate-200'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono font-bold">{c.caseCode}</span>
                {isSolved ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                )}
              </div>
              <span className="text-xs font-bold line-clamp-1">{c.titleZh}</span>
              <div className="flex items-center justify-between mt-1 text-[10px] font-mono text-slate-500">
                <span>{'★'.repeat(c.difficulty)}</span>
                <span className="text-rose-400 font-bold">+{100 * c.difficulty}P</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-rose-400">{currentCase.caseCode}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                  难度等级: {'★'.repeat(currentCase.difficulty)}
                </span>
              </div>
              {isCurrentCaseSolved && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/40">
                  已告破
                </span>
              )}
            </div>

            <div>
              <h4 className="text-base font-bold text-slate-100">{currentCase.titleZh}</h4>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{currentCase.titleEn}</p>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{currentCase.storyContextZh}</p>

            <div className="p-4 rounded-xl bg-slate-950 border border-rose-500/40 text-center space-y-1 shadow-inner">
              <span className="text-[10px] uppercase font-mono text-slate-500 font-bold block">
                声称证得的荒谬伪结论 (Alleged Spurious Claim):
              </span>
              <div className="text-rose-400 font-mono font-extrabold text-xl py-1">
                <InlineLaTeX formula={currentCase.allegedConclusionLatex} />
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-mono text-purple-400 font-bold block">
                被破坏的核心公理/定理 (Violated Principle):
              </span>
              <p className="text-xs font-bold text-slate-200">{currentCase.formalTheoremNameZh}</p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 block">
                漏洞病因初诊 (Diagnose Flaw Category - 可选加分项):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {allCategories.map((cat) => {
                  const isCatSelected = selectedFlawCategory === cat.type;
                  return (
                    <button
                      key={cat.type}
                      onClick={() => setSelectedFlawCategory(cat.type)}
                      className={`p-2 rounded-lg border text-left text-[11px] font-medium transition-all cursor-pointer ${
                        isCatSelected
                          ? 'bg-purple-500/20 border-purple-500 text-purple-200'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-400'
                      }`}
                    >
                      <div className="font-bold line-clamp-1">{cat.nameZh}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-rose-400" />
                <span className="text-xs font-bold text-slate-200">
                  推导勘验流程 (Inspect Proof Steps & Lodge Accusation)
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">共 {currentCase.steps.length} 步推导</span>
            </div>

            <p className="text-xs text-slate-400">
              请点击您认为发生<strong className="text-rose-400">【非法逻辑跃迁/代数越界】</strong>的致命步骤，随后点击发起指控：
            </p>

            <div className="space-y-2.5">
              {currentCase.steps.map((step: FallacyStep) => {
                const isSelected = selectedStepIdx === step.stepIndex;

                return (
                  <button
                    key={step.stepIndex}
                    onClick={() => {
                      setSelectedStepIdx(step.stepIndex);
                      setAccusationResult(null);
                    }}
                    className={`w-full p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-rose-500/20 border-rose-500 text-rose-200 ring-1 ring-rose-500/40 shadow-sm'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center font-mono text-xs font-bold text-slate-400 shrink-0">
                        {step.stepIndex}
                      </span>
                      <div className="font-mono text-xs text-cyan-200 overflow-x-auto">
                        <InlineLaTeX formula={step.latex} />
                      </div>
                    </div>

                    <span className="text-[11px] text-slate-400 text-right max-w-xs">{step.plainZh}</span>
                  </button>
                );
              })}
            </div>

            {/* Accuse Action Button */}
            <div className="pt-2">
              <button
                onClick={handleAccuse}
                disabled={selectedStepIdx === null}
                className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  selectedStepIdx !== null
                    ? 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-slate-100 shadow-lg shadow-rose-600/20'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <Bug className="w-4 h-4" />
                <span>发起形式化漏洞指控 (Accuse Step 0{selectedStepIdx || 1})</span>
              </button>
            </div>

            {/* Verdict Revelation Card */}
            {accusationResult && (
              <div
                className={`p-4 rounded-xl border space-y-3 text-xs ${
                  accusationResult.isFlawedStep
                    ? accusationResult.flawCategoryMatches
                      ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200'
                      : 'bg-amber-950/40 border-amber-500/60 text-amber-200'
                    : 'bg-rose-950/40 border-rose-500/60 text-rose-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    {accusationResult.isFlawedStep ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        <span>{accusationResult.verdictTitle}</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-rose-400" />
                        <span>{accusationResult.verdictTitle}</span>
                      </>
                    )}
                  </div>
                  {accusationResult.pointsEarned > 0 && (
                    <span className="px-2 py-0.5 rounded font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px]">
                      +{accusationResult.pointsEarned} PTS
                    </span>
                  )}
                </div>

                <p className="text-slate-200 leading-relaxed font-medium">{accusationResult.feedbackZh}</p>

                {/* Mathematical Formula Refutation */}
                {accusationResult.formalRefutationLatex && (
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[10px] uppercase font-mono text-cyan-400 font-bold block">
                      形式化反驳式 (Formal Refutation Equation):
                    </span>
                    <div className="font-mono text-xs text-cyan-200">
                      <InlineLaTeX formula={accusationResult.formalRefutationLatex} />
                    </div>
                  </div>
                )}

                {/* Formal Critique */}
                {accusationResult.formalCritiqueZh && (
                  <div className="space-y-1 pt-1 border-t border-slate-800/80">
                    <span className="text-[10px] uppercase font-mono text-purple-300 font-bold block">
                      数学原理与测度分析 (Analysis & Measure Theory Critique):
                    </span>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {accusationResult.formalCritiqueZh}
                    </p>
                  </div>
                )}

                {/* Lean 4 Disproof Snippet */}
                {accusationResult.leanDisproofSnippet && (
                  <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-mono text-amber-300 font-bold flex items-center gap-1">
                        <FileCode className="w-3.5 h-3.5" /> Lean 4 形式化证明/驳倒代码片段 (Lean 4 Disproof):
                      </span>
                      <button
                        onClick={() => handleCopyLean(accusationResult.leanDisproofSnippet!)}
                        className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-mono flex items-center gap-1 cursor-pointer transition-all"
                      >
                        {copiedLean ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedLean ? '已复制' : '复制 Lean 4'}</span>
                      </button>
                    </div>

                    <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto leading-relaxed">
                      {accusationResult.leanDisproofSnippet}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom: 6 Fallacy Categories Codex Reference */}
      <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-purple-400" />
          <h4 className="text-xs font-bold text-slate-200">
            常见伪证明 6 大逻辑漏洞分类法总览 (Fallacy Taxonomy Codex)
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
          {allCategories.map((cat) => (
            <div key={cat.type} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">{cat.nameZh}</span>
                <span className="text-[10px] font-mono text-slate-500">{cat.nameEn}</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">{cat.principleViolatedZh}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
