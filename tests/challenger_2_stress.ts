import { initialMathNodes } from '../src/data/seedData.ts';
import {
  getNodeTitle,
  getNodeStatement,
  getNodeIntuition,
  getNodeHistorical,
  getNodeProofDescription,
  getDisciplineName,
  getNodeTypeLabel,
  NODE_TYPE_LABELS,
} from '../src/lib/i18nHelper.ts';
import {
  compileExportDocument,
  generateLatexPaper,
  generateTypstDoc,
  generateBeamerPresentation,
  generateMarkdownDoc,
  generateStandaloneDiagram,
  generateTikzDependencyGraph,
  generateTikzCdDiagram,
  generateNaturalDeductionTree,
  getOrderedPrerequisiteNodes,
} from '../src/lib/exportEngine.ts';
import {
  topologicalSort,
  checkCircularDependency,
  findDerivationPaths,
  getTransitivePrerequisites,
} from '../src/lib/dagEngine.ts';
import { disciplines } from '../src/data/disciplines.ts';
import type { MathNode, NodeType } from '../types/math.ts';

let passCount = 0;
let failCount = 0;
const failures: string[] = [];

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    passCount++;
    console.log(`  ✅ [PASS] ${testName}`);
  } else {
    failCount++;
    const msg = `  ❌ [FAIL] ${testName}${detail ? ` - ${detail}` : ''}`;
    console.error(msg);
    failures.push(msg);
  }
}

console.log('================================================================');
console.log('🔬 CHALLENGER 2 EMPIRICAL VERIFICATION & STRESS TEST HARNESS');
console.log('================================================================\n');

// ---------------------------------------------------------------------
// SECTION 1: Deep Verification of all 21 Seed Data MathNodes
// ---------------------------------------------------------------------
console.log('--- SECTION 1: Deep Verification of 21 Seed Data MathNodes ---');

assert(initialMathNodes.length === 21, 'Seed nodes count is exactly 21', `Got ${initialMathNodes.length}`);

// Check Chinese Regex & English Regex
const hasChinese = (s: string) => /[\u4e00-\u9fa5]/.test(s);
const hasEnglish = (s: string) => /[a-zA-Z]/.test(s);

// Map of all node IDs to check uniqueness
const idSet = new Set<string>();
const slugSet = new Set<string>();

initialMathNodes.forEach((node, idx) => {
  const prefix = `Node [${idx + 1}/21: ${node.id}]`;

  // ID and Slug uniqueness
  assert(!idSet.has(node.id), `${prefix} id is unique`);
  idSet.add(node.id);
  assert(!slugSet.has(node.slug), `${prefix} slug is unique`);
  slugSet.add(node.slug);

  // 1. Title integrity
  assert(
    Boolean(node.titleZh && node.titleZh.trim().length > 0),
    `${prefix} titleZh is non-empty`,
    `Got "${node.titleZh}"`
  );
  assert(
    hasChinese(node.titleZh),
    `${prefix} titleZh contains Chinese characters`,
    `Got "${node.titleZh}"`
  );
  assert(
    Boolean(node.titleEn && node.titleEn.trim().length > 0),
    `${prefix} titleEn is non-empty`,
    `Got "${node.titleEn}"`
  );
  assert(
    hasEnglish(node.titleEn),
    `${prefix} titleEn contains English characters`,
    `Got "${node.titleEn}"`
  );

  // Check no English parenthetical clumping in titleZh like "极限 (Limit)"
  const englishInParenthesesRegex = /\([a-zA-Z\s]{3,}\)/;
  assert(
    !englishInParenthesesRegex.test(node.titleZh),
    `${prefix} titleZh has no parenthetical English clumping`,
    `Found clumping in "${node.titleZh}"`
  );

  // Check no Chinese in titleEn
  assert(
    !hasChinese(node.titleEn),
    `${prefix} titleEn contains zero Chinese characters`,
    `Found Chinese in "${node.titleEn}"`
  );

  // 2. Statement integrity
  assert(
    Boolean(node.statementLatex && node.statementLatex.trim().length > 0),
    `${prefix} statementLatex is intact and non-empty`
  );
  assert(
    Boolean(node.statementPlainZh && node.statementPlainZh.trim().length > 0),
    `${prefix} statementPlainZh is non-empty`
  );
  assert(
    Boolean(node.statementPlainEn && node.statementPlainEn.trim().length > 0),
    `${prefix} statementPlainEn is non-empty`
  );

  // 3. Intuition integrity
  assert(
    Boolean(node.intuitionMd && node.intuitionMd.trim().length > 0),
    `${prefix} intuitionMd (Chinese intuition) is non-empty`
  );
  assert(
    Boolean(node.intuitionEn && node.intuitionEn.trim().length > 0),
    `${prefix} intuitionEn is non-empty`
  );

  // 4. Historical Context integrity
  assert(
    Boolean(node.historicalContextZh && node.historicalContextZh.trim().length > 0),
    `${prefix} historicalContextZh is non-empty`
  );
  assert(
    Boolean(node.historicalContextEn && node.historicalContextEn.trim().length > 0),
    `${prefix} historicalContextEn is non-empty`
  );

  // 5. Proofs integrity (if proofs exist)
  if (node.proofs && node.proofs.length > 0) {
    node.proofs.forEach((p, pIdx) => {
      assert(
        Boolean(p.rigorousProof && p.rigorousProof.trim().length > 0),
        `${prefix} proof #${pIdx + 1} has rigorous proof text`
      );
      if (p.steps && p.steps.length > 0) {
        p.steps.forEach((s, sIdx) => {
          assert(
            Boolean(s.latexText && s.latexText.trim().length > 0),
            `${prefix} proof #${pIdx + 1} step #${sIdx + 1} has latexText`
          );
        });
      }
    });
  }

  // 6. Lean Formalization integrity (if present)
  if (node.leanFormalization) {
    assert(
      Boolean(node.leanFormalization.leanCode && node.leanFormalization.leanCode.trim().length > 0),
      `${prefix} Lean formalization code is non-empty`
    );
    assert(
      Boolean(node.leanFormalization.theoremName && node.leanFormalization.theoremName.trim().length > 0),
      `${prefix} Lean theorem name is valid`
    );
  }

  // 7. Dependencies refer to existing nodes
  node.dependencies.forEach((depId) => {
    assert(
      initialMathNodes.some((n) => n.id === depId),
      `${prefix} dependency "${depId}" exists in initialMathNodes`
    );
  });
});

// ---------------------------------------------------------------------
// SECTION 2: Empirical Stress-Testing of i18n Helpers & Fallback Matrix
// ---------------------------------------------------------------------
console.log('\n--- SECTION 2: i18n Helpers & Fallback Matrix ---');

// Test synthetic node with missing English fields
const nodeOnlyZh: MathNode = {
  id: 'synth-zh-only',
  slug: 'synth-zh-only',
  titleZh: '纯中文命题',
  titleEn: '',
  nodeType: 'THEOREM',
  disciplineId: 'analysis',
  mscCode: '26A00',
  statementLatex: 'E = mc^2',
  statementPlainZh: '这是纯中文陈述',
  statementPlainEn: '',
  intuitionMd: '这是纯中文直觉',
  intuitionEn: '',
  historicalContextZh: '这是纯中文历史背景',
  historicalContextEn: '',
  verification: 'UNVERIFIED',
  reputationScore: 10,
  viewCount: 10,
  difficultyLevel: 1,
  dependencies: [],
  dependents: [],
  proofs: [
    {
      id: 'p-zh',
      nodeId: 'synth-zh-only',
      title: '中文证明',
      approachType: 'ANALYTIC',
      author: { id: 'u1', name: 'Author', reputation: 100, avatar: '', isModerator: false },
      motivation: '中文动机',
      rigorousProof: '中文严格证明',
      steps: [],
      isPrimary: true,
      verification: 'UNVERIFIED',
      upvotes: 1,
    },
  ],
};

assert(getNodeTitle(nodeOnlyZh, 'en') === '纯中文命题', 'getNodeTitle falls back to titleZh when titleEn is empty');
assert(getNodeStatement(nodeOnlyZh, 'en') === '这是纯中文陈述', 'getNodeStatement falls back to statementPlainZh when statementPlainEn is empty');
assert(getNodeIntuition(nodeOnlyZh, 'en') === '这是纯中文直觉', 'getNodeIntuition falls back to intuitionMd when intuitionEn is empty');
assert(getNodeHistorical(nodeOnlyZh, 'en') === '这是纯中文历史背景', 'getNodeHistorical falls back to historicalContextZh when historicalContextEn is empty');
assert(getNodeProofDescription(nodeOnlyZh, 'en') === '中文严格证明', 'getNodeProofDescription falls back to rigorousProof when EN is empty');

// Test synthetic node with missing Chinese fields
const nodeOnlyEn: MathNode = {
  id: 'synth-en-only',
  slug: 'synth-en-only',
  titleZh: '',
  titleEn: 'Pure English Theorem',
  nodeType: 'LEMMA',
  disciplineId: 'algebra',
  mscCode: '20A00',
  statementLatex: 'a * b = b * a',
  statementPlainZh: '',
  statementPlainEn: 'This is pure English statement',
  intuitionMd: '',
  intuitionEn: 'This is pure English intuition',
  historicalContextZh: '',
  historicalContextEn: 'This is pure English historical context',
  verification: 'COMMUNITY_VERIFIED',
  reputationScore: 20,
  viewCount: 20,
  difficultyLevel: 2,
  dependencies: [],
  dependents: [],
  proofs: [
    {
      id: 'p-en',
      nodeId: 'synth-en-only',
      title: 'English Proof',
      approachType: 'ALGEBRAIC',
      author: { id: 'u2', name: 'Author2', reputation: 200, avatar: '', isModerator: false },
      motivation: 'English Motivation',
      rigorousProof: 'English Rigorous Proof',
      steps: [],
      isPrimary: true,
      verification: 'COMMUNITY_VERIFIED',
      upvotes: 2,
    },
  ],
};

assert(getNodeTitle(nodeOnlyEn, 'zh') === 'Pure English Theorem', 'getNodeTitle falls back to titleEn when titleZh is empty');
assert(getNodeStatement(nodeOnlyEn, 'zh') === 'This is pure English statement', 'getNodeStatement falls back to statementPlainEn when statementPlainZh is empty');
assert(getNodeIntuition(nodeOnlyEn, 'zh') === 'This is pure English intuition', 'getNodeIntuition falls back to intuitionEn when intuitionMd is empty');
assert(getNodeHistorical(nodeOnlyEn, 'zh') === 'This is pure English historical context', 'getNodeHistorical falls back to historicalContextEn when historicalContextZh is empty');
assert(getNodeProofDescription(nodeOnlyEn, 'zh') === 'English Rigorous Proof', 'getNodeProofDescription falls back to rigorousProof when ZH is empty');

// Test completely empty node
const emptyNode: MathNode = {
  id: 'empty-node',
  slug: 'empty-node',
  titleZh: '',
  titleEn: '',
  nodeType: 'AXIOM',
  disciplineId: 'analysis',
  mscCode: '00-00',
  statementLatex: '',
  verification: 'UNVERIFIED',
  reputationScore: 0,
  viewCount: 0,
  difficultyLevel: 1,
  dependencies: [],
  dependents: [],
};
assert(getNodeTitle(emptyNode, 'zh') === '', 'getNodeTitle on empty node returns empty string');
assert(getNodeTitle(emptyNode, 'en') === '', 'getNodeTitle on empty node returns empty string');
assert(getNodeStatement(emptyNode, 'zh') === '', 'getNodeStatement on empty node returns empty string');
assert(getNodeStatement(emptyNode, 'en') === '', 'getNodeStatement on empty node returns empty string');
assert(getNodeIntuition(emptyNode, 'zh') === '', 'getNodeIntuition on empty node returns empty string');
assert(getNodeIntuition(emptyNode, 'en') === '', 'getNodeIntuition on empty node returns empty string');
assert(getNodeHistorical(emptyNode, 'zh') === '', 'getNodeHistorical on empty node returns empty string');
assert(getNodeHistorical(emptyNode, 'en') === '', 'getNodeHistorical on empty node returns empty string');
assert(getNodeProofDescription(emptyNode, 'zh') === '', 'getNodeProofDescription on empty node returns empty string');
assert(getNodeProofDescription(emptyNode, 'en') === '', 'getNodeProofDescription on empty node returns empty string');

// Test discipline names across all disciplines
disciplines.forEach((d) => {
  assert(getDisciplineName(d, 'zh') === d.nameZh, `Discipline ${d.id} localized to zh: ${d.nameZh}`);
  assert(getDisciplineName(d, 'en') === d.nameEn, `Discipline ${d.id} localized to en: ${d.nameEn}`);
  assert(getDisciplineName({ nameZh: '代数', nameEn: '' }, 'en') === '代数', 'getDisciplineName fallback to nameZh on empty nameEn');
  assert(getDisciplineName({ nameZh: '', nameEn: 'Algebra' }, 'zh') === 'Algebra', 'getDisciplineName fallback to nameEn on empty nameZh');
});

// Test node type labels
const allNodeTypes: NodeType[] = [
  'AXIOM', 'DEFINITION', 'LEMMA', 'THEOREM', 'COROLLARY', 'PROPERTY', 'EXAMPLE', 'COUNTER_EXAMPLE', 'CONJECTURE'
];
allNodeTypes.forEach((nt) => {
  assert(getNodeTypeLabel(nt, 'zh') === NODE_TYPE_LABELS[nt].zh, `NodeType ${nt} zh label matches`);
  assert(getNodeTypeLabel(nt, 'en') === NODE_TYPE_LABELS[nt].en, `NodeType ${nt} en label matches`);
});
assert(getNodeTypeLabel('UNKNOWN_TYPE' as any, 'zh') === 'UNKNOWN_TYPE', 'getNodeTypeLabel handles unknown type gracefully');

// ---------------------------------------------------------------------
// SECTION 3: Academic Exporters Deep Stress Testing
// ---------------------------------------------------------------------
console.log('\n--- SECTION 3: Academic Exporters Deep Stress Testing ---');

const formats = ['latex_paper', 'typst', 'beamer', 'quarto_md', 'tikz_cd', 'proof_tree', 'overleaf'] as const;

initialMathNodes.forEach((node) => {
  formats.forEach((fmt) => {
    try {
      const result = compileExportDocument(node, initialMathNodes, {
        format: fmt,
        includePrerequisites: true,
        includeProofs: true,
        includeIntuition: true,
        includeLeanCode: true,
        includeTikzDiagram: true,
        authorName: 'Test Author & Co. % $ # _',
        institution: 'Institute of Mathematics',
      });

      assert(
        result.content.length > 50,
        `compileExportDocument(${node.id}, format=${fmt}) produced non-trivial content (${result.content.length} chars)`
      );

      // Check specific format integrity
      if (fmt === 'latex_paper') {
        assert(result.content.includes('\\documentclass'), `${node.id} LaTeX paper has \\documentclass`);
        assert(result.content.includes('\\begin{document}'), `${node.id} LaTeX paper has \\begin{document}`);
        assert(result.content.includes('\\end{document}'), `${node.id} LaTeX paper has \\end{document}`);
      } else if (fmt === 'typst') {
        assert(result.content.includes('#set page('), `${node.id} Typst doc has #set page`);
        assert(result.content.includes('#set text('), `${node.id} Typst doc has #set text`);
      } else if (fmt === 'beamer') {
        assert(result.content.includes('\\documentclass[aspectratio=169]{beamer}'), `${node.id} Beamer has documentclass beamer`);
        assert(result.content.includes('\\begin{document}'), `${node.id} Beamer has \\begin{document}`);
        assert(result.content.includes('\\end{document}'), `${node.id} Beamer has \\end{document}`);
      } else if (fmt === 'quarto_md') {
        assert(result.content.startsWith('---'), `${node.id} Quarto Markdown starts with frontmatter`);
        assert(result.content.includes('format:'), `${node.id} Quarto Markdown includes format key`);
      } else if (fmt === 'tikz_cd') {
        assert(result.content.includes('\\begin{tikzpicture}') || result.content.includes('\\begin{tikzcd}'), `${node.id} TikZ output includes tikzpicture or tikzcd`);
      } else if (fmt === 'proof_tree') {
        assert(result.content.includes('\\begin{prooftree}'), `${node.id} Proof tree output includes prooftree`);
      }
    } catch (err: any) {
      assert(false, `compileExportDocument(${node.id}, format=${fmt}) threw exception: ${err.message}`);
    }
  });
});

// Stress test export engine on isolated edge cases
console.log('\n--- Testing Isolated Edge Cases on Exporter ---');
const isolatedAxiom: MathNode = initialMathNodes.find((n) => n.dependencies.length === 0)!;
const leafTheorem: MathNode = initialMathNodes.find((n) => n.dependencies.length >= 2)!;

// Test isolated axiom with includePrerequisites=false
const resAxiomNoPrereqs = compileExportDocument(isolatedAxiom, initialMathNodes, {
  format: 'latex_paper',
  includePrerequisites: false,
  includeProofs: false,
  includeIntuition: false,
  includeLeanCode: false,
  includeTikzDiagram: false,
});
assert(resAxiomNoPrereqs.prerequisiteCount === 1, 'Isolated node with includePrerequisites=false has count 1');

// Test leaf theorem with includePrerequisites=true
const resLeafWithPrereqs = compileExportDocument(leafTheorem, initialMathNodes, {
  format: 'latex_paper',
  includePrerequisites: true,
});
assert(resLeafWithPrereqs.prerequisiteCount >= 2, `Leaf theorem ${leafTheorem.id} includes multiple prereqs (got ${resLeafWithPrereqs.prerequisiteCount})`);

// ---------------------------------------------------------------------
// SECTION 4: DAG Cycle Detection and Topological Sorting
// ---------------------------------------------------------------------
console.log('\n--- SECTION 4: DAG Cycle Detection and Topological Sorting ---');

// 1. Real Seed Data Topological Sort
const { sorted: seedSorted, isDAG: seedIsDAG } = topologicalSort(initialMathNodes);
assert(seedIsDAG === true, 'Seed data graph is a strict DAG (isDAG === true)');
assert(seedSorted.length === initialMathNodes.length, `Sorted array has all ${initialMathNodes.length} nodes`);

// Verify topological ordering invariant: for every edge u -> v (u is prereq of v), index(u) < index(v)
const indexMap = new Map(seedSorted.map((n, idx) => [n.id, idx]));
let orderViolations = 0;
initialMathNodes.forEach((node) => {
  const nodeIdx = indexMap.get(node.id)!;
  node.dependencies.forEach((prereqId) => {
    const prereqIdx = indexMap.get(prereqId);
    if (prereqIdx !== undefined && prereqIdx >= nodeIdx) {
      orderViolations++;
      console.error(`  Topological order violation: prereq ${prereqId} (idx ${prereqIdx}) comes after ${node.id} (idx ${nodeIdx})`);
    }
  });
});
assert(orderViolations === 0, 'Zero topological sorting ordering violations across all edges');

// 2. Circular Dependency Stress Tests
// Self loop
const selfLoopCheck = checkCircularDependency(initialMathNodes, 'thm-stokes', 'thm-stokes');
assert(selfLoopCheck.hasCycle === true, 'Self loop (A -> A) is detected as cycle');

// Direct 2-node cycle candidate: thm-stokes depends on def-differential-form.
// If def-differential-form tries to depend on thm-stokes:
const direct2CycleCheck = checkCircularDependency(initialMathNodes, 'def-limit-sequence', 'thm-cauchy-schwarz');
assert(direct2CycleCheck.hasCycle === true, 'Direct 2-node cycle candidate (def-limit-sequence -> thm-cauchy-schwarz) is detected as cycle');
assert(direct2CycleCheck.cyclePath !== undefined && direct2CycleCheck.cyclePath.length > 0, 'Cycle path is reconstructed');

// Valid edge addition
const validEdgeCheck = checkCircularDependency(initialMathNodes, 'thm-pythagorean', 'def-limit-sequence');
assert(validEdgeCheck.hasCycle === false, 'Valid edge addition (thm-pythagorean -> def-limit-sequence) has no cycle');

// 3. Synthetic Complex DAG & Cycle Generator
console.log('\n--- Stress Testing Large Synthetic DAGs (100 Nodes) ---');
const synthNodes: MathNode[] = [];
for (let i = 0; i < 100; i++) {
  const deps: string[] = [];
  // Connect to some earlier nodes (guaranteed DAG)
  if (i > 0) {
    deps.push(`synth-node-${i - 1}`);
  }
  if (i > 5 && i % 3 === 0) {
    deps.push(`synth-node-${i - 5}`);
  }
  synthNodes.push({
    id: `synth-node-${i}`,
    slug: `synth-node-${i}`,
    titleZh: `综合命题 ${i}`,
    titleEn: `Synthetic Theorem ${i}`,
    nodeType: i === 0 ? 'AXIOM' : 'THEOREM',
    disciplineId: 'analysis',
    mscCode: '00A00',
    statementLatex: `x_{${i}} = ${i}`,
    statementPlainZh: `陈述 ${i}`,
    statementPlainEn: `Statement ${i}`,
    intuitionMd: `直觉 ${i}`,
    intuitionEn: `Intuition ${i}`,
    historicalContextZh: `历史 ${i}`,
    historicalContextEn: `History ${i}`,
    verification: 'FORMALLY_VERIFIED',
    reputationScore: 100,
    viewCount: 100,
    difficultyLevel: 1,
    dependencies: deps,
    dependents: [],
  });
}

const synthSortResult = topologicalSort(synthNodes);
assert(synthSortResult.isDAG === true, '100-node synthetic pipeline is verified as DAG');
assert(synthSortResult.sorted.length === 100, '100-node synthetic DAG correctly sorted');

// Try creating cycle in synthetic graph: node-0 depends on node-99
const synthCycleCheck = checkCircularDependency(synthNodes, 'synth-node-0', 'synth-node-99');
assert(synthCycleCheck.hasCycle === true, 'Back-edge from node-0 to node-99 detected as cycle');

// 4. Test Transitive Closure & Derivation Paths
const stokesPrereqs = getTransitivePrerequisites('thm-stokes', initialMathNodes);
assert(stokesPrereqs.length > 0, `Transitive prerequisites for thm-stokes found: ${stokesPrereqs.length}`);
assert(stokesPrereqs.includes('def-limit-sequence') || stokesPrereqs.includes('thm-ftc'), 'thm-stokes transitive prereqs contains upstream foundations');

const paths = findDerivationPaths(initialMathNodes, 'def-limit-sequence', 'thm-intermediate-value');
assert(paths.length > 0, `Derivation paths between def-limit-sequence and thm-intermediate-value found: ${paths.length}`);
assert(paths[0][0] === 'def-limit-sequence', 'Derivation path starts with def-limit-sequence');
assert(paths[0][paths[0].length - 1] === 'thm-intermediate-value', 'Derivation path ends with thm-intermediate-value');

// ---------------------------------------------------------------------
// SUMMARY
// ---------------------------------------------------------------------
console.log('\n================================================================');
console.log(`📊 CHALLENGER 2 SUITE SUMMARY: ${passCount} passed, ${failCount} failed`);
console.log('================================================================');

if (failCount > 0) {
  console.error('\nFailures:\n' + failures.join('\n'));
  process.exit(1);
} else {
  console.log('🎉 ALL EMPIRICAL CHALLENGES AND STRESS TESTS PASSED!');
  process.exit(0);
}
