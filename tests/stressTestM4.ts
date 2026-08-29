import { initialMathNodes } from '../src/data/seedData.ts';
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
import type { MathNode } from '../src/types/math.ts';

console.log('⚡ Starting Adversarial Stress Test for Milestone 4 (M4)...');

let passed = 0;
let failed = 0;

function assert(cond: boolean, desc: string) {
  if (cond) {
    console.log(`  ✅ [PASS] ${desc}`);
    passed++;
  } else {
    console.error(`  ❌ [FAIL] ${desc}`);
    failed++;
  }
}

// 1. Stress Test getOrderedPrerequisiteNodes on every single node in seed data
for (const node of initialMathNodes) {
  const chain = getOrderedPrerequisiteNodes(node, initialMathNodes);
  assert(chain.length >= 1, `Node ${node.id} prerequisite chain has >= 1 elements (got ${chain.length})`);
  assert(chain[chain.length - 1].id === node.id, `Last element for ${node.id} is the target node itself`);
  
  // Verify topological validity: for every node in chain, all its prerequisites that are in the chain appear before it
  const posMap = new Map<string, number>();
  chain.forEach((n, idx) => posMap.set(n.id, idx));
  let orderValid = true;
  for (const n of chain) {
    for (const depId of n.dependencies) {
      if (posMap.has(depId) && posMap.get(depId)! > posMap.get(n.id)!) {
        orderValid = false;
        console.error(`Topological inversion: dep ${depId} at ${posMap.get(depId)} comes after ${n.id} at ${posMap.get(n.id)}`);
      }
    }
  }
  assert(orderValid, `Prerequisite chain for ${node.id} is strictly topologically sorted`);
}

// 2. Synthetic Adversarial MathNode (Custom node with unusual attributes)
const syntheticTarget: MathNode = {
  id: 'thm-synthetic-adversarial',
  titleZh: '对抗性拓扑合成定理_带下划线 & 特殊字符',
  titleEn: 'Adversarial Synthetic Theorem & Special Characters',
  slug: 'thm-synthetic-adversarial',
  mscCode: '00A00',
  nodeType: 'theorem',
  statementLatex: '\\forall x \\in \\mathcal{X}, \\quad \\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}',
  statementPlainZh: '对抗测试命题阐释',
  intuitionMd: '### 几何动机\n**重要直觉**: 测试 *斜体* 与公式 \\[ \\alpha \\le \\beta \\]',
  dependencies: ['def-limit-sequence', 'thm-ftc'],
  dependents: [],
  importance: 5,
  difficulty: 4,
  historicalContext: '2026 Adversarial Verification',
  proofs: [
    {
      id: 'proof-synth-1',
      title: '极坐标双重积分法',
      proofType: 'algebraic',
      rigorousProof: '设 $I = \\int_0^\\infty e^{-x^2} dx$，则 $I^2 = \\int_0^\\infty \\int_0^\\infty e^{-(x^2+y^2)} dx dy$。',
      steps: [
        {
          stepIndex: 1,
          latexText: 'I^2 = \\int_0^{\\pi/2} d\\theta \\int_0^\\infty r e^{-r^2} dr',
          explanation: '转换至极坐标平面',
          justification: 'Fubini 定理',
        },
        {
          stepIndex: 2,
          latexText: 'I^2 = \\frac{\\pi}{2} \\left[ -\\frac{1}{2} e^{-r^2} \\right]_0^\\infty = \\frac{\\pi}{4}',
          explanation: '原函数代入求值',
          justification: '微积分基本定理',
        },
        {
          stepIndex: 3,
          latexText: 'I = \\frac{\\sqrt{\\pi}}{2}',
          explanation: '开方取正根',
          justification: '被积函数非负性',
        },
      ],
    },
  ],
  leanFormalization: {
    theoremName: 'gaussian_integral_eval',
    leanCode: 'theorem gaussian_integral_eval : ∫ x in Set.Ioi 0, Real.exp (-x^2) = Real.sqrt Real.pi / 2 := by\n  sorry',
    axiomsUsed: ['Real.complete', 'MeasureTheory.integral'],
    astHash: 'sha256_deadbeef1234567890abcdef',
  },
};

// 3. LaTeX Generation with Synthetic Node
const synthLatex = generateLatexPaper(syntheticTarget, [...initialMathNodes, syntheticTarget], {
  includePrerequisites: true,
  includeProofs: true,
  includeIntuition: true,
  includeLeanCode: true,
  includeTikzDiagram: true,
  documentTitle: 'Adversarial Custom Document Title',
  authorName: 'Adversarial Critic',
});

assert(synthLatex.includes('Adversarial Custom Document Title'), 'Custom document title is respected in LaTeX');
assert(synthLatex.includes('Adversarial Critic'), 'Custom author name is respected in LaTeX');
assert(synthLatex.includes('\\begin{document}') && synthLatex.includes('\\end{document}'), 'LaTeX document environment balanced');
assert(synthLatex.includes('极坐标双重积分法'), 'Custom proof title is included in LaTeX');
assert(synthLatex.includes('gaussian_integral_eval'), 'Lean 4 formalization code included in LaTeX');

// Check LaTeX environment balance
const beginEnvs = (synthLatex.match(/\\begin\{([a-zA-Z0-9*]+)\}/g) || []).map((s) => s.replace('\\begin{', '').replace('}', ''));
const endEnvs = (synthLatex.match(/\\end\{([a-zA-Z0-9*]+)\}/g) || []).map((s) => s.replace('\\end{', '').replace('}', ''));
assert(beginEnvs.length === endEnvs.length, `LaTeX begin/end environments count matches (begin: ${beginEnvs.length}, end: ${endEnvs.length})`);

// 4. Typst Generation with Synthetic Node
const synthTypst = generateTypstDoc(syntheticTarget, [...initialMathNodes, syntheticTarget], {
  includePrerequisites: true,
  includeProofs: true,
  includeIntuition: true,
  includeLeanCode: true,
});

assert(synthTypst.includes('#set page('), 'Typst document includes #set page');
assert(synthTypst.includes('```lean'), 'Typst document includes lean code block');
assert(synthTypst.includes('$ ' + syntheticTarget.statementLatex + ' $'), 'Typst document includes raw statement math');
assert(synthTypst.includes('极坐标双重积分法'), 'Typst document includes proof title');

// 5. Beamer Slides Generation with Synthetic Node
const synthBeamer = generateBeamerPresentation(syntheticTarget, [...initialMathNodes, syntheticTarget], {
  themeName: 'Madrid',
});

assert(synthBeamer.includes('\\documentclass[aspectratio=169]{beamer}'), 'Beamer 16:9 aspectratio present');
const beamerBeginFrames = (synthBeamer.match(/\\begin\{frame\}/g) || []).length;
const beamerEndFrames = (synthBeamer.match(/\\end\{frame\}/g) || []).length;
assert(beamerBeginFrames === beamerEndFrames && beamerBeginFrames >= 4, `Beamer frames properly matched (${beamerBeginFrames} frames)`);

// 6. Quarto Markdown Generation
const synthQmd = generateMarkdownDoc(syntheticTarget, [...initialMathNodes, syntheticTarget]);
assert(synthQmd.startsWith('---'), 'QMD starts with YAML header');
assert(synthQmd.includes('::: {.callout-note'), 'QMD includes note callout');
assert(synthQmd.includes('::: {.callout-tip'), 'QMD includes tip callout');
assert(synthQmd.includes('::: {.callout-important'), 'QMD includes important callout');

// 7. TikZ Graph in both TD and LR orientations
const tikzTD = generateTikzDependencyGraph(syntheticTarget, [...initialMathNodes, syntheticTarget], { direction: 'TD', scale: 0.9 });
const tikzLR = generateTikzDependencyGraph(syntheticTarget, [...initialMathNodes, syntheticTarget], { direction: 'LR', scale: 1.2 });
assert(tikzTD.includes('\\begin{tikzpicture}') && tikzTD.includes('\\end{tikzpicture}'), 'TikZ TD graph has tikzpicture environment');
assert(tikzLR.includes('\\begin{tikzpicture}') && tikzLR.includes('\\end{tikzpicture}'), 'TikZ LR graph has tikzpicture environment');
assert(!tikzTD.includes('NaN') && !tikzLR.includes('NaN'), 'TikZ coordinates contain no NaN values');

// 8. Natural Deduction Proof Tree with multi-step proof
const synthProofTree = generateNaturalDeductionTree(syntheticTarget);
assert(synthProofTree.includes('\\begin{prooftree}') && synthProofTree.includes('\\end{prooftree}'), 'Natural deduction has prooftree environment');
assert(synthProofTree.includes('\\AxiomC') && synthProofTree.includes('\\BinaryInfC'), '3-step proof uses BinaryInfC in natural deduction tree');

// 9. Overleaf 1-Click integration
const overleafPayload = generateOverleafPayload(syntheticTarget, [...initialMathNodes, syntheticTarget]);
assert(overleafPayload.url.startsWith('https://www.overleaf.com/docs?snip='), 'Overleaf payload URL starts with overleaf docs snip URL');
const payloadDecoded = decodeURIComponent(overleafPayload.url.split('?snip=')[1]);
assert(payloadDecoded.includes('\\documentclass') && payloadDecoded.includes('gaussian_integral_eval'), 'Overleaf snip contains full compilable paper');

// 10. Standalone Diagram Generators
const diagTypes = ['dependency_dag', 'commutative_square', 'short_exact_sequence', 'natural_deduction', 'first_isomorphism'] as const;
for (const dt of diagTypes) {
  const diagTex = generateStandaloneDiagram(dt, syntheticTarget, [...initialMathNodes, syntheticTarget]);
  assert(diagTex.includes('\\documentclass[tikz,border=12pt]{standalone}'), `Standalone ${dt} uses standalone documentclass`);
  assert(diagTex.includes('\\begin{document}') && diagTex.includes('\\end{document}'), `Standalone ${dt} has balanced document tags`);
}

// 11. Master compileExportDocument across all 7 formats
const allFormats = ['latex_paper', 'typst', 'beamer', 'quarto_md', 'tikz_cd', 'proof_tree', 'overleaf'] as const;
for (const fmt of allFormats) {
  const res = compileExportDocument(syntheticTarget, [...initialMathNodes, syntheticTarget], {
    format: fmt,
    includePrerequisites: true,
    includeProofs: true,
    includeIntuition: true,
    includeLeanCode: true,
    includeTikzDiagram: true,
  });
  assert(res.content.length > 100, `compileExportDocument for ${fmt} produced non-empty content (${res.content.length} chars)`);
  assert(res.suggestedFilename.includes(syntheticTarget.slug), `Filename for ${fmt} includes node slug`);
  assert(res.prerequisiteCount >= 3, `Prerequisite count is accurate (got ${res.prerequisiteCount})`);
  assert(res.byteSize > 0 && res.lineCount > 5, `Byte size and line count are positive for ${fmt}`);
}

console.log(`\n==========================================`);
console.log(`📊 Stress Test Results: ${passed} passed, ${failed} failed`);
console.log(`==========================================`);

if (failed > 0) {
  process.exit(1);
}
