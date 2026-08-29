import {
  checkCircularDependency,
  topologicalSort,
  findDerivationPaths,
  getTransitivePrerequisites,
} from '../src/lib/dagEngine.ts';
import {
  numericalIntegrate,
  numericalDerivative,
  computeTaylorSeries,
  computeFourierSeries,
  computeRiemannSum,
  analyzeMatrix,
  gramSchmidt,
  solveODE_RK4,
  generateVectorFieldGrid,
  analyzeNumber,
  modularExp,
  generateParametricSurfaceMesh,
  evaluateComplexFunction,
  generateComplexGrid,
  verifyCauchySchwarz,
  verifyFTC,
  verifyStokes,
  verifyFermat,
  verifyEnergyConservation,
  verificationContracts,
  executeVerificationContract,
} from '../src/lib/mathCompute.ts';
import type { MathNode } from '../src/types/math.ts';

console.log('--- Deep Probe ---');

// Test 1: Transitive prerequisites on cyclic graph
const cycleNodes: MathNode[] = [
  { id: 'n1', title: 'n1', formalDefinition: '', category: 'ALGEBRA', status: 'VERIFIED', difficulty: 1, epoch: 'GENESIS', importance: 1, dependencies: ['n2'], dependents: ['n3'] },
  { id: 'n2', title: 'n2', formalDefinition: '', category: 'ALGEBRA', status: 'VERIFIED', difficulty: 1, epoch: 'GENESIS', importance: 1, dependencies: ['n3'], dependents: ['n1'] },
  { id: 'n3', title: 'n3', formalDefinition: '', category: 'ALGEBRA', status: 'VERIFIED', difficulty: 1, epoch: 'GENESIS', importance: 1, dependencies: ['n1'], dependents: ['n2'] },
];
const cyclePrereqs = getTransitivePrerequisites('n1', cycleNodes);
console.log('Cycle prereqs terminated successfully:', cyclePrereqs);

// Test 2: findDerivationPaths on identical start and target
const selfPath = findDerivationPaths(cycleNodes, 'n1', 'n1');
console.log('Self path:', selfPath);

// Test 3: solveODE_RK4 on all 6 systems
const systems = ['lorenz', 'lotka_volterra', 'van_der_pol', 'rossler', 'sir', 'pendulum'] as const;
for (const sys of systems) {
  const res = solveODE_RK4({
    system: sys,
    params: {},
    initialState: [1, 1, 1],
    tSpan: [0, 5],
    dt: 0.05,
  });
  console.log(`ODE ${sys} steps: ${res.trajectory.length}, last: ${res.trajectory[res.trajectory.length - 1].map(x => x.toFixed(3)).join(', ')}`);
}

// Test 4: analyzeNumber on edge cases
console.log('analyzeNumber(1):', analyzeNumber(1));
console.log('analyzeNumber(0):', analyzeNumber(0));
console.log('analyzeNumber(-10):', analyzeNumber(-10));

// Test 5: modularExp on edge cases
console.log('modularExp(5n, 0n, 13n):', modularExp(5n, 0n, 13n));
console.log('modularExp(0n, 5n, 13n):', modularExp(0n, 5n, 13n));

// Test 6: Verification contracts execution
for (const c of verificationContracts) {
  const exec = executeVerificationContract(c);
  console.log(`Contract ${c.id}: passed=${exec.passed}, maxError=${exec.maxError}`);
}
