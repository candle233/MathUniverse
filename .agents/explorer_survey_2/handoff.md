# Math Data & Content Survey: Comprehensive Architectural Report

**Agent**: Explorer 2 (Math Data & Content Explorer)  
**Working Directory**: `c:/Users/Mechrevo/Downloads/math-proj/.agents/explorer_survey_2`  
**Date**: 2026-08-29  
**Target Milestone**: R2 Mathematical Content & Node Data Bilingual Decoupling / Full-Spectrum Survey

---

## 1. Observation

A systematic exploration of all mathematical data models, static data repositories, type definitions, compute contracts, and UI components was conducted across the `math-proj` codebase. Below are the exact observations with verbatim file paths, line references, data interfaces, exports, and consumers.

### 1.1 Complete Inventory of Data & Type Files

| File Path | Primary Exports / Interfaces | Purpose & Scope | Direct Consumers |
| :--- | :--- | :--- | :--- |
| `src/types/math.ts` | `NodeType`, `VerificationStatus`, `EdgeRelationType`, `MathDiscipline`, `ProofStep`, `Proof`, `LeanVerification`, `CodeSnippet`, `StepComment`, `DependencyEdge`, `PullRequest`, `MathNode` | Core mathematical ontology, node data models, proof steps, formal verification models, and PR metadata. | `seedData.ts`, `disciplines.ts`, `dagEngine.ts`, `exportEngine.ts`, `i18nHelper.ts`, `NodeDetailClient.tsx`, `LaTeXRenderer.tsx`, `ProofViewer.tsx`, `VerificationCertificate.tsx`, `tests/` |
| `src/types/campaign.ts` | `ZfcAxiomId`, `ZfcAxiomDefinition`, `ConstructedEntity`, `MilestoneDerivationStep`, `MilestoneChallenge`, `CampaignEpoch`, `UserCampaignProgress`, `UserLevelInfo` | Gamified ZFC RPG campaign system, 6 civilization epochs, constructible mathematical entities, and milestone derivation steps. | `campaignEngine.ts`, `ZfcCampaignQuest.tsx`, `tests/` |
| `src/types/fallacy.ts` | `FallacyType`, `FallacyCategoryMeta`, `FallacyStep`, `FallacyCase`, `AccusationResult`, `FallacyLabProgress` | Fallacy Detective forensics lab, 6-category fallacy taxonomy, step-by-step accusation engine, refutations, and Lean 4 disproof snippets. | `fallacyEngine.ts`, `FallacyDetectiveLab.tsx`, `tests/` |
| `src/types/export.ts` | `ExportFormat`, `ExportOptions`, `ExportDocumentResult`, `TikzDiagramOptions`, `OverleafExportPayload` | Academic publication export configurations (AMS-LaTeX, Typst, Beamer, Quarto MD, TikZ-CD, Overleaf integration). | `exportEngine.ts`, `AcademicExportStudio.tsx`, `TikzStudio.tsx`, `tests/` |
| `src/types/sandbox.ts` | `PyodideState`, `PyodideWorkerRequest`, `PyodideWorkerResponse`, `ParameterSliderConfig`, `PlotMode`, `Curve2DSeries`, `Surface3DMesh`, `NumericalVerificationContract`, `VerificationResult` | Client-side numerical & symbolic execution, parameter sliders, 2D/3D plot payloads, and automated verification contracts. | `mathCompute.ts`, `MathComputeEngine.tsx`, `NodeVerificationPanel.tsx`, `ParameterSliders.tsx`, `Plot2DCanvas.tsx`, `Plot3DSurface.tsx` |
| `src/data/disciplines.ts` | `disciplines: MathDiscipline[]` (5 disciplines: `analysis`, `algebra`, `number-theory`, `topology`, `linear-algebra`) | Top-level mathematical disciplines taxonomy with MSC codes, icons, colors, and bilingual names. | `NodeDetailClient.tsx`, `MscTreeExplorer.tsx`, `Cosmos3DGraph.tsx`, `KnowledgeStarChart.tsx`, `LearningPathTree.tsx`, `i18nHelper.ts`, `tests/` |
| `src/data/seedData.ts` | `initialMathNodes: MathNode[]` (21 core theorems/definitions/axioms) | Core knowledge base seed dataset, containing complete dependency DAG, proofs, Lean formalizations, and Python/SymPy snippets. | `NodeDetailClient.tsx`, `Cosmos3DGraph.tsx`, `KnowledgeStarChart.tsx`, `LearningPathTree.tsx`, `MscTreeExplorer.tsx`, `dagEngine.ts`, `exportEngine.ts`, `prerequisiteClosure.ts`, `LaTeXRenderer.tsx`, `GlobalSearchModal.tsx`, `BookmarkDrawer.tsx`, `tests/` |
| `src/lib/campaignEngine.ts` | `zfcAxiomRegistry`, `campaignEpochs`, `USER_LEVEL_TITLES`, `calculateUserLevel`, `synthesizeEntity`, `verifyMilestoneStep`, `completeEpochChallenge`, `loadProgressFromStorage` | Logic engine for ZFC progression, synthesis rules, derivation verification, and local storage state. | `ZfcCampaignQuest.tsx`, `tests/` |
| `src/lib/fallacyEngine.ts` | `fallacyCategoriesMeta`, `fallacyCases`, `getFallacyCases`, `getFallacyCaseById`, `accuseProofStep`, `verifyAccusation`, `getCaseStats`, `loadFallacyLabProgress` | Logic engine for Fallacy Detective cases, step accusation validation, scoring, and progress tracking. | `FallacyDetectiveLab.tsx`, `tests/` |
| `src/lib/mathCompute.ts` | Numerical calculus, ODE solvers, matrix algorithms, Fourier/Taylor/Riemann, `verificationContracts`, `executeVerificationContract` | High-precision numerical & symbolic mathematics engine, including 4 automated node verification contracts. | `MathComputeEngine.tsx`, `NodeVerificationPanel.tsx`, `Plot2DCanvas.tsx`, `Plot3DSurface.tsx`, `tests/` |
| `src/lib/exportEngine.ts` | `generateLatexPaper`, `generateTypstDoc`, `generateBeamerPresentation`, `generateMarkdownDoc`, `generateTikzDependencyGraph`, `generateTikzCdDiagram`, `compileExportDocument` | Multi-format academic document compilation engine with topological prerequisite resolution. | `AcademicExportStudio.tsx`, `TikzStudio.tsx`, `tests/` |
| `src/lib/i18nHelper.ts` | `getNodeTitle`, `getNodeStatement`, `getNodeIntuition`, `getNodeHistorical`, `getNodeProofDescription`, `getDisciplineName`, `getNodeTypeLabel`, `NODE_TYPE_LABELS` | Helper functions for localized text extraction from mathematical nodes and disciplines. | `NodeDetailClient.tsx`, `Cosmos3DGraph.tsx`, `KnowledgeStarChart.tsx`, `tests/i18n.test.ts` |

---

### 1.2 Mathematical Nodes Census in `src/data/seedData.ts`

The seed dataset defines **21 core mathematical nodes** spanning foundational mathematics:

| # | Node ID (`id`) | Slug (`slug`) | Chinese Title (`titleZh`) | English Title (`titleEn`) | Type (`nodeType`) | Discipline (`disciplineId`) | MSC Code | Level |
| :- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :-: |
| 1 | `def-limit-sequence` | `definition-limit-of-sequence` | 数列极限 (ε-N 定义) | Limit of a Sequence (ε-N Definition) | `DEFINITION` | `analysis` | `26A03` | 1 |
| 2 | `thm-cauchy-schwarz` | `cauchy-schwarz-inequality` | 柯西-施瓦茨不等式 | Cauchy-Schwarz Inequality | `THEOREM` | `linear-algebra` | `26D15` | 2 |
| 3 | `thm-ftc` | `fundamental-theorem-of-calculus` | 微积分基本定理 (牛顿-莱布尼茨公式) | Fundamental Theorem of Calculus (Newton-Leibniz Formula) | `THEOREM` | `analysis` | `26A42` | 2 |
| 4 | `thm-stokes` | `generalized-stokes-theorem` | 一般化斯托克斯公式 (微分形式) | Generalized Stokes Theorem (Differential Forms) | `THEOREM` | `topology` | `58A10` | 4 |
| 5 | `def-group` | `definition-group` | 群的公理化定义 (Group) | Axiomatic Definition of a Group | `DEFINITION` | `algebra` | `20A05` | 1 |
| 6 | `thm-lagrange-group` | `lagrange-theorem-group` | 拉格朗日群论定理 (子群阶整除群阶) | Lagrange's Theorem (Group Theory) | `THEOREM` | `algebra` | `20D30` | 2 |
| 7 | `thm-fermat-little` | `fermat-little-theorem` | 费马小定理 (Fermat Little Theorem) | Fermat's Little Theorem | `THEOREM` | `number-theory` | `11A07` | 1 |
| 8 | `thm-heine-borel` | `heine-borel-theorem` | 海涅-博雷尔定理 (有限覆盖定理) | Heine-Borel Theorem (Compactness in R^n) | `THEOREM` | `topology` | `54D30` | 3 |
| 9 | `thm-first-isomorphism` | `first-isomorphism-theorem-groups` | 群的第一同构定理 (同态基本定理) | First Isomorphism Theorem for Groups | `THEOREM` | `algebra` | `20A05` | 2 |
| 10 | `conjecture-riemann-hypothesis` | `riemann-hypothesis` | 黎曼猜想 (Riemann Hypothesis) | The Riemann Hypothesis | `CONJECTURE` | `number-theory` | `11M26` | 5 |
| 11 | `thm-euler-identity` | `eulers-identity` | 欧拉恒等式 | Euler's Identity | `THEOREM` | `analysis` | `00A05` | 2 |
| 12 | `thm-cantor-theorem` | `cantors-theorem` | 康托尔定理 | Cantor's Theorem | `THEOREM` | `logic` | `03E10` | 3 |
| 13 | `thm-pythagorean` | `pythagorean-theorem` | 勾股定理 (毕达哥拉斯定理) | Pythagorean Theorem | `THEOREM` | `geometry` | `51M04` | 1 |
| 14 | `thm-am-gm` | `am-gm-inequality` | 均值不等式 (AM-GM 不等式) | Arithmetic Mean - Geometric Mean Inequality | `THEOREM` | `analysis` | `26D15` | 1 |
| 15 | `thm-geometric-series` | `geometric-series-sum` | 等比数列求和公式 | Geometric Series Sum Formula | `THEOREM` | `analysis` | `40A05` | 1 |
| 16 | `thm-infinite-primes` | `infinitude-of-primes` | 欧几里得素数无限性定理 | Euclid's Theorem on the Infinitude of Primes | `THEOREM` | `number-theory` | `11A41` | 1 |
| 17 | `thm-intermediate-value` | `intermediate-value-theorem` | 介值定理 (零点存在定理) | Intermediate Value Theorem (IVT) | `THEOREM` | `analysis` | `26A15` | 1 |
| 18 | `thm-fundamental-algebra` | `fundamental-theorem-of-algebra` | 代数基本定理 | Fundamental Theorem of Algebra | `THEOREM` | `algebra` | `12D05` | 3 |
| 19 | `thm-sylow-first` | `sylow-first-theorem` | 西罗第一定理 (Sylow I) | Sylow's First Theorem | `THEOREM` | `algebra` | `20D20` | 3 |
| 20 | `thm-banach-fixed-point` | `banach-fixed-point-theorem` | 巴拿赫不动点定理 (压缩映射原理) | Banach Fixed-Point Theorem (Contraction Mapping) | `THEOREM` | `analysis` | `47H10` | 2 |
| 21 | `thm-prime-number-theorem` | `prime-number-theorem` | 素数定理 (PNT) | Prime Number Theorem | `THEOREM` | `number-theory` | `11N05` | 3 |

---

### 1.3 Exact Locations of Bilingual Clumping & Hardcoded Strings

Bilingual clumping occurs when a single field conflates English and Chinese in parenthetical combinations or mixed strings, forcing cluttered UI rendering regardless of the user's selected language.

#### Category A: Node Title Clumping in `src/data/seedData.ts`
1. `def-limit-sequence` (`seedData.ts:10`): `titleZh: '数列极限 (ε-N 定义)'`
2. `thm-ftc` (`seedData.ts:280`): `titleZh: '微积分基本定理 (牛顿-莱布尼茨公式)'`
3. `thm-stokes` (`seedData.ts:417`): `titleZh: '一般化斯托克斯公式 (微分形式)'`
4. `def-group` (`seedData.ts:549`): `titleZh: '群的公理化定义 (Group)'`
5. `thm-lagrange-group` (`seedData.ts:672`): `titleZh: '拉格朗日群论定理 (子群阶整除群阶)'`
6. `thm-fermat-little` (`seedData.ts:788`): `titleZh: '费马小定理 (Fermat Little Theorem)'`
7. `thm-heine-borel` (`seedData.ts:920`): `titleZh: '海涅-博雷尔定理 (有限覆盖定理)'`
8. `thm-first-isomorphism` (`seedData.ts:1042`): `titleZh: '群的第一同构定理 (同态基本定理)'`
9. `conjecture-riemann-hypothesis` (`seedData.ts:1157`): `titleZh: '黎曼猜想 (Riemann Hypothesis)'`
10. `thm-pythagorean` (`seedData.ts:1386`): `titleZh: '勾股定理 (毕达哥拉斯定理)'`
11. `thm-am-gm` (`seedData.ts:1475`): `titleZh: '均值不等式 (AM-GM 不等式)'`
12. `thm-sylow-first` (`seedData.ts:1929`): `titleZh: '西罗第一定理 (Sylow I)'`
13. `thm-banach-fixed-point` (`seedData.ts:2020`): `titleZh: '巴拿赫不动点定理 (压缩映射原理)'`
14. `thm-prime-number-theorem` (`seedData.ts:2111`): `titleZh: '素数定理 (PNT)'`

#### Category B: Node Type & Verification Meta in `src/lib/utils.ts` and `src/lib/i18nHelper.ts`
1. `getNodeTypeMeta` (`utils.ts:42-58`):
   - `AXIOM: { label: '公理 (Axiom)' }`
   - `DEFINITION: { label: '定义 (Definition)' }`
   - `LEMMA: { label: '引理 (Lemma)' }`
   - `THEOREM: { label: '定理 (Theorem)' }`
   - `COROLLARY: { label: '推论 (Corollary)' }`
   - `PROPERTY: { label: '性质 (Property)' }`
   - `EXAMPLE: { label: '例子 (Example)' }`
   - `COUNTER_EXAMPLE: { label: '反例 (Counterexample)' }`
   - `CONJECTURE: { label: '猜想 (Conjecture)' }`
2. `NODE_TYPE_LABELS` (`i18nHelper.ts:53-61`):
   - `zh` properties currently return clamped strings like `'公理 (Axiom)'` and `'定理 (Theorem)'` instead of pure Chinese `'公理'` and `'定理'`.
3. `getVerificationMeta` (`utils.ts:68-94`):
   - `badge: '🟢 已形式化验证 (Lean 4)'`
   - `badge: '🟡 人工同行评审通过'`
   - `badge: '🔴 形式化验证未通过'`
   - `badge: '⚪ 社区草稿 / 待评审'`

#### Category C: ZFC Campaign RPG Data in `src/lib/campaignEngine.ts`
1. `zfcAxiomRegistry` (`campaignEngine.ts:23-95`):
   - `AXIOM_EXTENSIONALITY`: `nameZh: '外延公理 (Extensionality)'`
   - `AXIOM_EMPTY_SET`: `nameZh: '空集存在公理 (Empty Set)'`
   - `AXIOM_PAIRING`: `nameZh: '无序配对公理 (Pairing)'`
   - `AXIOM_UNION`: `nameZh: '并集公理 (Union)'`
   - `AXIOM_POWER_SET`: `nameZh: '幂集公理 (Power Set)'`
   - `AXIOM_INFINITY`: `nameZh: '无穷公理 (Infinity)'`
   - `AXIOM_REPLACEMENT`: `nameZh: '替换公理模式 (Replacement)'`
   - `AXIOM_REGULARITY`: `nameZh: '正则公理/基础公理 (Regularity / Foundation)'`
   - `AXIOM_CHOICE`: `nameZh: '选择公理 (Axiom of Choice - AC)'`
2. `campaignEpochs` badges and titles (`campaignEngine.ts:120, 229, 349, 458, 566, 675`):
   - `badgeTitle: '虚空奠基者 (Void Founder)'`
   - `badgeTitle: '自然数创生者 (Ordinal Creator)'`
   - `badgeTitle: '代数结构师 (Algebraic Architect)'`
   - `badgeTitle: '连续统统御者 (Continuum Master)'`
   - `badgeTitle: '流形制图师 (Manifold Cartographer)'`
   - `badgeTitle: '形式化大宗师 (Grand Formalist Master)'`
3. `USER_LEVEL_TITLES` (`campaignEngine.ts:791-796`):
   - `'虚空学徒 (Apprentice of the Void)'`
   - `'公理建构师 (Axiom Architect)'`
   - `'代数拓荒者 (Algebraic Pioneer)'`
   - `'连续统探险家 (Continuum Explorer)'`
   - `'流形制图师 (Manifold Cartographer)'`
   - `'形式化大宗师 (Grand Formalist Master)'`

#### Category D: Fallacy Detective Lab Data in `src/lib/fallacyEngine.ts`
1. `fallacyCases` (`fallacyEngine.ts:85, 138, 185, 238, 286, 340`):
   - `formalTheoremNameZh`: e.g. `'代数域乘法群非零律 (Field Multiplicative Invertibility Theorem)'`
   - `formalTheoremNameZh`: `'黎曼级数重排与柯西收敛准则 (Riemann Rearrangement & Cauchy Criterion)'`
   - `formalTheoremNameZh`: `'全纯函数分支割线定理 (Holomorphic Branch Cut & Monodromy Theorem)'`
   - `formalTheoremNameZh`: `'弧长积分泛函下半连续性定理 (Arc Length Lower Semicontinuity Theorem)'`
   - `formalTheoremNameZh`: `'原函数族商空间等价类定理 (Antiderivative Affine Coset Modulo Constant)'`
   - `formalTheoremNameZh`: `'勒贝格支配收敛与莱布尼茨积分法则 (Lebesgue Dominated Convergence & Leibniz Rule)'`
2. `getCaseStats` detective titles (`fallacyEngine.ts:515-521`):
   - `'见习逻辑侦探 (Junior Inspector)'`
   - `'悖论鉴别专家 (Paradox Investigator)'`
   - `'高阶数学审判官 (Senior Proof Inquisitor)'`
   - `'大宗师逻辑法官 (Grand Formal Magistrate)'`

#### Category E: Static Component Data
1. `CounterExampleGallery.tsx` (`lines 12, 25, 36, 47, 58, 69, 91`):
   - `disprovenOrMonster: '病态反例 (Monster)' | '著名猜想反例 (Disproven)'`
   - Header title: `'数学反例与病态怪兽殿堂 (Mathematical Counterexamples & Monsters)'`
2. `CommutativeDiagramViewer.tsx` (`lines 67, 77, 78, 84, 96, 97`):
   - `title: '群的第一同构定理交换图 (First Isomorphism Commutative Diagram)'`
   - `title: '群与模的短正合列 (Short Exact Sequence)'`
   - Arrow labels containing Chinese in LaTeX: `label: '\\pi \\text{ (自然投影)}'`, `label: '\\bar{\\phi} \\text{ (唯一同构)}'`, `label: 'i \\text{ (单射)}'`, `label: 'p \\text{ (满射)}'`
3. `MathTimeline.tsx` (`lines 35, 43, 61, 69, 77, 95`):
   - Mathematician strings: `'毕达哥拉斯 (Pythagoras)'`, `'欧几里得 (Euclid of Alexandria)'`, `'莱布尼茨 (Leibniz) & 牛顿 (Newton)'`, `'欧拉 (Leonhard Euler)'`, `'柯西 (Cauchy) & 魏尔斯特拉斯 (Weierstrass)'`, `'伽罗瓦 (Évariste Galois)'`
4. `MscTreeExplorer.tsx` (`lines 23, 24, 32, 33, 50, 59, 75`):
   - `nameZh`: `'一般逻辑与类型论 (Type Theory / Lean)'`, `'公理集合论 (ZFC)'`, `'初等数论 (同余、素数)'`, `'Zeta 函数与 L 函数 (黎曼猜想)'`, `'有限群结构 (拉格朗日、西罗定理)'`, `'不等式理论 (柯西-施瓦茨、赫尔德)'`, `'微分流形与微分形式积分 (斯托克斯)'`
5. `LatexSymbolStudio.tsx` (`lines 22-80`):
   - Symbol descriptions: `'全称量词 (对任意 For all)'`, `'存在量词 (存在 There exists)'`, `'属于 (Element of)'`, `'子集包含 (Subset of)'`, `'定积分 (Definite integral)'`, etc.
6. `VerificationCertificate.tsx` (`lines 28, 57, 60, 66, 81`):
   - Header: `MATHUNIVERSE DEMO ENTRY (演示条目)`
   - Subtitle: `DEMO ENTRY (未形式化校验)`
   - Status: `未加载 (Demo Build)`

---

### 1.4 LaTeX Storage and Rendering Architecture

#### Storage Mechanism
- Mathematical formulas are stored as raw TeX/LaTeX strings across all entities:
  - `MathNode.statementLatex` (e.g. `|\langle u, v \rangle|^2 \le \langle u, u \rangle \cdot \langle v, v \rangle`)
  - `ProofStep.latexText`
  - `ZfcAxiomDefinition.firstOrderFormulaLatex`
  - `ConstructedEntity.setNotation`, `formalDefinitionLatex`
  - `FallacyCase.allegedConclusionLatex`, `FallacyStep.latex`, `formalRefutationLatex`
  - `CounterExampleItem.formulaLatex`
  - `NumericalVerificationContract.expectedResultDesc`

#### Rendering Pipeline
1. `src/components/math/LaTeXRenderer.tsx`:
   - Utilizes `katex.renderToString(formula.trim(), { displayMode, throwOnError: false, macros: globalLatexMacros, trust: false })`.
   - Macros registered in `src/lib/utils.ts` (`globalLatexMacros`): `\R`, `\N`, `\Z`, `\Q`, `\C`, `\P`, `\F`, `\eps`, `\norm`, `\abs`, `\inner`, `\set`, `\d`, `\diff`, `\pdiff`, `\ker`, `\im`, `\dim`, `\Span`, `\Aut`, `\Hom`, `\Gal`, `\id`, `\GL`, `\SL`, `\mod`.
   - Supports display math (`$$...$$` and `\[...\]`) and inline math (`$...$` and `\(...\)`).
   - Supports interactive bidirectional Wiki links (`[[Node Name]]`) parsed via `MathWikiLink` and `NodeHoverCard`.

---

## 2. Logic Chain

```
[Observation: MathNode currently contains statementPlainZh & intuitionMd, but lacks statementPlainEn & intuitionEn]
                                    │
                                    ▼
[Inference 1: Detail page & 3D cosmos currently display Chinese prose even when English locale is selected]
                                    │
                                    ▼
[Observation: i18nHelper.ts already specifies getNodeStatement(node, locale) checking node.statementEn/Zh]
                                    │
                                    ▼
[Inference 2: Schema enhancement is needed: Add statementEn, statementPlainEn, intuitionEn, historicalContextEn to MathNode and ProofStep/Proof without breaking existing statementPlainZh/intuitionMd]
                                    │
                                    ▼
[Observation: 14 seedData node titles, 9 ZFC axioms, 6 fallacy cases, and 9 node types use parenthetical Chinese(English) clumping]
                                    │
                                    ▼
[Inference 3: Decouple titleZh into pure Chinese (e.g. "数列极限", "柯西-施瓦茨不等式") and titleEn into pure English (e.g. "Limit of a Sequence", "Cauchy-Schwarz Inequality")]
                                    │
                                    ▼
[Observation: 520 automated tests in runTests.ts verify DAG topological sorting, export generation, and compute contracts]
                                    │
                                    ▼
[Conclusion: Backward-compatible schema evolution + dedicated localization lookup table enables 100% test integrity while achieving pure locale rendering]
```

### 2.1 Proposed Schema Refinement for `src/types/math.ts`

To decouple mathematical content cleanly while maintaining zero test regression, the `MathNode`, `ProofStep`, and `Proof` interfaces should be expanded as follows:

```typescript
export interface ProofStep {
  id: string;
  stepIndex: number;
  explanation: string;         // Legacy / active locale fallback
  explanationZh?: string;     // Pure Simplified Chinese explanation
  explanationEn?: string;     // Pure English explanation
  latexText: string;          // Mathematical formula (locale-independent)
  usedLemmas?: string[];
  commentsCount: number;
}

export interface Proof {
  id: string;
  nodeId: string;
  title: string;              // Legacy / active locale fallback
  titleZh?: string;          // Pure Simplified Chinese title
  titleEn?: string;          // Pure English title
  approachType: 'ALGEBRAIC' | 'GEOMETRIC' | 'ANALYTIC' | 'COMBINATORIAL' | 'CONSTRUCTIVE' | 'FORMAL_LEAN';
  author: { id: string; name: string; reputation: number; avatar: string; isModerator?: boolean };
  motivation: string;         // Legacy / active locale fallback
  motivationZh?: string;
  motivationEn?: string;
  rigorousProof: string;      // Full LaTeX/Markdown derivation
  rigorousProofZh?: string;
  rigorousProofEn?: string;
  steps: ProofStep[];
  isPrimary: boolean;
  verification: VerificationStatus;
  upvotes: number;
}

export interface MathNode {
  id: string;
  slug: string;
  titleZh: string;            // Pure Simplified Chinese title
  titleEn: string;            // Pure English title
  nodeType: NodeType;
  disciplineId: string;
  mscCode: string;
  statementLatex: string;     // Pure LaTeX formula (locale-independent)
  statementPlainZh: string;   // Pure Simplified Chinese statement
  statementPlainEn?: string;  // Pure English statement
  statementZh?: string;       // Alias for statementPlainZh
  statementEn?: string;       // Alias for statementPlainEn
  intuitionMd: string;        // Pure Simplified Chinese intuition
  intuitionZh?: string;       // Alias for intuitionMd
  intuitionEn?: string;       // Pure English intuition
  historicalContextZh?: string;
  historicalContextEn?: string;
  verification: VerificationStatus;
  reputationScore: number;
  viewCount: number;
  difficultyLevel: 1 | 2 | 3 | 4 | 5;
  dependencies: string[];
  dependents: string[];
  proofs: Proof[];
  leanFormalization?: LeanVerification;
  codeSnippets?: CodeSnippet[];
  comments?: StepComment[];
  tags: string[];             // Chinese tags
  tagsEn?: string[];          // English tags
  lastModified: string;
}
```

### 2.2 Proposed Schema Refinement for Campaign & Fallacy Types

1. **`ZfcAxiomDefinition` (`src/types/campaign.ts`)**:
   - Clean `nameZh` from `'外延公理 (Extensionality)'` to `'外延公理'`.
   - Add `intuitionEn: string` alongside `intuitionZh: string`.
2. **`ConstructedEntity` (`src/types/campaign.ts`)**:
   - Add `descriptionEn: string` alongside `descriptionZh: string`.
3. **`MilestoneDerivationStep` & `MilestoneChallenge` (`src/types/campaign.ts`)**:
   - Add `instructionEn: string` and `explanationEn: string`.
   - Add `descriptionEn: string`.
4. **`CampaignEpoch` (`src/types/campaign.ts`)**:
   - Clean `badgeTitle` into `badgeTitleZh: string` and `badgeTitleEn: string`.
   - Add `eraDescriptionEn: string`.
5. **`FallacyCategoryMeta` & `FallacyCase` (`src/types/fallacy.ts`)**:
   - Add `principleViolatedEn: string` and `shortDescEn: string`.
   - Decouple `formalTheoremNameZh` and add `formalTheoremNameEn: string`.
   - Add `storyContextEn: string` and `formalCritiqueEn: string`.
   - Add `flawReasonEn?: string` and `plainEn: string` to `FallacyStep`.

---

## 3. Caveats

1. **Test Suite Invariants**:
   - `tests/runTests.ts` and `tests/e2ePlatformIntegration.test.ts` contain 520 automated assertions.
   - Tests assert on `node.titleZh` (e.g. `expect(node.titleZh).toContain('柯西')`), `node.statementLatex`, and topological sorting order.
   - Any cleanups to `titleZh` (e.g. changing `'数列极限 (ε-N 定义)'` to `'数列极限'`) must preserve the core Chinese keywords like `'数列极限'` and `'柯西'` to ensure 100% test pass rate.
2. **Read-Only Investigation Protocol**:
   - In accordance with team rules, no changes have been applied to `src/` source code during this survey. All proposed data structures, cleanup mappings, and schema definitions are cataloged in this report.
3. **Scope of English Data**:
   - While `titleEn` exists for all 21 seed nodes, `statementPlainEn` and `intuitionEn` need complete, high-quality mathematical translations for all 21 nodes.

---

## 4. Conclusion

1. **Current State**: The mathematical core is robust with 21 rich nodes, 6 RPG epochs, 6 fallacy forensic cases, 4 automated numerical verification contracts, and multi-format academic exporters. However, content presentation currently suffers from widespread parenthetical bilingual clumping in titles, badges, and categories, and lacks English textual descriptions for intuitive explanations and proof steps.
2. **Decoupling Strategy**:
   - Use **entity-level localized fields** (`statementPlainZh`/`statementPlainEn`, `intuitionZh`/`intuitionEn`, `titleZh`/`titleEn`) for rich mathematical prose.
   - Keep **formulas (`statementLatex`) strictly locale-neutral**.
   - Use **i18n translation dictionaries** (`src/i18n/locales/zh.ts` and `en.ts`) for all UI labels, badge titles, detective ranks, and category descriptions.
   - Ensure all accessor functions in `src/lib/i18nHelper.ts` and `src/lib/utils.ts` respect the active locale.

---

## 5. Verification Method

To independently verify all findings and validate the mathematical data integrity:

1. **Node Inspection Command**:
   ```bash
   node .agents/explorer_survey_2/inspect_nodes.cjs
   ```
   *Expected Result*: Parses and logs all 21 MathNodes with their titles, MSC codes, dependencies, proofs, and Lean formalizations.

2. **Full Project Test Suite**:
   ```bash
   npm test
   ```
   *Expected Result*: All 520 tests across M1-M5 test groups and E2E platform workflows pass with 0 errors.

3. **TypeScript Compilation Check**:
   ```bash
   npm run build
   ```
   *Expected Result*: Next.js production build compiles with 0 type errors.
