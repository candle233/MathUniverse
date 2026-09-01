/**
 * Property-Based Testing (PBT) & Invariant Suite for MathUniverse DAG & Dual-Graph Engine
 * 
 * Invariants Tested:
 * 1. Topological Partial Order Rank Invariance: \forall (u, v) \in E_{prereq}, rank(v) < rank(u)
 * 2. Transitive Reduction Invariance: Reach(G) \equiv Reach(TR(G))
 * 3. Graph Integrity & Diagnostic Soundness: Orthogonality of dangling references vs cycles
 * 4. Dual-Graph Invariant: Semantic graph permits equivalence cycles; prerequisite graph strictly acyclic
 * 5. Cryptographic Formal Provenance Invariance: Tamper detection on statement & proof revisions
 * 6. Derivation Path Combinatorial Explosion Guard: Bounded DFS/BFS path finding
 */

import {
  topologicalSort,
  checkCircularDependency,
  validateGraphIntegrity,
  findDerivationPaths,
  getTransitivePrerequisites,
  computeCanonicalHash,
  verifyFormalProvenance,
  getSemanticNeighbors,
} from '../src/lib/dagEngine.ts';
import { computeTransitiveReduction } from '../src/lib/prerequisiteClosure.ts';
import type { MathNode, MathEdge } from '../src/types/math.ts';

export function runPropertyBasedDAGTests(): { passed: number; failed: number } {
  console.log('\n===============================================================');
  console.log('🔬 PROPERTY-BASED TESTING SUITE: GRAPH THEORY & FORMAL PROVENANCE');
  console.log('===============================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, message: string) {
    if (!condition) {
      console.error(`  ❌ [FAIL] ${message}`);
      failed++;
      throw new Error(`PBT DAG Assertion Failed: ${message}`);
    } else {
      console.log(`  ✅ [PASS] ${message}`);
      passed++;
    }
  }

  // --- Helper: Random DAG Generator ---
  function generateRandomDAG(nodeCount: number, edgeProbability: number): MathNode[] {
    const nodes: MathNode[] = [];
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        id: `node-${i}`,
        slug: `slug-node-${i}`,
        titleZh: `节点 ${i}`,
        titleEn: `Node ${i}`,
        nodeType: i === 0 ? 'AXIOM' : i < 3 ? 'DEFINITION' : 'THEOREM',
        disciplineId: 'analysis',
        mscCode: '26A03',
        statementLatex: `x_${i} \\ge 0`,
        statementPlainZh: `节点 ${i} 陈述`,
        intuitionMd: `直觉 ${i}`,
        verification: 'FORMALLY_VERIFIED',
        reputationScore: 100 + i,
        viewCount: 50 + i * 10,
        difficultyLevel: (((i % 5) + 1) as any),
        dependencies: [],
        dependents: [],
        proofs: [],
        tags: ['test'],
        lastModified: '2026-09-01'
      });
    }

    // In a DAG, edges only go from higher index to lower index (i > j: node i depends on node j)
    for (let i = 1; i < nodeCount; i++) {
      for (let j = 0; j < i; j++) {
        if (Math.random() < edgeProbability) {
          nodes[i].dependencies.push(nodes[j].id);
          nodes[j].dependents.push(nodes[i].id);
        }
      }
    }

    return nodes;
  }

  // --- Helper: All-Pairs Reachability Matrix ---
  function computeAllPairsReachability(nodes: MathNode[], customEdges?: Array<{ from: string; to: string }>): Map<string, Set<string>> {
    const reach = new Map<string, Set<string>>();
    nodes.forEach(n => reach.set(n.id, new Set()));

    if (customEdges) {
      const adj = new Map<string, string[]>();
      nodes.forEach(n => adj.set(n.id, []));
      customEdges.forEach(e => {
        adj.get(e.from)?.push(e.to);
      });

      for (const startNode of nodes) {
        const visited = new Set<string>();
        const queue = [startNode.id];
        while (queue.length > 0) {
          const curr = queue.shift()!;
          const neighbors = adj.get(curr) || [];
          for (const nxt of neighbors) {
            if (!visited.has(nxt)) {
              visited.add(nxt);
              queue.push(nxt);
            }
          }
        }
        reach.set(startNode.id, visited);
      }
    } else {
      const nodeMap = new Map(nodes.map(n => [n.id, n]));
      for (const startNode of nodes) {
        const visited = new Set<string>();
        const queue = [...startNode.dependencies];
        while (queue.length > 0) {
          const curr = queue.shift()!;
          if (!visited.has(curr)) {
            visited.add(curr);
            const nObj = nodeMap.get(curr);
            if (nObj) {
              queue.push(...nObj.dependencies);
            }
          }
        }
        reach.set(startNode.id, visited);
      }
    }

    return reach;
  }

  // =========================================================================
  // Property 1: Topological Sort Partial Order Rank Invariance
  // =========================================================================
  console.log('--- Property 1: Topological Sort Partial Order Rank Invariance ---');
  for (let trial = 1; trial <= 25; trial++) {
    const nodeCount = 10 + (trial * 3);
    const density = 0.15 + (trial % 5) * 0.05;
    const dag = generateRandomDAG(nodeCount, density);
    
    const { sorted, isDAG } = topologicalSort(dag);
    assert(isDAG, `Random DAG Trial #${trial} (N=${nodeCount}, density=${density.toFixed(2)}) must be recognized as valid DAG`);
    assert(sorted.length === nodeCount, `Topological sort must order all ${nodeCount} nodes`);

    const rankMap = new Map<string, number>();
    sorted.forEach((node, idx) => rankMap.set(node.id, idx));

    // Verify: for every dependency (u depends on v), rank(v) < rank(u)
    let rankInvariantHolds = true;
    for (const node of dag) {
      const uRank = rankMap.get(node.id)!;
      for (const prereqId of node.dependencies) {
        const vRank = rankMap.get(prereqId)!;
        if (vRank >= uRank) {
          rankInvariantHolds = false;
          console.error(`Rank violation: prerequisite ${prereqId} (rank ${vRank}) >= dependent ${node.id} (rank ${uRank})`);
        }
      }
    }
    assert(rankInvariantHolds, `Trial #${trial}: Topological order strictly preserves partial ordering rank(prerequisite) < rank(dependent)`);
  }

  // =========================================================================
  // Property 2: Transitive Reduction Reachability Invariance
  // =========================================================================
  console.log('\n--- Property 2: Transitive Reduction Reachability Invariance ---');
  for (let trial = 1; trial <= 15; trial++) {
    const nodeCount = 12 + trial * 2;
    const dag = generateRandomDAG(nodeCount, 0.35); // Dense DAG with redundant edges

    const originalEdgesCount = dag.reduce((acc, n) => acc + n.dependencies.length, 0);
    const hasseEdges = computeTransitiveReduction(dag);

    assert(hasseEdges.length <= originalEdgesCount, `Trial #${trial}: Transitive reduction edges (${hasseEdges.length}) <= original raw edges (${originalEdgesCount})`);

    // Verify Reach(G) === Reach(TR(G))
    const origReach = computeAllPairsReachability(dag);
    const redReach = computeAllPairsReachability(dag, hasseEdges);

    let reachabilityEquivalence = true;
    for (const node of dag) {
      const origSet = origReach.get(node.id)!;
      const redSet = redReach.get(node.id)!;
      if (origSet.size !== redSet.size) {
        reachabilityEquivalence = false;
        break;
      }
      for (const target of origSet) {
        if (!redSet.has(target)) {
          reachabilityEquivalence = false;
          break;
        }
      }
    }
    assert(reachabilityEquivalence, `Trial #${trial}: Transitive reduction strictly preserves all-pairs reachability Reach(G) = Reach(TR(G)) across N=${nodeCount}`);
  }

  // =========================================================================
  // Property 3: Graph Integrity Diagnostics Soundness
  // =========================================================================
  console.log('\n--- Property 3: Graph Integrity Diagnostics Soundness ---');
  {
    // 3a. Dangling Reference Detection
    const validDag = generateRandomDAG(8, 0.2);
    validDag[3].dependencies.push('phantom-ghost-node-999'); // Add dangling ref
    const reportDangling = validateGraphIntegrity(validDag);
    assert(!reportDangling.isValidDAG, 'Graph with dangling node must fail isValidDAG');
    assert(reportDangling.danglingReferences.length >= 1, 'Graph validator must pinpoint dangling node reference');
    assert(reportDangling.cycles.length === 0, 'Dangling reference must NOT be misclassified as a cycle');

    // 3b. Real Cycle Detection
    const cyclicGraph = generateRandomDAG(6, 0);
    cyclicGraph[0].dependencies = ['node-1'];
    cyclicGraph[1].dependencies = ['node-2'];
    cyclicGraph[2].dependencies = ['node-0']; // Cycle: 0 -> 1 -> 2 -> 0
    const reportCycle = validateGraphIntegrity(cyclicGraph);
    assert(!reportCycle.isValidDAG, 'Cyclic graph must fail isValidDAG');
    assert(reportCycle.cycles.length >= 1, 'Graph validator must detect real cycle path');

    // 3c. Self-Loop Detection
    const loopGraph = generateRandomDAG(4, 0);
    loopGraph[1].dependencies = ['node-1'];
    const reportLoop = validateGraphIntegrity(loopGraph);
    assert(reportLoop.selfLoops.includes('node-1'), 'Self-loop (node-1 -> node-1) must be flagged');
  }

  // =========================================================================
  // Property 4: Dual-Graph Invariant (Semantic Cycles vs Prerequisite DAG)
  // =========================================================================
  console.log('\n--- Property 4: Dual-Graph Invariant ---');
  {
    const dualNodes: MathNode[] = [
      {
        id: 'prop-A',
        slug: 'prop-a',
        titleZh: '命题 A',
        titleEn: 'Proposition A',
        nodeType: 'THEOREM',
        disciplineId: 'analysis',
        mscCode: '26A03',
        statementLatex: 'A(x)',
        statementPlainZh: '陈述 A',
        intuitionMd: '直觉 A',
        verification: 'FORMALLY_VERIFIED',
        reputationScore: 100,
        viewCount: 100,
        difficultyLevel: 1,
        dependencies: [],
        dependents: ['prop-C'],
        proofs: [],
        prerequisiteEdges: [],
        semanticEdges: [
          {
            id: 'se-ab',
            fromNodeId: 'prop-A',
            toNodeId: 'prop-B',
            relationType: 'EQUIVALENT_TO',
            graphType: 'SEMANTIC_GRAPH',
            description: 'A is equivalent to B'
          }
        ],
        tags: ['dual'],
        lastModified: '2026-09-01'
      },
      {
        id: 'prop-B',
        slug: 'prop-b',
        titleZh: '命题 B',
        titleEn: 'Proposition B',
        nodeType: 'THEOREM',
        disciplineId: 'analysis',
        mscCode: '26A03',
        statementLatex: 'B(x)',
        statementPlainZh: '陈述 B',
        intuitionMd: '直觉 B',
        verification: 'FORMALLY_VERIFIED',
        reputationScore: 100,
        viewCount: 100,
        difficultyLevel: 1,
        dependencies: [],
        dependents: [],
        proofs: [],
        prerequisiteEdges: [],
        semanticEdges: [
          {
            id: 'se-ba',
            fromNodeId: 'prop-B',
            toNodeId: 'prop-A',
            relationType: 'EQUIVALENT_TO',
            graphType: 'SEMANTIC_GRAPH',
            description: 'B is equivalent to A'
          }
        ],
        tags: ['dual'],
        lastModified: '2026-09-01'
      },
      {
        id: 'prop-C',
        slug: 'prop-c',
        titleZh: '命题 C',
        titleEn: 'Proposition C',
        nodeType: 'THEOREM',
        disciplineId: 'analysis',
        mscCode: '26A03',
        statementLatex: 'C(x)',
        statementPlainZh: '陈述 C',
        intuitionMd: '直觉 C',
        verification: 'FORMALLY_VERIFIED',
        reputationScore: 100,
        viewCount: 100,
        difficultyLevel: 2,
        dependencies: ['prop-A'],
        dependents: [],
        proofs: [],
        prerequisiteEdges: [
          {
            id: 'pe-ca',
            fromNodeId: 'prop-C',
            toNodeId: 'prop-A',
            relationType: 'LOGICALLY_USES',
            graphType: 'PREREQUISITE_DAG'
          }
        ],
        semanticEdges: [],
        tags: ['dual'],
        lastModified: '2026-09-01'
      }
    ];

    const dualReport = validateGraphIntegrity(dualNodes);
    assert(dualReport.isValidDAG, 'Prerequisite graph G_prerequisite is a valid DAG (A -> C)');
    assert(dualReport.isSemanticallyValid, 'Semantic graph G_semantic is valid with mutual equivalence A <=> B');

    const neighborsA = getSemanticNeighbors('prop-A', dualNodes);
    assert(neighborsA.some(n => n.node.id === 'prop-B' && n.relation === 'EQUIVALENT_TO'), 'getSemanticNeighbors for A resolves mutual equivalence to B');
  }

  // =========================================================================
  // Property 5: Cryptographic Formal Provenance Invariance
  // =========================================================================
  console.log('\n--- Property 5: Cryptographic Formal Provenance Invariance ---');
  {
    const validFormalNode: MathNode = {
      id: 'thm-mock-formal',
      slug: 'thm-mock-formal',
      titleZh: '形式化验证命题',
      titleEn: 'Formal Verified Theorem',
      nodeType: 'THEOREM',
      disciplineId: 'analysis',
      mscCode: '26A03',
      statementLatex: '\\forall x \\in \\mathbb{R}, x^2 \\ge 0',
      statementPlainZh: '实数平方非负',
      intuitionMd: '几何直觉',
      verification: 'FORMALLY_VERIFIED',
      reputationScore: 100,
      viewCount: 100,
      difficultyLevel: 1,
      dependencies: [],
      dependents: [],
      proofs: [],
      leanFormalization: {
        id: 'lean-mock',
        nodeId: 'thm-mock-formal',
        theoremName: 'sq_nonneg',
        leanCode: 'theorem sq_nonneg (x : ℝ) : 0 ≤ x^2 := by exact sq_nonneg x',
        mathlibImports: ['Mathlib.Data.Real.Basic'],
        isVerified: true,
        axiomsUsed: ['propext'],
        astHash: computeCanonicalHash('theorem sq_nonneg (x : ℝ) : 0 ≤ x^2 := by exact sq_nonneg x'),
        verificationRecord: {
          statementRevision: 'rev-1',
          statementHash: computeCanonicalHash('\\forall x \\in \\mathbb{R}, x^2 \\ge 0'),
          proofHash: computeCanonicalHash('theorem sq_nonneg (x : ℝ) : 0 ≤ x^2 := by exact sq_nonneg x'),
          leanVersion: 'Lean (version 4.14.0)',
          mathlibCommit: 'v4.14.0',
          imports: ['Mathlib.Data.Real.Basic'],
          axiomsUsed: ['propext'],
          result: 'PASSED',
          checkedAt: '2026-09-01T00:00:00Z',
          checker: 'LEAN_KERNEL',
        }
      },
      tags: ['formal'],
      lastModified: '2026-09-01'
    };

    // Authentic verification
    const authCheck = verifyFormalProvenance(validFormalNode);
    assert(authCheck.isAuthentic, 'Unaltered theorem statement and proof must pass formal provenance verification');

    // Tampered statement
    const tamperedStatementNode: MathNode = {
      ...validFormalNode,
      statementLatex: '\\forall x \\in \\mathbb{R}, x^2 > 0', // Changed >= 0 to > 0
    };
    const tamperedStmtCheck = verifyFormalProvenance(tamperedStatementNode);
    assert(!tamperedStmtCheck.isAuthentic && !tamperedStmtCheck.statementHashMatched, 'Tampering with LaTeX theorem statement must immediately invalidate verification');

    // Tampered proof
    const tamperedProofNode: MathNode = {
      ...validFormalNode,
      leanFormalization: {
        ...validFormalNode.leanFormalization!,
        leanCode: 'theorem sq_nonneg (x : ℝ) : 0 ≤ x^2 := by sorry',
      }
    };
    const tamperedProofCheck = verifyFormalProvenance(tamperedProofNode);
    assert(!tamperedProofCheck.isAuthentic && !tamperedProofCheck.proofHashMatched, 'Tampering with Lean 4 proof source code must immediately invalidate verification');
  }

  // =========================================================================
  // Property 6: Derivation Path Combinatorial Explosion Guard
  // =========================================================================
  console.log('\n--- Property 6: Derivation Path Combinatorial Explosion Guard ---');
  {
    // Build an exponentially branching DAG where number of paths is 2^(N-2)
    const N = 18;
    const denseDAG: MathNode[] = [];
    for (let i = 0; i < N; i++) {
      denseDAG.push({
        id: `dense-${i}`,
        slug: `dense-${i}`,
        titleZh: `密集节点 ${i}`,
        titleEn: `Dense Node ${i}`,
        nodeType: 'THEOREM',
        disciplineId: 'analysis',
        mscCode: '26A03',
        statementLatex: `d_${i}`,
        statementPlainZh: `密集 ${i}`,
        intuitionMd: '',
        verification: 'SYNTAX_CHECKED',
        reputationScore: 10,
        viewCount: 10,
        difficultyLevel: 1,
        dependencies: [],
        dependents: [],
        proofs: [],
        tags: [],
        lastModified: '2026-09-01'
      });
    }

    // Connect all i > j
    for (let i = 1; i < N; i++) {
      for (let j = 0; j < i; j++) {
        denseDAG[i].dependencies.push(denseDAG[j].id);
        denseDAG[j].dependents.push(denseDAG[i].id);
      }
    }

    const tStart = Date.now();
    const boundedPaths = findDerivationPaths(denseDAG, 'dense-0', `dense-${N - 1}`, {
      maxPaths: 20,
      maxDepth: 10,
      shortestFirst: true
    });
    const durationMs = Date.now() - tStart;

    assert(boundedPaths.length <= 20, `Bounded path search must return <= 20 paths (got ${boundedPaths.length})`);
    assert(durationMs < 100, `Exponential graph path exploration must complete within < 100ms with guards (took ${durationMs}ms)`);
  }

  console.log('\n===============================================================');
  console.log(`📊 Property-Based DAG Test Results: ${passed} passed, ${failed} failed`);
  console.log('===============================================================');

  return { passed, failed };
}

if (process.argv[1]?.includes('propertyBasedDAG.test.ts')) {
  const result = runPropertyBasedDAGTests();
  if (result.failed > 0) process.exit(1);
}
