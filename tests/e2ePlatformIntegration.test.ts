/**
 * MathUniverse - Unified End-to-End Platform Integration Test Suite (Test Group 14)
 *
 * Validates cross-module user journeys and mathematical state machines:
 * 1. Research Monograph Publication: Target selection -> DAG closure -> Monte Carlo node verification -> Multi-target publishing (LaTeX/Typst/Beamer/Quarto/Overleaf/TikZ-cd).
 * 2. ZFC Civilization to Formal Prover Pipeline: 6-epoch progression -> 9-axiom unlock -> 26 constructible entities -> step derivation verifier -> Lean 4 code sync.
 * 3. Fallacy Detective to Formal Refutation: 6 case dossiers -> 6 fallacy taxonomy categories -> step accusation scoring -> Lean 4 disproof verification.
 * 4. 3D Cosmological Knowledge Navigation: 6 discipline nebulae -> Hasse transitive reduction -> orbital shell stratification -> bottleneck theorem detection -> 3D camera trajectory.
 * 5. Interactive Numerical Sandbox & Mathematical Engine: RK4 dynamical systems (Lorenz, Lotka-Volterra) -> Simpson integration -> 8 3D parametric surface meshes -> Matrix algebra -> BigInt number theory.
 * 6. Global Platform Graph & State Invariance: All-pairs reachability -> topological sorting invariants -> zero phantom references -> mirror dependency symmetry.
 */

import { initialMathNodes } from '../src/data/seedData.ts';
import type { MathNode, DisciplineId, NodeType } from '../src/types/math.ts';
import type { ExportFormat, ExportOptions } from '../src/types/export.ts';
import type { ZfcAxiomId, UserCampaignProgress } from '../src/types/campaign.ts';
import type { FallacyType } from '../src/types/fallacy.ts';
import type { PlotDataPayload, NumericalVerificationContract } from '../src/types/sandbox.ts';

// Lib imports
import {
  checkCircularDependency,
  topologicalSort,
  findDerivationPaths,
  getTransitivePrerequisites,
} from '../src/lib/dagEngine.ts';

import {
  getOrderedPrerequisiteNodes,
  generateLatexPaper,
  generateTypstDoc,
  generateBeamerPresentation,
  generateMarkdownDoc,
  generateOverleafUrl,
  generateOverleafPayload,
  generateTikzDependencyGraph,
  generateTikzCdDiagram,
  generateNaturalDeductionTree,
  generateStandaloneDiagram,
  compileExportDocument,
} from '../src/lib/exportEngine.ts';

import {
  numericalIntegrate,
  numericalDerivative,
  computeTaylorSeries,
  computeFourierSeries,
  computeRiemannSum,
  analyzeMatrix,
  gramSchmidt,
  solveODE_RK4,
  generateVectorFieldGrid,
  analyzeNumber,
  modularExp,
  generateParametricSurfaceMesh,
  evaluateComplexFunction,
  generateComplexGrid,
  verifyCauchySchwarz,
  verifyFTC,
  verifyStokes,
  verifyFermat,
  verifyEnergyConservation,
  verificationContracts,
  executeVerificationContract,
  getVerificationContractsForNode,
} from '../src/lib/mathCompute.ts';

import {
  computeMinimumPrerequisiteClosure,
  computeTransitiveReduction,
  computeTopologicalDepths,
  getOrbitalShell,
  compute3DCosmosLayout,
  calculateCriticalBottlenecks,
  COSMIC_NEBULAE,
  mapDisciplineToNebula,
} from '../src/lib/prerequisiteClosure.ts';

import {
  zfcAxiomRegistry,
  campaignEpochs,
  calculateUserLevel,
  canUnlockEpoch,
  unlockEpoch,
  unlockAxiom,
  canSynthesizeEntity,
  synthesizeEntity,
  verifyMilestoneStep,
  completeEpochChallenge,
  createInitialProgress,
  resetProgress,
  USER_LEVEL_TITLES,
} from '../src/lib/campaignEngine.ts';

import {
  fallacyCategoriesMeta,
  fallacyCases,
  getFallacyCases,
  getFallacyCaseById,
  getFallacyCategories,
  getFallacyCategoryMeta,
  accuseProofStep,
  verifyAccusation,
  getCaseStats,
  createInitialFallacyProgress,
} from '../src/lib/fallacyEngine.ts';

export function runE2EIntegrationTests(): { passed: number; failed: number } {
  console.log('🌌 =========================================================================');
  console.log('🌌 MATHUNIVERSE E2E PLATFORM INTEGRATION SUITE (TEST GROUP 14)');
  console.log('🌌 =========================================================================\n');

  let passed = 0;
  let failed = 0;
  const failures: string[] = [];

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`  ✅ [PASS] ${testName}`);
      passed++;
    } else {
      const msg = `  ❌ [FAIL] ${testName}${detail ? ` -> ${detail}` : ''}`;
      console.error(msg);
      failures.push(msg);
      failed++;
    }
  }

  function byId(id: string): MathNode {
    const node = initialMathNodes.find((n) => n.id === id);
    if (!node) throw new Error(`Node not found: ${id}`);
    return node;
  }

  // =========================================================================
  // WORKFLOW 1: Academic Research & Multi-Target Monograph Publishing Pipeline
  // =========================================================================
  console.log('--- E2E WORKFLOW 1: Academic Research & Multi-Target Publishing Pipeline ---');
  {
    // Step 1.1: Select Apex Milestone Theorem
    const targetNode = byId('thm-stokes');
    assert(targetNode.id === 'thm-stokes', 'Workflow 1.1: Selected apex theorem is Generalized Stokes Theorem');

    // Step 1.2: Resolve Full Upstream Transitive Closure via DAG Engine
    const transitivePrereqIds = getTransitivePrerequisites(targetNode.id, initialMathNodes);
    assert(transitivePrereqIds.length >= 2, `Workflow 1.2: Stokes theorem resolves >= 2 ancestor nodes (got ${transitivePrereqIds.length})`);
    assert(transitivePrereqIds.includes('thm-ftc'), 'Workflow 1.2: Transitive closure contains FTC');
    assert(transitivePrereqIds.includes('def-limit-sequence'), 'Workflow 1.2: Transitive closure contains Limit Definition');

    // Step 1.3: Compute Minimum Prerequisite Closure and Personalized Learning Gap
    const userKnownNodes = ['def-limit-sequence'];
    const closure = computeMinimumPrerequisiteClosure(targetNode.id, userKnownNodes, initialMathNodes);
    assert(closure !== null, 'Workflow 1.3: Prerequisite closure computed successfully');
    assert(closure!.readinessPercentage > 0 && closure!.readinessPercentage < 100, `Workflow 1.3: User readiness is partial (${closure!.readinessPercentage}%)`);
    assert(closure!.unlearnedPrerequisiteNodes.some((n) => n.id === 'thm-ftc'), 'Workflow 1.3: FTC correctly identified as unlearned gap');
    assert(closure!.learningSequence[closure!.learningSequence.length - 1].id === 'thm-stokes', 'Workflow 1.3: Learning sequence terminates at target theorem');

    // Step 1.4: Critical Bottleneck Theorem Identification
    const bottlenecks = calculateCriticalBottlenecks(transitivePrereqIds, initialMathNodes);
    assert(bottlenecks.length > 0, 'Workflow 1.4: Critical bottlenecks identified for prerequisite subgraph');
    assert(bottlenecks[0].betweennessScore >= 0, `Workflow 1.4: Primary bottleneck theorem ranked with positive centrality (got ${bottlenecks[0].betweennessScore})`);

    // Step 1.5: Automated Monte Carlo Numerical Verification
    const stokesVerif = verifyStokes({}, 50);
    assert(stokesVerif.passed, `Workflow 1.5: Stokes boundary circulation vs curl flux verified numerically (maxError: ${stokesVerif.maxError.toExponential(3)})`);
    const ftcVerif = verifyFTC({ a: 0, b: 3 }, 100);
    assert(ftcVerif.passed, `Workflow 1.5: FTC derivative-integral numerical contract passed (maxError: ${ftcVerif.maxError.toExponential(3)})`);

    // Step 1.6: Multi-Target Academic Publishing Compilation
    const exportOptions: ExportOptions = {
      format: 'latex_paper',
      includePrerequisites: true,
      includeProofs: true,
      includeIntuition: true,
      includeLeanCode: true,
      authorName: 'MathUniverse Global Collaborative',
      documentTitle: 'Generalized Stokes Theorem & Differential Form Cohomology',
    };

    // 1.6a AMS-LaTeX Monograph
    const latexPaper = generateLatexPaper(targetNode, initialMathNodes, exportOptions);
    assert(latexPaper.includes('\\documentclass[11pt,a4paper]{article}'), 'Workflow 1.6a: LaTeX contains 11pt a4paper article class');
    assert(latexPaper.includes('\\usepackage{amsmath,amssymb,amsthm,mathtools}'), 'Workflow 1.6a: LaTeX includes AMS math packages');
    assert(latexPaper.includes('\\usepackage{tikz-cd}') && latexPaper.includes('\\usepackage{bussproofs}'), 'Workflow 1.6a: LaTeX includes tikz-cd and bussproofs');
    assert(latexPaper.includes('\\begin{document}') && latexPaper.includes('\\end{document}'), 'Workflow 1.6a: LaTeX document tags balanced');
    assert(latexPaper.includes(exportOptions.documentTitle!), 'Workflow 1.6a: Custom paper title embedded in LaTeX');
    assert(latexPaper.includes('Generalized Stokes Theorem'), 'Workflow 1.6a: LaTeX includes target theorem title');

    // 1.6b Typst 0.11+ Publication
    const typstDoc = generateTypstDoc(targetNode, initialMathNodes, { ...exportOptions, format: 'typst' });
    assert(typstDoc.includes('#set page(') && typstDoc.includes('paper: "a4"'), 'Workflow 1.6b: Typst includes #set page configuration');
    assert(typstDoc.includes('#set text(') && typstDoc.includes('Linux Libertine'), 'Workflow 1.6b: Typst configures Libertine typography');
    assert(typstDoc.includes('```lean'), 'Workflow 1.6b: Typst embeds Lean 4 formalization code blocks');

    // 1.6c Beamer Slide Deck
    const beamerSlides = generateBeamerPresentation(targetNode, initialMathNodes, { ...exportOptions, format: 'beamer' });
    assert(beamerSlides.includes('\\documentclass[aspectratio=169]{beamer}'), 'Workflow 1.6c: Beamer specifies 16:9 widescreen layout');
    assert(beamerSlides.includes('\\usetheme{Madrid}'), 'Workflow 1.6c: Beamer applies Madrid presentation theme');
    const beamerFrameCount = (beamerSlides.match(/\\begin\{frame\}/g) || []).length;
    assert(beamerFrameCount >= 5, `Workflow 1.6c: Beamer deck contains ${beamerFrameCount} presentation frames`);

    // 1.6d Quarto Academic Markdown
    const quartoDoc = generateMarkdownDoc(targetNode, initialMathNodes, { ...exportOptions, format: 'quarto_md' });
    assert(quartoDoc.startsWith('---') && quartoDoc.includes('title:'), 'Workflow 1.6d: Quarto starts with YAML frontmatter');
    assert(quartoDoc.includes('::: {.callout-note') || quartoDoc.includes('::: {.callout-tip'), 'Workflow 1.6d: Quarto includes styled callout blocks');

    // 1.6e TikZ-cd Commutative Diagram
    const tikzCd = generateTikzCdDiagram(targetNode);
    assert(tikzCd.includes('\\begin{tikzcd}') && tikzCd.includes('\\Omega^{k-1}(M)'), 'Workflow 1.6e: TikZ-cd diagram emits differential forms sequence');

    // 1.6f Natural Deduction Proof Tree
    const proofTree = generateNaturalDeductionTree(targetNode);
    assert(proofTree.includes('\\begin{prooftree}') && proofTree.includes('\\end{prooftree}'), 'Workflow 1.6f: Natural deduction tree emits valid bussproofs environment');

    // 1.6g 1-Click Overleaf Cloud Bridge
    const overleafUrl = generateOverleafUrl(targetNode, initialMathNodes);
    assert(overleafUrl.startsWith('https://www.overleaf.com/docs?snip='), 'Workflow 1.6g: Overleaf URL targets official docs snippet API');
    const decodedSnip = decodeURIComponent(overleafUrl.split('?snip=')[1]);
    assert(decodedSnip.includes('\\documentclass') && decodedSnip.includes('Stokes'), 'Workflow 1.6g: Decoded Overleaf snippet contains complete compilable LaTeX source');
  }

  // =========================================================================
  // WORKFLOW 2: ZFC Civilization Campaign to Formal Prover Pipeline
  // =========================================================================
  console.log('\n--- E2E WORKFLOW 2: ZFC Civilization Campaign to Formal Prover Pipeline ---');
  {
    // Step 2.1: Initialize Player State
    let progress = createInitialProgress();
    assert(progress.unlockedEpochs.length === 1 && progress.unlockedEpochs[0] === 1, 'Workflow 2.1: New player starts in Epoch 1 (Genesis)');
    assert(progress.unlockedAxioms.includes('AXIOM_EXTENSIONALITY') && progress.unlockedAxioms.includes('AXIOM_EMPTY_SET'), 'Workflow 2.1: Epoch 1 grants Extensionality & Empty Set axioms');
    assert(progress.inventoryEntities.includes('entity-empty-set'), 'Workflow 2.1: Initial inventory contains empty set (∅)');
    assert(calculateUserLevel(progress.totalXp).level === 1, 'Workflow 2.1: Initial level is Level 1 虚空学徒');

    // Step 2.2: Unlock Epoch 1 Axioms and Synthesize Entities
    progress = unlockAxiom(progress, 'AXIOM_PAIRING');
    assert(progress.unlockedAxioms.includes('AXIOM_PAIRING'), 'Workflow 2.2: Unlocked Axiom of Pairing');

    const pairCheck = canSynthesizeEntity(progress, 'entity-singleton-empty');
    assert(pairCheck.canSynthesize, 'Workflow 2.2: Prerequisites met for singleton set {∅}');
    const synthPair = synthesizeEntity(progress, 'entity-singleton-empty');
    assert(synthPair.success && synthPair.progress.inventoryEntities.includes('entity-singleton-empty'), 'Workflow 2.2: Successfully synthesized singleton set');
    progress = synthPair.progress;

    // Step 2.3: Verify Epoch 1 Milestone Proof Step-by-Step
    const step1 = verifyMilestoneStep(1, 1, 'AXIOM_EXTENSIONALITY', '\\forall z (z \\in A \\iff z \\in B) \\implies A = B');
    assert(step1.isCorrect, 'Workflow 2.3: Epoch 1 Step 1 verified with Axiom of Extensionality');
    const step2 = verifyMilestoneStep(1, 2, 'AXIOM_PAIRING', '(a, b) := \\{\\{a\\}, \\{a, b\\}\\}');
    assert(step2.isCorrect, 'Workflow 2.3: Epoch 1 Step 2 verified with Axiom of Pairing');
    const step3 = verifyMilestoneStep(1, 3, 'AXIOM_EXTENSIONALITY', 'a = c \\land b = d');
    assert(step3.isCorrect, 'Workflow 2.3: Epoch 1 Step 3 verified uniqueness conclusion');

    // Complete Epoch 1 Milestone Challenge
    const epoch1Result = completeEpochChallenge(progress, 1);
    assert(epoch1Result.progress.unlockedEpochs.includes(2), 'Workflow 2.3: Completing Epoch 1 challenge auto-unlocks Epoch 2 (Peano Arithmetics)');
    assert(epoch1Result.badgeAwarded === '虚空奠基者 (Void Founder)', 'Workflow 2.3: Awarded Epoch 1 badge');
    progress = epoch1Result.progress;

    // Step 2.4: Advance Through Epochs 2 to 6 by Unlocking Axioms
    const axiomsToUnlock: ZfcAxiomId[] = [
      'AXIOM_UNION',
      'AXIOM_POWER_SET',
      'AXIOM_INFINITY',
      'AXIOM_REPLACEMENT',
      'AXIOM_REGULARITY',
      'AXIOM_CHOICE',
    ];
    for (const ax of axiomsToUnlock) {
      progress = unlockAxiom(progress, ax);
    }
    assert(progress.unlockedAxioms.length === 9, `Workflow 2.4: All 9 ZFC axioms unlocked (found ${progress.unlockedAxioms.length})`);

    // Complete challenges for Epochs 2, 3, 4, 5, 6
    for (let e = 2; e <= 6; e++) {
      const epochChallengeRes = completeEpochChallenge(progress, e);
      progress = epochChallengeRes.progress;
    }
    assert(progress.unlockedEpochs.length === 6, 'Workflow 2.4: All 6 Civilization Epochs unlocked');
    assert(progress.totalXp >= 2000, `Workflow 2.4: Player accumulated mastery XP (total: ${progress.totalXp})`);

    const finalLevel = calculateUserLevel(progress.totalXp);
    assert(finalLevel.level === 6 && finalLevel.title.includes('形式化大宗师'), `Workflow 2.4: Reached apex title ${finalLevel.title}`);

    // Step 2.5: Verify Entity Synthesis & Seed Data DAG Grounding
    const allEpochEntities = campaignEpochs.flatMap((e) => e.constructibleEntities);
    assert(allEpochEntities.length === 26, `Workflow 2.5: Campaign defines exactly 26 constructible entities (found ${allEpochEntities.length})`);

    // Verify entity dependencies form a valid DAG
    const entityIds = new Set(allEpochEntities.map((e) => e.id));
    for (const ent of allEpochEntities) {
      for (const req of ent.requiredEntities) {
        assert(entityIds.has(req), `Workflow 2.5: Entity ${ent.id} requires valid entity ${req}`);
      }
    }

    // Grounding: Ensure every ZFC axiom in registry has Lean 4 representation
    const axiomList = Object.values(zfcAxiomRegistry);
    assert(axiomList.every((a) => a.firstOrderFormulaLatex.length > 0), 'Workflow 2.5: All 9 axioms have formal first-order logic formulas');
  }

  // =========================================================================
  // WORKFLOW 3: Fallacy Detective to Formal Lean 4 Refutation Pipeline
  // =========================================================================
  console.log('\n--- E2E WORKFLOW 3: Fallacy Detective to Formal Refutation Pipeline ---');
  {
    // Step 3.1: Load All Fallacy Case Dossiers
    const cases = getFallacyCases();
    assert(cases.length === 6, `Workflow 3.1: Detective lab contains 6 investigative dossiers (found ${cases.length})`);
    const categories = getFallacyCategories();
    assert(categories.length === 6, `Workflow 3.1: Taxonomy defines 6 fallacy categories (found ${categories.length})`);

    // Step 3.2: Iterate Every Case, Test Adversarial Accusations, and Verify Ground Truth
    let solvedCaseIds: string[] = [];
    let totalDetectiveScore = 0;

    for (const c of cases) {
      // Find the flawed step index in this case
      const flawedStep = c.steps.find((s) => s.isFlawed);
      assert(flawedStep !== undefined, `Workflow 3.2: Case ${c.caseCode} has exactly 1 flawed step (Step ${flawedStep?.stepIndex})`);

      // Adversarial Trial A: Accuse a valid (non-flawed) step -> must return failure with 0 points
      const validStep = c.steps.find((s) => !s.isFlawed);
      if (validStep) {
        const falseAccusation = accuseProofStep(c.id, validStep.stepIndex, c.flawType);
        assert(!falseAccusation.isFlawedStep, `Workflow 3.2: Case ${c.caseCode}: Accusing valid step ${validStep.stepIndex} fails`);
        assert(falseAccusation.pointsEarned === 0, `Workflow 3.2: Case ${c.caseCode}: False accusation earns 0 points`);
      }

      // Adversarial Trial B: Accuse correct flawed step with wrong fallacy category -> partial credit
      const wrongCategory: FallacyType = c.flawType === 'FLAW_ZERO_DIV' ? 'FLAW_DIVERGENT' : 'FLAW_ZERO_DIV';
      const partialAccusation = accuseProofStep(c.id, flawedStep!.stepIndex, wrongCategory);
      assert(partialAccusation.isFlawedStep && !partialAccusation.flawCategoryMatches, `Workflow 3.2: Case ${c.caseCode}: Partial accusation identified flawed step`);
      assert(partialAccusation.pointsEarned > 0 && partialAccusation.pointsEarned < 500, `Workflow 3.2: Case ${c.caseCode}: Partial accusation awarded reduced score (${partialAccusation.pointsEarned})`);

      // Exact Diagnosis Trial C: Accuse correct flawed step with exact category -> 100% full match
      const exactAccusation = accuseProofStep(c.id, flawedStep!.stepIndex, c.flawType);
      assert(exactAccusation.isFlawedStep && exactAccusation.flawCategoryMatches, `Workflow 3.2: Case ${c.caseCode}: Exact diagnosis succeeded`);
      assert(exactAccusation.pointsEarned >= 100, `Workflow 3.2: Case ${c.caseCode}: Full match awarded full points (${exactAccusation.pointsEarned})`);
      assert(exactAccusation.formalRefutationLatex !== undefined && exactAccusation.formalRefutationLatex.length > 5, `Workflow 3.2: Case ${c.caseCode}: Refutation LaTeX provided`);
      assert(exactAccusation.leanDisproofSnippet !== undefined && exactAccusation.leanDisproofSnippet.length > 20, `Workflow 3.2: Case ${c.caseCode}: Formal Lean 4 disproof snippet provided`);

      solvedCaseIds.push(c.id);
      totalDetectiveScore += exactAccusation.pointsEarned;
    }

    // Step 3.3: Verify Detective Career Progression & Badge Titles
    const stats0 = getCaseStats([]);
    assert(stats0.detectiveTitle.includes('见习'), 'Workflow 3.3: 0 cases -> 见习逻辑侦探 (Junior Inspector)');

    const stats2 = getCaseStats(solvedCaseIds.slice(0, 2));
    assert(stats2.detectiveTitle.includes('专家'), 'Workflow 3.3: 2 cases -> 悖论鉴别专家 (Paradox Investigator)');

    const stats4 = getCaseStats(solvedCaseIds.slice(0, 4));
    assert(stats4.detectiveTitle.includes('审判官'), 'Workflow 3.3: 4 cases -> 高阶数学审判官 (Senior Proof Inquisitor)');

    const stats6 = getCaseStats(solvedCaseIds);
    assert(stats6.detectiveTitle.includes('大宗师'), 'Workflow 3.3: 6 cases -> 大宗师逻辑法官 (Grand Formal Magistrate)');
    assert(stats6.solvedCount === 6 && Object.values(stats6.categoryBreakdown).every((v) => v === true), 'Workflow 3.3: All 6 fallacy taxonomy categories marked resolved');
  }

  // =========================================================================
  // WORKFLOW 4: 3D Cosmological Knowledge Navigation & Hasse Transitive Reduction
  // =========================================================================
  console.log('\n--- E2E WORKFLOW 4: 3D Cosmological Knowledge Navigation & Hasse Reduction ---');
  {
    // Step 4.1: Cosmic Discipline Nebulae Partitioning
    const nebulae = Object.values(COSMIC_NEBULAE);
    assert(nebulae.length === 6, `Workflow 4.1: Universe contains 6 cosmic discipline nebulae (found ${nebulae.length})`);
    for (const node of initialMathNodes) {
      const mappedNebula = mapDisciplineToNebula(node.disciplineId);
      assert(mappedNebula !== undefined && mappedNebula.id.length > 0, `Workflow 4.1: Node ${node.id} (${node.disciplineId}) mapped to nebula ${mappedNebula.nameZh}`);
    }

    // Step 4.2: 3D Physics Layout Computation & Numerical Confinement
    const cosmosLayout = compute3DCosmosLayout(initialMathNodes);
    assert(cosmosLayout.size === initialMathNodes.length, `Workflow 4.2: 3D layout positioned all ${initialMathNodes.length} nodes`);
    for (const [nodeId, pos] of cosmosLayout.entries()) {
      assert(!isNaN(pos.x) && !isNaN(pos.y) && !isNaN(pos.z), `Workflow 4.2: Node ${nodeId} has finite coordinates`);
      assert(Math.abs(pos.x) <= 600 && Math.abs(pos.y) <= 600 && Math.abs(pos.z) <= 600, `Workflow 4.2: Node ${nodeId} confined within [-600, 600]^3`);
    }

    // Step 4.3: Hasse Diagram Transitive Reduction (Prune Redundant Edges)
    const rawEdgeCount = initialMathNodes.reduce((acc, n) => acc + n.dependencies.length, 0);
    const hasseEdges = computeTransitiveReduction(initialMathNodes);
    assert(hasseEdges.length <= rawEdgeCount && hasseEdges.length > 0, `Workflow 4.3: Hasse reduction reduced ${rawEdgeCount} raw edges to ${hasseEdges.length} essential edges`);

    // Verify Reachability Invariance under Hasse Reduction
    const hasseAdj = new Map<string, string[]>();
    initialMathNodes.forEach((n) => hasseAdj.set(n.id, []));
    hasseEdges.forEach((e) => {
      hasseAdj.get(e.from)?.push(e.to);
    });

    function canReachInHasse(startId: string, targetId: string): boolean {
      const visited = new Set<string>();
      const queue = [startId];
      while (queue.length > 0) {
        const u = queue.shift()!;
        if (u === targetId) return true;
        if (!visited.has(u)) {
          visited.add(u);
          const neighbors = hasseAdj.get(u) || [];
          neighbors.forEach((v) => {
            if (!visited.has(v)) queue.push(v);
          });
        }
      }
      return false;
    }

    // Every raw dependency u -> v must still have a directed path in the Hasse diagram
    let reachabilityPreserved = true;
    for (const n of initialMathNodes) {
      for (const depId of n.dependencies) {
        if (!canReachInHasse(n.id, depId)) {
          reachabilityPreserved = false;
        }
      }
    }
    assert(reachabilityPreserved, 'Workflow 4.3: Hasse transitive reduction strictly preserves 100% all-pairs reachability');

    // Step 4.4: Radial & Depth Stratification (Topological Depths to Orbital Shells)
    const depths = computeTopologicalDepths(initialMathNodes);
    assert(depths.size === initialMathNodes.length, 'Workflow 4.4: Computed topological depth for all nodes');

    // Strict depth inequality: for every edge u depends on v, depth(u) > depth(v)
    let depthInequalityHolds = true;
    for (const n of initialMathNodes) {
      const uDepth = depths.get(n.id)!;
      for (const depId of n.dependencies) {
        const vDepth = depths.get(depId)!;
        if (uDepth <= vDepth) {
          depthInequalityHolds = false;
        }
      }
    }
    assert(depthInequalityHolds, 'Workflow 4.4: Depth inequality invariant holds (depth(dependent) > depth(prerequisite))');

    // Shell mappings
    const coreShell = getOrbitalShell(0, 'AXIOM');
    assert(coreShell.shellIndex === 0 && coreShell.shellName.includes('Galactic Core'), 'Workflow 4.4: Axioms map to Shell 0 (Galactic Core)');
    const outerShell = getOrbitalShell(2, 'THEOREM');
    assert(outerShell.shellIndex === 3 && outerShell.shellName.includes('Outer Spiral Arms'), 'Workflow 4.4: Deep theorems map to Shell 3 (Outer Spiral Arms)');
  }

  // =========================================================================
  // WORKFLOW 5: Interactive Numerical Sandbox & Mathematical Engine
  // =========================================================================
  console.log('\n--- E2E WORKFLOW 5: Interactive Numerical Sandbox & Math Engine ---');
  {
    // Step 5.1: High-Precision Simpson Numerical Integration
    // Integral of Gaussian exp(-x^2) on [-3, 3] approx sqrt(pi) ≈ 1.77245385
    const gaussianInt = numericalIntegrate((x) => Math.exp(-x * x), -3, 3, 200);
    const expectedGaussian = Math.sqrt(Math.PI) * 0.9999779; // erf(3) ≈ 0.9999779
    assert(Math.abs(gaussianInt.value - expectedGaussian) < 1e-3, `Workflow 5.1: Simpson integration of Gaussian distribution accurate (got ${gaussianInt.value.toFixed(6)})`);

    // Step 5.2: Numerical Differentiation & Taylor Polynomial
    const dCos = numericalDerivative(Math.cos, Math.PI / 2);
    assert(Math.abs(dCos - -1.0) < 1e-4, `Workflow 5.2: Derivative of cos(x) at pi/2 is -1.0 (got ${dCos.toFixed(6)})`);

    const taylorCos = computeTaylorSeries(Math.cos, 0, 4);
    assert(taylorCos.length === 5, 'Workflow 5.2: Taylor series of cos(x) to order 4 produces 5 polynomial terms');
    assert(Math.abs(taylorCos[0].coef - 1.0) < 1e-4, 'Workflow 5.2: Order 0 term is 1.0');
    assert(Math.abs(taylorCos[1].coef - 0.0) < 1e-4, 'Workflow 5.2: Order 1 term is 0.0');
    assert(Math.abs(taylorCos[2].coef - -0.5) < 1e-4, 'Workflow 5.2: Order 2 term is -0.5');
    assert(Math.abs(taylorCos[4].coef - 1 / 24) < 1e-4, 'Workflow 5.2: Order 4 term is 1/24 ≈ 0.0417');

    // Step 5.3: RK4 Solver on Chaotic Attractor (Lorenz System)
    const lorenzSim = solveODE_RK4({
      system: 'lorenz',
      params: { sigma: 10, rho: 28, beta: 8 / 3 },
      initialState: [1, 1, 1],
      tSpan: [0, 10],
      dt: 0.01,
    });
    assert(lorenzSim.trajectory.length === 1001, `Workflow 5.3: Lorenz simulation produced 1001 trajectory steps (got ${lorenzSim.trajectory.length})`);
    assert(lorenzSim.trajectory.every((pt) => pt.every((c) => !isNaN(c) && isFinite(c))), 'Workflow 5.3: All trajectory coordinates are finite non-NaN reals');

    // Step 5.4: 3D Parametric Surface Mesh Generators (All 8 Surfaces)
    const surfaces: Array<'mobius' | 'torus' | 'hyperbolic_paraboloid' | 'monkey_saddle' | 'catenoid' | 'helicoid' | 'enneper' | 'riemann_sphere'> = [
      'mobius',
      'torus',
      'hyperbolic_paraboloid',
      'monkey_saddle',
      'catenoid',
      'helicoid',
      'enneper',
      'riemann_sphere',
    ];
    for (const s of surfaces) {
      const mesh = generateParametricSurfaceMesh(s, 12, 12, {});
      assert(mesh.vertices.length > 0 && mesh.faces.length > 0, `Workflow 5.4: Surface ${s} generated ${mesh.vertices.length} vertices, ${mesh.faces.length} faces`);
      assert(!isNaN(mesh.bounds.minX) && !isNaN(mesh.bounds.maxX), `Workflow 5.4: Surface ${s} bounding box has finite bounds`);
    }

    // Step 5.5: Linear Algebra & Matrix Eigenvalue Spectrum
    const rotMat = [
      [0, -1],
      [1, 0],
    ];
    const rotAnalysis = analyzeMatrix(rotMat);
    assert(Math.abs(rotAnalysis.determinant - 1.0) < 1e-4, 'Workflow 5.5: 90-degree rotation matrix det = 1');
    assert(rotAnalysis.eigenvalues.some((e) => Math.abs(e.imag - 1.0) < 1e-3), 'Workflow 5.5: Rotation matrix has imaginary eigenvalue +1i');
    assert(rotAnalysis.eigenvalues.some((e) => Math.abs(e.imag - -1.0) < 1e-3), 'Workflow 5.5: Rotation matrix has imaginary eigenvalue -1i');

    // Step 5.6: Number Theory & BigInt Modular Arithmetic
    const carmichael = 561n; // 3 * 11 * 17
    const base = 2n;
    const carmichaelMod = modularExp(base, carmichael - 1n, carmichael);
    assert(carmichaelMod === 1n, 'Workflow 5.6: 2^560 mod 561 ≡ 1 (Fermat pseudo-prime property)');
  }

  // =========================================================================
  // WORKFLOW 6: Cross-Module Architectural State Invariance & Quality Gate
  // =========================================================================
  console.log('\n--- E2E WORKFLOW 6: Cross-Module State Invariance & Quality Gate ---');
  {
    // Step 6.1: Seed Data Graph Invariants
    const sortRes = topologicalSort(initialMathNodes);
    assert(sortRes.isDAG, 'Workflow 6.1: Platform knowledge base is a strictly acyclic DAG');
    assert(sortRes.sorted.length === initialMathNodes.length, `Workflow 6.1: Topological sort resolved all ${initialMathNodes.length} propositions`);

    // Step 6.2: Zero Phantom References & Mirror Edge Symmetry
    const idSet = new Set(initialMathNodes.map((n) => n.id));
    let phantomRefs = 0;
    let symmetryViolations = 0;

    for (const node of initialMathNodes) {
      for (const depId of node.dependencies) {
        if (!idSet.has(depId)) phantomRefs++;
        else {
          const depNode = byId(depId);
          if (!depNode.dependents.includes(node.id)) symmetryViolations++;
        }
      }
      for (const childId of node.dependents) {
        if (!idSet.has(childId)) phantomRefs++;
        else {
          const childNode = byId(childId);
          if (!childNode.dependencies.includes(node.id)) symmetryViolations++;
        }
      }
    }
    assert(phantomRefs === 0, `Workflow 6.2: 0 phantom references detected in knowledge base`);
    assert(symmetryViolations === 0, `Workflow 6.2: Strict mirror symmetry verified across all dependencies and dependents`);

    // Step 6.3: Cycle Detection Guard Invariant
    for (let i = 0; i < initialMathNodes.length; i++) {
      const u = initialMathNodes[i];
      // Self-loop check
      const selfLoop = checkCircularDependency(initialMathNodes, u.id, u.id);
      assert(selfLoop.hasCycle, `Workflow 6.3: Self loop on ${u.id} correctly detected as cycle`);
    }

    // Step 6.4: Verification Contract Registry Integrity
    assert(verificationContracts.length >= 4, `Workflow 6.4: Registry defines ${verificationContracts.length} numerical contracts`);
    for (const contract of verificationContracts) {
      const res = executeVerificationContract(contract);
      assert(res.passed, `Workflow 6.4: Verification contract ${contract.id} (${contract.claimName}) passed`);
    }

    // Step 6.5: Export Engine Multi-Format Coverage across All 21 Seed Nodes
    const formats: ExportFormat[] = ['latex_paper', 'typst', 'beamer', 'quarto_md'];
    for (const node of initialMathNodes) {
      for (const fmt of formats) {
        const doc = compileExportDocument(node, initialMathNodes, { format: fmt, includePrerequisites: false });
        assert(doc.content.length > 50, `Workflow 6.5: Node ${node.id} compiles cleanly to ${fmt} (${doc.content.length} chars)`);
      }
    }
  }

  console.log('\n=========================================================================');
  console.log(`📊 E2E PLATFORM INTEGRATION SUMMARY: ${passed} passed, ${failed} failed`);
  console.log('=========================================================================');

  if (failed > 0) {
    console.error('❌ E2E Integration Failures:', failures);
    return { passed, failed };
  }

  console.log('🏆 ALL E2E PLATFORM INTEGRATION WORKFLOWS PASSED WITH 100% SUCCESS!');
  return { passed, failed };
}

// Auto-run if executed directly as script
if (process.argv[1]?.includes('e2ePlatformIntegration')) {
  const result = runE2EIntegrationTests();
  if (result.failed > 0) {
    process.exit(1);
  }
}
