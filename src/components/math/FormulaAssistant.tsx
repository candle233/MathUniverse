'use client';

import React, { useState, useMemo } from 'react';
import { initialMathNodes } from '@/data/seedData';
import { InlineLaTeX } from '@/components/math/LaTeXRenderer';
import { useLanguage } from '@/context/LanguageContext';
import { getNodeTitle } from '@/lib/i18nHelper';
import { Sparkles, Copy, Check, Terminal, BookOpen, FileCode } from 'lucide-react';

export default function FormulaAssistant() {
  const { locale, isZh } = useLanguage();
  const [inputLatex, setInputLatex] = useState(
    `\\int_{\\partial \\Omega} \\omega = \\int_{\\Omega} d\\omega`
  );
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Auto-suggest matched theorems from MathUniverse
  const matchedTheorems = useMemo(() => {
    if (!inputLatex.trim()) return [];
    const clean = inputLatex.replace(/[\s\\]/g, '').toLowerCase();

    return initialMathNodes.filter((node) => {
      const nodeClean = node.statementLatex.replace(/[\s\\]/g, '').toLowerCase();
      return (
        nodeClean.includes(clean) ||
        clean.includes(nodeClean) ||
        clean.includes(node.slug.replace(/-/g, ''))
      );
    });
  }, [inputLatex]);

  // Generated Lean 4 skeleton
  const leanSkeleton = useMemo(() => {
    const matched = matchedTheorems[0];
    const thmName = matched?.leanFormalization?.theoremName || 'my_new_theorem';
    const mathlib = matched?.leanFormalization?.mathlibImports?.[0] || 'Mathlib.Data.Real.Basic';

    return `import ${mathlib}

open scoped Topology

-- Scaffolded from MathUniverse Formalization Assistant
theorem ${thmName} :
    -- TODO: Define hypotheses & theorem statement
    True := by
  sorry`;
  }, [matchedTheorems]);

  // BibTeX citation removed: the previous version cited a non-existent journal
  // (MathUniverse Encyclopedia of Pure and Applied Mathematics) and a fake domain
  // (mathuniverse.org). Keeping that string would mislead users who paste it
  // into a real paper. The "Lean 4 skeleton" generator is still useful and remains below.
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-sm">
              {isZh ? '公式智能识别与学术文献助手 (Formula & Citation Assistant)' : 'Formula & Citation Assistant'}
            </h3>
            <p className="text-xs text-slate-400">
              {isZh
                ? '粘贴任意 LaTeX 公式，自动识别关联定理、生成双向内链与 BibTeX 学术引用'
                : 'Paste any LaTeX formula to auto-match related theorems and generate bidirectional wiki links and Lean 4 skeletons'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input & Recognition */}
        <div className="lg:col-span-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">{isZh ? '输入 LaTeX 数学公式表达式:' : 'LaTeX formula input:'}</label>
            <textarea
              value={inputLatex}
              onChange={(e) => setInputLatex(e.target.value)}
              placeholder={isZh ? '输入 LaTeX 源码，例如 \\int_{\\partial \\Omega} \\omega...' : 'Enter LaTeX source, e.g. \\int_{\\partial \\Omega} \\omega...'}
              className="w-full h-24 bg-slate-900 border border-slate-700 text-cyan-300 font-mono text-xs rounded-xl p-3 outline-none focus:border-cyan-500 resize-none"
            />
          </div>

          {/* Render Preview */}
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center text-xs overflow-x-auto text-cyan-200">
            <InlineLaTeX formula={inputLatex} displayMode={true} />
          </div>

          {/* Matched Entities */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-400 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isZh ? `知识库自动匹配关联定理 (${matchedTheorems.length}):` : `Matched theorems from the knowledge base (${matchedTheorems.length}):`}</span>
            </div>

            {matchedTheorems.length > 0 ? (
              <div className="space-y-2">
                {matchedTheorems.map((m) => (
                  <div key={m.id} className="p-3 rounded-xl bg-slate-900 border border-cyan-500/30 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-200">{getNodeTitle(m, locale)}</span>
                      <p className="text-[11px] text-slate-400 font-mono">MSC {m.mscCode}{isZh ? ` • ${m.titleEn}` : ''}</p>
                    </div>
                    <button
                      onClick={() => handleCopy(`[[${isZh ? m.titleZh : m.titleEn}]]`, m.id)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px] font-mono cursor-pointer"
                    >
                      {copiedKey === m.id ? (isZh ? '已复制 [[内链]]' : 'Copied [[link]]') : isZh ? '复制 [[双向内链]]' : 'Copy [[wiki link]]'}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-slate-900 text-xs text-slate-500 text-center">
                {isZh
                  ? '未检测到完全相同的定理，可用于创建全新词条。'
                  : 'No matching theorem found — you can use this to create a brand-new entry.'}
              </div>
            )}
          </div>
        </div>

        {/* Right: Lean 4 Skeleton Generator */}
        <div className="lg:col-span-6 space-y-4">
          {/* Lean 4 Code Skeleton */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1 text-emerald-300">
                <FileCode className="w-3.5 h-3.5" /> {isZh ? '自动生成 Lean 4 定理脚手架' : 'Auto-generated Lean 4 theorem scaffold'}
              </span>
              <button
                onClick={() => handleCopy(leanSkeleton, 'lean_skel')}
                className="text-[11px] text-slate-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
              >
                {copiedKey === 'lean_skel' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'lean_skel' ? (isZh ? '已复制' : 'Copied') : isZh ? '复制 Lean 4 骨架' : 'Copy Lean 4 skeleton'}</span>
              </button>
            </div>
            <pre className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-auto max-h-32">
              <code>{leanSkeleton}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
