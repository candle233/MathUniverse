'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { initialMathNodes } from '@/data/seedData';
import { disciplines } from '@/data/disciplines';
import { getNodeTypeMeta, getVerificationMeta } from '@/lib/utils';
import KnowledgeStarChart from '@/components/graph/KnowledgeStarChart';
import Cosmos3DGraph from '@/components/graph/Cosmos3DGraph';
import LearningPathTree from '@/components/graph/LearningPathTree';
import LeanWebEditor from '@/components/lean/LeanWebEditor';
import ProofTutorGame from '@/components/math/ProofTutorGame';
import ZfcCampaignQuest from '@/components/math/ZfcCampaignQuest';
import FallacyDetectiveLab from '@/components/math/FallacyDetectiveLab';
import MathComputeEngine from '@/components/sandbox/MathComputeEngine';
import AcademicExportStudio from '@/components/export/AcademicExportStudio';
import MscTreeExplorer from '@/components/math/MscTreeExplorer';
import CounterExampleGallery from '@/components/math/CounterExampleGallery';
import DynamicalSystemsLab from '@/components/math/DynamicalSystemsLab';
import MathFlashcardSystem from '@/components/math/MathFlashcardSystem';
import MathTimeline from '@/components/math/MathTimeline';
import LaTeXRenderer, { InlineLaTeX } from '@/components/math/LaTeXRenderer';
import { Sparkles, Network, ShieldCheck, ArrowRight, BookOpen, Layers, GitPullRequest, Code2, Trophy, Cpu, Zap, Activity, Compass } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredNodes = useMemo(() => {
    return initialMathNodes.filter((node) => {
      const matchDisc = selectedDiscipline === 'all' || node.disciplineId === selectedDiscipline;
      const matchType = selectedType === 'all' || node.nodeType === selectedType;
      return matchDisc && matchType;
    });
  }, [selectedDiscipline, selectedType]);

  return (
    <div className="space-y-16 pb-20">
      {/* 1. Hero Section */}
      <section className="relative pt-16 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel-glow text-cyan-300 text-xs font-semibold mb-2">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
          <span>全新上线：DAG 拓扑知识图谱与 Lean 4 / Python 交互式数学工作台（演示）</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-100 max-w-4xl mx-auto leading-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-400">
            数学结构化知识库
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
          MathUniverse 将人类所有的公理、定义与定理拆解为原子化 DAG 节点，融合极致 LaTeX 排版、浏览器端 Lean 4 机器形式化验证与交互式 Python 计算沙盒。
        </p>

        {/* Hero CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            href="/graph"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            <Network className="w-4 h-4" />
            <span>探索知识星空 (Cosmos DAG)</span>
          </Link>

          <Link
            href="/lean"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-sm transition-all cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Lean 4 形式化验证</span>
          </Link>

          <Link
            href="/editor"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-sm transition-all cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-purple-400" />
            <span>块级编辑器创作</span>
          </Link>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8">
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm">
            <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono">
              {initialMathNodes.length}
            </div>
            <div className="text-xs text-slate-400 mt-1">原子化数学命题</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">100%</div>
            <div className="text-xs text-slate-400 mt-1">种子库严格无环 (DAG 已测)</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm">
            <div className="text-2xl sm:text-3xl font-extrabold text-purple-400 font-mono">
              {initialMathNodes.filter((n) => n.leanFormalization).length}
            </div>
            <div className="text-xs text-slate-400 mt-1">Lean 4 演示验证条目</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm">
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">{disciplines.length}</div>
            <div className="text-xs text-slate-400 mt-1">学科分类 (MSC 2020)</div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Knowledge Star Chart Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
              <Network className="w-6 h-6 text-cyan-400" />
              <span>全景知识星宿图谱 (Knowledge Cosmos DAG)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              基于有向无环图（DAG）的严格拓扑推导流，拖拽节点或平移画布探索跨学科依赖
            </p>
          </div>
          <Link
            href="/graph"
            className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
          >
            <span>进入全屏图谱探索</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <KnowledgeStarChart />
      </section>

      {/* 3. Mathematical Disciplines Filter & Showcase Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
              <Layers className="w-6 h-6 text-purple-400" />
              <span>多学科核心命题库 (Axioms & Theorems)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              涵盖分析、代数、几何拓扑、数论、逻辑与概率统计六大支柱学科
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedDiscipline}
              onChange={(e) => setSelectedDiscipline(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-300 text-xs rounded-xl px-3 py-2 outline-none font-medium cursor-pointer"
            >
              <option value="all">所有数学学科</option>
              {disciplines.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nameZh} (MSC {d.mscCode})
                </option>
              ))}
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-300 text-xs rounded-xl px-3 py-2 outline-none font-medium cursor-pointer"
            >
              <option value="all">所有节点类型</option>
              <option value="AXIOM">公理 (Axiom)</option>
              <option value="DEFINITION">定义 (Definition)</option>
              <option value="THEOREM">定理 (Theorem)</option>
              <option value="LEMMA">引理 (Lemma)</option>
              <option value="COROLLARY">推论 (Corollary)</option>
              <option value="CONJECTURE">猜想 (Conjecture)</option>
            </select>
          </div>
        </div>

        {/* Theorem Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNodes.map((node) => {
            const meta = getNodeTypeMeta(node.nodeType);
            const verMeta = getVerificationMeta(node.verification);

            return (
              <Link
                key={node.id}
                href={`/node/${node.slug}`}
                className="rounded-2xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900/90 hover:border-cyan-500/50 transition-all p-5 flex flex-col justify-between space-y-4 group shadow-lg hover:shadow-cyan-500/10 cursor-pointer block"
              >
                <div className="space-y-3 pointer-events-none">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[11px] px-2.5 py-0.5 rounded-full border font-semibold ${meta.color}`}>
                      {meta.label}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">MSC {node.mscCode}</span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                      {node.titleZh}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono line-clamp-1">{node.titleEn}</p>
                  </div>

                  {/* Formula Box */}
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-cyan-200 font-mono overflow-x-auto">
                    <InlineLaTeX formula={node.statementLatex} />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 pointer-events-none">
                  <span className="text-emerald-400 flex items-center gap-1 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {verMeta.short}
                  </span>
                  <span className="group-hover:translate-x-1 transition-transform text-cyan-400 flex items-center gap-1 font-semibold">
                    查看推导 <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. Topological Skill Tree Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-amber-400" />
              <span>动态学习路径 (Topological Learning Path)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              自动逆向回溯定理前置依赖树，生成由浅入深的通关路线图
            </p>
          </div>
        </div>

        <LearningPathTree targetNodeId="thm-stokes" />
      </section>

      {/* 5. Dynamical Systems & Phase Portrait Lab */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <DynamicalSystemsLab />
      </section>

      {/* 6. Spaced Repetition Mathematical Flashcards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <MathFlashcardSystem />
      </section>

      {/* 7. History Timeline & Lineage of Giants */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <MathTimeline />
      </section>

      {/* 8. Lean 4 Interactive Playground Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Cpu className="w-6 h-6 text-emerald-400" />
            <span>Lean 4 零算力形式化验证实验室 (Formal Prover)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            在浏览器中实时编译并检查形式化数学证明，支持 Mathlib 与 #print axioms 安全审计
          </p>
        </div>

        <LeanWebEditor
          initialData={initialMathNodes.find((n) => n.id === 'thm-cauchy-schwarz')?.leanFormalization}
        />
      </section>

      {/* 9. 3D Cosmos & Minimum Prerequisite Closure */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <Cosmos3DGraph />
      </section>

      {/* 10. Client-Side Math Compute Lab */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <MathComputeEngine />
      </section>

      {/* 11. ZFC to Modern Math RPG Campaign */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <ZfcCampaignQuest />
      </section>

      {/* 12. Mathematical Fallacy Detective */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <FallacyDetectiveLab />
      </section>

      {/* 13. Academic Publishing & Paper Studio */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <AcademicExportStudio />
      </section>

      {/* 14. Interactive Step-by-Step Proof Tutor Game */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <ProofTutorGame />
      </section>

      {/* 15. Mathematical Counterexamples & Monsters Gallery */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <CounterExampleGallery />
      </section>

      {/* 16. MSC 2020 Mathematics Subject Classification Directory Tree */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <MscTreeExplorer />
      </section>
    </div>
  );
}
