/**
 * tests/challenger_m5_deep_adversarial.ts
 *
 * Comprehensive Empirical Adversarial Stress & Chaos Harness for Milestone 5
 * Evaluated by Empirical Challenger (Specialist / Critic)
 */

import { initialMathNodes } from '../src/data/seedData.ts';
import type { MathNode, DisciplineId, NodeType } from '../src/types/math.ts';
import type { ExportFormat, ExportOptions } from '../src/types/export.ts';
import type { ZfcAxiomId, UserCampaignProgress } from '../src/types/campaign.ts';
import type { FallacyType } from '../src/types/fallacy.ts';
import type { SurfaceMesh3D, MatrixAnalysisResult } from '../src/types/sandbox.ts';

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

let passed = 0;
let failed = 0;

function assert(condition: boolean, msg: string): void {
  if (condition) {
    passed++;
    console.log(`  ✅ [PASS] ${msg}`);
  } else {
    failed++;
    console.error(`  ❌ [FAIL] ${msg}`);
  }
}

async function runChallengerDeepAdversarialSuite() {
  console.log('⚔️ =========================================================================');
  console.log('⚔️  CHALLENGER DEEP EMPIRICAL ADVERSARIAL STRESS SUITE (MILESTONE 5)        ⚔️');
  console.log('⚔️ =========================================================================\n');

  // --------------------------------------------------------------------------
  // SECTION 1: Massive Topological Permutations & Random DAG Chaos
  // --------------------------------------------------------------------------
  console.log('--- SECTION 1: Massive Topological Permutations & Random DAG Chaos ---');

  const N = 300;
  const randomDagNodes: MathNode[] = [];
  for (let i = 0; i < N; i++) {
    const deps: string[] = [];
    const numDeps = Math.min(i, Math.floor(Math.random() * 4));
    for (let d = 0; d < numDeps; d++) {
      const parentIdx = Math.floor(Math.random() * i);
      const parentId = `rand-${parentIdx}`;
      if (!deps.includes(parentId)) {
        deps.push(parentId);
      }
    }
    randomDagNodes.push({
      id: `rand-${i}`,
      slug: `rand-${i}`,
      title: `Random Theorem ${i}`,
      titleZh: `随机定理 ${i}`,
      type: (i === 0 ? 'axiom' : 'theorem') as NodeType,
      discipline: 'analysis' as DisciplineId,
      statement: `Random proposition statement ${i}`,
      statementZh: `随机命题叙述 ${i}`,
      proofLatex: `Proof of proposition ${i}`,
      dependencies: deps,
      dependents: [],
      historicalContext: `History ${i}`,
      leanSnippet: `-- Lean 4 snippet ${i}`,
      tags: ['random', 'stress-test']
    });
  }

  // Populate dependents symmetrically
  for (const node of randomDagNodes) {
    for (const depId of node.dependencies) {
      const parent = randomDagNodes.find(n => n.id === depId);
      if (parent && !parent.dependents.includes(node.id)) {
        parent.dependents.push(node.id);
      }
    }
  }

  const randomSortResult = topologicalSort(randomDagNodes);
  assert(randomSortResult.isDAG === true, `Random DAG of ${N} nodes must be identified as acyclic DAG`);
  assert(randomSortResult.sorted.length === N, `Sorted list must contain all ${N} nodes`);

  // Verify topological property: every node appears AFTER all its dependencies
  const posMap = new Map<string, number>();
  randomSortResult.sorted.forEach((node, idx) => posMap.set(node.id, idx));
  let topoInvariantViolated = false;
  for (const node of randomDagNodes) {
    const nodePos = posMap.get(node.id)!;
    for (const dep of node.dependencies) {
      const depPos = posMap.get(dep)!;
      if (depPos >= nodePos) {
        topoInvariantViolated = true;
      }
    }
  }
  assert(!topoInvariantViolated, `Strict topological ordering preserved for all ${N} random nodes`);

  // Find a node that has at least one dependency to construct a verified cycle
  const nodeWithDep = randomDagNodes.find(n => n.dependencies.length > 0)!;
  const parentId = nodeWithDep.dependencies[0];
  const parentNode = randomDagNodes.find(n => n.id === parentId)!;

  // Introduce cycle in random DAG: add child node as dependency to its parent
  const cyclicNodes: MathNode[] = JSON.parse(JSON.stringify(randomDagNodes));
  const cyclicParent = cyclicNodes.find(n => n.id === parentId)!;
  cyclicParent.dependencies.push(nodeWithDep.id);
  const cyclicResult = topologicalSort(cyclicNodes);
  assert(cyclicResult.isDAG === false, `Injected back-edge (${parentId} -> ${nodeWithDep.id}) must trigger cycle detection in large DAG`);
  assert(cyclicResult.sorted.length < cyclicNodes.length, `Cyclic graph has unresolvable nodes due to cycle`);

  // Test checkCircularDependency function with safe and cyclic additions
  assert(checkCircularDependency(randomDagNodes, 'rand-299', 'rand-0').hasCycle === false, `Forward edge (rand-299 depends on rand-0) is non-cyclic when 0 has no path to 299`);
  assert(checkCircularDependency(randomDagNodes, parentId, nodeWithDep.id).hasCycle === true, `Back-edge on existing path (${parentId} depends on ${nodeWithDep.id}) is detected as cycle`);


  // --------------------------------------------------------------------------
  // SECTION 2: Ill-Conditioned & Pathological Numerical Computations
  // --------------------------------------------------------------------------
  console.log('\n--- SECTION 2: Ill-Conditioned & Pathological Numerical Computations ---');

  // 1. Ill-conditioned Hilbert 3x3 matrix
  const H3 = [
    [1, 1/2, 1/3],
    [1/2, 1/3, 1/4],
    [1/3, 1/4, 1/5]
  ];
  const h3Props = analyzeMatrix(H3);
  const detH3Expected = 1 / 2160; // ≈ 0.00046296296
  assert(Math.abs(h3Props.determinant - detH3Expected) < 1e-6, `Hilbert 3x3 determinant ≈ 1/2160 (computed: ${h3Props.determinant})`);
  assert(h3Props.rank === 3, `Hilbert 3x3 has full rank 3 (computed: ${h3Props.rank})`);
  assert(h3Props.inverse !== undefined, `Hilbert 3x3 is invertible`);

  // Verify H3 * H3^(-1) ≈ I
  if (h3Props.inverse) {
    let maxInvError = 0;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        let sum = 0;
        for (let k = 0; k < 3; k++) sum += H3[r][k] * h3Props.inverse[k][c];
        const expected = r === c ? 1 : 0;
        maxInvError = Math.max(maxInvError, Math.abs(sum - expected));
      }
    }
    assert(maxInvError < 1e-4, `Hilbert 3x3 inverse product error < 1e-4 (error: ${maxInvError.toExponential(3)})`);
  }

  // 2. High-frequency oscillatory integration
  // \int_0^1 \cos(50 \pi x) dx = \sin(50 \pi) / (50 \pi) = 0
  const oscInt = numericalIntegrate((x) => Math.cos(50 * Math.PI * x), 0, 1, 1000);
  assert(Math.abs(oscInt.value) < 1e-6, `High frequency integral int_0^1 cos(50 pi x) dx ≈ 0 (computed: ${oscInt.value.toExponential(3)})`);

  // 3. Gaussian Integral on [-5, 5]
  // \int_{-5}^5 e^{-x^2} dx \approx \sqrt{\pi} \approx 1.7724538509
  const gaussInt = numericalIntegrate((x) => Math.exp(-x * x), -5, 5, 500);
  assert(Math.abs(gaussInt.value - Math.sqrt(Math.PI)) < 1e-4, `Gaussian integral over [-5, 5] matches sqrt(pi) (computed: ${gaussInt.value.toFixed(6)})`);

  // 4. Large prime arithmetic and Fermat pseudoprimes
  const bigPrime = 1000000007; // 10^9 + 7
  const carmichael = 561; // 3 * 11 * 17
  assert(modularExp(2n, BigInt(carmichael - 1), BigInt(carmichael)) === 1n, `Fermat pseudoprime 561 satisfies 2^560 = 1 mod 561`);
  assert(modularExp(3n, BigInt(bigPrime - 1), BigInt(bigPrime)) === 1n, `Fermat's Little Theorem 3^(10^9+6) = 1 mod (10^9+7)`);

  // 5. 3D Parametric Surfaces: Check all 8 surface geometries for non-empty vertices, faces, and finite coordinates
  const surfaceTypes = [
    'mobius', 'torus', 'hyperbolic_paraboloid', 'monkey_saddle',
    'catenoid', 'helicoid', 'enneper', 'riemann_sphere'
  ] as const;
  for (const st of surfaceTypes) {
    const mesh = generateParametricSurfaceMesh(st, 20, 20);
    assert(mesh.vertices.length > 0, `Surface ${st} generated ${mesh.vertices.length} vertex components`);
    assert(mesh.faces.length > 0, `Surface ${st} generated ${mesh.faces.length} face indices`);
    let hasNaN = false;
    let hasInf = false;
    for (const v of mesh.vertices) {
      if (isNaN(v.x) || isNaN(v.y) || isNaN(v.z)) hasNaN = true;
      if (!isFinite(v.x) || !isFinite(v.y) || !isFinite(v.z)) hasInf = true;
    }
    assert(!hasNaN && !hasInf, `Surface ${st} contains 100% finite non-NaN coordinate values`);
  }


  // --------------------------------------------------------------------------
  // SECTION 3: ZFC Progression Strict Security & Dependency Oracle
  // --------------------------------------------------------------------------
  console.log('\n--- SECTION 3: ZFC Progression Strict Security & Dependency Oracle ---');

  // Initialize brand new blank progress state
  let playerState: UserCampaignProgress = createInitialProgress();

  // Attempt to synthesize an entity requiring pairing axiom before unlocking it
  // entity-singleton-empty requires AXIOM_PAIRING and entity-empty-set
  const canSynSingletonBefore = canSynthesizeEntity(playerState, 'entity-singleton-empty');
  assert(canSynSingletonBefore.canSynthesize === false, `Forbidden: cannot synthesize entity-singleton-empty before prerequisites`);

  // Synthesize entity-empty-set (already has default unlocked axioms EXTENSIONALITY & EMPTY_SET)
  const synEmptySet = synthesizeEntity(playerState, 'entity-empty-set');
  assert(synEmptySet.success === true, `Synthesize entity-empty-set succeeds with genesis axioms`);
  playerState = synEmptySet.progress;

  // Now unlock AXIOM_PAIRING
  playerState = unlockAxiom(playerState, 'AXIOM_PAIRING');
  assert(playerState.unlockedAxioms.includes('AXIOM_PAIRING'), `Unlock AXIOM_PAIRING succeeds`);

  // Now synthesize singleton-empty
  const synSingletonAfter = synthesizeEntity(playerState, 'entity-singleton-empty');
  assert(synSingletonAfter.success === true, `Synthesize entity-singleton-empty succeeds once pairing unlocked`);
  playerState = synSingletonAfter.progress;

  // Test idempotency: re-unlocking AXIOM_PAIRING should award 0 extra XP
  const prevXp = playerState.totalXp;
  const duplicateUnlock = unlockAxiom(playerState, 'AXIOM_PAIRING');
  assert(duplicateUnlock.totalXp === prevXp, `Duplicate axiom unlock awards 0 extra XP (prevents XP farming)`);

  // Unlock all 9 axioms
  const allAxiomKeys = Object.keys(zfcAxiomRegistry) as ZfcAxiomId[];
  for (const axKey of allAxiomKeys) {
    playerState = unlockAxiom(playerState, axKey);
  }
  assert(playerState.unlockedAxioms.length === 9, `All 9 ZFC axioms unlocked`);

  // Unlock all epochs
  for (let ep = 1; ep <= 6; ep++) {
    playerState = unlockEpoch(playerState, ep);
  }

  // Synthesize all entities across all 6 epochs
  let allConstructibleCount = 0;
  for (const ep of campaignEpochs) {
    allConstructibleCount += ep.constructibleEntities.length;
  }

  let newlySynthesized = 0;
  let changed = true;
  while (changed) {
    changed = false;
    for (const ep of campaignEpochs) {
      for (const ent of ep.constructibleEntities) {
        if (!playerState.inventoryEntities.includes(ent.id)) {
          const check = canSynthesizeEntity(playerState, ent.id);
          if (check.canSynthesize) {
            const synRes = synthesizeEntity(playerState, ent.id);
            if (synRes.success) {
              playerState = synRes.progress;
              newlySynthesized++;
              changed = true;
            }
          }
        }
      }
    }
  }
  assert(playerState.inventoryEntities.length === allConstructibleCount,
    `All ${allConstructibleCount} entities synthesized across 6 epochs (synthesized: ${playerState.inventoryEntities.length})`);
  assert(playerState.totalXp >= 1000, `Total XP elevated (${playerState.totalXp} XP)`);


  // --------------------------------------------------------------------------
  // SECTION 4: Fallacy Detective Lab Boundary Scenarios & Refutation Integrity
  // --------------------------------------------------------------------------
  console.log('\n--- SECTION 4: Fallacy Detective Lab Boundary Scenarios & Refutation Integrity ---');

  for (const dossier of fallacyCases) {
    const flawedStep = dossier.steps.find(s => s.isFlawed)!;
    assert(flawedStep !== undefined, `Case ${dossier.id} has at least 1 flawed step`);
    const flawedStepIndex = flawedStep.stepIndex;

    // 1. Exact step + correct category -> full score
    const exactEval = accuseProofStep(dossier.id, flawedStepIndex, dossier.flawType);
    assert(exactEval.isFlawedStep === true, `Case ${dossier.id}: Flawed step ${flawedStepIndex} identified`);
    assert(exactEval.flawCategoryMatches === true, `Case ${dossier.id}: Fallacy type ${dossier.flawType} correctly matched`);
    assert(exactEval.pointsEarned === 100 * dossier.difficulty, `Case ${dossier.id}: Full points (${100 * dossier.difficulty}) awarded`);
    assert(exactEval.formalRefutationLatex !== undefined && exactEval.formalRefutationLatex.length > 20, `Case ${dossier.id}: Refutation LaTeX populated`);
    assert(exactEval.leanDisproofSnippet !== undefined && (exactEval.leanDisproofSnippet.includes('theorem') || exactEval.leanDisproofSnippet.includes('def') || exactEval.leanDisproofSnippet.includes('example')),
      `Case ${dossier.id}: Lean 4 code contains formal theorem/def construct`);

    // 2. Out-of-bounds step numbers
    const negStepEval = accuseProofStep(dossier.id, -1, dossier.flawType);
    assert(negStepEval.isFlawedStep === false && negStepEval.pointsEarned === 0, `Case ${dossier.id}: Step -1 yields 0 points`);

    const overflowStepEval = accuseProofStep(dossier.id, 9999, dossier.flawType);
    assert(overflowStepEval.isFlawedStep === false && overflowStepEval.pointsEarned === 0, `Case ${dossier.id}: Step 9999 yields 0 points`);

    // 3. Right step but bogus taxonomy category
    const dummyType: FallacyType = dossier.flawType === 'FLAW_ZERO_DIV' ? 'FLAW_DIVERGENT' : 'FLAW_ZERO_DIV';
    const partialEval = accuseProofStep(dossier.id, flawedStepIndex, dummyType);
    assert(partialEval.isFlawedStep === true, `Case ${dossier.id}: Partial matches step`);
    assert(partialEval.flawCategoryMatches === false, `Case ${dossier.id}: Partial flags category mismatch`);
    assert(partialEval.pointsEarned === 40 * dossier.difficulty,
      `Case ${dossier.id}: Partial awards exactly 40% points (${partialEval.pointsEarned}/${100 * dossier.difficulty})`);
  }

  // Test overall detective rank calculations
  const emptyStats = getCaseStats([]);
  assert(emptyStats.solvedCount === 0 && emptyStats.detectiveTitle.includes('见习逻辑侦探'), `Empty history yields Level 1 见习逻辑侦探`);

  const fullCaseIds = fallacyCases.map(c => c.id);
  const fullStats = getCaseStats(fullCaseIds);
  assert(fullStats.solvedCount === 6, `Full history has 6 cases solved`);
  assert(fullStats.detectiveTitle.includes('大宗师逻辑法官'), `Full history elevates to Level 4 大宗师逻辑法官`);


  // --------------------------------------------------------------------------
  // SECTION 5: Multi-Format Exporter Delimiter Balance & Cloud Overleaf
  // --------------------------------------------------------------------------
  console.log('\n--- SECTION 5: Multi-Format Exporter Delimiter Balance & Cloud Overleaf ---');

  for (const node of initialMathNodes) {
    const doc = compileExportDocument(node, initialMathNodes, {
      format: 'latex_paper',
      includePrerequisites: true,
      includeProofTree: true,
      includeCommutativeDiagram: true,
      includeLeanSnippet: true,
      includeInteractiveData: true,
      customAuthor: 'MathUniverse Challenger'
    });

    // 1. AMS-LaTeX checks
    const latex = doc.content;
    const docBegins = (latex.match(/\\begin\{document\}/g) || []).length;
    const docEnds = (latex.match(/\\end\{document\}/g) || []).length;
    assert(docBegins === 1 && docEnds === 1, `LaTeX for ${node.id}: Exactly 1 \\begin{document} and \\end{document}`);

    // Check TikZ / proof trees if present
    if (latex.includes('\\begin{tikzpicture}')) {
      const tikzBegins = (latex.match(/\\begin\{tikzpicture\}/g) || []).length;
      const tikzEnds = (latex.match(/\\end\{tikzpicture\}/g) || []).length;
      assert(tikzBegins === tikzEnds, `LaTeX for ${node.id}: Balanced \\begin{tikzpicture} and \\end{tikzpicture}`);
    }

    // 2. Typst checks
    const typstDoc = compileExportDocument(node, initialMathNodes, {
      format: 'typst',
      includePrerequisites: true,
      includeProofTree: true,
      includeCommutativeDiagram: true,
      includeLeanSnippet: true,
      includeInteractiveData: true
    });
    const typst = typstDoc.content;
    assert(typst.includes('#set page('), `Typst for ${node.id}: Contains #set page configuration`);
    assert(typst.includes('#set text('), `Typst for ${node.id}: Contains #set text configuration`);

    // 3. Beamer checks
    const beamerDoc = compileExportDocument(node, initialMathNodes, {
      format: 'beamer',
      includePrerequisites: true
    });
    const beamer = beamerDoc.content;
    const frameBegins = (beamer.match(/\\begin\{frame\}/g) || []).length;
    const frameEnds = (beamer.match(/\\end\{frame\}/g) || []).length;
    assert(frameBegins >= 1 && frameBegins === frameEnds, `Beamer for ${node.id}: Balanced ${frameBegins} slide frames`);

    // 4. Overleaf URL check
    const overleafUrl = generateOverleafUrl(node, initialMathNodes);
    assert(overleafUrl.startsWith('https://www.overleaf.com/docs?snip='),
      `Overleaf URL for ${node.id}: Correctly formatted encoded snippet URL`);
  }


  // --------------------------------------------------------------------------
  // SECTION 6: Cross-Module Prerequisite Closure, Hasse Reduction & Cosmos 3D
  // --------------------------------------------------------------------------
  console.log('\n--- SECTION 6: Cross-Module Prerequisite Closure, Hasse Reduction & Cosmos 3D ---');

  // Test Stokes Theorem complete transitive reduction & prerequisite closure
  const stokesClosure = computeMinimumPrerequisiteClosure('thm-stokes', ['def-limit-sequence'], initialMathNodes);
  assert(stokesClosure !== null, `Stokes prerequisite closure must compute successfully`);
  if (stokesClosure) {
    assert(stokesClosure.allPrerequisiteIds.length >= 2, `Stokes has >= 2 transitive prerequisites (found: ${stokesClosure.allPrerequisiteIds.length})`);
    assert(stokesClosure.unlearnedPrerequisiteNodes.length > 0, `Unlearned prerequisites accurately identified`);
    assert(stokesClosure.readinessPercentage > 0 && stokesClosure.readinessPercentage < 100,
      `Partial readiness accurately calculated (${stokesClosure.readinessPercentage.toFixed(1)}%)`);
    assert(stokesClosure.learningSequence[stokesClosure.learningSequence.length - 1].id === 'thm-stokes',
      `Learning sequence strictly terminates at target node thm-stokes`);
  }

  // Test Transitive Reduction on full seed graph
  const allNodeIds = initialMathNodes.map(p => p.id);
  const rawEdges: { source: string; target: string }[] = [];
  for (const p of initialMathNodes) {
    for (const d of p.dependencies) {
      rawEdges.push({ source: p.id, target: d });
    }
  }
  const reducedEdges = computeTransitiveReduction(initialMathNodes, allNodeIds);
  assert(reducedEdges.length <= rawEdges.length,
    `Hasse diagram reduction pruned shortcut edges (${reducedEdges.length} essential edges vs ${rawEdges.length} raw edges)`);

  // Test Cosmos 3D physics layout
  const cosmosCoords = compute3DCosmosLayout(initialMathNodes, 40);
  assert(cosmosCoords.size === initialMathNodes.length,
    `Cosmos 3D layout mapped all ${initialMathNodes.length} nodes to 3D space`);

  let maxRadius = 0;
  for (const [id, coord] of cosmosCoords.entries()) {
    assert(!isNaN(coord.x) && !isNaN(coord.y) && !isNaN(coord.z), `Node ${id} 3D coordinates are non-NaN`);
    const r = Math.sqrt(coord.x * coord.x + coord.y * coord.y + coord.z * coord.z);
    maxRadius = Math.max(maxRadius, r);
  }
  assert(maxRadius < 1000, `Cosmos 3D coordinates well-bounded within celestial sphere (max radius: ${maxRadius.toFixed(1)}px)`);


  // --------------------------------------------------------------------------
  // FINAL SUMMARY
  // --------------------------------------------------------------------------
  console.log('\n=========================================================================');
  console.log(`📊 CHALLENGER DEEP ADVERSARIAL SUMMARY: ${passed} passed, ${failed} failed`);
  console.log('=========================================================================');

  if (failed > 0) {
    console.error(`💥 ${failed} EMPIRICAL CHALLENGES FAILED!`);
    process.exit(1);
  } else {
    console.log('🏆 ALL EMPIRICAL CHALLENGES & CHAOS TESTS PASSED WITH 100% SUCCESS!');
    process.exit(0);
  }
}

runChallengerDeepAdversarialSuite();
