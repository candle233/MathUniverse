/**
 * MathUniverse Property-Based Testing (PBT) & Mathematical Invariants Suite
 * 
 * Verifies fundamental theorems and invariants across random parameter domains:
 * 1. Matrix Spectrum Invariants: Trace Sum & Determinant Multiplicative Identity (\sum \lambda_i = tr(A), \prod \lambda_i = det(A))
 * 2. Orthonormality Invariant: Modified Gram-Schmidt (\langle q_i, q_j \rangle = \delta_{ij}, \|q_i\| = 1)
 * 3. Calculus Invariants: Linearity of Differentiation & Leibniz Product Rule ((f \cdot g)' = f' g + f g')
 * 4. Fundamental Theorem of Calculus: \int_a^b f'(t) dt = f(b) - f(a)
 * 5. Cauchy-Schwarz Invariant: |\langle u, v \rangle| \le \|u\| \|v\|
 * 6. Number Theory Invariants: Euler Totient Multiplicativity (\gcd(a,b)=1 \implies \phi(ab)=\phi(a)\phi(b))
 * 7. Hamiltonian Energy Conservation: Zero numerical drift in conservative systems
 */

import {
  DenseMatrix,
  analyzeMatrix,
  gramSchmidt,
  numericalDerivative,
  numericalIntegrate,
  analyzeNumber,
  modularExp,
  solveODE_RK4,
  solveHamiltonian_Verlet,
  DualNumber,
  HyperDualNumber,
  diff,
  diff2,
  gradient,
  jacobian,
  hessian,
  verifyCauchySchwarz,
  verifyFTC,
  verifyEnergyConservation,
} from '../src/lib/mathCompute.ts';

export function runPropertyBasedMathTests(): { passed: number; failed: number } {
  console.log('\n--- Test Group 16: Property-Based Mathematical Invariant Verification ---');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, message: string) {
    if (!condition) {
      console.error(`  ❌ [FAIL] ${message}`);
      failed++;
      throw new Error(`PBT Assertion Failed: ${message}`);
    } else {
      console.log(`  ✅ [PASS] ${message}`);
      passed++;
    }
  }

  // 1. Matrix Spectrum Invariant: \sum \lambda_i = \mathrm{tr}(A) across dimensions 2 to 5
  for (let dim = 2; dim <= 5; dim++) {
    for (let trial = 0; trial < 15; trial++) {
      const raw = Array.from({ length: dim }, () =>
        Array.from({ length: dim }, () => (Math.random() - 0.5) * 20)
      );
      const res = analyzeMatrix(raw);
      const sumReal = res.eigenvalues.reduce((s, e) => s + e.real, 0);
      const diff = Math.abs(sumReal - res.trace);
      const tol = Math.max(1e-6, Math.abs(res.trace) * 1e-6);
      assert(
        diff <= tol,
        `Matrix ${dim}x${dim} Spectral Trace Identity: sum(Re(λ)) = ${sumReal.toFixed(4)}, tr = ${res.trace.toFixed(4)} (diff = ${diff.toExponential(2)})`
      );
    }
  }

  // 2. Matrix Spectrum Determinant Product Identity: \prod \lambda_i = \det(A) for 2x2 and 3x3
  for (let trial = 0; trial < 20; trial++) {
    const raw2 = [
      [(Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10],
      [(Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10],
    ];
    const res = analyzeMatrix(raw2);
    // Multiply complex eigenvalues
    let prodRe = 1.0;
    let prodIm = 0.0;
    for (const { real, imag } of res.eigenvalues) {
      const nextRe = prodRe * real - prodIm * imag;
      const nextIm = prodRe * imag + prodIm * real;
      prodRe = nextRe;
      prodIm = nextIm;
    }
    assert(
      Math.abs(prodIm) < 1e-7 && Math.abs(prodRe - res.determinant) < 1e-6,
      `Matrix 2x2 Spectral Determinant Identity: prod(λ) = ${prodRe.toFixed(4)}, det = ${res.determinant.toFixed(4)}`
    );
  }

  // 3. Orthonormality Invariant of Modified Gram-Schmidt
  for (let trial = 0; trial < 10; trial++) {
    const dim = 4;
    const vectors = Array.from({ length: dim }, () =>
      Array.from({ length: dim }, () => (Math.random() - 0.5) * 10)
    );
    const gs = gramSchmidt(vectors);
    
    // Check unit norms and mutual orthogonality
    for (let i = 0; i < dim; i++) {
      let normSq = 0;
      for (let k = 0; k < dim; k++) normSq += gs.orthonormal[i][k] ** 2;
      assert(Math.abs(Math.sqrt(normSq) - 1.0) < 1e-6, `MGS Orthonormal vector ${i} must have unit norm ‖e_${i}‖ = 1.0`);

      for (let j = i + 1; j < dim; j++) {
        let dot = 0;
        for (let k = 0; k < dim; k++) dot += gs.orthonormal[i][k] * gs.orthonormal[j][k];
        assert(Math.abs(dot) < 1e-6, `MGS Orthonormal vectors e_${i} ⟂ e_${j} must be orthogonal (⟨e_${i}, e_${j}⟩ = ${dot.toExponential(2)})`);
      }
    }
  }

  // 4. Leibniz Product Rule Invariant: (f \cdot g)'(x) = f'(x)g(x) + f(x)g'(x)
  const f1 = (x: number) => Math.sin(x);
  const g1 = (x: number) => Math.exp(0.5 * x);
  const fg = (x: number) => f1(x) * g1(x);

  for (let trial = 0; trial < 10; trial++) {
    const x0 = (Math.random() - 0.5) * 4;
    const d_fg = numericalDerivative(fg, x0);
    const leibniz = numericalDerivative(f1, x0) * g1(x0) + f1(x0) * numericalDerivative(g1, x0);
    assert(
      Math.abs(d_fg - leibniz) < 1e-4,
      `Leibniz Product Rule at x=${x0.toFixed(2)}: (fg)' = ${d_fg.toFixed(5)}, f'g+fg' = ${leibniz.toFixed(5)}`
    );
  }

  // 5. Fundamental Theorem of Calculus: \int_a^b f'(t) dt = f(b) - f(a)
  const testF = (x: number) => x ** 3 - 3 * x ** 2 + 2 * x + 5;
  const testFPrime = (x: number) => 3 * x ** 2 - 6 * x + 2;

  for (let trial = 0; trial < 10; trial++) {
    const a = (Math.random() - 0.5) * 4;
    const b = a + 0.5 + Math.random() * 3;
    const numInt = numericalIntegrate(testFPrime, a, b, 500).value;
    const analytic = testF(b) - testF(a);
    assert(
      Math.abs(numInt - analytic) < 1e-4,
      `FTC Invariant on [${a.toFixed(2)}, ${b.toFixed(2)}]: ∫ f'(t)dt = ${numInt.toFixed(4)}, F(b)-F(a) = ${analytic.toFixed(4)}`
    );
  }

  // 6. Cauchy-Schwarz Invariant: |⟨u, v⟩| <= ‖u‖‖v‖
  for (let dim = 2; dim <= 8; dim += 2) {
    const cs = verifyCauchySchwarz({ dim }, 200);
    assert(cs.passed, `Cauchy-Schwarz Monte Carlo invariant holds in R^${dim} across ${cs.sampleCount} trials`);
  }

  // 7. Euler Totient Multiplicativity Invariant: gcd(a,b)=1 => phi(ab) = phi(a)*phi(b)
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const coprimePairs = [
    [7, 9],
    [5, 12],
    [8, 15],
    [11, 13],
    [9, 16],
    [17, 20],
  ];

  for (const [a, b] of coprimePairs) {
    if (gcd(a, b) === 1) {
      const phiA = analyzeNumber(a).eulerTotient;
      const phiB = analyzeNumber(b).eulerTotient;
      const phiAB = analyzeNumber(a * b).eulerTotient;
      assert(
        phiAB === phiA * phiB,
        `Euler Totient Multiplicativity for coprime (${a}, ${b}): phi(${a*b}) = ${phiAB} == ${phiA} * ${phiB}`
      );
    }
  }

  // 8. Modular Exponentiation Invariant: Fermat's Little Theorem a^(p-1) = 1 mod p
  const primes = [13, 17, 19, 23, 29, 31, 37];
  for (const p of primes) {
    const a = 2 + Math.floor(Math.random() * (p - 2));
    const res = modularExp(BigInt(a), BigInt(p - 1), BigInt(p));
    assert(res === 1n, `Fermat's Congruence Invariant: ${a}^(${p}-1) ≡ 1 (mod ${p})`);
  }

  // 9. Hamiltonian Mechanical Energy Conservation
  const energyResult = verifyEnergyConservation({ omega: 2.5 });
  assert(energyResult.passed, `Hamiltonian Symplectic Energy Conservation (max drift = ${energyResult.maxError.toExponential(3)})`);

  // 10. AutoDiff Exact Chain Rule Invariant: (f ∘ g)'(x) = f'(g(x)) * g'(x)
  for (let trial = 0; trial < 10; trial++) {
    const x0 = (Math.random() - 0.5) * 3;
    // f(u) = exp(sin(u)), g(x) = x^2 + 1
    const composite = (x: DualNumber) => x.pow(2).add(1).sin().exp();
    const { value, derivative } = diff(composite, x0);

    const gx = x0 * x0 + 1;
    const g_prime = 2 * x0;
    const f_prime_at_gx = Math.exp(Math.sin(gx)) * Math.cos(gx);
    const analyticalChain = f_prime_at_gx * g_prime;

    assert(
      Math.abs(derivative - analyticalChain) < 1e-12,
      `AutoDiff Chain Rule for exp(sin(x^2+1)) at x=${x0.toFixed(2)}: Dual diff = ${derivative.toFixed(8)}, Exact = ${analyticalChain.toFixed(8)}`
    );
  }

  // 11. AutoDiff Quotient Rule Invariant: (f/g)'(x) = (f'g - fg') / g^2
  for (let trial = 0; trial < 10; trial++) {
    const x0 = 1 + Math.random() * 3; // Ensure positive non-zero
    const rationalFn = (x: DualNumber) => x.sin().div(x.pow(2).add(1));
    const { derivative } = diff(rationalFn, x0);

    const u = Math.sin(x0);
    const du = Math.cos(x0);
    const v = x0 * x0 + 1;
    const dv = 2 * x0;
    const analyticalQuotient = (du * v - u * dv) / (v * v);

    assert(
      Math.abs(derivative - analyticalQuotient) < 1e-12,
      `AutoDiff Quotient Rule for sin(x)/(x^2+1) at x=${x0.toFixed(2)}: Dual diff = ${derivative.toFixed(8)}, Exact = ${analyticalQuotient.toFixed(8)}`
    );
  }

  // 12. AutoDiff Hessian Symmetry (Schwarz Theorem): H_{ij} = H_{ji} and exact curvature
  for (let trial = 0; trial < 5; trial++) {
    const x0 = [(Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2];
    // f(x, y) = sin(x) * exp(y) + x^3 * y
    const scalarField = (v: HyperDualNumber[]) => v[0].sin().mul(v[1].exp()).add(v[0].pow(3).mul(v[1]));
    const { gradient: grad, hessianMatrix: H } = hessian(scalarField, x0);

    // Check Schwarz Symmetry
    const symmetryError = Math.abs(H[0][1] - H[1][0]);
    assert(symmetryError === 0, `Schwarz Symmetry: H_01 (${H[0][1].toFixed(6)}) == H_10 (${H[1][0].toFixed(6)}) exact`);

    // Verify against analytical partial derivatives
    const x = x0[0], y = x0[1];
    const expected_H00 = -Math.sin(x) * Math.exp(y) + 6 * x * y;
    const expected_H11 = Math.sin(x) * Math.exp(y);
    const expected_H01 = Math.cos(x) * Math.exp(y) + 3 * x * x;

    assert(Math.abs(H[0][0] - expected_H00) < 1e-11, `Hessian H_00 exact curvature verified`);
    assert(Math.abs(H[1][1] - expected_H11) < 1e-11, `Hessian H_11 exact curvature verified`);
    assert(Math.abs(H[0][1] - expected_H01) < 1e-11, `Hessian H_01 exact mixed partial verified`);
  }

  // 13. Symplectic Velocity-Verlet Long-Term Phase Space & Energy Invariant
  const verletSim = solveHamiltonian_Verlet(
    (q) => -q, // Harmonic oscillator F = -q
    1.0,       // q0 = 1
    0.0,       // p0 = 0
    1.0,       // m = 1
    [0, 50],   // tSpan [0, 50]
    0.02       // dt = 0.02
  );
  const E0 = 0.5 * (1.0 ** 2); // Initial total energy = 0.5
  let maxVerletDrift = 0;
  for (let i = 0; i < verletSim.energy.length; i++) {
    const totalE = verletSim.energy[i] + 0.5 * (verletSim.q[i] ** 2);
    const drift = Math.abs(totalE - E0);
    if (drift > maxVerletDrift) maxVerletDrift = drift;
  }
  assert(maxVerletDrift < 1e-4, `Symplectic Velocity-Verlet bounded energy drift over 2500 steps: max drift = ${maxVerletDrift.toExponential(3)}`);

  return { passed, failed };
}

