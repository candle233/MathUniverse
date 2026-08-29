'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { loadCustomPages, CustomPageConfig, CustomPageWidget } from '@/lib/customPageEngine';
import Cosmos3DGraph from '@/components/graph/Cosmos3DGraph';
import MathComputeEngine from '@/components/sandbox/MathComputeEngine';
import ZfcCampaignQuest from '@/components/math/ZfcCampaignQuest';
import FallacyDetectiveLab from '@/components/math/FallacyDetectiveLab';
import AcademicExportStudio from '@/components/export/AcademicExportStudio';
import LeanWebEditor from '@/components/lean/LeanWebEditor';
import LaTeXRenderer from '@/components/math/LaTeXRenderer';
import {
  ArrowLeft,
  Sparkles,
  Layers,
  Settings,
  Atom,
  GraduationCap,
  Layout,
  Boxes,
  Cpu,
  Share2,
  Calendar,
  Tag,
  FolderPlus,
} from 'lucide-react';
import AdminFloatingToolbar from '@/components/admin/AdminFloatingToolbar';

export default function CustomDynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const [pages, setPages] = useState<CustomPageConfig[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setPages(loadCustomPages());

    const handleUpdate = () => {
      setPages(loadCustomPages());
    };
    window.addEventListener('mathuniverse:custom-pages-updated', handleUpdate);
    return () => window.removeEventListener('mathuniverse:custom-pages-updated', handleUpdate);
  }, []);

  const pageConfig = pages.find((p) => p.slug === resolvedParams.slug);

  if (isClient && !pageConfig) {
    return (
      <div className="max-w-4xl mx-auto py-24 px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto text-2xl font-bold">
          404
        </div>
        <h1 className="text-2xl font-bold text-slate-100">未找到该自定义管理界面</h1>
        <p className="text-slate-400 text-sm max-w-md mx-auto">
          该页面可能已被管理员删除，或输入的链接地址有误。您可以通过管理员控制台重新创建。
        </p>
        <div className="pt-4 flex items-center justify-center gap-4">
          <Link
            href="/admin"
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            <span>进入管理员控制台</span>
          </Link>
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold transition-all cursor-pointer flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回首页</span>
          </Link>
        </div>
      </div>
    );
  }

  if (!pageConfig) {
    return (
      <div className="max-w-7xl mx-auto py-20 px-4 text-center space-y-4">
        <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin mx-auto" />
        <p className="text-xs text-slate-400 font-mono">正在加载自定义模块装配界面...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* 1. Header Breadcrumbs & Admin Edit Button */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            title="返回管理员控制台"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                /custom/{pageConfig.slug}
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400">
                类别: {pageConfig.category}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight mt-1">
              {pageConfig.titleZh}
            </h1>
            <p className="text-xs text-slate-400 font-mono">{pageConfig.titleEn}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>在控制台中编辑此界面</span>
          </Link>
        </div>
      </div>

      {/* 2. Page Description & Metadata Card */}
      {pageConfig.description && (
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-300 text-xs leading-relaxed flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-slate-200">界面配置概要：</p>
            <p className="text-slate-400">{pageConfig.description}</p>
          </div>
        </div>
      )}

      {/* 3. Render Custom Widgets in Assembled Layout */}
      <div className="space-y-12">
        {pageConfig.widgets.map((widget, index) => (
          <div key={widget.id || index} className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cyan-400" />
                <h2 className="text-sm font-bold text-slate-200">{widget.title}</h2>
              </div>
              {widget.description && (
                <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                  {widget.description}
                </span>
              )}
            </div>

            {/* Widget Container Content */}
            <div>
              {widget.type === 'cosmos_3d' && <Cosmos3DGraph />}

              {widget.type === 'math_compute' && <MathComputeEngine />}

              {widget.type === 'zfc_campaign' && <ZfcCampaignQuest />}

              {widget.type === 'fallacy_detective' && <FallacyDetectiveLab />}

              {widget.type === 'academic_export' && <AcademicExportStudio />}

              {widget.type === 'lean_editor' && (
                <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                  <LeanWebEditor />
                </div>
              )}

              {widget.type === 'custom_richtext' && (
                <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 prose prose-invert max-w-none text-slate-300 text-xs sm:text-sm">
                  <LaTeXRenderer content={widget.config?.customContent || ''} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Floating In-Situ Admin Toolbar */}
      <AdminFloatingToolbar />
    </div>
  );
}
