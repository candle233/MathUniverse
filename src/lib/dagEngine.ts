import type { MathNode } from '../types/math.ts';

/**
 * DAG Topological Engine for MathUniverse
 * Handles Cycle Detection, Topological Sorting, Pathfinding, and Transitive Closure
 */

export interface CycleCheckResult {
  hasCycle: boolean;
  cyclePath?: string[]; // IDs of nodes forming the cycle
}

/**
 * Validates whether adding a directed edge (fromNodeId -> toNodeId) would create a circular dependency.
 * If toNodeId can already reach fromNodeId, adding this edge would create a cycle!
 */
export function checkCircularDependency(
  nodes: MathNode[],
  fromNodeId: string, // Dependent (downstream)
  toNodeId: string    // Prerequisite (upstream)
): CycleCheckResult {
  if (fromNodeId === toNodeId) {
    return { hasCycle: true, cyclePath: [fromNodeId, toNodeId] };
  }

  // Adjacency list (dependencies direction: node -> its dependencies)
  const adj = new Map<string, string[]>();
  nodes.forEach((n) => {
    adj.set(n.id, [...n.dependencies]);
  });

  // Temporarily add candidate dependency
  const existingDeps = adj.get(fromNodeId) || [];
  adj.set(fromNodeId, [...existingDeps, toNodeId]);

  // DFS cycle detection using 3-color states (0: Unvisited, 1: Visiting, 2: Visited)
  const visited = new Map<string, number>();
  const parent = new Map<string, string>();
  let detectedCycle: string[] | undefined = undefined;

  function dfs(u: string): boolean {
    visited.set(u, 1); // Mark as visiting

    const neighbors = adj.get(u) || [];
    for (const v of neighbors) {
      if (visited.get(v) === 1) {
        // Found back-edge! Reconstruct cycle path
        const path = [v, u];
        let curr = u;
        while (curr !== v && parent.has(curr)) {
          curr = parent.get(curr)!;
          path.push(curr);
        }
        detectedCycle = path.reverse();
        return true;
      }
      if (!visited.has(v) || visited.get(v) === 0) {
        parent.set(v, u);
        if (dfs(v)) return true;
      }
    }

    visited.set(u, 2); // Mark as completely visited
    return false;
  }

  for (const n of nodes) {
    if (!visited.has(n.id) || visited.get(n.id) === 0) {
      if (dfs(n.id)) {
        return { hasCycle: true, cyclePath: detectedCycle };
      }
    }
  }

  return { hasCycle: false };
}

/**
 * Kahn's Algorithm for Topological Sorting of MathNodes
 * Returns nodes sorted in prerequisite-first order (Axioms/Definitions -> Lemmas -> Theorems -> Corollaries)
 */
export function topologicalSort(nodes: MathNode[]): { sorted: MathNode[]; isDAG: boolean } {
  const inDegree = new Map<string, number>();
  const adj = new Map<string, string[]>(); // prerequisite -> dependents

  nodes.forEach((n) => {
    inDegree.set(n.id, n.dependencies.length);
    adj.set(n.id, []);
  });

  nodes.forEach((n) => {
    n.dependencies.forEach((prereqId) => {
      const dependentsList = adj.get(prereqId) || [];
      dependentsList.push(n.id);
      adj.set(prereqId, dependentsList);
    });
  });

  // Queue of nodes with 0 prerequisites
  const queue: string[] = [];
  inDegree.forEach((deg, id) => {
    if (deg === 0) queue.push(id);
  });

  const sortedIds: string[] = [];

  while (queue.length > 0) {
    const currId = queue.shift()!;
    sortedIds.push(currId);

    const dependents = adj.get(currId) || [];
    for (const depId of dependents) {
      // Every node's inDegree was initialized in the prepass above, so this
      // entry always exists and is > 0 (a node's edge is only processed once,
      // when its unique source is dequeued). Decrement unconditionally and
      // enqueue when it reaches zero.
      const newDeg = inDegree.get(depId)! - 1;
      inDegree.set(depId, newDeg);
      if (newDeg === 0) {
        queue.push(depId);
      }
    }
  }

  const isDAG = sortedIds.length === nodes.length;
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const sorted = sortedIds.map((id) => nodeMap.get(id)!).filter(Boolean);

  return { sorted, isDAG };
}

/**
 * Finds all connecting logical derivation paths between two theorems
 */
export function findDerivationPaths(
  nodes: MathNode[],
  startPrereqId: string,
  targetTheoremId: string
): string[][] {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const allPaths: string[][] = [];

  function dfs(currId: string, currentPath: string[]) {
    if (currId === startPrereqId) {
      allPaths.push([...currentPath].reverse());
      return;
    }

    const currNode = nodeMap.get(currId);
    if (!currNode) return;

    for (const prereqId of currNode.dependencies) {
      if (!currentPath.includes(prereqId)) {
        dfs(prereqId, [...currentPath, prereqId]);
      }
    }
  }

  dfs(targetTheoremId, [targetTheoremId]);
  return allPaths;
}

/**
 * Returns all transitive upstream prerequisites for a given target node id
 */
export function getTransitivePrerequisites(targetId: string, nodes: MathNode[]): string[] {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const visited = new Set<string>();

  function dfs(currId: string) {
    const node = nodeMap.get(currId);
    if (!node) return;

    for (const depId of node.dependencies) {
      if (!visited.has(depId)) {
        visited.add(depId);
        dfs(depId);
      }
    }
  }

  dfs(targetId);
  return Array.from(visited);
}

