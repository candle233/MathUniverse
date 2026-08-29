const fs = require('fs');

const content = fs.readFileSync('src/data/seedData.ts', 'utf8');

const jsCode = content
  .replace(/import type \{[^\}]*\} from '[^']*';/g, '')
  .replace(/import \{[^\}]*\} from '[^']*';/g, '')
  .replace(/: MathNode\[\]/g, '')
  .replace(/export const initialMathNodes/g, 'const initialMathNodes');

const sandbox = {};
const fn = new Function('exports', jsCode + '\nexports.initialMathNodes = initialMathNodes;');
fn(sandbox);

const nodes = sandbox.initialMathNodes;
console.log('Successfully evaluated initialMathNodes! Total count:', nodes.length);

nodes.forEach((n, idx) => {
  console.log(`\n=== [${idx + 1}] ID: ${n.id} (slug: ${n.slug}) ===`);
  console.log(`  titleZh: "${n.titleZh}"`);
  console.log(`  titleEn: "${n.titleEn}"`);
  console.log(`  type: ${n.nodeType}, discipline: ${n.disciplineId}, MSC: ${n.mscCode}, level: ${n.difficultyLevel}`);
  console.log(`  verification: ${n.verification}, rep: ${n.reputationScore}, views: ${n.viewCount}`);
  console.log(`  dependencies (${n.dependencies.length}): [${n.dependencies.join(', ')}]`);
  console.log(`  dependents (${n.dependents.length}): [${n.dependents.join(', ')}]`);
  console.log(`  tags: [${n.tags.join(', ')}]`);
  console.log(`  statementLatex: ${n.statementLatex.slice(0, 60)}...`);
  console.log(`  statementPlainZh: ${n.statementPlainZh ? n.statementPlainZh.slice(0, 60) + '...' : 'NONE'}`);
  console.log(`  intuitionMd: ${n.intuitionMd ? n.intuitionMd.slice(0, 60).replace(/\n/g, ' ') + '...' : 'NONE'}`);
  console.log(`  proofs (${n.proofs.length}):`);
  n.proofs.forEach((p, pIdx) => {
    console.log(`    Proof ${pIdx + 1}: id=${p.id}, title="${p.title}", approach=${p.approachType}, author=${p.author?.name}, steps=${p.steps?.length}`);
    p.steps?.forEach((s, sIdx) => {
      console.log(`      Step ${s.stepIndex}: "${s.explanation}" | latex: ${s.latexText?.slice(0, 40)}...`);
    });
  });
  if (n.leanFormalization) {
    console.log(`  leanFormalization: id=${n.leanFormalization.id}, theoremName=${n.leanFormalization.theoremName}, verified=${n.leanFormalization.isVerified}, axioms=[${n.leanFormalization.axiomsUsed.join(', ')}]`);
  }
  if (n.codeSnippets && n.codeSnippets.length > 0) {
    console.log(`  codeSnippets (${n.codeSnippets.length}):`);
    n.codeSnippets.forEach((c) => {
      console.log(`    Snippet: id=${c.id}, lang=${c.language}, title="${c.title}", plotType=${c.plotType}`);
    });
  }
});
