'use client';

import React, { useState, useEffect } from 'react';
import { initialMathNodes } from '@/data/seedData';
import { getNodeTypeMeta } from '@/lib/utils';
import { getNodeTitle } from '@/lib/i18nHelper';
import { useLanguage } from '@/context/LanguageContext';
import { InlineLaTeX } from '@/components/math/LaTeXRenderer';
import Link from 'next/link';
import { Bookmark, X, ArrowRight, Trash2, Download } from 'lucide-react';

export default function BookmarkDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const { locale, isZh, t } = useLanguage();

  const loadBookmarks = () => {
    try {
      const ids: string[] = [];
      initialMathNodes.forEach((node) => {
        if (localStorage.getItem(`math-bookmark-${node.id}`) === 'true') {
          ids.push(node.id);
        }
      });
      // Also check mathuniverse_bookmarks array
      const raw = localStorage.getItem('mathuniverse_bookmarks');
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) {
          arr.forEach((id) => {
            if (!ids.includes(id)) ids.push(id);
          });
        }
      }
      setBookmarkedIds(ids);
    } catch {}
  };

  useEffect(() => {
    loadBookmarks();
    window.addEventListener('storage', loadBookmarks);
    window.addEventListener('mathuniverse_bookmarks_updated', loadBookmarks);
    return () => {
      window.removeEventListener('storage', loadBookmarks);
      window.removeEventListener('mathuniverse_bookmarks_updated', loadBookmarks);
    };
  }, [isOpen]);

  const handleRemove = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      localStorage.removeItem(`math-bookmark-${id}`);
      const raw = localStorage.getItem('mathuniverse_bookmarks');
      if (raw) {
        let arr = JSON.parse(raw);
        if (Array.isArray(arr)) {
          arr = arr.filter((item: string) => item !== id);
          localStorage.setItem('mathuniverse_bookmarks', JSON.stringify(arr));
        }
      }
      setBookmarkedIds((prev) => prev.filter((item) => item !== id));
      window.dispatchEvent(new Event('mathuniverse_bookmarks_updated'));
    } catch {}
  };

  const handleExportMarkdown = () => {
    const bookmarkedNodes = initialMathNodes.filter((n) => bookmarkedIds.includes(n.id));
    if (bookmarkedNodes.length === 0) return;

    let mdContent = isZh
      ? `# MathUniverse 我的数学收藏夹\n导出时间: ${new Date().toLocaleString()}\n\n`
      : `# MathUniverse Bookmarks\nExported: ${new Date().toLocaleString()}\n\n`;

    bookmarkedNodes.forEach((n, idx) => {
      const title = getNodeTitle(n, locale);
      mdContent += `## ${idx + 1}. ${title} (${n.titleEn || n.titleZh})\n`;
      mdContent += `- **${isZh ? '类型' : 'Type'}**: ${n.nodeType} (MSC ${n.mscCode})\n`;
      mdContent += `- **${isZh ? '公式' : 'Formula'}**: $${n.statementLatex}$\n`;
      mdContent += `- **${isZh ? '释义' : 'Statement'}**: ${n.statementPlainZh}\n\n`;
    });

    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MathUniverse_Bookmarks_${Date.now()}.md`;
    link.click();
  };

  const bookmarkedNodes = initialMathNodes.filter((n) => bookmarkedIds.includes(n.id));

  return (
    <>
      {/* Trigger button in Navbar */}
      <button
        onClick={() => {
          loadBookmarks();
          setIsOpen(true);
        }}
        className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-300 text-xs transition-colors cursor-pointer"
        title={t('nav.bookmarks')}
      >
        <Bookmark className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
        <span className="hidden sm:inline">{t('nav.bookmarks')}</span>
        {bookmarkedIds.length > 0 && (
          <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 font-bold font-mono text-[10px] flex items-center justify-center">
            {bookmarkedIds.length}
          </span>
        )}
      </button>

      {/* Drawer Backdrop & Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex justify-end animate-in fade-in duration-200">
          <div
            className="w-full max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl h-full flex flex-col animate-in slide-in-from-right duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Bookmark className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 text-sm">{t('nav.bookmarks')}</h3>
                  <p className="text-xs text-slate-400">
                    {t('nav.bookmarksCount', { count: bookmarkedIds.length })}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {bookmarkedNodes.length > 0 ? (
                bookmarkedNodes.map((node) => {
                  const meta = getNodeTypeMeta(node.nodeType, locale);
                  const title = getNodeTitle(node, locale);
                  const secondaryTitle = locale === 'zh' ? node.titleEn : node.titleZh;

                  return (
                    <div
                      key={node.id}
                      className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 hover:border-amber-500/40 transition-all space-y-2 group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${meta.color}`}
                          >
                            {meta.label}
                          </span>
                          <span className="text-[11px] text-slate-500 font-mono">MSC {node.mscCode}</span>
                        </div>
                        <button
                          onClick={(e) => handleRemove(node.id, e)}
                          className="text-slate-500 hover:text-rose-400 p-1 transition-colors cursor-pointer"
                          title={isZh ? "移出收藏夹" : "Remove"}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <h4 className="font-bold text-slate-200 text-xs">{title}</h4>
                      {secondaryTitle && (
                        <p className="text-[11px] text-slate-400 font-mono">{secondaryTitle}</p>
                      )}

                      <div className="text-[11px] text-cyan-300 font-mono pt-1">
                        <InlineLaTeX formula={node.statementLatex} />
                      </div>

                      <div className="pt-2 flex justify-end">
                        <Link
                          href={`/node/${node.slug}`}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
                        >
                          <span>{t('common.viewProof')}</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-500 mx-auto">
                    <Bookmark className="w-6 h-6" />
                  </div>
                  <p className="text-xs text-slate-400">
                    {isZh ? '暂无收藏内容，在定理详情页点击“收藏”即可收录！' : 'No bookmarks yet. Click "Bookmark" on any theorem page to add!'}
                  </p>
                </div>
              )}
            </div>

            {/* Footer Export Button */}
            {bookmarkedNodes.length > 0 && (
              <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
                <button
                  onClick={handleExportMarkdown}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isZh ? '一键导出为 Markdown 复习笔记' : 'Export as Markdown Study Notes'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
