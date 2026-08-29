'use client';

import React, { useState, useEffect } from 'react';
import LaTeXRenderer, { InlineLaTeX } from '@/components/math/LaTeXRenderer';
import { Plus, Trash2, MoveUp, MoveDown, Eye, Edit3, Sparkles } from 'lucide-react';

export interface EditorBlock {
  id: string;
  type: 'TEXT' | 'LATEX' | 'LEAN' | 'PYTHON' | 'INTUITION' | 'PROOF_STEP';
  content: string;
  meta?: Record<string, any>;
}

export default function BlockEditor({ onSave }: { onSave?: (blocks: EditorBlock[]) => void }) {
  // Persist blocks to localStorage so the editor's "Export" button can download them.
  const STORAGE_KEY = 'matheditor:blocks';
  const [blocks, setBlocks] = useState<EditorBlock[]>(() => {
    return [
      {
        id: 'b-1',
      type: 'INTUITION',
      content: '构造柯西-施瓦茨不等式的几何直觉：在任意实内积空间中，向量投影长度永远不大于被投影向量本身的模长。',
    },
    {
      id: 'b-2',
      type: 'LATEX',
      content: '|\\langle u, v \\rangle|^2 \\le \\langle u, u \\rangle \\cdot \\langle v, v \\rangle',
    },
    {
      id: 'b-3',
      type: 'TEXT',
      content: '引入一元非负实二次函数 $P(t) = \\|u - t v\\|^2 \\ge 0$，展开后由判别式 $\\Delta \\le 0$ 可立得证明。参考前置基础概念：[[数列极限 (ε-N 定义)]]。',
    },
    {
      id: 'b-4',
      type: 'LEAN',
      content: `theorem cauchy_schwarz_real (x y : E) :
    |⟪x, y⟫_ℝ| ≤ ‖x‖ * ‖y‖ := by
  exact abs_real_inner_le_norm x y`,
      },
    ];
  });

  // Save blocks to localStorage whenever they change so the editor's "Export"
  // button can download the current draft.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(blocks));
    } catch {
      // ignore quota errors
    }
  }, [blocks]);

  const [previewMode, setPreviewMode] = useState(false);

  const addBlock = (type: EditorBlock['type']) => {
    const newBlock: EditorBlock = {
      id: `b-${Date.now()}`,
      type,
      content:
        type === 'LATEX'
          ? '\\int_a^b f(x) \\, dx = F(b) - F(a)'
          : type === 'LEAN'
          ? '-- Lean 4 verification snippet\ntheorem example_thm : True := by trivial'
          : type === 'PYTHON'
          ? '# SymPy computation\nimport sympy as sp\nx = sp.Symbol("x")'
          : type === 'INTUITION'
          ? '### 直觉动机\n用通俗生动的比喻解释这一数学事实。'
          : '输入数学正文，支持 $x^2+y^2$ 以及 [[双向链接]]...',
    };
    setBlocks((prev) => [...prev, newBlock]);
  };

  const updateBlock = (id: string, content: string) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, content } : b)));
  };

  const removeBlock = (id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= blocks.length) return;
    const newBlocks = [...blocks];
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[targetIdx];
    newBlocks[targetIdx] = temp;
    setBlocks(newBlocks);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
      {/* Editor Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-slate-100 text-sm">Notion 风格数学块级编辑器 (Block-level Editor)</h4>
            <p className="text-[11px] text-slate-400">支持 LaTeX 公式、Lean 形式化代码、Python 交互沙盒无缝穿插</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              previewMode
                ? 'bg-cyan-500 text-slate-950'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {previewMode ? <Edit3 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{previewMode ? '返回编辑' : '实时预览'}</span>
          </button>
        </div>
      </div>

      {/* Blocks Container */}
      <div className="p-6 space-y-4 min-h-[360px]">
        {blocks.map((block, index) => (
          <div
            key={block.id}
            className="group relative rounded-xl border border-slate-800/80 bg-slate-900/40 hover:border-slate-700 transition-all p-4"
          >
            {/* Block Header Toolbar */}
            {!previewMode && (
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <div className="flex items-center gap-2 font-mono">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px]">
                    {block.type} BLOCK
                  </span>
                </div>
                <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => moveBlock(index, 'up')}
                    disabled={index === 0}
                    className="p-1 hover:bg-slate-800 rounded text-slate-400 disabled:opacity-30"
                  >
                    <MoveUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => moveBlock(index, 'down')}
                    disabled={index === blocks.length - 1}
                    className="p-1 hover:bg-slate-800 rounded text-slate-400 disabled:opacity-30"
                  >
                    <MoveDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => removeBlock(block.id)}
                    className="p-1 hover:bg-rose-950/50 rounded text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Block Body */}
            {previewMode ? (
              /* Preview Mode */
              <div>
                {block.type === 'LATEX' ? (
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
                    <InlineLaTeX formula={block.content} displayMode={true} />
                  </div>
                ) : block.type === 'LEAN' ? (
                  <div className="p-3 bg-slate-950 rounded-xl border border-emerald-500/30 font-mono text-xs text-emerald-300 whitespace-pre">
                    <div className="text-[10px] text-emerald-500 font-bold mb-1">LEAN 4 FORMALIZATION:</div>
                    {block.content}
                  </div>
                ) : block.type === 'INTUITION' ? (
                  <div className="p-3 bg-amber-950/20 rounded-xl border border-amber-500/30 text-amber-200 text-xs">
                    {block.content}
                  </div>
                ) : (
                  <LaTeXRenderer content={block.content} />
                )}
              </div>
            ) : (
              /* Edit Mode */
              <div>
                {block.type === 'LATEX' ? (
                  <div className="space-y-2">
                    <textarea
                      value={block.content}
                      onChange={(e) => updateBlock(block.id, e.target.value)}
                      placeholder="输入 LaTeX 公式..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 font-mono text-xs text-cyan-300 outline-none focus:border-cyan-500 resize-none h-20"
                    />
                    <div className="p-2 bg-slate-950 rounded border border-slate-800/60">
                      <InlineLaTeX formula={block.content} displayMode={true} />
                    </div>
                  </div>
                ) : block.type === 'LEAN' ? (
                  <textarea
                    value={block.content}
                    onChange={(e) => updateBlock(block.id, e.target.value)}
                    placeholder="输入 Lean 4 形式化代码..."
                    className="w-full bg-slate-950 border border-emerald-500/30 rounded-lg p-2.5 font-mono text-xs text-emerald-300 outline-none focus:border-emerald-500 resize-none h-24 whitespace-pre"
                  />
                ) : (
                  <textarea
                    value={block.content}
                    onChange={(e) => updateBlock(block.id, e.target.value)}
                    placeholder="输入内容，支持 $...$ 与 [[双向链接]]..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 outline-none focus:border-cyan-500 resize-none h-20"
                  />
                )}
              </div>
            )}
          </div>
        ))}

        {/* Add Block Selector Toolbar */}
        {!previewMode && (
          <div className="pt-2 flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">插入新逻辑块:</span>
            <button
              onClick={() => addBlock('TEXT')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium cursor-pointer"
            >
              <Plus className="w-3 h-3 text-cyan-400" /> 文本与内联公式
            </button>
            <button
              onClick={() => addBlock('LATEX')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium cursor-pointer"
            >
              <Plus className="w-3 h-3 text-purple-400" /> 独立 LaTeX 块
            </button>
            <button
              onClick={() => addBlock('LEAN')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium cursor-pointer"
            >
              <Plus className="w-3 h-3 text-emerald-400" /> Lean 4 验证块
            </button>
            <button
              onClick={() => addBlock('INTUITION')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium cursor-pointer"
            >
              <Plus className="w-3 h-3 text-amber-400" /> 直觉/动机块
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
