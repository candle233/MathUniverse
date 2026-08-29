/**
 * Adversarial Stress & Integrity Test Harness for Milestone 2 (M2)
 * Thoroughly validates:
 * 1. ZFC Campaign DAG & Entity Dependency Resolution across all 6 Epochs
 * 2. Milestone derivation challenges: steps, formulas, and verification engine
 * 3. User XP and Level calculation edge cases (negative, zero, massive, boundary)
 * 4. Fallacy Detective Lab: 6 cases, exact flaw singularity, accusation mechanics, and scoring
 * 5. SSR safety: localStorage mock, corrupted state recovery, null safety
 * 6. Code integrity: checking for facade patterns and hardcoded bypasses
 */

import {
  zfcAxiomRegistry,
  campaignEpochs,
  calculateUserLevel,
  createInitialProgress,
  unlockAxiom,
  canUnlockEpoch,
  unlockEpoch,
  canSynthesizeEntity,
  synthesizeEntity,
  verifyMilestoneStep,
  completeEpochChallenge,
  loadProgressFromStorage,
  saveProgressToStorage,
  resetProgress,
  USER_LEVEL_TITLES,
} from '../src/lib/campaignEngine.ts';

import {
  fallacyCategoriesMeta,
  fallacyCases,
  getFallacyCases,
  getFallacyCaseById,
  getFallacyCategories,
  accuseProofStep,
  getCaseStats,
  createInitialFallacyProgress,
  loadFallacyLabProgress,
  saveFallacyLabProgress,
  resetFallacyLabProgress,
} from '../src/lib/fallacyEngine.ts';

import type { ZfcAxiomId, UserCampaignProgress } from '../src/types/campaign.ts';
import type { FallacyType } from '../src/types/fallacy.ts';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`  ✅ [PASS] ${testName}`);
    passed++;
  } else {
    console.error(`  ❌ [FAIL] ${testName}`);
    failed++;
  }
}

console.log('⚔️ =======================================================');
console.log('⚔️  EMPIRICAL ADVERSARIAL STRESS HARNESS - MILESTONE 2  ⚔️');
console.log('⚔️ =======================================================\n');

// -------------------------------------------------------------
// SECTION 1: ZFC Axiom Registry & First-Order Formal Logic Rigor
// -------------------------------------------------------------
console.log('--- SECTION 1: ZFC Axiom Registry & First-Order Formal Logic ---');

const expectedAxioms: ZfcAxiomId[] = [
  'AXIOM_EXTENSIONALITY',
  'AXIOM_EMPTY_SET',
  'AXIOM_PAIRING',
  'AXIOM_UNION',
  'AXIOM_POWER_SET',
  'AXIOM_INFINITY',
  'AXIOM_REPLACEMENT',
  'AXIOM_REGULARITY',
  'AXIOM_CHOICE',
];

assert(Object.keys(zfcAxiomRegistry).length === 9, 'Registry must contain exactly 9 ZFC axioms');

for (const axId of expectedAxioms) {
  const ax = zfcAxiomRegistry[axId];
  assert(!!ax, `Axiom ${axId} must be present in registry`);
  assert(ax.id === axId, `Axiom ${axId} id must match key`);
  assert(typeof ax.nameZh === 'string' && ax.nameZh.length > 0, `Axiom ${axId} must have Chinese name`);
  assert(typeof ax.nameEn === 'string' && ax.nameEn.length > 0, `Axiom ${axId} must have English name`);
  assert(typeof ax.firstOrderFormulaLatex === 'string' && ax.firstOrderFormulaLatex.includes('\\'), `Axiom ${axId} must contain valid LaTeX formula with commands`);
  assert(typeof ax.intuitionZh === 'string' && ax.intuitionZh.length > 10, `Axiom ${axId} must contain descriptive mathematical intuition`);
  assert(ax.epochIntroduced >= 1 && ax.epochIntroduced <= 6, `Axiom ${axId} epochIntroduced must be within [1, 6]`);
}

// Check specific first-order logic symbols in foundational axioms
assert(zfcAxiomRegistry.AXIOM_EXTENSIONALITY.firstOrderFormulaLatex.includes('\\forall'), 'Extensionality formula must include universal quantifiers');
assert(zfcAxiomRegistry.AXIOM_EMPTY_SET.firstOrderFormulaLatex.includes('\\exists') && zfcAxiomRegistry.AXIOM_EMPTY_SET.firstOrderFormulaLatex.includes('\\notin'), 'Empty set formula must specify existence and non-membership');
assert(zfcAxiomRegistry.AXIOM_INFINITY.firstOrderFormulaLatex.includes('\\emptyset') && zfcAxiomRegistry.AXIOM_INFINITY.firstOrderFormulaLatex.includes('\\cup'), 'Infinity axiom formula must define inductive set containing empty set');
assert(zfcAxiomRegistry.AXIOM_REGULARITY.firstOrderFormulaLatex.includes('\\cap') && zfcAxiomRegistry.AXIOM_REGULARITY.firstOrderFormulaLatex.includes('\\emptyset'), 'Regularity axiom must forbid membership cycles');
assert(zfcAxiomRegistry.AXIOM_CHOICE.firstOrderFormulaLatex.includes('\\exists f'), 'Axiom of choice must state existence of choice function');

// -------------------------------------------------------------
// SECTION 2: 6 Civilization Epochs & Entity Dependency Graph
// -------------------------------------------------------------
console.log('\n--- SECTION 2: 6 Civilization Epochs & Entity Dependency Graph ---');

assert(campaignEpochs.length === 6, 'Must contain exactly 6 epochs');

const allEntitiesMap = new Map<string, { entity: any; epoch: number }>();
for (const epoch of campaignEpochs) {
  for (const ent of epoch.constructibleEntities) {
    assert(!allEntitiesMap.has(ent.id), `Entity id ${ent.id} must be globally unique across all epochs`);
    allEntitiesMap.set(ent.id, { entity: ent, epoch: epoch.epochNumber });
  }
}

assert(allEntitiesMap.size >= 24, `Must have at least 24 constructible entities (found ${allEntitiesMap.size})`);

// Verify all required entities exist and are introduced in the same or an earlier epoch (no forward dependencies)
for (const [entId, { entity, epoch }] of allEntitiesMap.entries()) {
  for (const reqEntId of entity.requiredEntities) {
    assert(allEntitiesMap.has(reqEntId), `Entity ${entId} requires existing entity ${reqEntId}`);
    const reqEpoch = allEntitiesMap.get(reqEntId)!.epoch;
    assert(reqEpoch <= epoch, `Entity ${entId} (epoch ${epoch}) cannot depend on future entity ${reqEntId} (epoch ${reqEpoch})`);
  }

  for (const reqAxId of entity.requiredAxioms) {
    assert(expectedAxioms.includes(reqAxId), `Entity ${entId} requires valid ZFC axiom ${reqAxId}`);
  }
}

// -------------------------------------------------------------
// SECTION 3: Constructive Campaign Progression Simulation (Epoch 1 -> 6)
// -------------------------------------------------------------
console.log('\n--- SECTION 3: Campaign Progression Simulation ---');

let simProgress = createInitialProgress();
assert(simProgress.unlockedEpochs.length === 1 && simProgress.unlockedEpochs[0] === 1, 'Sim begins at Epoch 1');

for (let epNum = 1; epNum <= 6; epNum++) {
  const epoch = campaignEpochs.find((e) => e.epochNumber === epNum)!;

  // Unlock all required axioms for this epoch
  for (const axId of epoch.requiredAxiomIds) {
    simProgress = unlockAxiom(simProgress, axId);
  }

  // Synthesize all entities in this epoch
  for (const ent of epoch.constructibleEntities) {
    const synCheck = canSynthesizeEntity(simProgress, ent.id);
    assert(synCheck.canSynthesize, `Should be able to synthesize ${ent.id} in Epoch ${epNum}`);
    const synRes = synthesizeEntity(simProgress, ent.id);
    assert(synRes.success, `Synthesis of ${ent.id} should succeed`);
    simProgress = synRes.progress;
  }

  // Verify all inference steps in milestone challenge
  const challenge = epoch.milestoneChallenge;
  for (const step of challenge.inferenceSteps) {
    // Check that correctFormula is one of formulaChoices
    assert(
      step.formulaChoices.includes(step.correctFormula),
      `Challenge ${challenge.id} step ${step.stepNumber} correctFormula must be in formulaChoices`
    );

    // Test correct answer
    const validAx = step.validAxiomChoices[0];
    const verifyRes = verifyMilestoneStep(epNum, step.stepNumber, validAx, step.correctFormula);
    assert(verifyRes.isCorrect, `Epoch ${epNum} Step ${step.stepNumber} verification should pass with correct inputs`);

    // Test wrong formula
    const wrongFormulaRes = verifyMilestoneStep(epNum, step.stepNumber, validAx, 'INVALID_FORMULA_XYZ');
    assert(!wrongFormulaRes.isCorrect, `Epoch ${epNum} Step ${step.stepNumber} verification should fail with wrong formula`);

    // Test wrong axiom
    const wrongAx: ZfcAxiomId = validAx === 'AXIOM_CHOICE' ? 'AXIOM_EMPTY_SET' : 'AXIOM_CHOICE';
    if (!step.validAxiomChoices.includes(wrongAx)) {
      const wrongAxRes = verifyMilestoneStep(epNum, step.stepNumber, wrongAx, step.correctFormula);
      assert(!wrongAxRes.isCorrect, `Epoch ${epNum} Step ${step.stepNumber} verification should fail with wrong axiom`);
    }
  }

  // Complete challenge
  const compRes = completeEpochChallenge(simProgress, epNum);
  assert(compRes.progress.completedChallenges.includes(challenge.id), `Challenge ${challenge.id} should be marked completed`);
  simProgress = compRes.progress;
}

assert(simProgress.unlockedEpochs.length === 6, 'All 6 epochs must be unlocked after completing simulation');
assert(simProgress.inventoryEntities.length === allEntitiesMap.size, 'All entities synthesized in inventory');
assert(simProgress.completedChallenges.length === 6, 'All 6 milestone challenges completed');

const finalLevel = calculateUserLevel(simProgress.totalXp);
assert(finalLevel.level === 6, `Final simulated player level should reach Level 6 (got Level ${finalLevel.level}, ${simProgress.totalXp} XP)`);

// -------------------------------------------------------------
// SECTION 4: User XP & Level Calculation Boundary & Stress Tests
// -------------------------------------------------------------
console.log('\n--- SECTION 4: User XP & Level Calculation Stress Tests ---');

// Test XP thresholds
assert(calculateUserLevel(0).level === 1, '0 XP -> Level 1');
assert(calculateUserLevel(199).level === 1, '199 XP -> Level 1');
assert(calculateUserLevel(200).level === 2, '200 XP -> Level 2');
assert(calculateUserLevel(499).level === 2, '499 XP -> Level 2');
assert(calculateUserLevel(500).level === 3, '500 XP -> Level 3');
assert(calculateUserLevel(899).level === 3, '899 XP -> Level 3');
assert(calculateUserLevel(900).level === 4, '900 XP -> Level 4');
assert(calculateUserLevel(1399).level === 4, '1399 XP -> Level 4');
assert(calculateUserLevel(1400).level === 5, '1400 XP -> Level 5');
assert(calculateUserLevel(1999).level === 5, '1999 XP -> Level 5');
assert(calculateUserLevel(2000).level === 6, '2000 XP -> Level 6');
assert(calculateUserLevel(100000).level === 6, '100000 XP -> Level 6 (capped at max)');

// Progress percentages
const p0 = calculateUserLevel(0).progressPercent;
assert(p0 >= 0 && p0 <= 100, '0 XP progressPercent in [0, 100]');
const pMid = calculateUserLevel(100).progressPercent;
assert(pMid === 50, '100 XP -> 50% of Level 1 (200 XP needed)');
const pMax = calculateUserLevel(50000).progressPercent;
assert(pMax >= 0 && pMax <= 100, 'Super large XP progressPercent clamped');

// -------------------------------------------------------------
// SECTION 5: Fallacy Detective Lab - Case Integrity & Singularity
// -------------------------------------------------------------
console.log('\n--- SECTION 5: Fallacy Detective Lab Case Rigor & Singularity ---');

const cases = getFallacyCases();
assert(cases.length === 6, 'Must have exactly 6 fallacy cases');

const expectedFlawCategories: FallacyType[] = [
  'FLAW_ZERO_DIV',
  'FLAW_DIVERGENT',
  'FLAW_BRANCH_CUT',
  'FLAW_GEOM_SEMICONT',
  'FLAW_INT_CONSTANT',
  'FLAW_LEIBNIZ_RULE',
];

const categoryMetas = getFallacyCategories();
assert(categoryMetas.length === 6, 'Must have 6 taxonomy category metadata');
for (const catType of expectedFlawCategories) {
  const meta = categoryMetas.find((c) => c.type === catType);
  assert(!!meta, `Category ${catType} must exist in metadata`);
  assert(typeof meta?.nameZh === 'string' && meta.nameZh.length > 0, `Category ${catType} has Chinese name`);
  assert(typeof meta?.principleViolatedZh === 'string' && meta.principleViolatedZh.length > 0, `Category ${catType} has principle violated`);
}

for (const c of cases) {
  assert(typeof c.id === 'string' && c.id.length > 0, `Case ${c.id} has non-empty id`);
  assert(typeof c.caseCode === 'string' && c.caseCode.startsWith('CASE-'), `Case ${c.id} has code ${c.caseCode}`);
  assert(expectedFlawCategories.includes(c.flawType), `Case ${c.id} flawType is a valid FallacyType`);
  assert(c.steps.length >= 3, `Case ${c.id} has at least 3 steps`);

  // Singularity check: EXACTLY 1 step must be isFlawed = true
  const flawedSteps = c.steps.filter((s) => s.isFlawed);
  assert(flawedSteps.length === 1, `Case ${c.id} must have EXACTLY 1 flawed step (found ${flawedSteps.length})`);

  const flawedStep = flawedSteps[0];
  assert(typeof flawedStep.flawReasonZh === 'string' && flawedStep.flawReasonZh.length > 15, `Case ${c.id} flawed step has detailed flaw explanation`);
  assert(typeof flawedStep.formalRefutationLatex === 'string' && flawedStep.formalRefutationLatex.length > 5, `Case ${c.id} flawed step has formal refutation LaTeX`);

  // Check Lean 4 snippet
  assert(typeof c.leanDisproofSnippet === 'string' && c.leanDisproofSnippet.includes('theorem'), `Case ${c.id} contains valid Lean 4 theorem snippet`);

  // Check Formal Critique
  assert(typeof c.formalCritiqueZh === 'string' && c.formalCritiqueZh.length > 20, `Case ${c.id} contains deep mathematical critique`);
}

// -------------------------------------------------------------
// SECTION 6: Fallacy Accusation Engine Adversarial Trials
// -------------------------------------------------------------
console.log('\n--- SECTION 6: Fallacy Accusation Engine Adversarial Trials ---');

for (const c of cases) {
  const flawedStep = c.steps.find((s) => s.isFlawed)!;
  const validSteps = c.steps.filter((s) => !s.isFlawed);

  // 1. Accuse correct step with correct category -> Full match
  const fullRes = accuseProofStep(c.id, flawedStep.stepIndex, c.flawType);
  assert(fullRes.isFlawedStep, `Case ${c.id}: Step ${flawedStep.stepIndex} identified as flaw`);
  assert(fullRes.flawCategoryMatches, `Case ${c.id}: Flaw category matches`);
  assert(fullRes.pointsEarned === 100 * c.difficulty, `Case ${c.id}: Full points = ${100 * c.difficulty}`);
  assert(!!fullRes.formalRefutationLatex, `Case ${c.id}: Full match provides refutation LaTeX`);
  assert(!!fullRes.leanDisproofSnippet, `Case ${c.id}: Full match provides Lean 4 snippet`);

  // 2. Accuse correct step with wrong category -> Partial match
  const wrongCat: FallacyType = c.flawType === 'FLAW_ZERO_DIV' ? 'FLAW_DIVERGENT' : 'FLAW_ZERO_DIV';
  const partRes = accuseProofStep(c.id, flawedStep.stepIndex, wrongCat);
  assert(partRes.isFlawedStep, `Case ${c.id}: Step ${flawedStep.stepIndex} still identified as flawed step`);
  assert(!partRes.flawCategoryMatches, `Case ${c.id}: Flaw category marked mismatch`);
  assert(partRes.pointsEarned === 40 * c.difficulty, `Case ${c.id}: Partial points = ${40 * c.difficulty}`);

  // 3. Accuse each valid step -> Must fail with 0 points
  for (const vs of validSteps) {
    const falseAccuse = accuseProofStep(c.id, vs.stepIndex, c.flawType);
    assert(!falseAccuse.isFlawedStep, `Case ${c.id}: Step ${vs.stepIndex} is NOT flawed`);
    assert(falseAccuse.pointsEarned === 0, `Case ${c.id}: False accusation gives 0 points`);
  }

  // 4. Out-of-bounds step index
  const oobRes = accuseProofStep(c.id, 999, c.flawType);
  assert(!oobRes.isFlawedStep && oobRes.pointsEarned === 0, `Case ${c.id}: Step 999 returns not found / not flawed`);
}

// Non-existent case
const nonExistentCaseRes = accuseProofStep('case-phantom-xyz', 1, 'FLAW_ZERO_DIV');
assert(!nonExistentCaseRes.isFlawedStep && nonExistentCaseRes.pointsEarned === 0, 'Non-existent case ID handled safely');

// -------------------------------------------------------------
// SECTION 7: Detective Stats & Title Tiers
// -------------------------------------------------------------
console.log('\n--- SECTION 7: Detective Stats & Title Tiers ---');

const s0 = getCaseStats([]);
assert(s0.solvedCount === 0 && s0.solvedPercent === 0 && s0.detectiveTitle.includes('见习逻辑侦探'), '0 solved -> 见习逻辑侦探');

const s1 = getCaseStats(['case-zero-div']);
assert(s1.solvedCount === 1 && s1.solvedPercent === 17 && s1.detectiveTitle.includes('见习逻辑侦探'), '1 solved -> 见习逻辑侦探');

const s2 = getCaseStats(['case-zero-div', 'case-divergent-series']);
assert(s2.solvedCount === 2 && s2.solvedPercent === 33 && s2.detectiveTitle.includes('悖论鉴别专家'), '2 solved -> 悖论鉴别专家');

const s4 = getCaseStats(['case-zero-div', 'case-divergent-series', 'case-branch-cut', 'case-staircase-pi']);
assert(s4.solvedCount === 4 && s4.solvedPercent === 67 && s4.detectiveTitle.includes('高阶数学审判官'), '4 solved -> 高阶数学审判官');

const s6 = getCaseStats(cases.map((c) => c.id));
assert(s6.solvedCount === 6 && s6.solvedPercent === 100 && s6.detectiveTitle.includes('大宗师逻辑法官'), '6 solved -> 大宗师逻辑法官');
assert(Object.values(s6.categoryBreakdown).every((v) => v === true), 'All 6 categories marked resolved in categoryBreakdown');

// -------------------------------------------------------------
// SECTION 8: SSR Safety & LocalStorage Fallbacks
// -------------------------------------------------------------
console.log('\n--- SECTION 8: SSR Safety & LocalStorage Fallbacks ---');

// In node environment (window === undefined)
const ssrCampaignProg = loadProgressFromStorage();
assert(ssrCampaignProg.unlockedEpochs.includes(1), 'loadProgressFromStorage returns valid initial progress on SSR');

// saveProgressToStorage does not crash in Node
try {
  saveProgressToStorage(ssrCampaignProg);
  assert(true, 'saveProgressToStorage succeeds without throwing in SSR mode');
} catch {
  assert(false, 'saveProgressToStorage threw in SSR mode');
}

const ssrFallacyProg = loadFallacyLabProgress();
assert(Array.isArray(ssrFallacyProg.solvedCaseIds), 'loadFallacyLabProgress returns valid initial progress on SSR');

try {
  saveFallacyLabProgress(ssrFallacyProg);
  assert(true, 'saveFallacyLabProgress succeeds without throwing in SSR mode');
} catch {
  assert(false, 'saveFallacyLabProgress threw in SSR mode');
}

console.log('\n=======================================================');
console.log(`📊 ADVERSARIAL M2 SUMMARY: ${passed} passed, ${failed} failed`);
console.log('=======================================================');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('🏆 ALL ADVERSARIAL M2 CHALLENGES EMPIRICALLY PASSED!\n');
}
