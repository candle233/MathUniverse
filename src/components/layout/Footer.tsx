'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, GitPullRequest, ShieldCheck, Box, BookOpen, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { t, isZh } = useLanguage();

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
              <span className="text-[10px] text-cyan-400 font-mono block -mt-0.5">{t('footer.brandSubtitle')}</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            {t('footer.mission')}
          </p>
          <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-500">
            <span className="flex items-center gap-1 text-cyan-400 font-mono">
              <ShieldCheck className="w-3.5 h-3.5" /> {t('footer.trustBadge')}
            </span>
          </div>
        </div>

        {/* Core Matrix Links */}
        <div>
          <h5 className="font-bold text-slate-200 mb-3 text-xs tracking-wider uppercase text-cyan-400">
            {t('footer.coreExplore')}
          </h5>
          <ul className="space-y-2 text-[11px]">
            <li>
              <Link href="/graph" className="hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>{isZh ? 'DAG 知识星空拓扑图谱' : 'DAG Knowledge Cosmos'}</span>
              </Link>
            </li>
            <li>
              <Link href="/graph" className="hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                <Box className="w-3 h-3 text-indigo-400" />
                <span>{isZh ? '3D 微分流形与曲面工作室' : '3D Differential Manifolds'}</span>
              </Link>
            </li>
            <li>
              <Link href="/lean" className="hover:text-emerald-300 transition-colors flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>{isZh ? 'Lean 4 零算力形式化实验室' : 'Lean 4 Formal Verification Lab'}</span>
              </Link>
            </li>
            <li>
              <Link href="/editor" className="hover:text-purple-300 transition-colors flex items-center gap-1.5">
                <BookOpen className="w-3 h-3 text-purple-400" />
                <span>{isZh ? 'Notion 级块式数学编辑器' : 'Atomic Block Mathematics Editor'}</span>
              </Link>
            </li>
            <li>
              <Link href="/community" className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                <GitPullRequest className="w-3 h-3 text-amber-400" />
                <span>{isZh ? 'Git 风格同行评审与 PR' : 'Peer Review & Proposals Desk'}</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Direct Theorem & Branch Links */}
        <div>
          <h5 className="font-bold text-slate-200 mb-3 text-xs tracking-wider uppercase text-purple-400">
            {t('footer.classicTheorems')}
          </h5>
          <ul className="space-y-2 text-[11px]">
            <li>
              <Link href="/node/eulers-identity" className="hover:text-slate-200 transition-colors">
                {isZh ? "欧拉恒等式 (Euler's Identity)" : "Euler's Identity"}
              </Link>
            </li>
            <li>
              <Link href="/node/cauchy-schwarz-inequality" className="hover:text-slate-200 transition-colors">
                {isZh ? '柯西-施瓦茨不等式 (Cauchy-Schwarz)' : 'Cauchy-Schwarz Inequality'}
              </Link>
            </li>
            <li>
              <Link href="/node/pythagorean-theorem" className="hover:text-slate-200 transition-colors">
                {isZh ? '勾股定理 (Pythagorean Theorem)' : 'Pythagorean Theorem'}
              </Link>
            </li>
            <li>
              <Link href="/node/infinitude-of-primes" className="hover:text-slate-200 transition-colors">
                {isZh ? '欧几里得素数无限性定理' : "Euclid's Infinitude of Primes"}
              </Link>
            </li>
            <li>
              <Link href="/node/cantors-theorem" className="hover:text-slate-200 transition-colors">
                {isZh ? "康托尔定理 (Cantor's Theorem)" : "Cantor's Theorem"}
              </Link>
            </li>
            <li>
              <Link href="/node/am-gm-inequality" className="hover:text-slate-200 transition-colors">
                {isZh ? '算术-几何均值不等式 (AM-GM)' : 'AM-GM Inequality'}
              </Link>
            </li>
          </ul>
        </div>

        {/* Academic Protocols & External Resources */}
        <div>
          <h5 className="font-bold text-slate-200 mb-3 text-xs tracking-wider uppercase text-emerald-400">
            {t('footer.academicResources')}
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
                <span>{isZh ? 'AMS MSC 2020 分类标准' : 'AMS MSC 2020 Classification'}</span>
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
            {t('footer.copyright')}
          </div>
        </div>
      </div>
    </footer>
  );
}
