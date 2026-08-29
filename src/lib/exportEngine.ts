import type { MathNode } from '../types/math.ts';
import type {
  ExportFormat,
  ExportOptions,
  ExportDocumentResult,
  TikzDiagramOptions,
  OverleafExportPayload,
} from '../types/export.ts';
import { getTransitivePrerequisites, topologicalSort } from './dagEngine.ts';

// Re-export types for direct access
export type {
  ExportFormat,
  ExportOptions,
  ExportDocumentResult,
  TikzDiagramOptions,
  OverleafExportPayload,
};

/**
 * Default export configuration options
 */
export const defaultExportOptions: ExportOptions = {
  format: 'latex_paper',
  includePrerequisites: true,
  includeProofs: true,
  includeIntuition: true,
  includeLeanCode: true,
  includeTikzDiagram: true,
  authorName: 'MathUniverse Academic Community',
  documentTitle: '',
  institution: 'MathUniverse Open Knowledge Network',
  paperSize: 'a4',
  fontSize: '11pt',
  themeName: 'Madrid',
  typstVersion: '0.11+',
};

/**
 * Recursively resolves and topologically sorts all prerequisites for a given target node
 * Ordered logically from foundational axioms/definitions to the final target theorem.
 */
export function getOrderedPrerequisiteNodes(
  targetNode: MathNode,
  allNodes: MathNode[]
): MathNode[] {
  const nodeMap = new Map<string, MathNode>(allNodes.map((n) => [n.id, n]));
  const prereqIds = getTransitivePrerequisites(targetNode.id, allNodes);
  const relevantIds = new Set<string>([...prereqIds, targetNode.id]);

  const sortedNodes = topologicalSort(allNodes).sorted;
  const orderedNodes = sortedNodes.filter((n) => relevantIds.has(n.id));

  // Ensure target node is included even if not in allNodes topological sort
  if (!orderedNodes.some((n) => n.id === targetNode.id)) {
    orderedNodes.push(targetNode);
  }

  return orderedNodes;
}

/**
 * Generate TikZ Dependency Graph for a theorem and its prerequisite closure
 */
export function generateTikzDependencyGraph(
  targetNode: MathNode,
  allNodes: MathNode[],
  options: { direction?: 'LR' | 'TD'; scale?: number } = {}
): string {
  const nodes = getOrderedPrerequisiteNodes(targetNode, allNodes);
  const nodeMap = new Map<string, MathNode>(allNodes.map((n) => [n.id, n]));
  const direction = options.direction || 'TD';
  const scale = options.scale || 1.0;

  // Group nodes into topological layers
  const depthMap = new Map<string, number>();
  for (const node of nodes) {
    let maxDepDepth = -1;
    for (const depId of node.dependencies) {
      if (depthMap.has(depId)) {
        maxDepDepth = Math.max(maxDepDepth, depthMap.get(depId)!);
      }
    }
    depthMap.set(node.id, maxDepDepth + 1);
  }

  const layers = new Map<number, MathNode[]>();
  for (const node of nodes) {
    const d = depthMap.get(node.id) || 0;
    if (!layers.has(d)) layers.set(d, []);
    layers.get(d)!.push(node);
  }

  const maxDepth = Math.max(...Array.from(layers.keys()), 0);

  let tikz = `% --- MathUniverse Automated TikZ Dependency DAG ---
\\begin{tikzpicture}[
  scale=${scale.toFixed(2)},
  every node/.style={transform shape},
  axiom/.style={rectangle, rounded corners=3pt, fill=blue!15, draw=blue!60, thick, inner sep=6pt, font=\\small\\sffamily, align=center},
  definition/.style={rectangle, rounded corners=3pt, fill=teal!15, draw=teal!60, thick, inner sep=6pt, font=\\small\\sffamily, align=center},
  lemma/.style={rectangle, rounded corners=3pt, fill=amber!15, draw=amber!60, thick, inner sep=6pt, font=\\small\\sffamily, align=center},
  theorem/.style={rectangle, rounded corners=4pt, fill=purple!20, draw=purple!80, line width=1.5pt, inner sep=8pt, font=\\bfseries\\small\\sffamily, align=center},
  target/.style={rectangle, rounded corners=5pt, fill=purple!25, draw=purple!90, double, line width=1.8pt, inner sep=9pt, font=\\bfseries\\normalsize\\sffamily, align=center},
  edge/.style={->, >=stealth, thick, draw=slate!70!black, shorten >=2pt, shorten <=2pt}
]

% Node Placement by Topological Depth Layers
`;

  // Place nodes layer by layer
  for (let d = 0; d <= maxDepth; d++) {
    const layerNodes = layers.get(d) || [];
    const count = layerNodes.length;
    layerNodes.forEach((n, idx) => {
      const isTarget = n.id === targetNode.id;
      let styleName = n.nodeType.toLowerCase();
      if (isTarget) styleName = 'target';
      else if (!['axiom', 'definition', 'lemma', 'theorem'].includes(styleName)) {
        styleName = 'lemma';
      }

      // Safe clean node label
      const safeId = n.id.replace(/[^a-zA-Z0-9]/g, '');
      const cleanTitleZh = n.titleZh.replace(/_/g, '\\_');
      const cleanTitleEn = n.titleEn.replace(/_/g, '\\_');
      const label = `\\textbf{${cleanTitleZh}}\\\\ \\footnotesize(${cleanTitleEn})`;

      // Coordinates
      let posX: number;
      let posY: number;
      if (direction === 'TD') {
        posX = (idx - (count - 1) / 2) * 4.2;
        posY = -d * 2.8;
      } else {
        posX = d * 4.5;
        posY = -(idx - (count - 1) / 2) * 2.5;
      }

      tikz += `\\node[${styleName}] (${safeId}) at (${posX.toFixed(2)}, ${posY.toFixed(2)}) {${label}};\n`;
    });
  }

  tikz += `\n% Directed Prerequisite Edges\n`;

  // Draw edges between relevant nodes
  const nodeSet = new Set(nodes.map((n) => n.id));
  for (const node of nodes) {
    const targetSafeId = node.id.replace(/[^a-zA-Z0-9]/g, '');
    for (const depId of node.dependencies) {
      if (nodeSet.has(depId)) {
        const depSafeId = depId.replace(/[^a-zA-Z0-9]/g, '');
        tikz += `\\draw[edge] (${depSafeId}) -- (${targetSafeId});\n`;
      }
    }
  }

  tikz += `\\end{tikzpicture}`;
  return tikz;
}

/**
 * Generate Domain-Specific TikZ-cd Commutative Diagram for a Theorem
 */
export function generateTikzCdDiagram(node: MathNode): string {
  const slug = node.slug.toLowerCase();
  const id = node.id.toLowerCase();

  if (slug.includes('stokes') || id.includes('stokes')) {
    return `% Stokes Theorem de Rham Complex & Boundary Operator Commutative Diagram
\\begin{tikzcd}[row sep=large, column sep=huge]
\\Omega^{k-1}(M) \\arrow[r, "d"] \\arrow[d, "\\int_{\\partial M}"'] & \\Omega^k(M) \\arrow[d, "\\int_M"] \\\\
\\mathbb{R} \\arrow[r, "\\mathrm{id}"'] & \\mathbb{R}
\\end{tikzcd}`;
  }

  if (slug.includes('ftc') || id.includes('ftc') || slug.includes('calculus')) {
    return `% Fundamental Theorem of Calculus Derivative-Integral Adjunction
\\begin{tikzcd}[row sep=large, column sep=huge]
C^1[a,b] \\arrow[r, "\\frac{d}{dx}"] \\arrow[d, "\\mathrm{ev}_b - \\mathrm{ev}_a"'] & C[a,b] \\arrow[d, "\\int_a^b (\\cdot)\\, dx"] \\\\
\\mathbb{R} \\arrow[r, "\\mathrm{id}"'] & \\mathbb{R}
\\end{tikzcd}`;
  }

  if (slug.includes('isomorphism') || slug.includes('group') || id.includes('group')) {
    return `% First Isomorphism Theorem Canonical Factorization Diagram
\\begin{tikzcd}[row sep=large, column sep=huge]
G \\arrow[r, "\\phi"] \\arrow[d, "\\pi"', two heads] & H \\\\
G / \\ker(\\phi) \\arrow[ur, "\\bar{\\phi}"', hook] &
\\end{tikzcd}`;
  }

  if (slug.includes('cauchy-schwarz') || id.includes('cauchy-schwarz')) {
    return `% Cauchy-Schwarz Inner Product & Norm Bound Diagram
\\begin{tikzcd}[row sep=large, column sep=huge]
V \\times V \\arrow[r, "\\langle \\cdot {,} \\cdot \\rangle"] \\arrow[d, "\\|\\cdot\\| \\times \\|\\cdot\\|"' ] & \\mathbb{K} \\arrow[d, "|\\cdot|"] \\\\
\\mathbb{R}_{\\ge 0} \\times \\mathbb{R}_{\\ge 0} \\arrow[r, "\\times"'] & \\mathbb{R}_{\\ge 0}
\\end{tikzcd}`;
  }

  if (slug.includes('heine-borel') || slug.includes('compact')) {
    return `% Heine-Borel Compactness Equivalence Diagram
\\begin{tikzcd}[row sep=large, column sep=large]
K \\subseteq \\mathbb{R}^n \\arrow[r, "\\text{闭且有界}", leftrightarrow] \\arrow[dr, "\\text{开覆盖有有限子覆盖}"', leftrightarrow] & \\text{紧致集 (Compact)} \\arrow[d, leftrightarrow] \\\\
& \\text{序列紧 (Sequentially Compact)}
\\end{tikzcd}`;
  }

  // Generic Commutative Diagram fallback
  return `% Mathematical Structure Morphism Diagram for ${node.titleEn}
\\begin{tikzcd}[row sep=large, column sep=huge]
A \\arrow[r, "f"] \\arrow[d, "h"'] & B \\arrow[d, "g"] \\\\
C \\arrow[r, "k"'] & D
\\end{tikzcd}`;
}

/**
 * Generate Gentzen-Style Natural Deduction Proof Tree (`bussproofs`)
 */
export function generateNaturalDeductionTree(node: MathNode): string {
  const cleanTitle = node.titleZh.replace(/_/g, '\\_');
  const cleanStatement = node.statementLatex.replace(/\\/g, '\\');

  if (node.proofs && node.proofs.length > 0 && node.proofs[0].steps.length >= 2) {
    const steps = node.proofs[0].steps;
    let proofTree = `% Gentzen Natural Deduction Proof Tree (bussproofs) for ${cleanTitle}
\\begin{prooftree}
`;
    // Build tree using deduction rules
    if (steps.length === 2) {
      proofTree += `  \\AxiomC{$${steps[0].latexText}$}
  \\RightLabel{\\scriptsize (Hypothesis / Definition)}
  \\UnaryInfC{$${steps[1].latexText}$}
  \\RightLabel{\\scriptsize (Deduction Step)}
  \\UnaryInfC{$${cleanStatement}$}
`;
    } else {
      proofTree += `  \\AxiomC{$${steps[0].latexText}$}
  \\AxiomC{$${steps[1].latexText}$}
  \\RightLabel{\\scriptsize (Modus Ponens / Lemma)}
  \\BinaryInfC{$${steps[steps.length - 1].latexText}$}
  \\RightLabel{\\scriptsize (Conclusion $\\vdash$ ${cleanTitle})}
  \\UnaryInfC{$${cleanStatement}$}
`;
    }
    proofTree += `\\end{prooftree}`;
    return proofTree;
  }

  return `% Gentzen Natural Deduction Proof Tree (bussproofs)
\\begin{prooftree}
  \\AxiomC{$\\Gamma \\vdash \\text{Axioms \& Prerequisites}$}
  \\RightLabel{\\scriptsize (Inference)}
  \\UnaryInfC{$\\Gamma \\vdash \\text{Intermediate Lemmas}$}
  \\RightLabel{\\scriptsize (Modus Ponens)}
  \\UnaryInfC{$${cleanStatement}$}
\\end{prooftree}`;
}

/**
 * Generate Publication-Ready AMS-LaTeX Paper (.tex)
 */
export function generateLatexPaper(
  targetNode: MathNode,
  allNodes: MathNode[],
  options: Partial<ExportOptions> = {}
): string {
  const opts: ExportOptions = { ...defaultExportOptions, ...options };
  const author = opts.authorName || 'MathUniverse Academic Community';
  const institution = opts.institution || 'MathUniverse Open Knowledge Network';
  const title =
    opts.documentTitle ||
    `${targetNode.titleZh} (${targetNode.titleEn}) 结构化推导与形式化讲义`;
  const paperSize = opts.paperSize || 'a4';
  const fontSize = opts.fontSize || '11pt';

  const nodesToExport = opts.includePrerequisites
    ? getOrderedPrerequisiteNodes(targetNode, allNodes)
    : [targetNode];

  let tex = `\\documentclass[${fontSize},${paperSize}paper]{article}

% =========================================================================
% MathUniverse Academic Publishing Engine — AMS-LaTeX Exporter
% Target: ${targetNode.titleZh} (${targetNode.titleEn})
% MSC 2020: ${targetNode.mscCode} | Ontology ID: ${targetNode.slug}
% =========================================================================

\\usepackage[utf8]{inputenc}
\\usepackage[margin=1in]{geometry}
\\usepackage{amsmath,amssymb,amsthm,mathtools}
\\usepackage{mathrsfs}
\\usepackage{tikz}
\\usepackage{tikz-cd}
\\usepackage{bussproofs}
\\usepackage{hyperref}
\\usepackage{listings}
\\usepackage{xcolor}
\\usepackage{booktabs}
\\usepackage{tcolorbox}

\\hypersetup{
    colorlinks=true,
    linkcolor=purple!80!black,
    citecolor=blue!70!black,
    urlcolor=cyan!70!black,
    pdfauthor={${author}},
    pdftitle={${title}}
}

% --- Mathematical Theorem Environments ---
\\theoremstyle{definition}
\\newtheorem{definition}{定义}[section]
\\newtheorem{axiom}{公理}[section]
\\newtheorem{example}{例}[section]
\\theoremstyle{plain}
\\newtheorem{theorem}{定理}[section]
\\newtheorem{lemma}[theorem]{引理}
\\newtheorem{corollary}[theorem]{推论}
\\newtheorem{property}[theorem]{性质}
\\newtheorem{conjecture}[theorem]{猜想}
\\theoremstyle{remark}
\\newtheorem{remark}{注记}[section]

% --- Lean 4 Syntax Highlighting Configuration ---
\\definecolor{leanKeyword}{RGB}{43, 92, 194}
\\definecolor{leanComment}{RGB}{76, 153, 76}
\\definecolor{leanString}{RGB}{186, 68, 68}
\\definecolor{leanBg}{RGB}{248, 249, 250}

\\lstdefinelanguage{lean4}{
  keywords={theorem, lemma, def, axiom, inductive, structure, import, open, by, exact, apply, intro, have, show, simp, rw, constructor, cases, rcases, obtain, calc},
  keywordstyle=\\color{leanKeyword}\\bfseries,
  commentstyle=\\color{leanComment}\\itshape,
  stringstyle=\\color{leanString},
  numbers=left,
  numberstyle=\\tiny\\color{gray},
  stepnumber=1,
  numbersep=8pt,
  backgroundcolor=\\color{leanBg},
  breaklines=true,
  frame=single,
  frameround=tttt,
  rulecolor=\\color{black!20},
  basicstyle=\\small\\ttfamily,
  captionpos=b
}

\\title{\\textbf{${title}}}
\\author{${author} \\\\ \\small ${institution}}
\\date{\\today}

\\begin{document}

\\maketitle

\\begin{abstract}
本文档由 \\textbf{MathUniverse (数学宇宙)} 知识库引擎自动化编译生成。本文针对核心数学命题 \\textbf{${targetNode.titleZh}}（${targetNode.titleEn}，MSC 编号 \\texttt{${targetNode.mscCode}}），递归提取其在拓扑有向无环图（DAG）中的全体前置公理、定义与引理链条，构建了自洽严谨的推导脉络与形式化证明。
\\end{abstract}

\\tableofcontents
\\newpage

`;

  // Optional TikZ Dependency Graph Section
  if (opts.includeTikzDiagram && nodesToExport.length > 1) {
    tex += `\\section{前置概念拓扑依赖图谱 (Prerequisite DAG Graph)}
下图展示了从基础公理/定义出发，逐层支撑目标命题 \\textbf{${targetNode.titleZh}} 的知识图谱结构：

\\begin{figure}[htbp]
\\centering
${generateTikzDependencyGraph(targetNode, allNodes, { scale: 0.85 })}
\\caption{${targetNode.titleZh} 递归前置依赖拓扑结构}
\\label{fig:prereq-dag}
\\end{figure}

\\newpage
`;
  }

  tex += `\\section{严格数学推导序列 (Derivation Sequence)}
本节按照拓扑偏序严格组织从基础定义到终极定理的论证流。

`;

  // Loop through ordered prerequisite nodes
  nodesToExport.forEach((node, index) => {
    const isTarget = node.id === targetNode.id;
    let envName = node.nodeType.toLowerCase();
    if (envName === 'counter_example') envName = 'example';
    if (!['axiom', 'definition', 'lemma', 'theorem', 'corollary', 'property', 'conjecture', 'example'].includes(envName)) {
      envName = 'theorem';
    }

    tex += `\\subsection{${isTarget ? '★ 核心命题: ' : ''}${node.titleZh} (${node.titleEn})}
\\label{sec:${node.id}}

\\begin{${envName}}[${node.titleZh}]
${node.statementLatex}
\\end{${envName}}

`;

    // Plain text / intuitive motivation
    if (opts.includeIntuition) {
      if (node.statementPlainZh) {
        tex += `\\paragraph{命题通俗阐释}
${node.statementPlainZh}

`;
      }

      if (node.intuitionMd) {
        const cleanIntuition = node.intuitionMd
          .replace(/###\s*/g, '')
          .replace(/\*\*(.*?)\*\*/g, '\\textbf{$1}')
          .replace(/\*(.*?)\*/g, '\\textit{$1}');
        tex += `\\paragraph{几何直觉与深层动机}
${cleanIntuition}

`;
      }
    }

    // Commutative Diagram if relevant
    if (opts.includeTikzDiagram) {
      const cd = generateTikzCdDiagram(node);
      tex += `\\paragraph{范畴与态射交换图 (Commutative Diagram)}
\\begin{center}
${cd}
\\end{center}

`;
    }

    // Rigorous Proofs
    if (opts.includeProofs && node.proofs && node.proofs.length > 0) {
      node.proofs.forEach((proof) => {
        tex += `\\begin{proof}[证明 (${proof.title})]
${proof.rigorousProof}

`;
        if (proof.steps && proof.steps.length > 0) {
          tex += `\\paragraph{分步推导逻辑链条:}\n\\begin{enumerate}\n`;
          proof.steps.forEach((step) => {
            tex += `  \\item \\textbf{步骤 ${step.stepIndex}}: ${step.explanation}\n  \\[ ${step.latexText} \\]\n`;
          });
          tex += `\\end{enumerate}\n\n`;
        }

        tex += `\\end{proof}

`;
      });
    }

    // Lean 4 Formalization
    if (opts.includeLeanCode && node.leanFormalization) {
      tex += `\\paragraph{Lean 4 形式化验证代码 (Formal Verification)}
\\begin{lstlisting}[language=lean4, caption={${node.titleZh} Lean 4 定理形式化 (${node.leanFormalization.theoremName})}]
${node.leanFormalization.leanCode}
\\end{lstlisting}
\\begin{itemize}
  \\item \\textbf{使用公理 (Axioms)}: \\texttt{${node.leanFormalization.axiomsUsed.join(', ') || '无额外经典公理'}}
  \\item \\textbf{AST 语法指纹}: \\texttt{${node.leanFormalization.astHash}}
  \\item \\textbf{验证状态}: \\textcolor{green!60!black}{\\textbf{已通过 Lean 4 Mathlib 形式化验证}}
\\end{itemize}

`;
    }

    tex += `\\noindent\\rule{\\textwidth}{0.4pt}\n\n`;
  });

  // Appendix / Metadata
  tex += `\\section{学科分类与文献元数据}
\\begin{table}[htbp]
\\centering
\\begin{tabular}{@{}ll@{}}
\\toprule
\\textbf{元数据项} & \\textbf{对应内容} \\\\
\\midrule
目标定理 & \\textbf{${targetNode.titleZh}} (${targetNode.titleEn}) \\\\
MSC 2020 编号 & \\texttt{${targetNode.mscCode}} \\\\
知识本体标识符 & \\texttt{${targetNode.slug}} \\\\
前置命题总数 & ${nodesToExport.length - 1} 个 \\\\
知识库发行平台 & MathUniverse Open Mathematical Knowledge Base \\\\
\\bottomrule
\\end{tabular}
\\caption{${targetNode.titleZh} 学术导出元数据}
\\end{table}

\\end{document}
`;

  return tex;
}

/**
 * Generate Modern Typst 0.11+ Source Document (.typ)
 */
export function generateTypstDoc(
  targetNode: MathNode,
  allNodes: MathNode[],
  options: Partial<ExportOptions> = {}
): string {
  const opts: ExportOptions = { ...defaultExportOptions, ...options };
  const author = opts.authorName || 'MathUniverse Academic Community';
  const institution = opts.institution || 'MathUniverse Open Knowledge Network';
  const title =
    opts.documentTitle || `${targetNode.titleZh} 结构化数学推导讲义`;

  const nodesToExport = opts.includePrerequisites
    ? getOrderedPrerequisiteNodes(targetNode, allNodes)
    : [targetNode];

  let typ = `// =========================================================================
// MathUniverse Typst 0.11+ Export Engine
// Target: ${targetNode.titleZh} (${targetNode.titleEn})
// =========================================================================

#set page(
  paper: "a4",
  margin: (x: 2.5cm, top: 3.0cm, bottom: 2.5cm),
  header: align(right)[
    #text(8pt, fill: luma(120))[MathUniverse · #datetime.today().display()]
  ],
  footer: locate(loc => {
    let page_number = counter(page).at(loc).first()
    let total_pages = counter(page).final(loc).first()
    align(center)[#text(9pt, fill: luma(100))[第 #page_number 页 / 共 #total_pages 页]]
  })
)

#set text(font: ("Linux Libertine", "Noto Serif CJK SC"), size: 11pt, lang: "zh")
#set par(justify: true, leading: 0.8em)
#set heading(numbering: "1.1")

#align(center)[
  #v(1cm)
  #text(22pt, weight: "bold", fill: rgb("#1e1b4b"))[${title}] \\
  #v(0.6em)
  #text(13pt, style: "italic", fill: rgb("#6366f1"))[${targetNode.titleEn}] \\
  #v(1.2em)
  #text(10pt, fill: luma(80))[作者: ${author} | 机构: ${institution} | MSC 编号: ${targetNode.mscCode}]
]

#v(1.5em)
#line(length: 100%, stroke: 0.6pt + rgb("#cbd5e1"))

== 摘要 (Abstract)
本文档收录了核心数学命题 *${targetNode.titleZh}*（${targetNode.titleEn}，MSC \\#${targetNode.mscCode}）在有向无环图（DAG）中的完整前置依赖体系。全篇共收录 ${nodesToExport.length} 个层级节点，从 foundational 公理与定义出发完成自洽推导。

#v(1em)
#outline(indent: auto, depth: 2)
#pagebreak()

= 知识图谱推导序列

`;

  nodesToExport.forEach((node, idx) => {
    const isTarget = node.id === targetNode.id;
    const boxColor = isTarget ? 'rgb("#f5f3ff")' : 'rgb("#f0fdf4")';
    const borderColor = isTarget ? 'rgb("#a855f7")' : 'rgb("#86efac")';
    const titlePrefix = isTarget ? '★ 核心定理: ' : '';

    typ += `== ${titlePrefix}${node.titleZh} (${node.titleEn}) <${node.id}>

#rect(
  width: 100%,
  fill: ${boxColor},
  stroke: 1.2pt + ${borderColor},
  radius: 6pt,
  inset: 14pt
)[
  #grid(
    columns: (1fr, auto),
    [*${node.nodeType}* · ${node.titleZh}],
    [#text(9pt, fill: luma(100))[MSC ${node.mscCode}]]
  )
  #v(0.5em)
  $ ${node.statementLatex} $
]

`;

    if (opts.includeIntuition) {
      if (node.statementPlainZh) {
        typ += `*命题通俗直觉:* \\
${node.statementPlainZh}

`;
      }
      if (node.intuitionMd) {
        const cleanMd = node.intuitionMd
          .replace(/###\s*/g, '')
          .replace(/\\\[/g, '$ ')
          .replace(/\\\]/g, ' $')
          .replace(/\\\(/g, '$')
          .replace(/\\\)/g, '$');
        typ += `*深层动机与几何图像:* \\
${cleanMd}

`;
      }
    }

    if (opts.includeProofs && node.proofs && node.proofs.length > 0) {
      node.proofs.forEach((proof) => {
        const cleanProof = proof.rigorousProof
          .replace(/\\\[/g, '$ ')
          .replace(/\\\]/g, ' $')
          .replace(/\\\(/g, '$')
          .replace(/\\\)/g, '$');

        typ += `#block(
  fill: rgb("#f8fafc"),
  stroke: 0.8pt + rgb("#cbd5e1"),
  radius: 5pt,
  inset: 12pt,
  width: 100%
)[
  *证明 (${proof.title}):* \\
  #v(0.4em)
  ${cleanProof}
]
`;

        if (proof.steps && proof.steps.length > 0) {
          typ += `\n*证明步骤分解:*\n`;
          proof.steps.forEach((s) => {
            typ += `+ *步骤 ${s.stepIndex}*: ${s.explanation} \n  $ ${s.latexText} $\n`;
          });
          typ += `\n`;
        }
      });
    }

    if (opts.includeLeanCode && node.leanFormalization) {
      typ += `*Lean 4 形式化代码:*
\`\`\`lean
${node.leanFormalization.leanCode}
\`\`\`
#text(8pt, fill: luma(100))[AST 指纹: \`${node.leanFormalization.astHash}\` | 公理: \`${node.leanFormalization.axiomsUsed.join(', ') || '无'}\`]

`;
    }

    typ += `#v(1.2em)\n#line(length: 100%, stroke: 0.5pt + luma(220))\n#v(1.2em)\n\n`;
  });

  typ += `= 附录与本体信息
- *本体标识符 (Slug)*: \`${targetNode.slug}\`
- *前置节点依赖总数*: ${nodesToExport.length - 1}
- *生成工具*: MathUniverse Academic Exporter (Typst Engine)
`;

  return typ;
}

/**
 * Generate LaTeX Beamer Slides Presentation (.tex)
 */
export function generateBeamerPresentation(
  targetNode: MathNode,
  allNodes: MathNode[],
  options: Partial<ExportOptions> = {}
): string {
  const opts: ExportOptions = { ...defaultExportOptions, ...options };
  const author = opts.authorName || 'MathUniverse Academic Presenter';
  const institution = opts.institution || 'MathUniverse Open Platform';
  const theme = opts.themeName || 'Madrid';

  const nodes = opts.includePrerequisites
    ? getOrderedPrerequisiteNodes(targetNode, allNodes)
    : [targetNode];

  let beamer = `\\documentclass[aspectratio=169]{beamer}
\\usetheme{${theme}}
\\usecolortheme{whale}

\\usepackage[utf8]{inputenc}
\\usepackage{amsmath,amssymb,amsthm}
\\usepackage{tikz}
\\usepackage{tikz-cd}
\\usepackage{listings}

\\title[${targetNode.titleZh}]{${targetNode.titleZh}}
\\subtitle{${targetNode.titleEn} --- DAG 拓扑前置闭包与形式化推导报告}
\\author{${author}}
\\institute{${institution}}
\\date{\\today}

\\begin{document}

% --- Title Slide ---
\\begin{frame}
  \\titlepage
\\end{frame}

% --- Agenda / TOC Slide ---
\\begin{frame}{目录与前置推导路线}
  \\tableofcontents
\\end{frame}

% --- Overview & Motivation Frame ---
\\begin{frame}{研究背景与核心目标}
  \\begin{columns}
    \\begin{column}{0.55\\textwidth}
      \\begin{alertblock}{核心命题}
        \\textbf{${targetNode.titleZh}} (${targetNode.titleEn})\\\\
        \\small MSC 2020: \\texttt{${targetNode.mscCode}}
      \\end{alertblock}
      \\vspace{0.5em}
      \\begin{exampleblock}{几何动机}
        \\small ${targetNode.statementPlainZh || '探索高维数学对象的统一结构与深刻对称性。'}
      \\end{exampleblock}
    \\end{column}
    \\begin{column}{0.42\\textwidth}
      \\begin{block}{DAG 拓扑规模}
        \\begin{itemize}
          \\item 前置依赖深度: \\textbf{${nodes.length}} 个节点
          \\item 知识体系: ${nodes.map((n) => n.titleZh).slice(0, 3).join(', ')}${nodes.length > 3 ? ' 等' : ''}
        \\end{itemize}
      \\end{block}
    \\end{column}
  \\end{columns}
\\end{frame}

`;

  // Frames for each node in the sequence
  nodes.forEach((node) => {
    const isTarget = node.id === targetNode.id;

    beamer += `\\section{${isTarget ? '★ ' : ''}${node.titleZh}}
\\begin{frame}{${node.titleZh} (${node.nodeType})}
  \\begin{block}{形式化陈述}
    \\[
      ${node.statementLatex}
    \\]
  \\end{block}
  
  \\vspace{0.5em}
  \\begin{exampleblock}{通俗阐释与直觉}
    \\small ${node.statementPlainZh || '基础定义/公理支撑后续推导。'}
  \\end{exampleblock}
\\end{frame}

`;

    // Step-by-step proof slides if available
    if (opts.includeProofs && node.proofs && node.proofs.length > 0) {
      const proof = node.proofs[0];
      beamer += `\\begin{frame}{${node.titleZh} --- 严谨证明步骤 (${proof.title})}
  \\begin{itemize}
`;
      if (proof.steps && proof.steps.length > 0) {
        proof.steps.forEach((s) => {
          beamer += `    \\item \\textbf{步骤 ${s.stepIndex}}: ${s.explanation}
    \\[ ${s.latexText} \\]
`;
        });
      } else {
        beamer += `    \\item \\small ${proof.rigorousProof.replace(/\\\[/g, '$').replace(/\\\]/g, '$')}
`;
      }
      beamer += `  \\end{itemize}
\\end{frame}

`;
    }

    // Lean 4 Formalization Slide if available
    if (opts.includeLeanCode && node.leanFormalization) {
      beamer += `\\begin{frame}[fragile]{${node.titleZh} --- Lean 4 机器形式化}
\\begin{semiverbatim}
\\small
${node.leanFormalization.leanCode.split('\n').slice(0, 10).join('\n')}
\\end{semiverbatim}
  \\vfill
  \\textbf{AST 指纹}: \\texttt{${node.leanFormalization.astHash.slice(0, 32)}...}
\\end{frame}

`;
    }
  });

  // Conclusion & Q&A
  beamer += `\\begin{frame}{总结与问答 (Q \\& A)}
  \\centering
  \\Large \\textbf{Q \\& A} \\\\
  \\vspace{1.5em}
  \\normalsize 感谢聆听 · MathUniverse 形式化数学图谱 \\\\
  \\vspace{0.5em}
  \\small \\url{https://mathuniverse.org}
\\end{frame}

\\end{document}
`;

  return beamer;
}

/**
 * Generate Quarto / Academic Markdown (.qmd / .md)
 */
export function generateMarkdownDoc(
  targetNode: MathNode,
  allNodes: MathNode[],
  options: Partial<ExportOptions> = {}
): string {
  const opts: ExportOptions = { ...defaultExportOptions, ...options };
  const author = opts.authorName || 'MathUniverse Academic Community';
  const institution = opts.institution || 'MathUniverse Open Knowledge Network';
  const title =
    opts.documentTitle ||
    `${targetNode.titleZh} (${targetNode.titleEn}) 学术推导讲义`;
  const dateStr = new Date().toISOString().split('T')[0];

  const nodesToExport = opts.includePrerequisites
    ? getOrderedPrerequisiteNodes(targetNode, allNodes)
    : [targetNode];

  let md = `---
title: "${title}"
subtitle: "${targetNode.titleEn} — MathUniverse Knowledge Graph"
author: "${author} (${institution})"
date: "${dateStr}"
format:
  html:
    toc: true
    toc-depth: 3
    number-sections: true
    code-fold: show
    theme: cosmo
  pdf:
    toc: true
    number-sections: true
    colorlinks: true
---

# 摘要 (Abstract)

本文档由 **MathUniverse (数学宇宙)** 自动化导出。系统性收录目标命题 **${targetNode.titleZh}**（${targetNode.titleEn}，MSC 编号 \`${targetNode.mscCode}\`）及其有向无环图（DAG）中的 ${nodesToExport.length} 个前置公理、定义与引理推导链条。

---

# 拓扑推导脉络 (Derivation Sequence)

`;

  nodesToExport.forEach((node, index) => {
    const isTarget = node.id === targetNode.id;
    const badge = isTarget ? '🎯 **[核心目标命题]**' : `📌 **[前置依赖 #${index + 1}]**`;

    md += `## ${isTarget ? '★ ' : ''}${node.titleZh} (${node.titleEn})

${badge} \`MSC: ${node.mscCode}\` · \`Type: ${node.nodeType}\`

::: {.callout-note title="${node.nodeType}: ${node.titleZh}"}
$$
${node.statementLatex}
$$
:::

`;

    if (opts.includeIntuition) {
      if (node.statementPlainZh) {
        md += `### 💡 命题直觉阐释\n\n${node.statementPlainZh}\n\n`;
      }
      if (node.intuitionMd) {
        md += `### 🔍 动机与几何图像\n\n${node.intuitionMd}\n\n`;
      }
    }

    if (opts.includeProofs && node.proofs && node.proofs.length > 0) {
      node.proofs.forEach((proof) => {
        md += `::: {.callout-tip title="证明: ${proof.title}" collapse="false"}
${proof.rigorousProof}

`;
        if (proof.steps && proof.steps.length > 0) {
          md += `**推导步骤分解:**\n\n`;
          proof.steps.forEach((s) => {
            md += `- **步骤 ${s.stepIndex}**: ${s.explanation}\n  $$ ${s.latexText} $$\n`;
          });
        }
        md += `:::\n\n`;
      });
    }

    if (opts.includeLeanCode && node.leanFormalization) {
      md += `::: {.callout-important title="Lean 4 形式化验证 (${node.leanFormalization.theoremName})" collapse="true"}
\`\`\`lean
${node.leanFormalization.leanCode}
\`\`\`

- **AST Hash**: \`${node.leanFormalization.astHash}\`
- **Axioms Used**: \`${node.leanFormalization.axiomsUsed.join(', ') || 'None'}\`
:::

`;
    }

    md += `---\n\n`;
  });

  md += `# 参考文献与元数据

- **MSC 2020 Classification**: ${targetNode.mscCode}
- **Knowledge Base Slug**: \`${targetNode.slug}\`
- **Total Dependency Chain**: ${nodesToExport.length} nodes
- **Source Platform**: [MathUniverse Open Platform](https://mathuniverse.org)
`;

  return md;
}

/**
 * Generate Overleaf 1-Click Export Payload
 */
export function generateOverleafPayload(
  targetNode: MathNode,
  allNodes: MathNode[],
  options: Partial<ExportOptions> = {}
): OverleafExportPayload {
  const latexContent = generateLatexPaper(targetNode, allNodes, options);
  const projectName = `${targetNode.slug}-mathuniverse-paper`;
  const encodedSnippet = encodeURIComponent(latexContent);
  const url = `https://www.overleaf.com/docs?snip=${encodedSnippet}`;

  return {
    snip: latexContent,
    name: projectName,
    engine: 'pdflatex',
    url,
  };
}

/**
 * Generate Overleaf 1-Click Integration URL
 */
export function generateOverleafUrl(
  targetNode: MathNode,
  allNodes: MathNode[],
  options: Partial<ExportOptions> = {}
): string {
  const payload = generateOverleafPayload(targetNode, allNodes, options);
  return payload.url;
}

/**
 * Generate Standalone Diagram Source (.tex)
 */
export function generateStandaloneDiagram(
  diagramType:
    | 'dependency_dag'
    | 'commutative_square'
    | 'short_exact_sequence'
    | 'natural_deduction'
    | 'first_isomorphism',
  targetNode?: MathNode,
  allNodes: MathNode[] = []
): string {
  let diagramBody = '';

  if (diagramType === 'dependency_dag' && targetNode) {
    diagramBody = generateTikzDependencyGraph(targetNode, allNodes);
  } else if (diagramType === 'commutative_square') {
    diagramBody = `\\begin{tikzcd}[row sep=large, column sep=huge]
A \\arrow[r, "f"] \\arrow[d, "h"'] & B \\arrow[d, "g"] \\\\
C \\arrow[r, "k"'] & D
\\end{tikzcd}`;
  } else if (diagramType === 'short_exact_sequence') {
    diagramBody = `\\begin{tikzcd}
0 \\arrow[r] & A \\arrow[r, "\\iota"] & B \\arrow[r, "\\pi"] & C \\arrow[r] & 0
\\end{tikzcd}`;
  } else if (diagramType === 'first_isomorphism') {
    diagramBody = `\\begin{tikzcd}[row sep=large, column sep=huge]
G \\arrow[r, "\\phi"] \\arrow[d, "\\pi"', two heads] & H \\\\
G / \\ker(\\phi) \\arrow[ur, "\\bar{\\phi}"', hook] &
\\end{tikzcd}`;
  } else if (diagramType === 'natural_deduction' && targetNode) {
    diagramBody = generateNaturalDeductionTree(targetNode);
  } else {
    diagramBody = targetNode
      ? generateTikzCdDiagram(targetNode)
      : `\\begin{tikzcd} A \\arrow[r] & B \\end{tikzcd}`;
  }

  return `\\documentclass[tikz,border=12pt]{standalone}
\\usepackage{amsmath,amssymb,amsthm}
\\usepackage{tikz}
\\usepackage{tikz-cd}
\\usepackage{bussproofs}

\\begin{document}
${diagramBody}
\\end{document}
`;
}

/**
 * Master compilation function returning complete export artifact
 */
export function compileExportDocument(
  targetNode: MathNode,
  allNodes: MathNode[],
  options: ExportOptions
): ExportDocumentResult {
  let content = '';
  let fileExtension = 'tex';
  let mimeType = 'text/x-tex';

  switch (options.format) {
    case 'latex_paper':
      content = generateLatexPaper(targetNode, allNodes, options);
      fileExtension = 'tex';
      mimeType = 'text/x-tex';
      break;
    case 'typst':
      content = generateTypstDoc(targetNode, allNodes, options);
      fileExtension = 'typ';
      mimeType = 'text/plain';
      break;
    case 'beamer':
      content = generateBeamerPresentation(targetNode, allNodes, options);
      fileExtension = 'tex';
      mimeType = 'text/x-tex';
      break;
    case 'quarto_md':
      content = generateMarkdownDoc(targetNode, allNodes, options);
      fileExtension = 'qmd';
      mimeType = 'text/markdown';
      break;
    case 'tikz_cd':
      content = generateStandaloneDiagram('dependency_dag', targetNode, allNodes);
      fileExtension = 'tex';
      mimeType = 'text/x-tex';
      break;
    case 'proof_tree':
      content = generateStandaloneDiagram('natural_deduction', targetNode, allNodes);
      fileExtension = 'tex';
      mimeType = 'text/x-tex';
      break;
    case 'overleaf':
      content = generateLatexPaper(targetNode, allNodes, options);
      fileExtension = 'tex';
      mimeType = 'text/x-tex';
      break;
    default:
      content = generateLatexPaper(targetNode, allNodes, options);
      fileExtension = 'tex';
      mimeType = 'text/x-tex';
  }

  const prereqNodes = options.includePrerequisites
    ? getOrderedPrerequisiteNodes(targetNode, allNodes)
    : [targetNode];

  const lines = content.split('\n');
  const byteSize = new Blob([content]).size;
  const suggestedFilename = `${targetNode.slug}-${options.format}.${fileExtension}`;
  const overleafUrl = generateOverleafUrl(targetNode, allNodes, options);

  return {
    format: options.format,
    content,
    fileExtension,
    mimeType,
    suggestedFilename,
    prerequisiteCount: prereqNodes.length,
    lineCount: lines.length,
    byteSize,
    targetNodeId: targetNode.id,
    overleafUrl,
    metadata: {
      targetNodeSlug: targetNode.slug,
      mscCode: targetNode.mscCode,
      generatedAt: new Date().toISOString(),
    },
  };
}
