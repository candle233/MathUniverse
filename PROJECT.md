# Project: MathUniverse Expansion

## Architecture
MathUniverse is a Next.js 15 (React 19) mathematical knowledge platform combining a formal directed acyclic graph (DAG) ontology, client-side Python/SymPy and TypeScript computation engines, gamified mathematical exploration (ZFC RPG and Fallacy Detective), 3D WebGL / Canvas cosmological visualization, and multi-format academic publishing exporters (LaTeX, Typst, Beamer, Markdown).

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                   MathUniverse UI Layer                                │
│   ┌───────────────────┬───────────────────┬───────────────────┬────────────────────┐   │
│   │ Interactive       │ Gamified RPG &    │ 3D Knowledge      │ Academic Export    │   │
│   │ Python Sandbox    │ Fallacy Detective │ Cosmos (WebGL)    │ Studio             │   │
│   │ (Pyodide / SymPy) │ (ZFC -> Modern)   │ (Nebulae & Paths) │ (LaTeX/Typst/etc.) │   │
│   └─────────┬─────────┴─────────┬─────────┴─────────┬─────────┴──────────┬─────────┘   │
└─────────────┼───────────────────┼───────────────────┼────────────────────┼─────────────┘
              │                   │                   │                    │
┌─────────────▼───────────────────▼───────────────────▼────────────────────▼─────────────┐
│                            Core Mathematical & Engine Layer                            │
│  - `dagEngine.ts`: Topological sort, Transitive Closure, Cycle Detection, Paths        │
│  - `mathCompute.ts`: Simpson integration, Taylor series, ODE RK4, Matrix & Primes      │
│  - `prerequisiteClosure.ts`: Minimum Prerequisite Closure, Bottleneck Analysis         │
│  - `exportEngine.ts`: AMS-LaTeX, Typst 0.11+, Beamer, Quarto, Overleaf, TikZ-cd        │
│  - `fallacyEngine.ts` / `campaignEngine.ts`: Game state, validation & verification     │
│  - `pyodide.worker.ts`: Web Worker client-side Python/SymPy sandbox                    │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | DAG Core & Transitive Closure Exporter | Export `getTransitivePrerequisites`, normalize Kahn topological sort, cycle check, and pathfinder | M1 | survey |
| 2 | Pyodide Web Worker & SymPy Engine | Dedicated Web Worker for Pyodide & SymPy with CDN lazy loading, 8s watchdog guard, and TS fallback | M1 | survey |
| 3 | Reactive Parameter Sliders | Dynamic slider schema with debounced/throttled state binding injecting variables into Python scope | M1 | survey |
| 4 | Multi-Modal Live 2D/3D Plotting | 2D curves, Taylor series, vector fields, RK4 phase plane, 3D parametric surfaces, strange attractors | M1 | survey |
| 5 | Automated Mathematical Node Verification | Monte Carlo identities (Cauchy-Schwarz, FTC numerical integral, Fermat mod exp, Stokes flux/line) | M1 | survey |
| 6 | ZFC to Modern Math RPG Campaign Tree | 6 Epochs (Genesis, Peano, Number Systems, Reals, Topology, Modern), Axiom unlock state, entity synthesis | M2 | survey |
| 7 | Fallacy Detective Interactive Lab | 6 Fallacy categories (Zero Div, Divergent, Branch Cut, Semicontinuity, Int Constant, Leibniz), step debugger | M2 | survey |
| 8 | 3D WebGL Knowledge Cosmos & Force Layout | 3D particle/force layout, clustering 6 discipline nebulae, radial/depth stratification from Axioms | M3 | survey |
| 9 | Cinematic Camera Flythrough & Navigation | Damped orbit controls, discipline nebula focus, smooth node flythrough curves, raycasting selection | M3 | survey |
| 10 | Minimum Prerequisite Closure Visualization | Topological closure reachability, Transitive Reduction / Hasse diagram, bottleneck analysis, neon path shaders | M3 | survey |
| 11 | Multi-Target Academic Exporter Engine | AMS-LaTeX article with amsthm/listings, Modern Typst 0.11+, LaTeX Beamer, Quarto/Markdown, Overleaf | M4 | survey |
| 12 | Recursive Prerequisite Compilation & Diagrams | Topologically ordered theorem compilation, TikZ dependency graphs, commutative diagrams tikz-cd, proof trees | M4 | survey |
| 13 | Comprehensive Unit & Functional Test Suite | 10/10 existing DAG tests + comprehensive test suites for DAG, Math Compute, ZFC RPG, Fallacy, and Exporters | M5 | survey |
| 14 | Clean Production Build & UI Integration | Zero TypeScript errors, clean `npm run build`, responsive design, full UI wiring across all pages | M5 | survey |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Core DAG Fixes & Interactive Computation Sandbox (R1) | Features 1, 2, 3, 4, 5: `dagEngine.ts` export fix, Pyodide/SymPy worker, sliders, 2D/3D plots, node verification | none | DONE |
| M2 | Gamified Progression (ZFC RPG) & Fallacy Detective (R2) | Features 6, 7: 6-epoch ZFC progression, axiom unlocker, construction validator, 6-category fallacy lab | M1 | DONE |
| M3 | 3D WebGL Knowledge Cosmos & Prerequisite Pathway (R3) | Features 8, 9, 10: 3D force layout, nebulae clusters, camera flythrough, minimum prerequisite closure | M1 | DONE |
| M4 | Academic Publishing & Toolchain Exporter (R4) | Features 11, 12: AMS-LaTeX, Typst 0.11+, Beamer, Overleaf, TikZ-cd diagrams, recursive prerequisite compiler | M1 | DONE |
| M5 | Comprehensive Testing, E2E Integration & Quality Gate | Features 13, 14: Comprehensive unit & functional test suite, `npm test` 100% pass, `npm run build` 0 errors | M1, M2, M3, M4 | DONE |

## Interface Contracts

### 1. `dagEngine.ts` ↔ All Consumer Modules
- `getTransitivePrerequisites(nodeId: string, allNodes: MathNode[]): string[]`
  - Returns array of ancestor node IDs required directly or transitively by `nodeId`.
- `topologicalSort(nodes: MathNode[]): { sorted: MathNode[]; isDAG: boolean }`
  - Returns topologically sorted array of `MathNode` objects and DAG validity boolean.
- `checkCircularDependency(nodes: MathNode[], fromNodeId: string, toNodeId: string): { hasCycle: boolean; cyclePath?: string[] }`
- `findDerivationPaths(nodes: MathNode[], startId: string, targetId: string): string[][]`

### 2. `pyodide.worker` ↔ `PythonSandbox.tsx`
- Request: `{ type: 'RUN_CODE', runId: string, code: string, params: Record<string, number>, timeoutMs?: number }`
- Response: `{ type: 'EXECUTION_SUCCESS', runId: string, stdout: string, latexResult?: string, plotData?: any, executionTimeMs: number }` | `{ type: 'EXECUTION_ERROR', runId: string, errorMessage: string }`
- Fallback: `mathCompute.ts` evaluated with zero latency when worker is loading or offline.

### 3. `campaign.ts` & `fallacy.ts` ↔ UI Components
- `ZfcCampaignQuest`: Consumes 6 `CampaignEpoch` definitions, manages `UserCampaignProgress`, validates axiom choices and constructive derivations.
- `FallacyDetectiveLab`: Consumes 6 `FallacyCase` definitions, validates step accusations, outputs formal refutations and Lean disproofs.

### 4. `exportEngine.ts` ↔ `AcademicExportStudio.tsx`
- `generateLatexPaper(targetNode: MathNode, allNodes: MathNode[], options: ExportOptions): string`
- `generateTypstDoc(targetNode: MathNode, allNodes: MathNode[], options: ExportOptions): string`
- `generateBeamerPresentation(targetNode: MathNode, allNodes: MathNode[], options: ExportOptions): string`
- `generateMarkdownDoc(targetNode: MathNode, allNodes: MathNode[], options: ExportOptions): string`
- `generateOverleafUrl(targetNode: MathNode, allNodes: MathNode[]): string`

## Code Layout
- `src/types/`: `math.ts`, `campaign.ts`, `fallacy.ts`, `export.ts`, `sandbox.ts`
- `src/lib/`: `dagEngine.ts`, `mathCompute.ts`, `prerequisiteClosure.ts`, `exportEngine.ts`, `campaignEngine.ts`, `fallacyEngine.ts`
- `src/components/sandbox/`: `PythonSandbox.tsx`, `MathComputeEngine.tsx`, `ParameterSliders.tsx`, `Plot2DCanvas.tsx`, `Plot3DSurface.tsx`
- `src/components/math/`: `ZfcCampaignQuest.tsx`, `FallacyDetectiveLab.tsx`, `ThreeMathSurface.tsx`, `DynamicalSystemsLab.tsx`, `TikzStudio.tsx`
- `src/components/graph/`: `Cosmos3DGraph.tsx`, `KnowledgeStarChart.tsx`, `LearningPathTree.tsx`
- `src/components/export/`: `AcademicExportStudio.tsx`
- `tests/`: `runTests.ts` (test runner), `dagEngine.test.ts`, `mathCompute.test.ts`, `campaign.test.ts`, `fallacy.test.ts`, `exportEngine.test.ts`, `e2ePlatformIntegration.test.ts`
