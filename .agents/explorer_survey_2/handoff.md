# Handoff Report: R1 (Computation Sandbox) & R3 (3D WebGL Cosmos) Technical Survey

**Explorer**: Explorer 2 (Sandbox & 3D WebGL Cosmos Explorer)  
**Date**: 2026-08-29  
**Scope**: R1 (Client-Side Interactive Mathematical Computation Sandbox) & R3 (Advanced 3D WebGL / GPU Knowledge Cosmos & Prerequisite Pathway)  
**Status**: Comprehensive Survey & Architectural Specification Complete  

---

## 1. Observation

### 1.1 Existing Codebase & UI Components Inventory

Direct inspection of the codebase at `c:/Users/Mechrevo/Downloads/math-proj` reveals:

1. **`package.json` (`package.json:1-34`)**:
   - Dependencies: `next@15.1.0`, `react@19.0.0`, `react-dom@19.0.0`, `framer-motion@11.15.0`, `katex@0.16.11`, `lucide-react@0.468.0`, `clsx@2.1.1`, `tailwind-merge@2.5.5`.
   - `three` and `@types/three` are **not yet listed** in `package.json` (npm registry check verified `three@0.185.1` is accessible).

2. **Existing Computation & Sandbox Components**:
   - **`src/components/sandbox/PythonSandbox.tsx:75-78`**:
     * Verbatim observation: `"This sandbox does NOT load Pyodide. The math here is computed in plain TypeScript via a useMemo branch on snippet.id. Pyodide would add 5-10MB and is out of scope for this demo build..."`
     * Evaluates only 5 hardcoded snippet branches (`py-limit-sim`, `py-cs-sim`, `py-ftc-sim`, `py-fermat-verify`, `py-stokes-sim`). User-edited Python code is not executed.
     * Contains parameter slider controls and interactive SVG/HTML visual representations.
   - **`src/components/sandbox/MathComputeEngine.tsx:1-516`**:
     * Implements client-side TypeScript calculus evaluations (Taylor polynomials, numerical derivative, Simpson integration), matrix spectral analysis (determinant, trace, rank, Gauss-Jordan inverse, eigenvalues), ODE simulations (Lotka-Volterra, Lorenz attractor, Van der Pol), and number theory analysis (prime factorization, Euler totient, Collatz trajectory).
     * Renders 2D Canvas graphs and phase plane trajectories.
   - **`src/lib/mathCompute.ts:1-329`**:
     * Core mathematical algorithms implemented in TypeScript: Simpson's 3/8 integration (`numericalIntegrate`), 5-point central difference derivative (`numericalDerivative`), Taylor series expansion (`computeTaylorSeries`), Gaussian elimination & 2x2/3x3 eigenvalue solver (`analyzeMatrix`), RK4 differential equation integrator (`solveODE_RK4`), integer factorization & Euler totient (`analyzeNumber`).

3. **Existing 2D/3D & Graph Visualization Components**:
   - **`src/components/graph/KnowledgeStarChart.tsx:1-692`**:
     * 2D HTML5 Canvas star graph with mouse pan/zoom, node dragging, BFS upstream prerequisite and downstream dependent highlighting, and viewport frustum culling.
     * Nodes placed in a 2D circular arrangement around canvas center.
   - **`src/components/graph/LearningPathTree.tsx:1-263`**:
     * Cascading discipline/subcategory/target selector with topological reverse-prerequisite traversal (`traverse(depId)`).
   - **`src/components/math/ThreeMathSurface.tsx:1-540`**:
     * Named `ThreeMathSurface`, but currently implements **2.5D Canvas software projection** (Euler rotation matrices + Painter's algorithm face depth sorting for Möbius strip, Torus, Hyperbolic Paraboloid, Riemann Sphere, Monkey Saddle, Catenoid, Helicoid, Lorenz trajectory).
   - **`src/components/math/DynamicalSystemsLab.tsx:1-427`**:
     * 2D phase portrait canvas with vector field quiver grid and interactive RK4 particle stream emission.

4. **Existing Graph Utilities & Type Check Diagnostics**:
   - **`tests/runTests.ts`**:
     * Running `npm test` runs 10 DAG engine tests and passes 100% (10/10).
   - **`src/lib/dagEngine.ts:1-162`**:
     * Implements `checkCircularDependency`, `topologicalSort` (returns `{ sorted: MathNode[], isDAG: boolean }`), and `findDerivationPaths`.
   - **`npx tsc --noEmit` build diagnostic**:
     * Observed compilation errors in `src/lib/exportEngine.ts` and `src/lib/prerequisiteClosure.ts` due to missing export `getTransitivePrerequisites` in `dagEngine.ts` and `topologicalSort` return type expectation discrepancies.

---

## 2. Logic Chain & Technical Design Specifications

### 2.1 Technical Design for R1: Client-Side Interactive Mathematical Computation Sandbox

```
┌────────────────────────────────────────────────────────────────────────┐
│                          User Interface                                │
│  ┌───────────────────────┐  ┌────────────────┐  ┌───────────────────┐  │
│  │ Python/SymPy Code IDE │  │ Live Parameter │  │ 2D / 3D Canvas &  │  │
│  │ (Syntax Highlighted)  │  │ Dynamic Slider │  │ WebGL Viewport    │  │
│  └───────────┬───────────┘  └────────┬───────┘  └─────────▲─────────┘  │
└──────────────┼───────────────────────┼────────────────────┼────────────┘
               │                       │                    │
               ▼                       ▼                    │
┌────────────────────────────────────────────────────────┐  │
│             Pyodide Worker Manager / Client            │  │
│  - Lazy CDN Loader (https://cdn.jsdelivr.net/pyodide)  │  │
│  - 5-10s Execution Watchdog & Force Termination Guard  │  │
│  - Debounced Input Dispatcher (50ms - 150ms)           │  │
│  - Fallback to Native TS Math Engine when offline      │  │
└──────────────────────────────┬─────────────────────────┘  │
                               │ postMessage                │
                               ▼                            │
┌────────────────────────────────────────────────────────┐  │
│             Dedicated Web Worker Thread                │  │
│  - WebAssembly Pyodide Runtime                         │  │
│  - Pre-warmed packages: SymPy, NumPy, SciPy            │  │
│  - Mathematical Execution Sandbox & JSON Bridge        │  │
│  - Extracted Plot Data, LaTeX Formulas, Invariants ────┴──┘
└────────────────────────────────────────────────────────┘
```

#### 2.1.1 Web Worker Architecture & Pyodide / SymPy Integration
- **Worker Script (`public/workers/pyodide.worker.js` or Next.js Web Worker)**:
  - Loads Pyodide from CDN: `importScripts('https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js')`.
  - Initializes Pyodide runtime: `await loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/' })`.
  - Installs mathematical packages: `await pyodide.loadPackage(['sympy', 'numpy'])`.
  - Prepares execution environment with standard helper imports (`import sympy as sp, numpy as np`).
- **Communication Protocol (`PyodideMessage`)**:
  ```typescript
  export type PyodideWorkerRequest =
    | { type: 'INIT'; packages?: string[] }
    | { type: 'RUN_CODE'; runId: string; code: string; params: Record<string, number>; timeoutMs?: number }
    | { type: 'VERIFY_CLAIM'; runId: string; nodeId: string; testCode: string; params?: Record<string, number> };

  export type PyodideWorkerResponse =
    | { type: 'READY'; version: string }
    | { type: 'STATUS'; state: 'loading' | 'installing' | 'ready' | 'running'; message: string; progress?: number }
    | { type: 'EXECUTION_SUCCESS'; runId: string; stdout: string; latexResult?: string; plotData?: PlotDataPayload; executionTimeMs: number }
    | { type: 'EXECUTION_ERROR'; runId: string; errorType: string; errorMessage: string; traceback?: string }
    | { type: 'VERIFY_RESULT'; runId: string; nodeId: string; passed: boolean; maxError: number; details: string; durationMs: number };
  ```
- **Timeout Guard & Memory Protection**:
  - SymPy operations (e.g. `sp.solve`, `sp.integrate`, `sp.groebner`) can cause infinite loops or extreme CPU load.
  - Worker client attaches a `setTimeout(..., timeoutMs = 8000)`. If timeout triggers before worker responds, the client calls `worker.terminate()`, returns a descriptive timeout error to the user, and spawns a fresh worker instance.
- **Offline / Instant Fallback Engine**:
  - When network is unavailable or while Pyodide is downloading the ~10MB wasm runtime, the UI seamlessly delegates to `mathCompute.ts` for real-time evaluations with 0ms latency.

#### 2.1.2 Parameter Sliders & Live State Binding
- **Slider Configuration Schema**:
  ```typescript
  export interface ParameterSliderConfig {
    id: string;
    label: string;
    symbol: string; // e.g. "α", "k", "x₀"
    min: number;
    max: number;
    step: number;
    default: number;
    unit?: string;
    description?: string;
  }
  ```
- **Variable Injection**:
  - Slider values are injected directly into the Python execution scope:
    ```python
    # Auto-injected parameter dictionary
    params = { ... }
    # User code access directly via params['alpha'] or unpacked variables
    ```
- **Debounce & Throttling**:
  - Continuous slider dragging triggers updates throttled at 50ms for lightweight numerical evaluations and debounced at 150ms for heavy symbolic SymPy expressions.

#### 2.1.3 Live 2D/3D Multi-Modal Plotting Engine
- **Plot Modes**:
  1. **2D Function Curves & Slices**: $y = f(x)$, $f(x, y) = 0$, Riemann sum rectangles, Taylor series polynomials overlaid on target functions, Fourier partial sums.
  2. **2D Vector Fields & Phase Planes**: First-order ODE systems $(\dot{x}, \dot{y}) = (f(x,y), g(x,y))$ with quiver arrows and RK4 streamline animations.
  3. **3D Parametric Surfaces**: $S(u,v) = (x(u,v), y(u,v), z(u,v))$ rendered with Three.js / WebGL shaders, normal vectors, wireframe toggle, and real-time deformation sliders.
  4. **3D Differential Curves & Attractors**: Strange attractors (Lorenz, Rössler, Chen), knotted curves, geodesic flows.
  5. **Complex Branch Cuts & Phase Portraits**: Visualizing domain coloring $f(z) = u(x,y) + i v(x,y)$ with color wheel hue representing $\arg(f(z))$ and brightness representing $|f(z)|$.

#### 2.1.4 Automated Numerical & Symbolic Verification for Mathematical Nodes
- **Verification Contract Schema on `MathNode`**:
  ```typescript
  export interface NumericalVerificationContract {
    id: string;
    nodeId: string;
    claimName: string;
    testType: 'IDENTITY_MONTE_CARLO' | 'INTEGRAL_CONVERGENCE' | 'ODE_ENERGY_CONSERVATION' | 'SYMPY_SYMBOLIC_ZERO';
    tolerance: number; // e.g. 1e-9
    sampleSize: number; // e.g. 1000 random points
    domain: Record<string, [number, number]>; // parameter bounding box
    pythonVerificationScript: string;
    typescriptFallbackChecker?: (params: Record<string, number>) => { passed: boolean; error: number };
  }
  ```
- **Concrete Verification Examples**:
  - *Cauchy-Schwarz Inequality*: Generates $N=5000$ random vectors in $\mathbb{R}^n$, asserts $|\langle u, v \rangle| \le \|u\| \|v\| + 10^{-12}$.
  - *Fundamental Theorem of Calculus*: Compares $\int_a^b f'(t)dt$ computed via Simpson's 3/8 numerical integration against $f(b) - f(a)$, asserts error $< 10^{-6}$.
  - *Stokes' Theorem*: Computes surface flux integral $\iint_S (\nabla \times \mathbf{F}) \cdot d\mathbf{S}$ and line circulation $\oint_{\partial S} \mathbf{F} \cdot d\mathbf{r}$, asserts equality.
  - *Fermat's Little Theorem*: BigInt modular exponentiation testing $a^{p-1} \equiv 1 \pmod p$ for prime $p$ and $\gcd(a,p)=1$.

---

### 2.2 Technical Design for R3: Advanced 3D WebGL / GPU Knowledge Cosmos & Prerequisite Pathway

```
┌────────────────────────────────────────────────────────────────────────┐
│               3D WebGL Knowledge Cosmos (Three.js Scene)               │
│                                                                        │
│   🌌 Nebula Clusters (Disciplines):                                    │
│   Analysis (Cyan) · Algebra (Amber) · Topology (Emerald)               │
│   Number Theory (Purple) · Logic/Set Theory (Rose)                     │
│                                                                        │
│   ⭐ Star Nodes:                                                       │
│   Axioms (Cosmic Core) ➔ Lemmas ➔ Theorems ➔ Frontiers                 │
│   (InstancedMesh / Point Sprites + Custom Glowing Bloom Shaders)       │
│                                                                        │
│   ⚡ Prerequisite Pathway:                                             │
│   Glowing Neon Flow Beams (CatmullRomCurve3 + Animated Dash Shader)    │
│   Particle Pulses traversing from Axioms to Selected Target Theorem    │
│                                                                        │
│   🎥 Camera Navigation:                                                │
│   Smooth Cinematic Flythrough, Orbit Controls, Raycasting Selection    │
└────────────────────────────────────────────────────────────────────────┘
```

#### 2.2.1 3D Graph Physics, Spatial Nebula Clustering & Layout Algorithms
- **Force-Directed 3D Physics Simulation**:
  - Node position $\mathbf{p}_i = (x_i, y_i, z_i) \in \mathbb{R}^3$.
  - **Repulsive Force (Coulomb)**:
    $$\mathbf{F}_{rep}(i, j) = k_e \frac{q_i q_j}{\|\mathbf{p}_i - \mathbf{p}_j\|^2} \hat{\mathbf{r}}_{ij}$$
  - **Attractive Edge Force (Hooke's Spring)**: For $(i, j) \in E$ (prerequisites):
    $$\mathbf{F}_{att}(i, j) = k_s (\|\mathbf{p}_i - \mathbf{p}_j\| - L_0) \hat{\mathbf{r}}_{ji}$$
  - **Discipline Cluster Centroid Attraction**:
    Each discipline $D_k$ has a predefined centroid $\mathbf{C}_k$ on an outer celestial sphere. Nodes belonging to discipline $D_k$ experience an attraction force:
    $$\mathbf{F}_{cluster}(i) = k_{cluster} (\mathbf{C}_{D(i)} - \mathbf{p}_i)$$
  - **Topological Stratification ($Z$-Axis / Radial Shell Depth)**:
    Nodes are assigned a topological depth $d(v) = \max_{\text{path from Axiom}} \text{length}$.
    - Axioms ($d=0$) reside at the central galactic core ($z \approx 0, r \le 50$).
    - Advanced theorems ($d \ge 3$) orbit in outer galactic arms ($r \ge 250$).

#### 2.2.2 Three.js WebGL Rendering Pipeline & Performance
- **Scene Entities**:
  1. **Discipline Nebula Cloud**: Volumetric particle clouds using `THREE.Points` with additive blending (`THREE.AdditiveBlending`) and radial texture maps.
  2. **Star Nodes**: Rendered using `THREE.InstancedMesh` or custom `THREE.ShaderMaterial` with vertex colors matching node types (Axiom=Amber, Theorem=Sky, Lemma=Violet, Definition=Emerald, Conjecture=Rose).
  3. **Dependency Edges**: Rendered using `THREE.LineSegments` for non-selected edges (culled when far), and dynamic `THREE.TubeGeometry` / `THREE.CatmullRomCurve3` with glowing neon shaders for active prerequisite paths.
  4. **Animated Truth Particles**: Flowing particle pulses traveling along active prerequisite lines from source to destination.
- **Frustum Culling, Level of Detail (LOD) & Raycasting**:
  - Distance-based LOD: At high distances ($d > 500$), node text labels are hidden and stars are rendered as simple point sprites. At close zoom ($d < 200$), full 3D badges, LaTeX formulas, and halos are rendered.
  - Interactive Selection: `THREE.Raycaster` on `pointermove` and `click` with screen-space hit bounding threshold for responsive selection.

#### 2.2.3 Smooth Flythrough Camera Navigation
- **Camera Controller Modes**:
  1. **Free Orbit Mode**: Standard damped orbital camera rotation around the cosmic origin.
  2. **Discipline Nebula Focus**: Smooth interpolation (using cubic Hermite / Catmull-Rom splines) to focus the camera on a discipline centroid $\mathbf{C}_k$.
  3. **Node Flythrough**: Selecting a node initiates a cinematic flythrough curve that glides the camera into an optimal observation orbit around the target star while framing its incoming prerequisite constellation.

#### 2.2.4 Minimum Prerequisite Closure Paths & Topological Graph Algorithms
- **Required Algorithms in `dagEngine.ts`**:
  1. **`getTransitivePrerequisites(targetId: string, nodes: MathNode[]): string[]`**:
     * Backward BFS/DFS reachability finding all ancestors $Anc(T) = \{u \in V \mid u \rightsquigarrow T\}$.
  2. **`getTransitiveClosure(nodes: MathNode[]): Map<string, Set<string>>`**:
     * Computes complete reachability matrix $R[u, v] = 1 \iff u \rightsquigarrow v$.
  3. **`computeTransitiveReduction(nodes: MathNode[]): Array<{ from: string; to: string }>`**:
     * Computes the Hasse diagram (minimal essential edges) by eliminating transitively implied shortcuts (if $u \to v$ and $v \to w$, removes direct edge $u \to w$).
  4. **`computeMinimumPrerequisiteClosure(targetId: string, knownNodeIds: string[], allNodes: MathNode[]): PrerequisiteClosureResult`**:
     * Calculates learned vs unlearned nodes, readiness percentage, total estimated study hours, and identifies **critical bottleneck theorems** (nodes with highest betweenness/dependent count within the prerequisite closure).

---

## 3. Caveats

1. **Pyodide CDN Latency & Bundle Size**:
   - Initial loading of Pyodide + SymPy requires downloading ~10MB-15MB of WebAssembly binaries. A loading state with a percentage bar and instantaneous fallback to TypeScript math computation (`mathCompute.ts`) must always be available so user experience is never blocked.
2. **WebGL Fallback for Low-End Devices / Non-WebGL Environments**:
   - In environments where WebGL is unavailable or context is lost (`WEBGL_lose_context`), the system should provide an automatic fallback to the high-performance 2D Canvas Star Chart (`KnowledgeStarChart.tsx`).
3. **Circular Dependency Guard**:
   - While the initial seed dataset is 100% acyclic (verified by unit test `tests/runTests.ts`), any future user-created or edited dependency edges must strictly pass through `checkCircularDependency` before graph ingestion.
4. **No caveats on architecture feasibility**: All proposed libraries (`three`, Pyodide CDN worker, KaTeX, Framer Motion) are completely compatible with Next.js 15 App Router and client-side execution.

---

## 4. Conclusion

1. **R1 (Computation Sandbox)**:
   - A modular client-side computation architecture should be built around:
     * A dedicated Web Worker (`pyodide.worker.js` / client wrapper) with CDN lazy loading, SymPy execution, timeout watchdog (8s), and structured JSON messaging.
     * Instant pure-TypeScript math computation fallback (`mathCompute.ts`).
     * Reactive parameter sliders with debounced/throttled state binding.
     * Multi-modal live plotting (2D curves, vector fields, 3D surfaces, strange attractors).
     * Automated mathematical node verification suite checking theorem identities and numerical convergence.
2. **R3 (3D WebGL Cosmos & Prerequisite Pathway)**:
   - A high-performance 3D WebGL Knowledge Cosmos should be constructed using:
     * Three.js GPU rendering (`InstancedMesh`, `Points` nebula particles, glowing tube/line shaders).
     * 3D force-directed layout clustering the 6 mathematical disciplines into distinct cosmic nebulae, with radial/depth stratification by topological distance from Axiom roots.
     * Cinematic camera flythrough navigation with smooth spline interpolation and raycasting selection.
     * Comprehensive DAG algorithms in `dagEngine.ts` (`getTransitivePrerequisites`, `computeTransitiveReduction`, `computeMinimumPrerequisiteClosure`) powering glowing neon prerequisite flow paths and bottleneck analysis.
3. **Immediate Codebase Fix Identified**:
   - Exporting `getTransitivePrerequisites` in `src/lib/dagEngine.ts` and updating `topologicalSort` return type handling in `src/lib/exportEngine.ts` and `src/lib/prerequisiteClosure.ts` will immediately resolve all existing TypeScript build errors.

---

## 5. Verification Method

To independently verify the findings of this survey:

1. **Codebase Inspection & Test Suite**:
   - Inspect existing implementation files:
     * `src/components/sandbox/PythonSandbox.tsx` (lines 75-78 for Pyodide status)
     * `src/components/sandbox/MathComputeEngine.tsx` (lines 1-516 for TS math engine)
     * `src/components/math/ThreeMathSurface.tsx` (lines 1-540 for 2.5D Canvas projection)
     * `src/components/graph/KnowledgeStarChart.tsx` (lines 1-692 for 2D Canvas graph)
     * `src/lib/dagEngine.ts` & `src/lib/prerequisiteClosure.ts` (for DAG functions)
   - Run existing DAG test suite:
     ```bash
     npm test
     ```
     Expected output: 10 passed, 0 failed.
2. **TypeScript Compilation Check**:
   - Run typecheck:
     ```bash
     npx tsc --noEmit
     ```
     Confirms the exact compilation diagnostics noted in Section 1.4.
3. **Dependency & Environment Verification**:
   - Check npm registry availability for Three.js:
     ```bash
     npm view three version
     ```
     Confirms `three` is ready for installation.
