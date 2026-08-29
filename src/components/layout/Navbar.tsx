'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  Globe,
  Menu,
  X,
  User,
} from 'lucide-react';
import {
  loadCustomPages,
  CustomPageConfig,
  getIsAdminMode,
  setIsAdminMode,
} from '@/lib/customPageEngine';
import { useLanguage } from '@/context/LanguageContext';

export default function Navbar() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [customPages, setCustomPages] = useState<CustomPageConfig[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { locale, toggleLocale, t } = useLanguage();

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

  // Close the mobile/tablet dropdown whenever the route changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const handleToggleAdmin = () => {
    const next = !isAdmin;
    setIsAdmin(next);
    setIsAdminMode(next);
  };

  const closeMenu = () => setMenuOpen(false);

  const navCustomPages = customPages.filter((p) => p.showInNav && p.isPublished);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-1.5 sm:gap-4">
        {/* Brand Logo */}
        <Link
          href="/"
          onClick={closeMenu}
          className="flex items-center gap-2.5 group cursor-pointer min-w-0"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 flex items-center justify-center text-slate-950 font-extrabold text-base shadow-lg shadow-cyan-500/25 group-hover:scale-105 transition-transform shrink-0">
            ∑
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-200 to-purple-300 text-sm sm:text-base tracking-tight truncate">
                {t('nav.brand')}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono font-bold shrink-0 hidden lg:inline">
                v1.5
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono leading-none hidden lg:block truncate max-w-[200px]">
              {t('nav.brandSubtitle')}
            </p>
          </div>
        </Link>

        {/* Global Spotlight Search Modal Trigger */}
        <div className="flex-1 min-w-0 max-w-md basis-6 sm:basis-24 mx-1 sm:mx-3">
          <GlobalSearchModal />
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1 shrink-0">
          <Link
            href="/graph"
            onClick={closeMenu}
            className="hidden md:flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-cyan-300 hover:bg-slate-900 transition-colors cursor-pointer"
          >
            <Network className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden xl:inline">{t('nav.graph')}</span>
          </Link>

          <Link
            href="/lean"
            onClick={closeMenu}
            className="hidden md:flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-emerald-300 hover:bg-slate-900 transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden xl:inline">{t('nav.lean')}</span>
          </Link>

          <Link
            href="/community"
            onClick={closeMenu}
            className="hidden md:flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-purple-300 hover:bg-slate-900 transition-colors cursor-pointer"
          >
            <GitPullRequest className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden xl:inline">{t('nav.community')}</span>
          </Link>

          <Link
            href="/editor"
            onClick={closeMenu}
            className="hidden md:flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-amber-300 hover:bg-slate-900 transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden xl:inline">{t('nav.editor')}</span>
          </Link>

          {/* Dynamically Created Custom Pages in Navigation */}
          {navCustomPages.slice(0, 1).map((page) => (
            <Link
              key={page.id}
              href={`/custom/${page.slug}`}
              onClick={closeMenu}
              className="hidden lg:flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-semibold text-cyan-300 hover:bg-slate-900 transition-colors cursor-pointer"
            >
              {page.iconName === 'Atom' ? (
                <Atom className="w-3.5 h-3.5 text-cyan-400" />
              ) : page.iconName === 'GraduationCap' ? (
                <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Layout className="w-3.5 h-3.5 text-cyan-400" />
              )}
              <span>
                {locale === 'en'
                  ? page.titleEn.length > 12 ? `${page.titleEn.slice(0, 12)}...` : page.titleEn
                  : page.titleZh.length > 8 ? `${page.titleZh.slice(0, 8)}...` : page.titleZh}
              </span>
            </Link>
          ))}

          {/* Admin Dashboard Direct Link */}
          <Link
            href="/admin"
            onClick={closeMenu}
            className={`hidden md:flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              isAdmin
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
            title={t('admin.title')}
          >
            <Settings className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden xl:inline">{t('nav.admin')}</span>
          </Link>

          {/* User Bookmarks Quick Drawer Trigger */}
          <BookmarkDrawer />

          {/* Language Switcher Button (🌐 中文 / EN) — icon-only in the bar; full toggle lives in the dropdown below xl */}
          <button
            onClick={toggleLocale}
            className="flex items-center gap-1.5 px-1.5 py-1 sm:px-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold transition-all cursor-pointer shadow-sm shrink-0"
            title={locale === 'zh' ? 'Switch to English' : '切换为中文'}
            aria-label={locale === 'zh' ? 'Switch to English' : '切换为中文'}
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="sr-only">{locale === 'zh' ? '中 / EN' : 'EN / 中'}</span>
          </button>

          {/* User / Admin Mode Indicator & Switcher */}
          <div className="sm:ml-1 sm:pl-2 sm:border-l border-slate-800 flex items-center gap-2">
            <button
              onClick={handleToggleAdmin}
              className={`flex items-center gap-1.5 px-1.5 py-1 sm:px-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                isAdmin
                  ? 'bg-amber-500/20 border border-amber-500/50 text-amber-300 shadow-md shadow-amber-500/20'
                  : 'bg-slate-800/60 border border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
              title="Toggle Admin / Visitor Mode"
              aria-label={isAdmin ? t('nav.adminMode') : t('nav.visitorMode')}
            >
              <span className="flex items-center" aria-hidden="true">
                {isAdmin ? (
                  <ShieldCheck className="w-3.5 h-3.5" />
                ) : (
                  <User className="w-3.5 h-3.5" />
                )}
              </span>
            </button>
          </div>

          {/* Mobile / Tablet Menu Hamburger (below xl) */}
          <button
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label={t('nav.menu')}
            title={t('nav.menu')}
            className="xl:hidden flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-slate-300 hover:text-cyan-300 hover:bg-slate-900 transition-colors cursor-pointer shrink-0"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>
      </div>

      {/* Mobile / Tablet Dropdown Menu (below xl) — overlays page content */}
      {menuOpen && (
        <div className="xl:hidden absolute top-full inset-x-0 z-40 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800 shadow-2xl shadow-black/40">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col gap-1">
            <Link
              href="/graph"
              onClick={closeMenu}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-300 hover:text-cyan-300 hover:bg-slate-900 transition-colors cursor-pointer"
            >
              <Network className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>{t('nav.graph')}</span>
            </Link>

            <Link
              href="/lean"
              onClick={closeMenu}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-300 hover:text-emerald-300 hover:bg-slate-900 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{t('nav.lean')}</span>
            </Link>

            <Link
              href="/community"
              onClick={closeMenu}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-300 hover:text-purple-300 hover:bg-slate-900 transition-colors cursor-pointer"
            >
              <GitPullRequest className="w-4 h-4 text-purple-400 shrink-0" />
              <span>{t('nav.community')}</span>
            </Link>

            <Link
              href="/editor"
              onClick={closeMenu}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-300 hover:text-amber-300 hover:bg-slate-900 transition-colors cursor-pointer"
            >
              <Edit3 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{t('nav.editor')}</span>
            </Link>

            {/* Dynamically Created Custom Pages in Dropdown */}
            {navCustomPages.slice(0, 1).map((page) => (
              <Link
                key={page.id}
                href={`/custom/${page.slug}`}
                onClick={closeMenu}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold text-cyan-300 hover:bg-slate-900 transition-colors cursor-pointer"
              >
                {page.iconName === 'Atom' ? (
                  <Atom className="w-4 h-4 text-cyan-400 shrink-0" />
                ) : page.iconName === 'GraduationCap' ? (
                  <GraduationCap className="w-4 h-4 text-amber-400 shrink-0" />
                ) : (
                  <Layout className="w-4 h-4 text-cyan-400 shrink-0" />
                )}
                <span>
                  {locale === 'en'
                    ? page.titleEn.length > 12 ? `${page.titleEn.slice(0, 12)}...` : page.titleEn
                    : page.titleZh.length > 8 ? `${page.titleZh.slice(0, 8)}...` : page.titleZh}
                </span>
              </Link>
            ))}

            {/* Admin Dashboard Direct Link */}
            <Link
              href="/admin"
              onClick={closeMenu}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                isAdmin
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
              title={t('admin.title')}
            >
              <Settings className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{t('nav.admin')}</span>
            </Link>

            <div className="border-t border-slate-800 my-2" role="presentation" />

            {/* Language Toggle (duplicated for small screens) */}
            <button
              onClick={toggleLocale}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-mono font-bold text-cyan-300 hover:bg-slate-900 transition-colors cursor-pointer"
              title={locale === 'zh' ? 'Switch to English' : '切换为中文'}
            >
              <Globe className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>{locale === 'zh' ? '中 / EN' : 'EN / 中'}</span>
            </button>

            {/* Admin / Visitor Mode Toggle (duplicated for small screens) */}
            <button
              onClick={handleToggleAdmin}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-mono font-bold transition-all cursor-pointer ${
                isAdmin
                  ? 'bg-amber-500/20 border border-amber-500/50 text-amber-300 shadow-md shadow-amber-500/20'
                  : 'bg-slate-800/60 border border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
              title="Toggle Admin / Visitor Mode"
            >
              {isAdmin ? (
                <ShieldCheck className="w-4 h-4 shrink-0" />
              ) : (
                <User className="w-4 h-4 shrink-0" />
              )}
              <span>{isAdmin ? t('nav.adminMode') : t('nav.visitorMode')}</span>
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
