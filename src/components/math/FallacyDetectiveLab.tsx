'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { InlineLaTeX } from '@/components/math/LaTeXRenderer';
import {
  getFallacyCases,
  getFallacyCategories,
  accuseProofStep,
  getCaseStats,
  loadFallacyLabProgress,
  saveFallacyLabProgress,
  resetFallacyLabProgress,
} from '@/lib/fallacyEngine';
import type {
  FallacyType,
  FallacyCase,
  AccusationResult,
  FallacyLabProgress,
  FallacyStep,
} from '@/types/fallacy';
import {
  ShieldAlert,
  Search,
  CheckCircle2,
  XCircle,
  Award,
  AlertTriangle,
  Copy,
  Check,
  Filter,
  RefreshCw,
  BookOpen,
  FileCode,
  Bug,
  Scale,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

// ==========================================
// EN display mappings for fallacy data that lives in src/lib/fallacyEngine.ts
// (the engine/data file stays untouched — mappings are keyed by ids).
// ==========================================

// '中文 (English)' → 'English'; falls back to the input when no parenthesized part exists.
const enHalf = (s: string) => {
  const m = s.match(/\(([^()]*)\)\s*$/);
  return m ? m[1] : s;
};

const CATEGORY_PRINCIPLE_EN: Record<FallacyType, string> = {
  FLAW_ZERO_DIV:
    'In a field, 0 has no multiplicative inverse (0⁻¹ is undefined), so factors containing a zero divisor cannot be cancelled on both sides of an equation.',
  FLAW_DIVERGENT:
    'Series associativity and rearrangement theorems hold only under absolute convergence (Riemann rearrangement theorem); a divergent series has no real sum.',
  FLAW_BRANCH_CUT:
    'The radical identity √(z₁)√(z₂) = √(z₁z₂) holds only when the sum of arguments does not cross the negative real axis branch cut (-∞, 0].',
  FLAW_GEOM_SEMICONT:
    'C⁰ uniform convergence of curve point sets does not imply C¹ convergence of tangents; the arc-length functional is only lower semicontinuous: L(γ) ≤ liminf L(γₙ).',
  FLAW_INT_CONSTANT:
    'An indefinite integral represents an equivalence class of antiderivatives modulo an arbitrary constant C; cancelling identical indefinite integrals loses an arbitrary nonzero constant difference.',
  FLAW_LEIBNIZ_RULE:
    'Swapping differentiation and integration requires the Lebesgue dominated convergence condition; crossing a singularity or lacking a uniformly integrable bound makes the derivative jump.',
};

const CASE_STORY_EN: Record<string, string> = {
  'case-zero-div':
    'A beginning algebra student submitted a short derivation claiming to "rigorously prove 1 = 2". The whole process superficially applies standard distributivity and the difference of squares — find the fatal algebraic flaw hidden in the factoring step.',
  'case-divergent-series':
    'Using elementary algebraic manipulation and bracketing, the infinite divergent geometric series with ratio q = 2 yields an absurd negative sum S = -1. Point out the fatal step where the convergence domain fails.',
  'case-branch-cut':
    'Continuous square-root algebraic manipulations of the imaginary unit i seem to rigorously prove -1 = 1. Identify the illegal step involving complex multi-valued branches and principal-value branch cuts.',
  'case-staircase-pi':
    'Circumscribe a unit-diameter circle with a square and repeatedly halve the staircase notches to approach the circle. The staircase length stays strictly 4, so the limit claims π = 4. Find the analytic flaw in the measure-theoretic limit.',
  'case-int-constant':
    'Integrating 1/x by parts, the very same indefinite integral ∫ (1/x) dx appears on both sides. Cancelling it yields the shocking 0 = 1. Point out the conceptual confusion about indefinite integrals.',
  'case-leibniz-singularity':
    "Applying Feynman's trick to differentiate a parameter-dependent integral F(t) under the integral sign while crossing the singular origin t → 0⁺ — and ignoring the non-uniform convergence of the kernel — produces a sharp clash between the limit of the derivatives and the derivative of the limit.",
};

const CASE_CRITIQUE_EN: Record<string, string> = {
  'case-zero-div':
    'In any field ⟨𝔽, +, ·⟩, the multiplicative cancellation law x · z = y · z ⟹ x = y holds only when z ≠ 0. When z = 0, the map f(t) = t · 0 collapses the entire field onto the single point {0} — information is irreversibly lost, which allows any absurd proposition to be forged.',
  'case-divergent-series':
    'The geometric series ∑_{n=0}^∞ qⁿ converges to 1/(1-q) only when |q| < 1. Under analytic continuation or p-adic metrics, 1/(1-2) = -1 has a specific formal meaning, but in the standard topology of the reals a divergent series obeys neither associativity nor rearrangement.',
  'case-branch-cut':
    'The complex power z^(1/2) is a two-sheeted covering of the Riemann surface. On a single-valued holomorphic branch (usually the principal cut ℂ \\ (-∞, 0]), √(z₁)√(z₂) = √(z₁z₂) holds iff -π < Arg(z₁) + Arg(z₂) ≤ π — a condition broken by negative real numbers.',
  'case-staircase-pi':
    "In geometric measure theory, the length functional L(γ) is lower semicontinuous under uniform convergence: L(γ) ≤ liminf L(γₙ). Equality requires the tangent sequence γₙ'(t) to converge strongly to γ'(t) in L¹. The staircase tangents oscillate between (1,0) and (0,1) — the derivatives never converge.",
  'case-int-constant':
    'The kernel of the differential operator d/dx is the space of constants ℝ. The indefinite integral ∫ · dx is really the inverse of differentiation modulo constants, i.e. C^∞(I) / ℝ. In the quotient space, equalities hold as cosets; cancelling identical symbols must keep the constant modulus.',
  'case-leibniz-singularity':
    'The Leibniz rule in real analysis requires the differentiated kernel to be uniformly continuous on compact intervals or dominated by a Lebesgue-integrable function. When a singularity sits at an integration endpoint and is not uniformly integrable, the non-commutativity of d/dt and ∫ is governed by the boundary singular spectrum measure.',
};

// Keyed `${caseId}:${stepIndex}`
const STEP_PLAIN_EN: Record<string, string> = {
  'case-zero-div:1': 'Let a and b be two nonzero, exactly equal real numbers',
  'case-zero-div:2': 'Multiply both sides by a, then subtract b² from both sides',
  'case-zero-div:3': 'Factor the left side with the difference of squares; factor out b on the right',
  'case-zero-div:4': 'Cancel the common factor (a - b) on both sides',
  'case-zero-div:5': 'Substitute a = b and divide both sides by the nonzero b to get 2 = 1',
  'case-divergent-series:1': 'Let the value of the infinite geometric series be a definite finite real number S',
  'case-divergent-series:2': 'Factor out the common ratio 2 starting from the second term',
  'case-divergent-series:3': 'Substitute the infinite series inside the brackets by S itself',
  'case-divergent-series:4': 'Solve the linear equation to obtain S = -1',
  'case-branch-cut:1': 'Start from the basic algebraic definition of the imaginary unit, i² = -1',
  'case-branch-cut:2': 'Rewrite i as the radical form √(-1)',
  'case-branch-cut:3': 'Apply the radical product formula √(x)·√(y) = √(x·y) directly',
  'case-branch-cut:4': 'Compute the arithmetic square root of the positive real number to get 1',
  'case-branch-cut:5': 'Chain the ends together to conclude the absurd -1 = 1',
  'case-staircase-pi:1': 'The circumscribed square has total horizontal length 2 and vertical length 2, so the initial perimeter C₀ = 4',
  'case-staircase-pi:2': 'However many times you refine it, the horizontal segments sum to 2 and the vertical to 2 — the perimeter stays 4',
  'case-staircase-pi:3': 'The staircase curve converges uniformly, point by point, to the circle in the plane',
  'case-staircase-pi:4': 'Assert that the length of the limit curve equals the limit of the lengths of the approximating curves',
  'case-int-constant:1': 'Consider the indefinite integral of the integrand 1/x',
  'case-int-constant:2': 'Choose the substitution variables u and v for integration by parts',
  'case-int-constant:3': 'Apply the integration-by-parts formula ∫ u dv = uv - ∫ v du rigorously',
  'case-int-constant:4': 'Simplify the first term (1/x)·x = 1 and the integral to + ∫ (1/x) dx',
  'case-int-constant:5': 'Move the integral on the right to the left and subtract to conclude 0 = 1',
  'case-leibniz-singularity:1': 'Define the parameter-dependent integral F(t) with positive parameter t',
  'case-leibniz-singularity:2': 'For t > 0 apply the Leibniz integral rule, moving the derivative inside the integral',
  'case-leibniz-singularity:3': 'Compute the partial derivative with the chain rule',
  'case-leibniz-singularity:4': "Integrate to the explicit expression; as t → 0⁺, F'(t) → -∞",
  'case-leibniz-singularity:5': 'Claim one may swap the limit and integral at t → 0⁺ and force the integral value to be 0',
};

const FLAW_REASON_EN: Record<string, string> = {
  'case-zero-div:4':
    'Fatal flaw: since the premise sets a = b, (a - b) is exactly 0! In any field, zero has no multiplicative inverse (no dividing by zero). Dividing both sides by (a - b) amounts to multiplying by 0⁻¹ — an undefined, illegal operation.',
  'case-divergent-series:3':
    'Fatal flaw: the substitution S = 1 + 2S presumes the limit of partial sums lim_{n→∞} S_n exists (i.e., the series converges)! With ratio q = 2 > 1, the partial sums S_n = 2ⁿ⁺¹ - 1 diverge to +∞, so treating them as a finite real in a linear substitution is mathematically meaningless.',
  'case-branch-cut:3':
    'Fatal flaw: the identity √(a)√(b) = √(ab) holds only for nonnegative real a, b! On the complex plane ℂ, the square root is a two-valued function w² = z. With the principal branch (cut along (-∞, 0]), the sum of arguments Arg(-1) + Arg(-1) = 2π crosses the cut, producing a π phase jump.',
  'case-staircase-pi:4':
    "Fatal flaw: arc length is the integral of the tangent norm L(γ) = ∫ ||γ'(t)|| dt! C⁰ uniform convergence of point sets never implies C¹ convergence of tangents (γ_n' ↛ γ'). The staircase tangents are always either horizontal or vertical — the tangential error never vanishes. In C⁰ the arc-length functional is only lower semicontinuous: L(γ) ≤ liminf L(γ_n), so 4 is merely an upper bound on the true perimeter π!",
  'case-int-constant:5':
    'Fatal flaw: the indefinite integral ∫ f(x)dx is not a single number or function but the family { F(x) + C | C ∈ ℝ }! Hence ∫ f(x)dx - ∫ f(x)dx is not 0 but an arbitrary constant C. The equation ∫ (1/x)dx = 1 + ∫ (1/x)dx only says both sides differ by the constant C = 1 — perfectly consistent, no contradiction.',
  'case-leibniz-singularity:5':
    "Fatal flaw: swapping limit and integral, lim_{t→0} ∫ f(x,t)dx = ∫ lim_{t→0} f(x,t)dx, strictly requires the Lebesgue dominated convergence theorem (DCT) — there must exist a t-independent nonnegative integrable g(x) with |f(x,t)| ≤ g(x). As t → 0⁺ the kernel -x/(t²+x²) blows up near the origin: not only is g(x) = 1/x non-integrable on [0,1], forcing the value 0 violates measure-theoretic integration outright!",
};

// EN renderings for zh strings returned by the (untouched) engine.
const VERDICT_EN: Record<string, string> = {
  '案宗未找到': 'Case file not found',
  '步骤未找到': 'Step not found',
  '侦探破案成功！精准锁定逻辑死穴': 'Case cracked! You pinpointed the logical dead spot',
  '步骤指认正确，但漏洞病因诊断有误': 'Right step — but the flaw diagnosis is wrong',
  '误判！该步骤在数学上完全合法': 'Misjudged! This step is mathematically valid',
};

const FEEDBACK_EN: Record<string, string> = {
  '无效案宗 ID，无法进行漏洞审判。': 'Invalid case ID — the flaw trial cannot proceed.',
  '指定的推导步骤不存在。': 'The specified derivation step does not exist.',
  '您正确指认了发生错误的步骤，但选择的漏洞类型不符。请仔细复核该步骤违反的具体数学公理。':
    'You correctly identified the flawed step, but the selected flaw type does not match. Recheck which precise mathematical law the step violates.',
  '经形式化符号检查，该推导步骤符合代数/微积分规则。真正的逻辑漏洞隐藏在其他步骤中，请继续勘验。':
    'Formal symbolic checking confirms this step obeys the algebra/calculus rules. The real logical flaw hides in another step — keep investigating.',
};

export default function FallacyDetectiveLab() {
  const { isZh } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState<FallacyLabProgress>(loadFallacyLabProgress);
  const [selectedCaseIdx, setSelectedCaseIdx] = useState(0);
  const [selectedStepIdx, setSelectedStepIdx] = useState<number | null>(null);
  const [selectedFlawCategory, setSelectedFlawCategory] = useState<FallacyType | null>(null);
  const [accusationResult, setAccusationResult] = useState<AccusationResult | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'ALL' | FallacyType>('ALL');
  const [copiedLean, setCopiedLean] = useState(false);

  useEffect(() => {
    setMounted(true);
    const loaded = loadFallacyLabProgress();
    setProgress(loaded);
  }, []);

  const allCases = useMemo(() => getFallacyCases(), []);
  const allCategories = useMemo(() => getFallacyCategories(), []);

  const filteredCases = useMemo(() => {
    if (activeCategoryFilter === 'ALL') return allCases;
    return allCases.filter((c) => c.flawType === activeCategoryFilter);
  }, [allCases, activeCategoryFilter]);

  const currentCase: FallacyCase = useMemo(() => {
    return filteredCases[selectedCaseIdx] || filteredCases[0] || allCases[0];
  }, [filteredCases, selectedCaseIdx, allCases]);

  const stats = useMemo(() => {
    return getCaseStats(progress.solvedCaseIds);
  }, [progress.solvedCaseIds]);

  const isCurrentCaseSolved = useMemo(() => {
    return progress.solvedCaseIds.includes(currentCase.id);
  }, [progress.solvedCaseIds, currentCase.id]);

  const updateProgress = (newProg: FallacyLabProgress) => {
    setProgress(newProg);
    saveFallacyLabProgress(newProg);
  };

  const handleAccuse = () => {
    if (selectedStepIdx === null) {
      alert(
        isZh
          ? '请先在右侧推导步骤列表中点击您怀疑存在漏洞的步骤！'
          : 'First click the step you suspect is flawed in the derivation list!'
      );
      return;
    }

    const result = accuseProofStep(currentCase.id, selectedStepIdx, selectedFlawCategory || undefined);
    setAccusationResult(result);

    if (result.isFlawedStep) {
      const alreadySolved = progress.solvedCaseIds.includes(currentCase.id);
      const newSolved = alreadySolved ? progress.solvedCaseIds : [...progress.solvedCaseIds, currentCase.id];
      const newScore = progress.detectiveScore + result.pointsEarned;
      const newStats = getCaseStats(newSolved);

      const updatedProg: FallacyLabProgress = {
        solvedCaseIds: newSolved,
        attemptedCount: progress.attemptedCount + 1,
        detectiveScore: newScore,
        badgeTitle: newStats.detectiveTitle,
        lastUpdated: new Date().toISOString(),
      };
      updateProgress(updatedProg);
    } else {
      updateProgress({
        ...progress,
        attemptedCount: progress.attemptedCount + 1,
        lastUpdated: new Date().toISOString(),
      });
    }
  };

  const handleCopyLean = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedLean(true);
    setTimeout(() => setCopiedLean(false), 2000);
  };

  const handleReset = () => {
    if (confirm(isZh ? '确定要重置所有逻辑侦探案件进度吗？' : 'Reset all fallacy detective case progress?')) {
      const reset = resetFallacyLabProgress();
      updateProgress(reset);
      setSelectedStepIdx(null);
      setSelectedFlawCategory(null);
      setAccusationResult(null);
    }
  };

  if (!mounted) {
    return (
      <div className="p-8 text-center text-slate-400 font-mono text-xs animate-pulse">
        {isZh ? '正在加载数学悖论与伪推导档案库...' : 'Loading the mathematical paradox & pseudo-proof dossier...'}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-6 shadow-2xl">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500/30 to-red-600/10 border border-rose-500/40 flex items-center justify-center text-rose-400 shadow-lg shadow-rose-500/10">
            <ShieldAlert className="w-5 h-5" />
          </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-100 text-sm md:text-base">
                  {isZh
                    ? '数学伪证明侦探与漏洞鉴别实验室 (Mathematical Fallacy Detective Lab)'
                    : 'Mathematical Fallacy Detective Lab'}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  {isZh ? '6 大经典悖论' : '6 Classic Paradoxes'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {isZh
                  ? '深度勘验从“隐藏除以零”、“发散级数重排”、“割线跨越”到“弧长下半连续性”与“积分号下求导奇异性”的推导死穴'
                  : 'Deep-dive the derivation dead spots: hidden division by zero, divergent series rearrangement, branch-cut crossing, arc-length lower semicontinuity, and singularities under the integral sign'}
              </p>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2.5">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-1.5">
            <Scale className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-bold text-purple-300">{isZh ? stats.detectiveTitle : enHalf(stats.detectiveTitle)}</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-mono font-bold text-amber-300">
              {isZh
                ? `破案: ${stats.solvedCount} / ${stats.totalCases} (${stats.solvedPercent}%)`
                : `Solved: ${stats.solvedCount} / ${stats.totalCases} (${stats.solvedPercent}%)`}
            </span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-1.5 font-mono text-xs text-slate-300">
            <span>{isZh ? '积分: ' : 'Score: '}</span>
            <strong className="text-rose-400 font-bold">{progress.detectiveScore} PTS</strong>
          </div>

          <button
            onClick={handleReset}
            title={isZh ? '重置侦探案卷' : 'Reset detective case files'}
            className="p-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 shrink-0">
          <Filter className="w-3.5 h-3.5" /> {isZh ? '分类筛选：' : 'Filter:'}
        </span>
        <button
          onClick={() => {
            setActiveCategoryFilter('ALL');
            setSelectedCaseIdx(0);
            setAccusationResult(null);
            setSelectedStepIdx(null);
          }}
          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeCategoryFilter === 'ALL'
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50'
              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          {isZh ? '全部 6 宗案件' : 'All 6 cases'}
        </button>
        {allCategories.map((cat) => (
          <button
            key={cat.type}
            onClick={() => {
              setActiveCategoryFilter(cat.type);
              setSelectedCaseIdx(0);
              setAccusationResult(null);
              setSelectedStepIdx(null);
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeCategoryFilter === cat.type
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {isZh ? cat.nameZh : cat.nameEn}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {filteredCases.map((c, idx) => {
          const isSelected = selectedCaseIdx === idx;
          const isSolved = progress.solvedCaseIds.includes(c.id);

          return (
            <button
              key={c.id}
              onClick={() => {
                setSelectedCaseIdx(idx);
                setSelectedStepIdx(null);
                setSelectedFlawCategory(null);
                setAccusationResult(null);
              }}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-rose-500/20 border-rose-500/70 shadow-lg shadow-rose-500/10 text-rose-300 ring-1 ring-rose-500/40'
                  : isSolved
                  ? 'bg-emerald-950/20 border-emerald-500/40 hover:border-emerald-500/70 text-slate-200'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono font-bold">{c.caseCode}</span>
                {isSolved ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                )}
              </div>
              <span className="text-xs font-bold line-clamp-1">{isZh ? c.titleZh : c.titleEn}</span>
              <div className="flex items-center justify-between mt-1 text-[10px] font-mono text-slate-500">
                <span>{'★'.repeat(c.difficulty)}</span>
                <span className="text-rose-400 font-bold">+{100 * c.difficulty}P</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-rose-400">{currentCase.caseCode}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                  {isZh ? '难度等级: ' : 'Difficulty: '}
                  {'★'.repeat(currentCase.difficulty)}
                </span>
              </div>
              {isCurrentCaseSolved && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/40">
                  {isZh ? '已告破' : 'Solved'}
                </span>
              )}
            </div>

            <div>
              <h4 className="text-base font-bold text-slate-100">{isZh ? currentCase.titleZh : currentCase.titleEn}</h4>
              {isZh && <p className="text-xs text-slate-400 font-mono mt-0.5">{currentCase.titleEn}</p>}
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {isZh ? currentCase.storyContextZh : CASE_STORY_EN[currentCase.id] || currentCase.storyContextZh}
            </p>

            <div className="p-4 rounded-xl bg-slate-950 border border-rose-500/40 text-center space-y-1 shadow-inner">
              <span className="text-[10px] uppercase font-mono text-slate-500 font-bold block">
                {isZh ? '声称证得的荒谬伪结论 (Alleged Spurious Claim):' : 'Alleged Spurious Claim:'}
              </span>
              <div className="text-rose-400 font-mono font-extrabold text-xl py-1">
                <InlineLaTeX formula={currentCase.allegedConclusionLatex} />
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-mono text-purple-400 font-bold block">
                {isZh ? '被破坏的核心公理/定理 (Violated Principle):' : 'Violated Principle:'}
              </span>
              <p className="text-xs font-bold text-slate-200">
                {isZh ? currentCase.formalTheoremNameZh : currentCase.formalTheoremNameEn || currentCase.formalTheoremNameZh}
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 block">
                {isZh ? '漏洞病因初诊 (Diagnose Flaw Category - 可选加分项):' : 'Diagnose Flaw Category (optional bonus):'}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {allCategories.map((cat) => {
                  const isCatSelected = selectedFlawCategory === cat.type;
                  return (
                    <button
                      key={cat.type}
                      onClick={() => setSelectedFlawCategory(cat.type)}
                      className={`p-2 rounded-lg border text-left text-[11px] font-medium transition-all cursor-pointer ${
                        isCatSelected
                          ? 'bg-purple-500/20 border-purple-500 text-purple-200'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-400'
                      }`}
                    >
                      <div className="font-bold line-clamp-1">{isZh ? cat.nameZh : cat.nameEn}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-rose-400" />
                <span className="text-xs font-bold text-slate-200">
                  {isZh ? '推导勘验流程 (Inspect Proof Steps & Lodge Accusation)' : 'Inspect Proof Steps & Lodge Accusation'}
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                {isZh ? `共 ${currentCase.steps.length} 步推导` : `${currentCase.steps.length} steps total`}
              </span>
            </div>

            <p className="text-xs text-slate-400">
              {isZh ? (
                <>
                  请点击您认为发生<strong className="text-rose-400">【非法逻辑跃迁/代数越界】</strong>的致命步骤，随后点击发起指控：
                </>
              ) : (
                <>
                  Click the fatal step where you believe an{' '}
                  <strong className="text-rose-400">illegal logical jump / out-of-domain manipulation</strong> occurs, then lodge your accusation:
                </>
              )}
            </p>

            <div className="space-y-2.5">
              {currentCase.steps.map((step: FallacyStep) => {
                const isSelected = selectedStepIdx === step.stepIndex;

                return (
                  <button
                    key={step.stepIndex}
                    onClick={() => {
                      setSelectedStepIdx(step.stepIndex);
                      setAccusationResult(null);
                    }}
                    className={`w-full p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-rose-500/20 border-rose-500 text-rose-200 ring-1 ring-rose-500/40 shadow-sm'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center font-mono text-xs font-bold text-slate-400 shrink-0">
                        {step.stepIndex}
                      </span>
                      <div className="font-mono text-xs text-cyan-200 overflow-x-auto">
                        <InlineLaTeX formula={step.latex} />
                      </div>
                    </div>

                    <span className="text-[11px] text-slate-400 text-right max-w-xs">
                      {isZh ? step.plainZh : STEP_PLAIN_EN[`${currentCase.id}:${step.stepIndex}`] || step.plainZh}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Accuse Action Button */}
            <div className="pt-2">
              <button
                onClick={handleAccuse}
                disabled={selectedStepIdx === null}
                className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  selectedStepIdx !== null
                    ? 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-slate-100 shadow-lg shadow-rose-600/20'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <Bug className="w-4 h-4" />
                <span>
                  {isZh
                    ? `发起形式化漏洞指控 (Accuse Step 0${selectedStepIdx || 1})`
                    : `Lodge Formal Flaw Accusation (Accuse Step 0${selectedStepIdx || 1})`}
                </span>
              </button>
            </div>

            {/* Verdict Revelation Card */}
            {accusationResult && (
              <div
                className={`p-4 rounded-xl border space-y-3 text-xs ${
                  accusationResult.isFlawedStep
                    ? accusationResult.flawCategoryMatches
                      ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200'
                      : 'bg-amber-950/40 border-amber-500/60 text-amber-200'
                    : 'bg-rose-950/40 border-rose-500/60 text-rose-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    {accusationResult.isFlawedStep ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        <span>{isZh ? accusationResult.verdictTitle : VERDICT_EN[accusationResult.verdictTitle] || accusationResult.verdictTitle}</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-rose-400" />
                        <span>{isZh ? accusationResult.verdictTitle : VERDICT_EN[accusationResult.verdictTitle] || accusationResult.verdictTitle}</span>
                      </>
                    )}
                  </div>
                  {accusationResult.pointsEarned > 0 && (
                    <span className="px-2 py-0.5 rounded font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px]">
                      +{accusationResult.pointsEarned} PTS
                    </span>
                  )}
                </div>

                <p className="text-slate-200 leading-relaxed font-medium">
                  {isZh
                    ? accusationResult.feedbackZh
                    : accusationResult.isFlawedStep && accusationResult.flawCategoryMatches
                    ? FLAW_REASON_EN[`${accusationResult.caseId}:${accusationResult.stepIndex}`] || 'You found the core flaw of this proof!'
                    : FEEDBACK_EN[accusationResult.feedbackZh] || accusationResult.feedbackZh}
                </p>

                {/* Mathematical Formula Refutation */}
                {accusationResult.formalRefutationLatex && (
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[10px] uppercase font-mono text-cyan-400 font-bold block">
                      {isZh ? '形式化反驳式 (Formal Refutation Equation):' : 'Formal Refutation Equation:'}
                    </span>
                    <div className="font-mono text-xs text-cyan-200">
                      <InlineLaTeX formula={accusationResult.formalRefutationLatex} />
                    </div>
                  </div>
                )}

                {/* Formal Critique */}
                {accusationResult.formalCritiqueZh && (
                  <div className="space-y-1 pt-1 border-t border-slate-800/80">
                    <span className="text-[10px] uppercase font-mono text-purple-300 font-bold block">
                      {isZh ? '数学原理与测度分析 (Analysis & Measure Theory Critique):' : 'Analysis & Measure Theory Critique:'}
                    </span>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {isZh
                        ? accusationResult.formalCritiqueZh
                        : CASE_CRITIQUE_EN[accusationResult.caseId] || accusationResult.formalCritiqueZh}
                    </p>
                  </div>
                )}

                {/* Lean 4 Disproof Snippet */}
                {accusationResult.leanDisproofSnippet && (
                  <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-mono text-amber-300 font-bold flex items-center gap-1">
                        <FileCode className="w-3.5 h-3.5" /> {isZh ? 'Lean 4 形式化证明/驳倒代码片段 (Lean 4 Disproof):' : 'Lean 4 Disproof Snippet:'}
                      </span>
                      <button
                        onClick={() => handleCopyLean(accusationResult.leanDisproofSnippet!)}
                        className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-mono flex items-center gap-1 cursor-pointer transition-all"
                      >
                        {copiedLean ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedLean ? (isZh ? '已复制' : 'Copied') : isZh ? '复制 Lean 4' : 'Copy Lean 4'}</span>
                      </button>
                    </div>

                    <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto leading-relaxed">
                      {accusationResult.leanDisproofSnippet}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom: 6 Fallacy Categories Codex Reference */}
      <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-purple-400" />
          <h4 className="text-xs font-bold text-slate-200">
            {isZh ? '常见伪证明 6 大逻辑漏洞分类法总览 (Fallacy Taxonomy Codex)' : 'Fallacy Taxonomy Codex — Six Logic Flaw Categories'}
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
          {allCategories.map((cat) => (
            <div key={cat.type} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">{isZh ? cat.nameZh : cat.nameEn}</span>
                {isZh && <span className="text-[10px] font-mono text-slate-500">{cat.nameEn}</span>}
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {isZh ? cat.principleViolatedZh : CATEGORY_PRINCIPLE_EN[cat.type] || cat.principleViolatedZh}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
