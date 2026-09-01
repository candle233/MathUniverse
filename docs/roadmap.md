# MathUniverse Development Roadmap

## Current Version (v1.0.0 — Production Ready)
- [x] **Dual-Graph Model**: Strict logical prerequisite DAG ($G_{\mathrm{prerequisite}}$) + cyclic semantic association graph ($G_{\mathrm{semantic}}$).
- [x] **Mathematical Ontology v2**: Definitions, Propositions (Theorem, Lemma, Corollary, Conjecture), Multi-Proof structures.
- [x] **Cryptographic Formal Provenance**: Statement and Lean 4 code hash attestation with Lean kernel axiom records.
- [x] **Scalable DAG Engine**: $\mathcal{O}(V+E)$ pointer-queue Kahn's sort, full graph diagnostics (dangling references vs cycles), bounded derivation pathfinding.
- [x] **Hasse Transitive Reduction**: Automatic removal of redundant logical shortcuts for clean visualization.
- [x] **Unified Test Suite & PBT**: 1200+ automated unit tests and property-based graph theory invariant tests.
- [x] **Academic Publishing Studio**: Instant export to LaTeX, Typst, Beamer 16:9, Quarto Markdown, TikZ CD, and Overleaf.

---

## Phase 2: In-Browser Lean 4 Kernel Execution (v1.1 - v1.2)
- [x] **Interactive Tactic State Inspector & Simulator**: Step-by-step goal state visualization and transitions (intro, rcases, rw, calc, exact) across logic, arithmetic, algebra, and topology.
- [x] **Interactive Commutative Diagrams (TikZ-cd & SVG)**: Factorization squares, Short Exact Sequences, Snake Lemma, Natural Transformations, and Pullback/Fiber Product Universal Properties.
- [ ] **WebAssembly Lean 4 Runtime**: Integrate Lean 4 WASM / WebWorker sandbox for client-side instant proof checking without remote servers.
- [ ] **Continuous Axiom Linter**: Automatic validation of `#print axioms` in user-submitted pull requests.

---

## Phase 3: Community & Knowledge Graph Scaling (v1.3 - v2.0)
- [ ] **Mathlib Automated Ingestion**: Semantic parser to map Mathlib4 theorems and definitions into the MathUniverse dual graph.
- [ ] **Multi-Agent Verification Pipeline**: Autonomous AI agents generating and formalizing bilingual proofs with human-in-the-loop review.
- [ ] **Collaborative Peer Review**: Decentralized cryptographic signing of mathematical proof reviews.
- [ ] **3D Immersive VR/XR Star Chart**: WebXR visualization of complex multi-branch mathematical universes.
