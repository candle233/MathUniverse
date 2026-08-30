'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { InlineLaTeX } from '@/components/math/LaTeXRenderer';
import {
  zfcAxiomRegistry,
  campaignEpochs,
  calculateUserLevel,
  loadProgressFromStorage,
  saveProgressToStorage,
  unlockAxiom,
  unlockEpoch,
  canUnlockEpoch,
  canSynthesizeEntity,
  synthesizeEntity,
  verifyMilestoneStep,
  completeEpochChallenge,
  resetProgress,
} from '@/lib/campaignEngine';
import type {
  ZfcAxiomId,
  UserCampaignProgress,
  CampaignEpoch,
  ConstructedEntity,
} from '@/types/campaign';
import {
  Trophy,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Sparkles,
  Lock,
  Unlock,
  Zap,
  BookOpen,
  Award,
  Flame,
  Layers,
  RefreshCw,
  Check,
  FlaskConical,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

// ==========================================
// EN display mappings for campaign data that lives in src/lib/campaignEngine.ts
// (data file stays untouched — mappings are keyed by epoch/entity/step ids).
// ==========================================

// '中文 (English)' → 'English'; falls back to the input when no parenthesized part exists.
const enHalf = (s: string) => {
  const m = s.match(/\(([^()]*)\)\s*$/);
  return m ? m[1] : s;
};

const EPOCH_ERA_DESC_EN: Record<number, string> = {
  1: 'Starting from the emptiest origin of the mathematical universe, use the ZFC axioms of extensionality, empty set, pairing, and union to rigorously establish the uniqueness of the empty set and construct the Kuratowski ordered pair and the Cartesian product.',
  2: 'Use the axiom of infinity to introduce inductive sets, build the natural numbers ω = ℕ through the elegant recursion 0 = ∅ and n+1 = n ∪ {n}, eliminate set self-membership via the axiom of regularity, and establish mathematical induction.',
  3: 'Construct the integer ring ℤ and the rational field ℚ as quotient equivalence classes, introduce groups, rings, fields, and homomorphism theorems, and lay the grand foundations of modern abstract algebra.',
  4: 'Activate the power-set axiom to generate the uncountable cardinal 2^ℵ₀, fill the pinprick gaps of the rationals with Dedekind cuts, and build the complete real field ℝ with the supremum property and Cauchy analysis.',
  5: 'Break free of concrete metrics and build topology on the abstract structure of open sets and neighborhoods, unlocking the Hausdorff T₂ separation axiom, Heine–Borel compactness, smooth manifolds, and tangent bundles.',
  6: "Master the axiom of choice and Zorn's lemma, explore operator spectra on infinite-dimensional Hilbert spaces, climb the categorical architecture of adjoint functors, and finally converge into the Lean 4 formal-verification kernel.",
};

const ENTITY_DESC_EN: Record<string, string> = {
  'entity-empty-set': 'The unique base set containing no elements, with cardinality 0 — the foundation of all mathematical construction.',
  'entity-singleton-empty': 'The singleton formed by wrapping the empty set in a set, with cardinality 1 — the prototype of the von Neumann natural number 1.',
  'entity-ordered-pair': 'An ordered two-tuple built entirely from unordered sets, laying the foundation for binary relations and maps.',
  'entity-cartesian-product': 'The set of all ordered pairs drawn from two sets, unlocking coordinate geometry and binary algebraic operations.',
  'entity-von-neumann-0': 'The zero element of the von Neumann ordinal system, defined as the empty set.',
  'entity-von-neumann-1': 'The singleton ordinal containing only 0, with cardinality 1.',
  'entity-von-neumann-2': 'The set containing the predecessor ordinals 0 and 1, with cardinality 2.',
  'entity-natural-numbers-omega': 'The smallest inductive set — the set of all finite ordinals and the first countably infinite cardinal ℵ₀ in mathematics.',
  'entity-peano-successor': 'The injective map generating the chain of natural numbers, satisfying the five Peano postulates.',
  'entity-integers-z': 'A complete additive abelian group and integral domain built from formal-difference equivalence classes of natural-number pairs.',
  'entity-rationals-q': 'The field of fractions of the integer ring — the smallest characteristic-0 field in which every nonzero element has a multiplicative inverse.',
  'entity-group': 'The core carrier of algebraic symmetry: associativity, an identity element, and inverses.',
  'entity-field': 'An algebraic system where addition and multiplication are both abelian groups linked by distributivity — full arithmetic.',
  'entity-continuum-power-set': "The uncountable continuum cardinal, strictly greater than countable infinity by Cantor's theorem.",
  'entity-dedekind-cut': 'A partition of the rationals into a lower set A and an upper set B — the definition of the reals that seamlessly fills the irrational gaps.',
  'entity-reals-r': 'The complete Archimedean ordered field with the least-upper-bound property — the stage for limits and continuity in calculus.',
  'entity-supremum-property': 'Every nonempty real subset bounded above has a least upper bound — equivalent to the monotone convergence theorem and Cauchy completeness.',
  'entity-topological-space': 'A family τ of open sets closed under arbitrary unions and finite intersections — the broadest stage for limits and continuous maps.',
  'entity-hausdorff-t2': 'A well-behaved space where any two points can be separated by disjoint open neighborhoods, guaranteeing unique limits.',
  'entity-compactness': 'The core topological property that collapses infinite checks into finite ones — the modern form of the Heine–Borel theorem.',
  'entity-smooth-manifold': 'A curved space locally homeomorphic to ℝⁿ with infinitely differentiable transition maps — the basis of modern general relativity and gauge theory.',
  'entity-zorns-lemma': "A powerful existence tool equivalent to the axiom of choice and the well-ordering theorem — the engine behind algebraic bases and the Hahn–Banach theorem.",
  'entity-hilbert-space': 'A complete infinite-dimensional inner product space — the rigorous carrier of quantum wavefunctions and Fourier analysis.',
  'entity-category-theory': 'The structure of structures — a higher-dimensional universe abstracting algebra, geometry, and logic into objects and morphisms.',
  'entity-adjunction': '"Adjoint functors arise everywhere" (Saunders Mac Lane) — the crown theorem unifying free objects, tensor products, and universal properties.',
  'entity-lean4-kernel': 'Uses dependent type theory to turn mathematical proofs into fully decidable term-reduction checks, eliminating every ambiguity and gap in human derivations.',
};

// Keyed `${epochNumber}:${stepNumber}`
const STEP_PROMPT_EN: Record<string, string> = {
  '1:1': 'Prove the uniqueness of the empty set — if two empty sets A and B exist, which axiom asserts A = B?',
  '1:2': 'How do you construct an asymmetric ordered pair (a, b) from unordered sets?',
  '1:3': 'Verify the ordered-pair equality criterion: what does {{a}, {a, b}} = {{c}, {c, d}} imply?',
  '2:1': 'What kind of set does the axiom of infinity directly guarantee to exist?',
  '2:2': 'How is the smallest natural-number ordinal set ω defined?',
  '2:3': 'Why is the successor S(n) never equal to 0 for any natural number n?',
  '3:1': 'What is the necessary and sufficient condition defining the integer equivalence relation (a, b) ~ (c, d)?',
  '3:2': 'What is needed to prove that [(a, b)] + [(c, d)] := [(a+c, b+d)] is independent of the chosen representatives?',
  '3:3': 'In the rational field ℚ, why does the element [(0, 1)] have no multiplicative inverse?',
  '4:1': 'Let S be a nonempty collection of real numbers (Dedekind lower cuts) bounded above, and set M = ⋃_{A ∈ S} A. Is M nonempty and not all of ℚ?',
  '4:2': 'Show that M is downward closed with no maximum. If p ∈ M and q < p, why is q ∈ M?',
  '4:3': 'Conclusion: what is M with respect to S?',
  '5:1': 'The Heine–Borel theorem asserts: in Euclidean space ℝⁿ, what is the necessary and sufficient condition for a subset K to be compact?',
  '5:2': 'Why must a continuous real-valued function on a compact space attain both a maximum and a minimum?',
  '5:3': 'What condition must the transition map between two overlapping charts (U_α, φ_α) and (U_β, φ_β) of a smooth atlas 𝒜 satisfy?',
  '6:1': 'In infinite-dimensional vector spaces, which equivalent form of the axiom of choice (AC) is the key to proving that every space has a Hamel basis?',
  '6:2': 'What is the natural-isomorphism expression for the adjoint functor pair F ⊣ G in category theory?',
  '6:3': 'What is the trinitarian essence of the Curry–Howard–Lambek correspondence?',
};

const STEP_EXPLANATION_EN: Record<string, string> = {
  '1:1': 'Since A and B have no elements, z ∈ A ↔ z ∈ B holds vacuously for every z; the axiom of extensionality immediately yields A = B, so the empty set is unique.',
  '1:2': 'The Kuratowski construction { {a}, {a, b} } uses the singleton subset to distinguish the first entry a from the second entry b.',
  '1:3': 'The intersection ⋂(a, b) = {a} gives a = c, and the union ⋃(a, b) = {a, b} then gives b = d.',
  '2:1': 'The axiom of infinity asserts the existence of an inductive set I that contains the empty set and is closed under succession.',
  '2:2': 'The intersection of all inductive subsets is still inductive, and it is the unique smallest inductive set ω contained in I.',
  '2:3': 'Since n ∈ S(n), the successor S(n) is necessarily nonempty; and because 0 = ∅, S(n) ≠ 0 — a Peano postulate holds.',
  '3:1': 'Subtraction is undefined in ℕ, so the purely additive cross form a + d = b + c is required for well-definedness.',
  '3:2': 'The additive cancellation law directly derives the invariance under representative replacement.',
  '3:3': 'Field axioms grant multiplicative inverses only to nonzero elements, and zero times anything is zero — the root of every division-by-zero fallacy.',
  '4:1': 'Since S is nonempty, M contains elements of members and is nonempty; since S is bounded above, elements beyond the bound belong to no A, so M ≠ ℚ.',
  '4:2': 'Each A₀ is a Dedekind cut and therefore downward closed, so q belongs to A₀ and hence to the union M.',
  '4:3': 'M is the smallest cut containing every A ∈ S — directly proving the Dedekind completeness of the real field.',
  '5:1': 'In finite-dimensional Euclidean space, compactness is equivalent to closed and bounded. In general topological spaces, compactness means every open cover has a finite subcover.',
  '5:2': 'Continuous maps preserve compactness, so the image f(K) is a closed bounded subset of ℝ whose supremum and infimum are attained (extreme value theorem).',
  '5:3': "The smooth-diffeomorphism property of chart transitions guarantees that calculus on manifolds (derivatives, tangent vectors, differential forms, Stokes' theorem) is well defined.",
  '6:1': "In the poset of linearly independent subsets ordered by inclusion, every chain has an upper bound given by its union; Zorn's lemma yields a maximal element — a Hamel basis for the whole space.",
  '6:2': 'The natural bijection of morphisms between the left functor F and the right functor G defines adjunction — category theory\'s grand unifying viewpoint.',
  '6:3': 'Propositions are types, proofs are program terms, and categories are semantics. When the Lean 4 kernel type-checks the term, the theorem earns eternal machine-verified certification.',
};

// EN renderings for zh feedback strings returned by the (untouched) engine.
const VERIFY_INCORRECT_EN: Record<string, string> = {
  '所选公理不适用于当前推导步骤，请仔细审阅公理前提条件。':
    "The selected axiom does not apply to this derivation step — recheck the axiom's preconditions.",
  '公理选取正确，但推导所得的目标公式不精确或逻辑跳步，请重新选择公式。':
    'The axiom is right, but the resulting formula is imprecise or skips a logical step — choose a different formula.',
  '步骤未找到。': 'Step not found.',
};

export default function ZfcCampaignQuest() {
  const { isZh } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState<UserCampaignProgress>(loadProgressFromStorage);
  const [selectedEpochIdx, setSelectedEpochIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<'CHALLENGE' | 'AXIOM_CODEX' | 'CRUCIBLE' | 'OVERVIEW'>('CHALLENGE');

  // Challenge step state
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [selectedAxiomId, setSelectedAxiomId] = useState<ZfcAxiomId | null>(null);
  const [selectedFormula, setSelectedFormula] = useState<string | null>(null);
  const [stepFeedback, setStepFeedback] = useState<{ isCorrect: boolean; explanation: string } | null>(null);
  const [celebration, setCelebration] = useState<{ title: string; titleEn: string; xp: number; badge: string; badgeEn: string } | null>(null);

  useEffect(() => {
    setMounted(true);
    const loaded = loadProgressFromStorage();
    setProgress(loaded);
  }, []);

  const currentEpoch: CampaignEpoch = useMemo(() => {
    return campaignEpochs[selectedEpochIdx] || campaignEpochs[0];
  }, [selectedEpochIdx]);

  const levelInfo = useMemo(() => {
    return calculateUserLevel(progress.totalXp);
  }, [progress.totalXp]);

  const isCurrentEpochCompleted = useMemo(() => {
    return progress.completedChallenges.includes(currentEpoch.milestoneChallenge.id);
  }, [progress.completedChallenges, currentEpoch.milestoneChallenge.id]);

  const currentChallenge = currentEpoch.milestoneChallenge;
  const currentStep = currentChallenge.inferenceSteps[currentStepIdx] || currentChallenge.inferenceSteps[0];

  const updateProgress = (newProg: UserCampaignProgress) => {
    setProgress(newProg);
    saveProgressToStorage(newProg);
  };

  const handleUnlockEpoch = (epoch: CampaignEpoch) => {
    const check = canUnlockEpoch(progress, epoch.epochNumber);
    if (!check.canUnlock) {
      alert(
        isZh
          ? `未满足解锁前提：缺少公理 [${check.missingAxioms.join(', ')}] 或实体 [${check.missingEntities.join(', ')}]`
          : `Unlock prerequisites not met: missing axioms [${check.missingAxioms.join(', ')}] or entities [${check.missingEntities.join(', ')}]`
      );
      return;
    }
    const updated = unlockEpoch(progress, epoch.epochNumber);
    updateProgress(updated);
  };

  const handleUnlockAxiom = (axiomId: ZfcAxiomId) => {
    const updated = unlockAxiom(progress, axiomId);
    updateProgress(updated);
  };

  const handleSynthesize = (entityId: string) => {
    const res = synthesizeEntity(progress, entityId);
    if (res.success) {
      updateProgress(res.progress);
    } else {
      alert(
        isZh
          ? res.message
          : `Cannot synthesize ${res.entity?.nameEn || 'this entity'} yet — unlock the required axioms and prerequisite entities first.`
      );
    }
  };

  const handleVerifyStep = () => {
    if (!selectedAxiomId || !selectedFormula) {
      alert(isZh ? '请先选择适用的 ZFC 公理并选中目标公式！' : 'Select an applicable ZFC axiom and a target formula first!');
      return;
    }

    const res = verifyMilestoneStep(
      currentEpoch.epochNumber,
      currentStep.stepNumber,
      selectedAxiomId,
      selectedFormula
    );
    const stepKey = `${currentEpoch.epochNumber}:${currentStep.stepNumber}`;
    setStepFeedback({
      isCorrect: res.isCorrect,
      explanation: isZh
        ? res.explanation
        : res.isCorrect
        ? STEP_EXPLANATION_EN[stepKey] || res.explanation
        : VERIFY_INCORRECT_EN[res.explanation] || res.explanation,
    });

    if (res.isCorrect) {
      if (!res.isLastStep) {
        setTimeout(() => {
          setCurrentStepIdx((prev) => prev + 1);
          setSelectedAxiomId(null);
          setSelectedFormula(null);
          setStepFeedback(null);
        }, 1200);
      } else {
        const completedRes = completeEpochChallenge(progress, currentEpoch.epochNumber);
        updateProgress(completedRes.progress);
        setCelebration({
          title: currentEpoch.titleZh,
          titleEn: currentEpoch.titleEn,
          xp: completedRes.rewardedXp,
          badge: completedRes.badgeAwarded,
          badgeEn: enHalf(completedRes.badgeAwarded),
        });
      }
    }
  };

  const handleReset = () => {
    if (confirm(isZh ? '确定要重置所有战役进度吗？这将清空已炼成实体与等级！' : 'Reset all campaign progress? This will clear synthesized entities and your level!')) {
      const reset = resetProgress();
      updateProgress(reset);
      setSelectedEpochIdx(0);
      setCurrentStepIdx(0);
      setCelebration(null);
      setStepFeedback(null);
    }
  };

  if (!mounted) {
    return (
      <div className="p-8 text-center text-slate-400 font-mono text-xs animate-pulse">
        {isZh ? '正在载入公理科技树世界模型...' : 'Loading the axiom tech-tree world model...'}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-6 shadow-2xl">
      {/* Header & User Level Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/30 to-amber-600/10 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-100 text-sm md:text-base">
                {isZh
                  ? '“从公理创世”数学科技树战役 (ZFC to Modern Math RPG Campaign)'
                  : 'ZFC to Modern Math RPG Campaign (Genesis from Axioms)'}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Epoch 0{selectedEpochIdx + 1} / 06
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {isZh
                ? '从 9 大 ZFC 集合公理出发，通过严谨形式化推导一步步点亮整个人类现代数学文明'
                : 'Start from the 9 ZFC set-theory axioms and light up all of modern mathematics through rigorous formal derivation'}
            </p>
          </div>
        </div>

        {/* User Stats Pill Bar */}
        <div className="flex items-center flex-wrap gap-2.5">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-mono font-bold text-amber-300">{progress.totalXp} XP</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-cyan-300">
              Lv.{levelInfo.level} · {isZh ? levelInfo.title : enHalf(levelInfo.title)}
            </span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-1.5">
            <FlaskConical className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono font-bold text-emerald-300">
              {progress.inventoryEntities.length} {isZh ? '实体炼成' : 'synthesized'}
            </span>
          </div>

          <button
            onClick={handleReset}
            title={isZh ? '重置进度' : 'Reset progress'}
            className="p-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Level XP Progress Bar */}
      <div className="space-y-1 bg-slate-900/50 p-2.5 rounded-xl border border-slate-800/60">
        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className="text-slate-400">
            {isZh ? '头衔进阶：' : 'Rank: '}
            <strong className="text-amber-300">{isZh ? levelInfo.title : enHalf(levelInfo.title)}</strong>
          </span>
          <span className="text-slate-400">
            {isZh
              ? `距离下一阶: ${progress.totalXp} / ${levelInfo.nextLevelXp} XP (${levelInfo.progressPercent}%)`
              : `Next rank: ${progress.totalXp} / ${levelInfo.nextLevelXp} XP (${levelInfo.progressPercent}%)`}
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 transition-all duration-500"
            style={{ width: `${levelInfo.progressPercent}%` }}
          />
        </div>
      </div>

      {/* 6 Epochs Navigation Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {campaignEpochs.map((epoch, idx) => {
          const isUnlocked = progress.unlockedEpochs.includes(epoch.epochNumber);
          const isCompleted = progress.completedChallenges.includes(epoch.milestoneChallenge.id);
          const isSelected = selectedEpochIdx === idx;
          const unlockCheck = canUnlockEpoch(progress, epoch.epochNumber);

          return (
            <button
              key={epoch.id}
              onClick={() => {
                if (isUnlocked) {
                  setSelectedEpochIdx(idx);
                  setCurrentStepIdx(0);
                  setSelectedAxiomId(null);
                  setSelectedFormula(null);
                  setStepFeedback(null);
                  setCelebration(null);
                } else if (unlockCheck.canUnlock) {
                  handleUnlockEpoch(epoch);
                  setSelectedEpochIdx(idx);
                } else {
                  alert(isZh ? '未满足解锁条件：缺少前置公理或实体' : 'Unlock conditions not met: prerequisite axioms or entities missing');
                }
              }}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-amber-500/20 border-amber-500/70 shadow-lg shadow-amber-500/10 text-amber-300 ring-1 ring-amber-500/40'
                  : isCompleted
                  ? 'bg-emerald-950/20 border-emerald-500/40 hover:border-emerald-500/70 text-slate-200'
                  : isUnlocked
                  ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300'
                  : unlockCheck.canUnlock
                  ? 'bg-cyan-950/30 border-cyan-500/40 hover:border-cyan-400 text-cyan-300 animate-pulse'
                  : 'bg-slate-950/40 border-slate-900 text-slate-600 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono font-bold">
                  {isZh ? `纪元 0${epoch.epochNumber}` : `Epoch 0${epoch.epochNumber}`}
                </span>
                {isCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : isUnlocked ? (
                  <Unlock className="w-3.5 h-3.5 text-amber-400" />
                ) : unlockCheck.canUnlock ? (
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-slate-600" />
                )}
              </div>
              <span className="text-xs font-bold line-clamp-1">
                {isZh
                  ? epoch.titleZh.split('：')[1] || epoch.titleZh
                  : epoch.titleEn.split(': ').slice(1).join(': ') || epoch.titleEn}
              </span>
              <span className="text-[10px] font-mono text-slate-500 mt-1">+{epoch.rewardXp} XP</span>
            </button>
          );
        })}
      </div>

      {/* Main Tab Controls */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('CHALLENGE')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'CHALLENGE'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 bg-slate-900/50'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isZh ? '推导战役 (Derivation Quest)' : 'Derivation Quest'}</span>
        </button>

        <button
          onClick={() => setActiveTab('AXIOM_CODEX')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'AXIOM_CODEX'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 bg-slate-900/50'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>
            {isZh
              ? `ZFC 公理圣殿 (${progress.unlockedAxioms.length}/9 已解锁)`
              : `ZFC Axiom Sanctum (${progress.unlockedAxioms.length}/9 unlocked)`}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('CRUCIBLE')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'CRUCIBLE'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 bg-slate-900/50'
          }`}
        >
          <FlaskConical className="w-3.5 h-3.5" />
          <span>{isZh ? '实体炼金室 (Constructive Alchemy)' : 'Constructive Alchemy'}</span>
        </button>

        <button
          onClick={() => setActiveTab('OVERVIEW')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'OVERVIEW'
              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/50 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 bg-slate-900/50'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{isZh ? '文明科技图谱 (Civilization Matrix)' : 'Civilization Matrix'}</span>
        </button>
      </div>

      {/* Tab 1: CHALLENGE */}
      {activeTab === 'CHALLENGE' && (
        <div className="space-y-6">
          {/* Epoch Banner */}
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
              <div>
                <span className="text-xs font-mono text-amber-400 font-bold tracking-wider">
                  EPOCH 0{currentEpoch.epochNumber}
                  {isZh ? ` · ${currentEpoch.titleEn}` : ''}
                </span>
                <h3 className="text-lg font-bold text-slate-100 mt-0.5">{isZh ? currentEpoch.titleZh : currentEpoch.titleEn}</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  {isZh
                    ? `战役奖励：+${currentEpoch.rewardXp} XP · 徽章【${currentEpoch.badgeTitle}】`
                    : `Campaign reward: +${currentEpoch.rewardXp} XP · Badge: ${enHalf(currentEpoch.badgeTitle)}`}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
              {isZh ? currentEpoch.eraDescriptionZh : EPOCH_ERA_DESC_EN[currentEpoch.epochNumber] || currentEpoch.eraDescriptionZh}
            </p>

            {/* Target Formula Callout */}
            <div className="mt-4 p-3.5 rounded-xl bg-slate-950 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-mono text-slate-400 font-bold block">
                  {isZh ? '纪元终极形式化目标公式 (Epoch Formal Goal Formula):' : 'Epoch Formal Goal Formula:'}
                </span>
                <div className="font-mono text-sm text-amber-200">
                  <InlineLaTeX formula={currentEpoch.milestoneChallenge.goalFormula} />
                </div>
              </div>
            </div>
          </div>

          {/* Celebration Box when completed */}
          {celebration && (
            <div className="p-5 rounded-xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-emerald-950/60 border border-emerald-500/60 text-center space-y-2.5 shadow-xl">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/50 mx-auto flex items-center justify-center text-emerald-400 shadow-lg">
                <Sparkles className="w-6 h-6 animate-spin" />
              </div>
              <h4 className="text-base font-bold text-emerald-300">
                🎉 {isZh ? `恭喜！成功攻克 ${celebration.title}！` : `Congratulations — ${celebration.titleEn} conquered!`}
              </h4>
              <p className="text-xs text-slate-300 max-w-lg mx-auto">
                {isZh ? (
                  <>
                    您已完成该纪元全部公理形式化推导，获得{' '}
                    <strong className="text-amber-300">+{celebration.xp} XP</strong> 并解锁文明成就徽章：【
                    <strong className="text-emerald-400">{celebration.badge}</strong>】！
                  </>
                ) : (
                  <>
                    You have completed every axiom derivation in this epoch, earning{' '}
                    <strong className="text-amber-300">+{celebration.xp} XP</strong> and unlocking the civilization badge:{' '}
                    <strong className="text-emerald-400">{celebration.badgeEn}</strong>!
                  </>
                )}
              </p>
            </div>
          )}

          {/* Derivation Step Sandbox */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Challenge Steps & Question */}
            <div className="lg:col-span-6 space-y-4">
              <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-xs font-mono font-bold">
                      Step 0{currentStep.stepNumber} / 0{currentChallenge.inferenceSteps.length}
                    </span>
                    <span className="text-xs font-bold text-slate-200">{isZh ? currentChallenge.titleZh : currentChallenge.titleEn}</span>
                  </div>

                  {/* Step progress dots */}
                  <div className="flex items-center gap-1.5">
                    {currentChallenge.inferenceSteps.map((st, i) => (
                      <div
                        key={i}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${
                          i < currentStepIdx
                            ? 'bg-emerald-400'
                            : i === currentStepIdx
                            ? 'bg-amber-400 ring-2 ring-amber-400/30'
                            : 'bg-slate-800'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[11px] text-slate-400 font-semibold block">
                    {isZh ? '推导目标设问 (Inference Prompt):' : 'Inference Prompt:'}
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed font-medium">
                    {isZh
                      ? currentStep.instructionZh
                      : STEP_PROMPT_EN[`${currentEpoch.epochNumber}:${currentStep.stepNumber}`] || currentStep.instructionZh}
                  </p>
                </div>

                {/* Step Axiom Picker */}
                <div className="space-y-2 pt-2">
                  <span className="text-[11px] text-slate-400 font-semibold block">
                    {isZh ? '1. 选择适用的 ZFC 基础公理 (Select Applicable Axiom):' : '1. Select the applicable ZFC axiom:'}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {currentEpoch.requiredAxiomIds.map((axId) => {
                      const axMeta = zfcAxiomRegistry[axId];
                      const isSelected = selectedAxiomId === axId;
                      return (
                        <button
                          key={axId}
                          onClick={() => setSelectedAxiomId(axId)}
                          className={`p-2.5 rounded-lg border text-left text-xs font-medium transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-amber-500/20 border-amber-500 text-amber-200'
                              : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                          }`}
                        >
                          <div className="font-bold line-clamp-1">{isZh ? axMeta?.nameZh || axId : axMeta?.nameEn || axId}</div>
                          {isZh && <div className="text-[10px] text-slate-500 font-mono mt-0.5">{axMeta?.nameEn}</div>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Step Formula Choice */}
                <div className="space-y-2 pt-2">
                  <span className="text-[11px] text-slate-400 font-semibold block">
                    {isZh ? '2. 挑选形式化推导结论公式 (Select Resulting Formula):' : '2. Select the resulting formula:'}
                  </span>
                  <div className="space-y-2">
                    {currentStep.formulaChoices.map((fChoice: string, idx: number) => {
                      const isSelected = selectedFormula === fChoice;
                      return (
                        <button
                          key={idx}
                          onClick={() => setSelectedFormula(fChoice)}
                          className={`w-full p-3 rounded-lg border text-left text-xs font-mono transition-all cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'bg-cyan-500/20 border-cyan-500 text-cyan-200'
                              : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                          }`}
                        >
                          <InlineLaTeX formula={fChoice} />
                          {isSelected && <Check className="w-4 h-4 text-cyan-400 shrink-0 ml-2" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-3">
                  <button
                    onClick={handleVerifyStep}
                    disabled={!selectedAxiomId || !selectedFormula}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      selectedAxiomId && selectedFormula
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>{isZh ? '提交形式化推理检验 (Verify Logical Deduction)' : 'Verify Logical Deduction'}</span>
                  </button>
                </div>

                {/* Feedback Box */}
                {stepFeedback && (
                  <div
                    className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                      stepFeedback.isCorrect
                        ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                        : 'bg-rose-950/40 border-rose-500/50 text-rose-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold mb-1">
                      {stepFeedback.isCorrect ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>{isZh ? '推导正确！符合形式化一阶公理系统' : 'Correct! Consistent with the formal first-order axiom system'}</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-rose-400" />
                          <span>{isZh ? '逻辑不自洽，请检查公理匹配或结论公式' : 'Inconsistent logic — check the axiom match or the resulting formula'}</span>
                        </>
                      )}
                    </div>
                    <p className="text-slate-300">{stepFeedback.explanation}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Constructible Entities in Current Epoch */}
            <div className="lg:col-span-6 space-y-4">
              <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <FlaskConical className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-slate-200">
                      {isZh ? '本纪元可炼成实体 (Constructible Entities)' : 'Constructible Entities in This Epoch'}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    {currentEpoch.constructibleEntities.length} {isZh ? '个数学概念' : 'mathematical concepts'}
                  </span>
                </div>

                <div className="space-y-3">
                  {currentEpoch.constructibleEntities.map((entity: ConstructedEntity) => {
                    const isSynthesized = progress.inventoryEntities.includes(entity.id);
                    const canSyn = canSynthesizeEntity(progress, entity.id);

                    return (
                      <div
                        key={entity.id}
                        className={`p-3.5 rounded-xl border transition-all ${
                          isSynthesized
                            ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-200'
                            : canSyn.canSynthesize
                            ? 'bg-slate-950 border-cyan-500/50 shadow-md shadow-cyan-500/5 text-slate-300'
                            : 'bg-slate-950/40 border-slate-800/60 text-slate-500'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-100">{isZh ? entity.nameZh : entity.nameEn}</span>
                              {isZh && <span className="text-[10px] font-mono text-slate-400">({entity.nameEn})</span>}
                              {isSynthesized && (
                                <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                                  {isZh ? '已炼成' : 'Synthesized'}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                              {isZh ? entity.descriptionZh : ENTITY_DESC_EN[entity.id] || entity.descriptionZh}
                            </p>
                          </div>

                          <div className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-xs font-mono font-bold text-amber-300 min-w-0 max-w-full overflow-x-auto">
                            <InlineLaTeX formula={entity.setNotation} />
                          </div>
                        </div>

                        {/* Formal Def */}
                        <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                          <div className="text-[10px] font-mono text-cyan-300 overflow-x-auto">
                            <InlineLaTeX formula={entity.formalDefinitionLatex} />
                          </div>

                          {!isSynthesized && (
                            <button
                              onClick={() => handleSynthesize(entity.id)}
                              disabled={!canSyn.canSynthesize}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold shrink-0 transition-all cursor-pointer ${
                                canSyn.canSynthesize
                                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-sm'
                                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                              }`}
                            >
                              {canSyn.canSynthesize ? (isZh ? '⚡ 炼成实体 (+40 XP)' : '⚡ Synthesize (+40 XP)') : isZh ? '未满足前置' : 'Prerequisites missing'}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: AXIOM_CODEX */}
      {activeTab === 'AXIOM_CODEX' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-slate-100">
                {isZh ? 'ZFC 公理体系全貌圣殿 (Zermelo-Fraenkel Set Theory Codex)' : 'Zermelo-Fraenkel Set Theory Codex'}
              </h4>
              <p className="text-xs text-slate-400">
                {isZh
                  ? '现代数学大厦的 9 大公理基石。点击可解锁并查阅一阶逻辑形式化谓词与直觉诠释。'
                  : 'The nine axiomatic cornerstones of modern mathematics. Click to unlock and inspect the first-order formal predicates and intuitive readings.'}
              </p>
            </div>
            <div className="text-xs font-mono font-bold text-purple-400 px-3 py-1 rounded-xl bg-purple-500/10 border border-purple-500/30">
              {isZh ? `已解锁: ${progress.unlockedAxioms.length} / 9 公理` : `Unlocked: ${progress.unlockedAxioms.length} / 9 axioms`}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {Object.values(zfcAxiomRegistry).map((axiom) => {
              const isUnlocked = progress.unlockedAxioms.includes(axiom.id);
              return (
                <div
                  key={axiom.id}
                  className={`p-4 rounded-xl border space-y-2.5 transition-all flex flex-col justify-between ${
                    isUnlocked
                      ? 'bg-slate-900/80 border-purple-500/40 text-slate-200 shadow-md shadow-purple-500/5'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-400'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-purple-300 font-bold">
                        {axiom.category}
                      </span>
                      {isUnlocked ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Lock className="w-4 h-4 text-slate-600" />
                      )}
                    </div>

                    <h5 className="text-xs font-bold text-slate-100">{isZh ? axiom.nameZh : axiom.nameEn}</h5>
                    {isZh && <p className="text-[10px] font-mono text-slate-400">{axiom.nameEn}</p>}

                    <div className="p-2.5 rounded-lg bg-slate-950 border border-purple-500/20 font-mono text-[11px] text-purple-200 overflow-x-auto">
                      <InlineLaTeX formula={axiom.firstOrderFormulaLatex} />
                    </div>

                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {isZh ? axiom.intuitionZh : axiom.intuitionEn || axiom.intuitionZh}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500">{isZh ? '奖励 +30 XP' : 'Reward +30 XP'}</span>
                    {!isUnlocked && (
                      <button
                        onClick={() => handleUnlockAxiom(axiom.id)}
                        className="px-2.5 py-1 rounded bg-purple-600 hover:bg-purple-500 text-slate-100 text-[10px] font-bold cursor-pointer transition-all"
                      >
                        {isZh ? '解锁公理' : 'Unlock axiom'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: CRUCIBLE (Entity Synthesis) */}
      {activeTab === 'CRUCIBLE' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-slate-100">
                {isZh ? '数学实体炼金室 (Mathematical Alchemy Crucible)' : 'Mathematical Alchemy Crucible'}
              </h4>
              <p className="text-xs text-slate-400">
                {isZh
                  ? '将低阶概念与 ZFC 公理熔炼组合，创造从自然数、戴德金实数到微积分切丛与范畴论的高阶数学对象。'
                  : 'Fuse lower-order concepts with ZFC axioms to create higher mathematical objects, from natural numbers and Dedekind reals to tangent bundles and category theory.'}
              </p>
            </div>
            <div className="text-xs font-mono font-bold text-emerald-400 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
              {isZh ? `已拥有: ${progress.inventoryEntities.length} 个实体` : `Owned: ${progress.inventoryEntities.length} entities`}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {campaignEpochs
              .flatMap((e) => e.constructibleEntities)
              .map((entity: ConstructedEntity) => {
                const isSynthesized = progress.inventoryEntities.includes(entity.id);
                const canSyn = canSynthesizeEntity(progress, entity.id);

                return (
                  <div
                    key={entity.id}
                    className={`p-4 rounded-xl border space-y-2.5 transition-all flex flex-col justify-between ${
                      isSynthesized
                        ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-200'
                        : canSyn.canSynthesize
                        ? 'bg-slate-900/90 border-cyan-500/60 text-slate-200 ring-1 ring-cyan-500/30'
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-500'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-emerald-300 font-bold">
                          {entity.discipline}
                        </span>
                        <div className="px-2 py-0.5 rounded bg-slate-950 text-xs font-mono font-bold text-amber-300 border border-slate-800">
                          <InlineLaTeX formula={entity.setNotation} />
                        </div>
                      </div>

                      <h5 className="text-xs font-bold text-slate-100">{isZh ? entity.nameZh : entity.nameEn}</h5>
                      {isZh && <p className="text-[10px] font-mono text-slate-400">{entity.nameEn}</p>}

                      <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[10px] text-cyan-200 overflow-x-auto">
                        <InlineLaTeX formula={entity.formalDefinitionLatex} />
                      </div>

                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        {isZh ? entity.descriptionZh : ENTITY_DESC_EN[entity.id] || entity.descriptionZh}
                      </p>

                      {/* Required Entities */}
                      {entity.requiredEntities.length > 0 && (
                        <div className="text-[10px] text-slate-400">
                          {isZh ? '前置依赖实体：' : 'Required entities: '}
                          <span className="text-slate-300 font-mono ml-1">
                            {entity.requiredEntities.join(', ')}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                      <span className="text-[10px] text-slate-500">+40 XP</span>
                      {isSynthesized ? (
                        <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> {isZh ? '已在实体库' : 'In inventory'}
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSynthesize(entity.id)}
                          disabled={!canSyn.canSynthesize}
                          className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                            canSyn.canSynthesize
                              ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          {isZh ? '炼成实体' : 'Synthesize'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Tab 4: OVERVIEW */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <h4 className="text-sm font-bold text-slate-100">
              {isZh ? '数学文明演进史 6 大纪元总览 (Epoch Matrix)' : 'Epoch Matrix — Six Eras of Mathematical Civilization'}
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              {isZh
                ? '见证人类逻辑从 19 世纪末康托尔集合论危机到 21 世纪交互式定理证明器 (Lean 4) 的宏伟史诗。'
                : 'Witness the grand epic of human logic, from the late-19th-century set-theory crisis to 21st-century interactive theorem proving (Lean 4).'}
            </p>
          </div>

          <div className="space-y-3">
            {campaignEpochs.map((ep) => {
              const isUnlocked = progress.unlockedEpochs.includes(ep.epochNumber);
              const isCompleted = progress.completedChallenges.includes(ep.milestoneChallenge.id);

              return (
                <div
                  key={ep.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    isCompleted
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-200'
                      : isUnlocked
                      ? 'bg-slate-900/70 border-slate-800 text-slate-300'
                      : 'bg-slate-950/40 border-slate-900 text-slate-600 opacity-60'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-amber-400">EPOCH 0{ep.epochNumber}</span>
                      <h5 className="text-sm font-bold text-slate-100">{isZh ? ep.titleZh : ep.titleEn}</h5>
                      {isZh && <span className="text-[11px] text-slate-400 font-mono">({ep.titleEn})</span>}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
                      {isZh ? ep.eraDescriptionZh : EPOCH_ERA_DESC_EN[ep.epochNumber] || ep.eraDescriptionZh}
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 font-mono">
                        {isZh ? `徽章：${ep.badgeTitle}` : `Badge: ${enHalf(ep.badgeTitle)}`}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="font-mono text-xs text-amber-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800 max-w-xs overflow-x-auto">
                      <InlineLaTeX formula={ep.milestoneChallenge.goalFormula} />
                    </div>
                    {isCompleted ? (
                      <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {isZh ? '已攻克' : 'Completed'}
                      </span>
                    ) : isUnlocked ? (
                      <span className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/40">
                        {isZh ? '可推进' : 'In progress'}
                      </span>
                    ) : (
                      <span className="px-3 py-1.5 rounded-lg bg-slate-900 text-slate-600 text-xs font-bold border border-slate-800 flex items-center gap-1.5">
                        <Lock className="w-4 h-4" /> {isZh ? '锁定' : 'Locked'}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

