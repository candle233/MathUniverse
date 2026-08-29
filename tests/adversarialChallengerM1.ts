import {
  verifyCauchySchwarz,
  verifyFTC,
  verifyStokes,
  verifyFermat,
  verifyEnergyConservation,
  solveODE_RK4,
  generateParametricSurfaceMesh,
  type ParametricSurfaceType,
  evaluateComplexFunction,
  analyzeMatrix,
  gramSchmidt,
  numericalIntegrate,
  numericalDerivative,
  verificationContracts,
  executeVerificationContract,
  getVerificationContractsForNode,
} from '../src/lib/mathCompute.ts';

interface TestStats {
  total: number;
  passed: number;
  failed: number;
  failures: string[];
}

const stats: TestStats = {
  total: 0,
  passed: 0,
  failed: 0,
  failures: [],
};

function assert(condition: boolean, testName: string, detail?: string) {
  stats.total++;
  if (condition) {
    stats.passed++;
    console.log('  [PASS] ' + testName);
  } else {
    stats.failed++;
    const msg = '  [FAIL] ' + testName + (detail ? ' -> ' + detail : '');
    console.error(msg);
    stats.failures.push(msg);
  }
}

console.log('========================================================');
console.log('CHALLENGER 2: ADVERSARIAL STRESS TEST & VERIFICATION SUITE');
console.log('========================================================\n');

// =========================================================================
// SUITE 1: Theorem Verification Contracts Adversarial Testing
// =========================================================================
console.log('--- SUITE 1: Theorem Verification Contracts Adversarial Testing ---');

// 1.1 Cauchy-Schwarz: Random Seed & Sample Scalability
console.log('\n[1.1] Cauchy-Schwarz Inequality Stress:');
let csAllPassed = true;
let csMaxErr = 0;
for (let seed = 0; seed < 10; seed++) {
  const res = verifyCauchySchwarz({ dim: 4 }, 5000);
  if (!res.passed || res.maxError > 1e-9) csAllPassed = false;
  if (res.maxError > csMaxErr) csMaxErr = res.maxError;
}
assert(csAllPassed, 'Cauchy-Schwarz 10 iterations of 5000 samples (50k total) with dim=4 must pass', 'Max err: ' + csMaxErr);

// Dimension scaling: dim = 1, 2, 3, 8, 16, 64, 128
const dims = [1, 2, 3, 8, 16, 64, 128];
let dimScalingPassed = true;
for (const d of dims) {
  const res = verifyCauchySchwarz({ dim: d }, 1000);
  if (!res.passed || res.maxError > 1e-9) {
    dimScalingPassed = false;
    console.error('  Cauchy-Schwarz failed at dim=' + d + ', maxErr=' + res.maxError);
  }
}
assert(dimScalingPassed, 'Cauchy-Schwarz across dimensions [1, 2, 3, 8, 16, 64, 128] must all pass');

// Edge cases & default parameters
const csDefault = verifyCauchySchwarz({});
assert(csDefault.passed && csDefault.sampleCount === 2000, 'Cauchy-Schwarz with empty params defaults to dim=4, sampleCount=2000');

// 1.2 Fundamental Theorem of Calculus (FTC):
console.log('\n[1.2] Fundamental Theorem of Calculus (FTC) Stress:');
let ftcPassed = true;
let ftcMaxErr = 0;
for (let iter = 0; iter < 10; iter++) {
  const res = verifyFTC({}, 100);
  if (!res.passed || res.maxError > 1e-4) ftcPassed = false;
  if (res.maxError > ftcMaxErr) ftcMaxErr = res.maxError;
}
assert(ftcPassed, 'FTC 10 iterations of 100 random intervals (1000 total) must pass tolerance 1e-4', 'Max err: ' + ftcMaxErr);

// Simpson 3/8 numerical integration high-order polynomials and trigonometric functions
const testFunctions = [
  { name: 'cos(x) on [0, pi]', f: Math.sin, intF: (x: number) => -Math.cos(x), a: 0, b: Math.PI },
  { name: 'exp(x) on [-1, 2]', f: Math.exp, intF: Math.exp, a: -1, b: 2 },
  { name: 'x^5 - 3x^2 on [0, 2]', f: (x: number) => Math.pow(x, 5) - 3 * Math.pow(x, 2), intF: (x: number) => Math.pow(x, 6)/6 - Math.pow(x, 3), a: 0, b: 2 },
];
for (const tf of testFunctions) {
  const num = numericalIntegrate(tf.f, tf.a, tf.b, 600).value;
  const exact = tf.intF(tf.b) - tf.intF(tf.a);
  const err = Math.abs(num - exact);
  assert(err < 1e-4, 'Simpson 3/8 numerical integral for ' + tf.name + ' matches exact analytical value', 'Err: ' + err.toExponential(3));
}

// 1.3 Stokes Theorem:
console.log('\n[1.3] Stokes Theorem Parameter & Radius Sweep:');
const radii = [0.01, 0.1, 0.5, 1.0, 2.5, 5.0, 10.0, 50.0];
let stokesSweepPassed = true;
let stokesMaxErr = 0;
for (const r of radii) {
  const res = verifyStokes({ radius: r });
  if (!res.passed || res.maxError > 1e-3) {
    stokesSweepPassed = false;
    console.error('  Stokes failed for radius=' + r + ', maxErr=' + res.maxError);
  }
  if (res.maxError > stokesMaxErr) stokesMaxErr = res.maxError;
}
assert(stokesSweepPassed, 'Stokes theorem holds across radii [0.01, 0.1, 0.5, 1.0, 2.5, 5.0, 10.0, 50.0]', 'Max err: ' + stokesMaxErr);

// Stokes degenerate radius = 0
const stokesZero = verifyStokes({ radius: 0 });
assert(stokesZero.passed && stokesZero.maxError === 0, 'Stokes theorem holds for radius = 0 (point manifold)');

// 1.4 Fermat Little Theorem:
console.log('\n[1.4] Fermat Little Theorem Exhaustive Prime Base Checking:');
let fermatRunsPassed = true;
for (let run = 0; run < 20; run++) {
  const res = verifyFermat({});
  if (!res.passed || res.maxError !== 0) fermatRunsPassed = false;
}
assert(fermatRunsPassed, 'Fermat Little Theorem passes across 20 randomized Monte Carlo iterations');

// Deterministic verification across all bases for first 10 primes:
const smallPrimes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31];
let exhaustiveFermatPassed = true;
for (const p of smallPrimes) {
  for (let a = 1; a < p; a++) {
    const rem = Number(BigInt(a) ** BigInt(p - 1) % BigInt(p));
    if (rem !== 1) {
      exhaustiveFermatPassed = false;
      console.error('Fermat failed for p=' + p + ', a=' + a + ', rem=' + rem);
    }
  }
}
assert(exhaustiveFermatPassed, 'Exhaustive verification: a^(p-1) == 1 mod p for all 1 <= a < p for primes 2..31');

// 1.5 Energy Conservation in Hamiltonian Pendulum:
console.log('\n[1.5] Energy Conservation Along RK4 Trajectories:');
const omegas = [0.5, 1.0, 2.0, 3.0, 5.0];
let energySweepPassed = true;
let energyMaxDrift = 0;
for (const om of omegas) {
  const res = verifyEnergyConservation({ omega: om });
  if (!res.passed || res.maxError > 1e-3) {
    energySweepPassed = false;
    console.error('  Energy conservation failed for omega=' + om + ', maxError=' + res.maxError);
  }
  if (res.maxError > energyMaxDrift) energyMaxDrift = res.maxError;
}
assert(energySweepPassed, 'Pendulum Hamiltonian energy conservation holds for omega in [0.5, 1.0, 2.0, 3.0, 5.0]', 'Max drift: ' + energyMaxDrift.toExponential(3));

// Contract registry integrity
const regContracts = verificationContracts;
assert(regContracts.length >= 4, 'Verification contracts registry contains >= 4 contracts (found ' + regContracts.length + ')');
for (const c of regContracts) {
  const res = executeVerificationContract(c);
  assert(res.passed, 'Contract ' + c.id + ' (' + c.claimName + ') executes and passes via typescript engine');
}

// =========================================================================
// SUITE 2: ODE Integrator RK4 Robustness & Stiff System Stress Testing
// =========================================================================
console.log('\n--- SUITE 2: ODE Integrator RK4 Robustness & Stiff System Stress Testing ---');

// 2.1 Lorenz Attractor: Chaos, parameter variation & boundedness
console.log('\n[2.1] Lorenz Chaotic Attractor RK4 Trajectory Analysis:');
const lorenzStandard = solveODE_RK4({
  system: 'lorenz',
  params: { sigma: 10, rho: 28, beta: 8/3 },
  initialState: [1, 1, 1],
  tSpan: [0, 40],
  dt: 0.01,
});
assert(lorenzStandard.trajectory.length === 4001, 'Lorenz trajectory length matches (tSpan/dt) + 1');
const hasNaNLorenz = lorenzStandard.trajectory.some(pt => pt.some(v => isNaN(v) || !isFinite(v)));
assert(!hasNaNLorenz, 'Lorenz trajectory points must all be finite real numbers (no NaN or Infinity)');

// Lorenz bounding box check (trajectories stay inside strange attractor bound [-30, 30] x [-30, 30] x [0, 60])
const maxLorenzZ = Math.max(...lorenzStandard.trajectory.map(pt => pt[2]));
const minLorenzZ = Math.min(...lorenzStandard.trajectory.map(pt => pt[2]));
assert(minLorenzZ >= 0 && maxLorenzZ <= 60, 'Lorenz attractor z-coordinate stays within physical bound [0, 60] (got [' + minLorenzZ.toFixed(2) + ', ' + maxLorenzZ.toFixed(2) + '])');

// High-chaos Lorenz (rho = 100)
const lorenzExtreme = solveODE_RK4({
  system: 'lorenz',
  params: { sigma: 10, rho: 100, beta: 8/3 },
  initialState: [1, 1, 1],
  tSpan: [0, 10],
  dt: 0.005,
});
const hasNaNExtreme = lorenzExtreme.trajectory.some(pt => pt.some(v => isNaN(v) || !isFinite(v)));
assert(!hasNaNExtreme, 'Lorenz at high Rayleigh number rho=100 with dt=0.005 computes stable trajectory without NaN');

// 2.2 Lotka-Volterra: Predator-Prey First Integral / First Constant of Motion
console.log('\n[2.2] Lotka-Volterra Conservative Invariant Test:');
// Conserved quantity: V(x, y) = delta * x - gamma * ln(x) + beta * y - alpha * ln(y)
const lvAlpha = 1.5, lvBeta = 0.5, lvDelta = 0.2, lvGamma = 0.6;
const lvInit = [10.0, 5.0, 0.0];
const lvSim = solveODE_RK4({
  system: 'lotka_volterra',
  params: { alpha: lvAlpha, beta: lvBeta, delta: lvDelta, gamma: lvGamma },
  initialState: lvInit,
  tSpan: [0, 20],
  dt: 0.002,
});

const V = (x: number, y: number) => lvDelta * x - lvGamma * Math.log(x) + lvBeta * y - lvAlpha * Math.log(y);
const V0 = V(lvInit[0], lvInit[1]);
let maxVDiff = 0;
for (const [x, y] of lvSim.trajectory) {
  if (x <= 0 || y <= 0) continue;
  const diff = Math.abs(V(x, y) - V0);
  if (diff > maxVDiff) maxVDiff = diff;
}
assert(maxVDiff < 1e-2, 'Lotka-Volterra conserved first integral V(x,y) drift < 1e-2 over 10,000 RK4 steps (drift: ' + maxVDiff.toExponential(3) + ')');

// 2.3 Van der Pol Oscillator: Limit Cycle & Stiffness
console.log('\n[2.3] Van der Pol Limit Cycle & Stiffness:');
// Mild non-linearity (mu = 1.0)
const vdpMild = solveODE_RK4({
  system: 'van_der_pol',
  params: { mu: 1.0 },
  initialState: [0.2, 0.2, 0],
  tSpan: [0, 30],
  dt: 0.01,
});
assert(!vdpMild.trajectory.some(pt => pt.some(v => isNaN(v) || !isFinite(v))), 'Van der Pol (mu=1.0) integrates smoothly');

// Stiff parameter (mu = 5.0) with fine step dt = 0.002
const vdpStiff = solveODE_RK4({
  system: 'van_der_pol',
  params: { mu: 5.0 },
  initialState: [2.0, 0.0, 0],
  tSpan: [0, 20],
  dt: 0.002,
});
assert(!vdpStiff.trajectory.some(pt => pt.some(v => isNaN(v) || !isFinite(v))), 'Stiff Van der Pol (mu=5.0) with dt=0.002 stably computes relaxation oscillations');

// Check limit cycle amplitude approaches ~2.0
const lastVdpCycle = vdpStiff.trajectory.slice(-2000);
const maxVdpX = Math.max(...lastVdpCycle.map(pt => Math.abs(pt[0])));
assert(Math.abs(maxVdpX - 2.0) < 0.2, 'Van der Pol limit cycle amplitude is approx 2.0 (got ' + maxVdpX.toFixed(3) + ')');

// 2.4 SIR Epidemic Invariant: Total Population N = S + I + R Conservation
console.log('\n[2.4] SIR Model Total Population Conservation:');
const sirSim = solveODE_RK4({
  system: 'sir',
  params: { beta: 0.5, gamma: 0.1 },
  initialState: [990, 10, 0],
  tSpan: [0, 50],
  dt: 0.05,
});
let maxSIRPopDiff = 0;
for (const [S, I, R] of sirSim.trajectory) {
  const totalPop = S + I + R;
  const diff = Math.abs(totalPop - 1000);
  if (diff > maxSIRPopDiff) maxSIRPopDiff = diff;
}
assert(maxSIRPopDiff < 1e-4, 'SIR model strictly preserves total population N = S + I + R = 1000 across all time steps (max drift: ' + maxSIRPopDiff.toExponential(3) + ')');

// 2.5 Rössler Attractor
console.log('\n[2.5] Rössler Attractor:');
const rosslerSim = solveODE_RK4({
  system: 'rossler',
  params: { a: 0.2, b: 0.2, c: 5.7 },
  initialState: [1, 1, 1],
  tSpan: [0, 30],
  dt: 0.01,
});
assert(!rosslerSim.trajectory.some(pt => pt.some(v => isNaN(v) || !isFinite(v))), 'Rössler attractor generates valid non-NaN trajectory');

// =========================================================================
// SUITE 3: 3D Parametric Surface Mesh Generator Across All Geometries
// =========================================================================
console.log('\n--- SUITE 3: 3D Parametric Surface Mesh Generator Stress Testing ---');

const surfaceTypes: ParametricSurfaceType[] = [
  'mobius',
  'torus',
  'hyperbolic_paraboloid',
  'monkey_saddle',
  'catenoid',
  'helicoid',
  'enneper',
  'riemann_sphere',
];

for (const sType of surfaceTypes) {
  console.log('\nTesting surface: [' + sType + ']');
  
  // Standard mesh generation (32 x 32)
  const mesh = generateParametricSurfaceMesh(sType, 32, 32);
  
  // 1. Check vertex count
  const expectedVertices = (32 + 1) * (32 + 1); // 33 * 33 = 1089
  assert(mesh.vertices.length === expectedVertices, sType + ': vertex count must equal (uSteps+1)*(vSteps+1) = ' + expectedVertices + ' (got ' + mesh.vertices.length + ')');
  
  // 2. Check face count
  const expectedFaces = 32 * 32; // 1024
  assert(mesh.faces.length === expectedFaces, sType + ': face count must equal uSteps*vSteps = ' + expectedFaces + ' (got ' + mesh.faces.length + ')');
  
  // 3. Check for any NaN or Infinite coordinates
  let hasNaNVertex = false;
  for (let idx = 0; idx < mesh.vertices.length; idx++) {
    const v = mesh.vertices[idx];
    if (isNaN(v.x) || !isFinite(v.x) ||
        isNaN(v.y) || !isFinite(v.y) ||
        isNaN(v.z) || !isFinite(v.z) ||
        isNaN(v.u) || !isFinite(v.u) ||
        isNaN(v.v) || !isFinite(v.v)) {
      hasNaNVertex = true;
      break;
    }
  }
  assert(!hasNaNVertex, sType + ': all vertices contain valid finite real coordinates');
  
  // 4. Check face index validity
  let faceIndicesValid = true;
  for (const f of mesh.faces) {
    if (f.indices.length !== 4) {
      faceIndicesValid = false;
      break;
    }
    for (const idx of f.indices) {
      if (idx < 0 || idx >= mesh.vertices.length || !Number.isInteger(idx)) {
        faceIndicesValid = false;
        break;
      }
    }
  }
  assert(faceIndicesValid, sType + ': all quad faces reference valid vertex indices in [0, ' + (mesh.vertices.length - 1) + ']');
  
  // 5. Bounding box validity
  const b = mesh.bounds;
  const boundsValid = isFinite(b.minX) && isFinite(b.maxX) && b.minX <= b.maxX &&
                      isFinite(b.minY) && isFinite(b.maxY) && b.minY <= b.maxY &&
                      isFinite(b.minZ) && isFinite(b.maxZ) && b.minZ <= b.maxZ;
  assert(boundsValid, sType + ': bounding box is valid and well-ordered: [' + b.minX.toFixed(2) + ', ' + b.maxX.toFixed(2) + '] x [' + b.minY.toFixed(2) + ', ' + b.maxY.toFixed(2) + '] x [' + b.minZ.toFixed(2) + ', ' + b.maxZ.toFixed(2) + ']');
  
  // Verify bounding box encompasses all vertices
  let boundsEncompassAll = true;
  for (const v of mesh.vertices) {
    if (v.x < b.minX - 1e-6 || v.x > b.maxX + 1e-6 ||
        v.y < b.minY - 1e-6 || v.y > b.maxY + 1e-6 ||
        v.z < b.minZ - 1e-6 || v.z > b.maxZ + 1e-6) {
      boundsEncompassAll = false;
      break;
    }
  }
  assert(boundsEncompassAll, sType + ': bounding box strictly encloses all mesh vertices');
  
  // 6. High resolution stress test (64 x 64 = 4096 quads, 4225 vertices)
  const hiMesh = generateParametricSurfaceMesh(sType, 64, 64);
  assert(hiMesh.vertices.length === 4225 && hiMesh.faces.length === 4096, sType + ': 64x64 high-resolution mesh generates successfully');
  
  // 7. Minimal resolution boundary (2 x 2)
  const lowMesh = generateParametricSurfaceMesh(sType, 2, 2);
  assert(lowMesh.vertices.length === 9 && lowMesh.faces.length === 4, sType + ': 2x2 low-resolution boundary mesh generates successfully');
}

// =========================================================================
// SUITE 4: Complex Domain & Matrix Edge Case Resilience
// =========================================================================
console.log('\n--- SUITE 4: Complex Domain & Matrix Edge Case Resilience ---');

// 4.1 Singular & Defective Matrices
console.log('\n[4.1] Matrix Analysis on Singular & Edge Matrices:');
const singularMat = analyzeMatrix([
  [0, 0],
  [0, 0],
]);
assert(singularMat.determinant === 0 && singularMat.rank === 0 && singularMat.inverse === undefined, 'Zero matrix has det=0, rank=0, inverse=undefined');

const identity3 = analyzeMatrix([
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1],
]);
assert(Math.abs(identity3.determinant - 1) < 1e-5 && identity3.rank === 3 && identity3.inverse !== undefined, '3x3 Identity matrix has det=1, rank=3, valid inverse');

// Gram-Schmidt on linearly dependent set
const depVectors = [
  [1, 0, 0],
  [2, 0, 0], // linearly dependent on first
  [0, 1, 0],
];
const depGS = gramSchmidt(depVectors);
assert(depGS.orthonormal.length === 3, 'Gram Schmidt handles linearly dependent vector sets gracefully');

// 4.2 Complex Analysis: Branch cuts & Möbius Transformations
console.log('\n[4.2] Complex Function Evaluation & Branch Cut Discontinuities:');
const mobiusInf = evaluateComplexFunction('mobius', -1, 0); // pole at z = -1
assert(isFinite(mobiusInf.modulus), 'Möbius transformation handles pole z=-1 without crashing or throwing NaN');

const logNeg = evaluateComplexFunction('log', -2, 0);
assert(logNeg.isDiscontinuity === true && Math.abs(logNeg.v - Math.PI) < 1e-4, 'Complex logarithm on negative real axis detects branch cut with argument pi');

// =========================================================================
// SUMMARY OF CHALLENGE RESULTS
// =========================================================================
console.log('\n========================================================');
console.log('ADVERSARIAL TEST SUMMARY: ' + stats.passed + ' passed, ' + stats.failed + ' failed (Total: ' + stats.total + ')');
console.log('========================================================');

if (stats.failed > 0) {
  console.error('\nDETECTED ' + stats.failed + ' ADVERSARIAL FAILURES:');
  stats.failures.forEach(f => console.error(f));
  process.exit(1);
} else {
  console.log('\nALL ADVERSARIAL STRESS TESTS PASSED WITH 100% SUCCESS!');
}
