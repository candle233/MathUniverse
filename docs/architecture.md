# MathUniverse Architectural Specification & Mathematical Ontology v2

## 1. Executive Summary & Dual-Graph Philosophy

MathUniverse is an open-source mathematical knowledge base, visualization engine, and formal verification platform.

A foundational design principle in MathUniverse is the **strict mathematical separation between the Prerequisite/Logical Derivation Graph and the Semantic Knowledge Graph**:

$$\mathcal{G} = \big( G_{\mathrm{prerequisite}},\, G_{\mathrm{semantic}} \big)$$

### 1.1 Prerequisite / Logical Derivation Graph $G_{\mathrm{prerequisite}} = (V, E_{\mathrm{prerequisite}})$
- **Topological Invariant**: Must be a **strict Directed Acyclic Graph (DAG)**.
- **Semantics**: An edge $(u, v)$ signifies that node $u$ strictly depends on $v$ as an axiomatic or logical prerequisite ($v \prec u$).
- **Relation Types**: `'LOGICALLY_USES' | 'LEARNING_PREREQUISITE' | 'REQUIRES_DEFINITION' | 'USES_LEMMA' | 'COROLLARY_OF' | 'PROVES' | 'INSTANCE_OF'`.
- **Properties**: Guarantees existence of valid topological orderings, transitive reduction (Hasse diagrams), and well-founded inductive derivations without circularity.

### 1.2 Semantic Knowledge Graph $G_{\mathrm{semantic}} = (V, E_{\mathrm{semantic}})$
- **Topological Invariant**: **Directed or undirected multi-graph (cycles permitted and expected)**.
- **Semantics**: Captures mathematical equivalence ($A \iff B$), generalizations ($A \text{ generalizes } B$), specializations, historical connections, and computational analogies.
- **Relation Types**: `'IMPLIES' | 'EQUIVALENT_TO' | 'GENERALIZES' | 'SPECIALIZES' | 'COUNTEREXAMPLE_TO' | 'MOTIVATES' | 'HISTORICALLY_RELATED' | 'COMPUTATIONALLY_SIMULATES'`.

---

## 2. Mathematical Object Hierarchy

To prevent conceptual conflation between definitions and assertions:
- **Definition** (`objectType: 'DEFINITION'`): Establishes mathematical objects, language, and structures (e.g. *Sequence Limit*, *Inner Product Space*, *Group*). Definitions do not possess proofs.
- **Proposition** (`objectType: 'PROPOSITION'`): Mathematical claims carrying truth values. Roles include:
  - `'THEOREM'`: Central significant mathematical result.
  - `'LEMMA'`: Auxiliary stepping-stone proposition.
  - `'COROLLARY'`: Direct deduction from an established theorem.
  - `'CONJECTURE'`: Unproven mathematical assertion.
  - `'PROPERTY'`: Characteristic property of an algebraic or topological structure.
- **Proof** (`MathProof`): Independent object. A single proposition can possess multiple proofs (e.g. Analytic, Algebraic, Geometric, Probabilistic) with distinct prerequisite dependencies.
- **Formalization** (`LeanFormalization`): Formal proof code in Lean 4 + Mathlib with verifiable cryptographic attestation.

---

## 3. Cryptographic Formal Verification Provenance

MathUniverse formal verifications do not rely on binary flags or trust-by-assertion. Every verified node includes a revision-bound `FormalVerificationRecord`:

$$V = \big(h_s,\, h_p,\, v_{\text{Lean}},\, c_{\text{mathlib}},\, I,\, A,\, r,\, t,\, k\big)$$

- $h_s = \operatorname{SHA-256}(\operatorname{Canonical}(\text{statementLatex}))$;
- $h_p = \operatorname{SHA-256}(\operatorname{Canonical}(\text{leanCode}))$;
- $v_{\text{Lean}}$: Lean compiler release (e.g. `Lean (version 4.14.0)`);
- $c_{\text{mathlib}}$: Mathlib git revision / tag;
- $I$: Imported Mathlib modules;
- $A$: Axioms utilized as reported by Lean kernel (`#print axioms`, e.g. `propext`, `Classical.choice`, `Quot.sound`);
- $r$: Result status (`'PASSED' | 'FAILED' | 'SYNTAX_ERROR' | 'TIMEOUT'`);
- $t$: Timestamp of kernel attestation;
- $k$: Checker identifier (`'LEAN_KERNEL' | 'LAKE_CLI' | 'COMMUNITY_ORACLE'`).

Any alteration to the mathematical statement or proof code immediately breaks hash equality during runtime audits via `verifyFormalProvenance(node)`.

---

## 4. Algorithmic Complexity & Graph Scalability

| Algorithm | Previous Implementation | Current Optimized Engine | Time Complexity | Space Complexity |
| :--- | :--- | :--- | :--- | :--- |
| **Topological Sort** | `Array.shift()` in JS queue | Pointer index queue (`head++`) | $\mathcal{O}(V + E)$ | $\mathcal{O}(V)$ |
| **Transitive Closure** | Recursive unmemoized DFS | BFS with Set visited cache | $\mathcal{O}(V + E)$ | $\mathcal{O}(V)$ |
| **Transitive Reduction** | Cubic BFS per pair | Local reachability pruning | $\mathcal{O}(V \cdot E)$ | $\mathcal{O}(V + E)$ |
| **Graph Diagnostics** | Single-pass Kahn cycle mixup | Tarjan 3-color DFS + Referential audit | $\mathcal{O}(V + E)$ | $\mathcal{O}(V)$ |
| **Derivation Paths** | Unbounded exponential DFS | Bounded Search (`maxPaths`, `maxDepth`) | $\mathcal{O}(\text{bounded})$ | $\mathcal{O}(\text{depth})$ |

---

## 5. UI Architecture & Internationalization

- Built on Next.js 15 App Router + React 19 + Tailwind CSS + Framer Motion.
- Pure zero-overhead i18n layer (`LanguageContext`, `zh.ts`, `en.ts`) with automated chaos/adversarial test verification.
- Academic Export Studio supporting LaTeX, Typst, Beamer, Quarto, TikZ CD, and Overleaf instant dispatch.
