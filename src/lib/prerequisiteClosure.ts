import type { MathNode } from '../types/math.ts';
import { getTransitivePrerequisites, topologicalSort } from './dagEngine.ts';

export interface BottleneckInfo {
  node: MathNode;
  dependentCount: number;
  betweennessScore: number; // Retained for backward compatibility
  dependencyImportanceScore: number; // Mathematically descriptive name for DAG dependency centrality
  reason: string;
}

export interface CosmicNebulaMeta {
  id: string;
  nameZh: string;
  nameEn: string;
  color: string;
  glowColor: string;
  centroid: [number, number, number];
}

export interface CosmicNode3D {
  node: MathNode;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  depth: number;
  shellIndex: number;
  nebulaId: string;
  nebulaName: string;
  nebulaColor: string;
  starMagnitude: number;
  isBottleneck: boolean;
}

export interface PrerequisiteClosureResult {
  targetNode: MathNode;
  allPrerequisiteIds: string[];
  unlearnedPrerequisiteNodes: MathNode[];
  learnedPrerequisiteNodes: MathNode[];
  readinessPercentage: number;
  weightedReadinessPercentage: number;
  totalEstimatedHours: number;
  criticalBottlenecks: BottleneckInfo[];
  disciplineBreakdown: Record<string, number>;
  learningSequence: MathNode[];
  hasseEdges: Array<{ from: string; to: string }>;
}

export interface OrbitalShellMeta {
  shellIndex: number;
  shellName: string;
  minRadius: number;
  maxRadius: number;
  tierLabel: string;
  color: string;
}

/**
 * Predefined 6 Cosmic Discipline Nebulae with celestial 3D centroids
 */
export const COSMIC_NEBULAE: Record<string, CosmicNebulaMeta> = {
  analysis: {
    id: 'analysis',
    nameZh: '实分析与微积分星云 (Cyan Nebula)',
    nameEn: 'Analysis & Calculus Nebula',
    color: '#06b6d4', // Cyan
    glowColor: 'rgba(6, 182, 212, 0.45)',
    centroid: [-180, 70, -60],
  },
  algebra: {
    id: 'algebra',
    nameZh: '近世代数与群论星云 (Amber Nebula)',
    nameEn: 'Abstract Algebra Nebula',
    color: '#f59e0b', // Amber
    glowColor: 'rgba(245, 158, 11, 0.45)',
    centroid: [160, 90, 80],
  },
  topology: {
    id: 'topology',
    nameZh: '拓扑学与流形星云 (Emerald Nebula)',
    nameEn: 'Topology & Manifolds Nebula',
    color: '#10b981', // Emerald
    glowColor: 'rgba(16, 185, 129, 0.45)',
    centroid: [0, -150, 110],
  },
  'number-theory': {
    id: 'number-theory',
    nameZh: '数论与算术几何星云 (Purple Nebula)',
    nameEn: 'Number Theory Nebula',
    color: '#a855f7', // Purple
    glowColor: 'rgba(168, 85, 247, 0.45)',
    centroid: [-140, -100, -110],
  },
  logic: {
    id: 'logic',
    nameZh: '数理逻辑与公理星云 (Rose Nebula)',
    nameEn: 'Mathematical Logic Nebula',
    color: '#ec4899', // Rose
    glowColor: 'rgba(236, 72, 153, 0.45)',
    centroid: [0, 160, -80],
  },
  'applied-math': {
    id: 'applied-math',
    nameZh: '几何与应用数学星云 (Indigo Nebula)',
    nameEn: 'Applied Math & Geometry Nebula',
    color: '#6366f1', // Indigo
    glowColor: 'rgba(99, 102, 241, 0.45)',
    centroid: [150, -80, -90],
  },
};

/**
 * Resolves discipline ID into one of the 6 canonical nebulae
 */
export function mapDisciplineToNebula(disciplineId: string): CosmicNebulaMeta {
  if (COSMIC_NEBULAE[disciplineId]) {
    return COSMIC_NEBULAE[disciplineId];
  }
  if (disciplineId === 'number_theory') return COSMIC_NEBULAE['number-theory'];
  if (disciplineId === 'linear-algebra' || disciplineId === 'linear_algebra' || disciplineId === 'geometry') {
    return COSMIC_NEBULAE['applied-math'];
  }
  return COSMIC_NEBULAE['analysis'];
}

/**
 * Computes topological depth for all nodes from axiom roots (depth = longest distance from root)
 */
export function computeTopologicalDepths(nodes: MathNode[]): Map<string, number> {
  const nodeMap = new Map<string, MathNode>(nodes.map((n) => [n.id, n]));
  const memo = new Map<string, number>();

  function getDepth(id: string, visitedPath: Set<string>): number {
    if (memo.has(id)) return memo.get(id)!;
    if (visitedPath.has(id)) return 0; // Guard against potential cycles

    const node = nodeMap.get(id);
    if (!node || node.dependencies.length === 0) {
      memo.set(id, 0);
      return 0;
    }

    const nextPath = new Set(visitedPath);
    nextPath.add(id);

    let maxDepDepth = 0;
    for (const depId of node.dependencies) {
      const d = getDepth(depId, nextPath);
      if (d + 1 > maxDepDepth) {
        maxDepDepth = d + 1;
      }
    }

    memo.set(id, maxDepDepth);
    return maxDepDepth;
  }

  for (const n of nodes) {
    getDepth(n.id, new Set());
  }

  return memo;
}

/**
 * Returns orbital shell metadata according to topological depth and node type
 */
export function getOrbitalShell(depth: number, nodeType: string): OrbitalShellMeta {
  if (nodeType === 'AXIOM') {
    return {
      shellIndex: 0,
      shellName: '银河母核层 (Galactic Core)',
      minRadius: 30,
      maxRadius: 75,
      tierLabel: '公理基底与核心原点',
      color: '#f59e0b',
    };
  }
  if (nodeType === 'DEFINITION' || depth <= 1) {
    return {
      shellIndex: 1,
      shellName: '内层星环带 (Inner Nebula Ring)',
      minRadius: 85,
      maxRadius: 155,
      tierLabel: '基础概念与定义',
      color: '#10b981',
    };
  }
  if (nodeType === 'LEMMA' || (depth === 2 && nodeType !== 'THEOREM' && nodeType !== 'CONJECTURE')) {
    return {
      shellIndex: 2,
      shellName: '中层星座群 (Mid-Band Constellation)',
      minRadius: 165,
      maxRadius: 245,
      tierLabel: '过渡引理与推论',
      color: '#8b5cf6',
    };
  }
  return {
    shellIndex: 3,
    shellName: '外旋臂巅峰 (Outer Spiral Arms)',
    minRadius: 255,
    maxRadius: 360,
    tierLabel: '高阶定理与猜想',
    color: '#06b6d4',
  };
}

/**
 * Computes Transitive Reduction (Hasse Diagram) eliminating redundant shortcut edges
 */
export function computeTransitiveReduction(
  nodes: MathNode[],
  subsetIds?: string[]
): Array<{ from: string; to: string }> {
  const nodeMap = new Map<string, MathNode>(nodes.map((n) => [n.id, n]));
  const allowedSet = subsetIds ? new Set(subsetIds) : null;

  // Build reachability map: u -> Set of reachable descendants via dependencies
  const reachability = new Map<string, Set<string>>();

  function getReachable(nodeId: string): Set<string> {
    if (reachability.has(nodeId)) return reachability.get(nodeId)!;
    const reachable = new Set<string>();
    const node = nodeMap.get(nodeId);
    if (!node) return reachable;

    for (const depId of node.dependencies) {
      if (!allowedSet || allowedSet.has(depId)) {
        reachable.add(depId);
        const sub = getReachable(depId);
        for (const s of sub) {
          reachable.add(s);
        }
      }
    }
    reachability.set(nodeId, reachable);
    return reachable;
  }

  // Populate reachability for all nodes
  for (const n of nodes) {
    if (!allowedSet || allowedSet.has(n.id)) {
      getReachable(n.id);
    }
  }

  const essentialEdges: Array<{ from: string; to: string }> = [];

  for (const n of nodes) {
    if (allowedSet && !allowedSet.has(n.id)) continue;

    const directDeps = n.dependencies.filter((d) => !allowedSet || allowedSet.has(d));

    for (const depId of directDeps) {
      // Check if depId can be reached from any other direct dependency of n
      let isRedundant = false;
      for (const otherDep of directDeps) {
        if (otherDep === depId) continue;
        const otherReachable = reachability.get(otherDep);
        if (otherReachable && otherReachable.has(depId)) {
          isRedundant = true;
          break;
        }
      }

      if (!isRedundant) {
        essentialEdges.push({ from: n.id, to: depId });
      }
    }
  }

  return essentialEdges;
}

/**
 * Calculates critical bottleneck theorems in a prerequisite subgraph using DAG dependency importance centrality.
 * Note: This score is a heuristic metric based on direct fanout and downstream subgraph reachability.
 */
export function calculateCriticalBottlenecks(
  closureNodeIds: string[],
  allNodes: MathNode[]
): BottleneckInfo[] {
  const nodeMap = new Map<string, MathNode>(allNodes.map((n) => [n.id, n]));
  const closureSet = new Set(closureNodeIds);

  const reachableMap = new Map<string, Set<string>>();
  closureNodeIds.forEach((id) => {
    const reachable = new Set<string>();
    const queue = [id];
    const visited = new Set<string>([id]);
    let head = 0;
    while (head < queue.length) {
      const curr = queue[head++];
      const n = nodeMap.get(curr);
      if (n) {
        for (const depId of n.dependents) {
          if (closureSet.has(depId) && !visited.has(depId)) {
            visited.add(depId);
            reachable.add(depId);
            queue.push(depId);
          }
        }
      }
    }
    reachableMap.set(id, reachable);
  });

  const scores: BottleneckInfo[] = closureNodeIds.map((id) => {
    const node = nodeMap.get(id)!;
    const directClosureDependents = node.dependents.filter((depId) => closureSet.has(depId));
    const allDownstreamInClosure = reachableMap.get(id)?.size || 0;

    // Dependency Importance Score: weighted combination of direct dependent fanout and downstream dependency load
    const dependencyImportanceScore = directClosureDependents.length * 10 + allDownstreamInClosure * 5;

    let reason = '基础前置定义';
    if (allDownstreamInClosure >= 4) {
      reason = `核心主干枢纽 (覆盖闭包内 ${allDownstreamInClosure} 项后续定理推导)`;
    } else if (directClosureDependents.length >= 2) {
      reason = `关键分叉汇聚点 (支撑 ${directClosureDependents.length} 个直接推论)`;
    } else if (node.nodeType === 'AXIOM') {
      reason = '公理基石 (不可或缺的底层逻辑源头)';
    }

    return {
      node,
      dependentCount: directClosureDependents.length,
      betweennessScore: dependencyImportanceScore,
      dependencyImportanceScore,
      reason,
    };
  });

  scores.sort((a, b) => b.dependencyImportanceScore - a.dependencyImportanceScore || b.dependentCount - a.dependentCount);
  return scores;
}

/**
 * Computes the minimal learning closure to reach a target theorem from a set of known theorems.
 * 
 * Readiness Metrics:
 * - Unweighted: R = (|P_learned| / |P_all|) * 100%
 * - Weighted:   R_w = (sum_{i in P} w_i * m_i / sum_{i in P} w_i) * 100%, where w_i = difficultyLevel
 * 
 * Note: Learning hours mapping is a pedagogical heuristic estimate (d=1,2,3,4,5 -> 2,4,6,9,14h).
 */
export function computeMinimumPrerequisiteClosure(
  targetId: string,
  knownNodeIds: string[],
  allNodes: MathNode[],
  userMastery?: Record<string, number>
): PrerequisiteClosureResult | null {
  const nodeMap = new Map<string, MathNode>(allNodes.map((n) => [n.id, n]));
  const targetNode = nodeMap.get(targetId);
  if (!targetNode) return null;

  const allPrereqIds = getTransitivePrerequisites(targetId, allNodes);
  const knownSet = new Set(knownNodeIds);

  const unlearnedIds = allPrereqIds.filter((id) => !knownSet.has(id));
  const learnedIds = allPrereqIds.filter((id) => knownSet.has(id));

  const sortedAllIds = topologicalSort(allNodes).sorted.map((n) => n.id);
  const orderedUnlearnedNodes = sortedAllIds
    .filter((id) => unlearnedIds.includes(id))
    .map((id) => nodeMap.get(id))
    .filter((n): n is MathNode => n !== undefined);

  const orderedLearnedNodes = sortedAllIds
    .filter((id) => learnedIds.includes(id))
    .map((id) => nodeMap.get(id))
    .filter((n): n is MathNode => n !== undefined);

  const learningSequence = [...orderedUnlearnedNodes, targetNode];

  // Calculate unweighted readiness percentage
  const totalCount = allPrereqIds.length;
  const readinessPercentage = totalCount === 0 ? 100 : Math.round((learnedIds.length / totalCount) * 100);

  // Calculate weighted readiness percentage: R_w = (sum w_i * m_i) / (sum w_i)
  let totalWeight = 0;
  let accumulatedMasteryWeight = 0;
  for (const prereqId of allPrereqIds) {
    const pNode = nodeMap.get(prereqId);
    const weight = pNode ? pNode.difficultyLevel : 1;
    totalWeight += weight;
    const mastery = userMastery && userMastery[prereqId] !== undefined
      ? Math.min(1, Math.max(0, userMastery[prereqId]))
      : (knownSet.has(prereqId) ? 1 : 0);
    accumulatedMasteryWeight += weight * mastery;
  }
  const weightedReadinessPercentage = totalWeight === 0
    ? 100
    : Math.round((accumulatedMasteryWeight / totalWeight) * 100);

  // Heuristic estimate of learning hours (difficulty 1 -> 2h, 2 -> 4h, 3 -> 6h, 4 -> 9h, 5 -> 14h)
  const difficultyHoursMap: Record<number, number> = { 1: 2, 2: 4, 3: 6, 4: 9, 5: 14 };
  const totalEstimatedHours = orderedUnlearnedNodes.reduce(
    (acc, n) => acc + (difficultyHoursMap[n.difficultyLevel] || 4),
    difficultyHoursMap[targetNode.difficultyLevel] || 4
  );

  // Find critical bottlenecks
  const closureIds = [...allPrereqIds, targetId];
  const allBottlenecks = calculateCriticalBottlenecks(allPrereqIds, allNodes);
  const criticalBottlenecks = allBottlenecks.slice(0, 4);

  // Discipline breakdown
  const disciplineBreakdown: Record<string, number> = {};
  [...orderedUnlearnedNodes, targetNode].forEach((n) => {
    disciplineBreakdown[n.disciplineId] = (disciplineBreakdown[n.disciplineId] || 0) + 1;
  });

  // Hasse transitive reduction of closure
  const hasseEdges = computeTransitiveReduction(allNodes, closureIds);

  return {
    targetNode,
    allPrerequisiteIds: allPrereqIds,
    unlearnedPrerequisiteNodes: orderedUnlearnedNodes,
    learnedPrerequisiteNodes: orderedLearnedNodes,
    readinessPercentage,
    weightedReadinessPercentage,
    totalEstimatedHours,
    criticalBottlenecks,
    disciplineBreakdown,
    learningSequence,
    hasseEdges,
  };
}

/**
 * Generates 3D cosmological coordinates for all mathematical nodes using force physics
 * with Coulomb repulsion, Hooke spring edges, discipline centroid attraction, and radial shell stratification.
 */
export function compute3DCosmosLayout(nodes: MathNode[]): Map<string, CosmicNode3D> {
  const depths = computeTopologicalDepths(nodes);
  const nodeMap = new Map<string, MathNode>(nodes.map((n) => [n.id, n]));

  const positions = new Map<string, CosmicNode3D>();

  // 1. Initial Seeding based on discipline centroid & topological depth
  nodes.forEach((node, index) => {
    const nebula = mapDisciplineToNebula(node.disciplineId);
    const depth = depths.get(node.id) || 0;
    const shell = getOrbitalShell(depth, node.nodeType);

    // Position angle based on index and depth
    const goldenAngle = 2.39996323;
    const theta = (index * goldenAngle) % (2 * Math.PI);
    const phi = (((index % 7) - 3) * 0.35);

    // Target radius in shell
    const targetRadius = shell.minRadius + ((index % 5) / 5) * (shell.maxRadius - shell.minRadius);

    const x = nebula.centroid[0] * 0.55 + Math.cos(theta) * Math.cos(phi) * targetRadius * 0.75;
    const y = nebula.centroid[1] * 0.55 + Math.sin(phi) * targetRadius * 0.75;
    const z = nebula.centroid[2] * 0.55 + Math.sin(theta) * Math.cos(phi) * targetRadius * 0.75;

    const starMagnitude = Math.min(12, Math.max(4, 5 + node.dependents.length * 1.2 + (node.nodeType === 'AXIOM' ? 4 : 0)));

    positions.set(node.id, {
      node,
      x,
      y,
      z,
      vx: 0,
      vy: 0,
      vz: 0,
      depth,
      shellIndex: shell.shellIndex,
      nebulaId: nebula.id,
      nebulaName: nebula.nameZh,
      nebulaColor: nebula.color,
      starMagnitude,
      isBottleneck: node.dependents.length >= 3,
    });
  });

  // 2. Physics Relaxation Loop (Coulomb repulsion + Hooke spring + Centroid attraction + Shell damping)
  const nodeArray = Array.from(positions.values());
  const iterations = 45;
  const kRepulse = 1800;
  const kSpring = 0.045;
  const springLength = 65;
  const kCentroid = 0.035;
  const damping = 0.82;

  for (let iter = 0; iter < iterations; iter++) {
    // 2a. Coulomb Repulsion between all node pairs
    for (let i = 0; i < nodeArray.length; i++) {
      const p1 = nodeArray[i];
      for (let j = i + 1; j < nodeArray.length; j++) {
        const p2 = nodeArray[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dz = p1.z - p2.z;
        const distSq = dx * dx + dy * dy + dz * dz + 10;
        const dist = Math.sqrt(distSq);

        const f = kRepulse / distSq;
        const fx = (dx / dist) * f;
        const fy = (dy / dist) * f;
        const fz = (dz / dist) * f;

        p1.vx += fx;
        p1.vy += fy;
        p1.vz += fz;

        p2.vx -= fx;
        p2.vy -= fy;
        p2.vz -= fz;
      }
    }

    // 2b. Hooke Spring Attraction along Prerequisite Edges
    for (const p1 of nodeArray) {
      for (const depId of p1.node.dependencies) {
        const p2 = positions.get(depId);
        if (!p2) continue;

        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const dz = p2.z - p1.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) + 0.001;

        const delta = dist - springLength;
        const f = kSpring * delta;
        const fx = (dx / dist) * f;
        const fy = (dy / dist) * f;
        const fz = (dz / dist) * f;

        p1.vx += fx;
        p1.vy += fy;
        p1.vz += fz;

        p2.vx -= fx;
        p2.vy -= fy;
        p2.vz -= fz;
      }
    }

    // 2c. Discipline Centroid Attraction
    for (const p of nodeArray) {
      const nebula = mapDisciplineToNebula(p.node.disciplineId);
      const dx = nebula.centroid[0] - p.x;
      const dy = nebula.centroid[1] - p.y;
      const dz = nebula.centroid[2] - p.z;

      p.vx += dx * kCentroid;
      p.vy += dy * kCentroid;
      p.vz += dz * kCentroid;
    }

    // 2d. Integrate velocities and apply damping
    for (const p of nodeArray) {
      p.x += p.vx;
      p.y += p.vy;
      p.z += p.vz;

      p.vx *= damping;
      p.vy *= damping;
      p.vz *= damping;
    }
  }

  return positions;
}
