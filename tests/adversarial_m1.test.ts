import {
  checkCircularDependency,
  topologicalSort,
  findDerivationPaths,
  getTransitivePrerequisites,
} from '../src/lib/dagEngine.ts';
import {
  numericalIntegrate,
  computeTaylorSeries,
  computeRiemannSum,
  analyzeMatrix,
  gramSchmidt,
  solveODE_RK4,
  analyzeNumber,
  modularExp,
  generateParametricSurfaceMesh,
  evaluateComplexFunction,
  verifyCauchySchwarz,
  verifyFTC,
  verifyStokes,
  verifyFermat,
  verifyEnergyConservation,
} from '../src/lib/mathCompute.ts';
import type { MathNode } from '../src/types/math.ts';

let passed = 0;
let failed = 0;
const failures: string[] = [];

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`  ✅ [PASS] ${testName}`);
    passed++;
  } else {
    const msg = `  ❌ [FAIL] ${testName}${detail ? ` - ${detail}` : ''}`;
    console.error(msg);
    failures.push(msg);
    failed++;
  }
}

console.log('⚔️ =======================================================');
console.log('⚔️  EMPIRICAL ADVERSARIAL STRESS HARNESS - MILESTONE 1  ⚔️');
console.log('⚔️ =======================================================\n');

// =========================================================================
// SECTION 1: DAG Engine Adversarial Graph Topologies
// =========================================================================
console.log('--- SECTION 1: DAG Engine Extreme Graph Topologies ---');

// 1.1 Deep Linear Chain (500 Nodes)
{
  const N = 500;
  const chainNodes: MathNode[] = [];
  for (let i = 0; i < N; i++) {
    chainNodes.push({
      id: `node-chain-${i}`,
      title: `Chain Node ${i}`,
      formalDefinition: `Definition of node ${i}`,
      category: 'ALGEBRA',
      status: 'VERIFIED',
      difficulty: 1,
      epoch: 'GENESIS',
      importance: 5,
      dependencies: i > 0 ? [`node-chain-${i - 1}`] : [],
      dependents: i < N - 1 ? [`node-chain-${i + 1}`] : [],
    });
  }

  const sortRes = topologicalSort(chainNodes);
  assert(sortRes.isDAG, '500-Node Deep Chain: isDAG must be true');
  assert(sortRes.sorted.length === N, `500-Node Deep Chain: Must sort all ${N} nodes`);
  assert(
    sortRes.sorted[0].id === 'node-chain-0' && sortRes.sorted[N - 1].id === `node-chain-${N - 1}`,
    '500-Node Deep Chain: Sort order must strictly preserve sequence from 0 to 499'
  );

  const prereqs = getTransitivePrerequisites(`node-chain-${N - 1}`, chainNodes);
  assert(prereqs.length === N - 1, `500-Node Deep Chain: Transitive prerequisites of last node must be ${N - 1} (got ${prereqs.length})`);
  assert(prereqs.includes('node-chain-0') && prereqs.includes('node-chain-250'), '500-Node Deep Chain: Must contain root and mid elements');

  const paths = findDerivationPaths(chainNodes, 'node-chain-0', `node-chain-${N - 1}`);
  assert(paths.length === 1 && paths[0].length === N, `500-Node Deep Chain: Single unique derivation path of length ${N}`);

  // Test cycle detection when back-edge is added (node-0 depends on node-499)
  const cycleRes = checkCircularDependency(chainNodes, 'node-chain-0', `node-chain-${N - 1}`);
  assert(cycleRes.hasCycle, '500-Node Deep Chain: Cycle detection on back-edge (0 -> 499) must return hasCycle = true');
}

// 1.2 Dense Multi-Path DAG (Complete Upper Triangular DAG, N = 30)
{
  const N = 30;
  const denseNodes: MathNode[] = [];
  for (let i = 0; i < N; i++) {
    const deps: string[] = [];
    for (let j = 0; j < i; j++) {
      deps.push(`dense-${j}`);
    }
    const depsOut: string[] = [];
    for (let k = i + 1; k < N; k++) {
      depsOut.push(`dense-${k}`);
    }
    denseNodes.push({
      id: `dense-${i}`,
      title: `Dense ${i}`,
      formalDefinition: `Dense ${i}`,
      category: 'ANALYSIS',
      status: 'VERIFIED',
      difficulty: 2,
      epoch: 'REALS',
      importance: 5,
      dependencies: deps,
      dependents: depsOut,
    });
  }

  const sortRes = topologicalSort(denseNodes);
  assert(sortRes.isDAG, 'Dense Multi-Path DAG (435 edges): Must identify valid DAG');
  assert(sortRes.sorted.length === N, 'Dense Multi-Path DAG: Sorted length must equal N');
  for (let i = 0; i < N; i++) {
    assert(sortRes.sorted[i].id === `dense-${i}`, `Dense DAG: Position ${i} must be dense-${i}`);
  }

  const prereqs = getTransitivePrerequisites(`dense-${N - 1}`, denseNodes);
  assert(prereqs.length === N - 1, `Dense DAG: Transitive prerequisites of dense-${N - 1} must be ${N - 1}`);

  // Non-cyclic edge within already existing direction
  const nonCycle = checkCircularDependency(denseNodes, 'dense-20', 'dense-5');
  assert(!nonCycle.hasCycle, 'Dense DAG: Adding redundant forward edge (20 -> 5) should not introduce cycle');

  // Cyclic back-edge
  const backEdge = checkCircularDependency(denseNodes, 'dense-5', 'dense-20');
  assert(backEdge.hasCycle, 'Dense DAG: Adding reverse edge (5 -> 20) must be flagged as cycle');
}

// 1.3 Disconnected Components & Isolated Nodes
{
  const disconnNodes: MathNode[] = [];
  // 5 components of 4 nodes each
  for (let c = 0; c < 5; c++) {
    for (let i = 0; i < 4; i++) {
      disconnNodes.push({
        id: `comp-${c}-node-${i}`,
        title: `C${c} N${i}`,
        formalDefinition: '',
        category: 'TOPOLOGY',
        status: 'VERIFIED',
        difficulty: 1,
        epoch: 'TOPOLOGY',
        importance: 1,
        dependencies: i > 0 ? [`comp-${c}-node-${i - 1}`] : [],
        dependents: i < 3 ? [`comp-${c}-node-${i + 1}`] : [],
      });
    }
  }
  // 10 isolated nodes
  for (let iso = 0; iso < 10; iso++) {
    disconnNodes.push({
      id: `iso-${iso}`,
      title: `Isolated ${iso}`,
      formalDefinition: '',
      category: 'GEOMETRY',
      status: 'VERIFIED',
      difficulty: 1,
      epoch: 'GENESIS',
      importance: 1,
      dependencies: [],
      dependents: [],
    });
  }

  const sortRes = topologicalSort(disconnNodes);
  assert(sortRes.isDAG, 'Disconnected DAG (30 nodes across 15 components): Must be valid DAG');
  assert(sortRes.sorted.length === 30, 'Disconnected DAG: All 30 nodes must be returned in sort');

  // Verify paths between disconnected components is empty
  const noPath = findDerivationPaths(disconnNodes, 'comp-0-node-0', 'comp-1-node-3');
  assert(noPath.length === 0, 'Disconnected DAG: No path must exist between disjoint components');

  // Verify isolation
  const isoPrereqs = getTransitivePrerequisites('iso-3', disconnNodes);
  assert(isoPrereqs.length === 0, 'Disconnected DAG: Isolated node must have 0 transitive prerequisites');
}

// 1.4 Nested Diamond DAG (Exponential Path Multiplicity)
{
  // Diamonds: 0 -> (1, 2) -> 3 -> (4, 5) -> 6 -> (7, 8) -> 9 -> (10, 11) -> 12
  // Total 4 diamond stages => 2^4 = 16 paths from node-0 to node-12
  const diamondNodes: MathNode[] = [];
  const numStages = 4;
  for (let s = 0; s < numStages; s++) {
    const rootId = `dia-${3 * s}`;
    const leftId = `dia-${3 * s + 1}`;
    const rightId = `dia-${3 * s + 2}`;
    const nextRootId = `dia-${3 * s + 3}`;

    if (s === 0) {
      diamondNodes.push({
        id: rootId,
        title: rootId,
        formalDefinition: '',
        category: 'ALGEBRA',
        status: 'VERIFIED',
        difficulty: 1,
        epoch: 'GENESIS',
        importance: 1,
        dependencies: [],
        dependents: [leftId, rightId],
      });
    }

    diamondNodes.push({
      id: leftId,
      title: leftId,
      formalDefinition: '',
      category: 'ALGEBRA',
      status: 'VERIFIED',
      difficulty: 1,
      epoch: 'GENESIS',
      importance: 1,
      dependencies: [rootId],
      dependents: [nextRootId],
    });

    diamondNodes.push({
      id: rightId,
      title: rightId,
      formalDefinition: '',
      category: 'ALGEBRA',
      status: 'VERIFIED',
      difficulty: 1,
      epoch: 'GENESIS',
      importance: 1,
      dependencies: [rootId],
      dependents: [nextRootId],
    });

    diamondNodes.push({
      id: nextRootId,
      title: nextRootId,
      formalDefinition: '',
      category: 'ALGEBRA',
      status: 'VERIFIED',
      difficulty: 1,
      epoch: 'GENESIS',
      importance: 1,
      dependencies: [leftId, rightId],
      dependents: s < numStages - 1 ? [`dia-${3 * (s + 1) + 1}`, `dia-${3 * (s + 1) + 2}`] : [],
    });
  }

  const targetId = `dia-${3 * numStages}`;
  const sortRes = topologicalSort(diamondNodes);
  assert(sortRes.isDAG, 'Diamond DAG: Topological sort isDAG must be true');

  const paths = findDerivationPaths(diamondNodes, 'dia-0', targetId);
  const expectedPaths = Math.pow(2, numStages);
  assert(paths.length === expectedPaths, `Diamond DAG: Must find all ${expectedPaths} derivation paths (got ${paths.length})`);

  const prereqs = getTransitivePrerequisites(targetId, diamondNodes);
  assert(prereqs.length === diamondNodes.length - 1, `Diamond DAG: All ${diamondNodes.length - 1} ancestor nodes must be in transitive closure`);
}

// 1.5 Edge Cases: Empty graph, Single node, Circular graph
{
  const emptyRes = topologicalSort([]);
  assert(emptyRes.isDAG && emptyRes.sorted.length === 0, 'Edge Case: Empty node list returns isDAG=true, length=0');

  const singleNode: MathNode = {
    id: 'alone',
    title: 'Alone',
    formalDefinition: '',
    category: 'NUMBER_THEORY',
    status: 'VERIFIED',
    difficulty: 1,
    epoch: 'GENESIS',
    importance: 1,
    dependencies: [],
    dependents: [],
  };
  const singleRes = topologicalSort([singleNode]);
  assert(singleRes.isDAG && singleRes.sorted.length === 1, 'Edge Case: Single isolated node returns isDAG=true, length=1');

  // Actual cyclic graph of 3 nodes: A -> B -> C -> A
  const cyclicNodes: MathNode[] = [
    { id: 'cA', title: 'A', formalDefinition: '', category: 'ALGEBRA', status: 'VERIFIED', difficulty: 1, epoch: 'GENESIS', importance: 1, dependencies: ['cC'], dependents: ['cB'] },
    { id: 'cB', title: 'B', formalDefinition: '', category: 'ALGEBRA', status: 'VERIFIED', difficulty: 1, epoch: 'GENESIS', importance: 1, dependencies: ['cA'], dependents: ['cC'] },
    { id: 'cC', title: 'C', formalDefinition: '', category: 'ALGEBRA', status: 'VERIFIED', difficulty: 1, epoch: 'GENESIS', importance: 1, dependencies: ['cB'], dependents: ['cA'] },
  ];
  const cyclicSort = topologicalSort(cyclicNodes);
  assert(!cyclicSort.isDAG, 'Cyclic Graph: topologicalSort must return isDAG = false');
  assert(cyclicSort.sorted.length === 0, 'Cyclic Graph: sorted array must be empty (0 elements resolved)');
}

// =========================================================================
// SECTION 2: Matrix & Linear Algebra Extreme Inputs
// =========================================================================
console.log('\n--- SECTION 2: Linear Algebra & Matrix Analysis Stress Tests ---');

// 2.1 Singular & Rank-Deficient Matrices
{
  // All zero 2x2
  const zero2x2 = analyzeMatrix([
    [0, 0],
    [0, 0],
  ]);
  assert(zero2x2.determinant === 0, 'Zero 2x2 Matrix: det must be 0');
  assert(zero2x2.rank === 0, 'Zero 2x2 Matrix: rank must be 0');
  assert(zero2x2.inverse === undefined, 'Zero 2x2 Matrix: inverse must be undefined');

  // Collinear rows 2x2
  const colin2x2 = analyzeMatrix([
    [2, 4],
    [1, 2],
  ]);
  assert(Math.abs(colin2x2.determinant) < 1e-10, 'Collinear 2x2 Matrix: det must be 0');
  assert(colin2x2.rank === 1, `Collinear 2x2 Matrix: rank must be 1 (got ${colin2x2.rank})`);
  assert(colin2x2.inverse === undefined, 'Collinear 2x2 Matrix: inverse must be undefined');

  // Rank 1 3x3
  const rank1_3x3 = analyzeMatrix([
    [1, 2, 3],
    [2, 4, 6],
    [-1, -2, -3],
  ]);
  assert(Math.abs(rank1_3x3.determinant) < 1e-10, 'Rank-1 3x3 Matrix: det must be 0');
  assert(rank1_3x3.rank === 1, `Rank-1 3x3 Matrix: rank must be 1 (got ${rank1_3x3.rank})`);
  assert(rank1_3x3.inverse === undefined, 'Rank-1 3x3 Matrix: inverse must be undefined');

  // Rank 2 3x3
  const rank2_3x3 = analyzeMatrix([
    [1, 0, 1],
    [0, 1, 1],
    [1, 1, 2],
  ]);
  assert(Math.abs(rank2_3x3.determinant) < 1e-10, 'Rank-2 3x3 Matrix: det must be 0');
  assert(rank2_3x3.rank === 2, `Rank-2 3x3 Matrix: rank must be 2 (got ${rank2_3x3.rank})`);
  assert(rank2_3x3.inverse === undefined, 'Rank-2 3x3 Matrix: inverse must be undefined');
}

// 2.2 Matrix Inversion Precision Oracle
{
  const testMatrices = [
    [
      [4, 7],
      [2, 6],
    ], // det = 10
    [
      [1, 2, 3],
      [0, 1, 4],
      [5, 6, 0],
    ], // det = 1
    [
      [2, -1, 0],
      [-1, 2, -1],
      [0, -1, 2],
    ], // Tridiagonal Toeplitz, det = 4
  ];

  for (let idx = 0; idx < testMatrices.length; idx++) {
    const M = testMatrices[idx];
    const n = M.length;
    const res = analyzeMatrix(M);
    assert(res.inverse !== undefined, `Matrix Inversion [${idx}]: Inverse must be computed`);
    if (res.inverse) {
      // Multiply M * M_inv and verify I_n
      let maxIdentityDiff = 0;
      for (let r = 0; r < n; r++) {
        for (let c = 0; c < n; c++) {
          let sum = 0;
          for (let k = 0; k < n; k++) {
            sum += M[r][k] * res.inverse[k][c];
          }
          const expected = r === c ? 1 : 0;
          const diff = Math.abs(sum - expected);
          if (diff > maxIdentityDiff) maxIdentityDiff = diff;
        }
      }
      assert(
        maxIdentityDiff < 1e-8,
        `Matrix Inversion [${idx}]: A * A^(-1) must equal I (max error: ${maxIdentityDiff.toExponential(3)})`
      );
    }
  }
}

// 2.3 Complex & Repeated Eigenvalues
{
  // 90-degree Rotation Matrix in 2D: [[0, -1], [1, 0]] -> Eigenvalues +- 1i
  const rot2D = analyzeMatrix([
    [0, -1],
    [1, 0],
  ]);
  assert(
    rot2D.eigenvalues.length === 2 &&
      Math.abs(rot2D.eigenvalues[0].real) < 1e-9 &&
      Math.abs(Math.abs(rot2D.eigenvalues[0].imag) - 1.0) < 1e-9,
    'Eigenvalues 2D Rotation: Pure imaginary eigenvalues +- 1i correctly computed'
  );

  // 3x3 Diagonal Matrix: Eigenvalues must equal diagonal entries
  const diag3 = analyzeMatrix([
    [7, 0, 0],
    [0, -3, 0],
    [0, 0, 5],
  ]);
  const foundEigs = diag3.eigenvalues.map((e) => Math.round(e.real)).sort((a, b) => a - b);
  assert(
    JSON.stringify(foundEigs) === JSON.stringify([-3, 5, 7]),
    `Eigenvalues 3x3 Diagonal: Expected [-3, 5, 7], got [${foundEigs.join(', ')}]`
  );
}

// 2.4 Gram-Schmidt Degenerate Inputs
{
  // Linearly dependent vectors
  const depVecs = [
    [1, 0, 0],
    [2, 0, 0],
    [0, 1, 0],
  ];
  const gsRes = gramSchmidt(depVecs);
  assert(gsRes.orthogonal.length === 3, 'Gram-Schmidt with dependent vectors: Must process all 3 vectors');
  // Second orthogonalized vector should be zero vector
  const norm2 = Math.sqrt(gsRes.orthogonal[1].reduce((s, v) => s + v * v, 0));
  assert(norm2 < 1e-9, 'Gram-Schmidt with dependent vectors: Redundant vector must orthogonalize to 0');
}

// =========================================================================
// SECTION 3: Calculus & Numerical Routines Extreme Inputs
// =========================================================================
console.log('\n--- SECTION 3: Calculus & Numerical Routines Extreme Inputs ---');

// 3.1 Zero & Reversed Intervals in Numerical Integration
{
  const f = (x: number) => Math.sin(x) * Math.exp(x);
  // Zero interval
  const zeroInt = numericalIntegrate(f, 3.5, 3.5);
  assert(Math.abs(zeroInt.value) < 1e-12, `Numerical Integration: Zero interval [3.5, 3.5] must yield 0.0 (got ${zeroInt.value})`);

  // Reversed interval: int_b^a f = - int_a^b f
  const fPoly = (x: number) => 3 * x * x - 2 * x + 1; // antiderivative: x^3 - x^2 + x
  const fwd = numericalIntegrate(fPoly, 1, 4); // (64 - 16 + 4) - (1 - 1 + 1) = 52 - 1 = 51
  const rev = numericalIntegrate(fPoly, 4, 1);
  assert(Math.abs(fwd.value - 51) < 1e-6, `Numerical Integration: Forward [1, 4] equals 51.0 (got ${fwd.value})`);
  assert(Math.abs(rev.value - (-51)) < 1e-6, `Numerical Integration: Reversed [4, 1] equals -51.0 (got ${rev.value})`);
}

// 3.2 Exactness on Cubic Polynomials (Simpson 3/8 Rule Theoretical Guarantee)
{
  // Simpson's 3/8 rule has degree of precision 3 (exact for polynomials of degree <= 3)
  const p3 = (x: number) => 5 * x ** 3 - 7 * x ** 2 + 3 * x - 9;
  // Exact integral on [-2, 3]:
  // [5/4 x^4 - 7/3 x^3 + 3/2 x^2 - 9x] from -2 to 3
  const exactP3 = 24.75 - (20 + (56 / 3) + 6 + 18);
  const numP3 = numericalIntegrate(p3, -2, 3, 300);
  assert(
    Math.abs(numP3.value - exactP3) < 1e-10,
    `Simpson Exactness: Cubic polynomial integral error < 1e-10 (got error ${Math.abs(numP3.value - exactP3).toExponential(3)})`
  );
}

// 3.3 Highly Oscillatory Functions
{
  // int_0^pi sin(20 x) dx = [ -cos(20x)/20 ]_0^pi = (-1 - (-1))/20 = 0
  const oscInt = numericalIntegrate((x) => Math.sin(20 * x), 0, Math.PI, 600);
  assert(Math.abs(oscInt.value) < 1e-4, `Oscillatory Integration: int_0^pi sin(20x) dx must be near 0 (got ${oscInt.value.toFixed(6)})`);
}

// 3.4 Taylor Series Expansion Accuracy
{
  // Taylor series of cos(x) around x0 = 0: 1 - x^2/2 + x^4/24 - ...
  const cosTaylor = computeTaylorSeries(Math.cos, 0, 4);
  assert(cosTaylor.length === 5, 'Taylor Series: Order 4 must produce 5 terms (orders 0..4)');
  assert(Math.abs(cosTaylor[0].coef - 1.0) < 1e-5, `Taylor cos(x): Order 0 coef = 1.0 (got ${cosTaylor[0].coef.toFixed(5)})`);
  assert(Math.abs(cosTaylor[1].coef) < 1e-4, `Taylor cos(x): Order 1 coef = 0.0 (got ${cosTaylor[1].coef.toFixed(5)})`);
  assert(Math.abs(cosTaylor[2].coef - (-0.5)) < 1e-3, `Taylor cos(x): Order 2 coef = -0.5 (got ${cosTaylor[2].coef.toFixed(5)})`);
  assert(Math.abs(cosTaylor[3].coef) < 1e-3, `Taylor cos(x): Order 3 coef = 0.0 (got ${cosTaylor[3].coef.toFixed(5)})`);
  assert(Math.abs(cosTaylor[4].coef - (1 / 24)) < 1e-2, `Taylor cos(x): Order 4 coef = 1/24 ≈ 0.0417 (got ${cosTaylor[4].coef.toFixed(5)})`);
}

// 3.5 Riemann Sum Edge Cases
{
  const rZero = computeRiemannSum((x) => x, 2, 2, 10);
  assert(rZero.sum === 0 && rZero.rectangles.every((r) => r.width === 0), 'Riemann Sum: Zero interval [2, 2] yields sum 0 and width 0');

  const rMid = computeRiemannSum((x) => x * x, 0, 1, 1000, 'midpoint');
  assert(Math.abs(rMid.sum - 1 / 3) < 1e-4, `Riemann Midpoint Sum: 1000 partitions of x^2 on [0, 1] equals 1/3 (got ${rMid.sum.toFixed(6)})`);
}

// =========================================================================
// SECTION 4: Number Theory & Modular Arithmetic Stress Tests
// =========================================================================
console.log('\n--- SECTION 4: Number Theory & Large Number Stress Tests ---');

// 4.1 Large Prime & Primality Verification
{
  const p = 104729; // 10,000th prime
  const analysis = analyzeNumber(p);
  assert(analysis.isPrime, `analyzeNumber: ${p} must be recognized as prime`);
  assert(analysis.eulerTotient === p - 1, `analyzeNumber: Euler totient phi(${p}) must be ${p - 1} (got ${analysis.eulerTotient})`);
  assert(analysis.factors.length === 1 && analysis.factors[0].prime === p, `analyzeNumber: Prime factor of ${p} must be single prime`);

  // Highly composite number: 7560 = 2^3 * 3^3 * 5 * 7
  // phi(7560) = 7560 * (1/2) * (2/3) * (4/5) * (6/7) = 1728
  const comp = analyzeNumber(7560);
  assert(comp.eulerTotient === 1728, `analyzeNumber: phi(7560) must be 1728 (got ${comp.eulerTotient})`);
  assert(comp.factors.length === 4, 'analyzeNumber: 7560 must have 4 distinct prime factors');
}

// 4.2 BigInt Modular Exponentiation & Carmichael Numbers
{
  // Modular exponentiation oracle: 7^256 mod 13
  // 256 = 12 * 21 + 4 => 7^4 mod 13 = 2401 mod 13 = 9
  const modRes = modularExp(7n, 256n, 13n);
  assert(modRes === 9n, `modularExp: 7^256 mod 13 must be 9n (got ${modRes}n)`);

  // Carmichael number 561 = 3 * 11 * 17
  // For all a with gcd(a, 561) == 1, a^560 = 1 mod 561
  const carmichaelBases = [2n, 5n, 7n, 13n, 19n, 23n];
  let carmichaelPass = true;
  for (const b of carmichaelBases) {
    if (modularExp(b, 560n, 561n) !== 1n) {
      carmichaelPass = false;
    }
  }
  assert(carmichaelPass, 'modularExp: Carmichael number 561 satisfies a^560 ≡ 1 (mod 561) for coprime bases');
}

// =========================================================================
// SECTION 5: Complex Analysis & Differential Equations Extreme Cases
// =========================================================================
console.log('\n--- SECTION 5: Complex Analysis & Differential Equations ---');

// 5.1 Complex Function Boundary & Singular Values
{
  // Logarithm branch cut: negative real axis
  const logNeg = evaluateComplexFunction('log', -5, 0);
  assert(logNeg.isDiscontinuity === true, 'Complex Log: (-5, 0) flagged as branch cut discontinuity');
  assert(Math.abs(logNeg.v - Math.PI) < 1e-9, `Complex Log: arg(-5) must be pi (got ${logNeg.v})`);

  // Sqrt branch cut: negative real axis
  const sqrtNeg = evaluateComplexFunction('sqrt', -9, 0);
  assert(sqrtNeg.isDiscontinuity === true, 'Complex Sqrt: (-9, 0) flagged as branch cut discontinuity');
  assert(Math.abs(sqrtNeg.u) < 1e-9 && Math.abs(sqrtNeg.v - 3) < 1e-9, `Complex Sqrt: sqrt(-9) = 3i (got ${sqrtNeg.u} + ${sqrtNeg.v}i)`);

  // Möbius transform (z - 1)/(z + 1) at z = 1 => 0
  const mobOne = evaluateComplexFunction('mobius', 1, 0);
  assert(mobOne.modulus < 1e-9, `Möbius transform: f(1) must be 0 (got modulus ${mobOne.modulus})`);
}

// 5.2 RK4 Solvers Boundedness & Edge Parameters
{
  // Lorenz attractor integration for 2000 steps
  const lorenzRes = solveODE_RK4({
    system: 'lorenz',
    params: { sigma: 10, rho: 28, beta: 8 / 3 },
    initialState: [1, 1, 1],
    tSpan: [0, 20],
    dt: 0.01,
  });
  assert(lorenzRes.trajectory.length === 2001, 'RK4 Lorenz: 2001 trajectory steps produced');
  let hasNaN = false;
  let inBounds = true;
  for (const [x, y, z] of lorenzRes.trajectory) {
    if (isNaN(x) || isNaN(y) || isNaN(z)) hasNaN = true;
    if (Math.abs(x) > 100 || Math.abs(y) > 100 || z < -10 || z > 100) inBounds = false;
  }
  assert(!hasNaN && inBounds, 'RK4 Lorenz: Trajectory remains bounded on the strange attractor without NaNs');
}

// 5.3 3D Parametric Surface Mesh Invariants
{
  const surfaceTypes: Array<'mobius' | 'torus' | 'hyperbolic_paraboloid' | 'monkey_saddle' | 'catenoid' | 'helicoid' | 'enneper' | 'riemann_sphere'> = [
    'mobius',
    'torus',
    'hyperbolic_paraboloid',
    'monkey_saddle',
    'catenoid',
    'helicoid',
    'enneper',
    'riemann_sphere',
  ];

  let allSurfacesValid = true;
  for (const sType of surfaceTypes) {
    const mesh = generateParametricSurfaceMesh(sType, 12, 12);
    if (
      mesh.vertices.length !== 13 * 13 ||
      mesh.faces.length !== 12 * 12 ||
      isNaN(mesh.bounds.minX) ||
      isNaN(mesh.bounds.maxX)
    ) {
      allSurfacesValid = false;
    }
  }
  assert(allSurfacesValid, '3D Parametric Surfaces: All 8 surface generators generate consistent vertex/face grids without NaN bounds');
}

console.log('\n=======================================================');
console.log(`📊 ADVERSARIAL STRESS TEST SUMMARY: ${passed} passed, ${failed} failed`);
console.log('=======================================================');

if (failed > 0) {
  console.error('\nFAILED TESTS:');
  failures.forEach((f) => console.error(f));
  process.exit(1);
} else {
  console.log('\n🏆 ALL ADVERSARIAL CHALLENGES EMPIRICALLY PASSED!');
}
