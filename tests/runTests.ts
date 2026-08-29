import { initialMathNodes } from '../src/data/seedData.ts';
import {
  checkCircularDependency,
  topologicalSort,
  findDerivationPaths,
  getTransitivePrerequisites,
} from '../src/lib/dagEngine.ts';
import {
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
  getOrderedPrerequisiteNodes,
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
} from '../src/lib/campaignEngine.ts';
import {
  getFallacyCases,
  getFallacyCaseById,
  getFallacyCategories,
  getFallacyCategoryMeta,
  accuseProofStep,
  verifyAccusation,
  getCaseStats,
  createInitialFallacyProgress,
} from '../src/lib/fallacyEngine.ts';
import { runE2EIntegrationTests } from './e2ePlatformIntegration.test.ts';
import { zh } from '../src/i18n/locales/zh.ts';
import { en } from '../src/i18n/locales/en.ts';
import {
  getNodeTitle,
  getNodeStatement,
  getNodeIntuition,
  getNodeTypeLabel,
  getDisciplineName,
} from '../src/lib/i18nHelper.ts';
import { disciplines } from '../src/data/disciplines.ts';

function runTestSuite() {
  console.log('🧪 ==========================================');
  console.log('🧪 Starting MathUniverse Test Suite (M1-M5: Groups 1-14)');
  console.log('🧪 ==========================================\n');

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

  // --- Test Group 1: Seed Data DAG Validity ---
  console.log('--- Test Group 1: Seed Data DAG Validity ---');
  const sortResult = topologicalSort(initialMathNodes);
  assert(sortResult.isDAG, 'Seed data graph must be a valid Directed Acyclic Graph (isDAG = true)');
  assert(sortResult.sorted.length === initialMathNodes.length, `All ${initialMathNodes.length} seed nodes must be topologically sortable`);

  const stokesIdx = sortResult.sorted.findIndex((n) => n.id === 'thm-stokes');
  const ftcIdx = sortResult.sorted.findIndex((n) => n.id === 'thm-ftc');
  const limitIdx = sortResult.sorted.findIndex((n) => n.id === 'def-limit-sequence');

  assert(limitIdx < ftcIdx, 'Limit definition (ε-N) must precede Fundamental Theorem of Calculus');
  assert(ftcIdx < stokesIdx, 'Fundamental Theorem of Calculus must precede Generalized Stokes Theorem');

  // --- Test Group 2: Circular Dependency Detection ---
  console.log('\n--- Test Group 2: Circular Dependency Detection ---');
  const cycleAttempt = checkCircularDependency(initialMathNodes, 'def-limit-sequence', 'thm-stokes');
  assert(cycleAttempt.hasCycle, 'Attempting to make Stokes a prerequisite of Limit must be detected as a cycle');

  const selfLoopAttempt = checkCircularDependency(initialMathNodes, 'thm-stokes', 'thm-stokes');
  assert(selfLoopAttempt.hasCycle, 'Self-dependency (A -> A) must be detected as a cycle');

  const safeAttempt = checkCircularDependency(initialMathNodes, 'conjecture-riemann-hypothesis', 'thm-cauchy-schwarz');
  assert(!safeAttempt.hasCycle, 'Adding non-cyclic dependency must return hasCycle = false');

  // --- Test Group 3: Derivation Pathfinding ---
  console.log('\n--- Test Group 3: Derivation Pathfinding ---');
  const paths = findDerivationPaths(initialMathNodes, 'def-limit-sequence', 'thm-stokes');
  assert(paths.length > 0, `Must find at least 1 derivation path from Limit to Stokes (found ${paths.length})`);
  console.log('  📍 Discovered Path:', paths[0].join(' -> '));

  // --- Test Group 4: Dependency Data Integrity ---
  console.log('\n--- Test Group 4: Dependency Data Integrity ---');
  const idSet = new Set(initialMathNodes.map((n) => n.id));
  let phantomRefs = 0;
  let asymCount = 0;
  const derivedDependents = new Map<string, string[]>(initialMathNodes.map((n) => [n.id, []]));
  for (const n of initialMathNodes) {
    n.dependencies.forEach((depId) => {
      if (!idSet.has(depId)) phantomRefs++;
      else derivedDependents.get(depId)!.push(n.id);
    });
    n.dependents.forEach((depId) => {
      if (!idSet.has(depId)) phantomRefs++;
    });
  }
  assert(phantomRefs === 0, `No node may reference a non-existent node id (found ${phantomRefs} phantom references)`);
  for (const n of initialMathNodes) {
    n.dependencies.forEach((depId) => {
      if (idSet.has(depId) && !byId(depId).dependents.includes(n.id)) asymCount++;
    });
    n.dependents.forEach((depId) => {
      if (idSet.has(depId) && !byId(depId).dependencies.includes(n.id)) asymCount++;
    });
    const derived = derivedDependents.get(n.id)!.slice().sort();
    const actual = n.dependents.slice().sort();
    if (JSON.stringify(derived) !== JSON.stringify(actual)) asymCount++;
  }
  assert(asymCount === 0, `dependencies and dependents must be mirror images of each other (found ${asymCount} mismatches)`);

  // --- Test Group 5: Academic Publishing & Export Engine (Core Exporter Verification) ---
  console.log('\n--- Test Group 5: Academic Publishing & Export Engine ---');
  const targetStokes = byId('thm-stokes');
  const prereqChain = getOrderedPrerequisiteNodes(targetStokes, initialMathNodes);
  assert(prereqChain.length >= 2, `Prerequisite chain for Stokes theorem must resolve >= 2 nodes (found ${prereqChain.length})`);
  assert(prereqChain[prereqChain.length - 1].id === 'thm-stokes', 'Last node in prerequisite chain must be the target theorem');

  const limitOrder = prereqChain.findIndex((n) => n.id === 'def-limit-sequence');
  const ftcOrder = prereqChain.findIndex((n) => n.id === 'thm-ftc');
  const stokesOrder = prereqChain.findIndex((n) => n.id === 'thm-stokes');
  assert(limitOrder !== -1 && ftcOrder !== -1 && stokesOrder !== -1, 'Stokes prerequisite chain must contain Limit, FTC, and Stokes');
  assert(limitOrder < ftcOrder && ftcOrder < stokesOrder, 'Prerequisite chain must be topologically ordered: Limit < FTC < Stokes');

  // Root node test (0 prerequisites)
  const rootLimit = byId('def-limit-sequence');
  const rootPrereqs = getOrderedPrerequisiteNodes(rootLimit, initialMathNodes);
  assert(rootPrereqs.length === 1 && rootPrereqs[0].id === 'def-limit-sequence', 'Root node with no dependencies should resolve to a 1-node chain');

  // LaTeX Paper tests
  const latexPaper = generateLatexPaper(targetStokes, initialMathNodes);
  assert(latexPaper.includes('\\documentclass[11pt,a4paper]{article}'), 'LaTeX generator must emit 11pt a4paper article class');
  assert(latexPaper.includes('\\usepackage{amsmath,amssymb,amsthm,mathtools}'), 'LaTeX generator must include standard AMS math packages');
  assert(latexPaper.includes('\\usepackage{tikz-cd}') && latexPaper.includes('\\usepackage{bussproofs}'), 'LaTeX generator must include tikz-cd and bussproofs packages');
  assert(latexPaper.includes('\\lstdefinelanguage{lean4}'), 'LaTeX generator must include Lean 4 listings syntax definitions');
  assert(latexPaper.includes('\\begin{document}') && latexPaper.includes('\\end{document}'), 'LaTeX document must contain complete document environment');
  assert(latexPaper.includes('\\begin{abstract}') && latexPaper.includes('\\tableofcontents'), 'LaTeX document must include abstract and table of contents');
  assert(latexPaper.includes(targetStokes.statementLatex), 'LaTeX document must contain target theorem LaTeX statement');
  assert(latexPaper.includes(targetStokes.mscCode), 'LaTeX document must include MSC 2020 classification');

  // LaTeX without prerequisites option
  const standaloneLatex = generateLatexPaper(targetStokes, initialMathNodes, { includePrerequisites: false });
  assert(!standaloneLatex.includes('\\subsection{数列极限'), 'LaTeX with includePrerequisites=false must omit prerequisite subsections');
  assert(standaloneLatex.includes(targetStokes.titleZh), 'LaTeX with includePrerequisites=false must retain target theorem');

  // Typst 0.11+ Document tests
  const typstDoc = generateTypstDoc(targetStokes, initialMathNodes);
  assert(typstDoc.includes('#set page(') && typstDoc.includes('paper: "a4"'), 'Typst generator must emit modern #set page rule');
  assert(typstDoc.includes('#set text(') && typstDoc.includes('Linux Libertine'), 'Typst generator must configure Libertine typography');
  assert(typstDoc.includes('#rect(') && typstDoc.includes('fill:'), 'Typst generator must generate styled theorem container rects');
  assert(typstDoc.includes('#block(') && typstDoc.includes('证明'), 'Typst generator must generate styled proof blocks');
  assert(typstDoc.includes('$ ' + targetStokes.statementLatex + ' $'), 'Typst generator must emit native math equation syntax');
  assert(typstDoc.includes('```lean'), 'Typst generator must include Lean 4 code blocks');

  // Beamer Slides tests
  const beamerSlides = generateBeamerPresentation(targetStokes, initialMathNodes);
  assert(beamerSlides.includes('\\documentclass[aspectratio=169]{beamer}'), 'Beamer generator must emit 16:9 widescreen beamer class');
  assert(beamerSlides.includes('\\usetheme{Madrid}') && beamerSlides.includes('\\usecolortheme{whale}'), 'Beamer generator must apply Madrid and whale themes');
  assert(beamerSlides.includes('\\titlepage') && beamerSlides.includes('\\tableofcontents'), 'Beamer generator must include titlepage and tableofcontents frames');
  const frameCount = (beamerSlides.match(/\\begin\{frame\}/g) || []).length;
  assert(frameCount >= 5, `Beamer generator must produce multi-frame deck (found ${frameCount} frames)`);

  // Quarto / Academic Markdown tests
  const markdownDoc = generateMarkdownDoc(targetStokes, initialMathNodes);
  assert(markdownDoc.startsWith('---') && markdownDoc.includes('title:') && markdownDoc.includes('format:'), 'Markdown generator must emit valid Quarto YAML frontmatter');
  assert(markdownDoc.includes('::: {.callout-note') && markdownDoc.includes('::: {.callout-tip'), 'Markdown generator must emit Quarto callout blocks');
  assert(markdownDoc.includes('$$\n' + targetStokes.statementLatex + '\n$$'), 'Markdown generator must format display equations with $$');
  assert(markdownDoc.includes('```lean'), 'Markdown generator must include Lean 4 code fences');

  // Overleaf Integration URL & Payload tests
  const overleafPayload = generateOverleafPayload(targetStokes, initialMathNodes);
  assert(overleafPayload.name.includes('stokes'), 'Overleaf payload name must contain theorem slug');
  assert(overleafPayload.engine === 'pdflatex', 'Overleaf payload must specify pdflatex engine');
  assert(overleafPayload.url.startsWith('https://www.overleaf.com/docs?snip='), 'Overleaf URL must target overleaf.com/docs endpoint');

  const overleafUrl = generateOverleafUrl(targetStokes, initialMathNodes);
  assert(overleafUrl.length > 200, 'Overleaf 1-click URL must contain full encoded snippet');
  const decodedOverleafSnip = decodeURIComponent(overleafUrl.split('?snip=')[1]);
  assert(decodedOverleafSnip.includes('\\documentclass') && decodedOverleafSnip.includes('Stokes'), 'Decoded Overleaf snippet must contain valid LaTeX document');

  // TikZ & Diagram Generators
  const tikzGraph = generateTikzDependencyGraph(targetStokes, initialMathNodes);
  assert(tikzGraph.includes('\\begin{tikzpicture}') && tikzGraph.includes('\\end{tikzpicture}'), 'TikZ dependency graph generator must emit complete tikzpicture environment');
  assert(tikzGraph.includes('\\draw[edge]'), 'TikZ dependency graph must draw directed prerequisite arrows');

  const stokesCd = generateTikzCdDiagram(targetStokes);
  assert(stokesCd.includes('\\begin{tikzcd}') && stokesCd.includes('\\Omega^{k-1}(M)') && stokesCd.includes('\\int_{\\partial M}'), 'TikZ-cd generator must emit Stokes differential forms & boundary diagram');

  const ftcCd = generateTikzCdDiagram(byId('thm-ftc'));
  assert(ftcCd.includes('\\begin{tikzcd}') && ftcCd.includes('C^1[a,b]') && ftcCd.includes('\\int_a^b'), 'TikZ-cd generator must emit FTC calculus adjunction diagram');

  const proofTree = generateNaturalDeductionTree(targetStokes);
  assert(proofTree.includes('\\begin{prooftree}') && proofTree.includes('\\AxiomC') && proofTree.includes('\\end{prooftree}'), 'Natural deduction generator must emit valid bussproofs proof tree');

  const standaloneDiagram = generateStandaloneDiagram('commutative_square');
  assert(standaloneDiagram.includes('\\documentclass[tikz,border=12pt]{standalone}'), 'Standalone diagram generator must emit standalone LaTeX class');

  // Multi-theorem export robustness tests
  const testTheorems = ['thm-ftc', 'thm-cauchy-schwarz', 'thm-heine-borel', 'thm-fermat-little'];
  for (const thmId of testTheorems) {
    const node = byId(thmId);
    const compiled = compileExportDocument(node, initialMathNodes, {
      format: 'latex_paper',
      includePrerequisites: true,
      includeProofs: true,
      includeIntuition: true,
      includeLeanCode: true,
    });
    assert(compiled.content.length > 500, `compileExportDocument for ${node.titleZh} must produce rich LaTeX (>500 chars)`);
    assert(compiled.lineCount > 20, `compileExportDocument for ${node.titleZh} must have >20 lines`);
    assert(compiled.suggestedFilename.endsWith('.tex'), `Filename for ${node.titleZh} must end with .tex`);
  }

  // --- Test Group 6: Client-Side Symbolic & Numerical Engine ---
  console.log('\n--- Test Group 6: Client-Side Math Compute Engine ---');
  // Numerical derivative of sin(x) at 0 should be 1.0
  const dSin = numericalDerivative(Math.sin, 0);
  assert(Math.abs(dSin - 1.0) < 1e-4, `Numerical derivative d/dx[sin(x)] at 0 must equal 1.0 (got ${dSin.toFixed(6)})`);

  // Numerical integral of x^2 from 0 to 1 should be 1/3 ≈ 0.333333
  const intX2 = numericalIntegrate((x) => x * x, 0, 1);
  assert(Math.abs(intX2.value - 1 / 3) < 1e-4, `Simpson integral of x^2 on [0,1] must equal 1/3 (got ${intX2.value.toFixed(6)})`);

  // Matrix Spectrum & Determinant: [ [3, 1], [2, 2] ] -> det = 4, trace = 5, eigenvalues = 4, 1
  const matAnalysis = analyzeMatrix([
    [3, 1],
    [2, 2],
  ]);
  assert(Math.abs(matAnalysis.determinant - 4) < 1e-4, `Matrix determinant of [[3,1],[2,2]] must equal 4 (got ${matAnalysis.determinant})`);
  assert(matAnalysis.eigenvalues.some((e) => Math.abs(e.real - 4) < 1e-3) && matAnalysis.eigenvalues.some((e) => Math.abs(e.real - 1) < 1e-3), 'Matrix eigenvalues must include 4 and 1');

  // Number theory: 360 -> factors: 2^3 * 3^2 * 5^1, totient: 96
  const numData = analyzeNumber(360);
  assert(numData.eulerTotient === 96, `Euler totient phi(360) must equal 96 (got ${numData.eulerTotient})`);
  assert(numData.factors.length === 3, '360 must factor into 3 distinct prime bases');

  // RK4 ODE Solver test: Lotka-Volterra trajectory computation
  const odeTest = solveODE_RK4({
    system: 'lotka_volterra',
    params: { alpha: 1.1, beta: 0.4, delta: 0.1, gamma: 0.4 },
    initialState: [10, 5, 0],
    tSpan: [0, 5],
    dt: 0.1,
  });
  assert(odeTest.trajectory.length > 40 && !isNaN(odeTest.trajectory[10][0]), 'RK4 ODE solver must compute valid state trajectories');

  // --- Test Group 7: Minimal Prerequisite Closure & Learning Pathways ---
  console.log('\n--- Test Group 7: Minimal Prerequisite Closure & Learning Pathways ---');
  const closure = computeMinimumPrerequisiteClosure('thm-stokes', ['def-limit-sequence'], initialMathNodes);
  assert(closure !== null && closure.readinessPercentage > 0, 'Prerequisite closure must calculate positive readiness score');
  assert(closure !== null && closure.totalEstimatedHours > 0, `Total estimated hours must be calculated (got ${closure?.totalEstimatedHours} hours)`);

  // --- Test Group 8: Transitive Prerequisite Graph Traversal ---
  console.log('\n--- Test Group 8: Transitive Prerequisite Graph Traversal ---');
  const acPrereqs = getTransitivePrerequisites('axiom-choice', initialMathNodes);
  assert(acPrereqs.length === 0, 'Axiom of Choice must have 0 upstream prerequisites');

  const stokesPrereqs = getTransitivePrerequisites('thm-stokes', initialMathNodes);
  assert(stokesPrereqs.includes('thm-ftc') && stokesPrereqs.includes('def-limit-sequence'), 'Stokes transitive prerequisites must contain FTC and Limit Sequence');

  // --- Test Group 9: Multi-Modal 3D Surfaces & Linear Algebra ---
  console.log('\n--- Test Group 9: Multi-Modal 3D Surfaces & Linear Algebra ---');
  const gsResult = gramSchmidt([
    [1, 1, 0],
    [1, 0, 1],
    [0, 1, 1],
  ]);
  assert(gsResult.orthonormal.length === 3, 'Gram-Schmidt must produce 3 orthonormal basis vectors');
  const dot01 = gsResult.orthonormal[0][0] * gsResult.orthonormal[1][0] + gsResult.orthonormal[0][1] * gsResult.orthonormal[1][1] + gsResult.orthonormal[0][2] * gsResult.orthonormal[1][2];
  assert(Math.abs(dot01) < 1e-4, 'Gram-Schmidt vectors must be mutually orthogonal');

  const fourier = computeFourierSeries('square', 5, [-Math.PI, Math.PI], 50);
  assert(fourier.length === 51, 'Fourier series generator must return 51 evaluation points');

  const mobiusMesh = generateParametricSurfaceMesh('mobius', 16, 16, {});
  assert(mobiusMesh.vertices.length > 0 && mobiusMesh.faces.length > 0, 'Möbius 3D surface generator must generate valid vertices and faces');
  assert(!isNaN(mobiusMesh.bounds.minX) && !isNaN(mobiusMesh.bounds.maxX), 'Surface bounding box must contain non-NaN numbers');

  const torusMesh = generateParametricSurfaceMesh('torus', 16, 16, { R: 3, r: 1 });
  assert(torusMesh.faces.length === 16 * 16, `Torus mesh with 16x16 steps must yield 256 quad faces`);

  const complexVal = evaluateComplexFunction('sqrt', -1, 0);
  assert(Math.abs(complexVal.u) < 1e-5 && Math.abs(complexVal.v - 1.0) < 1e-5, 'Complex sqrt(-1) must evaluate to 0 + 1i');
  assert(complexVal.isDiscontinuity, 'Negative real axis must be flagged as a branch cut discontinuity for sqrt');

  // --- Test Group 10: Automated Mathematical Theorem Verification ---
  console.log('\n--- Test Group 10: Automated Mathematical Theorem Verification ---');
  const csVerif = verifyCauchySchwarz({ dim: 4 }, 500);
  assert(csVerif.passed && csVerif.sampleCount === 500, `Cauchy-Schwarz Monte Carlo verification must pass (maxError = ${csVerif.maxError.toExponential(3)})`);

  const ftcVerif = verifyFTC({ a: 0, b: 2 }, 50);
  assert(ftcVerif.passed, `FTC numerical integral verification must pass (maxError = ${ftcVerif.maxError.toExponential(3)})`);

  const stokesVerif = verifyStokes({}, 30);
  assert(stokesVerif.passed, `Stokes theorem boundary vs flux verification must pass (maxError = ${stokesVerif.maxError.toExponential(3)})`);

  const fermatVerif = verifyFermat({ p: 17 }, 20);
  assert(fermatVerif.passed, 'Fermat Little Theorem modular exponentiation verification must pass');

  const energyVerif = verifyEnergyConservation('harmonic', 0.05, 100);
  assert(energyVerif.passed, `Harmonic oscillator Hamiltonian energy conservation must pass (maxError = ${energyVerif.maxError.toExponential(3)})`);

  const csContracts = getVerificationContractsForNode('thm-cauchy-schwarz');
  assert(csContracts.length >= 1, 'Must retrieve at least 1 verification contract for Cauchy-Schwarz theorem');

  const executedContract = executeVerificationContract(csContracts[0]);
  assert(executedContract.passed, 'executeVerificationContract must return a passed result in typescript mode');

  // --- Test Group 11: ZFC Campaign Progression Engine (M2) ---
  console.log('\n--- Test Group 11: ZFC Campaign Progression Engine (M2) ---');
  assert(campaignEpochs.length === 6, 'Campaign engine must define exactly 6 civilization epochs');
  const epochNumbers = campaignEpochs.map((e) => e.epochNumber);
  assert(JSON.stringify(epochNumbers) === JSON.stringify([1, 2, 3, 4, 5, 6]), 'All 6 epochs must be sequentially ordered from 1 to 6');

  const axiomList = Object.values(zfcAxiomRegistry);
  assert(axiomList.length === 9, `ZFC axiom registry must contain exactly 9 foundational axioms (found ${axiomList.length})`);
  assert(axiomList.every((a) => a.firstOrderFormulaLatex.length > 5), 'All 9 ZFC axioms must have valid first-order logic LaTeX formulas');

  const initialProgress = createInitialProgress();
  assert(initialProgress.unlockedEpochs.includes(1), 'Initial user progress must start with Epoch 1 unlocked');
  assert(initialProgress.unlockedAxioms.includes('AXIOM_EXTENSIONALITY') && initialProgress.unlockedAxioms.includes('AXIOM_EMPTY_SET'), 'Epoch 1 should provide Extensionality & Empty Set initially');
  assert(initialProgress.inventoryEntities.includes('entity-empty-set'), 'Initial inventory must contain empty set (∅)');
  assert(initialProgress.totalXp === 100, 'Initial progress starts at 100 base XP');

  const afterAxiom = unlockAxiom(initialProgress, 'AXIOM_INFINITY');
  assert(afterAxiom.unlockedAxioms.includes('AXIOM_INFINITY'), 'unlockAxiom must add Axiom of Infinity to unlockedAxioms');
  assert(afterAxiom.totalXp === 130, 'unlockAxiom must award +30 XP (100 + 30 = 130)');

  const idempotentAxiom = unlockAxiom(afterAxiom, 'AXIOM_INFINITY');
  assert(idempotentAxiom.totalXp === 130, 'unlocking already-unlocked axiom must be idempotent (no double XP)');

  const synthCheck = canSynthesizeEntity(initialProgress, 'entity-natural-numbers-omega');
  assert(!synthCheck.canSynthesize && synthCheck.missingAxioms.includes('AXIOM_INFINITY'), 'Synthesizing natural numbers set ω without Axiom of Infinity must fail prerequisite check');

  const synthEmptyAgain = synthesizeEntity(initialProgress, 'entity-empty-set');
  assert(synthEmptyAgain.success, 'Synthesizing already-owned entity returns success = true');

  const step1Check = verifyMilestoneStep(1, 1, 'AXIOM_EXTENSIONALITY', '\\forall z (z \\in A \\iff z \\in B) \\implies A = B');
  assert(step1Check.isCorrect, 'Epoch 1 Step 1 with Axiom of Extensionality and correct formula must pass');

  const step1WrongAxiom = verifyMilestoneStep(1, 1, 'AXIOM_CHOICE', '\\forall z (z \\in A \\iff z \\in B) \\implies A = B');
  assert(!step1WrongAxiom.isCorrect, 'Epoch 1 Step 1 with wrong axiom (Choice) must fail verification');

  const step1WrongFormula = verifyMilestoneStep(1, 1, 'AXIOM_EXTENSIONALITY', 'A = B \\implies A \\neq B');
  assert(!step1WrongFormula.isCorrect, 'Epoch 1 Step 1 with incorrect formula must fail verification');

  const completeEpoch1 = completeEpochChallenge(initialProgress, 1);
  assert(completeEpoch1.rewardedXp === 150 && completeEpoch1.progress.totalXp === 250, 'Completing Epoch 1 milestone challenge must award +150 XP');
  assert(completeEpoch1.progress.unlockedEpochs.includes(2), 'Completing Epoch 1 challenge must auto-unlock Epoch 2');
  assert(completeEpoch1.badgeAwarded === '虚空奠基者 (Void Founder)', 'Must award correct badge title (got "虚空奠基者 (Void Founder)")');

  assert(calculateUserLevel(0).level === 1, '0 XP must map to Level 1 虚空学徒');
  assert(calculateUserLevel(250).level === 2, '250 XP must map to Level 2 公理建构师');
  assert(calculateUserLevel(600).level === 3, '600 XP must map to Level 3 代数拓荒者');
  assert(calculateUserLevel(1000).level === 4, '1000 XP must map to Level 4 连续统探险家');
  assert(calculateUserLevel(1600).level === 5, '1600 XP must map to Level 5 流形制图师');
  assert(calculateUserLevel(2500).level === 6, '2500 XP must map to Level 6 形式化大宗师');

  // --- Test Group 12: Fallacy Detective Lab Engine (M2) ---
  console.log('\n--- Test Group 12: Fallacy Detective Lab Engine (M2) ---');
  const allCases = getFallacyCases();
  assert(allCases.length === 6, `Fallacy lab must contain exactly 6 case dossiers (found ${allCases.length})`);

  const allCategories = getFallacyCategories();
  assert(allCategories.length === 6, `Taxonomy must define exactly 6 fallacy categories (found ${allCategories.length})`);
  assert(allCategories.every((cat) => allCases.some((c) => c.flawType === cat.type)), 'All 6 fallacy taxonomy categories must have representative case studies');

  for (const c of allCases) {
    const flawedSteps = c.steps.filter((s) => s.isFlawed);
    assert(flawedSteps.length === 1, `Case ${c.caseCode} must have exactly 1 flawed step (found ${flawedSteps.length})`);
  }

  const case1 = getFallacyCaseById('case-zero-div');
  assert(case1 !== undefined, 'Case 1 (case-zero-div) must exist');
  assert(case1!.flawType === 'FLAW_ZERO_DIV', 'Case 1 must be categorized as FLAW_ZERO_DIV');

  const accusation1 = accuseProofStep('case-zero-div', 4, 'FLAW_ZERO_DIV');
  assert(accusation1.isFlawedStep && accusation1.flawCategoryMatches, 'Accusing Step 4 with FLAW_ZERO_DIV must succeed with full match');
  assert(accusation1.pointsEarned === 100, `Full match must award 100 points (got ${accusation1.pointsEarned})`);

  const accusationWrongCategory = accuseProofStep('case-zero-div', 4, 'FLAW_DIVERGENT');
  assert(accusationWrongCategory.isFlawedStep && !accusationWrongCategory.flawCategoryMatches, 'Accusing Step 4 with mismatched category must flag partial success');
  assert(accusationWrongCategory.pointsEarned === 40, `Partial match must award 40 points (got ${accusationWrongCategory.pointsEarned})`);

  const accusationWrongStep = accuseProofStep('case-zero-div', 2, 'FLAW_ZERO_DIV');
  assert(!accusationWrongStep.isFlawedStep, 'Accusing valid step 2 must fail with 0 points');

  assert(allCases.every((c) => c.leanDisproofSnippet && c.leanDisproofSnippet.length > 20), 'All 6 fallacy cases must include formal Lean 4 disproof snippets');

  assert(getCaseStats([]).detectiveTitle.includes('见习'), '0 solved cases must yield 见习逻辑侦探 title');
  assert(getCaseStats(['case-zero-div', 'case-branch-cut']).detectiveTitle.includes('专家'), '2 solved cases must yield 悖论鉴别专家 title');
  assert(getCaseStats(['case-zero-div', 'case-branch-cut', 'case-divergent-geom', 'case-staircase-pi']).detectiveTitle.includes('审判官'), '4 solved cases must yield 高阶数学审判官 title');
  assert(getCaseStats(allCases.map((c) => c.id)).detectiveTitle.includes('大宗师'), '6 solved cases must yield 大宗师逻辑法官 title');

  // --- Test Group 13: 3D Knowledge Cosmos & Prerequisite Closure Engine (M3) ---
  console.log('\n--- Test Group 13: 3D Knowledge Cosmos & Prerequisite Closure Engine (M3) ---');
  const nebulaList = Object.values(COSMIC_NEBULAE);
  assert(nebulaList.length === 6, `Must define exactly 6 cosmic discipline nebulae (found ${nebulaList.length})`);
  assert(
    nebulaList.some((n) => n.id === 'analysis') &&
      nebulaList.some((n) => n.id === 'algebra') &&
      nebulaList.some((n) => n.id === 'topology'),
    'Must contain Analysis, Algebra, and Topology nebulae'
  );
  assert(
    nebulaList.some((n) => n.id === 'number-theory') &&
      nebulaList.some((n) => n.id === 'logic') &&
      nebulaList.some((n) => n.id === 'applied-math'),
    'Must contain Number Theory, Logic, and Applied Math nebulae'
  );
  assert(nebulaList.every((n) => Array.isArray(n.centroid) && n.centroid.length === 3 && typeof n.centroid[0] === 'number'), 'All 6 nebula centroids must be valid 3D coordinate tuples');

  assert(mapDisciplineToNebula('linear-algebra').id === 'applied-math', 'linear-algebra discipline must map to applied-math nebula');
  assert(mapDisciplineToNebula('number_theory').id === 'number-theory', 'number_theory discipline alias must map to number-theory nebula');

  const depths = computeTopologicalDepths(initialMathNodes);
  assert(depths.size === initialMathNodes.length, `Depths must be computed for all ${initialMathNodes.length} nodes`);
  assert(depths.get('def-limit-sequence') === 0, `Root definition Limit of Sequence must be at depth 0 (got ${depths.get('def-limit-sequence')})`);
  assert(depths.get('def-group') === 0, `Root definition Group must be at depth 0 (got ${depths.get('def-group')})`);
  assert(depths.get('thm-ftc') === 1, `FTC must have topological depth 1 (got ${depths.get('thm-ftc')})`);
  assert(depths.get('thm-stokes') === 2, `Stokes must have topological depth 2 (got ${depths.get('thm-stokes')})`);
  assert(depths.get('thm-ftc')! < depths.get('thm-stokes')!, 'FTC depth (1) must be strictly less than Stokes depth (2)');

  assert(getOrbitalShell(0, 'AXIOM').shellIndex === 0, 'Axiom must map to Shell 0 Galactic Core');
  assert(getOrbitalShell(0, 'DEFINITION').shellIndex === 1, 'Root definition must map to Shell 1 Inner Nebula Ring');
  assert(getOrbitalShell(2, 'THEOREM').shellIndex === 3, 'Stokes theorem must map to Shell 3 Outer Spiral Arms');

  const hasseEdges = computeTransitiveReduction(initialMathNodes);
  assert(hasseEdges.length <= 18 && hasseEdges.length > 0, `Hasse reduction must produce valid essential edges (${hasseEdges.length} <= 18)`);

  const syntheticTriangle = [
    { ...initialMathNodes[0], id: 'syn-A', dependencies: [], dependents: ['syn-B', 'syn-C'] },
    { ...initialMathNodes[0], id: 'syn-B', dependencies: ['syn-A'], dependents: ['syn-C'] },
    { ...initialMathNodes[0], id: 'syn-C', dependencies: ['syn-A', 'syn-B'], dependents: [] },
  ];
  const triangleReduction = computeTransitiveReduction(syntheticTriangle);
  const hasRedundantEdge = triangleReduction.some((e) => e.from === 'syn-C' && e.to === 'syn-A');
  assert(!hasRedundantEdge, 'Transitive reduction must remove redundant shortcut edge syn-C -> syn-A');
  assert(triangleReduction.length === 2, 'Triangle DAG must reduce from 3 edges to exactly 2 essential Hasse edges');

  // Minimum Prerequisite Closure & Learning Pathways
  const stokesClosure = computeMinimumPrerequisiteClosure('thm-stokes', ['def-limit-sequence'], initialMathNodes);
  assert(stokesClosure !== null, 'Stokes minimum prerequisite closure must compute successfully');
  assert(stokesClosure!.targetNode.id === 'thm-stokes', 'Closure target node must be Stokes theorem');
  assert(stokesClosure!.learnedPrerequisiteNodes.some((n) => n.id === 'def-limit-sequence'), 'Learned prerequisites must include Limit Sequence');
  assert(stokesClosure!.unlearnedPrerequisiteNodes.some((n) => n.id === 'thm-ftc'), 'Unlearned prerequisites must include FTC');
  assert(stokesClosure!.learningSequence.length === stokesClosure!.unlearnedPrerequisiteNodes.length + 1, 'Learning sequence must include unlearned nodes + target');
  assert(stokesClosure!.learningSequence[stokesClosure!.learningSequence.length - 1].id === 'thm-stokes', 'Learning sequence must end with target theorem');

  // Fully learned scenario
  const allPrereqs = stokesClosure!.allPrerequisiteIds;
  const fullLearnedClosure = computeMinimumPrerequisiteClosure('thm-stokes', allPrereqs, initialMathNodes);
  assert(fullLearnedClosure!.readinessPercentage === 100, 'When all prerequisites are known, readiness percentage must be 100%');
  assert(fullLearnedClosure!.unlearnedPrerequisiteNodes.length === 0, 'When all prerequisites are known, unlearned list must be empty');

  // Critical Bottleneck Theorem Scoring
  const bottlenecks = calculateCriticalBottlenecks(allPrereqs, initialMathNodes);
  assert(bottlenecks.length > 0, 'Must calculate critical bottleneck theorems for prerequisite closure');
  assert(bottlenecks[0].betweennessScore > 0, `Top bottleneck must have positive betweenness score (got ${bottlenecks[0].betweennessScore})`);
  assert(bottlenecks[0].reason.length > 0, 'Bottleneck must include descriptive mathematical rationale');

  // 3D Cosmos Layout & Physics Numerical Stability
  const cosmos3D = compute3DCosmosLayout(initialMathNodes);
  assert(cosmos3D.size === initialMathNodes.length, `3D Cosmos layout must position all ${initialMathNodes.length} nodes`);

  const allCoordsValid = Array.from(cosmos3D.values()).every(
    (pos) => !isNaN(pos.x) && !isNaN(pos.y) && !isNaN(pos.z) && isFinite(pos.x) && isFinite(pos.y) && isFinite(pos.z)
  );
  assert(allCoordsValid, 'All 3D cosmos node positions must be finite and non-NaN');

  const withinCosmicBounds = Array.from(cosmos3D.values()).every(
    (pos) => Math.abs(pos.x) < 600 && Math.abs(pos.y) < 600 && Math.abs(pos.z) < 600
  );
  assert(withinCosmicBounds, 'All node coordinates must reside within cosmic bounding box [-600, 600]^3');

  // --- Test Group 14: Cross-Module End-to-End Platform Integration (M5) ---
  console.log('\n--- Test Group 14: Cross-Module End-to-End Platform Integration (M5) ---');
  const e2eResult = runE2EIntegrationTests();
  passed += e2eResult.passed;
  failed += e2eResult.failed;
  assert(e2eResult.failed === 0, `E2E Integration test suite must pass with 0 failures (${e2eResult.passed} assertions passed)`);

  // --- Test Group 15: i18n & Multi-Language Separation Architecture ---
  console.log('\n--- Test Group 15: i18n & Multi-Language Separation Architecture ---');
  function getAllKeys(obj: any, prefix = ''): string[] {
    let keys: string[] = [];
    for (const k of Object.keys(obj)) {
      const fullKey = prefix ? `${prefix}.${k}` : k;
      if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
        keys = keys.concat(getAllKeys(obj[k], fullKey));
      } else {
        keys.push(fullKey);
      }
    }
    return keys;
  }

  const zhKeys = getAllKeys(zh).sort();
  const enKeys = getAllKeys(en).sort();
  const missingInEn = zhKeys.filter((k) => !enKeys.includes(k));
  const missingInZh = enKeys.filter((k) => !zhKeys.includes(k));

  assert(missingInEn.length === 0, `i18n Parity: Missing keys in English dictionary (${missingInEn.join(', ')})`);
  assert(missingInZh.length === 0, `i18n Parity: Missing keys in Chinese dictionary (${missingInZh.join(', ')})`);
  assert(zhKeys.length >= 50, `i18n Dictionary must contain at least 50 localized keys (found ${zhKeys.length})`);

  // Test Node text decoupling
  const testNode = byId('thm-cauchy-schwarz');
  const zhTitle = getNodeTitle(testNode, 'zh');
  const enTitle = getNodeTitle(testNode, 'en');
  assert(zhTitle.includes('柯西'), 'getNodeTitle(zh) must return clean Chinese title');
  assert(!zhTitle.includes('Cauchy'), 'getNodeTitle(zh) must not leak English name');
  assert(enTitle.includes('Cauchy'), 'getNodeTitle(en) must return clean English title');

  // Test Discipline localization
  const analysisDisc = disciplines.find((d) => d.id === 'analysis')!;
  assert(getDisciplineName(analysisDisc, 'zh') === '实分析与微积分', 'Discipline zh name matches');
  assert(getDisciplineName(analysisDisc, 'en') === 'Real Analysis & Calculus', 'Discipline en name matches');

  // Test NodeType localization
  assert(getNodeTypeLabel('THEOREM', 'zh').includes('定理'), 'NodeType THM zh localized');
  assert(getNodeTypeLabel('THEOREM', 'en') === 'Theorem', 'NodeType THM en localized');
  assert(getNodeTypeLabel('AXIOM', 'en') === 'Axiom', 'NodeType AXIOM en localized');

  console.log('\n==========================================');
  console.log(`📊 Total Unified Test Results: ${passed} passed, ${failed} failed`);
  console.log('==========================================');

  if (failed > 0) {
    process.exit(1);
  }
}

function byId(id: string) {
  return initialMathNodes.find((n) => n.id === id)!;
}

runTestSuite();
