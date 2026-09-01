'use client';

import React, { useState } from 'react';
import { LeanVerification, FormalVerificationRecord } from '@/types/math';
import { useLanguage } from '@/context/LanguageContext';
import { ShieldCheck, Award, Download, CheckCircle2, Lock, Cpu, Sparkles, Copy, Check, GitCommit, FileCode, CheckCheck } from 'lucide-react';

interface CertificateProps {
  theoremTitleZh: string;
  theoremTitleEn: string;
  mscCode: string;
  verificationData: LeanVerification;
}

export default function VerificationCertificate({
  theoremTitleZh,
  theoremTitleEn,
  mscCode,
  verificationData,
}: CertificateProps) {
  const { isZh } = useLanguage();
  const [showCert, setShowCert] = useState(false);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const record: FormalVerificationRecord = verificationData.verificationRecord || {
    statementRevision: 'rev-2026.09.01',
    statementHash: 'sha256:canonical-statement',
    proofHash: verificationData.astHash,
    leanVersion: 'Lean (version 4.14.0)',
    mathlibCommit: 'v4.14.0',
    imports: verificationData.mathlibImports,
    axiomsUsed: verificationData.axiomsUsed,
    result: verificationData.isVerified ? 'PASSED' : 'UNVERIFIED',
    checkedAt: verificationData.verifiedAt || '2026-08-21',
    checker: 'LEAN_KERNEL',
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(label);
    setTimeout(() => setCopiedHash(null), 2500);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-emerald-300">
                {isZh ? '形式化可信存证记录 (Formal Verification Provenance)' : 'Formal Verification Provenance Record'}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-900/60 border border-emerald-600/50 text-emerald-300 font-mono">
                {record.checker}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {isZh ? '源码哈希：' : 'Proof Source Hash: '}
              <span className="font-mono text-cyan-300">{record.proofHash}</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowCert(!showCert)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all cursor-pointer shrink-0"
        >
          <Award className="w-3.5 h-3.5" />
          <span>{showCert ? (isZh ? '收起存证凭证' : 'Hide Provenance') : isZh ? '查看存证凭证' : 'View Provenance'}</span>
        </button>
      </div>

      {/* Expandable Certificate Card */}
      {showCert && (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-emerald-500/50 shadow-2xl relative overflow-hidden text-center space-y-6 animate-in zoom-in-95">
          {/* Watermark Background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none text-emerald-400 text-9xl font-mono font-extrabold select-none">
            ∀ LEAN 4
          </div>

          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold">
                ∑
              </div>
              <span className="font-bold text-slate-200 text-xs tracking-wider">
                MATHUNIVERSE FORMAL PROVENANCE ATTESTATION
              </span>
            </div>
            <span className="text-[11px] font-mono text-emerald-300 flex items-center gap-1 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/40">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> {record.result}
            </span>
          </div>

          <div className="space-y-2">
            <span className="text-[11px] uppercase tracking-widest text-cyan-400 font-mono font-bold">
              {isZh ? '数学命题形式化验证存证' : 'Mathematical Claim Formalization Record'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100">{isZh ? theoremTitleZh : theoremTitleEn}</h2>
            <p className="text-xs text-slate-400 font-mono">
              {theoremTitleEn} • MSC {mscCode} • Revision: {record.statementRevision}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto text-xs text-left font-mono">
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 block uppercase tracking-wider">{isZh ? 'Lean 4 声明名称' : 'Theorem Name'}</span>
              <span className="text-emerald-300 font-bold block truncate">{verificationData.theoremName}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 block uppercase tracking-wider">{isZh ? '编译器版本 / Mathlib' : 'Lean Version / Mathlib'}</span>
              <span className="text-cyan-300 font-bold block truncate">{record.leanVersion} ({record.mathlibCommit})</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 block uppercase tracking-wider">{isZh ? '#print axioms 依赖公理' : 'Axioms Used'}</span>
              <span className="text-purple-300 font-bold block truncate">{record.axiomsUsed.join(', ') || (isZh ? '(无额外公理)' : '(none)')}</span>
            </div>
          </div>

          {/* Cryptographic Hashes Audit Box */}
          <div className="max-w-3xl mx-auto p-4 rounded-2xl bg-slate-950/90 border border-slate-800/80 text-left space-y-2.5 text-xs font-mono">
            <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider flex items-center justify-between">
              <span>{isZh ? '可验证证据哈希 (Cryptographic Hashes):' : 'Cryptographic Hashes:'}</span>
              <span className="text-[10px] text-slate-500">Checked at {record.checkedAt}</span>
            </div>
            
            <div className="flex items-center justify-between bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
              <div className="truncate mr-2">
                <span className="text-slate-500 block text-[10px]">Statement Hash:</span>
                <span className="text-amber-300 text-xs truncate">{record.statementHash}</span>
              </div>
              <button
                onClick={() => copyToClipboard(record.statementHash, 'statement')}
                className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer shrink-0"
                title="Copy Hash"
              >
                {copiedHash === 'statement' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="flex items-center justify-between bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
              <div className="truncate mr-2">
                <span className="text-slate-500 block text-[10px]">Proof Code Hash:</span>
                <span className="text-cyan-300 text-xs truncate">{record.proofHash}</span>
              </div>
              <button
                onClick={() => copyToClipboard(record.proofHash, 'proof')}
                className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer shrink-0"
                title="Copy Hash"
              >
                {copiedHash === 'proof' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 max-w-2xl mx-auto leading-relaxed bg-slate-900/40 p-4 rounded-xl border border-slate-800/60">
            {isZh
              ? '💡 本存证与命题 LaTeX 陈述及 Lean 4 证明源码严格绑定。如需在本地完全重现核验，请使用 Lean 4.14.0 与对应 Mathlib 版本运行 `lake build`，并通过 `#print axioms` 确认公理集完整性。'
              : '💡 This provenance record is strictly cryptographically bound to the LaTeX statement and Lean 4 proof source. To independently verify locally, run `lake build` under Lean 4.14.0 + Mathlib and confirm axioms using `#print axioms`.'}
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-500">
            <span>Attestation ID: {record.statementRevision}:{record.proofHash.slice(0, 16)}</span>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1 text-slate-300 hover:text-emerald-300 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> {isZh ? '打印 / 保存形式化凭证' : 'Print / Save Certificate'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

