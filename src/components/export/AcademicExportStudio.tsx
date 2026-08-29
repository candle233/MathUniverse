'use client';

import React, { useState, useMemo } from 'react';
import { MathNode } from '@/types/math';
import { initialMathNodes } from '@/data/seedData';
import {
  compileExportDocument,
  generateOverleafUrl,
  getOrderedPrerequisiteNodes,
  defaultExportOptions,
  ExportFormat,
  ExportOptions,
} from '@/lib/exportEngine';
import {
  Download,
  Copy,
  Check,
  FileText,
  Sparkles,
  Layers,
  Sliders,
  ExternalLink,
  BookOpen,
  Send,
  GitBranch,
  Terminal,
  Cpu,
  FileCode,
  Eye,
  Info,
  Maximize2,
} from 'lucide-react';

interface AcademicExportStudioProps {
  initialNodeId?: string;
}

export default function AcademicExportStudio({ initialNodeId }: AcademicExportStudioProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string>(initialNodeId || 'thm-stokes');
  const [format, setFormat] = useState<ExportFormat>('latex_paper');
  const [includePrereqs, setIncludePrereqs] = useState(true);
  const [includeProofs, setIncludeProofs] = useState(true);
  const [includeIntuition, setIncludeIntuition] = useState(true);
  const [includeLean, setIncludeLean] = useState(true);
  const [includeTikz, setIncludeTikz] = useState(true);
  const [authorName, setAuthorName] = useState('MathUniverse Academic Community');
  const [institution, setInstitution] = useState('MathUniverse Open Knowledge Network');
  const [documentTitle, setDocumentTitle] = useState('');
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPrereqList, setShowPrereqList] = useState(false);

  // Selected Target MathNode
  const targetNode = useMemo(() => {
    return initialMathNodes.find((n) => n.id === selectedNodeId) || initialMathNodes[0];
  }, [selectedNodeId]);

  // Filtered MathNodes for selection
  const filteredNodes = useMemo(() => {
    if (!searchTerm.trim()) return initialMathNodes;
    const term = searchTerm.toLowerCase();
    return initialMathNodes.filter(
      (n) =>
        n.titleZh.toLowerCase().includes(term) ||
        n.titleEn.toLowerCase().includes(term) ||
        n.mscCode.toLowerCase().includes(term) ||
        n.slug.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  // Prerequisite Chain
  const orderedPrereqNodes = useMemo(() => {
    if (!targetNode) return [];
    return getOrderedPrerequisiteNodes(targetNode, initialMathNodes);
  }, [targetNode]);

  // Compiled Export Document
  const exportResult = useMemo(() => {
    if (!targetNode) {
      return compileExportDocument(initialMathNodes[0], initialMathNodes, defaultExportOptions);
    }
    const options: ExportOptions = {
      format,
      includePrerequisites: includePrereqs,
      includeProofs,
      includeIntuition,
      includeLeanCode: includeLean,
      includeTikzDiagram: includeTikz,
      authorName,
      institution,
      documentTitle: documentTitle.trim() || undefined,
    };
    return compileExportDocument(targetNode, initialMathNodes, options);
  }, [
    targetNode,
    format,
    includePrereqs,
    includeProofs,
    includeIntuition,
    includeLean,
    includeTikz,
    authorName,
    institution,
    documentTitle,
  ]);

  const handleCopy = () => {
    navigator.clipboard.writeText(exportResult.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([exportResult.content], { type: `${exportResult.mimeType};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = exportResult.suggestedFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleOpenOverleaf = () => {
    if (exportResult.overleafUrl) {
      window.open(exportResult.overleafUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-6 shadow-2xl">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/30 to-indigo-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-lg shadow-purple-500/10">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-100 text-base">
                出版级学术讲义与排版导出工坊
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono">
                v2.0 Academic Engine
              </span>
            </div>
            <p className="text-xs text-slate-400">
              一键将目标定理及其拓扑 DAG 前置闭包编译打包为 AMS-LaTeX、Typst 0.11+、Beamer 幻灯片、Quarto Markdown 或 1-Click Overleaf 云端工程
            </p>
          </div>
        </div>

        {/* Global Action Toolbar */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenOverleaf}
            title="在 Overleaf 云端一键打开并实时编译 PDF"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900/90 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all shadow-md shadow-emerald-950/40 cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Overleaf 一键云编译</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-purple-400" />}
            <span>{copied ? '已复制源码' : '复制全文'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-purple-500/20 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>下载 {exportResult.fileExtension.toUpperCase()} 文件</span>
          </button>
        </div>
      </div>

      {/* Format Selector Tabs */}
      <div className="flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800 overflow-x-auto">
        <button
          onClick={() => setFormat('latex_paper')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            format === 'latex_paper'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>AMS-LaTeX 论文 (.tex)</span>
        </button>

        <button
          onClick={() => setFormat('typst')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            format === 'typst'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/25'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>现代 Typst 0.11+ (.typ)</span>
        </button>

        <button
          onClick={() => setFormat('beamer')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            format === 'beamer'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Beamer 演示幻灯片 (.tex)</span>
        </button>

        <button
          onClick={() => setFormat('quarto_md')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            format === 'quarto_md'
              ? 'bg-blue-500 text-white shadow-md shadow-blue-500/25'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Quarto / Academic Markdown (.qmd)</span>
        </button>

        <button
          onClick={() => setFormat('tikz_cd')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            format === 'tikz_cd'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/25'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <GitBranch className="w-3.5 h-3.5" />
          <span>TikZ 拓扑图谱 (.tex)</span>
        </button>

        <button
          onClick={() => setFormat('proof_tree')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            format === 'proof_tree'
              ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>自然演绎证明树 (.tex)</span>
        </button>
      </div>

      {/* Main Control Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
        {/* Column 1: Target Node Selection & Search (4 cols) */}
        <div className="md:col-span-4 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-slate-300 font-semibold flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-purple-400" />
              <span>目标导出定理 / 命题：</span>
            </label>
            <span className="text-[10px] text-slate-500 font-mono">共 {initialMathNodes.length} 命题</span>
          </div>

          <div className="space-y-1.5">
            <input
              type="text"
              placeholder="搜索定理、MSC 编号或关键字..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-700/80 text-slate-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-purple-500"
            />
            <select
              value={selectedNodeId}
              onChange={(e) => setSelectedNodeId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-lg p-2 outline-none font-medium cursor-pointer"
            >
              {filteredNodes.map((n) => (
                <option key={n.id} value={n.id}>
                  [{n.nodeType}] {n.titleZh} ({n.titleEn}) · MSC {n.mscCode}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Target Info Badge */}
          {targetNode && (
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-purple-300">{targetNode.titleZh}</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] bg-slate-800 text-slate-400 font-mono">
                  {targetNode.nodeType}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono truncate">{targetNode.statementLatex}</p>
            </div>
          )}
        </div>

        {/* Column 2: Document Metadata Customization (4 cols) */}
        <div className="md:col-span-4 space-y-2">
          <label className="text-slate-300 font-semibold flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-indigo-400" />
            <span>文档与作者元数据：</span>
          </label>

          <div className="space-y-2">
            <div>
              <span className="text-[10px] text-slate-400 block mb-1">自定义文档主标题 (可选)：</span>
              <input
                type="text"
                value={documentTitle}
                onChange={(e) => setDocumentTitle(e.target.value)}
                placeholder={`默认: ${targetNode?.titleZh} 结构化推导讲义`}
                className="w-full bg-slate-950 border border-slate-700/80 text-slate-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-purple-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-slate-400 block mb-1">作者署名：</span>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 text-slate-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block mb-1">研究机构 / 平台：</span>
                <input
                  type="text"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 text-slate-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-purple-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: Compiler Modular Toggles (4 cols) */}
        <div className="md:col-span-4 space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <label className="text-slate-300 font-semibold flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>编译模块开关配置：</span>
            </label>
            <button
              onClick={() => setShowPrereqList(!showPrereqList)}
              className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Eye className="w-3 h-3" />
              <span>{showPrereqList ? '收起依赖链' : `查看前置链 (${orderedPrereqNodes.length})`}</span>
            </button>
          </div>

          <div className="space-y-1.5">
            <label className="flex items-center justify-between p-1.5 rounded-lg bg-slate-950/70 border border-slate-800/80 text-slate-300 cursor-pointer hover:border-slate-700">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={includePrereqs}
                  onChange={(e) => setIncludePrereqs(e.target.checked)}
                  className="accent-purple-500 rounded"
                />
                <span className="font-medium">递归 DAG 前置依赖闭包</span>
              </div>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-purple-500/20 text-purple-300 font-mono">
                {orderedPrereqNodes.length} 个节点
              </span>
            </label>

            <div className="grid grid-cols-2 gap-1.5">
              <label className="flex items-center gap-1.5 p-1.5 rounded-lg bg-slate-950/70 border border-slate-800/80 text-slate-300 cursor-pointer hover:border-slate-700">
                <input
                  type="checkbox"
                  checked={includeProofs}
                  onChange={(e) => setIncludeProofs(e.target.checked)}
                  className="accent-purple-500 rounded"
                />
                <span>严谨数学证明</span>
              </label>

              <label className="flex items-center gap-1.5 p-1.5 rounded-lg bg-slate-950/70 border border-slate-800/80 text-slate-300 cursor-pointer hover:border-slate-700">
                <input
                  type="checkbox"
                  checked={includeIntuition}
                  onChange={(e) => setIncludeIntuition(e.target.checked)}
                  className="accent-purple-500 rounded"
                />
                <span>几何直觉动机</span>
              </label>

              <label className="flex items-center gap-1.5 p-1.5 rounded-lg bg-slate-950/70 border border-slate-800/80 text-slate-300 cursor-pointer hover:border-slate-700">
                <input
                  type="checkbox"
                  checked={includeLean}
                  onChange={(e) => setIncludeLean(e.target.checked)}
                  className="accent-purple-500 rounded"
                />
                <span>Lean 4 形式化</span>
              </label>

              <label className="flex items-center gap-1.5 p-1.5 rounded-lg bg-slate-950/70 border border-slate-800/80 text-slate-300 cursor-pointer hover:border-slate-700">
                <input
                  type="checkbox"
                  checked={includeTikz}
                  onChange={(e) => setIncludeTikz(e.target.checked)}
                  className="accent-purple-500 rounded"
                />
                <span>TikZ 拓扑/交换图</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Prerequisite Hierarchy Chain Drawer (Collapsible) */}
      {showPrereqList && (
        <div className="p-4 rounded-xl bg-slate-900/80 border border-purple-500/30 space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-purple-400" />
              <span>拓扑偏序前置推导序列 (Topological Prerequisite Hierarchy)</span>
            </h4>
            <span className="text-[10px] text-slate-400">
              从最基础公理/定义自底向上推导至目标定理
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {orderedPrereqNodes.map((n, i) => {
              const isTarget = n.id === targetNode.id;
              return (
                <div
                  key={n.id}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border ${
                    isTarget
                      ? 'bg-purple-500/20 text-purple-200 border-purple-500/50 shadow-md shadow-purple-500/10'
                      : 'bg-slate-950/80 text-slate-300 border-slate-800'
                  }`}
                >
                  <span className="text-[10px] font-mono text-slate-500">{i + 1}.</span>
                  <span className="px-1 py-0.2 rounded text-[9px] font-mono bg-slate-900 text-slate-400">
                    {n.nodeType}
                  </span>
                  <span>{n.titleZh}</span>
                  {isTarget && <span className="text-purple-400 font-bold">★ 目标</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Code Preview & Document Statistics */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-3 font-mono text-slate-400">
            <span className="flex items-center gap-1 text-slate-300">
              <FileCode className="w-3.5 h-3.5 text-purple-400" />
              <strong className="text-slate-100">{exportResult.suggestedFilename}</strong>
            </span>
            <span>·</span>
            <span>{exportResult.lineCount} 行代码</span>
            <span>·</span>
            <span>{(exportResult.byteSize / 1024).toFixed(2)} KB</span>
            <span>·</span>
            <span className="text-cyan-400 font-semibold">{exportResult.prerequisiteCount} 个关联命题</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '已复制' : '复制全文'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-500/20 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>下载源码</span>
            </button>
          </div>
        </div>

        {/* Code Viewport with Syntax Aesthetic */}
        <div className="relative group">
          <pre className="w-full h-96 bg-slate-950 border border-slate-800 rounded-xl p-4 overflow-auto text-xs text-slate-300 font-mono leading-relaxed select-all scrollbar-thin scrollbar-thumb-slate-800">
            {exportResult.content}
          </pre>
        </div>
      </div>
    </div>
  );
}
