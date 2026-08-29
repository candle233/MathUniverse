'use client';

import React, { useState, useEffect } from 'react';
import { initialMathNodes } from '@/data/seedData';
import { getNodeTypeMeta } from '@/lib/utils';
import { getNodeTitle } from '@/lib/i18nHelper';
import { useLanguage } from '@/context/LanguageContext';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import { InlineLaTeX } from '@/components/math/LaTeXRenderer';
import { useRouter } from 'next/navigation';

export default function GlobalSearchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const { locale, isZh, t } = useLanguage();

  // Listen to Cmd+K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const results = initialMathNodes.filter((node) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase().trim();
    return (
      node.titleZh.toLowerCase().includes(q) ||
      node.titleEn.toLowerCase().includes(q) ||
      node.statementLatex.toLowerCase().includes(q) ||
      node.mscCode.toLowerCase().includes(q) ||
      node.tags.some((tg) => tg.toLowerCase().includes(q))
    );
  });

  const handleSelect = (slug: string) => {
    setIsOpen(false);
    router.push(`/node/${slug}`);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((idx) => (idx + 1) % (results.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((idx) => (idx - 1 + results.length) % (results.length || 1));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      handleSelect(results[selectedIndex].slug);
    }
  };

  return (
    <>
      {/* Trigger Button in Header/UI */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-400 hover:text-slate-200 text-xs transition-all cursor-pointer shadow-inner w-full"
      >
        <Search className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
        <span className="hidden sm:inline truncate">{t('nav.searchPlaceholder')}</span>
        <span className="sm:hidden">{t('common.search')}</span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-500 ml-auto">
          ⌘K
        </kbd>
      </button>

      {/* Modal Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-start justify-center pt-20 px-4 animate-in fade-in duration-200">
          <div
            className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800 bg-slate-950/50">
              <Search className="w-4 h-4 text-cyan-400 shrink-0" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleInputKeyDown}
                placeholder={isZh ? "搜索定理中文名、英文名、LaTeX公式或 MSC 分类号 (如 26A, 柯西, Stokes, \\int)..." : "Search theorems, formulas, MSC code or keywords..."}
                className="w-full bg-transparent text-slate-200 text-sm outline-none placeholder:text-slate-500 font-medium"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="text-slate-500 hover:text-slate-300 p-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-400 hover:text-slate-200 cursor-pointer font-mono"
              >
                ESC
              </button>
            </div>

            {/* Search Results List */}
            <div className="flex-1 overflow-auto p-2 space-y-1">
              {results.length > 0 ? (
                results.map((node, index) => {
                  const meta = getNodeTypeMeta(node.nodeType, locale);
                  const isSelected = index === selectedIndex;
                  const primaryTitle = getNodeTitle(node, locale);
                  const secondaryTitle = locale === 'zh' ? node.titleEn : node.titleZh;

                  return (
                    <div
                      key={node.id}
                      onClick={() => handleSelect(node.slug)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`p-3 rounded-xl transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-cyan-950/40 border border-cyan-500/40 text-slate-100'
                          : 'hover:bg-slate-800/60 text-slate-300 border border-transparent'
                      }`}
                    >
                      <div className="space-y-1 overflow-hidden">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${meta.color}`}
                          >
                            {meta.label}
                          </span>
                          <span className="font-bold text-xs text-slate-200 truncate">
                            {primaryTitle}
                          </span>
                          {secondaryTitle && (
                            <span className="text-[11px] text-slate-400 font-mono hidden sm:inline truncate">
                              {secondaryTitle}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-cyan-300/80 font-mono truncate pl-1">
                          <InlineLaTeX formula={node.statementLatex} />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 text-[11px] font-mono text-slate-500">
                        <span className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800">
                          MSC {node.mscCode}
                        </span>
                        {isSelected && <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center text-xs text-slate-500">
                  {isZh ? '未找到匹配的数学定理或命题，可尝试搜索缩写或 MSC 代码。' : 'No matching theorems or propositions found.'}
                </div>
              )}
            </div>

            {/* Footer Hints */}
            <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <div className="flex items-center gap-3">
                <span>{isZh ? '↑↓ 导航选择' : '↑↓ Navigate'}</span>
                <span>{isZh ? '↵ 回车跳转' : '↵ Select'}</span>
                <span>{isZh ? 'ESC 退出' : 'ESC Close'}</span>
              </div>
              <div className="flex items-center gap-1 text-cyan-400">
                <Sparkles className="w-3 h-3" />
                <span>MathUniverse</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
