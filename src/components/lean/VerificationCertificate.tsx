'use client';

import React, { useState } from 'react';
import { LeanVerification } from '@/types/math';
import { useLanguage } from '@/context/LanguageContext';
import { ShieldCheck, Award, Download, CheckCircle2, Lock, Cpu, Sparkles } from 'lucide-react';

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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <div>
            <span className="font-bold text-emerald-300">
              {isZh ? '演示条目：未运行真实 Lean 4 内核' : 'Demo entry: the real Lean 4 kernel was not run'}
            </span>
            <p className="text-[11px] text-slate-400">
              {isZh
                ? 'AST 校验哈希为种子数据中保存的占位字段：'
                : 'The AST verification hash is a placeholder field stored in the seed data: '}
              <span className="font-mono text-cyan-300">{verificationData.astHash}</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowCert(!showCert)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
        >
          <Award className="w-3.5 h-3.5" />
          <span>{showCert ? (isZh ? '收起演示条目' : 'Hide demo details') : isZh ? '查看演示条目详情' : 'View demo entry details'}</span>
        </button>
      </div>

      {/* Expandable Certificate Card */}
      {showCert && (
        <div className="p-8 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-emerald-500/50 shadow-2xl relative overflow-hidden text-center space-y-6 animate-in zoom-in-95">
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
                {isZh ? 'MATHUNIVERSE DEMO ENTRY (演示条目)' : 'MATHUNIVERSE DEMO ENTRY'}
              </span>
            </div>
            <span className="text-[11px] font-mono text-amber-300 flex items-center gap-1">
              <Lock className="w-3 h-3" /> {isZh ? 'DEMO ENTRY (未形式化校验)' : 'DEMO ENTRY (not formally verified)'}
            </span>
          </div>

          <div className="space-y-2">
            <span className="text-[11px] uppercase tracking-widest text-amber-400 font-mono font-bold">
              {isZh ? '演示条目 - 实际未运行 Lean 4 内核' : 'Demo entry — the Lean 4 kernel was not actually run'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100">{isZh ? theoremTitleZh : theoremTitleEn}</h2>
            <p className="text-xs text-slate-400 font-mono">
              {theoremTitleEn} • MSC {mscCode}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto text-xs text-left font-mono">
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">{isZh ? 'Lean 4 声明' : 'Lean 4 statement'}</span>
              <span className="text-emerald-300 font-bold">{verificationData.theoremName}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">{isZh ? '编译内核环境' : 'Kernel environment'}</span>
              <span className="text-amber-300">{isZh ? '未加载 (Demo Build)' : 'Not loaded (Demo Build)'}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">{isZh ? '声明使用的公理' : 'Axioms used'}</span>
              <span className="text-purple-300">{verificationData.axiomsUsed.join(', ') || (isZh ? '(无)' : '(none)')}</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 max-w-xl mx-auto leading-relaxed">
            {isZh
              ? '⚠️ 本条目为演示数据。仅展示了 Lean 4 代码与声明的公理，未在浏览器中实际加载 Lean 4 内核进行形式化校验。\n如需获得真正的形式化保证，请在本地使用 Lean 4 + Mathlib 自行构建并验证。'
              : '⚠️ This entry is demo data. Only the Lean 4 code and the axioms used are shown; the Lean 4 kernel was not actually loaded in the browser for formal verification.\nFor a real formalization guarantee, build and verify it yourself locally with Lean 4 + Mathlib.'}
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-500">
            <span>Proof Hash: {verificationData.astHash}</span>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1 text-slate-300 hover:text-emerald-300 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> {isZh ? '打印 / 保存证明证书' : 'Print / save proof certificate'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
