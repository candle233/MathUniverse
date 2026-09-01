'use client';

import React, { useMemo, useState } from 'react';
import katex from 'katex';
import { globalLatexMacros, getNodeTypeMeta, getVerificationMeta } from '@/lib/utils';
import { initialMathNodes } from '@/data/seedData';
import { MathNode } from '@/types/math';
import { getNodeTitle } from '@/lib/i18nHelper';
import { useLanguage } from '@/context/LanguageContext';
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
  const { locale, isZh } = useLanguage();
  const typeMeta = getNodeTypeMeta(node.nodeType, locale);
  const verMeta = getVerificationMeta(node.verification, locale);

  return (
    <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-80 p-4 rounded-xl glass-panel-glow bg-slate-900/95 border border-cyan-500/40 shadow-2xl text-left pointer-events-auto transition-all animate-in fade-in duration-200">
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${typeMeta.color}`}>
          {typeMeta.label}
        </span>
        <span className="text-[10px] text-slate-400 font-mono">MSC {node.mscCode}</span>
      </div>

      <h4 className="font-bold text-slate-100 text-sm mb-1 line-clamp-1">{isZh ? node.titleZh : node.titleEn}</h4>
      {isZh && <p className="text-xs text-slate-400 font-mono mb-2 line-clamp-1">{node.titleEn}</p>}

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
          {isZh ? '探索节点' : 'Explore node'} <ArrowRight className="w-3 h-3" />
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
      className={displayMode ? 'block my-3 text-center overflow-x-auto py-1' : 'inline-block px-0.5 align-middle'}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function escapeHtml(str: string): string {
  return str.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

// Interactive Bidirectional Link [[Node Name]] Component
export function MathWikiLink({ targetTitle }: { targetTitle: string }) {
  const { locale } = useLanguage();
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
        {getNodeTitle(matchedNode, locale)}
      </Link>
      {isHovered && <NodeHoverCard node={matchedNode} />}
    </span>
  );
}

// Helper to render inline markdown styles (bold, italic, inline code, inline math, links)
function renderInlineContent(text: string, enableLinks: boolean = true): React.ReactNode[] {
  // Regex to match inline math $...$, \(...\), wiki links [[...]], code `...`, markdown links [text](url)
  const tokenRegex = /(\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\]|\$[^$\n]+?\$|\\\([^)]+?\\\)|\[\[.+?\]\]|`[^`\n]+?`|\[[^\]]+?\]\([^)]+?\))/g;
  const segments = text.split(tokenRegex);

  return segments.map((seg, segIdx) => {
    if (!seg) return null;

    // 1. Display math inside inline block
    if ((seg.startsWith('$$') && seg.endsWith('$$')) || (seg.startsWith('\\[') && seg.endsWith('\\]'))) {
      const formula = seg.slice(2, -2);
      return <InlineLaTeX key={segIdx} formula={formula} displayMode={true} />;
    }
    // 2. Inline math $...$
    if (seg.startsWith('$') && seg.endsWith('$')) {
      const formula = seg.slice(1, -1);
      return <InlineLaTeX key={segIdx} formula={formula} displayMode={false} />;
    }
    // 3. Inline math \(...\)
    if (seg.startsWith('\\(') && seg.endsWith('\\)')) {
      const formula = seg.slice(2, -2);
      return <InlineLaTeX key={segIdx} formula={formula} displayMode={false} />;
    }
    // 4. Wiki link [[...]]
    if (enableLinks && seg.startsWith('[[') && seg.endsWith(']]')) {
      const linkText = seg.slice(2, -2);
      return <MathWikiLink key={segIdx} targetTitle={linkText} />;
    }
    // 5. Inline code `...`
    if (seg.startsWith('`') && seg.endsWith('`')) {
      const codeText = seg.slice(1, -1);
      return (
        <code
          key={segIdx}
          className="px-1.5 py-0.5 mx-0.5 rounded bg-slate-800/90 text-cyan-300 font-mono text-xs border border-slate-700/80"
        >
          {codeText}
        </code>
      );
    }
    // 6. Markdown link [text](url)
    const linkMatch = seg.match(/^\[([^\]]+?)\]\(([^)]+?)\)$/);
    if (linkMatch) {
      const [, linkLabel, linkUrl] = linkMatch;
      return (
        <a
          key={segIdx}
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition-colors font-medium"
        >
          {linkLabel}
        </a>
      );
    }

    // 7. Plain text: parse bold (**...** / __...__) and italic (*...* / _..._) and strikethrough (~~...~~)
    return <React.Fragment key={segIdx}>{parseFormatting(seg)}</React.Fragment>;
  });
}

// Sub-parser for bold, italic, and strikethrough in plain text
function parseFormatting(text: string): React.ReactNode[] {
  // Regex to match **bold**, __bold__, *italic*, _italic_, ~~strikethrough~~
  const formatRegex = /(\*\*[^*]+?\*\*|__[^_]+?__|~~[^~]+?~~|\*[^*]+?\*|_[^_]+?_)/g;
  const parts = text.split(formatRegex);

  return parts.map((part, pIdx) => {
    if (!part) return null;

    // Bold **...** or __...__
    if ((part.startsWith('**') && part.endsWith('**')) || (part.startsWith('__') && part.endsWith('__'))) {
      const inner = part.slice(2, -2);
      return (
        <strong key={pIdx} className="font-bold text-slate-100">
          {parseFormatting(inner)}
        </strong>
      );
    }
    // Strikethrough ~~...~~
    if (part.startsWith('~~') && part.endsWith('~~')) {
      const inner = part.slice(2, -2);
      return (
        <del key={pIdx} className="line-through text-slate-500">
          {parseFormatting(inner)}
        </del>
      );
    }
    // Italic *...* or _..._
    if ((part.startsWith('*') && part.endsWith('*')) || (part.startsWith('_') && part.endsWith('_'))) {
      const inner = part.slice(1, -1);
      return (
        <em key={pIdx} className="italic text-slate-200">
          {parseFormatting(inner)}
        </em>
      );
    }

    // Unformatted text
    return part;
  });
}

// Full Rich Text & Markdown & LaTeX Parser
export default function LaTeXRenderer({ content, block = false, className = '', enableLinks = true }: LaTeXRendererProps) {
  const renderedElements = useMemo(() => {
    if (!content) return null;

    // 1. Extract Code Blocks (```lang ... ```) and Display Math Blocks ($$...$$ / \[...\])
    const blockTokens: Array<{
      placeholder: string;
      type: 'code' | 'math';
      code?: string;
      lang?: string;
      formula?: string;
    }> = [];

    let tokenized = content;

    // Code blocks
    tokenized = tokenized.replace(/```(\w*)\r?\n([\s\S]*?)```/g, (_, lang, code) => {
      const placeholder = `@@BLOCK_CODE_${blockTokens.length}@@`;
      blockTokens.push({ placeholder, type: 'code', code, lang });
      return `\n\n${placeholder}\n\n`;
    });

    // Display math blocks $$ ... $$ or \[ ... \]
    tokenized = tokenized.replace(/(\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\])/g, (match) => {
      const placeholder = `@@BLOCK_MATH_${blockTokens.length}@@`;
      const formula = match.startsWith('$$') ? match.slice(2, -2) : match.slice(2, -2);
      blockTokens.push({ placeholder, type: 'math', formula });
      return `\n\n${placeholder}\n\n`;
    });

    // 2. Parse lines into markdown blocks
    const lines = tokenized.split(/\r?\n/);
    const blocks: React.ReactNode[] = [];

    let currentList: { type: 'ul' | 'ol'; items: string[] } | null = null;
    let currentParagraph: string[] = [];

    const flushList = () => {
      if (currentList) {
        if (currentList.type === 'ul') {
          blocks.push(
            <ul key={`ul-${blocks.length}`} className="my-2 space-y-1.5 pl-2">
              {currentList.items.map((item, iIdx) => (
                <li key={iIdx} className="flex items-start gap-2.5 text-sm text-slate-300 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0" />
                  <span className="flex-1">{renderInlineContent(item, enableLinks)}</span>
                </li>
              ))}
            </ul>
          );
        } else {
          blocks.push(
            <ol key={`ol-${blocks.length}`} className="my-2 space-y-1.5 pl-2">
              {currentList.items.map((item, iIdx) => (
                <li key={iIdx} className="flex items-start gap-2 text-sm text-slate-300 leading-relaxed">
                  <span className="text-xs font-mono text-cyan-400 font-bold mt-0.5 shrink-0">{iIdx + 1}.</span>
                  <span className="flex-1">{renderInlineContent(item, enableLinks)}</span>
                </li>
              ))}
            </ol>
          );
        }
        currentList = null;
      }
    };

    const flushParagraph = () => {
      if (currentParagraph.length > 0) {
        const text = currentParagraph.join(' ');
        if (text.trim()) {
          // Check if paragraph contains placeholder tokens
          const tokenMatch = blockTokens.find((t) => text.trim() === t.placeholder);
          if (tokenMatch) {
            if (tokenMatch.type === 'math') {
              blocks.push(
                <InlineLaTeX
                  key={`math-${blocks.length}`}
                  formula={tokenMatch.formula || ''}
                  displayMode={true}
                />
              );
            } else if (tokenMatch.type === 'code') {
              blocks.push(
                <div key={`code-${blocks.length}`} className="my-3 rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                  {tokenMatch.lang && (
                    <div className="px-4 py-1.5 bg-slate-900 border-b border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                      <span>{tokenMatch.lang}</span>
                    </div>
                  )}
                  <pre className="p-4 text-xs font-mono text-cyan-200 overflow-x-auto">
                    <code>{tokenMatch.code}</code>
                  </pre>
                </div>
              );
            }
          } else {
            blocks.push(
              <p key={`p-${blocks.length}`} className="my-2 text-sm text-slate-300 leading-relaxed">
                {renderInlineContent(text, enableLinks)}
              </p>
            );
          }
        }
        currentParagraph = [];
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const rawLine = lines[i];
      const trimmed = rawLine.trim();

      // Empty line -> flush paragraph / list
      if (!trimmed) {
        flushParagraph();
        flushList();
        continue;
      }

      // Check placeholder tokens on dedicated line
      const token = blockTokens.find((t) => t.placeholder === trimmed);
      if (token) {
        flushParagraph();
        flushList();
        if (token.type === 'math') {
          blocks.push(
            <InlineLaTeX
              key={`math-${blocks.length}`}
              formula={token.formula || ''}
              displayMode={true}
            />
          );
        } else if (token.type === 'code') {
          blocks.push(
            <div key={`code-${blocks.length}`} className="my-3 rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
              {token.lang && (
                <div className="px-4 py-1.5 bg-slate-900 border-b border-slate-800 text-[11px] font-mono text-slate-400">
                  <span>{token.lang}</span>
                </div>
              )}
              <pre className="p-4 text-xs font-mono text-cyan-200 overflow-x-auto">
                <code>{token.code}</code>
              </pre>
            </div>
          );
        }
        continue;
      }

      // Headings
      if (trimmed.startsWith('# ')) {
        flushParagraph();
        flushList();
        blocks.push(
          <h1 key={`h1-${blocks.length}`} className="text-2xl sm:text-3xl font-extrabold text-slate-100 mt-5 mb-2.5 tracking-tight border-b border-slate-800/80 pb-2">
            {renderInlineContent(trimmed.slice(2), enableLinks)}
          </h1>
        );
        continue;
      }
      if (trimmed.startsWith('## ')) {
        flushParagraph();
        flushList();
        blocks.push(
          <h2 key={`h2-${blocks.length}`} className="text-xl sm:text-2xl font-bold text-slate-100 mt-4 mb-2 tracking-tight border-b border-slate-800/60 pb-1.5">
            {renderInlineContent(trimmed.slice(3), enableLinks)}
          </h2>
        );
        continue;
      }
      if (trimmed.startsWith('### ')) {
        flushParagraph();
        flushList();
        blocks.push(
          <h3 key={`h3-${blocks.length}`} className="text-base sm:text-lg font-bold text-cyan-300 mt-3.5 mb-1.5">
            {renderInlineContent(trimmed.slice(4), enableLinks)}
          </h3>
        );
        continue;
      }
      if (trimmed.startsWith('#### ')) {
        flushParagraph();
        flushList();
        blocks.push(
          <h4 key={`h4-${blocks.length}`} className="text-sm font-semibold text-slate-200 mt-2.5 mb-1">
            {renderInlineContent(trimmed.slice(5), enableLinks)}
          </h4>
        );
        continue;
      }

      // Horizontal Rule
      if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
        flushParagraph();
        flushList();
        blocks.push(<hr key={`hr-${blocks.length}`} className="border-slate-800 my-4" />);
        continue;
      }

      // Blockquotes
      if (trimmed.startsWith('> ') || trimmed === '>') {
        flushParagraph();
        flushList();
        const quoteText = trimmed.startsWith('> ') ? trimmed.slice(2) : '';
        blocks.push(
          <blockquote
            key={`bq-${blocks.length}`}
            className="border-l-4 border-cyan-500/60 pl-4 py-2 my-2.5 bg-slate-900/40 rounded-r-xl text-slate-300 italic text-sm"
          >
            {renderInlineContent(quoteText, enableLinks)}
          </blockquote>
        );
        continue;
      }

      // Unordered Lists (- item or * item)
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        flushParagraph();
        const itemText = trimmed.slice(2);
        if (!currentList || currentList.type !== 'ul') {
          flushList();
          currentList = { type: 'ul', items: [itemText] };
        } else {
          currentList.items.push(itemText);
        }
        continue;
      }

      // Ordered Lists (1. item)
      const olMatch = trimmed.match(/^\d+\.\s+(.*)$/);
      if (olMatch) {
        flushParagraph();
        const itemText = olMatch[1];
        if (!currentList || currentList.type !== 'ol') {
          flushList();
          currentList = { type: 'ol', items: [itemText] };
        } else {
          currentList.items.push(itemText);
        }
        continue;
      }

      // Normal text line in paragraph
      flushList();
      currentParagraph.push(trimmed);
    }

    flushParagraph();
    flushList();

    return blocks;
  }, [content, enableLinks]);

  return <div className={`space-y-1 text-slate-200 ${className}`}>{renderedElements}</div>;
}

