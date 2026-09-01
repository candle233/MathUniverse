'use client';

import React, { useMemo, useState } from 'react';
import katex from 'katex';
import { globalLatexMacros, getNodeTypeMeta, getVerificationMeta } from '@/lib/utils';
import { initialMathNodes } from '@/data/seedData';
import { MathNode } from '@/types/math';
import { getNodeTitle } from '@/lib/i18nHelper';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import { Sparkles, ArrowRight, ShieldCheck, Copy, Check } from 'lucide-react';

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
      className={displayMode ? 'block my-3 text-center overflow-x-auto py-1.5' : 'inline-block px-0.5 align-middle'}
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

// Code Block with Copy Action
function CodeBlock({ code, lang }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-inner">
      <div className="px-4 py-1.5 bg-slate-900/90 border-b border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
        <span>{lang || 'code'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <pre className="p-4 text-xs font-mono text-cyan-200 overflow-x-auto leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

// Helper to render inline markdown styles (bold, italic, inline code, inline math, links)
function renderInlineContent(text: string, enableLinks: boolean = true): React.ReactNode {
  // 1. Math / Token extraction with alphanumeric placeholders (no underscores to prevent italic collision)
  const tokenMap = new Map<string, React.ReactNode>();
  let placeholderCounter = 0;

  const tokenRegex = /(\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\]|\\begin\{[a-zA-Z*]+\}[\s\S]*?\\end\{[a-zA-Z*]+\}|\$[^$\n]+?\$|\\\(.*?\\\)|\[\[.+?\]\]|`[^`\n]+?`|\[[^\]]+?\]\([^)]+?\)|\\(?:int|sum|prod|lim|infty|partial|mathbb|mathcal|mathrm|mathbf|mathscr|mathfrak|alpha|beta|gamma|delta|epsilon|varepsilon|zeta|eta|theta|iota|kappa|lambda|mu|nu|xi|pi|varpi|rho|varrho|sigma|tau|upsilon|phi|varphi|chi|psi|omega|Gamma|Delta|Theta|Lambda|Xi|Pi|Sigma|Upsilon|Phi|Psi|Omega|forall|exists|nexists|in|notin|ni|subset|subseteq|supset|supseteq|cap|cup|setminus|times|otimes|oplus|wedge|vee|to|rightarrow|leftarrow|leftrightarrow|implies|impliedby|iff|equiv|sim|simeq|approx|cong|le|ge|leq|geq|neq|pm|mp|cdot|circ|bullet|nabla|sqrt|frac|langle|rangle)\b(?:\{[^{}\n]*\}|\^[0-9a-zA-Z]|\_[0-9a-zA-Z])*(?:\([^()\n]*\))?)/g;

  const protectedText = text.replace(tokenRegex, (match) => {
    const ph = `\uFFF0TKN${placeholderCounter++}\uFFF1`;

    if ((match.startsWith('$$') && match.endsWith('$$')) || (match.startsWith('\\[') && match.endsWith('\\]'))) {
      const formula = match.slice(2, -2);
      tokenMap.set(ph, <InlineLaTeX key={ph} formula={formula} displayMode={true} />);
    } else if (match.startsWith('\\begin{') && match.includes('\\end{')) {
      tokenMap.set(ph, <InlineLaTeX key={ph} formula={match} displayMode={true} />);
    } else if (match.startsWith('$') && match.endsWith('$')) {
      const formula = match.slice(1, -1);
      tokenMap.set(ph, <InlineLaTeX key={ph} formula={formula} displayMode={false} />);
    } else if (match.startsWith('\\(') && match.endsWith('\\)')) {
      const formula = match.slice(2, -2);
      tokenMap.set(ph, <InlineLaTeX key={ph} formula={formula} displayMode={false} />);
    } else if (enableLinks && match.startsWith('[[') && match.endsWith(']]')) {
      const linkText = match.slice(2, -2);
      tokenMap.set(ph, <MathWikiLink key={ph} targetTitle={linkText} />);
    } else if (match.startsWith('`') && match.endsWith('`')) {
      const codeText = match.slice(1, -1);
      tokenMap.set(
        ph,
        <code
          key={ph}
          className="px-1.5 py-0.5 mx-0.5 rounded bg-slate-800/90 text-cyan-300 font-mono text-xs border border-slate-700/80"
        >
          {codeText}
        </code>
      );
    } else if (match.startsWith('\\')) {
      // Auto-detected bare LaTeX command in prose
      tokenMap.set(ph, <InlineLaTeX key={ph} formula={match} displayMode={false} />);
    } else {
      const linkMatch = match.match(/^\[([^\]]+?)\]\(([^)]+?)\)$/);
      if (linkMatch) {
        const [, linkLabel, linkUrl] = linkMatch;
        tokenMap.set(
          ph,
          <a
            key={ph}
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition-colors font-medium"
          >
            {linkLabel}
          </a>
        );
      } else {
        tokenMap.set(ph, match);
      }
    }

    return ph;
  });

  // 2. Recursive formatting parser (bold, italic, strikethrough)
  const parseFormattedNodes = (inputStr: string): React.ReactNode[] => {
    const formatRegex = /(\*\*[^*]+?\*\*|__[^_]+?__|~~[^~]+?~~|\*[^*]+?\*|_[^_]+?_)/g;
    const parts = inputStr.split(formatRegex);

    return parts.map((part, pIdx) => {
      if (!part) return null;

      // Bold **...** or __...__
      if ((part.startsWith('**') && part.endsWith('**')) || (part.startsWith('__') && part.endsWith('__'))) {
        const inner = part.slice(2, -2);
        return (
          <strong key={`b-${pIdx}`} className="font-bold text-slate-100">
            {parseFormattedNodes(inner)}
          </strong>
        );
      }
      // Strikethrough ~~...~~
      if (part.startsWith('~~') && part.endsWith('~~')) {
        const inner = part.slice(2, -2);
        return (
          <del key={`del-${pIdx}`} className="line-through text-slate-500">
            {parseFormattedNodes(inner)}
          </del>
        );
      }
      // Italic *...* or _..._
      if ((part.startsWith('*') && part.endsWith('*')) || (part.startsWith('_') && part.endsWith('_'))) {
        const inner = part.slice(1, -1);
        return (
          <em key={`i-${pIdx}`} className="italic text-slate-200">
            {parseFormattedNodes(inner)}
          </em>
        );
      }

      // Rehydrate token placeholders into React elements
      const tokRegex = /(\uFFF0TKN\d+\uFFF1)/g;
      const subSegments = part.split(tokRegex);

      return (
        <React.Fragment key={`txt-${pIdx}`}>
          {subSegments.map((sub, sIdx) => {
            if (tokenMap.has(sub)) {
              return <React.Fragment key={`tok-${sIdx}`}>{tokenMap.get(sub)}</React.Fragment>;
            }
            return sub;
          })}
        </React.Fragment>
      );
    });
  };

  return <>{parseFormattedNodes(protectedText)}</>;
}



// Markdown Table Renderer
function parseMarkdownTable(tableLines: string[], enableLinks: boolean): React.ReactNode {
  if (tableLines.length < 2) return null;

  const parseRow = (line: string) =>
    line
      .trim()
      .replace(/^\||\|$/g, '')
      .split('|')
      .map((c) => c.trim());

  const headers = parseRow(tableLines[0]);
  const rows = tableLines.slice(2).map(parseRow);

  return (
    <div key={`table-${Math.random()}`} className="my-3 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/70">
      <table className="w-full text-xs text-left border-collapse">
        <thead className="bg-slate-900/90 text-cyan-300 font-semibold border-b border-slate-800">
          <tr>
            {headers.map((h, hIdx) => (
              <th key={hIdx} className="px-3.5 py-2">
                {renderInlineContent(h, enableLinks)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 text-slate-300">
          {rows.map((row, rIdx) => (
            <tr key={rIdx} className="hover:bg-slate-900/40 transition-colors">
              {row.map((cell, cIdx) => (
                <td key={cIdx} className="px-3.5 py-2 font-mono text-[11px]">
                  {renderInlineContent(cell, enableLinks)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Full Rich Text & Markdown & LaTeX Parser
export default function LaTeXRenderer({ content, block = false, className = '', enableLinks = true }: LaTeXRendererProps) {
  const renderedElements = useMemo(() => {
    if (!content) return null;

    // 1. Extract Code Blocks (```lang ... ```) and Display Math Blocks ($$...$$ / \[...\] / \begin{...}...\end{...})
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
    tokenized = tokenized.replace(/(\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\]|\\begin\{[a-zA-Z*]+\}[\s\S]*?\\end\{[a-zA-Z*]+\})/g, (match) => {
      const placeholder = `@@BLOCK_MATH_${blockTokens.length}@@`;
      let formula = match;
      if (match.startsWith('$$') && match.endsWith('$$')) formula = match.slice(2, -2);
      else if (match.startsWith('\\[') && match.endsWith('\\]')) formula = match.slice(2, -2);
      blockTokens.push({ placeholder, type: 'math', formula });
      return `\n\n${placeholder}\n\n`;
    });

    // 2. Parse lines into markdown blocks
    const lines = tokenized.split(/\r?\n/);
    const blocks: React.ReactNode[] = [];

    let currentList: { type: 'ul' | 'ol'; items: string[] } | null = null;
    let currentTable: string[] | null = null;
    let currentParagraph: string[] = [];

    const flushTable = () => {
      if (currentTable && currentTable.length >= 2) {
        blocks.push(parseMarkdownTable(currentTable, enableLinks));
        currentTable = null;
      }
    };

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
                <CodeBlock key={`code-${blocks.length}`} code={tokenMatch.code || ''} lang={tokenMatch.lang} />
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

      // Empty line -> flush paragraph / list / table
      if (!trimmed) {
        flushParagraph();
        flushList();
        flushTable();
        continue;
      }

      // Check placeholder tokens on dedicated line
      const token = blockTokens.find((t) => t.placeholder === trimmed);
      if (token) {
        flushParagraph();
        flushList();
        flushTable();
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
            <CodeBlock key={`code-${blocks.length}`} code={token.code || ''} lang={token.lang} />
          );
        }
        continue;
      }

      // Markdown Table row (| ... |)
      if (trimmed.startsWith('|') && trimmed.endsWith('|') && trimmed.includes('|', 1)) {
        flushParagraph();
        flushList();
        if (!currentTable) currentTable = [trimmed];
        else currentTable.push(trimmed);
        continue;
      } else {
        flushTable();
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
    flushTable();

    return blocks;
  }, [content, enableLinks]);

  return <div className={`space-y-1 text-slate-200 ${className}`}>{renderedElements}</div>;
}

