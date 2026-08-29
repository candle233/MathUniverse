'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { InlineLaTeX } from '@/components/math/LaTeXRenderer';
import {
  zfcAxiomRegistry,
  campaignEpochs,
  calculateUserLevel,
  loadProgressFromStorage,
  saveProgressToStorage,
  unlockAxiom,
  unlockEpoch,
  canUnlockEpoch,
  canSynthesizeEntity,
  synthesizeEntity,
  verifyMilestoneStep,
  completeEpochChallenge,
  resetProgress,
} from '@/lib/campaignEngine';
import type {
  ZfcAxiomId,
  UserCampaignProgress,
  CampaignEpoch,
  ConstructedEntity,
} from '@/types/campaign';
import {
  Trophy,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Sparkles,
  Lock,
  Unlock,
  Zap,
  BookOpen,
  Award,
  Flame,
  Layers,
  RefreshCw,
  Check,
  FlaskConical,
} from 'lucide-react';

export default function ZfcCampaignQuest() {
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState<UserCampaignProgress>(loadProgressFromStorage);
  const [selectedEpochIdx, setSelectedEpochIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<'CHALLENGE' | 'AXIOM_CODEX' | 'CRUCIBLE' | 'OVERVIEW'>('CHALLENGE');

  // Challenge step state
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [selectedAxiomId, setSelectedAxiomId] = useState<ZfcAxiomId | null>(null);
  const [selectedFormula, setSelectedFormula] = useState<string | null>(null);
  const [stepFeedback, setStepFeedback] = useState<{ isCorrect: boolean; explanation: string } | null>(null);
  const [celebration, setCelebration] = useState<{ title: string; xp: number; badge: string } | null>(null);

  useEffect(() => {
    setMounted(true);
    const loaded = loadProgressFromStorage();
    setProgress(loaded);
  }, []);

  const currentEpoch: CampaignEpoch = useMemo(() => {
    return campaignEpochs[selectedEpochIdx] || campaignEpochs[0];
  }, [selectedEpochIdx]);

  const levelInfo = useMemo(() => {
    return calculateUserLevel(progress.totalXp);
  }, [progress.totalXp]);

  const isCurrentEpochCompleted = useMemo(() => {
    return progress.completedChallenges.includes(currentEpoch.milestoneChallenge.id);
  }, [progress.completedChallenges, currentEpoch.milestoneChallenge.id]);

  const currentChallenge = currentEpoch.milestoneChallenge;
  const currentStep = currentChallenge.inferenceSteps[currentStepIdx] || currentChallenge.inferenceSteps[0];

  const updateProgress = (newProg: UserCampaignProgress) => {
    setProgress(newProg);
    saveProgressToStorage(newProg);
  };

  const handleUnlockEpoch = (epoch: CampaignEpoch) => {
    const check = canUnlockEpoch(progress, epoch.epochNumber);
    if (!check.canUnlock) {
      alert(`未满足解锁前提：缺少公理 [${check.missingAxioms.join(', ')}] 或实体 [${check.missingEntities.join(', ')}]`);
      return;
    }
    const updated = unlockEpoch(progress, epoch.epochNumber);
    updateProgress(updated);
  };

  const handleUnlockAxiom = (axiomId: ZfcAxiomId) => {
    const updated = unlockAxiom(progress, axiomId);
    updateProgress(updated);
  };

  const handleSynthesize = (entityId: string) => {
    const res = synthesizeEntity(progress, entityId);
    if (res.success) {
      updateProgress(res.progress);
    } else {
      alert(res.message);
    }
  };

  const handleVerifyStep = () => {
    if (!selectedAxiomId || !selectedFormula) {
      alert('请先选择适用的 ZFC 公理并选中目标公式！');
      return;
    }

    const res = verifyMilestoneStep(
      currentEpoch.epochNumber,
      currentStep.stepNumber,
      selectedAxiomId,
      selectedFormula
    );
    setStepFeedback({ isCorrect: res.isCorrect, explanation: res.explanation });

    if (res.isCorrect) {
      if (!res.isLastStep) {
        setTimeout(() => {
          setCurrentStepIdx((prev) => prev + 1);
          setSelectedAxiomId(null);
          setSelectedFormula(null);
          setStepFeedback(null);
        }, 1200);
      } else {
        const completedRes = completeEpochChallenge(progress, currentEpoch.epochNumber);
        updateProgress(completedRes.progress);
        setCelebration({
          title: currentEpoch.titleZh,
          xp: completedRes.rewardedXp,
          badge: completedRes.badgeAwarded,
        });
      }
    }
  };

  const handleReset = () => {
    if (confirm('确定要重置所有战役进度吗？这将清空已炼成实体与等级！')) {
      const reset = resetProgress();
      updateProgress(reset);
      setSelectedEpochIdx(0);
      setCurrentStepIdx(0);
      setCelebration(null);
      setStepFeedback(null);
    }
  };

  if (!mounted) {
    return (
      <div className="p-8 text-center text-slate-400 font-mono text-xs animate-pulse">
        正在载入公理科技树世界模型...
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-6 shadow-2xl">
      {/* Header & User Level Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/30 to-amber-600/10 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-100 text-sm md:text-base">
                “从公理创世”数学科技树战役 (ZFC to Modern Math RPG Campaign)
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Epoch 0{selectedEpochIdx + 1} / 06
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              从 9 大 ZFC 集合公理出发，通过严谨形式化推导一步步点亮整个人类现代数学文明
            </p>
          </div>
        </div>

        {/* User Stats Pill Bar */}
        <div className="flex items-center flex-wrap gap-2.5">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-mono font-bold text-amber-300">{progress.totalXp} XP</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-cyan-300">
              Lv.{levelInfo.level} · {levelInfo.title}
            </span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-1.5">
            <FlaskConical className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono font-bold text-emerald-300">
              {progress.inventoryEntities.length} 实体炼成
            </span>
          </div>

          <button
            onClick={handleReset}
            title="重置进度"
            className="p-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Level XP Progress Bar */}
      <div className="space-y-1 bg-slate-900/50 p-2.5 rounded-xl border border-slate-800/60">
        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className="text-slate-400">
            头衔进阶：<strong className="text-amber-300">{levelInfo.title}</strong>
          </span>
          <span className="text-slate-400">
            距离下一阶: {progress.totalXp} / {levelInfo.nextLevelXp} XP ({levelInfo.progressPercent}%)
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 transition-all duration-500"
            style={{ width: `${levelInfo.progressPercent}%` }}
          />
        </div>
      </div>

      {/* 6 Epochs Navigation Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {campaignEpochs.map((epoch, idx) => {
          const isUnlocked = progress.unlockedEpochs.includes(epoch.epochNumber);
          const isCompleted = progress.completedChallenges.includes(epoch.milestoneChallenge.id);
          const isSelected = selectedEpochIdx === idx;
          const unlockCheck = canUnlockEpoch(progress, epoch.epochNumber);

          return (
            <button
              key={epoch.id}
              onClick={() => {
                if (isUnlocked) {
                  setSelectedEpochIdx(idx);
                  setCurrentStepIdx(0);
                  setSelectedAxiomId(null);
                  setSelectedFormula(null);
                  setStepFeedback(null);
                  setCelebration(null);
                } else if (unlockCheck.canUnlock) {
                  handleUnlockEpoch(epoch);
                  setSelectedEpochIdx(idx);
                } else {
                  alert(`未满足解锁条件：缺少前置公理或实体`);
                }
              }}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-amber-500/20 border-amber-500/70 shadow-lg shadow-amber-500/10 text-amber-300 ring-1 ring-amber-500/40'
                  : isCompleted
                  ? 'bg-emerald-950/20 border-emerald-500/40 hover:border-emerald-500/70 text-slate-200'
                  : isUnlocked
                  ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300'
                  : unlockCheck.canUnlock
                  ? 'bg-cyan-950/30 border-cyan-500/40 hover:border-cyan-400 text-cyan-300 animate-pulse'
                  : 'bg-slate-950/40 border-slate-900 text-slate-600 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono font-bold">纪元 0{epoch.epochNumber}</span>
                {isCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : isUnlocked ? (
                  <Unlock className="w-3.5 h-3.5 text-amber-400" />
                ) : unlockCheck.canUnlock ? (
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-slate-600" />
                )}
              </div>
              <span className="text-xs font-bold line-clamp-1">{epoch.titleZh.split('：')[1] || epoch.titleZh}</span>
              <span className="text-[10px] font-mono text-slate-500 mt-1">+{epoch.rewardXp} XP</span>
            </button>
          );
        })}
      </div>

      {/* Main Tab Controls */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('CHALLENGE')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'CHALLENGE'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 bg-slate-900/50'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>推导战役 (Derivation Quest)</span>
        </button>

        <button
          onClick={() => setActiveTab('AXIOM_CODEX')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'AXIOM_CODEX'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 bg-slate-900/50'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>ZFC 公理圣殿 ({progress.unlockedAxioms.length}/9 已解锁)</span>
        </button>

        <button
          onClick={() => setActiveTab('CRUCIBLE')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'CRUCIBLE'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 bg-slate-900/50'
          }`}
        >
          <FlaskConical className="w-3.5 h-3.5" />
          <span>实体炼金室 (Constructive Alchemy)</span>
        </button>

        <button
          onClick={() => setActiveTab('OVERVIEW')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'OVERVIEW'
              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/50 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 bg-slate-900/50'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>文明科技图谱 (Civilization Matrix)</span>
        </button>
      </div>

      {/* Tab 1: CHALLENGE */}
      {activeTab === 'CHALLENGE' && (
        <div className="space-y-6">
          {/* Epoch Banner */}
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
              <div>
                <span className="text-xs font-mono text-amber-400 font-bold tracking-wider">
                  EPOCH 0{currentEpoch.epochNumber} · {currentEpoch.titleEn}
                </span>
                <h3 className="text-lg font-bold text-slate-100 mt-0.5">{currentEpoch.titleZh}</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  战役奖励：+{currentEpoch.rewardXp} XP · 徽章【{currentEpoch.badgeTitle}】
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">{currentEpoch.eraDescriptionZh}</p>

            {/* Target Formula Callout */}
            <div className="mt-4 p-3.5 rounded-xl bg-slate-950 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-mono text-slate-400 font-bold block">
                  纪元终极形式化目标公式 (Epoch Formal Goal Formula):
                </span>
                <div className="font-mono text-sm text-amber-200">
                  <InlineLaTeX formula={currentEpoch.milestoneChallenge.goalFormula} />
                </div>
              </div>
            </div>
          </div>

          {/* Celebration Box when completed */}
          {celebration && (
            <div className="p-5 rounded-xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-emerald-950/60 border border-emerald-500/60 text-center space-y-2.5 shadow-xl">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/50 mx-auto flex items-center justify-center text-emerald-400 shadow-lg">
                <Sparkles className="w-6 h-6 animate-spin" />
              </div>
              <h4 className="text-base font-bold text-emerald-300">🎉 恭喜！成功攻克 {celebration.title}！</h4>
              <p className="text-xs text-slate-300 max-w-lg mx-auto">
                您已完成该纪元全部公理形式化推导，获得{' '}
                <strong className="text-amber-300">+{celebration.xp} XP</strong> 并解锁文明成就徽章：【
                <strong className="text-emerald-400">{celebration.badge}</strong>】！
              </p>
            </div>
          )}

          {/* Derivation Step Sandbox */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Challenge Steps & Question */}
            <div className="lg:col-span-6 space-y-4">
              <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-xs font-mono font-bold">
                      Step 0{currentStep.stepNumber} / 0{currentChallenge.inferenceSteps.length}
                    </span>
                    <span className="text-xs font-bold text-slate-200">{currentChallenge.titleZh}</span>
                  </div>

                  {/* Step progress dots */}
                  <div className="flex items-center gap-1.5">
                    {currentChallenge.inferenceSteps.map((st, i) => (
                      <div
                        key={i}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${
                          i < currentStepIdx
                            ? 'bg-emerald-400'
                            : i === currentStepIdx
                            ? 'bg-amber-400 ring-2 ring-amber-400/30'
                            : 'bg-slate-800'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[11px] text-slate-400 font-semibold block">推导目标设问 (Inference Prompt):</span>
                  <p className="text-xs text-slate-200 leading-relaxed font-medium">{currentStep.instructionZh}</p>
                </div>

                {/* Step Axiom Picker */}
                <div className="space-y-2 pt-2">
                  <span className="text-[11px] text-slate-400 font-semibold block">
                    1. 选择适用的 ZFC 基础公理 (Select Applicable Axiom):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {currentEpoch.requiredAxiomIds.map((axId) => {
                      const axMeta = zfcAxiomRegistry[axId];
                      const isSelected = selectedAxiomId === axId;
                      return (
                        <button
                          key={axId}
                          onClick={() => setSelectedAxiomId(axId)}
                          className={`p-2.5 rounded-lg border text-left text-xs font-medium transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-amber-500/20 border-amber-500 text-amber-200'
                              : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                          }`}
                        >
                          <div className="font-bold line-clamp-1">{axMeta?.nameZh || axId}</div>
                          <div className="text-[10px] text-slate-500 font-mono mt-0.5">{axMeta?.nameEn}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Step Formula Choice */}
                <div className="space-y-2 pt-2">
                  <span className="text-[11px] text-slate-400 font-semibold block">
                    2. 挑选形式化推导结论公式 (Select Resulting Formula):
                  </span>
                  <div className="space-y-2">
                    {currentStep.formulaChoices.map((fChoice: string, idx: number) => {
                      const isSelected = selectedFormula === fChoice;
                      return (
                        <button
                          key={idx}
                          onClick={() => setSelectedFormula(fChoice)}
                          className={`w-full p-3 rounded-lg border text-left text-xs font-mono transition-all cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'bg-cyan-500/20 border-cyan-500 text-cyan-200'
                              : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                          }`}
                        >
                          <InlineLaTeX formula={fChoice} />
                          {isSelected && <Check className="w-4 h-4 text-cyan-400 shrink-0 ml-2" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-3">
                  <button
                    onClick={handleVerifyStep}
                    disabled={!selectedAxiomId || !selectedFormula}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      selectedAxiomId && selectedFormula
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>提交形式化推理检验 (Verify Logical Deduction)</span>
                  </button>
                </div>

                {/* Feedback Box */}
                {stepFeedback && (
                  <div
                    className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                      stepFeedback.isCorrect
                        ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                        : 'bg-rose-950/40 border-rose-500/50 text-rose-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold mb-1">
                      {stepFeedback.isCorrect ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>推导正确！符合形式化一阶公理系统</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-rose-400" />
                          <span>逻辑不自洽，请检查公理匹配或结论公式</span>
                        </>
                      )}
                    </div>
                    <p className="text-slate-300">{stepFeedback.explanation}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Constructible Entities in Current Epoch */}
            <div className="lg:col-span-6 space-y-4">
              <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <FlaskConical className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-slate-200">
                      本纪元可炼成实体 (Constructible Entities)
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    {currentEpoch.constructibleEntities.length} 个数学概念
                  </span>
                </div>

                <div className="space-y-3">
                  {currentEpoch.constructibleEntities.map((entity: ConstructedEntity) => {
                    const isSynthesized = progress.inventoryEntities.includes(entity.id);
                    const canSyn = canSynthesizeEntity(progress, entity.id);

                    return (
                      <div
                        key={entity.id}
                        className={`p-3.5 rounded-xl border transition-all ${
                          isSynthesized
                            ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-200'
                            : canSyn.canSynthesize
                            ? 'bg-slate-950 border-cyan-500/50 shadow-md shadow-cyan-500/5 text-slate-300'
                            : 'bg-slate-950/40 border-slate-800/60 text-slate-500'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-100">{entity.nameZh}</span>
                              <span className="text-[10px] font-mono text-slate-400">({entity.nameEn})</span>
                              {isSynthesized && (
                                <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                                  已炼成
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{entity.descriptionZh}</p>
                          </div>

                          <div className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-xs font-mono font-bold text-amber-300 min-w-0 max-w-full overflow-x-auto">
                            <InlineLaTeX formula={entity.setNotation} />
                          </div>
                        </div>

                        {/* Formal Def */}
                        <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                          <div className="text-[10px] font-mono text-cyan-300 overflow-x-auto">
                            <InlineLaTeX formula={entity.formalDefinitionLatex} />
                          </div>

                          {!isSynthesized && (
                            <button
                              onClick={() => handleSynthesize(entity.id)}
                              disabled={!canSyn.canSynthesize}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold shrink-0 transition-all cursor-pointer ${
                                canSyn.canSynthesize
                                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-sm'
                                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                              }`}
                            >
                              {canSyn.canSynthesize ? '⚡ 炼成实体 (+40 XP)' : '未满足前置'}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: AXIOM_CODEX */}
      {activeTab === 'AXIOM_CODEX' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-slate-100">ZFC 公理体系全貌圣殿 (Zermelo-Fraenkel Set Theory Codex)</h4>
              <p className="text-xs text-slate-400">
                现代数学大厦的 9 大公理基石。点击可解锁并查阅一阶逻辑形式化谓词与直觉诠释。
              </p>
            </div>
            <div className="text-xs font-mono font-bold text-purple-400 px-3 py-1 rounded-xl bg-purple-500/10 border border-purple-500/30">
              已解锁: {progress.unlockedAxioms.length} / 9 公理
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {Object.values(zfcAxiomRegistry).map((axiom) => {
              const isUnlocked = progress.unlockedAxioms.includes(axiom.id);
              return (
                <div
                  key={axiom.id}
                  className={`p-4 rounded-xl border space-y-2.5 transition-all flex flex-col justify-between ${
                    isUnlocked
                      ? 'bg-slate-900/80 border-purple-500/40 text-slate-200 shadow-md shadow-purple-500/5'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-400'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-purple-300 font-bold">
                        {axiom.category}
                      </span>
                      {isUnlocked ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Lock className="w-4 h-4 text-slate-600" />
                      )}
                    </div>

                    <h5 className="text-xs font-bold text-slate-100">{axiom.nameZh}</h5>
                    <p className="text-[10px] font-mono text-slate-400">{axiom.nameEn}</p>

                    <div className="p-2.5 rounded-lg bg-slate-950 border border-purple-500/20 font-mono text-[11px] text-purple-200 overflow-x-auto">
                      <InlineLaTeX formula={axiom.firstOrderFormulaLatex} />
                    </div>

                    <p className="text-[11px] text-slate-300 leading-relaxed">{axiom.intuitionZh}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500">奖励 +30 XP</span>
                    {!isUnlocked && (
                      <button
                        onClick={() => handleUnlockAxiom(axiom.id)}
                        className="px-2.5 py-1 rounded bg-purple-600 hover:bg-purple-500 text-slate-100 text-[10px] font-bold cursor-pointer transition-all"
                      >
                        解锁公理
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: CRUCIBLE (Entity Synthesis) */}
      {activeTab === 'CRUCIBLE' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-slate-100">数学实体炼金室 (Mathematical Alchemy Crucible)</h4>
              <p className="text-xs text-slate-400">
                将低阶概念与 ZFC 公理熔炼组合，创造从自然数、戴德金实数到微积分切丛与范畴论的高阶数学对象。
              </p>
            </div>
            <div className="text-xs font-mono font-bold text-emerald-400 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
              已拥有: {progress.inventoryEntities.length} 个实体
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {campaignEpochs
              .flatMap((e) => e.constructibleEntities)
              .map((entity: ConstructedEntity) => {
                const isSynthesized = progress.inventoryEntities.includes(entity.id);
                const canSyn = canSynthesizeEntity(progress, entity.id);

                return (
                  <div
                    key={entity.id}
                    className={`p-4 rounded-xl border space-y-2.5 transition-all flex flex-col justify-between ${
                      isSynthesized
                        ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-200'
                        : canSyn.canSynthesize
                        ? 'bg-slate-900/90 border-cyan-500/60 text-slate-200 ring-1 ring-cyan-500/30'
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-500'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-emerald-300 font-bold">
                          {entity.discipline}
                        </span>
                        <div className="px-2 py-0.5 rounded bg-slate-950 text-xs font-mono font-bold text-amber-300 border border-slate-800">
                          <InlineLaTeX formula={entity.setNotation} />
                        </div>
                      </div>

                      <h5 className="text-xs font-bold text-slate-100">{entity.nameZh}</h5>
                      <p className="text-[10px] font-mono text-slate-400">{entity.nameEn}</p>

                      <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[10px] text-cyan-200 overflow-x-auto">
                        <InlineLaTeX formula={entity.formalDefinitionLatex} />
                      </div>

                      <p className="text-[11px] text-slate-300 leading-relaxed">{entity.descriptionZh}</p>

                      {/* Required Entities */}
                      {entity.requiredEntities.length > 0 && (
                        <div className="text-[10px] text-slate-400">
                          前置依赖实体：
                          <span className="text-slate-300 font-mono ml-1">
                            {entity.requiredEntities.join(', ')}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                      <span className="text-[10px] text-slate-500">+40 XP</span>
                      {isSynthesized ? (
                        <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> 已在实体库
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSynthesize(entity.id)}
                          disabled={!canSyn.canSynthesize}
                          className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                            canSyn.canSynthesize
                              ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          炼成实体
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Tab 4: OVERVIEW */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <h4 className="text-sm font-bold text-slate-100">数学文明演进史 6 大纪元总览 (Epoch Matrix)</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              见证人类逻辑从 19 世纪末康托尔集合论危机到 21 世纪交互式定理证明器 (Lean 4) 的宏伟史诗。
            </p>
          </div>

          <div className="space-y-3">
            {campaignEpochs.map((ep) => {
              const isUnlocked = progress.unlockedEpochs.includes(ep.epochNumber);
              const isCompleted = progress.completedChallenges.includes(ep.milestoneChallenge.id);

              return (
                <div
                  key={ep.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    isCompleted
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-200'
                      : isUnlocked
                      ? 'bg-slate-900/70 border-slate-800 text-slate-300'
                      : 'bg-slate-950/40 border-slate-900 text-slate-600 opacity-60'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-amber-400">EPOCH 0{ep.epochNumber}</span>
                      <h5 className="text-sm font-bold text-slate-100">{ep.titleZh}</h5>
                      <span className="text-[11px] text-slate-400 font-mono">({ep.titleEn})</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">{ep.eraDescriptionZh}</p>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 font-mono">
                        徽章：{ep.badgeTitle}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="font-mono text-xs text-amber-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800 max-w-xs overflow-x-auto">
                      <InlineLaTeX formula={ep.milestoneChallenge.goalFormula} />
                    </div>
                    {isCompleted ? (
                      <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 已攻克
                      </span>
                    ) : isUnlocked ? (
                      <span className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/40">
                        可推进
                      </span>
                    ) : (
                      <span className="px-3 py-1.5 rounded-lg bg-slate-900 text-slate-600 text-xs font-bold border border-slate-800 flex items-center gap-1.5">
                        <Lock className="w-4 h-4" /> 锁定
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

