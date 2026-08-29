'use client';

import React, { useState, useEffect } from 'react';
import { initialMathNodes } from '@/data/seedData';
import { getNodeTypeMeta } from '@/lib/utils';
import { InlineLaTeX } from '@/components/math/LaTeXRenderer';
import Link from 'next/link';
import { Bookmark, X, ArrowRight, Trash2, Download, Sparkles, BookOpen } from 'lucide-react';

export default function BookmarkDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  const loadBookmarks = () => {
    try {
      const ids: string[] = [];
      initialMathNodes.forEach((node) => {
        if (localStorage.getItem(`math-bookmark-${node.id}`) === 'true') {
          ids.push(node.id);
        }
      });
      setBookmarkedIds(ids);
    } catch {}
  };

  useEffect(() => {
    loadBookmarks();
    window.addEventListener('storage', loadBookmarks);
    return () => window.removeEventListener('storage', loadBookmarks);
  }, [isOpen]);

  const handleRemove = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      localStorage.removeItem(`math-bookmark-${id}`);
      setBookmarkedIds((prev) => prev.filter((item) => item !== id));
    } catch {}
  };

  const handleExportMarkdown = () => {
    const bookmarkedNodes = initialMathNodes.filter((n) => bookmarkedIds.includes(n.id));
    if (bookmarkedNodes.length === 0) return;

    let mdContent = `# MathUniverse 我的数学收藏夹\n导出时间: ${new Date().toLocaleString()}\n\n`;
    bookmarkedNodes.forEach((n, idx) => {
      mdContent += `## ${idx + 1}. ${n.titleZh} (${n.titleEn})\n`;
      mdContent += `- **类型**: ${n.nodeType} (MSC ${n.mscCode})\n`;
      mdContent += `- **公式**: $${n.statementLatex}$\n`;
      mdContent += `- **释义**: ${n.statementPlainZh}\n\n`;
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
        title="打开我的收藏夹"
      >
        <Bookmark className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
        <span className="hidden sm:inline">收藏夹</span>
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
                  <h3 className="font-bold text-slate-100 text-sm">我的数学收藏夹 (Bookmarks)</h3>
                  <p className="text-xs text-slate-400">已保存 {bookmarkedIds.length} 个重点命题与定理</p>
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
                  const meta = getNodeTypeMeta(node.nodeType);
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
                          title="移出收藏夹"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <h4 className="font-bold text-slate-200 text-xs">{node.titleZh}</h4>
                      <p className="text-[11px] text-slate-400 font-mono">{node.titleEn}</p>

                      <div className="text-[11px] text-cyan-300 font-mono pt-1">
                        <InlineLaTeX formula={node.statementLatex} />
                      </div>

                      <div className="pt-2 flex justify-end">
                        <Link
                          href={`/node/${node.slug}`}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
                        >
                          <span>查看完整证明</span>
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
                  <p className="text-xs text-slate-400">暂无收藏内容，在定理详情页点击“收藏”即可收录！</p>
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
                  <span>一键导出为 Markdown 复习笔记</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
