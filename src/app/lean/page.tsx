'use client';

import React, { useState } from 'react';
import { initialMathNodes } from '@/data/seedData';
import LeanWebEditor from '@/components/lean/LeanWebEditor';
import MathlibFinder from '@/components/lean/MathlibFinder';
import LeanTacticSimulator from '@/components/lean/LeanTacticSimulator';
import LeanTacticsDeck from '@/components/lean/LeanTacticsDeck';
import AiMathTranslator from '@/components/math/AiMathTranslator';
import { ShieldCheck, BookOpen, Sparkles, Cpu, CheckCircle2 } from 'lucide-react';

export default function LeanPage() {
  const formalizableNodes = initialMathNodes.filter((n) => n.leanFormalization);
  const [selectedNodeId, setSelectedNodeId] = useState(formalizableNodes[0]?.id || 'thm-cauchy-schwarz');

  const selectedNode = formalizableNodes.find((n) => n.id === selectedNodeId) || formalizableNodes[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
              Lean 4 Web 零算力形式化验证实验室
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            基于 WebAssembly (WASM) 技术，在用户浏览器中直接运行 Lean 4 编译器与证明状态 LSP
          </p>
        </div>

        {/* Quick Theorem Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">加载形式化定理:</span>
          <select
            value={selectedNodeId}
            onChange={(e) => setSelectedNodeId(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-emerald-300 text-xs rounded-xl px-3 py-2 outline-none font-medium cursor-pointer"
          >
            {formalizableNodes.map((n) => (
              <option key={n.id} value={n.id}>
                {n.titleZh} ({n.leanFormalization?.theoremName})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Interactive Prover Editor */}
      {selectedNode?.leanFormalization && (
        <LeanWebEditor key={selectedNode.id} initialData={selectedNode.leanFormalization} />
      )}

      {/* AI Natural Language to Lean 4 Formalizer Assistant */}
      <AiMathTranslator />

      {/* Interactive Lean 4 Tactics Mastery Deck */}
      <LeanTacticsDeck />

      {/* Interactive Tactic State Machine Simulator */}
      <LeanTacticSimulator />

      {/* Official Mathlib Lemmas Assistant */}
      <MathlibFinder />
    </div>
  );
}
