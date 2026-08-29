'use client';

import React, { useState, useMemo } from 'react';
import { InlineLaTeX } from '@/components/math/LaTeXRenderer';
import {
  Code2,
  Copy,
  Check,
  Download,
  Sparkles,
  Layers,
  Eye,
  RefreshCw,
  ExternalLink,
  BookOpen,
  GitBranch,
  Terminal,
  Grid,
  FileCode,
} from 'lucide-react';

export interface TikzTemplate {
  id: string;
  nameZh: string;
  nameEn: string;
  category: '范畴论与同调代数' | '几何与复分析' | '拓扑与代数结构' | '证明论与形式逻辑';
  description: string;
  previewLatex: string;
  tikzCode: string;
}

export const tikzTemplates: TikzTemplate[] = [
  {
    id: 'commutative-square',
    nameZh: '态射交换正方形 (Commutative Square)',
    nameEn: 'Commutative Square in Category Theory',
    category: '范畴论与同调代数',
    description: '范畴论中最基本的态射可换正方形图表：g ∘ f = k ∘ h。',
    previewLatex:
      '\\begin{matrix} A & \\xrightarrow{f} & B \\\\ \\downarrow{h} & & \\downarrow{g} \\\\ C & \\xrightarrow{k} & D \\end{matrix}',
    tikzCode: `% 态射交换正方形图表 (Commutative Square)
\\begin{tikzcd}[row sep=large, column sep=huge]
A \\arrow[r, "f"] \\arrow[d, "h"'] & B \\arrow[d, "g"] \\\\
C \\arrow[r, "k"'] & D
\\end{tikzcd}

% 原生 TikZ 绘制模式:
% \\begin{tikzpicture}[node distance=2.5cm, auto]
%   \\node (A) {$A$};
%   \\node (B) [right of=A] {$B$};
%   \\node (C) [below of=A] {$C$};
%   \\node (D) [below of=B] {$D$};
%   \\draw[->] (A) to node {$f$} (B);
%   \\draw[->] (A) to node[swap] {$h$} (C);
%   \\draw[->] (B) to node {$g$} (D);
%   \\draw[->] (C) to node[swap] {$k$} (D);
% \\end{tikzpicture}`,
  },
  {
    id: 'short-exact-sequence',
    nameZh: '短正合列态射图 (Short Exact Sequence)',
    nameEn: 'Short Exact Sequence of Modules / Groups',
    category: '范畴论与同调代数',
    description:
      '同调代数与群论核心：0 → A → B → C → 0，其中 f 为单同态，g 为满同态，im(f) = ker(g)。',
    previewLatex:
      '0 \\longrightarrow A \\xrightarrow{\\iota} B \\xrightarrow{\\pi} C \\longrightarrow 0',
    tikzCode: `% 短正合列态射图表 (Short Exact Sequence)
\\begin{tikzcd}[column sep=large]
0 \\arrow[r] & A \\arrow[r, "\\iota"] & B \\arrow[r, "\\pi"] & C \\arrow[r] & 0
\\end{tikzcd}`,
  },
  {
    id: 'first-isomorphism',
    nameZh: '群第一同构定理典范分解',
    nameEn: 'First Isomorphism Theorem Canonical Factorization',
    category: '拓扑与代数结构',
    description:
      '同态映射 φ: G → H 经由商群 G/ker(φ) 与同态像 im(φ) 的唯一典范分解。',
    previewLatex:
      '\\begin{matrix} G & \\xrightarrow{\\phi} & H \\\\ \\downarrow{\\pi} & \\nearrow{\\tilde{\\phi}} & \\\\ G/\\ker\\phi & & \\end{matrix}',
    tikzCode: `% 群第一同构定理典范分解 (First Isomorphism Theorem)
\\begin{tikzcd}[row sep=large, column sep=huge]
G \\arrow[r, "\\phi"] \\arrow[d, "\\pi"', two heads] & H \\\\
G / \\ker(\\phi) \\arrow[ur, "\\tilde{\\phi}"', hook] &
\\end{tikzcd}`,
  },
  {
    id: 'snake-lemma',
    nameZh: '同调代数蛇引理态射图 (Snake Lemma)',
    nameEn: 'Snake Lemma Connecting Homomorphism',
    category: '范畴论与同调代数',
    description:
      '同调代数中最著名的蛇引理，构造连接核与余核的正合列：ker a → ker b → ker c → coker a → coker b → coker c。',
    previewLatex:
      '\\ker a \\to \\ker b \\to \\ker c \\xrightarrow{\\delta} \\mathrm{coker}\\, a \\to \\mathrm{coker}\\, b \\to \\mathrm{coker}\\, c',
    tikzCode: `% 同调代数蛇引理 (Snake Lemma) 交换图与连接同态
\\begin{tikzcd}[row sep=large, column sep=large]
& \\ker a \\arrow[r] \\arrow[d] & \\ker b \\arrow[r] \\arrow[d] & \\ker c \\arrow[d] \\arrow[dll, "\\delta"', rounded corners, to path={ -- ([xshift=2ex]\\tikztostart.east) |- ([yshift=-2ex]\\tikztotarget.west) -- (\\tikztotarget)}] & \\\\
0 \\arrow[r] & A \\arrow[r, "f"] \\arrow[d, "a"'] & B \\arrow[r, "g"] \\arrow[d, "b"] & C \\arrow[r] \\arrow[d, "c"] & 0 \\\\
0 \\arrow[r] & A' \\arrow[r, "f'"'] \\arrow[d] & B' \\arrow[r, "g'"'] \\arrow[d] & C' \\arrow[r] & 0 \\\\
& \\mathrm{coker}\\, a \\arrow[r] & \\mathrm{coker}\\, b \\arrow[r] & \\mathrm{coker}\\, c &
\\end{tikzcd}`,
  },
  {
    id: 'stokes-derham',
    nameZh: '斯托克斯定理与 de Rham 复形对偶',
    nameEn: 'Stokes Theorem & de Rham Complex Adjunction',
    category: '几何与复分析',
    description:
      '微分形式外微分算子 d 与几何流形边界算子 ∂ 之间的内积伴随对偶性：⟨∂M, ω⟩ = ⟨M, dω⟩。',
    previewLatex:
      '\\int_{\\partial M} \\omega = \\int_M d\\omega \\quad \\iff \\quad \\langle \\partial M, \\omega \\rangle = \\langle M, d\\omega \\rangle',
    tikzCode: `% 斯托克斯定理 de Rham 复形与积分算子交换图
\\begin{tikzcd}[row sep=large, column sep=huge]
\\Omega^{k-1}(M) \\arrow[r, "d"] \\arrow[d, "\\int_{\\partial M}"'] & \\Omega^k(M) \\arrow[d, "\\int_M"] \\\\
\\mathbb{R} \\arrow[r, "\\mathrm{id}"'] & \\mathbb{R}
\\end{tikzcd}`,
  },
  {
    id: 'complex-unit-circle',
    nameZh: '复平面欧拉单位圆与旋转子',
    nameEn: 'Complex Plane Unit Circle & Euler Phasor',
    category: '几何与复分析',
    description:
      '复平面上 e^{iθ} = cos θ + i sin θ 的几何投影与单位圆直角三角形。',
    previewLatex:
      'e^{i\\theta} = \\cos\\theta + i\\sin\\theta, \\quad |e^{i\\theta}| = 1',
    tikzCode: `% 复平面欧拉旋转单位圆 (Complex Phasor)
\\begin{tikzpicture}[scale=2]
  % 坐标轴
  \\draw[->] (-1.3,0) -- (1.3,0) node[right] {$\\mathrm{Re}(z)$};
  \\draw[->] (0,-1.3) -- (0,1.3) node[above] {$\\mathrm{Im}(z)$};
  % 单位圆
  \\draw[thick, cyan] (0,0) circle (1);
  % 相位向量 e^{i theta}
  \\coordinate (P) at (45:1);
  \\draw[->, ultra thick, amber] (0,0) -- (P) node[above right] {$e^{i\\theta} = \\cos\\theta + i\\sin\\theta$};
  \\draw[dashed, gray] (P) -- (0.707,0) node[below] {$\\cos\\theta$};
  \\draw[dashed, gray] (P) -- (0,0.707) node[left] {$\\sin\\theta$};
  % 原点与角度弧
  \\draw[thick, purple] (0.3,0) arc (0:45:0.3) node[midway, right] {$\\theta$};
\\end{tikzpicture}`,
  },
  {
    id: 'tangent-secant-limit',
    nameZh: '导数割线趋近切线极限图',
    nameEn: 'Derivative Secant to Tangent Line Limit',
    category: '几何与复分析',
    description:
      '当 Δx → 0 时，割线 PQ 旋转趋近于点 P 处的切线，体现导数的几何本质。',
    previewLatex:
      'f\'(x) = \\lim_{\\Delta x \\to 0} \\frac{f(x+\\Delta x) - f(x)}{\\Delta x}',
    tikzCode: `% 导数割线趋近切线极限图
\\begin{tikzpicture}[scale=1.5]
  \\draw[->] (0,0) -- (4,0) node[right] {$x$};
  \\draw[->] (0,0) -- (0,3) node[above] {$y$};
  % 曲线 f(x)
  \\draw[thick, purple, domain=0.5:3.5] plot (\\x, {0.2*\\x*\\x + 0.3});
  % 点 P 与点 Q
  \\coordinate (P) at (1.5, {0.2*1.5*1.5+0.3});
  \\coordinate (Q) at (3.0, {0.2*3*3+0.3});
  \\filldraw[cyan] (P) circle (1.5pt) node[below left] {$P(x, f(x))$};
  \\filldraw[emerald] (Q) circle (1.5pt) node[above right] {$Q(x+\\Delta x, f(x+\\Delta x))$};
  \\draw[thick, dashed, cyan] (P) -- (Q);
\\end{tikzpicture}`,
  },
  {
    id: 'natural-deduction-tree',
    nameZh: '根岑自然演绎证明树 (Gentzen Proof Tree)',
    nameEn: 'Gentzen Natural Deduction Tree (bussproofs)',
    category: '证明论与形式逻辑',
    description:
      '利用 bussproofs 宏包排版的一阶逻辑自然演绎证明树，体现相继式公理演算与分离规则。',
    previewLatex:
      '\\frac{\\Gamma \\vdash A \\quad \\Gamma \\vdash A \\implies B}{\\Gamma \\vdash B} \\quad (\\to\\text{-Elim})',
    tikzCode: `% 根岑自然演绎证明树 (bussproofs)
\\begin{prooftree}
  \\AxiomC{$[A]^1$}
  \\UnaryInfC{$B$}
  \\RightLabel{\\scriptsize ($\\to$-Intro)$^1$}
  \\UnaryInfC{$A \\implies B$}
  \\AxiomC{$A$}
  \\RightLabel{\\scriptsize ($\\to$-Elim / MP)}
  \\BinaryInfC{$B$}
\\end{prooftree}`,
  },
  {
    id: 'fiber-bundle',
    nameZh: '纤维丛局部平凡化态射图',
    nameEn: 'Fiber Bundle Local Trivialization',
    category: '拓扑与代数结构',
    description:
      '微分拓扑中主纤维丛与局部平凡化同胚：π⁻¹(U) ≅ U × F。',
    previewLatex:
      'F \\hookrightarrow E \\xrightarrow{\\pi} B, \\quad \\phi_U: \\pi^{-1}(U) \\xrightarrow{\\cong} U \\times F',
    tikzCode: `% 纤维丛局部平凡化态射图
\\begin{tikzcd}[row sep=large, column sep=large]
\\pi^{-1}(U) \\arrow[r, "\\phi_U", "\\cong"'] \\arrow[d, "\\pi"'] & U \\times F \\arrow[dl, "\\mathrm{pr}_1"] \\\\
U &
\\end{tikzcd}`,
  },
];

export default function TikzStudio() {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(tikzTemplates[0].id);
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const categories = useMemo(() => {
    return ['ALL', '范畴论与同调代数', '几何与复分析', '拓扑与代数结构', '证明论与形式逻辑'];
  }, []);

  const filteredTemplates = useMemo(() => {
    if (activeCategory === 'ALL') return tikzTemplates;
    return tikzTemplates.filter((t) => t.category === activeCategory);
  }, [activeCategory]);

  const currentTemplate = useMemo(() => {
    return tikzTemplates.find((t) => t.id === selectedTemplateId) || filteredTemplates[0] || tikzTemplates[0];
  }, [selectedTemplateId, filteredTemplates]);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentTemplate.tikzCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 1500);
  };

  const handleDownloadTex = () => {
    const fullTex = `\\documentclass[tikz,border=12pt]{standalone}
\\usepackage{amsmath,amssymb,amsthm}
\\usepackage{tikz}
\\usepackage{tikz-cd}
\\usepackage{bussproofs}

\\begin{document}
${currentTemplate.tikzCode}
\\end{document}
`;

    const blob = new Blob([fullTex], { type: 'text/x-tex;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MathUniverse_${currentTemplate.id}.tex`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-lg shadow-purple-500/10">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-100 text-base">
                TikZ-cd 交换图与矢量图谱工坊
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono">
                TikZ Vector Studio
              </span>
            </div>
            <p className="text-xs text-slate-400">
              提供标准 LaTeX TikZ、TikZ-cd 态射交换图与 bussproofs 自然演绎证明树模板，支持独立 `.tex` 编译与一键复制
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
          >
            {copiedCode ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">已复制 TikZ 源码</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-purple-400" />
                <span>复制 TikZ 源码</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadTex}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-500/20 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>导出独立 .tex</span>
          </button>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === cat
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20 font-bold'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {cat === 'ALL' ? '全部模板' : cat}
          </button>
        ))}
      </div>

      {/* Template Selector Grid / Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        {filteredTemplates.map((item) => (
          <button
            key={item.id}
            onClick={() => setSelectedTemplateId(item.id)}
            className={`p-2.5 rounded-xl text-left transition-all cursor-pointer border ${
              selectedTemplateId === item.id
                ? 'bg-purple-500/20 border-purple-500/60 shadow-lg shadow-purple-500/10'
                : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900 hover:border-slate-700'
            }`}
          >
            <span className="text-[10px] text-purple-400 font-mono block mb-1">{item.category}</span>
            <h4 className="text-xs font-bold text-slate-200 line-clamp-1">{item.nameZh}</h4>
            <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{item.nameEn}</p>
          </button>
        ))}
      </div>

      {/* Detail Showcase & Live Mathematical Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Card: Mathematical Meaning & LaTeX Formula Preview */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              <span>数学语义与公式预览 (Mathematical Preview)</span>
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 font-mono">
              {currentTemplate.category}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80">
            <h4 className="text-sm font-bold text-slate-100">{currentTemplate.nameZh}</h4>
            <p className="text-xs text-purple-400 font-medium">{currentTemplate.nameEn}</p>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">{currentTemplate.description}</p>
          </div>

          <div className="p-4 rounded-lg bg-slate-950 border border-purple-500/20 flex flex-col items-center justify-center min-h-[120px] text-center">
            <span className="text-[10px] text-slate-500 block mb-2 font-mono">KaTeX / MathJax 公式渲染</span>
            <div className="text-purple-200 font-serif text-sm">
              <InlineLaTeX formula={currentTemplate.previewLatex} />
            </div>
          </div>
        </div>

        {/* Right Card: TikZ Source Code Viewport */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <FileCode className="w-3.5 h-3.5 text-purple-400" />
              <span>TikZ / TikZ-cd LaTeX 源码</span>
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              {currentTemplate.tikzCode.split('\n').length} 行 · {currentTemplate.tikzCode.length} 字符
            </span>
          </div>

          <pre className="w-full h-44 bg-slate-950 border border-slate-800 rounded-lg p-3 overflow-auto text-xs text-slate-300 font-mono leading-relaxed select-all">
            {currentTemplate.tikzCode}
          </pre>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] text-slate-500">
              提示: 可将源码直接粘贴至 LaTeX 正文的 figure 或 equation 环境中
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
