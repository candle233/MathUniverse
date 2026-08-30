'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { initialMathNodes } from '@/data/seedData';
import { disciplines } from '@/data/disciplines';
import { MathNode, NodeType } from '@/types/math';
import { topologicalSort, checkCircularDependency } from '@/lib/dagEngine';
import {
  loadCustomPages,
  saveCustomPages,
  CustomPageConfig,
  CustomPageWidget,
  PAGE_TEMPLATES,
  PageTemplate,
  getIsAdminMode,
  setIsAdminMode,
  loadActiveMathNodes,
  saveActiveMathNodes,
  updateSingleMathNode,
  deleteMathNodeById,
  resetMathNodesToSeed,
} from '@/lib/customPageEngine';
import { getNodeTitle, getDisciplineName, getNodeTypeLabel } from '@/lib/i18nHelper';
import { useLanguage } from '@/context/LanguageContext';
import InSituNodeEditorModal from '@/components/admin/InSituNodeEditorModal';
import LaTeXRenderer, { InlineLaTeX } from '@/components/math/LaTeXRenderer';
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
  ArrowUp,
  ArrowDown,
  RefreshCw,
  GitPullRequest,
  Check,
  X,
  Copy,
  FolderPlus,
  Atom,
  GraduationCap,
  Search,
  Eye,
  Sliders,
  Maximize2,
} from 'lucide-react';

const AVAILABLE_WIDGET_TYPES = [
  {
    type: 'cosmos_3d' as const,
    name: '3D 数学宇宙知识星系 (Cosmos3DGraph)',
    nameEn: '3D Math Universe Galaxy (Cosmos3DGraph)',
    desc: '六大学科三维力导向星云聚类与前置高亮',
    descEn: '3D force-directed nebula clustering of the six disciplines with prerequisite highlighting',
  },
  {
    type: 'math_compute' as const,
    name: '客户端符号与动力系统求解器 (MathComputeEngine)',
    nameEn: 'Client-side Symbolic & Dynamical Systems Solver (MathComputeEngine)',
    desc: '泰勒展开、微积分、矩阵特征值与 RK4 混沌模拟',
    descEn: 'Taylor expansion, calculus, matrix eigenvalues, and RK4 chaos simulation',
  },
  {
    type: 'zfc_campaign' as const,
    name: '“从公理创世”ZFC 战役 (ZfcCampaignQuest)',
    nameEn: '"Genesis from Axioms" ZFC Campaign (ZfcCampaignQuest)',
    desc: '6 大文明纪元游戏化 RPG 关卡与证明挑战',
    descEn: 'Gamified RPG levels and proof challenges across six civilization eras',
  },
  {
    type: 'fallacy_detective' as const,
    name: '数学伪证明侦探实验室 (FallacyDetectiveLab)',
    nameEn: 'Mathematical Fallacy Detective Lab (FallacyDetectiveLab)',
    desc: '收录除零、复数割线与积分下半连续性经典悖论',
    descEn: 'Classic paradoxes including division by zero, complex secants, and lower semicontinuity of the integral',
  },
  {
    type: 'academic_export' as const,
    name: '出版级学术排版导出工坊 (AcademicExportStudio)',
    nameEn: 'Publication-grade Academic Export Studio (AcademicExportStudio)',
    desc: '一键生成 AMS-LaTeX、现代 Typst 与 Beamer 幻灯片',
    descEn: 'One-click export to AMS-LaTeX, modern Typst, and Beamer slides',
  },
  {
    type: 'lean_editor' as const,
    name: 'Lean 4 形式化验证实验室 (LeanWebEditor)',
    nameEn: 'Lean 4 Formal Verification Lab (LeanWebEditor)',
    desc: '定理形式化证明与 Lean 4 机器语法检查',
    descEn: 'Formal theorem proving with Lean 4 machine-checked syntax',
  },
  {
    type: 'custom_richtext' as const,
    name: '自定义 Markdown + LaTeX 富文本卡片',
    nameEn: 'Custom Markdown + LaTeX Rich-text Card',
    desc: '插入任意数学公式导言、讲义说明或研讨通知',
    descEn: 'Insert any math preamble, lecture notes, or seminar announcement',
  },
];

// EN display descriptions for PAGE_TEMPLATES (id-keyed; zh descriptions live in the data file)
const TEMPLATE_DESC_EN: Record<string, string> = {
  'tmpl-seminar':
    'For running frontier math-physics or advanced geometry & topology seminars — includes lecture notes, a 3D cosmos map, and an ODE phase-space solver.',
  'tmpl-olympiad':
    'Rigorous axiomatic training with the ZFC genesis RPG tech tree, the fallacy detective lab, and Typst handout export.',
  'tmpl-formal-prover':
    'Focused on formal verification, featuring a zero-setup interactive Lean 4 editor and #print axioms verification certificates.',
};

const RICHTEXT_DEFAULT_ZH = '### 欢迎访问全新定制数学界面\n\n在此输入 Markdown 与 LaTeX 公式，如 $\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}$';
const RICHTEXT_DEFAULT_EN = '### Welcome to your new custom math page\n\nEnter Markdown and LaTeX here, e.g. $\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}$';

export default function AdminDashboardPage() {
  const { isZh, locale } = useLanguage();
  const [activeTab, setActiveTab] = useState<'page_builder' | 'node_cms' | 'dag_health' | 'pr_moderation' | 'backup'>('page_builder');
  const [isAdmin, setIsAdmin] = useState(false);
  const [customPages, setCustomPages] = useState<CustomPageConfig[]>([]);
  const [allNodes, setAllNodes] = useState<MathNode[]>(() => loadActiveMathNodes());
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Selected node for InSitu Quick Edit Modal
  const [editingNode, setEditingNode] = useState<MathNode | null>(null);

  // Node Search & Filter State
  const [nodeSearch, setNodeSearch] = useState('');
  const [nodeDisciplineFilter, setNodeDisciplineFilter] = useState('all');
  const [nodeTypeFilter, setNodeTypeFilter] = useState('all');

  // Page Builder Form State
  const [pageForm, setPageForm] = useState({
    id: '',
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
  const [customRichText, setCustomRichText] = useState(RICHTEXT_DEFAULT_ZH);
  const [previewMode, setPreviewMode] = useState<'split' | 'edit'>('split');

  // Track the untouched default rich-text draft with the active locale (hydration-safe: context starts 'zh' on both sides)
  useEffect(() => {
    setCustomRichText((prev) => {
      if (prev === RICHTEXT_DEFAULT_ZH) return isZh ? prev : RICHTEXT_DEFAULT_EN;
      if (prev === RICHTEXT_DEFAULT_EN) return isZh ? RICHTEXT_DEFAULT_ZH : prev;
      return prev;
    });
  }, [isZh]);

  useEffect(() => {
    setIsAdmin(getIsAdminMode());
    setCustomPages(loadCustomPages());
    setAllNodes(loadActiveMathNodes());

    const handleAdminUpdate = () => setIsAdmin(getIsAdminMode());
    const handlePagesUpdate = () => setCustomPages(loadCustomPages());
    const handleNodesUpdate = () => setAllNodes(loadActiveMathNodes());

    window.addEventListener('mathuniverse:admin-role-updated', handleAdminUpdate);
    window.addEventListener('mathuniverse:custom-pages-updated', handlePagesUpdate);
    window.addEventListener('mathuniverse:nodes-updated', handleNodesUpdate);

    return () => {
      window.removeEventListener('mathuniverse:admin-role-updated', handleAdminUpdate);
      window.removeEventListener('mathuniverse:custom-pages-updated', handlePagesUpdate);
      window.removeEventListener('mathuniverse:nodes-updated', handleNodesUpdate);
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
    notify(next
      ? (isZh ? '已开启管理员模式 ⚡ 您现在拥有全站配置与页面装配权限' : 'Admin mode enabled ⚡ You now have full site configuration and page assembly permissions')
      : (isZh ? '已切换回普通访客模式' : 'Switched back to visitor mode'));
  };

  // Load Page Template
  const handleApplyTemplate = (tmpl: PageTemplate) => {
    const widgetsWithIds: CustomPageWidget[] = tmpl.widgets.map((w, i) => ({
      ...w,
      id: `w-${Date.now()}-${i}`,
    }));
    setPageForm({
      id: '',
      titleZh: tmpl.nameZh,
      titleEn: tmpl.nameEn,
      slug: `${tmpl.defaultSlug}-${Date.now().toString().slice(-4)}`,
      description: isZh ? tmpl.descriptionZh : (TEMPLATE_DESC_EN[tmpl.id] || tmpl.descriptionZh),
      iconName: tmpl.iconName,
      category: tmpl.category,
      showInNav: true,
      widgets: widgetsWithIds,
    });
    notify(isZh
      ? `✨ 已载入模板「${tmpl.nameZh}」，您可以根据需求继续微调并发布！`
      : `✨ Loaded template "${tmpl.nameEn}". Fine-tune it as needed and publish when ready!`);
  };

  // Add widget
  const handleAddWidget = () => {
    const matched = AVAILABLE_WIDGET_TYPES.find((w) => w.type === selectedWidgetType);
    const newWidget: CustomPageWidget = {
      id: `w-${Date.now()}`,
      type: selectedWidgetType,
      title: matched ? (isZh ? matched.name : matched.nameEn).split(' (')[0] : (isZh ? '自定义组件' : 'Custom widget'),
      description: matched ? (isZh ? matched.desc : matched.descEn) : undefined,
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

  const handleMoveWidget = (index: number, direction: 'up' | 'down') => {
    const newWidgets = [...pageForm.widgets];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newWidgets.length) return;
    const temp = newWidgets[index];
    newWidgets[index] = newWidgets[targetIndex];
    newWidgets[targetIndex] = temp;
    setPageForm((prev) => ({ ...prev, widgets: newWidgets }));
  };

  const handleDuplicateWidget = (index: number) => {
    const target = pageForm.widgets[index];
    const duplicated: CustomPageWidget = {
      ...target,
      id: `w-${Date.now()}`,
      title: `${target.title} (${isZh ? '副本' : 'Copy'})`,
    };
    const newWidgets = [...pageForm.widgets];
    newWidgets.splice(index + 1, 0, duplicated);
    setPageForm((prev) => ({ ...prev, widgets: newWidgets }));
  };

  const handleRemoveWidget = (id: string) => {
    setPageForm((prev) => ({
      ...prev,
      widgets: prev.widgets.filter((w) => w.id !== id),
    }));
  };

  const handleCreateOrUpdatePage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pageForm.titleZh || !pageForm.slug) {
      notify(isZh ? '❌ 请填写界面中文标题与路由标识 (Slug)' : '❌ Please fill in the page title and URL slug');
      return;
    }
    const cleanSlug = pageForm.slug.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    const targetId = pageForm.id || `page-${cleanSlug}-${Date.now()}`;
    const newPage: CustomPageConfig = {
      id: targetId,
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
          title: isZh ? '界面导言' : 'Introduction',
          config: { customContent: isZh
            ? '### 新建定制数学界面\n\n欢迎体验管理员动态装配的数学工作台。'
            : '### New custom math page\n\nWelcome to your dynamically assembled math workspace.' },
        },
        {
          id: `w-${Date.now() + 1}`,
          type: 'cosmos_3d',
          title: isZh ? '3D 宇宙星系图谱' : '3D Cosmos Galaxy Map',
        },
      ],
    };

    const exists = customPages.some((p) => p.id === targetId || p.slug === cleanSlug);
    let updated: CustomPageConfig[];
    if (exists) {
      updated = customPages.map((p) => (p.id === targetId || p.slug === cleanSlug ? newPage : p));
    } else {
      updated = [newPage, ...customPages];
    }

    setCustomPages(updated);
    saveCustomPages(updated);
    notify(isZh ? `✅ 成功保存并发布页面：/custom/${cleanSlug}` : `✅ Page saved and published: /custom/${cleanSlug}`);

    // Reset Form
    setPageForm({
      id: '',
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

  const handleEditPageInForm = (page: CustomPageConfig) => {
    setPageForm({
      id: page.id,
      titleZh: page.titleZh,
      titleEn: page.titleEn,
      slug: page.slug,
      description: page.description,
      iconName: page.iconName,
      category: page.category,
      showInNav: page.showInNav,
      widgets: page.widgets,
    });
    notify(isZh
      ? `📝 已将页面「${page.titleZh}」载入装配器，编辑后点击保存即可更新！`
      : `📝 Loaded "${page.titleEn || page.titleZh}" into the assembler. Save to apply your changes!`);
  };

  const handleDeletePage = (id: string) => {
    const updated = customPages.filter((p) => p.id !== id);
    setCustomPages(updated);
    saveCustomPages(updated);
    notify(isZh ? '🗑️ 已删除该自定义页面' : '🗑️ Custom page deleted');
  };

  const handleTogglePageNav = (id: string) => {
    const updated = customPages.map((p) => (p.id === id ? { ...p, showInNav: !p.showInNav } : p));
    setCustomPages(updated);
    saveCustomPages(updated);
    notify(isZh ? '🌐 已更新导航栏显示状态' : '🌐 Navigation visibility updated');
  };

  // Filtered Math Nodes for CMS Table
  const filteredNodes = useMemo(() => {
    return allNodes.filter((node) => {
      const matchSearch =
        !nodeSearch.trim() ||
        node.titleZh.toLowerCase().includes(nodeSearch.toLowerCase()) ||
        node.titleEn.toLowerCase().includes(nodeSearch.toLowerCase()) ||
        node.id.toLowerCase().includes(nodeSearch.toLowerCase()) ||
        node.mscCode.toLowerCase().includes(nodeSearch.toLowerCase());

      const matchDisc = nodeDisciplineFilter === 'all' || node.disciplineId === nodeDisciplineFilter;
      const matchType = nodeTypeFilter === 'all' || node.nodeType === nodeTypeFilter;

      return matchSearch && matchDisc && matchType;
    });
  }, [allNodes, nodeSearch, nodeDisciplineFilter, nodeTypeFilter]);

  // Clone Node
  const handleCloneNode = (targetNode: MathNode) => {
    const clonedId = `${targetNode.id}-clone-${Date.now().toString().slice(-4)}`;
    const cloned: MathNode = {
      ...targetNode,
      id: clonedId,
      slug: `${targetNode.slug}-clone`,
      titleZh: `${targetNode.titleZh} (副本)`,
      titleEn: `${targetNode.titleEn} (Copy)`,
      viewCount: 1,
      reputationScore: 100,
    };
    const updated = updateSingleMathNode(cloned);
    setAllNodes(updated);
    notify(isZh ? `📑 成功克隆新命题：${cloned.titleZh}` : `📑 New proposition cloned: ${cloned.titleEn}`);
  };

  const handleDeleteNode = (id: string) => {
    if (confirm(isZh ? `确定要删除数学命题节点「${id}」吗？` : `Delete math node "${id}"?`)) {
      const updated = deleteMathNodeById(id);
      setAllNodes(updated);
      notify(isZh ? '🗑️ 命题节点已删除' : '🗑️ Node deleted');
    }
  };

  const handleResetSeedNodes = () => {
    if (confirm(isZh
      ? '确定要重置所有数学节点为初始出厂种子数据吗？所有未备份的自定义修改将被清除。'
      : 'Reset all math nodes to the factory seed data? All unbacked-up custom changes will be lost.')) {
      const reset = resetMathNodesToSeed();
      setAllNodes(reset);
      notify(isZh ? '🔄 知识库节点已重置为出厂初始种子数据' : '🔄 Knowledge base reset to factory seed data');
    }
  };

  // Create brand new node
  const handleCreateNewBlankNode = () => {
    const newBlank: MathNode = {
      id: `thm-custom-${Date.now().toString().slice(-4)}`,
      slug: `custom-theorem-${Date.now().toString().slice(-4)}`,
      titleZh: '新自定义数学定理',
      titleEn: 'New Custom Mathematical Theorem',
      nodeType: 'THEOREM',
      disciplineId: 'analysis',
      mscCode: '26-00',
      statementLatex: '\\forall x \\in \\mathbb{R},\\quad f(x) \\ge 0',
      statementPlainZh: '对于所有实数 x，函数值恒非负。',
      statementPlainEn: 'For all real x, the function value is non-negative.',
      intuitionMd: '几何上对应函数图像完全位于 x 轴上方。',
      verification: 'UNVERIFIED',
      reputationScore: 100,
      viewCount: 1,
      difficultyLevel: 2,
      dependencies: [],
      dependents: [],
      proofs: [],
      tags: ['自定义', '实分析'],
      lastModified: new Date().toISOString().split('T')[0],
    };
    setEditingNode(newBlank);
  };

  // DAG Health Metrics
  const dagAnalysis = useMemo(() => {
    const sort = topologicalSort(allNodes);
    const isolatedNodes = allNodes.filter(
      (n) => n.dependencies.length === 0 && n.dependents.length === 0
    );
    const mscDist = new Map<string, number>();
    allNodes.forEach((n) => {
      const prefix = n.mscCode.split('-')[0] || 'Misc';
      mscDist.set(prefix, (mscDist.get(prefix) || 0) + 1);
    });

    return {
      isDAG: sort.isDAG,
      totalNodes: allNodes.length,
      isolatedCount: isolatedNodes.length,
      mscCount: mscDist.size,
    };
  }, [allNodes]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Header Banner & Admin Mode Status */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/20">
            <Settings className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
                {isZh ? 'MathUniverse 可视化管理控制台与装配工坊' : 'MathUniverse Admin Console & Page Builder'}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-mono font-bold">
                Visual Studio Pro
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {isZh
                ? '一键套用模板装配新界面、全库命题快速在线编辑、实时 LaTeX 符号面板与 DAG 防环拓扑守护'
                : 'Assemble pages from templates, edit every proposition in place, and keep the DAG topology cycle-free'}
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
            <span>{isAdmin ? (isZh ? '⚡ 管理员模式 (已激活)' : '⚡ Admin Mode (Active)') : (isZh ? '点击切换至管理员模式' : 'Switch to Admin Mode')}</span>
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
          <span>{isZh ? `🎨 界面可视化装配工坊 (${customPages.length})` : `🎨 Page Builder Studio (${customPages.length})`}</span>
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
          <span>{isZh ? `📚 全库命题管理与编辑器 (${allNodes.length})` : `📚 Node Library & Editor (${allNodes.length})`}</span>
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
          <span>{isZh ? '🛡️ DAG 拓扑健康度巡检' : '🛡️ DAG Topology Health Check'}</span>
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
          <span>{isZh ? '⚖️ 同行评审 PR 审核台' : '⚖️ Peer Review PR Desk'}</span>
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
          <span>{isZh ? '💾 备份与数据管理' : '💾 Backup & Data Management'}</span>
        </button>
      </div>

      {/* 3. TAB CONTENTS */}

      {/* TAB 1: Visual Page Builder & Assembler Studio */}
      {activeTab === 'page_builder' && (
        <div className="space-y-8">
          {/* Template Quick Loader Bar */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-slate-100 text-sm">{isZh ? '一键套用预设界面模板 (Page Templates Gallery)' : 'One-Click Page Templates Gallery'}</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">{isZh ? '点击任意模板快速载入布局' : 'Click any template to load its layout'}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {PAGE_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => handleApplyTemplate(tmpl)}
                  className="p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-left transition-all group cursor-pointer space-y-2 shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-100 group-hover:text-cyan-300 transition-colors">
                      {isZh ? tmpl.nameZh : (tmpl.nameEn || tmpl.nameZh)}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 font-mono">
                      {tmpl.widgets.length} {isZh ? '个组件' : 'widgets'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {isZh ? tmpl.descriptionZh : (TEMPLATE_DESC_EN[tmpl.id] || tmpl.descriptionZh)}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Form & Widget Assembler */}
            <div className="lg:col-span-6 space-y-6">
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl space-y-5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Plus className="w-4 h-4 text-cyan-400" />
                    <h3 className="font-bold text-slate-100 text-sm">
                      {pageForm.id ? (isZh ? '编辑自定义界面' : 'Edit Custom Page') : (isZh ? '装配发布全新数学定制界面' : 'Assemble & Publish a New Custom Page')}
                    </h3>
                  </div>
                  {pageForm.id && (
                    <button
                      type="button"
                      onClick={() =>
                        setPageForm({
                          id: '',
                          titleZh: '',
                          titleEn: '',
                          slug: '',
                          description: '',
                          iconName: 'Layout',
                          category: 'custom',
                          showInNav: true,
                          widgets: [],
                        })
                      }
                      className="text-xs text-slate-400 hover:text-slate-200"
                    >
                      {isZh ? '清空表单' : 'Clear form'}
                    </button>
                  )}
                </div>

                <form onSubmit={handleCreateOrUpdatePage} className="space-y-4 text-xs font-mono">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-slate-300 font-bold">{isZh ? '界面中文名称 *' : 'Chinese Title *'}</label>
                      <input
                        type="text"
                        required
                        placeholder={isZh ? '例：微分几何与广义相对论专栏' : 'e.g. Differential Geometry & GR Column'}
                        value={pageForm.titleZh}
                        onChange={(e) => setPageForm({ ...pageForm, titleZh: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-xl px-3 py-2 outline-none focus:border-cyan-400 text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-300 font-bold">{isZh ? '英文标题 (English Title)' : 'English Title'}</label>
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
                      <label className="text-slate-300 font-bold">{isZh ? '路由路径 (URL Slug) *' : 'URL Slug *'}</label>
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
                      <label className="text-slate-300 font-bold">{isZh ? '分类标签 (Category)' : 'Category'}</label>
                      <select
                        value={pageForm.category}
                        onChange={(e) => setPageForm({ ...pageForm, category: e.target.value as any })}
                        className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-xl px-3 py-2 outline-none focus:border-cyan-400 text-xs"
                      >
                        <option value="custom">{isZh ? '通用定制 (Custom)' : 'Custom'}</option>
                        <option value="research">{isZh ? '前沿学术研讨 (Research)' : 'Research'}</option>
                        <option value="course">{isZh ? '大学专业课程 (Course)' : 'Course'}</option>
                        <option value="workshop">{isZh ? '奥林匹克/工作坊 (Workshop)' : 'Olympiad / Workshop'}</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-bold">{isZh ? '界面功能简述 (Description)' : 'Description'}</label>
                    <textarea
                      rows={2}
                      placeholder={isZh ? '描述该界面的学术目的与模块布局...' : 'Describe the academic purpose and module layout of this page...'}
                      value={pageForm.description}
                      onChange={(e) => setPageForm({ ...pageForm, description: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-xl px-3 py-2 outline-none focus:border-cyan-400 text-xs"
                    />
                  </div>

                  {/* Widget Selector & Assembler */}
                  <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-cyan-300 flex items-center gap-1.5 text-xs">
                        <Layers className="w-3.5 h-3.5" />
                        <span>{isZh ? '选择并添加功能模块 (Add Modules)' : 'Add Modules'}</span>
                      </span>
                      <button
                        type="button"
                        onClick={handleAddWidget}
                        className="flex items-center gap-1 px-3 py-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg text-xs transition-colors cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>{isZh ? '添加此模块' : 'Add Module'}</span>
                      </button>
                    </div>

                    <select
                      value={selectedWidgetType}
                      onChange={(e) => setSelectedWidgetType(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-xl px-3 py-2 outline-none text-xs"
                    >
                      {AVAILABLE_WIDGET_TYPES.map((w) => (
                        <option key={w.type} value={w.type}>
                          {isZh ? w.name : w.nameEn}
                        </option>
                      ))}
                    </select>

                    {selectedWidgetType === 'custom_richtext' && (
                      <div className="space-y-1 pt-1">
                        <label className="text-[11px] text-slate-400">{isZh ? '富文本/Markdown 与 LaTeX 内容：' : 'Rich text / Markdown + LaTeX content:'}</label>
                        <textarea
                          rows={3}
                          value={customRichText}
                          onChange={(e) => setCustomRichText(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 text-slate-300 rounded-xl p-2.5 text-xs font-mono outline-none"
                        />
                      </div>
                    )}

                    {/* Assembled Widgets List with Up / Down / Duplicate / Remove */}
                    {pageForm.widgets.length > 0 ? (
                      <div className="space-y-2 pt-2">
                        <div className="text-[11px] text-slate-400 font-bold">{isZh ? '已装配的模块序列 (按渲染顺序排列)：' : 'Assembled module sequence (in render order):'}</div>
                        {pageForm.widgets.map((w, idx) => (
                          <div
                            key={w.id}
                            className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-[10px]">
                                  {idx + 1}
                                </span>
                                <input
                                  type="text"
                                  value={w.title}
                                  onChange={(e) => {
                                    const updated = [...pageForm.widgets];
                                    updated[idx] = { ...updated[idx], title: e.target.value };
                                    setPageForm({ ...pageForm, widgets: updated });
                                  }}
                                  className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 text-xs outline-none focus:border-cyan-400 font-semibold"
                                />
                              </div>

                              {/* Controls */}
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  disabled={idx === 0}
                                  onClick={() => handleMoveWidget(idx, 'up')}
                                  className="p-1 text-slate-400 hover:text-cyan-300 disabled:opacity-30 cursor-pointer"
                                  title={isZh ? '上移' : 'Move up'}
                                >
                                  <ArrowUp className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  disabled={idx === pageForm.widgets.length - 1}
                                  onClick={() => handleMoveWidget(idx, 'down')}
                                  className="p-1 text-slate-400 hover:text-cyan-300 disabled:opacity-30 cursor-pointer"
                                  title={isZh ? '下移' : 'Move down'}
                                >
                                  <ArrowDown className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDuplicateWidget(idx)}
                                  className="p-1 text-slate-400 hover:text-purple-300 cursor-pointer"
                                  title={isZh ? '复制此模块' : 'Duplicate module'}
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveWidget(w.id)}
                                  className="p-1 text-rose-400 hover:text-rose-300 cursor-pointer"
                                  title={isZh ? '删除此模块' : 'Remove module'}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-500 italic pt-1">
                        {isZh
                          ? '若未手动添加模块，系统将默认挂载 3D 宇宙图谱与富文本导言。'
                          : 'If no modules are added, a 3D cosmos map and a rich-text introduction are mounted by default.'}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isZh ? '立即生成并发布自定义界面 (Publish Page)' : 'Publish Custom Page'}</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Right Column: Live Interactive Preview & Published Pages Library */}
            <div className="lg:col-span-6 space-y-6">
              {/* Live Canvas Preview Card */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-cyan-400" />
                    <span className="font-bold text-slate-100 text-xs">
                      {isZh ? '实时所见即所得排版预览 (Live Layout Preview)' : 'Live Layout Preview (WYSIWYG)'}
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-mono">
                    /custom/{pageForm.slug || 'preview'}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3 min-h-[160px]">
                  <h2 className="text-lg font-black text-slate-100">
                    {(isZh ? pageForm.titleZh : (pageForm.titleEn || pageForm.titleZh)) || (isZh ? '自定义数学界面名称预览' : 'Custom Page Title Preview')}
                  </h2>
                  <p className="text-xs text-slate-400 font-mono">
                    {isZh ? (pageForm.titleEn || 'Custom Page Title Preview') : (pageForm.slug || 'custom-page')}
                  </p>
                  {pageForm.description && (
                    <p className="text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                      {pageForm.description}
                    </p>
                  )}

                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">{isZh ? '模块渲染结构：' : 'Module render structure:'}</div>
                    {pageForm.widgets.length > 0 ? (
                      pageForm.widgets.map((w, i) => (
                        <div
                          key={w.id}
                          className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/90 text-xs flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-[9px]">
                              {i + 1}
                            </span>
                            <span className="text-slate-200 font-medium">{w.title}</span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono">{w.type}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-slate-500 italic p-2 text-center">
                        {isZh ? '暂无装配模块，将使用默认配置' : 'No modules assembled yet — defaults will be used'}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Published Pages Library */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                    <Layout className="w-4 h-4 text-cyan-400" />
                    <span>{isZh ? `已发布的自定义管理界面库 (${customPages.length})` : `Published Custom Pages Library (${customPages.length})`}</span>
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
                            <span className="text-sm font-bold text-slate-100">{isZh ? page.titleZh : (page.titleEn || page.titleZh)}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono">
                              {page.category}
                            </span>
                            {page.showInNav && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-emerald-500/20 text-emerald-300 font-mono">
                                {isZh ? '导航已显示' : 'In navigation'}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 font-mono mt-0.5">{isZh ? page.titleEn : page.slug}</p>
                          <p className="text-xs text-slate-400 mt-2">{page.description}</p>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => handleEditPageInForm(page)}
                            className="p-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 transition-colors cursor-pointer"
                            title={isZh ? '载入装配器编辑' : 'Edit in assembler'}
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <Link
                            href={`/custom/${page.slug}`}
                            target="_blank"
                            className="p-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 transition-colors cursor-pointer"
                            title={isZh ? '打开预览' : 'Open preview'}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDeletePage(page.id)}
                            className="p-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 transition-colors cursor-pointer"
                            title={isZh ? '删除界面' : 'Delete page'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Modules Summary */}
                      <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-slate-900 text-[11px] text-slate-400">
                        <span className="font-semibold text-slate-300">{isZh ? `包含模块 (${page.widgets.length}):` : `Modules (${page.widgets.length}):`}</span>
                        {page.widgets.map((w, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300 font-mono"
                          >
                            {w.title.split(' ')[0]}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Math Node Library & CMS Management */}
      {activeTab === 'node_cms' && (
        <div className="space-y-6">
          {/* Top Actions & Filters */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-slate-100 text-base flex items-center gap-2">
                  <FolderPlus className="w-5 h-5 text-purple-400" />
                  <span>{isZh ? '全库数学命题管理与在线编辑器 (Math Node CMS)' : 'Math Node CMS — Full-Library Management & Online Editor'}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isZh
                    ? '支持 21+ 核心原子命题搜索、实时修改 LaTeX、Lean 4 形式化代码与依赖防环检测'
                    : 'Search 21+ core atomic propositions, edit LaTeX and Lean 4 code in place, with dependency cycle detection'}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleCreateNewBlankNode}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-500/25 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isZh ? '新增数学命题 (Create New Node)' : 'Create New Node'}</span>
                </button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder={isZh ? '搜索定理中文名 / 英文名 / ID / MSC...' : 'Search by title / ID / MSC code...'}
                  value={nodeSearch}
                  onChange={(e) => setNodeSearch(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-xl pl-9 pr-3 py-2 outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <select
                  value={nodeDisciplineFilter}
                  onChange={(e) => setNodeDisciplineFilter(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-xl px-3 py-2 outline-none cursor-pointer"
                >
                  <option value="all">{isZh ? '所有数学学科 (All Disciplines)' : 'All Disciplines'}</option>
                  {disciplines.map((d) => (
                    <option key={d.id} value={d.id}>
                      {getDisciplineName(d, locale)} (MSC {d.mscCode})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  value={nodeTypeFilter}
                  onChange={(e) => setNodeTypeFilter(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-xl px-3 py-2 outline-none cursor-pointer"
                >
                  <option value="all">{isZh ? '所有命题类型 (All Types)' : 'All Types'}</option>
                  <option value="AXIOM">{isZh ? '公理 (Axiom)' : 'Axiom'}</option>
                  <option value="DEFINITION">{isZh ? '定义 (Definition)' : 'Definition'}</option>
                  <option value="THEOREM">{isZh ? '定理 (Theorem)' : 'Theorem'}</option>
                  <option value="LEMMA">{isZh ? '引理 (Lemma)' : 'Lemma'}</option>
                  <option value="COROLLARY">{isZh ? '推论 (Corollary)' : 'Corollary'}</option>
                  <option value="CONJECTURE">{isZh ? '猜想 (Conjecture)' : 'Conjecture'}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Node Cards Library Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNodes.map((node) => (
              <div
                key={node.id}
                className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-purple-500/50 transition-all flex flex-col justify-between space-y-4 shadow-xl"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 font-bold border border-purple-500/30">
                      {node.nodeType}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">MSC {node.mscCode}</span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-100">{getNodeTitle(node, locale)}</h4>
                    <p className="text-xs text-slate-400 font-mono">{isZh ? node.titleEn : node.id}</p>
                  </div>

                  {/* Formula snippet */}
                  <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800 text-[11px] text-cyan-200 font-mono truncate">
                    <InlineLaTeX formula={node.statementLatex} />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-900 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setEditingNode(node)}
                      className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-colors cursor-pointer flex items-center gap-1 text-xs"
                      title={isZh ? '打开在线编辑器' : 'Open inline editor'}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{isZh ? '快速编辑' : 'Quick Edit'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCloneNode(node)}
                      className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors cursor-pointer"
                      title={isZh ? '克隆此节点' : 'Clone this node'}
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <Link
                    href={`/node/${node.slug}`}
                    target="_blank"
                    className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold text-xs"
                  >
                    <span>{isZh ? '查看词条' : 'View entry'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: DAG Integrity Sentinel */}
      {activeTab === 'dag_health' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="text-xs text-slate-400">{isZh ? '总命题节点数' : 'Total nodes'}</div>
              <div className="text-2xl font-black text-cyan-400 font-mono mt-1">
                {dagAnalysis.totalNodes}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="text-xs text-slate-400">{isZh ? 'DAG 无环验证状态' : 'DAG acyclicity'}</div>
              <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
                {dagAnalysis.isDAG ? (isZh ? '严格无环 (PASS)' : 'Acyclic (PASS)') : (isZh ? '存在环 (ERROR)' : 'Cycles found (ERROR)')}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="text-xs text-slate-400">{isZh ? '覆盖 MSC 学科大类' : 'MSC subject areas covered'}</div>
              <div className="text-2xl font-black text-purple-400 font-mono mt-1">
                {dagAnalysis.mscCount}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="text-xs text-slate-400">{isZh ? '孤立孤岛命题数' : 'Isolated nodes'}</div>
              <div className="text-2xl font-black text-amber-400 font-mono mt-1">
                {dagAnalysis.isolatedCount}
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>{isZh ? '拓扑推导依赖全谱序 (Topological Derivation Ordering)' : 'Topological Derivation Ordering'}</span>
            </h3>
            <p className="text-xs text-slate-400">
              {isZh
                ? 'Kahn 拓扑排序算法输出的公理到高阶定理依赖层级链条：'
                : 'Dependency hierarchy from axioms to advanced theorems, as produced by Kahn topological sorting:'}
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {topologicalSort(allNodes).sorted.map((node, i) => (
                <span
                  key={node.id}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 flex items-center gap-1.5"
                >
                  <span className="text-cyan-400 font-bold">{i + 1}.</span>
                  <span>{getNodeTitle(node, locale)}</span>
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
              <span>{isZh ? '待审核社区修订 PR 仲裁列表' : 'Community Revision PR Review Queue'}</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">{isZh ? '演示环境模拟审核' : 'Simulated review (demo environment)'}</span>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-bold font-mono">
                    PR #104
                  </span>
                  <span className="font-bold text-slate-200 text-sm">
                    {isZh
                      ? '为斯托克斯定理补充微分形式外微分 $d^2=0$ 直觉图解'
                      : 'Add an exterior-derivative intuition diagram ($d^2 = 0$) to the Stokes theorem entry'}
                  </span>
                </div>
                <span className="text-xs text-slate-400">{isZh ? '由 @differential-topologist 提交' : 'Submitted by @differential-topologist'}</span>
              </div>
              <p className="text-xs text-slate-400">
                {isZh
                  ? '提案内容：在 Stokes 词条下增加流形外微分算子核与边界算子对偶性的可视化动画。'
                  : 'Proposal: add a visualization of the exterior derivative kernel and boundary-operator duality on manifolds to the Stokes entry.'}
              </p>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => notify(isZh ? '✅ PR #104 已批准并合并至主干种子库！' : '✅ PR #104 approved and merged into the main seed library!')}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{isZh ? '批准并合并 (Approve & Merge)' : 'Approve & Merge'}</span>
                </button>
                <button
                  onClick={() => notify(isZh ? 'ℹ️ 已向作者发送修改意见' : 'ℹ️ Change request sent to the author')}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
                >
                  {isZh ? '请求修改 (Request Changes)' : 'Request Changes'}
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
              <span>{isZh ? '知识库快照导出与数据管理' : 'Knowledge Base Snapshot Export & Data Management'}</span>
            </h3>
          </div>

          <p className="text-xs text-slate-400">
            {isZh
              ? `一键导出包含全部 ${allNodes.length} 个原子化数学节点与 ${customPages.length} 个自定义装配界面的完整 JSON 快照。`
              : `Export a full JSON snapshot of all ${allNodes.length} math nodes and ${customPages.length} custom pages.`}
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                const data = {
                  version: '2.0.0',
                  exportedAt: new Date().toISOString(),
                  nodes: allNodes,
                  customPages: customPages,
                };
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `mathuniverse-backup-${Date.now()}.json`;
                a.click();
                notify(isZh ? '📥 知识库完整 JSON 备份已下载至本地' : '📥 Full JSON backup downloaded to your device');
              }}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer flex items-center gap-2 shadow-lg shadow-cyan-500/20"
            >
              <Database className="w-4 h-4" />
              <span>{isZh ? '导出全量数据库 JSON 快照' : 'Export Full Database JSON Snapshot'}</span>
            </button>

            <button
              onClick={handleResetSeedNodes}
              className="px-4 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold transition-colors cursor-pointer flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>{isZh ? '重置为出厂初始种子数据' : 'Reset to Factory Seed Data'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Global InSitu Quick Edit Modal */}
      {editingNode && (
        <InSituNodeEditorModal
          node={editingNode}
          isOpen={!!editingNode}
          onClose={() => setEditingNode(null)}
          onSaveSuccess={(updated) => {
            const newList = updateSingleMathNode(updated);
            setAllNodes(newList);
            notify(isZh ? `✅ 命题「${updated.titleZh}」修改已生效！` : `✅ Changes to "${updated.titleEn}" are now live!`);
          }}
        />
      )}
    </div>
  );
}
