import React from 'react';
import Link from 'next/link';
import { Sparkles, GitPullRequest, ShieldCheck, Box, BookOpen, Layers, ExternalLink, Code2, Globe, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/95 py-12 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Brand & Mission */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-slate-950 font-bold text-base shadow-lg shadow-cyan-500/20">
              ∑
            </div>
            <div>
              <span className="font-extrabold text-slate-100 text-sm tracking-wide">MathUniverse</span>
              <span className="text-[10px] text-cyan-400 font-mono block -mt-0.5">数学宇宙开源知识库</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            致力于构建人类全学科数学公理、定义、定理的统一 DAG 知识图谱与 Lean 4 形式化验证协作平台。
          </p>
          <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-500">
            <span className="flex items-center gap-1 text-cyan-400 font-mono">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% 形式化可信
            </span>
          </div>
        </div>

        {/* Core Matrix Links */}
        <div>
          <h5 className="font-bold text-slate-200 mb-3 text-xs tracking-wider uppercase text-cyan-400">
            核心功能探索
          </h5>
          <ul className="space-y-2 text-[11px]">
            <li>
              <Link href="/graph" className="hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>DAG 知识星空拓扑图谱</span>
              </Link>
            </li>
            <li>
              <Link href="/graph" className="hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                <Box className="w-3 h-3 text-indigo-400" />
                <span>3D 微分流形与曲面工作室</span>
              </Link>
            </li>
            <li>
              <Link href="/lean" className="hover:text-emerald-300 transition-colors flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Lean 4 零算力形式化实验室</span>
              </Link>
            </li>
            <li>
              <Link href="/editor" className="hover:text-purple-300 transition-colors flex items-center gap-1.5">
                <BookOpen className="w-3 h-3 text-purple-400" />
                <span>Notion 级块式数学编辑器</span>
              </Link>
            </li>
            <li>
              <Link href="/community" className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                <GitPullRequest className="w-3 h-3 text-amber-400" />
                <span>Git 风格同行评审与 PR</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Direct Theorem & Branch Links */}
        <div>
          <h5 className="font-bold text-slate-200 mb-3 text-xs tracking-wider uppercase text-purple-400">
            经典数学命题直达
          </h5>
          <ul className="space-y-2 text-[11px]">
            <li>
              <Link href="/node/eulers-identity" className="hover:text-slate-200 transition-colors">
                欧拉恒等式 (Euler&apos;s Identity)
              </Link>
            </li>
            <li>
              <Link href="/node/cauchy-schwarz-inequality" className="hover:text-slate-200 transition-colors">
                柯西-施瓦茨不等式 (Cauchy-Schwarz)
              </Link>
            </li>
            <li>
              <Link href="/node/pythagorean-theorem" className="hover:text-slate-200 transition-colors">
                勾股定理 (Pythagorean Theorem)
              </Link>
            </li>
            <li>
              <Link href="/node/infinitude-of-primes" className="hover:text-slate-200 transition-colors">
                欧几里得素数无限性定理
              </Link>
            </li>
            <li>
              <Link href="/node/cantors-theorem" className="hover:text-slate-200 transition-colors">
                康托尔对角线定理 (Cantor)
              </Link>
            </li>
            <li>
              <Link href="/node/am-gm-inequality" className="hover:text-slate-200 transition-colors">
                算术-几何均值不等式 (AM-GM)
              </Link>
            </li>
          </ul>
        </div>

        {/* Academic Protocols & External Resources */}
        <div>
          <h5 className="font-bold text-slate-200 mb-3 text-xs tracking-wider uppercase text-emerald-400">
            开源文献与外部学术
          </h5>
          <ul className="space-y-2 text-[11px]">
            <li>
              <a
                href="https://leanprover.github.io/theorem_proving_in_lean4/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-200 transition-colors flex items-center gap-1"
              >
                <span>Theorem Proving in Lean 4</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
            </li>
            <li>
              <a
                href="https://leanprover-community.github.io/mathlib4_docs/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-200 transition-colors flex items-center gap-1"
              >
                <span>Mathlib 4 Official Docs</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
            </li>
            <li>
              <a
                href="https://mathscinet.ams.org/mathscinet/msc/msc2020.html"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-200 transition-colors flex items-center gap-1"
              >
                <span>AMS MSC 2020 分类标准</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
            </li>
            <li>
              <a
                href="https://arxiv.org/archive/math"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-200 transition-colors flex items-center gap-1"
              >
                <span>arXiv Mathematics Preprint</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
            </li>
          </ul>

          <div className="pt-4 text-[10px] font-mono text-slate-500 border-t border-slate-800/80 mt-3">
            Open Source under MIT License • CC-BY-SA 4.0
          </div>
        </div>
      </div>
    </footer>
  );
}
