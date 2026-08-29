'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import GlobalSearchModal from '@/components/layout/GlobalSearchModal';
import BookmarkDrawer from '@/components/layout/BookmarkDrawer';
import {
  Sparkles,
  Network,
  Terminal,
  GitPullRequest,
  Edit3,
  ShieldCheck,
  Compass,
  Trophy,
  Settings,
  Layout,
  Atom,
  GraduationCap,
} from 'lucide-react';
import {
  loadCustomPages,
  CustomPageConfig,
  getIsAdminMode,
  setIsAdminMode,
} from '@/lib/customPageEngine';

export default function Navbar() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [customPages, setCustomPages] = useState<CustomPageConfig[]>([]);

  useEffect(() => {
    setIsAdmin(getIsAdminMode());
    setCustomPages(loadCustomPages());

    const handleAdminUpdate = () => setIsAdmin(getIsAdminMode());
    const handlePagesUpdate = () => setCustomPages(loadCustomPages());

    window.addEventListener('mathuniverse:admin-role-updated', handleAdminUpdate);
    window.addEventListener('mathuniverse:custom-pages-updated', handlePagesUpdate);

    return () => {
      window.removeEventListener('mathuniverse:admin-role-updated', handleAdminUpdate);
      window.removeEventListener('mathuniverse:custom-pages-updated', handlePagesUpdate);
    };
  }, []);

  const handleToggleAdmin = () => {
    const next = !isAdmin;
    setIsAdmin(next);
    setIsAdminMode(next);
  };

  const navCustomPages = customPages.filter((p) => p.showInNav && p.isPublished);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group shrink-0 cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 flex items-center justify-center text-slate-950 font-extrabold text-base shadow-lg shadow-cyan-500/25 group-hover:scale-105 transition-transform">
            ∑
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-200 to-purple-300 text-lg tracking-tight">
                MathUniverse
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono font-bold">
                v1.5
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono leading-none hidden sm:block">
              全学科数学开源知识库与形式化平台
            </p>
          </div>
        </Link>

        {/* Global Spotlight Search Modal Trigger */}
        <div className="flex-1 max-w-md mx-2 sm:mx-4">
          <GlobalSearchModal />
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2 shrink-0">
          <Link
            href="/graph"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-cyan-300 hover:bg-slate-900 transition-colors cursor-pointer"
          >
            <Network className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">知识星空</span>
          </Link>

          <Link
            href="/lean"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-emerald-300 hover:bg-slate-900 transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">Lean 4 实验室</span>
          </Link>

          <Link
            href="/community"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-purple-300 hover:bg-slate-900 transition-colors cursor-pointer"
          >
            <GitPullRequest className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden md:inline">同行评审</span>
          </Link>

          <Link
            href="/editor"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-amber-300 hover:bg-slate-900 transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">创作中心</span>
          </Link>

          {/* Dynamically Created Custom Pages in Navigation */}
          {navCustomPages.slice(0, 2).map((page) => (
            <Link
              key={page.id}
              href={`/custom/${page.slug}`}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-cyan-300 hover:bg-slate-900 transition-colors cursor-pointer"
            >
              {page.iconName === 'Atom' ? (
                <Atom className="w-3.5 h-3.5 text-cyan-400" />
              ) : page.iconName === 'GraduationCap' ? (
                <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Layout className="w-3.5 h-3.5 text-cyan-400" />
              )}
              <span>{page.titleZh.length > 8 ? `${page.titleZh.slice(0, 8)}...` : page.titleZh}</span>
            </Link>
          ))}

          {/* Admin Dashboard Direct Link */}
          <Link
            href="/admin"
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              isAdmin
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
            title="管理员控制台与页面装配器"
          >
            <Settings className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">管理控制台</span>
          </Link>

          {/* User Bookmarks Quick Drawer Trigger */}
          <BookmarkDrawer />

          {/* User / Admin Mode Indicator & Switcher */}
          <div className="ml-1 pl-2 border-l border-slate-800 flex items-center gap-2">
            <button
              onClick={handleToggleAdmin}
              className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                isAdmin
                  ? 'bg-amber-500/20 border border-amber-500/50 text-amber-300 shadow-md shadow-amber-500/20'
                  : 'bg-slate-800/60 border border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
              title="点击切换 访客 / 管理员 模式"
            >
              {isAdmin ? '⚡ 管理员模式' : '访客 (点击切管理员)'}
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
