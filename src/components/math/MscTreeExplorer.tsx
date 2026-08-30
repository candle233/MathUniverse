'use client';

import React, { useState } from 'react';
import { initialMathNodes } from '@/data/seedData';
import Link from 'next/link';
import { Folder, FolderOpen, FileText, ChevronRight, ChevronDown, BookOpen, Layers, ShieldCheck } from 'lucide-react';
import { getNodeTypeMeta } from '@/lib/utils';
import { InlineLaTeX } from '@/components/math/LaTeXRenderer';
import { useLanguage } from '@/context/LanguageContext';

interface MscNode {
  code: string;
  nameZh: string;
  nameEn: string;
  subcategories?: MscNode[];
}

export const mscHierarchy: MscNode[] = [
  {
    code: '03',
    nameZh: '数理逻辑与数学基础',
    nameEn: 'Mathematical Logic and Foundations',
    subcategories: [
      { code: '03B', nameZh: '一般逻辑与类型论 (Type Theory / Lean)', nameEn: 'General Logic' },
      { code: '03E', nameZh: '公理集合论 (ZFC)', nameEn: 'Set Theory' },
    ],
  },
  {
    code: '11',
    nameZh: '数论与算术几何',
    nameEn: 'Number Theory',
    subcategories: [
      { code: '11A', nameZh: '初等数论 (同余、素数)', nameEn: 'Elementary Number Theory' },
      { code: '11M', nameZh: 'Zeta 函数与 L 函数 (黎曼猜想)', nameEn: 'Zeta and L-functions' },
    ],
  },
  {
    code: '15',
    nameZh: '线性代数与内积空间',
    nameEn: 'Linear Algebra',
    subcategories: [
      { code: '15A', nameZh: '向量空间与矩阵代数', nameEn: 'Basic Linear Algebra' },
    ],
  },
  {
    code: '20',
    nameZh: '近世代数与群论',
    nameEn: 'Group Theory',
    subcategories: [
      { code: '20A', nameZh: '群的基础公理与同构定理', nameEn: 'Foundations of Groups' },
      { code: '20D', nameZh: '有限群结构 (拉格朗日、西罗定理)', nameEn: 'Abstract Finite Groups' },
    ],
  },
  {
    code: '26',
    nameZh: '实分析与实函数论',
    nameEn: 'Real Functions & Calculus',
    subcategories: [
      { code: '26A', nameZh: '单变量微积分、极限与导数', nameEn: 'Functions of One Variable' },
      { code: '26D', nameZh: '不等式理论 (柯西-施瓦茨、赫尔德)', nameEn: 'Inequalities' },
    ],
  },
  {
    code: '54',
    nameZh: '一般拓扑学',
    nameEn: 'General Topology',
    subcategories: [
      { code: '54D', nameZh: '拓扑空间性质 (紧致性、连通性)', nameEn: 'Fairly General Properties' },
    ],
  },
  {
    code: '58',
    nameZh: '流形分析与微分形式',
    nameEn: 'Global Analysis, Manifolds',
    subcategories: [
      { code: '58A', nameZh: '微分流形与微分形式积分 (斯托克斯)', nameEn: 'General Theory of Differentiable Manifolds' },
    ],
  },
];

export default function MscTreeExplorer() {
  const { isZh } = useLanguage();
  const [expandedCodes, setExpandedCodes] = useState<Set<string>>(new Set(['26', '20', '11', '58']));
  const [selectedCode, setSelectedCode] = useState<string>('all');

  const toggleExpand = (code: string) => {
    setExpandedCodes((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  };

  const filteredNodes = initialMathNodes.filter((n) => {
    if (selectedCode === 'all') return true;
    return n.mscCode.startsWith(selectedCode);
  });

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-sm">
              {isZh ? 'MSC 2020 数学学科分类目录树 (AMS Subject Classification)' : 'MSC 2020 Subject Classification Tree (AMS)'}
            </h3>
            <p className="text-xs text-slate-400">
              {isZh ? '国际数学联合会 (IMU) 与美国数学会 (AMS) 标准分类代码体系' : 'The standard classification code system of the IMU and the American Mathematical Society (AMS)'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setSelectedCode('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            selectedCode === 'all'
              ? 'bg-blue-500 text-slate-950 font-bold'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          {isZh ? `查看全部分类 (${initialMathNodes.length})` : `View all categories (${initialMathNodes.length})`}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: MSC Hierarchy Tree */}
        <div className="lg:col-span-5 border-r border-slate-800/80 pr-4 space-y-2">
          <div className="text-xs font-semibold text-slate-400 mb-2">{isZh ? '学科分类层级目录:' : 'Subject classification hierarchy:'}</div>
          <div className="space-y-1 text-xs">
            {mscHierarchy.map((cat) => {
              const isExpanded = expandedCodes.has(cat.code);
              const isSelected = selectedCode === cat.code;
              const count = initialMathNodes.filter((n) => n.mscCode.startsWith(cat.code)).length;

              return (
                <div key={cat.code} className="space-y-1">
                  <div
                    onClick={() => {
                      toggleExpand(cat.code);
                      setSelectedCode(cat.code);
                    }}
                    className={`flex items-center justify-between p-2 rounded-xl transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                        : 'hover:bg-slate-900 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {isExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                      )}
                      <span className="font-mono text-cyan-400 font-bold">{cat.code}</span>
                      <span className="font-medium text-xs truncate">{isZh ? cat.nameZh : cat.nameEn}</span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                      {count}
                    </span>
                  </div>

                  {/* Subcategories */}
                  {isExpanded && cat.subcategories && (
                    <div className="pl-6 space-y-1 border-l border-slate-800 ml-3">
                      {cat.subcategories.map((sub) => {
                        const isSubSelected = selectedCode === sub.code;
                        const subCount = initialMathNodes.filter((n) => n.mscCode.startsWith(sub.code)).length;

                        return (
                          <div
                            key={sub.code}
                            onClick={() => setSelectedCode(sub.code)}
                            className={`flex items-center justify-between p-1.5 rounded-lg text-[11px] transition-all cursor-pointer ${
                              isSubSelected
                                ? 'bg-blue-500 text-slate-950 font-bold'
                                : 'hover:bg-slate-900/80 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            <span className="truncate">
                              <span className="font-mono text-cyan-400 mr-1.5">{sub.code}</span>
                              {isZh ? sub.nameZh : sub.nameEn}
                            </span>
                            <span className="font-mono text-[10px] opacity-75">{subCount}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Filtered Nodes under MSC code */}
        <div className="lg:col-span-7 space-y-3">
          <div className="text-xs font-semibold text-slate-400 flex items-center justify-between">
            <span>{isZh ? `分类下收录的数学命题 (MSC ${selectedCode}):` : `Theorems indexed under MSC ${selectedCode}:`}</span>
            <span className="text-cyan-400 font-mono font-bold">{filteredNodes.length}{isZh ? ' 个词条' : ' entries'}</span>
          </div>

          <div className="space-y-2.5 max-h-[380px] overflow-auto pr-1">
            {filteredNodes.length > 0 ? (
              filteredNodes.map((node) => {
                const meta = getNodeTypeMeta(node.nodeType, isZh ? 'zh' : 'en');
                return (
                  <Link
                    key={node.id}
                    href={`/node/${node.slug}`}
                    className="block p-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${meta.color}`}>
                          {meta.label}
                        </span>
                        <span className="font-bold text-slate-200 text-xs group-hover:text-cyan-300">
                          {isZh ? node.titleZh : node.titleEn}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">MSC {node.mscCode}</span>
                    </div>

                    {isZh && <p className="text-[11px] text-slate-400 font-mono truncate">{node.titleEn}</p>}
                    <div className="mt-1 text-[11px] text-cyan-300/90 font-mono truncate">
                      <InlineLaTeX formula={node.statementLatex} />
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="p-8 bg-slate-900/40 rounded-xl text-center text-slate-500 text-xs">
                {isZh ? '当前分类暂无录入词条，欢迎通过创作中心提交！' : 'No entries indexed under this category yet — submit one from the creation studio!'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
