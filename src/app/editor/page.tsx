'use client';

import React from 'react';
import BlockEditor from '@/components/editor/BlockEditor';
import FormulaAssistant from '@/components/math/FormulaAssistant';
import LatexSymbolStudio from '@/components/editor/LatexSymbolStudio';
import TikzStudio from '@/components/math/TikzStudio';
import AcademicExportStudio from '@/components/export/AcademicExportStudio';
import { Edit3, Download, FileText, Share2, Sparkles } from 'lucide-react';

// Read the most recent draft from localStorage (where BlockEditor persists) and
// convert each block to a Markdown / LaTeX representation. Trigger a real Blob
// download so the button actually does what its label claims.
function downloadDraft() {
  if (typeof window === 'undefined') return;
  const raw = window.localStorage.getItem('matheditor:blocks');
  let blocks: Array<{ id: string; type: string; content: string }> = [];
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) blocks = parsed;
    } catch {
      // ignore — fall back to the default seed below
    }
  }
  if (blocks.length === 0) {
    // No saved state: emit a small placeholder explaining the demo behavior.
    blocks = [
      {
        id: 'demo',
        type: 'TEXT',
        content: '当前没有已保存的草稿。在块编辑器中编辑后会自动保存到 localStorage，再次点击导出即可下载。',
      },
    ];
  }

  const md = blocks
    .map((b) => {
      switch (b.type) {
        case 'LATEX':
          return `$$\n${b.content}\n$$`;
        case 'LEAN':
          return '```lean\n' + b.content + '\n```';
        case 'PYTHON':
          return '```python\n' + b.content + '\n```';
        case 'INTUITION':
          return `> **直觉**: ${b.content}`;
        case 'PROOF_STEP':
          return `- **步骤**: ${b.content}`;
        default:
          return b.content;
      }
    })
    .join('\n\n');

  const blob = new Blob([`<!-- 由 MathUniverse Editor 导出于 ${new Date().toISOString()} -->\n\n${md}\n`], {
    type: 'text/markdown;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `mathuniverse-draft-${new Date().toISOString().slice(0, 10)}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function EditorPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Edit3 className="w-4 h-4" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
              数学块级富文本创作中心 (MathUniverse Editor)
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            所见即所得的 Notion 风格块编辑器，支持 LaTeX、Lean 4 代码块、双向链接 [[...]] 与 Python 交互沙盒
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => downloadDraft()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>导出当前编辑器为 Markdown / LaTeX 源码包</span>
          </button>
        </div>
      </div>

      {/* Main Notion Block Editor */}
      <BlockEditor />

      {/* Academic Paper & Typst Publishing Studio */}
      <AcademicExportStudio />

      {/* LaTeX High-Order Math Symbols Palette */}
      <LatexSymbolStudio />

      {/* TikZ-cd Vector Diagram Studio */}
      <TikzStudio />

      {/* Formula OCR, Citation & Lean Skeleton Generator */}
      <FormulaAssistant />
    </div>
  );
}
