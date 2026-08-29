'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { initialMathNodes } from '@/data/seedData';
import { MathNode, NodeType } from '@/types/math';
import { topologicalSort, checkCircularDependency } from '@/lib/dagEngine';
import {
  loadCustomPages,
  saveCustomPages,
  CustomPageConfig,
  CustomPageWidget,
  getIsAdminMode,
  setIsAdminMode,
} from '@/lib/customPageEngine';
import LaTeXRenderer from '@/components/math/LaTeXRenderer';
import {
  ShieldCheck,
  Plus,
  Trash2,
  Edit3,
  Layers,
  Layout,
  ExternalLink,
  Sparkles,
  Save,
  CheckCircle,
  AlertCircle,
  Code2,
  FileText,
  Settings,
  Database,
  Cpu,
  BookOpen,
  ArrowRight,
  RefreshCw,
  GitPullRequest,
  Check,
  X,
  Copy,
  FolderPlus,
  Atom,
  GraduationCap,
} from 'lucide-react';

const AVAILABLE_WIDGET_TYPES = [
  {
    type: 'cosmos_3d' as const,
    name: '3D 数学宇宙知识星系 (Cosmos3DGraph)',
    desc: '六大学科三维力导向星云聚类与前置高亮',
  },
  {
    type: 'math_compute' as const,
    name: '客户端符号与动力系统求解器 (MathComputeEngine)',
    desc: '泰勒展开、微积分、矩阵特征值与 RK4 混沌模拟',
  },
  {
    type: 'zfc_campaign' as const,
    name: '“从公理创世”ZFC 战役 (ZfcCampaignQuest)',
    desc: '6 大文明纪元游戏化 RPG 关卡与证明挑战',
  },
  {
    type: 'fallacy_detective' as const,
    name: '数学伪证明侦探实验室 (FallacyDetectiveLab)',
    desc: '收录除零、复数割线与积分下半连续性经典悖论',
  },
  {
    type: 'academic_export' as const,
    name: '出版级学术排版导出工坊 (AcademicExportStudio)',
    desc: '一键生成 AMS-LaTeX、现代 Typst 与 Beamer 幻灯片',
  },
  {
    type: 'lean_editor' as const,
    name: 'Lean 4 形式化验证实验室 (LeanWebEditor)',
    desc: '定理形式化证明与 Lean 4 机器语法检查',
  },
  {
    type: 'custom_richtext' as const,
    name: '自定义 Markdown + LaTeX 富文本卡片',
    desc: '插入任意数学公式导言、讲义说明或研讨通知',
  },
];

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'page_builder' | 'node_cms' | 'dag_health' | 'pr_moderation' | 'backup'>('page_builder');
  const [isAdmin, setIsAdmin] = useState(false);
  const [customPages, setCustomPages] = useState<CustomPageConfig[]>([]);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // New Page Builder Form State
  const [pageForm, setPageForm] = useState({
    titleZh: '',
    titleEn: '',
    slug: '',
    description: '',
    iconName: 'Layout' as CustomPageConfig['iconName'],
    category: 'custom' as CustomPageConfig['category'],
    showInNav: true,
    widgets: [] as CustomPageWidget[],
  });
  const [selectedWidgetType, setSelectedWidgetType] = useState<CustomPageWidget['type']>('custom_richtext');
  const [customRichText, setCustomRichText] = useState('### 欢迎访问全新定制数学界面\n\n在此输入 Markdown 与 LaTeX 公式，如 $\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}$');

  // New Math Node CMS Form State
  const [nodeForm, setNodeForm] = useState({
    id: '',
    slug: '',
    titleZh: '',
    titleEn: '',
    mscCode: '00-01',
    discipline: 'analysis',
    type: 'THEOREM' as NodeType,
    statementLatex: '',
    statementZh: '',
    intuitionZh: '',
    dependencies: [] as string[],
    leanCode: '',
  });

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

  const notify = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  const handleToggleAdminRole = () => {
    const next = !isAdmin;
    setIsAdmin(next);
    setIsAdminMode(next);
    notify(next ? '已开启管理员模式 ⚡ 您现在拥有全站配置与页面装配权限' : '已切换回普通访客模式');
  };

  // Add widget to new page builder
  const handleAddWidget = () => {
    const matched = AVAILABLE_WIDGET_TYPES.find((w) => w.type === selectedWidgetType);
    const newWidget: CustomPageWidget = {
      id: `w-${Date.now()}`,
      type: selectedWidgetType,
      title: matched ? matched.name.split(' (')[0] : '自定义组件',
      description: matched?.desc,
      config:
        selectedWidgetType === 'custom_richtext'
          ? { customContent: customRichText }
          : undefined,
    };
    setPageForm((prev) => ({
      ...prev,
      widgets: [...prev.widgets, newWidget],
    }));
  };

  const handleRemoveWidget = (id: string) => {
    setPageForm((prev) => ({
      ...prev,
      widgets: prev.widgets.filter((w) => w.id !== id),
    }));
  };

  const handleCreatePage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pageForm.titleZh || !pageForm.slug) {
      notify('❌ 请填写界面中文标题与路由标识 (Slug)');
      return;
    }
    const cleanSlug = pageForm.slug.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    const newPage: CustomPageConfig = {
      id: `page-${cleanSlug}-${Date.now()}`,
      slug: cleanSlug,
      titleZh: pageForm.titleZh.trim(),
      titleEn: pageForm.titleEn.trim() || pageForm.titleZh.trim(),
      description: pageForm.description.trim(),
      iconName: pageForm.iconName,
      category: pageForm.category,
      isPublished: true,
      showInNav: pageForm.showInNav,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      widgets: pageForm.widgets.length > 0 ? pageForm.widgets : [
        {
          id: `w-${Date.now()}`,
          type: 'custom_richtext',
          title: '界面导言',
          config: { customContent: '### 新建定制数学界面\n\n欢迎体验管理员动态装配的数学工作台。' },
        },
        {
          id: `w-${Date.now() + 1}`,
          type: 'cosmos_3d',
          title: '3D 宇宙星系图谱',
        },
      ],
    };

    const updated = [newPage, ...customPages];
    setCustomPages(updated);
    saveCustomPages(updated);
    notify(`✅ 成功发布新页面：/custom/${cleanSlug}`);

    // Reset Form
    setPageForm({
      titleZh: '',
      titleEn: '',
      slug: '',
      description: '',
      iconName: 'Layout',
      category: 'custom',
      showInNav: true,
      widgets: [],
    });
  };

  const handleDeletePage = (id: string) => {
    const updated = customPages.filter((p) => p.id !== id);
    setCustomPages(updated);
    saveCustomPages(updated);
    notify('🗑️ 已删除该自定义页面');
  };

  // Node CMS cycle checking
  const cycleStatus = useMemo(() => {
    if (!nodeForm.id || nodeForm.dependencies.length === 0) return { hasCycle: false };
    for (const depId of nodeForm.dependencies) {
      const check = checkCircularDependency(initialMathNodes, nodeForm.id, depId);
      if (check.hasCycle) return check;
    }
    return { hasCycle: false };
  }, [nodeForm.id, nodeForm.dependencies]);

  // DAG Health Metrics
  const dagAnalysis = useMemo(() => {
    const sort = topologicalSort(initialMathNodes);
    const isolatedNodes = initialMathNodes.filter(
      (n) => n.dependencies.length === 0 && n.dependents.length === 0
    );
    const mscDist = new Map<string, number>();
    initialMathNodes.forEach((n) => {
      const prefix = n.mscCode.split('-')[0] || 'Misc';
      mscDist.set(prefix, (mscDist.get(prefix) || 0) + 1);
    });

    return {
      isDAG: sort.isDAG,
      totalNodes: initialMathNodes.length,
      isolatedCount: isolatedNodes.length,
      mscCount: mscDist.size,
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Header Banner & Admin Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/20">
            <Settings className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
                MathUniverse 管理员控制台与页面装配系统
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-mono font-bold">
                Admin Studio v2.0
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              动态添加与装配全新数学界面、维护数学命题拓扑、巡检 DAG 环依赖与仲裁同行 PR
            </p>
          </div>
        </div>

        {/* Mode Switch Toggle Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleAdminRole}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-lg ${
              isAdmin
                ? 'bg-amber-500 text-slate-950 shadow-amber-500/25 hover:bg-amber-400'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isAdmin ? '⚡ 管理员权限 (已激活)' : '切换至管理员模式'}</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {feedbackMsg && (
        <div className="p-4 rounded-2xl bg-cyan-950/80 border border-cyan-500 text-cyan-200 text-xs font-semibold flex items-center gap-2 shadow-xl animate-fade-in">
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* 2. Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        <button
          onClick={() => setActiveTab('page_builder')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'page_builder'
              ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layout className="w-4 h-4" />
          <span>动态界面与新页面装配器 ({customPages.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('node_cms')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'node_cms'
              ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20'
              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
          }`}
        >
          <FolderPlus className="w-4 h-4" />
          <span>数学命题与定理创作台</span>
        </button>

        <button
          onClick={() => setActiveTab('dag_health')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'dag_health'
              ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>DAG 拓扑健康度巡检</span>
        </button>

        <button
          onClick={() => setActiveTab('pr_moderation')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'pr_moderation'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
          }`}
        >
          <GitPullRequest className="w-4 h-4" />
          <span>同行评审 PR 审核台</span>
        </button>

        <button
          onClick={() => setActiveTab('backup')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'backup'
              ? 'bg-slate-700 text-slate-100 shadow-lg'
              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>知识库备份与迁移</span>
        </button>
      </div>

      {/* 3. Tab Contents */}

      {/* TAB 1: Visual Page Builder & Assembler */}
      {activeTab === 'page_builder' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Create New Page Form */}
          <div className="lg:col-span-6 space-y-6">
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl space-y-5">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                <Plus className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-slate-100 text-sm">装配发布全新数学定制界面</h3>
              </div>

              <form onSubmit={handleCreatePage} className="space-y-4 text-xs font-mono">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-bold">界面中文名称 *</label>
                    <input
                      type="text"
                      required
                      placeholder="例：微分几何与广义相对论专栏"
                      value={pageForm.titleZh}
                      onChange={(e) => setPageForm({ ...pageForm, titleZh: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-xl px-3 py-2 outline-none focus:border-cyan-400 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-300 font-bold">英文标题 (English Title)</label>
                    <input
                      type="text"
                      placeholder="Differential Geometry & GR"
                      value={pageForm.titleEn}
                      onChange={(e) => setPageForm({ ...pageForm, titleEn: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-xl px-3 py-2 outline-none focus:border-cyan-400 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-bold">路由路径 (URL Slug) *</label>
                    <div className="flex items-center">
                      <span className="px-2.5 py-2 bg-slate-800 border border-r-0 border-slate-700 rounded-l-xl text-slate-400 text-[11px]">
                        /custom/
                      </span>
                      <input
                        type="text"
                        required
                        placeholder="differential-geometry"
                        value={pageForm.slug}
                        onChange={(e) => setPageForm({ ...pageForm, slug: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-r-xl px-3 py-2 outline-none focus:border-cyan-400 text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-bold">分类标签 (Category)</label>
                    <select
                      value={pageForm.category}
                      onChange={(e) => setPageForm({ ...pageForm, category: e.target.value as any })}
                      className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-xl px-3 py-2 outline-none focus:border-cyan-400 text-xs"
                    >
                      <option value="custom">通用定制 (Custom)</option>
                      <option value="research">前沿学术研讨 (Research)</option>
                      <option value="course">大学专业课程 (Course)</option>
                      <option value="workshop">奥林匹克/工作坊 (Workshop)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">界面功能简述 (Description)</label>
                  <textarea
                    rows={2}
                    placeholder="描述该界面的学术目的与模块布局..."
                    value={pageForm.description}
                    onChange={(e) => setPageForm({ ...pageForm, description: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-xl px-3 py-2 outline-none focus:border-cyan-400 text-xs"
                  />
                </div>

                {/* Widget Selector & Assembler */}
                <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cyan-300 flex items-center gap-1.5 text-xs">
                      <Layers className="w-3.5 h-3.5" />
                      <span>选择并装配页面组件 (Modules)</span>
                    </span>
                    <button
                      type="button"
                      onClick={handleAddWidget}
                      className="flex items-center gap-1 px-3 py-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg text-xs transition-colors cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>添加该模块</span>
                    </button>
                  </div>

                  <select
                    value={selectedWidgetType}
                    onChange={(e) => setSelectedWidgetType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-xl px-3 py-2 outline-none text-xs"
                  >
                    {AVAILABLE_WIDGET_TYPES.map((w) => (
                      <option key={w.type} value={w.type}>
                        {w.name}
                      </option>
                    ))}
                  </select>

                  {selectedWidgetType === 'custom_richtext' && (
                    <div className="space-y-1 pt-1">
                      <label className="text-[11px] text-slate-400">富文本/Markdown 与 LaTeX 内容：</label>
                      <textarea
                        rows={3}
                        value={customRichText}
                        onChange={(e) => setCustomRichText(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 text-slate-300 rounded-xl p-2.5 text-xs font-mono outline-none"
                      />
                    </div>
                  )}

                  {/* Assembled Widgets List */}
                  {pageForm.widgets.length > 0 ? (
                    <div className="space-y-2 pt-2">
                      <div className="text-[11px] text-slate-400 font-bold">已装配的模块序列 (按渲染顺序排列)：</div>
                      {pageForm.widgets.map((w, idx) => (
                        <div
                          key={w.id}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-[10px]">
                              {idx + 1}
                            </span>
                            <span className="font-semibold text-slate-200">{w.title}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveWidget(w.id)}
                            className="text-rose-400 hover:text-rose-300 p-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-500 italic pt-1">
                      若未手动添加模块，系统将默认挂载 3D 宇宙图谱与富文本导言。
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>立即生成并发布自定义界面</span>
                </button>
              </form>
            </div>
          </div>

          {/* Right: Existing Custom Pages Library */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                <Layout className="w-4 h-4 text-cyan-400" />
                <span>已发布的自定义管理界面库 ({customPages.length})</span>
              </h3>
            </div>

            <div className="space-y-3">
              {customPages.map((page) => (
                <div
                  key={page.id}
                  className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all space-y-3 shadow-lg"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-100">{page.titleZh}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono">
                          {page.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">{page.titleEn}</p>
                      <p className="text-xs text-slate-400 mt-2">{page.description}</p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <Link
                        href={`/custom/${page.slug}`}
                        target="_blank"
                        className="p-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 transition-colors cursor-pointer"
                        title="打开预览"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDeletePage(page.id)}
                        className="p-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 transition-colors cursor-pointer"
                        title="删除界面"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Modules Summary */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-slate-900 text-[11px] text-slate-400">
                    <span className="font-semibold text-slate-300">包含模块 ({page.widgets.length}):</span>
                    {page.widgets.map((w, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300 font-mono">
                        {w.title.split(' ')[0]}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Math Node CMS / Theorem Creator */}
      {activeTab === 'node_cms' && (
        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <FolderPlus className="w-5 h-5 text-purple-400" />
              <div>
                <h3 className="font-bold text-slate-100 text-sm">新增数学命题与原子化定理 (Math Node CMS)</h3>
                <p className="text-xs text-slate-400">支持 LaTeX 公式、Lean 4 机器代码与严格无环依赖绑定</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs font-mono">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">命题 ID *</label>
                  <input
                    type="text"
                    placeholder="thm-poincare-conjecture"
                    value={nodeForm.id}
                    onChange={(e) => setNodeForm({ ...nodeForm, id: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-xl px-3 py-2 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">MSC 2020 分类代码</label>
                  <input
                    type="text"
                    placeholder="57-XX"
                    value={nodeForm.mscCode}
                    onChange={(e) => setNodeForm({ ...nodeForm, mscCode: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-xl px-3 py-2 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">中文名称 *</label>
                  <input
                    type="text"
                    placeholder="庞加莱猜想 (定理)"
                    value={nodeForm.titleZh}
                    onChange={(e) => setNodeForm({ ...nodeForm, titleZh: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-xl px-3 py-2 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">英文名称 *</label>
                  <input
                    type="text"
                    placeholder="Poincaré Conjecture"
                    value={nodeForm.titleEn}
                    onChange={(e) => setNodeForm({ ...nodeForm, titleEn: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-xl px-3 py-2 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-bold">LaTeX 形式化公式陈述 *</label>
                <textarea
                  rows={3}
                  placeholder="\text{Every simply connected, closed 3-manifold is homeomorphic to the 3-sphere } S^3."
                  value={nodeForm.statementLatex}
                  onChange={(e) => setNodeForm({ ...nodeForm, statementLatex: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-xl px-3 py-2 outline-none font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-bold">直觉解释 (Intuition)</label>
                <textarea
                  rows={2}
                  placeholder="用橡皮筋环套在任意封闭三维物体上，如果都能收缩为一点，则该物体必与三维球面同胚。"
                  value={nodeForm.intuitionZh}
                  onChange={(e) => setNodeForm({ ...nodeForm, intuitionZh: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-xl px-3 py-2 outline-none"
                />
              </div>
            </div>

            {/* Right: Live Preview & Prereq Selector */}
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-purple-400">实时 LaTeX 公式渲染预览：</div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-sm">
                  {nodeForm.statementLatex ? (
                    <LaTeXRenderer content={`$$${nodeForm.statementLatex}$$`} />
                  ) : (
                    <span className="text-slate-600 italic">等待输入公式...</span>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-cyan-400">环依赖拦截检查：</div>
                {cycleStatus.hasCycle ? (
                  <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>警告：当前依赖关系包含环路！拓扑引擎已拦截发布。</span>
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500 text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>DAG 拓扑无环检查通过，可以安全发布。</span>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => notify('✅ 新命题已成功录入种子库并在 DAG 图谱中激活！')}
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>保存并发布该数学命题</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DAG Integrity & Health Sentinel */}
      {activeTab === 'dag_health' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="text-xs text-slate-400">总命题节点数</div>
              <div className="text-2xl font-black text-cyan-400 font-mono mt-1">
                {dagAnalysis.totalNodes}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="text-xs text-slate-400">DAG 无环验证状态</div>
              <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
                {dagAnalysis.isDAG ? '严格无环 (PASS)' : '存在环 (ERROR)'}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="text-xs text-slate-400">覆盖 MSC 学科大类</div>
              <div className="text-2xl font-black text-purple-400 font-mono mt-1">
                {dagAnalysis.mscCount}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="text-xs text-slate-400">孤立孤岛命题数</div>
              <div className="text-2xl font-black text-amber-400 font-mono mt-1">
                {dagAnalysis.isolatedCount}
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>拓扑推导依赖全谱序 (Topological Derivation Ordering)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Kahn 拓扑排序算法输出的公理到高阶定理依赖层级链条：
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {topologicalSort(initialMathNodes).sorted.map((node, i) => (
                <span
                  key={node.id}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 flex items-center gap-1.5"
                >
                  <span className="text-cyan-400 font-bold">{i + 1}.</span>
                  <span>{node.titleZh}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PR Moderation Desk */}
      {activeTab === 'pr_moderation' && (
        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
              <GitPullRequest className="w-4 h-4 text-amber-400" />
              <span>待审核社区修订 PR 仲裁列表</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">演示环境模拟审核</span>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-bold font-mono">
                    PR #104
                  </span>
                  <span className="font-bold text-slate-200 text-sm">
                    为斯托克斯定理补充微分形式外微分 $d^2=0$ 直觉图解
                  </span>
                </div>
                <span className="text-xs text-slate-400">由 @differential-topologist 提交</span>
              </div>
              <p className="text-xs text-slate-400">
                提案内容：在 Stokes 词条下增加流形外微分算子核与边界算子对偶性的可视化动画。
              </p>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => notify('✅ PR #104 已批准并合并至主干种子库！')}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>批准并合并 (Approve & Merge)</span>
                </button>
                <button
                  onClick={() => notify('ℹ️ 已向作者发送修改意见')}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
                >
                  请求修改 (Request Changes)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Backup & Export */}
      {activeTab === 'backup' && (
        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" />
              <span>知识库快照导出与 JSON 备份</span>
            </h3>
          </div>

          <p className="text-xs text-slate-400">
            一键导出包含全部 {initialMathNodes.length} 个原子化数学节点与 {customPages.length} 个自定义装配界面的完整 JSON 快照。
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                const data = {
                  version: '2.0.0',
                  exportedAt: new Date().toISOString(),
                  nodes: initialMathNodes,
                  customPages: customPages,
                };
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `mathuniverse-backup-${Date.now()}.json`;
                a.click();
                notify('📥 知识库完整 JSON 备份已下载至本地');
              }}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer flex items-center gap-2 shadow-lg shadow-cyan-500/20"
            >
              <Database className="w-4 h-4" />
              <span>导出全量数据库 JSON 快照</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
