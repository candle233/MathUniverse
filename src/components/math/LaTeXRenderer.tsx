'use client';

import React, { useMemo, useState } from 'react';
import katex from 'katex';
import { globalLatexMacros, getNodeTypeMeta, getVerificationMeta } from '@/lib/utils';
import { initialMathNodes } from '@/data/seedData';
import { MathNode } from '@/types/math';
import Link from 'next/link';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

interface LaTeXRendererProps {
  content: string;
  block?: boolean;
  className?: string;
  enableLinks?: boolean;
}

// Micro-Card Hover Popup for [[Theorem Name]] or node references
export function NodeHoverCard({ node }: { node: MathNode }) {
  const typeMeta = getNodeTypeMeta(node.nodeType);
  const verMeta = getVerificationMeta(node.verification);

  return (
    <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-80 p-4 rounded-xl glass-panel-glow bg-slate-900/95 border border-cyan-500/40 shadow-2xl text-left pointer-events-auto transition-all animate-in fade-in duration-200">
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${typeMeta.color}`}>
          {typeMeta.label}
        </span>
        <span className="text-[10px] text-slate-400 font-mono">MSC {node.mscCode}</span>
      </div>

      <h4 className="font-bold text-slate-100 text-sm mb-1 line-clamp-1">{node.titleZh}</h4>
      <p className="text-xs text-slate-400 font-mono mb-2 line-clamp-1">{node.titleEn}</p>

      {/* Render Formula Snippet */}
      <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800 text-xs overflow-x-auto text-cyan-200 mb-2">
        <InlineLaTeX formula={node.statementLatex} />
      </div>

      <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800">
        <span className="text-[11px] text-emerald-400 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          {verMeta.short}
        </span>
        <Link
          href={`/node/${node.slug}`}
          className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium hover:underline text-xs"
        >
          探索节点 <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-slate-900" />
    </div>
  );
}

// Single KaTeX Formula Component
export function InlineLaTeX({ formula, displayMode = false }: { formula: string; displayMode?: boolean }) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(formula.trim(), {
        displayMode,
        throwOnError: false,
        macros: globalLatexMacros,
        trust: false, // disable \href/\url/\html* commands to prevent HTML injection
      });
    } catch (e) {
      console.error('KaTeX parse error:', e);
      return `<span class="text-rose-400 font-mono text-xs">[LaTeX parse error: ${escapeHtml(formula)}]</span>`;
    }
  }, [formula, displayMode]);

  return (
    <span
      className={displayMode ? 'block my-3 text-center overflow-x-auto py-1' : 'inline-block px-0.5'}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function escapeHtml(str: string): string {
  return str.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

// Interactive Bidirectional Link [[Node Name]] Component
function MathWikiLink({ targetTitle }: { targetTitle: string }) {
  const [isHovered, setIsHovered] = useState(false);

  const matchedNode = useMemo(() => {
    const clean = targetTitle.trim().toLowerCase();
    return initialMathNodes.find(
      (n) =>
        n.titleZh.toLowerCase().includes(clean) ||
        n.titleEn.toLowerCase().includes(clean) ||
        n.slug.toLowerCase().includes(clean) ||
        clean.includes(n.titleZh.toLowerCase())
    );
  }, [targetTitle]);

  if (!matchedNode) {
    return <span className="text-cyan-400/80 font-medium underline decoration-dashed">[[{targetTitle}]]</span>;
  }

  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href={`/node/${matchedNode.slug}`}
        className="inline-flex items-center gap-0.5 text-cyan-300 font-medium hover:text-cyan-200 bg-cyan-950/40 hover:bg-cyan-900/50 px-1.5 py-0.5 rounded border border-cyan-500/30 transition-colors mx-0.5"
      >
        <Sparkles className="w-3 h-3 text-cyan-400" />
        {matchedNode.titleZh}
      </Link>
      {isHovered && <NodeHoverCard node={matchedNode} />}
    </span>
  );
}

// Full Rich Text & LaTeX & Markdown Parser
export default function LaTeXRenderer({ content, block = false, className = '', enableLinks = true }: LaTeXRendererProps) {
  const renderedElements = useMemo(() => {
    if (!content) return null;

    // First split by display math: $$ ... $$ or \[ ... \]
    const displayMathRegex = /(\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\])/g;
    const parts = content.split(displayMathRegex);

    return parts.map((part, index) => {
      if (part.startsWith('$$') && part.endsWith('$$')) {
        const formula = part.slice(2, -2);
        return <InlineLaTeX key={index} formula={formula} displayMode={true} />;
      } else if (part.startsWith('\\[') && part.endsWith('\\]')) {
        const formula = part.slice(2, -2);
        return <InlineLaTeX key={index} formula={formula} displayMode={true} />;
      } else {
        // Parse inline math ($...$ or \(...\)) and Wiki links ([[...]])
        return <InlineContentParser key={index} text={part} enableLinks={enableLinks} />;
      }
    });
  }, [content, enableLinks]);

  return <div className={`leading-relaxed text-slate-200 ${className}`}>{renderedElements}</div>;
}

// Helper to parse inline math, bold, and [[links]]
function InlineContentParser({ text, enableLinks }: { text: string; enableLinks: boolean }) {
  // Regex for inline math $...$ and \(...\) as well as [[WikiLink]]
  const inlineRegex = /(\$[^$\n]+?\$|\\\([^)]+?\\\)|\[\[.+?\]\])/g;
  const segments = text.split(inlineRegex);

  return (
    <>
      {segments.map((seg, idx) => {
        if (seg.startsWith('$') && seg.endsWith('$')) {
          const formula = seg.slice(1, -1);
          return <InlineLaTeX key={idx} formula={formula} displayMode={false} />;
        } else if (seg.startsWith('\\(') && seg.endsWith('\\)')) {
          const formula = seg.slice(2, -2);
          return <InlineLaTeX key={idx} formula={formula} displayMode={false} />;
        } else if (enableLinks && seg.startsWith('[[') && seg.endsWith(']]')) {
          const linkText = seg.slice(2, -2);
          return <MathWikiLink key={idx} targetTitle={linkText} />;
        } else {
          // Handle simple markdown line breaks and bold
          const lines = seg.split('\n');
          return (
            <React.Fragment key={idx}>
              {lines.map((line, lineIdx) => (
                <React.Fragment key={lineIdx}>
                  {lineIdx > 0 && <br />}
                  {line}
                </React.Fragment>
              ))}
            </React.Fragment>
          );
        }
      })}
    </>
  );
}
