import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Locale } from '@/i18n/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Global KaTeX macros across MathUniverse
export const globalLatexMacros: Record<string, string> = {
  '\\R': '\\mathbb{R}',
  '\\N': '\\mathbb{N}',
  '\\Z': '\\mathbb{Z}',
  '\\Q': '\\mathbb{Q}',
  '\\C': '\\mathbb{C}',
  '\\P': '\\mathbb{P}',
  '\\F': '\\mathbb{F}',
  '\\eps': '\\varepsilon',
  '\\norm': '\\left\\|#1\\right\\|',
  '\\abs': '\\left|#1\\right|',
  '\\inner': '\\left\\langle #1, #2 \\right\\rangle',
  '\\set': '\\left\\{ #1 \\right\\}',
  '\\d': '\\mathrm{d}',
  '\\diff': '\\frac{\\mathrm{d}#1}{\\mathrm{d}#2}',
  '\\pdiff': '\\frac{\\partial #1}{\\partial #2}',
  '\\ker': '\\operatorname{ker}',
  '\\im': '\\operatorname{im}',
  '\\dim': '\\operatorname{dim}',
  '\\Span': '\\operatorname{span}',
  '\\Aut': '\\operatorname{Aut}',
  '\\Hom': '\\operatorname{Hom}',
  '\\Gal': '\\operatorname{Gal}',
  '\\id': '\\operatorname{id}',
  '\\GL': '\\operatorname{GL}',
  '\\SL': '\\operatorname{SL}',
  '\\mod': '\\pmod{#1}',
};

// Formats NodeType to human-readable label and color
export function getNodeTypeMeta(type: string, locale: Locale = 'zh') {
  const isEn = locale === 'en';
  switch (type) {
    case 'AXIOM':
      return { label: isEn ? 'Axiom' : '公理', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40', dotColor: '#a855f7' };
    case 'DEFINITION':
      return { label: isEn ? 'Definition' : '定义', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40', dotColor: '#3b82f6' };
    case 'LEMMA':
      return { label: isEn ? 'Lemma' : '引理', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40', dotColor: '#06b6d4' };
    case 'THEOREM':
      return { label: isEn ? 'Theorem' : '定理', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', dotColor: '#10b981' };
    case 'COROLLARY':
      return { label: isEn ? 'Corollary' : '推论', color: 'bg-teal-500/20 text-teal-300 border-teal-500/40', dotColor: '#14b8a6' };
    case 'PROPERTY':
      return { label: isEn ? 'Property' : '性质', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40', dotColor: '#6366f1' };
    case 'EXAMPLE':
      return { label: isEn ? 'Example' : '例子', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40', dotColor: '#f59e0b' };
    case 'COUNTER_EXAMPLE':
      return { label: isEn ? 'Counterexample' : '反例', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40', dotColor: '#f43f5e' };
    case 'CONJECTURE':
      return { label: isEn ? 'Conjecture' : '猜想', color: 'bg-pink-500/20 text-pink-300 border-pink-500/40', dotColor: '#ec4899' };
    default:
      return { label: type, color: 'bg-slate-500/20 text-slate-300 border-slate-500/40', dotColor: '#94a3b8' };
  }
}

// Formats VerificationStatus
export function getVerificationMeta(status: string, locale: Locale = 'zh') {
  const isEn = locale === 'en';
  switch (status) {
    case 'FORMALLY_VERIFIED':
      return {
        badge: isEn ? '🟢 Formally Verified (Lean 4)' : '🟢 已形式化验证 (Lean 4)',
        short: isEn ? 'Lean 4 Verified' : 'Lean 4 验证',
        className: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 shadow-emerald-500/20 shadow-sm',
        icon: 'ShieldCheck',
      };
    case 'PEER_REVIEWED':
      return {
        badge: isEn ? '🟡 Peer Reviewed' : '🟡 人工同行评审通过',
        short: isEn ? 'Peer Reviewed' : '同行评审',
        className: 'bg-amber-950/80 text-amber-300 border-amber-500/50',
        icon: 'UserCheck',
      };
    case 'VERIFICATION_FAILED':
      return {
        badge: isEn ? '🔴 Verification Failed' : '🔴 形式化验证未通过',
        short: isEn ? 'Verification Failed' : '验证失败',
        className: 'bg-rose-950/80 text-rose-300 border-rose-500/50',
        icon: 'AlertTriangle',
      };
    default:
      return {
        badge: isEn ? '⚪ Community Draft / Pending Review' : '⚪ 社区草稿 / 待评审',
        short: isEn ? 'Pending Review' : '待评审',
        className: 'bg-slate-800/80 text-slate-400 border-slate-700',
        icon: 'Clock',
      };
  }
}
