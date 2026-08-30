'use client';

import React, { useState } from 'react';
import { InlineLaTeX } from '@/components/math/LaTeXRenderer';
import { useLanguage } from '@/context/LanguageContext';
import { Copy, Check, Sparkles, BookOpen, Layers, Terminal, Search } from 'lucide-react';

interface SymbolCategory {
  id: string;
  name: string;
  nameEn: string;
  symbols: Array<{
    latex: string;
    description: string;
    descriptionEn: string;
    display?: string;
  }>;
}

export const symbolCategories: SymbolCategory[] = [
  {
    id: 'logic-set',
    name: '数理逻辑与公理集合论',
    nameEn: 'Mathematical Logic & Axiomatic Set Theory',
    symbols: [
      { latex: '\\forall', description: '全称量词 (对任意 For all)', descriptionEn: 'Universal quantifier (for all)' },
      { latex: '\\exists', description: '存在量词 (存在 There exists)', descriptionEn: 'Existential quantifier (there exists)' },
      { latex: '\\in', description: '属于 (Element of)', descriptionEn: 'Element of' },
      { latex: '\\notin', description: '不属于 (Not in)', descriptionEn: 'Not an element of' },
      { latex: '\\subseteq', description: '子集包含 (Subset of)', descriptionEn: 'Subset of' },
      { latex: '\\cup', description: '集合并集 (Union)', descriptionEn: 'Set union' },
      { latex: '\\cap', description: '集合交集 (Intersection)', descriptionEn: 'Set intersection' },
      { latex: '\\setminus', description: '集合差集 (Set difference)', descriptionEn: 'Set difference' },
      { latex: '\\emptyset', description: '空集 (Empty set)', descriptionEn: 'Empty set' },
      { latex: '\\implies', description: '逻辑蕴含 (Implies)', descriptionEn: 'Logical implication' },
      { latex: '\\iff', description: '当且仅当 (If and only if)', descriptionEn: 'If and only if' },
      { latex: '\\aleph_0', description: '阿列夫零 (可数基数 Aleph-0)', descriptionEn: 'Aleph-0 (countable cardinal)' },
    ],
  },
  {
    id: 'analysis-calc',
    name: '微积分与实复分析',
    nameEn: 'Calculus & Real/Complex Analysis',
    symbols: [
      { latex: '\\int_{a}^{b} f(x) \\, dx', description: '定积分 (Definite integral)', descriptionEn: 'Definite integral' },
      { latex: '\\oint_{\\gamma} f(z) \\, dz', description: '闭路曲线环积分 (Contour integral)', descriptionEn: 'Contour integral' },
      { latex: '\\lim_{n \\to \\infty} x_n', description: '数列极限 (Limit)', descriptionEn: 'Limit of a sequence' },
      { latex: '\\sum_{k=1}^{\\infty} a_k', description: '无穷级数求和 (Infinite series)', descriptionEn: 'Infinite series' },
      { latex: '\\prod_{i=1}^{n} p_i', description: '累乘连乘积 (Product)', descriptionEn: 'Finite product' },
      { latex: '\\frac{\\partial f}{\\partial x}', description: '偏导数 (Partial derivative)', descriptionEn: 'Partial derivative' },
      { latex: '\\nabla f', description: '梯度算子 (Gradient / Del)', descriptionEn: 'Gradient (del) operator' },
      { latex: '\\Delta f', description: '拉普拉斯算子 (Laplacian)', descriptionEn: 'Laplacian operator' },
      { latex: '\\varepsilon', description: '小量 Epsilon', descriptionEn: 'Small quantity Epsilon' },
      { latex: '\\delta', description: '小量 Delta', descriptionEn: 'Small quantity Delta' },
    ],
  },
  {
    id: 'algebra-group',
    name: '近世代数与范畴论',
    nameEn: 'Modern Algebra & Category Theory',
    symbols: [
      { latex: 'G \\cong H', description: '同构 (Isomorphism)', descriptionEn: 'Isomorphism' },
      { latex: 'H \\trianglelefteq G', description: '正规子群 (Normal subgroup)', descriptionEn: 'Normal subgroup' },
      { latex: 'G / H', description: '商群 / 商结构 (Quotient group)', descriptionEn: 'Quotient group / quotient structure' },
      { latex: '\\ker(\\phi)', description: '同态核 (Kernel)', descriptionEn: 'Kernel of a homomorphism' },
      { latex: '\\mathrm{im}(\\phi)', description: '同态像 (Image)', descriptionEn: 'Image of a homomorphism' },
      { latex: 'V \\otimes W', description: '张量积 (Tensor product)', descriptionEn: 'Tensor product' },
      { latex: 'V \\oplus W', description: '直和 (Direct sum)', descriptionEn: 'Direct sum' },
      { latex: 'G \\rtimes H', description: '半直积 (Semidirect product)', descriptionEn: 'Semidirect product' },
      { latex: '\\mathrm{Hom}(A, B)', description: '态射集 (Hom-set)', descriptionEn: 'Hom-set (morphisms)' },
      { latex: '\\mathrm{Aut}(G)', description: '自同构群 (Automorphism group)', descriptionEn: 'Automorphism group' },
    ],
  },
  {
    id: 'geom-topology',
    name: '拓扑学与微分几何',
    nameEn: 'Topology & Differential Geometry',
    symbols: [
      { latex: '\\partial M', description: '流形边界 (Manifold boundary)', descriptionEn: 'Boundary of a manifold' },
      { latex: '\\omega \\wedge \\eta', description: '外积楔积 (Wedge product)', descriptionEn: 'Exterior (wedge) product' },
      { latex: 'd\\omega', description: '外微分算子 (Exterior derivative)', descriptionEn: 'Exterior derivative' },
      { latex: '\\mathbb{S}^n', description: 'n 维球面 (n-Sphere)', descriptionEn: 'n-sphere' },
      { latex: '\\mathbb{T}^2', description: '2 维环面 (2-Torus)', descriptionEn: '2-torus' },
      { latex: '\\mathbb{H}^n', description: '上半平面 / 双曲空间 (Hyperbolic space)', descriptionEn: 'Upper half-plane / hyperbolic space' },
      { latex: '\\chi(M)', description: '欧拉示性数 (Euler characteristic)', descriptionEn: 'Euler characteristic' },
      { latex: 'T_p M', description: '切空间 (Tangent space at p)', descriptionEn: 'Tangent space at p' },
    ],
  },
];

export default function LatexSymbolStudio() {
  const { isZh } = useLanguage();
  const [selectedCat, setSelectedCat] = useState<string>('logic-set');
  const [copiedLatex, setCopiedLatex] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const currentCategory = symbolCategories.find((c) => c.id === selectedCat) || symbolCategories[0];

  const handleCopy = (latex: string) => {
    navigator.clipboard.writeText(latex);
    setCopiedLatex(latex);
    setTimeout(() => setCopiedLatex(null), 1500);
  };

  const displayedSymbols = searchQuery.trim()
    ? symbolCategories
        .flatMap((c) => c.symbols)
        .filter(
          (s) =>
            s.latex.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.descriptionEn.toLowerCase().includes(searchQuery.toLowerCase())
        )
    : currentCategory.symbols;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-sm">
              {isZh ? 'LaTeX 全学科高阶数学符号库 (Math Notation Studio)' : 'Math Notation Studio — All-Discipline LaTeX Symbols'}
            </h3>
            <p className="text-xs text-slate-400">
              {isZh
                ? '涵盖公理集合论、分析学、代数与微分几何的标准 LaTeX 符号体系，点击一键复制'
                : 'Standard LaTeX notation across set theory, analysis, algebra, and differential geometry — click any card to copy'}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isZh ? '搜索符号 (如 int, cup, 偏导)...' : 'Search symbols (e.g. int, cup, partial)...'}
            className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-xl pl-8 pr-3 py-1.5 outline-none focus:border-purple-500 w-48"
          />
        </div>
      </div>

      {/* Category Tabs */}
      {!searchQuery && (
        <div className="flex flex-wrap gap-2">
          {symbolCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCat === cat.id
                  ? 'bg-purple-500 text-slate-950 font-bold shadow-md shadow-purple-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              {isZh ? cat.name : cat.nameEn}
            </button>
          ))}
        </div>
      )}

      {/* Symbols Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {displayedSymbols.map((item, idx) => {
          const isCopied = copiedLatex === item.latex;
          return (
            <div
              key={idx}
              onClick={() => handleCopy(item.latex)}
              className="p-3 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-purple-500/40 transition-all cursor-pointer flex flex-col items-center justify-between text-center space-y-2 group shadow-sm"
            >
              <div className="h-10 flex items-center justify-center text-cyan-300 group-hover:scale-110 transition-transform">
                <InlineLaTeX formula={item.latex} />
              </div>

              <div className="w-full space-y-1">
                <div className="text-[10px] font-mono text-purple-300/90 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800/80 truncate">
                  {item.latex}
                </div>
                <div
                  className="text-[10px] text-slate-400 truncate"
                  title={isZh ? item.description : item.descriptionEn}
                >
                  {isZh ? item.description.split('(')[0] : item.descriptionEn}
                </div>
              </div>

              <div className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                {isCopied ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                    <Check className="w-3 h-3" /> {isZh ? '已复制' : 'Copied'}
                  </span>
                ) : (
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 text-purple-400">
                    <Copy className="w-3 h-3" /> {isZh ? '复制源码' : 'Copy LaTeX'}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
