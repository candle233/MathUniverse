'use client';

import React, { useState, useMemo } from 'react';
import { MathNode } from '@/types/math';
import { initialMathNodes } from '@/data/seedData';
import { disciplines } from '@/data/disciplines';
import { getNodeTypeMeta, getVerificationMeta } from '@/lib/utils';
import {
  computeMinimumPrerequisiteClosure,
  PrerequisiteClosureResult,
} from '@/lib/prerequisiteClosure';
import Link from 'next/link';
import {
  CheckCircle2,
  Circle,
  ArrowRight,
  GitFork,
  Sparkles,
  BookOpen,
  Trophy,
  Layers,
  Filter,
  Clock,
  Flame,
  Compass,
} from 'lucide-react';
import { InlineLaTeX } from '@/components/math/LaTeXRenderer';

interface LearningPathTreeProps {
  targetNodeId?: string;
}

export default function LearningPathTree({ targetNodeId = 'thm-stokes' }: LearningPathTreeProps) {
  // Cascading Selection State
  const [selectedDisciplineId, setSelectedDisciplineId] = useState<string>('analysis');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [selectedTargetId, setSelectedTargetId] = useState<string>(targetNodeId);
  const [completedNodes, setCompletedNodes] = useState<Set<string>>(new Set(['def-limit-sequence']));

  // 1. Filtered theorems under selected primary discipline
  const disciplineTheorems = useMemo(() => {
    return initialMathNodes.filter((n) => n.disciplineId === selectedDisciplineId);
  }, [selectedDisciplineId]);

  // 2. Extract subcategories (MSC code 2-digit or tags)
  const availableSubcategories = useMemo(() => {
    const subcats = new Set<string>();
    disciplineTheorems.forEach((t) => {
      if (t.tags && t.tags[0]) subcats.add(t.tags[0]);
    });
    return Array.from(subcats);
  }, [disciplineTheorems]);

  // 3. Filtered target theorems
  const targetTheorems = useMemo(() => {
    if (selectedSubcategory === 'all') return disciplineTheorems;
    return disciplineTheorems.filter((t) => t.tags && t.tags.includes(selectedSubcategory));
  }, [disciplineTheorems, selectedSubcategory]);

  // Automatically update selected target when category changes
  const activeTargetId = targetTheorems.some((t) => t.id === selectedTargetId)
    ? selectedTargetId
    : targetTheorems[0]?.id || initialMathNodes[0].id;

  const targetNode = useMemo(() => {
    return initialMathNodes.find((n) => n.id === activeTargetId) || initialMathNodes[0];
  }, [activeTargetId]);

  // Compute Minimum Prerequisite Closure & Bottleneck Analysis
  const closureResult: PrerequisiteClosureResult | null = useMemo(() => {
    return computeMinimumPrerequisiteClosure(
      activeTargetId,
      Array.from(completedNodes),
      initialMathNodes
    );
  }, [activeTargetId, completedNodes]);

  const learningPath = useMemo(() => {
    if (!closureResult) return [];
    return closureResult.learningSequence;
  }, [closureResult]);

  const toggleComplete = (id: string) => {
    setCompletedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const progressPercent = closureResult ? closureResult.readinessPercentage : 0;
  const bottleneckSet = useMemo(() => {
    return new Set((closureResult?.criticalBottlenecks || []).map((b) => b.node.id));
  }, [closureResult]);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <GitFork className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-100 text-base">
              多层级学科逆向学习路径树 (Hierarchical Topological Skill Tree)
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            逐级选择一级学科、二级领域与目标高阶定理，系统自动计算由浅入深的完整拓扑依赖链条与关键枢纽
          </p>
        </div>

        <div className="flex items-center gap-2">
          {closureResult && (
            <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-500/30 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>预估研习: {closureResult.totalEstimatedHours} 小时</span>
            </span>
          )}
          <span className="text-xs font-mono text-cyan-400 font-bold bg-cyan-950/40 px-3 py-1.5 rounded-xl border border-cyan-500/30">
            {learningPath.length} 级阶梯依赖
          </span>
        </div>
      </div>

      {/* Multi-Tier Cascading Filter Bar */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        {/* Tier 1: Primary Discipline */}
        <div className="space-y-1.5">
          <label className="text-slate-400 font-semibold flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-cyan-400" /> 一级主学科分类:
          </label>
          <select
            value={selectedDisciplineId}
            onChange={(e) => {
              setSelectedDisciplineId(e.target.value);
              setSelectedSubcategory('all');
            }}
            className="w-full bg-slate-950 border border-slate-700 text-cyan-300 text-xs rounded-xl px-3 py-2 outline-none font-medium cursor-pointer"
          >
            {disciplines.map((d) => (
              <option key={d.id} value={d.id}>
                {d.nameZh} ({d.nameEn})
              </option>
            ))}
          </select>
        </div>

        {/* Tier 2: Subcategory */}
        <div className="space-y-1.5">
          <label className="text-slate-400 font-semibold flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-purple-400" /> 二级专题领域:
          </label>
          <select
            value={selectedSubcategory}
            onChange={(e) => setSelectedSubcategory(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 text-purple-300 text-xs rounded-xl px-3 py-2 outline-none font-medium cursor-pointer"
          >
            <option value="all">全部二级专题 ({availableSubcategories.length})</option>
            {availableSubcategories.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>

        {/* Tier 3: Target Theorem */}
        <div className="space-y-1.5">
          <label className="text-slate-400 font-semibold flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" /> 目标通关定理:
          </label>
          <select
            value={activeTargetId}
            onChange={(e) => setSelectedTargetId(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 text-emerald-300 text-xs rounded-xl px-3 py-2 outline-none font-medium cursor-pointer"
          >
            {targetTheorems.map((t) => (
              <option key={t.id} value={t.id}>
                {t.titleZh} (MSC {t.mscCode})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Progress Bar & Bottlenecks Insight */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-sm">
              {progressPercent}%
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <span>
                  前置通关就绪度: {learningPath.filter((n) => completedNodes.has(n.id)).length} / {learningPath.length} 个节点
                </span>
                {progressPercent === 100 && <span className="text-amber-400">🏆 达成全通关</span>}
              </div>
              <p className="text-[11px] text-slate-400">点击左侧圆圈可标记已掌握该定理/定义，动态更新后续阶梯</p>
            </div>
          </div>

          <div className="flex-1 max-w-xs w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-500 h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Bottleneck Callout */}
        {closureResult && closureResult.criticalBottlenecks.length > 0 && (
          <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80 text-xs text-rose-300">
            <Flame className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="font-semibold text-slate-300">必经主干枢纽:</span>
            <div className="flex flex-wrap gap-1.5">
              {closureResult.criticalBottlenecks.map(({ node, reason }) => (
                <span
                  key={node.id}
                  className="px-2 py-0.5 rounded-md bg-rose-950/60 border border-rose-500/40 text-[11px] text-rose-200"
                  title={reason}
                >
                  {node.titleZh}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Step-by-Step Path Cards */}
      <div className="space-y-3">
        {learningPath.map((node, index) => {
          const isDone = completedNodes.has(node.id);
          const isFinal = index === learningPath.length - 1;
          const isBottleneck = bottleneckSet.has(node.id);
          const meta = getNodeTypeMeta(node.nodeType);

          return (
            <div
              key={node.id}
              className={`p-4 rounded-2xl border transition-all ${
                isFinal
                  ? 'bg-gradient-to-r from-slate-900 to-slate-900/80 border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                  : isBottleneck
                  ? 'bg-rose-950/20 border-rose-500/30'
                  : isDone
                  ? 'bg-slate-900/40 border-slate-800/80 opacity-90'
                  : 'bg-slate-900/80 border-slate-700'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleComplete(node.id)}
                    className="text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-600 hover:text-slate-400" />
                    )}
                  </button>

                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${meta.color}`}
                  >
                    {meta.label}
                  </span>

                  <span className="font-bold text-slate-200 text-sm">{node.titleZh}</span>
                  <span className="text-xs text-slate-400 font-mono hidden sm:inline">({node.titleEn})</span>

                  {isBottleneck && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-950/80 border border-rose-500/50 text-rose-300 font-semibold flex items-center gap-1">
                      <Flame className="w-3 h-3 text-rose-400" />
                      <span>关键枢纽</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500 font-mono">MSC {node.mscCode}</span>
                  <Link
                    href={`/node/${node.slug}`}
                    className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold ml-2 cursor-pointer"
                  >
                    <span>详情</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              {/* Render Statement in LaTeX */}
              <div className="pl-8 text-xs text-cyan-200 font-mono overflow-x-auto py-1">
                <InlineLaTeX formula={node.statementLatex} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
