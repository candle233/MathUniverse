'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import KnowledgeStarChart from '@/components/graph/KnowledgeStarChart';
import Cosmos3DGraph from '@/components/graph/Cosmos3DGraph';
import LearningPathTree from '@/components/graph/LearningPathTree';
import ThreeMathSurface from '@/components/math/ThreeMathSurface';
import CommutativeDiagramViewer from '@/components/math/CommutativeDiagramViewer';
import TikzStudio from '@/components/math/TikzStudio';
import DynamicalSystemsLab from '@/components/math/DynamicalSystemsLab';
import { Network, GitFork, Sparkles, Box, GitMerge, Code2, Activity, Globe } from 'lucide-react';

export default function GraphPage() {
  const { isZh } = useLanguage();
  const [viewMode, setViewMode] = useState<'cosmos3d' | 'star' | 'manifold3d' | 'dynamical' | 'diagram' | 'tikz' | 'tree'>('cosmos3d');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Network className="w-4 h-4" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
              {isZh ? '知识星空图谱与拓扑路径 (Knowledge Cosmos & DAG)' : 'Knowledge Cosmos Graph & Topological Pathways (DAG)'}
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            {isZh
              ? '以有向无环图（DAG）为数学知识底座，杜绝循环论证，探索跨学科拓扑结构'
              : 'A Directed Acyclic Graph (DAG) foundation for mathematical knowledge — no circular reasoning — explore cross-disciplinary topological structure'}
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 flex-wrap gap-1">
          <button
            onClick={() => setViewMode('cosmos3d')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'cosmos3d'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{isZh ? '3D 知识星系' : '3D Knowledge Galaxy'}</span>
          </button>

          <button
            onClick={() => setViewMode('star')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'star'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isZh ? '2D 关系星宿图' : '2D Relation Star Map'}</span>
          </button>

          <button
            onClick={() => setViewMode('manifold3d')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'manifold3d'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>{isZh ? '3D 微分流形' : '3D Differential Manifolds'}</span>
          </button>

          <button
            onClick={() => setViewMode('dynamical')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'dynamical'
                ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>{isZh ? '动力系统相平面' : 'Dynamical Systems Phase Plane'}</span>
          </button>

          <button
            onClick={() => setViewMode('diagram')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'diagram'
                ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <GitMerge className="w-3.5 h-3.5" />
            <span>{isZh ? 'TikZ 交互交换图' : 'TikZ Interactive Diagrams'}</span>
          </button>

          <button
            onClick={() => setViewMode('tikz')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'tikz'
                ? 'bg-purple-500 text-slate-950 shadow-md shadow-purple-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>{isZh ? 'TikZ 矢量导出工坊' : 'TikZ Vector Export Studio'}</span>
          </button>

          <button
            onClick={() => setViewMode('tree')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'tree'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <GitFork className="w-3.5 h-3.5" />
            <span>{isZh ? '逆向技能闯关树' : 'Reverse Skill Tree'}</span>
          </button>
        </div>
      </div>

      {/* Main View Area */}
      {viewMode === 'cosmos3d' && <Cosmos3DGraph />}
      {viewMode === 'star' && <KnowledgeStarChart />}
      {viewMode === 'manifold3d' && <ThreeMathSurface surface="mobius" />}
      {viewMode === 'dynamical' && <DynamicalSystemsLab />}
      {viewMode === 'diagram' && <CommutativeDiagramViewer />}
      {viewMode === 'tikz' && <TikzStudio />}
      {viewMode === 'tree' && <LearningPathTree targetNodeId="thm-stokes" />}
    </div>
  );
}
