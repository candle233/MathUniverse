'use client';

import React, { useState } from 'react';
import { InlineLaTeX } from '@/components/math/LaTeXRenderer';
import { useLanguage } from '@/context/LanguageContext';
import { Network, Sparkles } from 'lucide-react';

// Render LaTeX-style source as readable text for raw SVG labels. This is a small
// helper (not a full LaTeX parser); it covers the symbols used in the presets.
function latexToReadable(src: string): string {
  const replacements: Array<[RegExp, string]> = [
    [/\\mathrm\{im\}/g, 'im'],
    [/\\mathrm\{coker\}/g, 'coker'],
    [/\\mathrm\{ker\}/g, 'ker'],
    [/\\mathrm\{id\}/g, 'id'],
    [/\\mathrm\{d\}/g, 'd'],
    [/\\ker/g, 'ker'],
    [/\\im/g, 'im'],
    [/\\coker/g, 'coker'],
    [/\\phi/g, 'φ'],
    [/\\psi/g, 'ψ'],
    [/\\pi/g, 'π'],
    [/\\to/g, '→'],
    [/\\rightarrow/g, '→'],
    [/\\xrightarrow/g, '↠'],
    [/\\xleftarrow/g, '↞'],
    [/\\mapsto/g, '↦'],
    [/\\leq/g, '≤'],
    [/\\geq/g, '≥'],
    [/\\neq/g, '≠'],
    [/\\subset/g, '⊂'],
    [/\\subseteq/g, '⊆'],
    [/\\supset/g, '⊃'],
    [/\\in/g, '∈'],
    [/\\times/g, '×'],
    [/\\cdot/g, '·'],
    [/\\langle/g, '⟨'],
    [/\\rangle/g, '⟩'],
    [/\\{ /g, '{'],
    [/ \\}/g, '}'],
    [/\\left\(/g, '('],
    [/\\right\)/g, ')'],
    [/\\, /g, ' '],
    [/\\!/g, ''],
    [/\\/g, ''],
    [/\{([^}]*)\}/g, '$1'],
  ];
  let out = src;
  for (const [re, val] of replacements) {
    out = out.replace(re, val);
  }
  return out.trim();
}

export interface DiagramConfig {
  id: string;
  title: string;
  titleEn: string;
  discipline: string;
  description: string;
  descriptionEn: string;
  nodes: Array<{ id: string; label: string; x: number; y: number; type?: 'group' | 'space' | 'morphism' }>;
  arrows: Array<{ from: string; to: string; label: string; labelEn?: string; style?: 'solid' | 'dashed' | 'hook' | 'twohead'; isEquality?: boolean }>;
  commutativeRelation: string;
}

// English short tab labels (zh tabs derive from title's first token).
const DIAGRAM_TAB_EN: Record<string, string> = {
  'diag-first-iso': 'First Iso. Theorem',
  'diag-short-exact': 'Short Exact Seq.',
  'diag-snake-lemma': 'Snake Lemma',
};

export const presetDiagrams: DiagramConfig[] = [
  {
    id: 'diag-first-iso',
    title: '群的第一同构定理交换图 (First Isomorphism Commutative Diagram)',
    titleEn: 'First Isomorphism Theorem Commutative Diagram',
    discipline: '近世代数 / 范畴论',
    description: '同态映射 phi 可严格正交分解为典范自然满同态 pi 与典范单同态 psi 的复合：phi = psi ∘ pi。',
    descriptionEn: 'The homomorphism φ factors canonically into the natural epimorphism π followed by the canonical monomorphism φ̄: φ = φ̄ ∘ π.',
    nodes: [
      { id: 'G', label: 'G', x: 80, y: 70, type: 'group' },
      { id: 'im', label: '\\mathrm{im}(\\phi)', x: 320, y: 70, type: 'group' },
      { id: 'G_ker', label: 'G / \\ker(\\phi)', x: 80, y: 220, type: 'group' },
    ],
    arrows: [
      { from: 'G', to: 'im', label: '\\phi', style: 'solid' },
      { from: 'G', to: 'G_ker', label: '\\pi \\text{ (自然投影)}', labelEn: '\\pi \\text{ (canonical projection)}', style: 'solid' },
      { from: 'G_ker', to: 'im', label: '\\bar{\\phi} \\text{ (唯一同构)}', labelEn: '\\bar{\\phi} \\text{ (unique isomorphism)}', style: 'dashed' },
    ],
    commutativeRelation: '\\phi = \\bar{\\phi} \\circ \\pi',
  },
  {
    id: 'diag-short-exact',
    title: '群与模的短正合列 (Short Exact Sequence)',
    titleEn: 'Short Exact Sequence of Groups & Modules',
    discipline: '同调代数 / 范畴论',
    description: '0 -> A -> B -> C -> 0 为短正合列，意味着 i 为单射 (ker i = 0)，p 为满射 (im p = C)，且 im i = ker p。',
    descriptionEn: '0 -> A -> B -> C -> 0 is a short exact sequence: i is injective (ker i = 0), p is surjective (im p = C), and im i = ker p.',
    nodes: [
      { id: 'zero_l', label: '0', x: 40, y: 140 },
      { id: 'A', label: 'A', x: 120, y: 140, type: 'space' },
      { id: 'B', label: 'B', x: 230, y: 140, type: 'space' },
      { id: 'C', label: 'C', x: 340, y: 140, type: 'space' },
      { id: 'zero_r', label: '0', x: 420, y: 140 },
    ],
    arrows: [
      { from: 'zero_l', to: 'A', label: '', style: 'solid' },
      { from: 'A', to: 'B', label: 'i \\text{ (单射)}', labelEn: 'i \\text{ (injective)}', style: 'hook' },
      { from: 'B', to: 'C', label: 'p \\text{ (满射)}', labelEn: 'p \\text{ (surjective)}', style: 'twohead' },
      { from: 'C', to: 'zero_r', label: '', style: 'solid' },
    ],
    commutativeRelation: '\\mathrm{im}(i) = \\ker(p) \\implies B/i(A) \\cong C',
  },
  {
    id: 'diag-snake-lemma',
    title: '蛇引理 (The Snake Lemma Commutative Diagram)',
    titleEn: 'Snake Lemma Commutative Diagram',
    discipline: '代数拓扑 / 同调代数',
    description: '连接同态 delta 将上层的核核序列与下层的余核余核序列自然串联，构造长正合序列。',
    descriptionEn: 'The connecting homomorphism δ chains the kernel sequence on top to the cokernel sequence below, producing the long exact sequence.',
    nodes: [
      { id: 'kerA', label: '\\ker(a)', x: 80, y: 50 },
      { id: 'kerB', label: '\\ker(b)', x: 200, y: 50 },
      { id: 'kerC', label: '\\ker(c)', x: 320, y: 50 },
      { id: 'A', label: 'A', x: 80, y: 130 },
      { id: 'B', label: 'B', x: 200, y: 130 },
      { id: 'C', label: 'C', x: 320, y: 130 },
      { id: 'A1', label: "A'", x: 80, y: 210 },
      { id: 'B1', label: "B'", x: 200, y: 210 },
      { id: 'C1', label: "C'", x: 320, y: 210 },
      { id: 'cokerA', label: '\\mathrm{coker}(a)', x: 80, y: 290 },
      { id: 'cokerB', label: '\\mathrm{coker}(b)', x: 200, y: 290 },
      { id: 'cokerC', label: '\\mathrm{coker}(c)', x: 320, y: 290 },
    ],
    arrows: [
      { from: 'kerA', to: 'kerB', label: '', style: 'solid' },
      { from: 'kerB', to: 'kerC', label: '', style: 'solid' },
      { from: 'A', to: 'B', label: 'f', style: 'solid' },
      { from: 'B', to: 'C', label: 'g', style: 'solid' },
      { from: 'A1', to: 'B1', label: "f'", style: 'solid' },
      { from: 'B1', to: 'C1', label: "g'", style: 'solid' },
      { from: 'A', to: 'A1', label: 'a', style: 'solid' },
      { from: 'B', to: 'B1', label: 'b', style: 'solid' },
      { from: 'C', to: 'C1', label: 'c', style: 'solid' },
      { from: 'cokerA', to: 'cokerB', label: '', style: 'solid' },
      { from: 'cokerB', to: 'cokerC', label: '', style: 'solid' },
      { from: 'kerC', to: 'cokerA', label: '\\delta \\text{ (连接同态)}', labelEn: '\\delta \\text{ (connecting homomorphism)}', style: 'dashed' },
    ],
    commutativeRelation: '0 \\to \\ker a \\to \\ker b \\to \\ker c \\xrightarrow{\\delta} \\mathrm{coker}\\,a \\to \\mathrm{coker}\\,b \\to \\mathrm{coker}\\,c \\to 0',
  },
];

export default function CommutativeDiagramViewer() {
  const { isZh } = useLanguage();
  const [selectedDiagram, setSelectedDiagram] = useState<DiagramConfig>(presetDiagrams[0]);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl p-6 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
            <Network className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-sm">
              {isZh ? 'TikZ-cd 交换图与范畴论可视化 (Interactive Commutative Diagrams)' : 'Interactive Commutative Diagrams (TikZ-cd)'}
            </h3>
            <p className="text-xs text-slate-400">
              {isZh
                ? '范畴论与代数拓扑的通用图形语言，验证态射复合与正合列交换性'
                : 'The universal graphical language of category theory and algebraic topology — verify morphism composition and exactness'}
            </p>
          </div>
        </div>

        {/* Diagram Selector */}
        <div className="flex items-center gap-2">
          {presetDiagrams.map((diag) => (
            <button
              key={diag.id}
              onClick={() => setSelectedDiagram(diag)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedDiagram.id === diag.id
                  ? 'bg-purple-500 text-slate-950 font-bold shadow-md shadow-purple-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              {isZh ? diag.title.split(' ')[0] : DIAGRAM_TAB_EN[diag.id] || diag.titleEn}
            </button>
          ))}
        </div>
      </div>

      {/* Description & Commutativity Identity */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div>
          <span className="text-purple-300 font-semibold">{isZh ? selectedDiagram.title : selectedDiagram.titleEn}</span>
          <p className="text-slate-400 mt-0.5">{isZh ? selectedDiagram.description : selectedDiagram.descriptionEn}</p>
        </div>
        <div className="p-2 px-3 rounded-lg bg-slate-950 border border-purple-500/30 text-cyan-300 font-mono text-xs">
          <span className="text-slate-500 text-[10px] block">{isZh ? '交换恒等式:' : 'Commutativity identity:'}</span>
          <InlineLaTeX formula={selectedDiagram.commutativeRelation} />
        </div>
      </div>

      {/* SVG Canvas for Diagram */}
      <div className="relative w-full h-[360px] bg-slate-950 rounded-2xl border border-slate-800/90 math-grid-pattern overflow-hidden flex items-center justify-center p-4">
        <svg className="w-full h-full max-w-xl" viewBox="0 0 460 340">
          <defs>
            {/* Arrowhead Markers */}
            <marker
              id="arrow-solid"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8" />
            </marker>
            <marker
              id="arrow-dashed"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#c084fc" />
            </marker>
          </defs>

          {/* Render Arrows / Morphisms */}
          {selectedDiagram.arrows.map((arr, idx) => {
            const fromNode = selectedDiagram.nodes.find((n) => n.id === arr.from);
            const toNode = selectedDiagram.nodes.find((n) => n.id === arr.to);
            if (!fromNode || !toNode) return null;

            // Offset arrow start and end by node radius (20px)
            const angle = Math.atan2(toNode.y - fromNode.y, toNode.x - fromNode.x);
            const startX = fromNode.x + Math.cos(angle) * 24;
            const startY = fromNode.y + Math.sin(angle) * 24;
            const endX = toNode.x - Math.cos(angle) * 24;
            const endY = toNode.y - Math.sin(angle) * 24;

            const midX = (startX + endX) / 2;
            const midY = (startY + endY) / 2;
            const isDashed = arr.style === 'dashed';
            const isSpecial = arr.from === 'kerC' && arr.to === 'cokerA';

            if (isSpecial) {
              // Snake curved path
              const pathD = `M ${startX} ${startY} C ${endX + 60} ${startY + 30}, ${startX - 60} ${endY - 30}, ${endX} ${endY}`;
              return (
                <g key={idx}>
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#c084fc"
                    strokeWidth="2"
                    strokeDasharray="4 3"
                    markerEnd="url(#arrow-dashed)"
                  />
                  <text x={midX + 20} y={midY} fill="#c084fc" fontSize="10" fontFamily="sans-serif">
                    {isZh ? 'δ (连接同态)' : 'δ (connecting homomorphism)'}
                  </text>
                </g>
              );
            }

            return (
              <g key={idx}>
                <line
                  x1={startX}
                  y1={startY}
                  x2={endX}
                  y2={endY}
                  stroke={isDashed ? '#c084fc' : '#38bdf8'}
                  strokeWidth="1.8"
                  strokeDasharray={isDashed ? '4 3' : ''}
                  markerEnd={isDashed ? 'url(#arrow-dashed)' : 'url(#arrow-solid)'}
                />
                {/* Arrow Label — render LaTeX source as readable text instead of leaving
                    backslashes/braces visible inside raw SVG <text>. A small
                    macro→glyph map covers the symbols used in the presets. */}
                {arr.label && (
                  <text
                    x={midX - Math.sin(angle) * 12}
                    y={midY + Math.cos(angle) * 12 + 3}
                    fill="#94a3b8"
                    fontSize="11"
                    textAnchor="middle"
                    fontFamily="sans-serif"
                  >
                    {latexToReadable(isZh ? arr.label : arr.labelEn ?? arr.label)}
                  </text>
                )}
              </g>
            );
          })}

          {/* Render Nodes / Objects */}
          {selectedDiagram.nodes.map((node) => (
            <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
              <circle
                r="20"
                fill="#0f172a"
                stroke="#334155"
                strokeWidth="1.5"
                className="hover:stroke-cyan-400 hover:fill-slate-800 transition-all cursor-pointer"
              />
              <text
                textAnchor="middle"
                dominantBaseline="central"
                fill="#f8fafc"
                fontSize="11"
                fontWeight="bold"
                fontFamily="KaTeX_Main, serif"
              >
                {latexToReadable(node.label)}
              </text>
            </g>
          ))}
        </svg>


        {/* Floating Hint */}
        <div className="absolute bottom-3 right-3 p-2.5 rounded-xl glass-panel text-[11px] text-slate-400 flex items-center gap-1.5 pointer-events-none">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>{isZh ? '任意路径复合结果恒等 (Commutative Property Guaranteed)' : 'Every path composition agrees — commutativity guaranteed'}</span>
        </div>
      </div>
    </div>
  );
}
