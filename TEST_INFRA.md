# E2E Test Infra: MathUniverse Expansion

## Test Philosophy
- Opaque-box, requirement-driven mathematical verification and system integrity testing.
- Methodology: Category-Partition + Boundary Value Analysis (BVA) + Pairwise Combinatorial + Real-World Workloads.

## Feature Inventory & Test Coverage Matrix
| # | Feature | Requirement Source | Tier 1 (Coverage) | Tier 2 (Boundary/Edge) | Tier 3 (Cross-Feature) | Tier 4 (Application) |
|---|---------|-------------------|:-----------------:|:----------------------:|:----------------------:|:--------------------:|
| F1 | DAG Engine & Transitive Closure | ORIGINAL_REQUEST §Acceptance Criteria | 5 | 5 | ✓ | ✓ |
| F2 | Pyodide & SymPy Computation Engine | ORIGINAL_REQUEST §R1 | 5 | 5 | ✓ | ✓ |
| F3 | Parameter Sliders & Live State | ORIGINAL_REQUEST §R1 | 5 | 5 | ✓ | ✓ |
| F4 | Multi-Modal 2D/3D Plotting | ORIGINAL_REQUEST §R1 | 5 | 5 | ✓ | ✓ |
| F5 | Automated Node Verification | ORIGINAL_REQUEST §R1 | 5 | 5 | ✓ | ✓ |
| F6 | ZFC to Modern Math RPG Campaign | ORIGINAL_REQUEST §R2 | 5 | 5 | ✓ | ✓ |
| F7 | Fallacy Detective Interactive Lab | ORIGINAL_REQUEST §R2 | 5 | 5 | ✓ | ✓ |
| F8 | 3D WebGL Knowledge Cosmos | ORIGINAL_REQUEST §R3 | 5 | 5 | ✓ | ✓ |
| F9 | Flythrough Navigation & Selection | ORIGINAL_REQUEST §R3 | 5 | 5 | ✓ | ✓ |
| F10 | Minimum Prerequisite Closure Path | ORIGINAL_REQUEST §R3 | 5 | 5 | ✓ | ✓ |
| F11 | Academic Exporter (LaTeX/Typst/Beamer/MD) | ORIGINAL_REQUEST §R4 | 5 | 5 | ✓ | ✓ |
| F12 | Recursive Prerequisite Trees & TikZ-cd | ORIGINAL_REQUEST §R4 | 5 | 5 | ✓ | ✓ |

## Test Architecture
- Test Runner: Node 20 `--experimental-strip-types tests/runTests.ts`
- Verification Commands:
  - `npm test` -> Executes full suite of unit and integration test assertions with detailed reporting.
  - `npm run build` / `npx tsc --noEmit` -> Verifies TypeScript type cleanliness across all components.

## Coverage Goals
- Tier 1: ≥5 per feature (Happy-path isolation tests verifying each module's core functions)
- Tier 2: ≥5 per feature (Boundaries: empty graphs, single-node cycles, divergent series, division by zero, multi-branch ambiguities)
- Tier 3: Pairwise combinations (e.g. DAG transitive closure fed into Academic Exporter, Pyodide parameters bound to 3D surfaces, ZFC unlock state unlocking Cosmos nebulae)
- Tier 4: Real-world end-to-end mathematical workflows (e.g., Stokes theorem derivation from limit definitions, compiling complete differential geometry syllabus to Typst/LaTeX).
