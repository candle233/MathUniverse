# MathUniverse Codebase Architecture & DAG Engine Survey Report

**Explorer**: Explorer 1 (Codebase Architecture & DAG Engine Explorer)  
**Target Repository**: `c:/Users/Mechrevo/Downloads/math-proj`  
**Timestamp**: 2026-08-29T02:28:00Z  
**Status**: Survey Complete (10/10 Baseline DAG Tests Passing, Build Diagnosis & Integration Blueprint Ready)

---

## 1. Observation

### 1.1 Dependency & Build Configuration Landscape
- **`package.json`**:
  - `name`: `"mathuniverse"`, `version`: `"1.0.0"`
  - `dependencies`:
    - `"clsx"`: `^2.1.1`
    - `"framer-motion"`: `^11.15.0`
    - `"katex"`: `^0.16.11`
    - `"lucide-react"`: `^0.468.0`
    - `"next"`: `^15.1.0`
    - `"react"`: `^19.0.0`
    - `"react-dom"`: `^19.0.0`
    - `"tailwind-merge"`: `^2.5.5`
  - `devDependencies`:
    - `"@types/katex"`: `^0.16.7`
    - `"@types/node"`: `^20.17.10`
    - `"@types/react"`: `^19.0.0`
    - `"@types/react-dom"`: `^19.0.0`
    - `"autoprefixer"`: `^10.4.20`
    - `"postcss"`: `^8.4.49`
    - `"tailwindcss"`: `^3.4.17`
    - `"typescript"`: `^5.7.2`
  - `scripts`:
    - `"dev"`: `"next dev -H 127.0.0.1 -p 5050"`
    - `"build"`: `"next build"`
    - `"start"`: `"next start -H 127.0.0.1 -p 5050"`
    - `"test"`: `"node --experimental-strip-types tests/runTests.ts"`
    - `"lint"`: `"next lint"`
  - **Notable Package State**:
    - Neither `three` nor `@types/three` are in `package.json` (3D rendering currently operates via 2D HTML5 Canvas matrix projection in `ThreeMathSurface.tsx` and `Cosmos3DGraph.tsx`).
    - Neither `pyodide` package nor `jest`/`vitest` are installed. Testing is powered by Node 20's native `--experimental-strip-types` executing `tests/runTests.ts`.

- **`tsconfig.json`**:
  - Target: `"ES2022"`, Module: `"esnext"`, ModuleResolution: `"bundler"`, `strict: true`.
  - Path alias: `"@/*": ["./src/*"]`.
  - Included paths: `["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"]`.
  - Excluded paths: `["node_modules", "tests"]`.

- **`next.config.ts`**:
  - Standard NextConfig with `reactStrictMode: true`.

- **`tailwind.config.ts`**:
  - Custom math taxonomy theme palette (`math.axiom`: `#8b5cf6`, `math.definition`: `#3b82f6`, `math.lemma`: `#06b6d4`, `math.theorem`: `#10b981`, `math.corollary`: `#14b8a6`, `math.property`: `#6366f1`, `math.example`: `#f59e0b`, `math.counterexample`: `#ef4444`, `math.conjecture`: `#ec4899`).

---

### 1.2 Mathematical Graph / DAG Engine & Data Model Architecture
- **Ontology & Interfaces (`src/types/math.ts`)**:
  - `NodeType`: `'AXIOM' | 'DEFINITION' | 'LEMMA' | 'THEOREM' | 'COROLLARY' | 'PROPERTY' | 'EXAMPLE' | 'COUNTER_EXAMPLE' | 'CONJECTURE'`
  - `VerificationStatus`: `'UNVERIFIED' | 'PEER_REVIEWED' | 'FORMALLY_VERIFIED' | 'VERIFICATION_FAILED'`
  - `EdgeRelationType`: `'REQUIRES_DEFINITION' | 'USES_LEMMA' | 'COROLLARY_OF' | 'COUNTEREXAMPLE_TO' | 'GENERALIZATION_OF'`
  - `MathNode`: Encapsulates atomic identifier `id`, `slug`, titles (`titleZh`, `titleEn`), `statementLatex`, `statementPlainZh`, `intuitionMd`, `verification`, `difficultyLevel` (1-5), `dependencies: string[]`, `dependents: string[]`, `proofs: Proof[]`, `leanFormalization?: LeanVerification`, `codeSnippets?: CodeSnippet[]`, `tags: string[]`.

- **DAG Engine Core (`src/lib/dagEngine.ts`)**:
  - `checkCircularDependency(nodes, fromNodeId, toNodeId)`: 3-color DFS cycle detector (0: Unvisited, 1: Visiting, 2: Visited) with cycle path reconstruction.
  - `topologicalSort(nodes)`: Kahn's in-degree queue algorithm returning `{ sorted: MathNode[]; isDAG: boolean }`.
  - `findDerivationPaths(nodes, startPrereqId, targetTheoremId)`: Depth-first search pathfinder accumulating all logical prerequisite derivation trajectories.

- **Prerequisite Closure Module (`src/lib/prerequisiteClosure.ts`)**:
  - `computeMinimumPrerequisiteClosure(targetId, knownNodeIds, allNodes)`: Calculates unlearned prerequisite nodes, learned nodes, readiness percentage, estimated learning hours, critical bottleneck nodes, and discipline breakdown.

- **Seed Corpus (`src/data/seedData.ts` & `src/data/disciplines.ts`)**:
  - 21 fully structured seed nodes across Analysis, Algebra, Topology, Number Theory, and Linear Algebra.
  - High-tier theorems included: Stokes' Theorem (`thm-stokes`), Fundamental Theorem of Calculus (`thm-ftc`), Heine-Borel (`thm-heine-borel`), Cauchy-Schwarz (`thm-cauchy-schwarz`), Fermat's Little Theorem (`thm-fermat-little`), First Isomorphism Theorem (`thm-first-isomorphism`), Banach Fixed Point (`thm-banach-fixed-point`), Euler's Identity (`thm-euler-identity`), Riemann Hypothesis (`conjecture-riemann-hypothesis`), etc.

---

### 1.3 Baseline Test Suite Execution & Results
- **Command Run**: `npm test` (`node --experimental-strip-types tests/runTests.ts`)
- **Verbatim Output**:
```text
🧪 ==========================================
🧪 Starting MathUniverse DAG Engine Test Suite
🧪 ==========================================

--- Test Group 1: Seed Data DAG Validity ---
  ✅ [PASS] Seed data graph must be a valid Directed Acyclic Graph (isDAG = true)
  ✅ [PASS] All 21 seed nodes must be topologically sortable
  ✅ [PASS] Limit definition (ε-N) must precede Fundamental Theorem of Calculus
  ✅ [PASS] Fundamental Theorem of Calculus must precede Generalized Stokes Theorem

--- Test Group 2: Circular Dependency Detection ---
  ✅ [PASS] Attempting to make Stokes a prerequisite of Limit must be detected as a cycle
  ✅ [PASS] Self-dependency (A -> A) must be detected as a cycle
  ✅ [PASS] Adding non-cyclic dependency must return hasCycle = false

--- Test Group 3: Derivation Pathfinding ---
  ✅ [PASS] Must find at least 1 derivation path from Limit to Stokes (found 2)
  📍 Discovered Path: def-limit-sequence -> thm-ftc -> thm-stokes

--- Test Group 4: Dependency Data Integrity ---
  ✅ [PASS] No node may reference a non-existent node id (found 0 phantom references)
  ✅ [PASS] dependencies and dependents must be mirror images of each other (found 0 mismatches)

==========================================
📊 Test Results: 10 passed, 0 failed
==========================================
```

---

### 1.4 Baseline Build Diagnosis
- **Command Run**: `npm run build` / `npx tsc --noEmit`
- **Verbatim Failure Output**:
```text
src/lib/exportEngine.ts(2,10): error TS2305: Module '"./dagEngine"' has no exported member 'getTransitivePrerequisites'.
src/lib/exportEngine.ts(25,40): error TS2339: Property 'filter' does not exist on type '{ sorted: MathNode[]; isDAG: boolean; }'.
src/lib/prerequisiteClosure.ts(2,10): error TS2305: Module '"./dagEngine"' has no exported member 'getTransitivePrerequisites'.
src/lib/prerequisiteClosure.ts(35,6): error TS2339: Property 'filter' does not exist on type '{ sorted: MathNode[]; isDAG: boolean; }'.
```
- **Root Cause Analysis**:
  1. `dagEngine.ts` is missing the export for `getTransitivePrerequisites(targetId: string, allNodes: MathNode[]): string[]`.
  2. `exportEngine.ts` and `prerequisiteClosure.ts` assumed `topologicalSort(allNodes)` returned an array of IDs or accessed `.filter` directly instead of `.sorted.map((n) => n.id)`.

---

## 2. Logic Chain

1. **DAG Engine Integrity**:
   - `dagEngine.ts` successfully implements Kahn's algorithm and 3-color DFS cycle detection.
   - All 21 seed nodes satisfy the DAG invariant with 0 phantom dependencies and 100% symmetric `dependencies` $\leftrightarrow$ `dependents` links.
   - The test runner in `tests/runTests.ts` executes cleanly with zero failures (10/10).

2. **Root Cause of Build Errors**:
   - `exportEngine.ts` and `prerequisiteClosure.ts` rely on recursive ancestor traversal function `getTransitivePrerequisites`.
   - Adding `getTransitivePrerequisites` in `dagEngine.ts` and normalizing the `topologicalSort` return type handling in `exportEngine.ts` and `prerequisiteClosure.ts` directly resolves 100% of the build errors.

3. **Feature Extension Alignment (R1 - R4)**:
   - **R1 (Interactive Computation Sandbox)**: `src/lib/mathCompute.ts` and `src/components/sandbox/PythonSandbox.tsx` / `MathComputeEngine.tsx` are established. Enhancing them with Pyodide client-side Web Worker / CDN execution and rich SymPy algorithms integrates seamlessly into `NodeDetailClient` and the home page.
   - **R2 (ZFC Campaign & Fallacy Detective)**: `src/components/math/ZfcCampaignQuest.tsx` and `src/components/math/FallacyDetectiveLab.tsx` are already written and structured with detailed epochs and fallacies (e.g. division by zero, complex branch cuts, divergent series). They are integrated into `src/app/community/page.tsx`.
   - **R3 (3D WebGL / GPU Knowledge Cosmos & Closure Pathway)**: `src/components/graph/Cosmos3DGraph.tsx` and `src/lib/prerequisiteClosure.ts` provide 3D discipline nebulae and minimum prerequisite closure visualization. Fixing `getTransitivePrerequisites` fully activates R3.
   - **R4 (Academic Publishing & Toolchain Exporter)**: `src/lib/exportEngine.ts` and `src/components/export/AcademicExportStudio.tsx` generate LaTeX papers, Typst 0.11+ source documents, and Beamer slides. Fixing the `dagEngine` export allows recursive topological prerequisite compilation.

---

## 3. Caveats

1. **Test Runner Tooling**: The project does not currently use Jest or Vitest; tests run directly via `node --experimental-strip-types tests/runTests.ts`. Future test files added should follow this pattern or be imported into `runTests.ts` so `npm test` runs them deterministically.
2. **WebGL / Canvas Rendering**: 3D rendering in `Cosmos3DGraph.tsx` and `ThreeMathSurface.tsx` uses high-performance 2D Canvas trigonometric projection rather than heavyweight external WebGL bundles, ensuring 0 external 3D engine bundle bloat and instant load times.
3. **Pyodide WASM Runtime**: Pyodide can be loaded asynchronously via official CDN script injection or Web Worker to avoid bloating the initial Next.js production bundle.

---

## 4. Conclusion & Actionable Integration Blueprint

To achieve full compliance with all acceptance criteria:
1. **Fix `src/lib/dagEngine.ts`**:
   - Implement and export `getTransitivePrerequisites(targetId: string, allNodes: MathNode[]): string[]` using BFS/DFS traversal over `node.dependencies`.
2. **Fix `src/lib/prerequisiteClosure.ts` & `src/lib/exportEngine.ts`**:
   - Correct the `topologicalSort` invocation: `const sortResult = topologicalSort(allNodes); const sortedAllIds = sortResult.sorted.map((n) => n.id);`.
   - Fix explicit typing of parameters in array callbacks.
3. **Verify Baseline & Build**:
   - Execute `npm test` to verify 10/10 tests pass.
   - Execute `npx tsc --noEmit` and `npm run build` to confirm zero type errors and clean production build.
4. **Expand Test Suite in `tests/runTests.ts`**:
   - Add unit tests for `getTransitivePrerequisites`, `computeMinimumPrerequisiteClosure`, `generateLatexPaper`, `generateTypstDoc`, and `mathCompute` numerical routines.

---

## 5. Verification Method

To independently reproduce and verify this investigation:
1. Run baseline unit tests:
   ```bash
   npm test
   ```
   *Expected result*: 10 tests passed across 4 test groups.
2. Run TypeScript type checker:
   ```bash
   npx tsc --noEmit
   ```
   *Expected result*: Identifies the missing `getTransitivePrerequisites` in `dagEngine.ts` and callsite adjustments in `exportEngine.ts` and `prerequisiteClosure.ts`.
3. Run Next.js production build:
   ```bash
   npm run build
   ```
