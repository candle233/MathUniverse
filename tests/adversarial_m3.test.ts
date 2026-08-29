/**
 * Adversarial Stress & Integrity Test Harness for Milestone 3 (M3)
 * Comprehensive empirical testing:
 * 1. computeTransitiveReduction (Hasse Diagram):
 *    - Complete DAGs (Kn tournaments: K3, K5, K10, K20)
 *    - Multi-Tier Bipartite DAGs (Km,n,p) with cross-tier shortcut bypasses
 *    - Complete Bipartite DAGs (Km,n)
 *    - Star DAGs (1-to-N fanout, N-to-1 fanin)
 *    - Dense Diamond Lattices with multi-path bypasses
 *    - Disconnected components & singletons
 *    - Long chains with multi-hop skips (N = 100)
 *    - Subset filtering (subsetIds)
 *    - Reachability Invariance Oracle (all-pairs equivalence)
 *    - Shortcut-Free Property Oracle (no length >= 2 alternate paths)
 * 2. computeMinimumPrerequisiteClosure & calculateCriticalBottlenecks:
 *    - Root nodes (0 prerequisites)
 *    - Unknown targets
 *    - Full, empty, partial, and superset knowledge states
 *    - Bottleneck centrality scoring, ranking, and rationale
 * 3. computeTopologicalDepths & getOrbitalShell:
 *    - Strict depth inequalities
 *    - 4 Cosmic Orbital Shell boundaries
 * 4. compute3DCosmosLayout:
 *    - Zero-distance singularity & collision resilience
 *    - Empty graph & single node graph
 *    - Large graph (150 nodes) performance & bounded coordinates [-800, 800]^3
 *    - Cosmic discipline nebulae mappings
 */

import { initialMathNodes } from '../src/data/seedData.ts';
import type { MathNode, DisciplineId, NodeType } from '../src/types/math.ts';
import {
  computeTransitiveReduction,
  computeMinimumPrerequisiteClosure,
  calculateCriticalBottlenecks,
  computeTopologicalDepths,
  getOrbitalShell,
  compute3DCosmosLayout,
  COSMIC_NEBULAE,
  mapDisciplineToNebula,
} from '../src/lib/prerequisiteClosure.ts';
import { topologicalSort, getTransitivePrerequisites } from '../src/lib/dagEngine.ts';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, extraInfo?: string) {
  if (condition) {
    console.log(`  ✅ [PASS] ${testName}`);
    passed++;
  } else {
    console.error(`  ❌ [FAIL] ${testName}${extraInfo ? ` -> ${extraInfo}` : ''}`);
    failed++;
  }
}

console.log('⚔️ =======================================================');
console.log('⚔️  EMPIRICAL ADVERSARIAL STRESS HARNESS - MILESTONE 3  ⚔️');
console.log('⚔️ =======================================================\n');

// Helper to create synthetic nodes
function createMockNode(
  id: string,
  deps: string[] = [],
  dependents: string[] = [],
  disciplineId: DisciplineId = 'analysis',
  nodeType: NodeType = 'THEOREM',
  difficultyLevel: 1 | 2 | 3 | 4 | 5 = 3
): MathNode {
  return {
    id,
    slug: id,
    titleZh: `Node ${id}`,
    titleEn: `Node ${id}`,
    descriptionZh: `Description for ${id}`,
    descriptionEn: `Description for ${id}`,
    disciplineId,
    nodeType,
    difficultyLevel,
    dependencies: [...deps],
    dependents: [...dependents],
    tags: ['test'],
    historicalContext: { century: '20th', mathematicians: ['TestEuler'], era: 'modern' },
    intuitionZh: '直觉',
    intuitionEn: 'Intuition',
    formalStatementLatex: 'P \\implies Q',
  };
}

// Reachability Matrix Oracle using Warshall's Algorithm / BFS
function computeAllPairsReachability(nodes: MathNode[], edges?: Array<{ from: string; to: string }>): Map<string, Set<string>> {
  const reach = new Map<string, Set<string>>();
  nodes.forEach((n) => reach.set(n.id, new Set<string>()));

  if (edges) {
    edges.forEach((e) => {
      if (reach.has(e.from)) {
        reach.get(e.from)!.add(e.to);
      }
    });
  } else {
    nodes.forEach((n) => {
      n.dependencies.forEach((d) => {
        reach.get(n.id)!.add(d);
      });
    });
  }

  // Transitive closure (Warshall / BFS)
  const nodeIds = nodes.map((n) => n.id);
  let changed = true;
  while (changed) {
    changed = false;
    for (const u of nodeIds) {
      const uReach = reach.get(u)!;
      for (const v of Array.from(uReach)) {
        const vReach = reach.get(v);
        if (vReach) {
          for (const w of vReach) {
            if (!uReach.has(w)) {
              uReach.add(w);
              changed = true;
            }
          }
        }
      }
    }
  }

  return reach;
}

// -----------------------------------------------------------------------------------------
// SECTION 1: Adversarial Stress Testing on Transitive Reduction (Hasse Diagram Engine)
// -----------------------------------------------------------------------------------------
console.log('--- SECTION 1: Transitive Reduction (Hasse Diagram) Stress & Invariance ---');

// 1.1 Complete DAG (Tournament Graph Kn): K3, K5, K10, K20
for (const n of [3, 5, 10, 20]) {
  const completeNodes: MathNode[] = [];
  for (let i = 0; i < n; i++) {
    const deps = [];
    for (let j = 0; j < i; j++) deps.push(`k${n}-v${j}`);
    const dependents = [];
    for (let j = i + 1; j < n; j++) dependents.push(`k${n}-v${j}`);
    completeNodes.push(createMockNode(`k${n}-v${i}`, deps, dependents));
  }

  const rawEdgeCount = (n * (n - 1)) / 2;
  const reduction = computeTransitiveReduction(completeNodes);

  assert(
    reduction.length === n - 1,
    `Complete DAG K${n} (with ${rawEdgeCount} edges) must reduce to exactly ${n - 1} essential edges (got ${reduction.length})`
  );

  let allLinear = true;
  for (let i = 1; i < n; i++) {
    const fromId = `k${n}-v${i}`;
    const toId = `k${n}-v${i - 1}`;
    if (!reduction.some((e) => e.from === fromId && e.to === toId)) {
      allLinear = false;
      break;
    }
  }
  assert(allLinear, `Complete DAG K${n} reduction must contain strictly the adjacent chain edges (v_i -> v_{i-1})`);

  // Reachability Invariance Oracle
  const originalReach = computeAllPairsReachability(completeNodes);
  const reducedReach = computeAllPairsReachability(completeNodes, reduction);

  let reachInvariant = true;
  for (const u of completeNodes) {
    const origSet = originalReach.get(u.id)!;
    const redSet = reducedReach.get(u.id)!;
    if (origSet.size !== redSet.size) {
      reachInvariant = false;
      break;
    }
    for (const item of origSet) {
      if (!redSet.has(item)) {
        reachInvariant = false;
        break;
      }
    }
  }
  assert(reachInvariant, `Complete DAG K${n} reduction must strictly preserve all-pairs reachability`);
}

// 1.2 Multi-Tier Bipartite DAG (Km,n,p) with Cross-Tier Shortcuts
{
  const M = 4, N = 3, P = 5;
  const multiTierNodes: MathNode[] = [];
  const l0Ids: string[] = [];
  const l1Ids: string[] = [];
  const l2Ids: string[] = [];

  for (let i = 0; i < M; i++) {
    const id = `l0-${i}`;
    l0Ids.push(id);
    multiTierNodes.push(createMockNode(id, []));
  }
  for (let j = 0; j < N; j++) {
    const id = `l1-${j}`;
    l1Ids.push(id);
    multiTierNodes.push(createMockNode(id, [...l0Ids]));
  }
  for (let k = 0; k < P; k++) {
    const id = `l2-${k}`;
    l2Ids.push(id);
    multiTierNodes.push(createMockNode(id, [...l1Ids, ...l0Ids]));
  }

  const rawEdges = M * N + N * P + M * P;
  const reduction = computeTransitiveReduction(multiTierNodes);
  const expectedEdges = M * N + N * P;

  assert(
    reduction.length === expectedEdges,
    `Multi-tier DAG K${M},${N},${P} with ${rawEdges} edges must reduce to ${expectedEdges} edges (pruned ${M * P} cross edges, got ${reduction.length})`
  );

  let crossEdgeFound = false;
  for (const k of l2Ids) {
    for (const i of l0Ids) {
      if (reduction.some((e) => e.from === k && e.to === i)) {
        crossEdgeFound = true;
        break;
      }
    }
  }
  assert(!crossEdgeFound, 'Multi-tier DAG: All cross-tier shortcut edges (Layer 2 -> Layer 0) were pruned');

  const origReach = computeAllPairsReachability(multiTierNodes);
  const redReach = computeAllPairsReachability(multiTierNodes, reduction);
  let reachMatch = true;
  for (const n of multiTierNodes) {
    const o = origReach.get(n.id)!;
    const r = redReach.get(n.id)!;
    if (o.size !== r.size || Array.from(o).some((x) => !r.has(x))) {
      reachMatch = false;
      break;
    }
  }
  assert(reachMatch, 'Multi-tier DAG: All-pairs reachability is 100% preserved');
}

// 1.3 Complete Bipartite DAG (Km,n) with No Intermediate Hops
{
  const m = 5, n = 6;
  const bipNodes: MathNode[] = [];
  const sources = [];
  for (let i = 0; i < m; i++) {
    const id = `bip-src-${i}`;
    sources.push(id);
    bipNodes.push(createMockNode(id, []));
  }
  for (let j = 0; j < n; j++) {
    bipNodes.push(createMockNode(`bip-snk-${j}`, [...sources]));
  }

  const reduction = computeTransitiveReduction(bipNodes);
  assert(
    reduction.length === m * n,
    `Pure bipartite DAG K${m},${n} has 0 redundant paths; must retain all ${m * n} edges (got ${reduction.length})`
  );
}

// 1.4 Star Fan-Out & Star Fan-In
{
  const starOutNodes: MathNode[] = [createMockNode('star-root')];
  for (let i = 0; i < 50; i++) {
    starOutNodes.push(createMockNode(`star-leaf-${i}`, ['star-root']));
  }
  const starOutRed = computeTransitiveReduction(starOutNodes);
  assert(starOutRed.length === 50, `Star 1-to-50 fan-out retains all 50 edges (got ${starOutRed.length})`);

  const starInNodes: MathNode[] = [];
  const roots: string[] = [];
  for (let i = 0; i < 50; i++) {
    const id = `star-in-root-${i}`;
    roots.push(id);
    starInNodes.push(createMockNode(id));
  }
  starInNodes.push(createMockNode('star-in-sink', roots));
  const starInRed = computeTransitiveReduction(starInNodes);
  assert(starInRed.length === 50, `Star 50-to-1 fan-in retains all 50 edges (got ${starInRed.length})`);
}

// 1.5 Dense Multi-Path Diamond Lattice with Cross-Tier Shortcuts
{
  const diamondNodes: MathNode[] = [
    createMockNode('d-S', [], ['d-A1', 'd-A2', 'd-A3', 'd-B1', 'd-B2', 'd-T']),
    createMockNode('d-A1', ['d-S'], ['d-B1', 'd-B2', 'd-T']),
    createMockNode('d-A2', ['d-S'], ['d-B2', 'd-B3']),
    createMockNode('d-A3', ['d-S'], ['d-B3']),
    createMockNode('d-B1', ['d-A1', 'd-S'], ['d-T']),
    createMockNode('d-B2', ['d-A1', 'd-A2', 'd-S'], ['d-T']),
    createMockNode('d-B3', ['d-A2', 'd-A3'], ['d-T']),
    createMockNode('d-T', ['d-B1', 'd-B2', 'd-B3', 'd-S', 'd-A1'], []),
  ];

  const reduction = computeTransitiveReduction(diamondNodes);

  const hasShortcutST = reduction.some((e) => e.from === 'd-T' && e.to === 'd-S');
  const hasShortcutSA1 = reduction.some((e) => e.from === 'd-T' && e.to === 'd-A1');
  const hasShortcutB1S = reduction.some((e) => e.from === 'd-B1' && e.to === 'd-S');
  const hasShortcutB2S = reduction.some((e) => e.from === 'd-B2' && e.to === 'd-S');

  assert(!hasShortcutST, 'Diamond DAG: shortcut edge d-T -> d-S must be pruned');
  assert(!hasShortcutSA1, 'Diamond DAG: shortcut edge d-T -> d-A1 must be pruned');
  assert(!hasShortcutB1S, 'Diamond DAG: shortcut edge d-B1 -> d-S must be pruned');
  assert(!hasShortcutB2S, 'Diamond DAG: shortcut edge d-B2 -> d-S must be pruned');

  const origReach = computeAllPairsReachability(diamondNodes);
  const redReach = computeAllPairsReachability(diamondNodes, reduction);
  let reachMatch = true;
  for (const n of diamondNodes) {
    const o = origReach.get(n.id)!;
    const r = redReach.get(n.id)!;
    if (o.size !== r.size || Array.from(o).some((x) => !r.has(x))) {
      reachMatch = false;
      break;
    }
  }
  assert(reachMatch, 'Diamond DAG: All-pairs reachability must be 100% invariant under reduction');
}

// 1.6 Disconnected Forests & Isolated Singletons
{
  const isolatedNodes: MathNode[] = [];
  for (let i = 0; i < 30; i++) {
    isolatedNodes.push(createMockNode(`iso-${i}`));
  }
  const isoReduction = computeTransitiveReduction(isolatedNodes);
  assert(isoReduction.length === 0, `Transitive reduction of 30 isolated nodes must produce 0 edges (got ${isoReduction.length})`);

  const forestNodes: MathNode[] = [
    createMockNode('c1-A', [], ['c1-B', 'c1-C']),
    createMockNode('c1-B', ['c1-A'], ['c1-C']),
    createMockNode('c1-C', ['c1-A', 'c1-B'], []),
    createMockNode('c2-X', [], ['c2-Y', 'c2-Z']),
    createMockNode('c2-Y', ['c2-X'], ['c2-Z']),
    createMockNode('c2-Z', ['c2-X', 'c2-Y'], []),
  ];
  const forestReduction = computeTransitiveReduction(forestNodes);
  assert(forestReduction.length === 4, `Forest of 2 triangles must reduce to exactly 4 edges (got ${forestReduction.length})`);
  assert(!forestReduction.some((e) => e.from === 'c1-C' && e.to === 'c1-A'), 'Component 1 shortcut pruned');
  assert(!forestReduction.some((e) => e.from === 'c2-Z' && e.to === 'c2-X'), 'Component 2 shortcut pruned');
}

// 1.7 Large Long Chain with Skip Connections (N = 100)
{
  const chainLen = 100;
  const longChainNodes: MathNode[] = [];
  for (let i = 0; i < chainLen; i++) {
    const deps = [];
    if (i > 0) deps.push(`chain-${i - 1}`);
    if (i > 1) deps.push(`chain-${i - 2}`);
    if (i > 5) deps.push(`chain-${i - 6}`);
    if (i > 0) deps.push(`chain-0`);
    const uniqueDeps = Array.from(new Set(deps));
    longChainNodes.push(createMockNode(`chain-${i}`, uniqueDeps));
  }

  const longReduction = computeTransitiveReduction(longChainNodes);
  assert(
    longReduction.length === chainLen - 1,
    `Chain of ${chainLen} nodes with multi-hop skips must reduce to exactly ${chainLen - 1} linear edges (got ${longReduction.length})`
  );
}

// 1.8 Subset Filtering Parameter (`subsetIds`)
{
  const subNodes: MathNode[] = [
    createMockNode('sub-A', [], ['sub-B', 'sub-C', 'sub-D']),
    createMockNode('sub-B', ['sub-A'], ['sub-C']),
    createMockNode('sub-C', ['sub-A', 'sub-B'], ['sub-D']),
    createMockNode('sub-D', ['sub-A', 'sub-C'], []),
  ];

  const subsetReduction = computeTransitiveReduction(subNodes, ['sub-A', 'sub-C', 'sub-D']);
  const hasCA = subsetReduction.some((e) => e.from === 'sub-C' && e.to === 'sub-A');
  const hasDA = subsetReduction.some((e) => e.from === 'sub-D' && e.to === 'sub-A');
  const hasDC = subsetReduction.some((e) => e.from === 'sub-D' && e.to === 'sub-C');

  assert(hasCA, 'Induced subgraph without sub-B must preserve sub-C -> sub-A as essential');
  assert(!hasDA, 'Induced subgraph: sub-D -> sub-A is still redundant via sub-D -> sub-C -> sub-A');
  assert(hasDC, 'Induced subgraph: sub-D -> sub-C is essential');

  const emptySub = computeTransitiveReduction(subNodes, []);
  assert(emptySub.length === 0, 'Empty subsetIds must return empty edge list');

  const nonExistentSub = computeTransitiveReduction(subNodes, ['ghost-1', 'ghost-2']);
  assert(nonExistentSub.length === 0, 'Non-existent subsetIds must return empty edge list');
}

// 1.9 Full Seed Data Hasse Diagram Correctness & Shortcut-Free Oracle
{
  const seedHasse = computeTransitiveReduction(initialMathNodes);
  const seedRawEdgeCount = initialMathNodes.reduce((acc, n) => acc + n.dependencies.length, 0);
  assert(
    seedHasse.length <= seedRawEdgeCount,
    `Seed data Hasse reduction (${seedHasse.length} edges) must be <= raw edge count (${seedRawEdgeCount})`
  );

  const origSeedReach = computeAllPairsReachability(initialMathNodes);
  const redSeedReach = computeAllPairsReachability(initialMathNodes, seedHasse);

  let seedReachMatch = true;
  for (const n of initialMathNodes) {
    const o = origSeedReach.get(n.id)!;
    const r = redSeedReach.get(n.id)!;
    if (o.size !== r.size || Array.from(o).some((x) => !r.has(x))) {
      seedReachMatch = false;
      break;
    }
  }
  assert(seedReachMatch, 'Seed Data: Hasse reduction preserves 100% reachability across all 21 propositions');

  const hasseAdj = new Map<string, string[]>();
  initialMathNodes.forEach((n) => hasseAdj.set(n.id, []));
  seedHasse.forEach((e) => hasseAdj.get(e.from)!.push(e.to));

  let noShortcuts = true;
  for (const edge of seedHasse) {
    const directNeighbors = (hasseAdj.get(edge.from) || []).filter((w) => w !== edge.to);
    const visited = new Set<string>();
    const queue = [...directNeighbors];
    let foundAltPath = false;
    while (queue.length > 0) {
      const curr = queue.shift()!;
      if (curr === edge.to) {
        foundAltPath = true;
        break;
      }
      visited.add(curr);
      for (const next of hasseAdj.get(curr) || []) {
        if (!visited.has(next)) {
          visited.add(next);
          queue.push(next);
        }
      }
    }
    if (foundAltPath) {
      noShortcuts = false;
      console.error(`Found redundant edge in Hasse diagram: ${edge.from} -> ${edge.to}`);
      break;
    }
  }
  assert(noShortcuts, 'Seed Data: Hasse diagram is strictly shortcut-free (no alternate length >= 2 paths)');
}

// -----------------------------------------------------------------------------------------
// SECTION 2: Minimum Prerequisite Closure & Critical Bottlenecks
// -----------------------------------------------------------------------------------------
console.log('\n--- SECTION 2: Minimum Prerequisite Closure & Critical Bottlenecks ---');

// 2.1 Target is Root Definition / Axiom (0 dependencies)
{
  const rootClosure = computeMinimumPrerequisiteClosure('def-limit-sequence', [], initialMathNodes);
  assert(rootClosure !== null, 'Root definition closure must not be null');
  assert(rootClosure!.allPrerequisiteIds.length === 0, 'Root definition has 0 upstream prerequisites');
  assert(rootClosure!.readinessPercentage === 100, 'Root definition has 100% readiness even with empty known list');
  assert(rootClosure!.unlearnedPrerequisiteNodes.length === 0, 'Root definition unlearned prerequisites must be empty');
  assert(rootClosure!.learningSequence.length === 1 && rootClosure!.learningSequence[0].id === 'def-limit-sequence', 'Root learning sequence is [target]');
  assert(rootClosure!.totalEstimatedHours > 0, 'Root estimated hours must be positive');

  // Synthetic Axiom Test
  const mockAxiom = createMockNode('syn-axiom', [], [], 'logic', 'AXIOM', 1);
  const syntheticClosure = computeMinimumPrerequisiteClosure('syn-axiom', [], [mockAxiom]);
  assert(syntheticClosure !== null, 'Synthetic axiom closure must compute');
  assert(syntheticClosure!.readinessPercentage === 100, 'Synthetic axiom readiness is 100%');
}

// 2.2 Unknown Target Node ID
{
  const nullClosure = computeMinimumPrerequisiteClosure('non-existent-theorem', [], initialMathNodes);
  assert(nullClosure === null, 'Unknown target ID must return null');
}

// 2.3 Partial & Full Knowledge Variations
{
  const allPrereqs = getTransitivePrerequisites('thm-stokes', initialMathNodes);

  // Empty knowledge
  const zeroKnown = computeMinimumPrerequisiteClosure('thm-stokes', [], initialMathNodes);
  assert(zeroKnown!.readinessPercentage === 0, 'Empty known list must yield 0% readiness');
  assert(zeroKnown!.unlearnedPrerequisiteNodes.length === allPrereqs.length, 'All prerequisites must be unlearned');

  // Exact full knowledge
  const allKnown = computeMinimumPrerequisiteClosure('thm-stokes', allPrereqs, initialMathNodes);
  assert(allKnown!.readinessPercentage === 100, 'All known list must yield 100% readiness');
  assert(allKnown!.unlearnedPrerequisiteNodes.length === 0, 'No unlearned prerequisites when all known');
  assert(allKnown!.learnedPrerequisiteNodes.length === allPrereqs.length, 'Learned prerequisites match total prereqs');
  assert(allKnown!.learningSequence.length === 1 && allKnown!.learningSequence[0].id === 'thm-stokes', 'Learning sequence contains only target theorem');

  // Superset with irrelevant nodes
  const supersetKnown = computeMinimumPrerequisiteClosure(
    'thm-stokes',
    [...allPrereqs.slice(0, 1), 'def-group', 'thm-lagrange', 'ghost-node'],
    initialMathNodes
  );
  assert(supersetKnown!.learnedPrerequisiteNodes.length === 1, 'Superset knowledge correctly filters to only valid prerequisites');
  assert(supersetKnown!.readinessPercentage < 100 && supersetKnown!.readinessPercentage > 0, 'Partial readiness computed correctly');
}

// 2.4 Critical Bottlenecks Calculation
{
  const bottleneckGraph: MathNode[] = [
    createMockNode('s-1', [], ['s-M']),
    createMockNode('s-2', [], ['s-M']),
    createMockNode('s-3', [], ['s-M']),
    createMockNode('s-M', ['s-1', 's-2', 's-3'], ['s-D1', 's-D2', 's-D3']),
    createMockNode('s-D1', ['s-M'], []),
    createMockNode('s-D2', ['s-M'], []),
    createMockNode('s-D3', ['s-M'], []),
  ];

  const allIds = bottleneckGraph.map((n) => n.id);
  const bottlenecks = calculateCriticalBottlenecks(allIds, bottleneckGraph);

  assert(bottlenecks.length === allIds.length, `Bottlenecks calculated for all ${allIds.length} nodes in closure`);
  assert(bottlenecks[0].node.id === 's-M', `Hub node s-M must be ranked as #1 critical bottleneck (got ${bottlenecks[0].node.id})`);
  assert(bottlenecks[0].dependentCount === 3, 'Top bottleneck direct dependent count is 3');
  assert(bottlenecks[0].betweennessScore > bottlenecks[1].betweennessScore, 'Top bottleneck betweenness score strictly exceeds runner-up');
  assert(bottlenecks[0].reason.includes('核心主干枢纽') || bottlenecks[0].reason.includes('关键分叉汇聚点'), 'Rationale correctly describes hub topology');

  const emptyBottlenecks = calculateCriticalBottlenecks([], bottleneckGraph);
  assert(emptyBottlenecks.length === 0, 'Empty closure returns empty bottleneck list');
}

// -----------------------------------------------------------------------------------------
// SECTION 3: Topological Depths & Cosmic Orbital Shells
// -----------------------------------------------------------------------------------------
console.log('\n--- SECTION 3: Topological Depths & Cosmic Orbital Shells ---');

// 3.1 Strict Depth Invariants
{
  const depths = computeTopologicalDepths(initialMathNodes);
  let allDepthsValid = true;

  for (const node of initialMathNodes) {
    const nodeDepth = depths.get(node.id)!;
    for (const depId of node.dependencies) {
      const depDepth = depths.get(depId)!;
      if (nodeDepth <= depDepth) {
        allDepthsValid = false;
        console.error(`Depth invariant violated: ${node.id} (depth ${nodeDepth}) <= dep ${depId} (depth ${depDepth})`);
      }
    }
  }
  assert(allDepthsValid, 'Depth Invariant: Every node depth strictly exceeds all of its prerequisite depths');
}

// 3.2 Orbital Shell Boundaries & Classification
{
  const axiomShell = getOrbitalShell(0, 'AXIOM');
  assert(axiomShell.shellIndex === 0 && axiomShell.minRadius >= 30 && axiomShell.maxRadius <= 75, 'Axiom maps to Galactic Core [30, 75]');

  const defShell = getOrbitalShell(1, 'DEFINITION');
  assert(defShell.shellIndex === 1 && defShell.minRadius >= 85 && defShell.maxRadius <= 155, 'Definition maps to Inner Nebula Ring [85, 155]');

  const lemmaShell = getOrbitalShell(2, 'LEMMA');
  assert(lemmaShell.shellIndex === 2 && lemmaShell.minRadius >= 165 && lemmaShell.maxRadius <= 245, 'Lemma maps to Mid-Band Constellation [165, 245]');

  const thmShell = getOrbitalShell(3, 'THEOREM');
  assert(thmShell.shellIndex === 3 && thmShell.minRadius >= 255 && thmShell.maxRadius <= 360, 'Theorem maps to Outer Spiral Arms [255, 360]');
}

// -----------------------------------------------------------------------------------------
// SECTION 4: 3D Cosmos Layout Physics & Numerical Stability
// -----------------------------------------------------------------------------------------
console.log('\n--- SECTION 4: 3D Cosmos Layout Physics & Numerical Stability ---');

// 4.1 Zero-Distance Singularity & Identical Coordinate Collision Resilience
{
  const identicalNodes: MathNode[] = [
    createMockNode('dup-1', [], [], 'analysis', 'AXIOM'),
    createMockNode('dup-2', [], [], 'analysis', 'AXIOM'),
    createMockNode('dup-3', [], [], 'analysis', 'AXIOM'),
    createMockNode('dup-4', [], [], 'analysis', 'AXIOM'),
  ];

  const layout = compute3DCosmosLayout(identicalNodes);
  assert(layout.size === 4, 'Layout must process co-located nodes without dropping items');

  let hasNaN = false;
  let hasInfinity = false;
  for (const pos of layout.values()) {
    if (isNaN(pos.x) || isNaN(pos.y) || isNaN(pos.z) || isNaN(pos.vx) || isNaN(pos.vy) || isNaN(pos.vz)) {
      hasNaN = true;
    }
    if (!isFinite(pos.x) || !isFinite(pos.y) || !isFinite(pos.z)) {
      hasInfinity = true;
    }
  }
  assert(!hasNaN, 'Co-located identical nodes: No NaN coordinates or velocities');
  assert(!hasInfinity, 'Co-located identical nodes: No Infinity coordinates or velocities');
}

// 4.2 Single Node & Empty Graph
{
  const emptyLayout = compute3DCosmosLayout([]);
  assert(emptyLayout.size === 0, 'Empty graph layout must return empty Map');

  const singleNode = [createMockNode('single-1', [], [], 'algebra', 'DEFINITION')];
  const singleLayout = compute3DCosmosLayout(singleNode);
  assert(singleLayout.size === 1, 'Single node graph layout must return Map with 1 element');
  const pos = singleLayout.get('single-1')!;
  assert(isFinite(pos.x) && isFinite(pos.y) && isFinite(pos.z), 'Single node coordinates are finite');
  assert(pos.nebulaId === 'algebra', 'Single node nebula is correctly resolved');
  assert(pos.starMagnitude >= 4 && pos.starMagnitude <= 12, `Star magnitude within [4, 12] (got ${pos.starMagnitude})`);
}

// 4.3 Large Graph Stress Benchmark (N = 150 nodes)
{
  const largeNodes: MathNode[] = [];
  const disciplines: DisciplineId[] = ['analysis', 'algebra', 'topology', 'number-theory', 'logic', 'geometry'];
  const types: NodeType[] = ['AXIOM', 'DEFINITION', 'LEMMA', 'THEOREM', 'CONJECTURE'];

  for (let i = 0; i < 150; i++) {
    const deps = [];
    if (i > 0) deps.push(`large-${Math.floor(i / 2)}`);
    if (i > 3) deps.push(`large-${i - 3}`);
    const disc = disciplines[i % disciplines.length];
    const ntype = types[i % types.length];
    largeNodes.push(createMockNode(`large-${i}`, deps, [], disc, ntype));
  }

  const startTime = Date.now();
  const largeLayout = compute3DCosmosLayout(largeNodes);
  const elapsed = Date.now() - startTime;

  assert(largeLayout.size === 150, `Large layout contains all 150 nodes`);
  assert(elapsed < 500, `Large layout (150 nodes, 45 physics relaxation iterations) completed in ${elapsed}ms (< 500ms)`);

  let allFinite = true;
  let withinBounds = true;
  for (const pos of largeLayout.values()) {
    if (!isFinite(pos.x) || !isFinite(pos.y) || !isFinite(pos.z)) {
      allFinite = false;
    }
    if (Math.abs(pos.x) > 800 || Math.abs(pos.y) > 800 || Math.abs(pos.z) > 800) {
      withinBounds = false;
    }
  }
  assert(allFinite, 'Large graph: All 150 nodes have finite non-NaN coordinates');
  assert(withinBounds, 'Large graph: All 150 nodes remain confined within cosmic bounding box [-800, 800]^3');
}

// 4.4 Discipline Nebula Mapping Resilience
{
  assert(mapDisciplineToNebula('analysis').id === 'analysis', 'Map analysis -> analysis');
  assert(mapDisciplineToNebula('algebra').id === 'algebra', 'Map algebra -> algebra');
  assert(mapDisciplineToNebula('topology').id === 'topology', 'Map topology -> topology');
  assert(mapDisciplineToNebula('number-theory').id === 'number-theory', 'Map number-theory -> number-theory');
  assert(mapDisciplineToNebula('number_theory').id === 'number-theory', 'Map number_theory alias -> number-theory');
  assert(mapDisciplineToNebula('logic').id === 'logic', 'Map logic -> logic');
  assert(mapDisciplineToNebula('geometry').id === 'applied-math', 'Map geometry -> applied-math');
  assert(mapDisciplineToNebula('linear-algebra').id === 'applied-math', 'Map linear-algebra -> applied-math');
  assert(mapDisciplineToNebula('unknown-discipline').id === 'analysis', 'Map unknown fallback -> analysis');
}

console.log('\n=======================================================');
console.log(`⚔️  STRESS HARNESS RESULTS: ${passed} passed, ${failed} failed`);
console.log('=======================================================');

if (failed > 0) {
  process.exit(1);
}
