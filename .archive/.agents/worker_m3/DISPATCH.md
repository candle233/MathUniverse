## 2026-08-29T03:00:29Z
You are Worker 3 for Milestone 3 (M3: Advanced 3D WebGL / GPU Knowledge Cosmos & Prerequisite Pathway) of the MathUniverse platform expansion project.

Working directory: c:/Users/Mechrevo/Downloads/math-proj/.agents/worker_m3
Project scope document: c:/Users/Mechrevo/Downloads/math-proj/PROJECT.md
Original request path: c:/Users/Mechrevo/Downloads/math-proj/.agents/ORIGINAL_REQUEST.md
Survey report: c:/Users/Mechrevo/Downloads/math-proj/.agents/explorer_survey_2/handoff.md

Your exclusive write ownership:
- `src/components/graph/Cosmos3DGraph.tsx`
- `src/lib/prerequisiteClosure.ts`
- `src/components/graph/KnowledgeStarChart.tsx`
- `src/components/graph/LearningPathTree.tsx`
- `tests/runTests.ts`

Mission & Deliverables:
1. 3D Knowledge Cosmos Graph Engine (`src/components/graph/Cosmos3DGraph.tsx`):
   - High-performance 3D cosmological layout combining 3D force physics (Coulomb node repulsion, Hooke spring edges, discipline centroid attraction) clustering mathematical nodes into 6 distinct cosmic nebulae:
     * Analysis (Cyan Nebula), Algebra (Amber Nebula), Topology (Emerald Nebula), Number Theory (Purple Nebula), Logic/Set Theory (Rose Nebula), Applied Math (Indigo Nebula).
   - Radial and Depth Stratification: topological depth from Axiom roots determines cosmic orbital shells (Axioms at core galactic center, Definitions at inner rings, Lemmas at mid-band, High-tier Theorems at outer spiral arms).
   - Star Node Rendering: 3D perspective projection with node size scaling by dependent weight, glowing halos, spectral badges, and type-specific colors (Axiom, Theorem, Lemma, Definition, Conjecture).
   - Volumetric Nebula Particle Cloud: Ambient cosmic starfield and glowing nebula particle dust clusters.
   - Smooth Cinematic Camera Flythrough & Controls:
     * Damped 3D orbit controls (mouse drag rotation, scroll zoom, pan).
     * Discipline nebula jump buttons gliding camera to sector centroids.
     * Target Node Flythrough: selecting any node smoothly animates camera to frame the target and its incoming prerequisite constellation.
     * Interactive Raycasting / Screen-Space hit detection for node selection and hover tooltips.
2. Minimum Prerequisite Closure Pathways & Glowing Shaders (`src/lib/prerequisiteClosure.ts`, `src/components/graph/Cosmos3DGraph.tsx`):
   - Implemented in `prerequisiteClosure.ts`:
     * Minimal prerequisite closure traversal (`computeMinimumPrerequisiteClosure`).
     * Transitive reduction / Hasse diagram computation (eliminating redundant shortcut edges).
     * Critical bottleneck theorem calculation (identifying nodes with highest betweenness centrality / dependent load within the prerequisite subgraph).
     * Readiness percentage score and estimated study hours calculation.
   - Visualized in `Cosmos3DGraph.tsx`:
     * Active Prerequisite Flow: Glowing neon pulse lines connecting all prerequisite ancestor stars to the selected target theorem.
     * Animated truth energy particles flowing along directed prerequisite curves from Axioms toward the goal.
     * Bottleneck theorem visual badges highlighting critical milestone gates in the learning trajectory.
     * Learning Pathway sidebar displaying step-by-step ordered learning sequence, readiness bar, and study time estimates.
3. Verification & Testing:
   - Add Unit Test Group 13 in `tests/runTests.ts` covering 3D nebula clustering coordinates, radial topological depth stratification, Hasse transitive reduction, minimum prerequisite closure calculation, and critical bottleneck theorem scoring.
   - Execute `npm test`, `npx tsc --noEmit`, and `npm run build` in the terminal to verify 100% tests passing and clean static site generation.
