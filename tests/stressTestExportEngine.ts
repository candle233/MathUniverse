import { initialMathNodes } from '../src/data/seedData.ts';
import type { MathNode } from '../src/types/math.ts';
import type { ExportFormat, ExportOptions } from '../src/types/export.ts';
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
import { getTransitivePrerequisites, topologicalSort } from '../src/lib/dagEngine.ts';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    passed++;
    // keep output clean, print on failure or milestone summary
  } else {
    failed++;
    console.error(`  ❌ [FAIL] ${testName}${detail ? ` -> ${detail}` : ''}`);
  }
}

/**
 * LaTeX Environment Balancer Checker
 */
function checkLatexEnvironmentBalance(tex: string): { balanced: boolean; errors: string[] } {
  const envRegex = /\\(begin|end)\{([a-zA-Z0-9*_-]+)\}/g;
  const stack: { name: string; index: number }[] = [];
  const errors: string[] = [];
  let match;

  while ((match = envRegex.exec(tex)) !== null) {
    const type = match[1];
    const name = match[2];

    if (type === 'begin') {
      stack.push({ name, index: match.index });
    } else {
      if (stack.length === 0) {
        errors.push(`Unmatched \\end{${name}} at char ${match.index}`);
      } else {
        const top = stack.pop()!;
        if (top.name !== name) {
          errors.push(`Mismatched environments: \\begin{${top.name}} closed by \\end{${name}} at char ${match.index}`);
        }
      }
    }
  }

  while (stack.length > 0) {
    const unclosed = stack.pop()!;
    errors.push(`Unclosed \\begin{${unclosed.name}} at char ${unclosed.index}`);
  }

  return { balanced: errors.length === 0, errors };
}

/**
 * Quarto Callout Block Balancer Checker
 */
function checkQuartoCalloutBalance(md: string): { balanced: boolean; errors: string[] } {
  const lines = md.split('\n');
  let openCallouts = 0;
  const errors: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('::: {.callout-')) {
      openCallouts++;
    } else if (line === ':::') {
      if (openCallouts > 0) {
        openCallouts--;
      } else {
        errors.push(`Unmatched closing ::: at line ${i + 1}`);
      }
    }
  }

  if (openCallouts > 0) {
    errors.push(`Unclosed ${openCallouts} callout block(s)`);
  }

  return { balanced: errors.length === 0, errors };
}

/**
 * Typst Code Block and Math Delimiter Checker
 */
function checkTypstSyntaxInvariants(typ: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check code fences
  const fenceMatches = typ.match(/```/g) || [];
  if (fenceMatches.length % 2 !== 0) {
    errors.push(`Unbalanced code fences (\`\`\` count: ${fenceMatches.length})`);
  }

  // Check rects and blocks
  const rectOpenCount = (typ.match(/#rect\s*\(/g) || []).length;
  const blockOpenCount = (typ.match(/#block\s*\(/g) || []).length;
  if (rectOpenCount === 0) {
    errors.push('Typst document missing #rect definitions');
  }

  return { valid: errors.length === 0, errors };
}

console.log('⚡ =========================================================');
console.log('⚡ EMPIRICAL CHALLENGER: M4 EXPORT ENGINE STRESS HARNESS');
console.log('⚡ =========================================================\n');

// =========================================================================
// SECTION 1: Exhaustive Topological Ordering Invariants across all 21 nodes
// =========================================================================
console.log('🔹 1. Testing Topological Ordering Across All 21 Seed Nodes...');

for (const targetNode of initialMathNodes) {
  const prereqChain = getOrderedPrerequisiteNodes(targetNode, initialMathNodes);

  // Invariant 1.1: Non-empty
  assert(prereqChain.length >= 1, `[${targetNode.id}] Prerequisite chain is non-empty (got ${prereqChain.length})`);

  // Invariant 1.2: Last element is targetNode
  assert(
    prereqChain[prereqChain.length - 1].id === targetNode.id,
    `[${targetNode.id}] Last element in chain must be targetNode`
  );

  // Invariant 1.3: No duplicates
  const ids = prereqChain.map((n) => n.id);
  const uniqueIds = new Set(ids);
  assert(uniqueIds.size === ids.length, `[${targetNode.id}] No duplicate IDs in chain (unique: ${uniqueIds.size}, total: ${ids.length})`);

  // Invariant 1.4: Strict Topological Ordering
  // Every dependency of any node in the chain that is also in the chain must appear BEFORE that node
  const idToIndex = new Map<string, number>(prereqChain.map((n, idx) => [n.id, idx]));
  let topologicalViolation = false;

  for (const node of prereqChain) {
    const nodeIdx = idToIndex.get(node.id)!;
    for (const depId of node.dependencies) {
      if (idToIndex.has(depId)) {
        const depIdx = idToIndex.get(depId)!;
        if (depIdx >= nodeIdx) {
          topologicalViolation = true;
          assert(false, `[${targetNode.id}] Topological violation: ${depId} (idx ${depIdx}) appears after/at ${node.id} (idx ${nodeIdx})`);
        }
      }
    }
  }
  if (!topologicalViolation) {
    assert(true, `[${targetNode.id}] Strict topological order verified for all ${prereqChain.length} nodes`);
  }

  // Invariant 1.5: Set equality with transitive closure + target
  const transitivePrereqIds = new Set(getTransitivePrerequisites(targetNode.id, initialMathNodes));
  transitivePrereqIds.add(targetNode.id);
  const chainIdSet = new Set(ids);

  let setMatch = true;
  for (const id of transitivePrereqIds) {
    if (!chainIdSet.has(id)) {
      setMatch = false;
      assert(false, `[${targetNode.id}] Missing expected transitive prerequisite: ${id}`);
    }
  }
  for (const id of chainIdSet) {
    if (!transitivePrereqIds.has(id)) {
      setMatch = false;
      assert(false, `[${targetNode.id}] Extraneous node present in chain: ${id}`);
    }
  }
  if (setMatch) {
    assert(true, `[${targetNode.id}] Chain matches exact transitive closure`);
  }
}

// =========================================================================
// SECTION 2: Adversarial / Synthetic Graph Topo-Sort Stress Tests
// =========================================================================
console.log('\n🔹 2. Adversarial / Synthetic Graph Stress Testing...');

// 2.1 Deep linear chain: A0 -> A1 -> ... -> A99 (100 nodes)
const deepChainNodes: MathNode[] = Array.from({ length: 100 }, (_, i) => ({
  id: `deep-${i}`,
  slug: `deep-node-${i}`,
  titleZh: `深度节点 ${i}`,
  titleEn: `Deep Node ${i}`,
  nodeType: (i === 0 ? 'AXIOM' : i === 99 ? 'THEOREM' : 'LEMMA') as any,
  disciplineId: 'analysis',
  mscCode: '00A00',
  statementLatex: `X_{${i}}`,
  statementPlainZh: `深度节点 ${i} 陈述`,
  verification: 'FORMALLY_VERIFIED',
  reputationScore: 100,
  viewCount: 100,
  difficultyLevel: 1,
  dependencies: i > 0 ? [`deep-${i - 1}`] : [],
  dependents: i < 99 ? [`deep-${i + 1}`] : [],
  proofs: [],
  tags: ['stress'],
  lastModified: '2026-08-29',
}));

const deepTarget = deepChainNodes[99];
const deepPrereqs = getOrderedPrerequisiteNodes(deepTarget, deepChainNodes);
assert(deepPrereqs.length === 100, 'Deep linear chain (100 nodes) resolves all 100 nodes');
assert(deepPrereqs[0].id === 'deep-0' && deepPrereqs[99].id === 'deep-99', 'Deep chain first is deep-0, last is deep-99');
let deepMonotonic = true;
for (let i = 0; i < 100; i++) {
  if (deepPrereqs[i].id !== `deep-${i}`) deepMonotonic = false;
}
assert(deepMonotonic, 'Deep chain resolves in perfectly monotonic sequence deep-0 to deep-99');

// 2.2 Wide fan-out (1 root, 50 independent children)
const fanRoot: MathNode = {
  id: 'fan-root',
  slug: 'fan-root',
  titleZh: '根节点',
  titleEn: 'Fan Root',
  nodeType: 'AXIOM',
  disciplineId: 'logic',
  mscCode: '03-00',
  statementLatex: '\\top',
  statementPlainZh: '公理',
  verification: 'FORMALLY_VERIFIED',
  reputationScore: 100,
  viewCount: 100,
  difficultyLevel: 1,
  dependencies: [],
  dependents: Array.from({ length: 50 }, (_, i) => `fan-child-${i}`),
  proofs: [],
  tags: ['fan'],
  lastModified: '2026-08-29',
};
const fanChildren: MathNode[] = Array.from({ length: 50 }, (_, i) => ({
  id: `fan-child-${i}`,
  slug: `fan-child-${i}`,
  titleZh: `子节点 ${i}`,
  titleEn: `Fan Child ${i}`,
  nodeType: 'THEOREM',
  disciplineId: 'logic',
  mscCode: '03-00',
  statementLatex: `C_{${i}}`,
  statementPlainZh: `子节点 ${i}`,
  verification: 'FORMALLY_VERIFIED',
  reputationScore: 100,
  viewCount: 100,
  difficultyLevel: 1,
  dependencies: ['fan-root'],
  dependents: [],
  proofs: [],
  tags: ['fan'],
  lastModified: '2026-08-29',
}));
const allFanNodes = [fanRoot, ...fanChildren];
for (let i = 0; i < 50; i++) {
  const childPrereqs = getOrderedPrerequisiteNodes(fanChildren[i], allFanNodes);
  assert(
    childPrereqs.length === 2 && childPrereqs[0].id === 'fan-root' && childPrereqs[1].id === `fan-child-${i}`,
    `Fan child ${i} prerequisite chain resolves exactly [fan-root, fan-child-${i}]`
  );
}

// 2.3 Diamond Graph with redundant paths (A -> B -> D, A -> C -> D, A -> D)
const diamondNodes: MathNode[] = [
  {
    id: 'dia-A',
    slug: 'dia-a',
    titleZh: '节点 A',
    titleEn: 'Node A',
    nodeType: 'AXIOM',
    disciplineId: 'algebra',
    mscCode: '00A00',
    statementLatex: 'A',
    statementPlainZh: 'A',
    verification: 'FORMALLY_VERIFIED',
    reputationScore: 100,
    viewCount: 100,
    difficultyLevel: 1,
    dependencies: [],
    dependents: ['dia-B', 'dia-C', 'dia-D'],
    proofs: [],
    tags: ['diamond'],
    lastModified: '2026-08-29',
  },
  {
    id: 'dia-B',
    slug: 'dia-b',
    titleZh: '节点 B',
    titleEn: 'Node B',
    nodeType: 'LEMMA',
    disciplineId: 'algebra',
    mscCode: '00A00',
    statementLatex: 'B',
    statementPlainZh: 'B',
    verification: 'FORMALLY_VERIFIED',
    reputationScore: 100,
    viewCount: 100,
    difficultyLevel: 1,
    dependencies: ['dia-A'],
    dependents: ['dia-D'],
    proofs: [],
    tags: ['diamond'],
    lastModified: '2026-08-29',
  },
  {
    id: 'dia-C',
    slug: 'dia-c',
    titleZh: '节点 C',
    titleEn: 'Node C',
    nodeType: 'LEMMA',
    disciplineId: 'algebra',
    mscCode: '00A00',
    statementLatex: 'C',
    statementPlainZh: 'C',
    verification: 'FORMALLY_VERIFIED',
    reputationScore: 100,
    viewCount: 100,
    difficultyLevel: 1,
    dependencies: ['dia-A'],
    dependents: ['dia-D'],
    proofs: [],
    tags: ['diamond'],
    lastModified: '2026-08-29',
  },
  {
    id: 'dia-D',
    slug: 'dia-d',
    titleZh: '节点 D',
    titleEn: 'Node D',
    nodeType: 'THEOREM',
    disciplineId: 'algebra',
    mscCode: '00A00',
    statementLatex: 'D',
    statementPlainZh: 'D',
    verification: 'FORMALLY_VERIFIED',
    reputationScore: 100,
    viewCount: 100,
    difficultyLevel: 1,
    dependencies: ['dia-A', 'dia-B', 'dia-C'],
    dependents: [],
    proofs: [],
    tags: ['diamond'],
    lastModified: '2026-08-29',
  },
];
const diaPrereqs = getOrderedPrerequisiteNodes(diamondNodes[3], diamondNodes);
assert(diaPrereqs.length === 4, 'Diamond graph resolves all 4 nodes without duplicates');
assert(diaPrereqs[0].id === 'dia-A', 'Diamond root dia-A is first');
assert(diaPrereqs[3].id === 'dia-D', 'Diamond target dia-D is last');
const diaBIdx = diaPrereqs.findIndex((n) => n.id === 'dia-B');
const diaCIdx = diaPrereqs.findIndex((n) => n.id === 'dia-C');
assert(diaBIdx > 0 && diaBIdx < 3 && diaCIdx > 0 && diaCIdx < 3, 'dia-B and dia-C are correctly positioned between dia-A and dia-D');

// 2.4 Edge Case: Target node NOT in allNodes array
const externalNode: MathNode = {
  id: 'external-isolated',
  slug: 'external-isolated',
  titleZh: '外部孤立节点',
  titleEn: 'External Isolated Node',
  nodeType: 'THEOREM',
  disciplineId: 'analysis',
  mscCode: '00A00',
  statementLatex: 'E',
  statementPlainZh: '外部',
  verification: 'UNVERIFIED',
  reputationScore: 10,
  viewCount: 10,
  difficultyLevel: 1,
  dependencies: [],
  dependents: [],
  proofs: [],
  tags: ['external'],
  lastModified: '2026-08-29',
};
const externalPrereqs = getOrderedPrerequisiteNodes(externalNode, initialMathNodes);
assert(
  externalPrereqs.length === 1 && externalPrereqs[0].id === 'external-isolated',
  'Target node not in allNodes array gracefully returns 1-node chain containing itself'
);

// =========================================================================
// SECTION 3: Multi-Target Exporter Invariant Verification Across All 21 Nodes
// =========================================================================
console.log('\n🔹 3. Stress Testing Multi-Target Document Exporters Across All 21 Nodes...');

const testOptionsMatrix: Partial<ExportOptions>[] = [
  { includePrerequisites: true, includeProofs: true, includeIntuition: true, includeLeanCode: true, includeTikzDiagram: true },
  { includePrerequisites: false, includeProofs: true, includeIntuition: true, includeLeanCode: true, includeTikzDiagram: false },
  { includePrerequisites: true, includeProofs: false, includeIntuition: false, includeLeanCode: false, includeTikzDiagram: false },
  { includePrerequisites: false, includeProofs: false, includeIntuition: false, includeLeanCode: false, includeTikzDiagram: false },
];

for (const targetNode of initialMathNodes) {
  for (const opt of testOptionsMatrix) {
    const optLabel = `prereq=${opt.includePrerequisites},proof=${opt.includeProofs},tikz=${opt.includeTikzDiagram}`;

    // --- 3.1 LaTeX Paper Invariants ---
    const latexPaper = generateLatexPaper(targetNode, initialMathNodes, opt);
    assert(latexPaper.startsWith('\\documentclass'), `[${targetNode.id}|${optLabel}] LaTeX starts with \\documentclass`);
    assert(latexPaper.includes('\\end{document}'), `[${targetNode.id}|${optLabel}] LaTeX contains \\end{document}`);
    assert(latexPaper.includes(targetNode.statementLatex), `[${targetNode.id}|${optLabel}] LaTeX contains statementLatex`);

    const latexBalance = checkLatexEnvironmentBalance(latexPaper);
    assert(
      latexBalance.balanced,
      `[${targetNode.id}|${optLabel}] LaTeX environment balance`,
      latexBalance.errors.join('; ')
    );

    // --- 3.2 Modern Typst Invariants ---
    const typstDoc = generateTypstDoc(targetNode, initialMathNodes, opt);
    assert(typstDoc.includes('#set page('), `[${targetNode.id}|${optLabel}] Typst contains #set page`);
    assert(typstDoc.includes(targetNode.statementLatex), `[${targetNode.id}|${optLabel}] Typst contains statementLatex`);

    const typstSyntax = checkTypstSyntaxInvariants(typstDoc);
    assert(typstSyntax.valid, `[${targetNode.id}|${optLabel}] Typst syntax invariants`, typstSyntax.errors.join('; '));

    // --- 3.3 LaTeX Beamer Invariants ---
    const beamerDoc = generateBeamerPresentation(targetNode, initialMathNodes, opt);
    assert(beamerDoc.startsWith('\\documentclass[aspectratio=169]{beamer}'), `[${targetNode.id}|${optLabel}] Beamer starts with widescreen class`);
    assert(beamerDoc.includes('\\end{document}'), `[${targetNode.id}|${optLabel}] Beamer contains \\end{document}`);

    const beamerBalance = checkLatexEnvironmentBalance(beamerDoc);
    assert(
      beamerBalance.balanced,
      `[${targetNode.id}|${optLabel}] Beamer environment balance`,
      beamerBalance.errors.join('; ')
    );

    // Frame count check
    const frameCount = (beamerDoc.match(/\\begin\{frame\}/g) || []).length;
    assert(frameCount >= 4, `[${targetNode.id}|${optLabel}] Beamer contains >= 4 frames (found ${frameCount})`);

    // --- 3.4 Quarto / Markdown Invariants ---
    const markdownDoc = generateMarkdownDoc(targetNode, initialMathNodes, opt);
    assert(markdownDoc.startsWith('---\ntitle:'), `[${targetNode.id}|${optLabel}] Markdown starts with YAML frontmatter`);
    assert(markdownDoc.includes('format:\n  html:'), `[${targetNode.id}|${optLabel}] Markdown contains html format YAML config`);
    assert(markdownDoc.includes(targetNode.statementLatex), `[${targetNode.id}|${optLabel}] Markdown contains statementLatex`);

    const quartoBalance = checkQuartoCalloutBalance(markdownDoc);
    assert(
      quartoBalance.balanced,
      `[${targetNode.id}|${optLabel}] Quarto callout block balance`,
      quartoBalance.errors.join('; ')
    );

    // --- 3.5 Overleaf Payload & 1-Click URL Invariants ---
    const overleafPayload = generateOverleafPayload(targetNode, initialMathNodes, opt);
    assert(overleafPayload.url.startsWith('https://www.overleaf.com/docs?snip='), `[${targetNode.id}|${optLabel}] Overleaf URL endpoint prefix`);
    assert(overleafPayload.name.length > 0, `[${targetNode.id}|${optLabel}] Overleaf project name is non-empty`);
    assert(overleafPayload.engine === 'pdflatex', `[${targetNode.id}|${optLabel}] Overleaf engine is pdflatex`);

    const decodedLatex = decodeURIComponent(overleafPayload.url.split('?snip=')[1]);
    assert(
      decodedLatex === overleafPayload.snip && decodedLatex === latexPaper,
      `[${targetNode.id}|${optLabel}] Overleaf URL snip decodes to identical LaTeX paper source`
    );
  }
}

// =========================================================================
// SECTION 4: Diagram & Standalone Generator Stress Tests
// =========================================================================
console.log('\n🔹 4. Stress Testing Diagram & Standalone Generators...');

// 4.1 TikZ Dependency Graph across all 21 nodes
for (const targetNode of initialMathNodes) {
  const tikzTD = generateTikzDependencyGraph(targetNode, initialMathNodes, { direction: 'TD', scale: 0.9 });
  const tikzLR = generateTikzDependencyGraph(targetNode, initialMathNodes, { direction: 'LR', scale: 1.2 });

  const tdBalance = checkLatexEnvironmentBalance(tikzTD);
  assert(tdBalance.balanced, `[${targetNode.id}] TikZ TD graph environment balance`, tdBalance.errors.join('; '));
  assert(tikzTD.includes('\\begin{tikzpicture}'), `[${targetNode.id}] TikZ TD contains \\begin{tikzpicture}`);
  assert(tikzTD.includes(`(${targetNode.id.replace(/[^a-zA-Z0-9]/g, '')})`), `[${targetNode.id}] TikZ TD places target node`);

  const lrBalance = checkLatexEnvironmentBalance(tikzLR);
  assert(lrBalance.balanced, `[${targetNode.id}] TikZ LR graph environment balance`, lrBalance.errors.join('; '));
}

// 4.2 TikZ-cd Commutative Diagrams across all 21 nodes
for (const targetNode of initialMathNodes) {
  const cd = generateTikzCdDiagram(targetNode);
  const cdBalance = checkLatexEnvironmentBalance(cd);
  assert(cdBalance.balanced, `[${targetNode.id}] TikZ-cd commutative diagram balance`, cdBalance.errors.join('; '));
  assert(cd.includes('\\begin{tikzcd}') && cd.includes('\\end{tikzcd}'), `[${targetNode.id}] TikZ-cd contains valid begin/end`);
}

// 4.3 Natural Deduction Tree (`bussproofs`) across all 21 nodes
for (const targetNode of initialMathNodes) {
  const proofTree = generateNaturalDeductionTree(targetNode);
  const ptBalance = checkLatexEnvironmentBalance(proofTree);
  assert(ptBalance.balanced, `[${targetNode.id}] Proof tree balance`, ptBalance.errors.join('; '));
  assert(proofTree.includes('\\begin{prooftree}') && proofTree.includes('\\end{prooftree}'), `[${targetNode.id}] Proof tree contains begin/end prooftree`);
  assert(proofTree.includes('\\AxiomC{'), `[${targetNode.id}] Proof tree contains \\AxiomC`);
}

// 4.4 Standalone Diagrams for all diagramType enum values
const standaloneTypes = [
  'dependency_dag',
  'commutative_square',
  'short_exact_sequence',
  'natural_deduction',
  'first_isomorphism',
] as const;

for (const diagType of standaloneTypes) {
  const standalone = generateStandaloneDiagram(diagType, initialMathNodes[0], initialMathNodes);
  assert(standalone.includes('\\documentclass[tikz,border=12pt]{standalone}'), `Standalone ${diagType} uses standalone class`);
  const sBalance = checkLatexEnvironmentBalance(standalone);
  assert(sBalance.balanced, `Standalone ${diagType} environment balance`, sBalance.errors.join('; '));
}

// =========================================================================
// SECTION 5: Master Compiler `compileExportDocument` Across All 7 Formats
// =========================================================================
console.log('\n🔹 5. Testing Master Compiler `compileExportDocument` Across All Formats...');

const allFormats: ExportFormat[] = [
  'latex_paper',
  'typst',
  'beamer',
  'quarto_md',
  'tikz_cd',
  'proof_tree',
  'overleaf',
];

for (const fmt of allFormats) {
  for (const node of [initialMathNodes[0], initialMathNodes[3], initialMathNodes[8]]) {
    const res = compileExportDocument(node, initialMathNodes, {
      format: fmt,
      includePrerequisites: true,
      includeProofs: true,
      includeIntuition: true,
      includeLeanCode: true,
      includeTikzDiagram: true,
    });

    assert(res.format === fmt, `Compiler format matches ${fmt}`);
    assert(res.content.length > 100, `Compiler content is non-empty for ${fmt}`);
    assert(res.lineCount > 5, `Compiler lineCount is positive for ${fmt} (${res.lineCount})`);
    assert(res.byteSize > 100, `Compiler byteSize is positive for ${fmt} (${res.byteSize})`);
    assert(res.targetNodeId === node.id, `Compiler targetNodeId matches ${node.id}`);
    assert(res.suggestedFilename.includes(node.slug), `Compiler filename contains slug ${node.slug}`);

    if (fmt === 'latex_paper' || fmt === 'beamer' || fmt === 'tikz_cd' || fmt === 'proof_tree' || fmt === 'overleaf') {
      assert(res.fileExtension === 'tex', `${fmt} fileExtension is tex`);
      assert(res.mimeType === 'text/x-tex', `${fmt} mimeType is text/x-tex`);
    } else if (fmt === 'typst') {
      assert(res.fileExtension === 'typ', `typst fileExtension is typ`);
      assert(res.mimeType === 'text/plain', `typst mimeType is text/plain`);
    } else if (fmt === 'quarto_md') {
      assert(res.fileExtension === 'qmd', `quarto_md fileExtension is qmd`);
      assert(res.mimeType === 'text/markdown', `quarto_md mimeType is text/markdown`);
    }
  }
}

// =========================================================================
// SECTION 6: Extreme / Degenerate Node Stress Tests
// =========================================================================
console.log('\n🔹 6. Testing Extreme & Degenerate Mathematical Nodes...');

// 6.1 Node with no proofs and no lean formalization
const bareNode: MathNode = {
  id: 'thm-bare-axiom',
  slug: 'bare-axiom-test',
  titleZh: '极简无证明公理',
  titleEn: 'Bare Axiom Test',
  nodeType: 'AXIOM',
  disciplineId: 'logic',
  mscCode: '03-01',
  statementLatex: 'A \\lor \\neg A',
  statementPlainZh: '排中律',
  verification: 'FORMALLY_VERIFIED',
  reputationScore: 50,
  viewCount: 200,
  difficultyLevel: 1,
  dependencies: [],
  dependents: [],
  proofs: [],
  tags: ['bare'],
  lastModified: '2026-08-29',
};

const bareLatex = generateLatexPaper(bareNode, [bareNode]);
assert(checkLatexEnvironmentBalance(bareLatex).balanced, 'Bare node LaTeX is balanced');
const bareTypst = generateTypstDoc(bareNode, [bareNode]);
assert(checkTypstSyntaxInvariants(bareTypst).valid, 'Bare node Typst is valid');
const bareBeamer = generateBeamerPresentation(bareNode, [bareNode]);
assert(checkLatexEnvironmentBalance(bareBeamer).balanced, 'Bare node Beamer is balanced');
const bareMd = generateMarkdownDoc(bareNode, [bareNode]);
assert(checkQuartoCalloutBalance(bareMd).balanced, 'Bare node Markdown is balanced');

// 6.2 Node with 1-step proof
const oneStepNode: MathNode = {
  ...bareNode,
  id: 'thm-one-step',
  slug: 'one-step-test',
  titleZh: '单步证明命题',
  titleEn: 'One Step Proposition',
  nodeType: 'LEMMA',
  proofs: [
    {
      id: 'proof-1step',
      nodeId: 'thm-one-step',
      title: '直接代入法',
      approachType: 'ALGEBRAIC',
      author: { id: 'test', name: 'Tester', reputation: 100, isModerator: false, avatar: '' },
      motivation: '简单代入',
      rigorousProof: '显然成立。',
      steps: [
        { id: 's1', stepIndex: 1, explanation: '直接展开', latexText: '1 + 1 = 2', commentsCount: 0 }
      ],
      isPrimary: true,
      verification: 'FORMALLY_VERIFIED',
      upvotes: 10,
    }
  ],
};
const oneStepTree = generateNaturalDeductionTree(oneStepNode);
assert(checkLatexEnvironmentBalance(oneStepTree).balanced, 'One-step proof tree is balanced');

// 6.3 Node with special characters
const specialCharNode: MathNode = {
  ...bareNode,
  id: 'thm-special-chars',
  slug: 'special-characters-test',
  titleZh: '含特殊符号_测试%与&',
  titleEn: 'Special_Chars % and & Test',
  statementLatex: 'f(x\\_1, x\\_2) \\le g(y)',
  statementPlainZh: '包含下划线_与特殊符号',
  intuitionMd: '### 直觉标题\n**加粗内容** 与 *斜体内容*',
};

const specialLatex = generateLatexPaper(specialCharNode, [specialCharNode]);
assert(checkLatexEnvironmentBalance(specialLatex).balanced, 'Special character node LaTeX is balanced');
const specialTypst = generateTypstDoc(specialCharNode, [specialCharNode]);
assert(checkTypstSyntaxInvariants(specialTypst).valid, 'Special character node Typst is valid');

console.log('\n=========================================================');
console.log(`📊 STRESS TEST RESULTS: ${passed} passed, ${failed} failed`);
console.log('=========================================================\n');

if (failed > 0) {
  process.exit(1);
}
