'use client';

import React, { useState, useEffect } from 'react';
import { MathNode } from '@/types/math';
import { initialMathNodes } from '@/data/seedData';
import { disciplines } from '@/data/disciplines';
import { getNodeTypeMeta, getVerificationMeta } from '@/lib/utils';
import LaTeXRenderer, { InlineLaTeX } from '@/components/math/LaTeXRenderer';
import ProofViewer from '@/components/math/ProofViewer';
import LeanWebEditor from '@/components/lean/LeanWebEditor';
import PythonSandbox from '@/components/sandbox/PythonSandbox';
import MathComputeEngine from '@/components/sandbox/MathComputeEngine';
import AcademicExportStudio from '@/components/export/AcademicExportStudio';
import PullRequestViewer from '@/components/community/PullRequestViewer';
import CommutativeDiagramViewer from '@/components/math/CommutativeDiagramViewer';
import VerificationCertificate from '@/components/lean/VerificationCertificate';
import SubmitPrModal from '@/components/community/SubmitPrModal';
import AdminFloatingToolbar from '@/components/admin/AdminFloatingToolbar';
import { useLanguage } from '@/context/LanguageContext';
import { getNodeTitle, getNodeStatement, getNodeIntuition, getNodeTypeLabel, getDisciplineName } from '@/lib/i18nHelper';
import Link from 'next/link';
import {
  ArrowLeft,
  ShieldCheck,
  GitFork,
  BookOpen,
  Terminal,
  Code2,
  GitPullRequest,
  Star,
  Eye,
  Share2,
  Bookmark,
  Sparkles,
  Layers,
  Quote,
  Check,
  Copy,
  Plus,
  Edit3,
  ExternalLink,
  FileText,
  Calculator,
  Cpu,
} from 'lucide-react';

interface NodeDetailClientProps {
  node: MathNode;
}

export default function NodeDetailClient({ node }: NodeDetailClientProps) {
  const [activeNode, setActiveNode] = useState<MathNode>(node);
  useEffect(() => {
    setActiveNode(node);
  }, [node]);

  const { locale, isZh, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'proofs' | 'lean' | 'sandbox' | 'compute' | 'dag' | 'export' | 'prs' | 'citations'>('proofs');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedCitation, setCopiedCitation] = useState<string | null>(null);

  // Custom User References
  const [customReferences, setCustomReferences] = useState<
    Array<{ id: string; title: string; authors: string; year: string; doi?: string }>
  >([
    {
      id: 'ref-1',
      title: 'Principles of Mathematical Analysis (3rd Edition)',
      authors: 'Walter Rudin',
      year: '1976',
      doi: '10.1007/978-1-4612-6138-0',
    },
  ]);
  const [newRefForm, setNewRefForm] = useState({ title: '', authors: '', year: '' });
  const [showAddRefModal, setShowAddRefModal] = useState(false);
  const [showPrModal, setShowPrModal] = useState(false);

  useEffect(() => {
    // Check if node is bookmarked
    try {
      const raw = localStorage.getItem('mathuniverse_bookmarks');
      if (raw) {
        const ids = JSON.parse(raw);
        if (Array.isArray(ids) && ids.includes(node.id)) {
          setIsBookmarked(true);
        }
      }
    } catch {
      // ignore
    }
  }, [node.id]);

  const toggleBookmark = () => {
    try {
      const raw = localStorage.getItem('mathuniverse_bookmarks');
      let ids: string[] = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(ids)) ids = [];

      if (isBookmarked) {
        ids = ids.filter((id) => id !== node.id);
        setIsBookmarked(false);
        setToastMessage(isZh ? '已从收藏夹中移除' : 'Removed from bookmarks');
      } else {
        ids.push(node.id);
        setIsBookmarked(true);
        setToastMessage(isZh ? '⭐ 成功加入收藏夹！' : '⭐ Added to bookmarks!');
      }
      localStorage.setItem('mathuniverse_bookmarks', JSON.stringify(ids));
      window.dispatchEvent(new Event('mathuniverse_bookmarks_updated'));
      setTimeout(() => setToastMessage(null), 3000);
    } catch {
      // ignore
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setToastMessage(isZh ? '🔗 节点链接已复制到剪贴板' : '🔗 Node URL copied to clipboard');
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const handleAddCustomRef = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRefForm.title.trim()) return;

    const newRef = {
      id: `custom-ref-${Date.now()}`,
      title: newRefForm.title.trim(),
      authors: newRefForm.authors.trim() || 'Unknown',
      year: newRefForm.year.trim() || new Date().getFullYear().toString(),
    };

    setCustomReferences((prev) => [...prev, newRef]);
    setNewRefForm({ title: '', authors: '', year: '' });
    setShowAddRefModal(false);
    setToastMessage(isZh ? '📖 成功添加自定义学术文献引用！' : '📖 Citation reference added!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyCitation = (format: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCitation(format);
    setToastMessage(isZh ? `已复制 ${format} 引用格式至剪贴板` : `Copied ${format} citation`);
    setTimeout(() => {
      setCopiedCitation(null);
      setToastMessage(null);
    }, 2500);
  };

  const typeMeta = getNodeTypeMeta(node.nodeType);
  const verMeta = getVerificationMeta(node.verification);
  const discipline = disciplines.find((d) => d.id === node.disciplineId);

  const prerequisiteNodes = initialMathNodes.filter((n) => node.dependencies.includes(n.id));
  const dependentNodes = initialMathNodes.filter((n) => node.dependents.includes(n.id));

  const displayTitle = getNodeTitle(node, locale);
  const secondaryTitle = locale === 'zh' ? node.titleEn : node.titleZh;
  const statementContent = getNodeStatement(node, locale);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-2xl bg-slate-900 border border-cyan-500 text-cyan-300 font-bold text-xs shadow-2xl animate-in fade-in slide-in-from-bottom-3 duration-200 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Top Breadcrumb & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isZh ? '返回知识库首页' : 'Back to Home'}</span>
        </Link>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={toggleBookmark}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
              isBookmarked
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-md shadow-amber-500/20 font-bold'
                : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}`} />
            <span>{isBookmarked ? (isZh ? '已收藏节点' : 'Bookmarked') : (isZh ? '收藏节点' : 'Bookmark')}</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-purple-400" />
            <span>{isZh ? '分享' : 'Share'}</span>
          </button>

          <Link
            href="/editor"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-slate-950 font-bold shadow-md shadow-purple-500/20 transition-all cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isZh ? '在块编辑器中创作' : 'Open in Editor'}</span>
          </Link>
        </div>
      </div>

      {/* 2. Hero Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel-glow border border-cyan-500/30 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className={`text-xs px-3 py-1 rounded-full border font-bold ${typeMeta.color}`}>
              {getNodeTypeLabel(node.nodeType, locale)}
            </span>
            <span className="text-xs px-3 py-1 rounded-full bg-slate-900 text-slate-300 border border-slate-800 font-mono">
              MSC {node.mscCode} • {discipline ? getDisciplineName(discipline, locale) : 'Mathematics'}
            </span>
            <span className={`text-xs px-3 py-1 rounded-full border font-medium ${verMeta.className}`}>
              {verMeta.badge}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1 text-amber-300">
              <Star className="w-3.5 h-3.5 fill-current" /> ★ {node.reputationScore} {isZh ? '声望' : 'Reputation'}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" /> {node.viewCount} {isZh ? '次浏览' : 'views'}
            </span>
          </div>
        </div>

        {/* Title */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">{displayTitle}</h1>
          {secondaryTitle && (
            <p className="text-sm sm:text-base text-slate-400 font-mono mt-1">{secondaryTitle}</p>
          )}
        </div>

        {/* Mathematical Statement Box */}
        <div className="p-6 rounded-2xl bg-slate-950/90 border border-cyan-500/40 shadow-inner space-y-3">
          <div className="text-xs font-bold text-cyan-400 font-mono uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> {isZh ? '形式化数学陈述 (Formal Statement):' : 'Formal Statement:'}
          </div>
          <div className="text-base sm:text-lg text-cyan-200 font-mono overflow-x-auto py-2">
            <InlineLaTeX formula={node.statementLatex} displayMode={true} />
          </div>
          {statementContent && (
            <div className="pt-2 border-t border-slate-800/80 text-xs text-slate-300 leading-relaxed">
              <LaTeXRenderer content={statementContent} />
            </div>
          )}
        </div>
      </div>

      {/* 3. Multi-Tab Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        <button
          onClick={() => setActiveTab('proofs')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'proofs'
              ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>{isZh ? `推导与证明 (${node.proofs.length})` : `Proofs (${node.proofs.length})`}</span>
        </button>

        <button
          onClick={() => setActiveTab('lean')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'lean'
              ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>{isZh ? 'Lean 4 形式化验证' : 'Lean 4 Verification'}</span>
        </button>

        {node.codeSnippets && node.codeSnippets.length > 0 && (
          <button
            onClick={() => setActiveTab('sandbox')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'sandbox'
                ? 'bg-blue-500 text-slate-950 shadow-lg shadow-blue-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>{isZh ? 'Python / SymPy 沙盒' : 'Python / SymPy Sandbox'}</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab('compute')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'compute'
              ? 'bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/20'
              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>{isZh ? '符号计算与求解' : 'Symbolic & Numerical'}</span>
        </button>

        <button
          onClick={() => setActiveTab('export')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'export'
              ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20'
              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{isZh ? '学术排版与 Typst 导出' : 'Academic Export'}</span>
        </button>

        <button
          onClick={() => setActiveTab('dag')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'dag'
              ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
          }`}
        >
          <GitFork className="w-4 h-4" />
          <span>{isZh ? 'DAG 拓扑依赖关系' : 'DAG Dependencies'}</span>
        </button>

        <button
          onClick={() => setActiveTab('citations')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'citations'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Quote className="w-4 h-4" />
          <span>{isZh ? '学术引用与文献批注' : 'Citations & Notes'}</span>
        </button>

        <button
          onClick={() => setActiveTab('prs')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'prs'
              ? 'bg-indigo-500 text-slate-950 shadow-lg shadow-indigo-500/20'
              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
          }`}
        >
          <GitPullRequest className="w-4 h-4" />
          <span>{isZh ? '修订 PR 与同行评审' : 'Peer Review PRs'}</span>
        </button>
      </div>

      {/* 4. Tab Content Area */}
      <div>
        {activeTab === 'proofs' && <ProofViewer node={node} />}

        {activeTab === 'lean' && (
          <div className="space-y-6">
            <LeanWebEditor initialData={node.leanFormalization} />
            {node.leanFormalization && (
              <VerificationCertificate
                theoremTitleZh={node.titleZh}
                theoremTitleEn={node.titleEn}
                mscCode={node.mscCode}
                verificationData={node.leanFormalization}
              />
            )}
          </div>
        )}

        {activeTab === 'sandbox' && node.codeSnippets && node.codeSnippets[0] && (
          <PythonSandbox snippet={node.codeSnippets[0]} />
        )}

        {activeTab === 'compute' && (
          <div className="space-y-6">
            <MathComputeEngine />
          </div>
        )}

        {activeTab === 'export' && (
          <div className="space-y-6">
            <AcademicExportStudio initialNodeId={node.id} />
          </div>
        )}

        {activeTab === 'dag' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Prerequisites */}
              <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950 space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-purple-400">
                  <GitFork className="w-4 h-4" />
                  <span>{isZh ? '前置依赖基础 (Prerequisites)' : 'Prerequisites'}</span>
                </div>
                <p className="text-xs text-slate-400">
                  {isZh
                    ? '要严谨推导并理解当前节点，底层逻辑依赖于以下前置公理与引理：'
                    : 'To rigorously derive this node, foundational logic depends on the following prerequisite axioms and lemmas:'}
                </p>

                {prerequisiteNodes.length > 0 ? (
                  <div className="space-y-2.5">
                    {prerequisiteNodes.map((pre) => {
                      const preMeta = getNodeTypeMeta(pre.nodeType, locale);
                      return (
                        <Link
                          key={pre.id}
                          href={`/node/${pre.slug}`}
                          className="block p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/50 transition-all group cursor-pointer"
                        >
                          <div className="flex items-center justify-between mb-1 pointer-events-none">
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${preMeta.color}`}
                            >
                              {preMeta.label}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">MSC {pre.mscCode}</span>
                          </div>
                          <h4 className="font-semibold text-slate-200 text-xs group-hover:text-purple-300 pointer-events-none">
                            {getNodeTitle(pre, locale)}
                          </h4>
                          <div className="text-[11px] text-purple-300/80 font-mono truncate mt-1 pointer-events-none">
                            <InlineLaTeX formula={pre.statementLatex} />
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-slate-900 text-xs text-slate-500 text-center">
                    {isZh ? '该节点属于基础公理/第一性原理定义，无更前置依赖。' : 'This node is a foundational axiom or primitive definition without prerequisites.'}
                  </div>
                )}
              </div>

              {/* Dependents */}
              <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950 space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-emerald-400">
                  <Layers className="w-4 h-4" />
                  <span>{isZh ? '后续推论与衍生应用 (Dependents)' : 'Subsequent Dependents & Applications'}</span>
                </div>
                <p className="text-xs text-slate-400">
                  {isZh
                    ? '以下高级定理的推导直接使用了当前节点的结论：'
                    : 'The derivations of the following propositions directly rely on this node:'}
                </p>

                {dependentNodes.length > 0 ? (
                  <div className="space-y-2.5">
                    {dependentNodes.map((dep) => {
                      const depMeta = getNodeTypeMeta(dep.nodeType, locale);
                      return (
                        <Link
                          key={dep.id}
                          href={`/node/${dep.slug}`}
                          className="block p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 transition-all group cursor-pointer"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${depMeta.color}`}
                            >
                              {depMeta.label}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">MSC {dep.mscCode}</span>
                          </div>
                          <h4 className="font-semibold text-slate-200 text-xs group-hover:text-emerald-300">
                            {getNodeTitle(dep, locale)}
                          </h4>
                          <div className="text-[11px] text-emerald-300/80 font-mono truncate mt-1">
                            <InlineLaTeX formula={dep.statementLatex} />
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-slate-900 text-xs text-slate-500 text-center">
                    {isZh ? '暂无下游定理关联，欢迎贡献新的衍生推论！' : 'No downstream dependents currently registered. Contributions welcome!'}
                  </div>
                )}
              </div>
            </div>
            {node.disciplineId === 'algebra' && (
              <div className="mt-6">
                <CommutativeDiagramViewer />
              </div>
            )}
          </div>
        )}

        {/* Citations & Literature Notes Tab */}
        {activeTab === 'citations' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Standard Citations Format */}
              <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950 space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-amber-400">
                  <Quote className="w-4 h-4" />
                  <span>参考来源说明 (References Note)</span>
                </div>
                <p className="text-xs text-slate-400">
                  本节点是演示条目。一键导出的 BibTeX/AMS/APA 引用此前指向不存在的期刊与域名，
                  已被移除。请引用原始来源（如论文、教材、Mathlib 官方证明）而非此演示节点。
                </p>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto">
                  Mathlib: {node.leanFormalization?.mathlibImports?.join(', ') || '(无)'}
                </div>
              </div>

              {/* Add Custom Literature References & Notes */}
              <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950 space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-cyan-400">
                  <BookOpen className="w-4 h-4" />
                  <span>文献批注与参考书目 (Bibliography & Notes)</span>
                </div>
                <p className="text-xs text-slate-400">
                  为本定理添加经典教材、专著章节或 arXiv 预印本文献批注
                </p>

                {/* List of custom references */}
                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {customReferences.map((ref) => (
                    <div key={ref.id} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1">
                      <div className="font-semibold text-slate-200">{ref.title}</div>
                      <div className="text-[11px] text-slate-400 flex items-center justify-between">
                        <span>
                          {ref.authors} ({ref.year})
                        </span>
                        {ref.doi && <span className="font-mono text-cyan-400">{ref.doi}</span>}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add reference form */}
                <form onSubmit={handleAddCustomRef} className="pt-3 border-t border-slate-800 space-y-2.5 text-xs">
                  <div className="font-semibold text-slate-300">添加新的参考书目 / 论文:</div>
                  <input
                    type="text"
                    required
                    value={newRefForm.title}
                    onChange={(e) => setNewRefForm({ ...newRefForm, title: e.target.value })}
                    placeholder="文献 / 书名 (如: Real and Complex Analysis)"
                    className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-xl px-3 py-2 outline-none focus:border-cyan-500"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={newRefForm.authors}
                      onChange={(e) => setNewRefForm({ ...newRefForm, authors: e.target.value })}
                      placeholder="作者 (如: Walter Rudin)"
                      className="bg-slate-900 border border-slate-700 text-slate-200 rounded-xl px-3 py-2 outline-none focus:border-cyan-500"
                    />
                    <input
                      type="text"
                      value={newRefForm.year}
                      onChange={(e) => setNewRefForm({ ...newRefForm, year: e.target.value })}
                      placeholder="年份 (如: 1987)"
                      className="bg-slate-900 border border-slate-700 text-slate-200 rounded-xl px-3 py-2 outline-none focus:border-cyan-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>添加引用至本节点</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'prs' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-slate-900/60 border border-slate-800 rounded-2xl">
              <div>
                <h3 className="font-bold text-slate-200 text-xs">针对本定理提交同行修订提案</h3>
                <p className="text-[11px] text-slate-400">发现公式勘误、更优直觉解释或更新 Lean 4 证明，可随时提交 PR</p>
              </div>
              <SubmitPrModal />
            </div>
            <PullRequestViewer />
          </div>
        )}
      </div>

      {/* Floating In-Situ Admin Quick-Edit Bar */}
      <AdminFloatingToolbar
        currentNode={activeNode}
        onNodeUpdated={(updated) => setActiveNode(updated)}
      />
    </div>
  );
}
