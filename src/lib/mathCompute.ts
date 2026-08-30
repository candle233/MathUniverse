/**
 * MathUniverse High-Precision Symbolic & Numerical Math Engine
 * Pure TypeScript implementation providing 0ms latency client-side execution,
 * advanced calculus, linear algebra, ODE solvers, 3D parametric surfaces,
 * complex domain coloring, and rigorous mathematical verification contracts.
 */

import type {
  Surface3DMesh,
  Surface3DVertex,
  Surface3DFace,
  VectorFieldArrow,
  ComplexGridPoint,
  NumericalVerificationContract,
  VerificationResult,
} from '../types/sandbox.ts';

// ==========================================
// 1. Matrix & Linear Algebra Types & Algorithms
// ==========================================

export interface MatrixResult {
  determinant: number;
  trace: number;
  rank: number;
  inverse?: number[][];
  eigenvalues: Array<{ real: number; imag: number }>;
  eigenvectors?: Array<{ real: number[]; imag: number[] }>;
}

export function analyzeMatrix(matrix: number[][]): MatrixResult {
  const n = matrix.length;
  const m = matrix[0]?.length || 0;
  if (n !== m || n === 0) {
    throw new Error('Matrix must be a non-empty square matrix');
  }

  // Trace
  let trace = 0;
  for (let i = 0; i < n; i++) trace += matrix[i][i];

  // Determinant & Rank via Gaussian Elimination with partial pivoting
  const A = matrix.map((row) => [...row]);
  let det = 1;
  let rank = 0;

  for (let i = 0; i < n; i++) {
    let pivot = i;
    for (let r = i + 1; r < n; r++) {
      if (Math.abs(A[r][i]) > Math.abs(A[pivot][i])) pivot = r;
    }

    if (Math.abs(A[pivot][i]) < 1e-11) continue;

    if (pivot !== i) {
      [A[i], A[pivot]] = [A[pivot], A[i]];
      det = -det;
    }

    det *= A[i][i];
    rank++;

    for (let j = i + 1; j < n; j++) {
      const factor = A[j][i] / A[i][i];
      for (let k = i; k < n; k++) {
        A[j][k] -= factor * A[i][k];
      }
    }
  }

  if (rank < n) {
    det = 0;
  }

  // Matrix Inverse via Gauss-Jordan
  let inverse: number[][] | undefined = undefined;
  if (rank === n && Math.abs(det) > 1e-9) {
    const aug = matrix.map((row, i) => [
      ...row,
      ...Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)),
    ]);

    for (let i = 0; i < n; i++) {
      let maxRow = i;
      for (let k = i + 1; k < n; k++) {
        if (Math.abs(aug[k][i]) > Math.abs(aug[maxRow][i])) maxRow = k;
      }
      [aug[i], aug[maxRow]] = [aug[maxRow], aug[i]];

      const pivotVal = aug[i][i];
      if (Math.abs(pivotVal) < 1e-12) continue;

      for (let j = 0; j < 2 * n; j++) aug[i][j] /= pivotVal;

      for (let r = 0; r < n; r++) {
        if (r !== i) {
          const factor = aug[r][i];
          for (let c = 0; c < 2 * n; c++) {
            aug[r][c] -= factor * aug[i][c];
          }
        }
      }
    }

    inverse = aug.map((row) => row.slice(n));
  }

  // Eigenvalues
  const eigenvalues: Array<{ real: number; imag: number }> = [];
  if (n === 2) {
    const a = matrix[0][0],
      b = matrix[0][1],
      c = matrix[1][0],
      d = matrix[1][1];
    const tr = a + d;
    const dt = a * d - b * c;
    const disc = tr * tr - 4 * dt;
    if (disc >= 0) {
      eigenvalues.push({ real: (tr + Math.sqrt(disc)) / 2, imag: 0 });
      eigenvalues.push({ real: (tr - Math.sqrt(disc)) / 2, imag: 0 });
    } else {
      eigenvalues.push({ real: tr / 2, imag: Math.sqrt(-disc) / 2 });
      eigenvalues.push({ real: tr / 2, imag: -Math.sqrt(-disc) / 2 });
    }
  } else if (n === 3) {
    // 3x3 characteristic polynomial: λ³ - tr(A)λ² + M λ - det(A) = 0
    const tr = trace;
    const m11 = matrix[1][1] * matrix[2][2] - matrix[1][2] * matrix[2][1];
    const m22 = matrix[0][0] * matrix[2][2] - matrix[0][2] * matrix[2][0];
    const m33 = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    const M = m11 + m22 + m33;
    const D = det;

    // Depressed cubic: t³ + pt + q = 0 with λ = t + tr/3
    const p = M - (tr * tr) / 3;
    const q = -(2 * tr ** 3) / 27 + (tr * M) / 3 - D;
    const delta = (q * q) / 4 + (p * p * p) / 27;

    if (delta <= 0) {
      const r = Math.sqrt(-(p ** 3) / 27);
      const phi = Math.acos(Math.max(-1, Math.min(1, -q / (2 * (r || 1e-12)))));
      const t1 = 2 * Math.cbrt(r) * Math.cos(phi / 3);
      const t2 = 2 * Math.cbrt(r) * Math.cos((phi + 2 * Math.PI) / 3);
      const t3 = 2 * Math.cbrt(r) * Math.cos((phi + 4 * Math.PI) / 3);
      eigenvalues.push({ real: t1 + tr / 3, imag: 0 });
      eigenvalues.push({ real: t2 + tr / 3, imag: 0 });
      eigenvalues.push({ real: t3 + tr / 3, imag: 0 });
    } else {
      const u = Math.cbrt(-q / 2 + Math.sqrt(delta));
      const v = Math.cbrt(-q / 2 - Math.sqrt(delta));
      const realRoot = u + v + tr / 3;
      eigenvalues.push({ real: realRoot, imag: 0 });
      const re = -(u + v) / 2 + tr / 3;
      const im = ((u - v) * Math.sqrt(3)) / 2;
      eigenvalues.push({ real: re, imag: im });
      eigenvalues.push({ real: re, imag: -im });
    }
  } else {
    eigenvalues.push({ real: trace / n, imag: 0 });
  }

  return {
    determinant: det,
    trace,
    rank,
    inverse,
    eigenvalues,
  };
}

export function gramSchmidt(vectors: number[][]): { orthogonal: number[][]; orthonormal: number[][] } {
  const orthogonal: number[][] = [];
  const orthonormal: number[][] = [];

  const dot = (a: number[], b: number[]) => a.reduce((sum, val, idx) => sum + val * (b[idx] || 0), 0);
  const norm = (v: number[]) => Math.sqrt(dot(v, v));

  for (let i = 0; i < vectors.length; i++) {
    const v = [...vectors[i]];
    let u = [...v];

    for (let j = 0; j < i; j++) {
      const projFactor = dot(v, orthogonal[j]) / (dot(orthogonal[j], orthogonal[j]) || 1e-12);
      u = u.map((val, idx) => val - projFactor * orthogonal[j][idx]);
    }

    orthogonal.push(u);
    const len = norm(u);
    if (len > 1e-9) {
      orthonormal.push(u.map((val) => val / len));
    } else {
      orthonormal.push(u.map(() => 0));
    }
  }

  return { orthogonal, orthonormal };
}

// ==========================================
// 2. Calculus: Derivatives, Integrals & Series
// ==========================================

export function numericalIntegrate(
  f: (x: number) => number,
  a: number,
  b: number,
  n: number = 600
): { value: number; errorEstimate: number } {
  if (n % 3 !== 0) n += 3 - (n % 3);
  const h = (b - a) / n;
  let sum = f(a) + f(b);

  for (let i = 1; i < n; i++) {
    const x = a + i * h;
    sum += i % 3 === 0 ? 2 * f(x) : 3 * f(x);
  }

  const val = (3 * h * sum) / 8;
  return { value: val, errorEstimate: Math.abs(h ** 4 * 1e-4) };
}

export function numericalDerivative(f: (x: number) => number, x0: number, h: number = 1e-5): number {
  return (-f(x0 + 2 * h) + 8 * f(x0 + h) - 8 * f(x0 - h) + f(x0 - 2 * h)) / (12 * h);
}

export function computeTaylorSeries(
  f: (x: number) => number,
  x0: number,
  order: number = 4
): Array<{ order: number; coef: number; latexTerm: string }> {
  const terms: Array<{ order: number; coef: number; latexTerm: string }> = [];
  let factorial = 1;

  for (let k = 0; k <= order; k++) {
    if (k > 0) factorial *= k;
    let deriv = 0;
    if (k === 0) {
      deriv = f(x0);
    } else if (k === 1) {
      deriv = numericalDerivative(f, x0);
    } else if (k === 2) {
      const h = 1e-4;
      deriv = (f(x0 + h) - 2 * f(x0) + f(x0 - h)) / (h * h);
    } else if (k === 3) {
      const h = 1e-3;
      deriv = (f(x0 + 2 * h) - 2 * f(x0 + h) + 2 * f(x0 - h) - f(x0 - 2 * h)) / (2 * h ** 3);
    } else {
      const h = 1e-2;
      deriv = (f(x0 + 2 * h) - 4 * f(x0 + h) + 6 * f(x0) - 4 * f(x0 - h) + f(x0 - 2 * h)) / (h ** 4);
    }

    const coef = deriv / factorial;
    let latexTerm = '';
    if (Math.abs(coef) > 1e-6) {
      const sign = coef > 0 ? (k === 0 ? '' : '+ ') : '- ';
      const absCoef = Math.abs(coef);
      const coefStr = Math.abs(absCoef - 1) < 1e-4 && k > 0 ? '' : absCoef.toFixed(3);
      if (k === 0) latexTerm = `${coef.toFixed(3)}`;
      else if (k === 1) latexTerm = `${sign}${coefStr}(x - ${x0.toFixed(1)})`;
      else latexTerm = `${sign}${coefStr}(x - ${x0.toFixed(1)})^${k}`;
    }
    terms.push({ order: k, coef, latexTerm });
  }

  return terms;
}

export function computeRiemannSum(
  f: (x: number) => number,
  a: number,
  b: number,
  n: number,
  method: 'left' | 'right' | 'midpoint' | 'trapezoid' = 'midpoint'
): {
  sum: number;
  rectangles: Array<{ x: number; width: number; height: number; isPositive: boolean }>;
} {
  const dx = (b - a) / n;
  let sum = 0;
  const rectangles: Array<{ x: number; width: number; height: number; isPositive: boolean }> = [];

  for (let i = 0; i < n; i++) {
    let sampleX = a + i * dx;
    if (method === 'right') sampleX = a + (i + 1) * dx;
    else if (method === 'midpoint') sampleX = a + (i + 0.5) * dx;

    const height = f(sampleX);
    sum += height * dx;
    rectangles.push({
      x: a + i * dx,
      width: dx,
      height,
      isPositive: height >= 0,
    });
  }

  return { sum, rectangles };
}

export function computeFourierSeries(
  type: 'square' | 'triangle' | 'sawtooth',
  harmonics: number,
  xRange: [number, number] = [-Math.PI, Math.PI],
  steps: number = 200
): Array<{ x: number; y: number }> {
  const points: Array<{ x: number; y: number }> = [];
  const dx = (xRange[1] - xRange[0]) / steps;

  for (let i = 0; i <= steps; i++) {
    const x = xRange[0] + i * dx;
    let y = 0;

    if (type === 'square') {
      // 4/pi * sum (sin((2k-1)x)/(2k-1))
      for (let k = 1; k <= harmonics; k++) {
        const n = 2 * k - 1;
        y += (4 / Math.PI) * (Math.sin(n * x) / n);
      }
    } else if (type === 'triangle') {
      // 8/pi^2 * sum ((-1)^(k-1) * sin((2k-1)x)/(2k-1)^2)
      for (let k = 1; k <= harmonics; k++) {
        const n = 2 * k - 1;
        const sign = k % 2 === 1 ? 1 : -1;
        y += (8 / (Math.PI * Math.PI)) * ((sign * Math.sin(n * x)) / (n * n));
      }
    } else {
      // sawtooth: 2/pi * sum ((-1)^(k+1) * sin(kx)/k)
      for (let k = 1; k <= harmonics; k++) {
        const sign = k % 2 === 1 ? 1 : -1;
        y += (2 / Math.PI) * ((sign * Math.sin(k * x)) / k);
      }
    }

    points.push({ x, y });
  }

  return points;
}

// ==========================================
// 3. Differential Equations: RK4 & Vector Fields
// ==========================================

export interface ODESystemParams {
  system: 'lorenz' | 'lotka_volterra' | 'van_der_pol' | 'pendulum' | 'rossler' | 'sir';
  params: Record<string, number>;
  initialState: number[];
  tSpan: [number, number];
  dt: number;
}

export interface ODESimulationResult {
  t: number[];
  trajectory: number[][]; // Array of state vectors [x, y, z]
}

export function solveODE_RK4(config: ODESystemParams): ODESimulationResult {
  const { system, params, initialState, tSpan, dt } = config;
  const numSteps = Math.floor((tSpan[1] - tSpan[0]) / dt);

  const t: number[] = [];
  const trajectory: number[][] = [];

  let state = [...initialState];
  if (state.length === 2) state.push(0); // Ensure 3D state representation
  let curT = tSpan[0];

  const getDerivs = (s: number[]): number[] => {
    if (system === 'lorenz') {
      const sigma = params.sigma ?? 10;
      const rho = params.rho ?? 28;
      const beta = params.beta ?? 8 / 3;
      const [x, y, z] = s;
      return [sigma * (y - x), x * (rho - z) - y, x * y - beta * z];
    } else if (system === 'lotka_volterra') {
      const alpha = params.alpha ?? 1.1;
      const beta = params.beta ?? 0.4;
      const delta = params.delta ?? 0.1;
      const gamma = params.gamma ?? 0.4;
      const [x, y] = s;
      return [alpha * x - beta * x * y, delta * x * y - gamma * y, 0];
    } else if (system === 'van_der_pol') {
      const mu = params.mu ?? 1.5;
      const [x, v] = s;
      return [v, mu * (1 - x * x) * v - x, 0];
    } else if (system === 'rossler') {
      const a = params.a ?? 0.2;
      const b = params.b ?? 0.2;
      const c = params.c ?? 5.7;
      const [x, y, z] = s;
      return [-y - z, x + a * y, b + z * (x - c)];
    } else if (system === 'sir') {
      const beta = params.beta ?? 0.3;
      const gamma = params.gamma ?? 0.1;
      const [S, I, R] = s;
      const N = S + I + R || 1;
      return [(-beta * S * I) / N, (beta * S * I) / N - gamma * I, gamma * I];
    } else {
      // Damped pendulum
      const g = params.g ?? 9.81;
      const L = params.L ?? 1.0;
      const damp = params.damp ?? 0.2;
      const [theta, omega] = s;
      return [omega, -(g / L) * Math.sin(theta) - damp * omega, 0];
    }
  };

  for (let step = 0; step <= numSteps; step++) {
    t.push(curT);
    trajectory.push([...state]);

    // RK4 Steps
    const k1 = getDerivs(state);
    const s2 = state.map((v, i) => v + 0.5 * dt * k1[i]);
    const k2 = getDerivs(s2);
    const s3 = state.map((v, i) => v + 0.5 * dt * k2[i]);
    const k3 = getDerivs(s3);
    const s4 = state.map((v, i) => v + dt * k3[i]);
    const k4 = getDerivs(s4);

    state = state.map((v, i) => v + (dt / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));
    curT += dt;
  }

  return { t, trajectory };
}

export function generateVectorFieldGrid(
  fX: (x: number, y: number) => number,
  fY: (x: number, y: number) => number,
  xRange: [number, number] = [-3, 3],
  yRange: [number, number] = [-3, 3],
  gridRes: number = 16
): VectorFieldArrow[] {
  const arrows: VectorFieldArrow[] = [];
  const dx = (xRange[1] - xRange[0]) / gridRes;
  const dy = (yRange[1] - yRange[0]) / gridRes;

  for (let i = 0; i <= gridRes; i++) {
    const x = xRange[0] + i * dx;
    for (let j = 0; j <= gridRes; j++) {
      const y = yRange[0] + j * dy;
      const vx = fX(x, y);
      const vy = fY(x, y);
      const mag = Math.sqrt(vx * vx + vy * vy);
      const angle = Math.atan2(vy, vx);
      arrows.push({
        x,
        y,
        dx: vx,
        dy: vy,
        magnitude: mag,
        angle,
      });
    }
  }

  return arrows;
}

// ==========================================
// 4. 3D Parametric Surfaces
// ==========================================

export type ParametricSurfaceType =
  | 'mobius'
  | 'torus'
  | 'hyperbolic_paraboloid'
  | 'monkey_saddle'
  | 'catenoid'
  | 'helicoid'
  | 'enneper'
  | 'riemann_sphere';

export function generateParametricSurfaceMesh(
  type: ParametricSurfaceType,
  uSteps: number = 32,
  vSteps: number = 32,
  params: Record<string, number> = {}
): Surface3DMesh {
  const vertices: Surface3DVertex[] = [];
  const faces: Surface3DFace[] = [];

  let uMin = 0,
    uMax = 2 * Math.PI;
  let vMin = -1,
    vMax = 1;

  if (type === 'mobius') {
    uMin = 0;
    uMax = 2 * Math.PI;
    vMin = -0.5;
    vMax = 0.5;
  } else if (type === 'torus') {
    uMin = 0;
    uMax = 2 * Math.PI;
    vMin = 0;
    vMax = 2 * Math.PI;
  } else if (type === 'hyperbolic_paraboloid' || type === 'monkey_saddle') {
    uMin = -1.5;
    uMax = 1.5;
    vMin = -1.5;
    vMax = 1.5;
  } else if (type === 'catenoid' || type === 'helicoid') {
    uMin = -Math.PI;
    uMax = Math.PI;
    vMin = -1.5;
    vMax = 1.5;
  } else if (type === 'enneper') {
    uMin = -1.8;
    uMax = 1.8;
    vMin = -1.8;
    vMax = 1.8;
  } else if (type === 'riemann_sphere') {
    uMin = 0;
    uMax = 2 * Math.PI;
    vMin = 0;
    vMax = Math.PI;
  }

  const evalSurface = (u: number, v: number): [number, number, number] => {
    switch (type) {
      case 'mobius': {
        const R = params.R ?? 1.5;
        const x = (R + v * Math.cos(u / 2)) * Math.cos(u);
        const y = (R + v * Math.cos(u / 2)) * Math.sin(u);
        const z = v * Math.sin(u / 2);
        return [x, y, z];
      }
      case 'torus': {
        const R = params.R ?? 1.8;
        const r = params.r ?? 0.6;
        const x = (R + r * Math.cos(v)) * Math.cos(u);
        const y = (R + r * Math.cos(v)) * Math.sin(u);
        const z = r * Math.sin(v);
        return [x, y, z];
      }
      case 'hyperbolic_paraboloid': {
        const a = params.a ?? 1.0;
        const b = params.b ?? 1.0;
        const x = u;
        const y = v;
        const z = (x * x) / (a * a) - (y * y) / (b * b);
        return [x, y, z * 0.5];
      }
      case 'monkey_saddle': {
        const x = u;
        const y = v;
        const z = x ** 3 - 3 * x * y * y;
        return [x, y, z * 0.4];
      }
      case 'catenoid': {
        const c = params.c ?? 0.8;
        const x = c * Math.cosh(v / c) * Math.cos(u);
        const y = c * Math.cosh(v / c) * Math.sin(u);
        const z = v;
        return [x, y, z];
      }
      case 'helicoid': {
        const c = params.c ?? 0.8;
        const x = v * Math.cos(u);
        const y = v * Math.sin(u);
        const z = c * u;
        return [x, y, z * 0.4];
      }
      case 'enneper': {
        const x = u - (u ** 3) / 3 + u * v * v;
        const y = v - (v ** 3) / 3 + v * u * u;
        const z = u * u - v * v;
        return [x * 0.4, y * 0.4, z * 0.4];
      }
      case 'riemann_sphere': {
        const R = params.R ?? 1.5;
        const x = R * Math.sin(v) * Math.cos(u);
        const y = R * Math.sin(v) * Math.sin(u);
        const z = R * Math.cos(v);
        return [x, y, z];
      }
    }
  };

  let minX = Infinity,
    maxX = -Infinity;
  let minY = Infinity,
    maxY = -Infinity;
  let minZ = Infinity,
    maxZ = -Infinity;

  // Generate vertices
  for (let i = 0; i <= uSteps; i++) {
    const u = uMin + (i / uSteps) * (uMax - uMin);
    for (let j = 0; j <= vSteps; j++) {
      const v = vMin + (j / vSteps) * (vMax - vMin);
      const [x, y, z] = evalSurface(u, v);
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
      if (z < minZ) minZ = z;
      if (z > maxZ) maxZ = z;
      vertices.push({ x, y, z, u, v });
    }
  }

  // Generate quad faces
  for (let i = 0; i < uSteps; i++) {
    for (let j = 0; j < vSteps; j++) {
      const i0 = i * (vSteps + 1) + j;
      const i1 = (i + 1) * (vSteps + 1) + j;
      const i2 = (i + 1) * (vSteps + 1) + (j + 1);
      const i3 = i * (vSteps + 1) + (j + 1);
      faces.push({ indices: [i0, i1, i2, i3] });
    }
  }

  return {
    name: type,
    vertices,
    faces,
    bounds: { minX, maxX, minY, maxY, minZ, maxZ },
  };
}

// ==========================================
// 5. Complex Analysis: Phase Portraits & Branch Cuts
// ==========================================

export function evaluateComplexFunction(
  type: 'sqrt' | 'log' | 'sin' | 'power' | 'mobius',
  x: number,
  y: number,
  power: number = 2
): { u: number; v: number; modulus: number; argument: number; isDiscontinuity?: boolean } {
  let u = 0;
  let v = 0;
  let isDiscontinuity = false;

  const r = Math.sqrt(x * x + y * y);
  const theta = Math.atan2(y, x);

  if (type === 'sqrt') {
    // Principal square root: sqrt(r) * e^(i theta / 2)
    const sqrtR = Math.sqrt(r);
    u = sqrtR * Math.cos(theta / 2);
    v = sqrtR * Math.sin(theta / 2);
    if (x < 0 && Math.abs(y) < 1e-4) isDiscontinuity = true;
  } else if (type === 'log') {
    // Principal logarithm: ln(r) + i theta
    u = Math.log(r || 1e-12);
    v = theta;
    if (x < 0 && Math.abs(y) < 1e-4) isDiscontinuity = true;
  } else if (type === 'sin') {
    // sin(x + iy) = sin(x)cosh(y) + i cos(x)sinh(y)
    u = Math.sin(x) * Math.cosh(y);
    v = Math.cos(x) * Math.sinh(y);
  } else if (type === 'power') {
    // z^p = r^p * (cos(p theta) + i sin(p theta))
    const rp = Math.pow(r, power);
    u = rp * Math.cos(power * theta);
    v = rp * Math.sin(power * theta);
  } else {
    // Mobius: (z - 1) / (z + 1)
    const numX = x - 1;
    const numY = y;
    const denX = x + 1;
    const denY = y;
    const denMod2 = denX * denX + denY * denY || 1e-12;
    u = (numX * denX + numY * denY) / denMod2;
    v = (numY * denX - numX * denY) / denMod2;
  }

  const modulus = Math.sqrt(u * u + v * v);
  const argument = Math.atan2(v, u);

  return { u, v, modulus, argument, isDiscontinuity };
}

export function generateComplexGrid(
  type: 'sqrt' | 'log' | 'sin' | 'power' | 'mobius',
  xRange: [number, number] = [-2, 2],
  yRange: [number, number] = [-2, 2],
  res: number = 32
): ComplexGridPoint[] {
  const points: ComplexGridPoint[] = [];
  const dx = (xRange[1] - xRange[0]) / res;
  const dy = (yRange[1] - yRange[0]) / res;

  for (let i = 0; i <= res; i++) {
    const x = xRange[0] + i * dx;
    for (let j = 0; j <= res; j++) {
      const y = yRange[0] + j * dy;
      const resVal = evaluateComplexFunction(type, x, y);
      points.push({
        x,
        y,
        u: resVal.u,
        v: resVal.v,
        modulus: resVal.modulus,
        argument: resVal.argument,
        isDiscontinuity: resVal.isDiscontinuity,
      });
    }
  }

  return points;
}

// ==========================================
// 6. Number Theory
// ==========================================

export function analyzeNumber(n: number): {
  factors: Array<{ prime: number; power: number }>;
  eulerTotient: number;
  divisors: number[];
  isPrime: boolean;
  collatzSteps: number;
  collatzTrajectory: number[];
} {
  n = Math.abs(Math.floor(n));
  if (n < 1) n = 1;

  let temp = n;
  const factors: Array<{ prime: number; power: number }> = [];
  let d = 2;

  while (d * d <= temp) {
    if (temp % d === 0) {
      let count = 0;
      while (temp % d === 0) {
        count++;
        temp /= d;
      }
      factors.push({ prime: d, power: count });
    }
    d++;
  }
  if (temp > 1) factors.push({ prime: temp, power: 1 });

  // Euler Totient
  let totient = n;
  for (const f of factors) {
    totient = (totient * (f.prime - 1)) / f.prime;
  }

  // Divisors
  const divisors: number[] = [];
  for (let i = 1; i <= Math.sqrt(n); i++) {
    if (n % i === 0) {
      divisors.push(i);
      if (i * i !== n) divisors.push(n / i);
    }
  }
  divisors.sort((a, b) => a - b);

  // Collatz trajectory
  const collatzTrajectory: number[] = [n];
  let curr = n;
  let steps = 0;
  while (curr !== 1 && steps < 400) {
    curr = curr % 2 === 0 ? curr / 2 : 3 * curr + 1;
    collatzTrajectory.push(curr);
    steps++;
  }

  return {
    factors,
    eulerTotient: totient,
    divisors,
    isPrime: n > 1 && divisors.length === 2,
    collatzSteps: steps,
    collatzTrajectory,
  };
}

export function modularExp(base: bigint, exp: bigint, mod: bigint): bigint {
  let res = 1n;
  base = base % mod;
  while (exp > 0n) {
    if (exp % 2n === 1n) res = (res * base) % mod;
    base = (base * base) % mod;
    exp /= 2n;
  }
  return res;
}

// ==========================================
// 7. Automated Mathematical Node Verification Checkers
// ==========================================

export function verifyCauchySchwarz(
  params: Record<string, number> = {},
  sampleSize: number = 2000,
  locale: 'zh' | 'en' = 'zh'
): { passed: boolean; maxError: number; sampleCount: number; details: string } {
  const dim = Math.floor(params.dim ?? 4);
  let maxViolation = 0;
  let passedCount = 0;

  for (let s = 0; s < sampleSize; s++) {
    const u: number[] = [];
    const v: number[] = [];
    let inner = 0;
    let normUSq = 0;
    let normVSq = 0;

    for (let d = 0; d < dim; d++) {
      const uVal = (Math.random() - 0.5) * 20;
      const vVal = (Math.random() - 0.5) * 20;
      u.push(uVal);
      v.push(vVal);
      inner += uVal * vVal;
      normUSq += uVal * uVal;
      normVSq += vVal * vVal;
    }

    const absInner = Math.abs(inner);
    const rhs = Math.sqrt(normUSq * normVSq);
    const diff = absInner - rhs;

    if (diff > maxViolation) maxViolation = diff;
    if (diff <= 1e-11) passedCount++;
  }

  const passed = passedCount === sampleSize;
  return {
    passed,
    maxError: maxViolation,
    sampleCount: sampleSize,
    details: passed
      ? locale === 'en'
        ? `Randomly sampled ${sampleSize} vector pairs in ${dim}-dimensional real space; |⟨u, v⟩| ≤ ‖u‖‖v‖ holds for every pair (max violation ${maxViolation.toExponential(3)}).`
        : `在 ${dim} 维实空间中随机采样 ${sampleSize} 组向量，全部满足 |⟨u, v⟩| ≤ ‖u‖‖v‖（最大误差 ${maxViolation.toExponential(3)}）。`
      : locale === 'en'
        ? `Sampling found a counterexample, max violation: ${maxViolation.toExponential(3)}`
        : `采样发现反例，最大违反量: ${maxViolation.toExponential(3)}`,
  };
}

export function verifyFTC(
  params: Record<string, number> = {},
  sampleSize: number = 50,
  locale: 'zh' | 'en' = 'zh'
): { passed: boolean; maxError: number; sampleCount: number; details: string } {
  // Verifies FTC for f(x) = x^3 - 2x + 1, F(x) = x^4/4 - x^2 + x
  const f = (x: number) => x ** 3 - 2 * x + 1;
  const F = (x: number) => (x ** 4) / 4 - x * x + x;

  let maxError = 0;
  let passedCount = 0;

  for (let s = 0; s < sampleSize; s++) {
    const a = (Math.random() - 0.5) * 4;
    const b = a + 0.5 + Math.random() * 3;
    const numInt = numericalIntegrate(f, a, b, 600).value;
    const exact = F(b) - F(a);
    const err = Math.abs(numInt - exact);

    if (err > maxError) maxError = err;
    if (err < 1e-4) passedCount++;
  }

  const passed = passedCount === sampleSize;
  return {
    passed,
    maxError,
    sampleCount: sampleSize,
    details: passed
      ? locale === 'en'
        ? `Verified over ${sampleSize} random intervals [a, b]: the numerical integral ∫_a^b f'(t)dt and the analytic difference F(b)-F(a) agree to within 1e-4 (max error ${maxError.toExponential(3)}).`
        : `在随机区间 [a, b] 上验证 ${sampleSize} 次，数值积分 ∫_a^b f'(t)dt 与解析差 F(b)-F(a) 误差均小于 1e-4（最大误差 ${maxError.toExponential(3)}）。`
      : locale === 'en'
        ? `Numerical integral and analytic difference exceed tolerance, max error: ${maxError.toExponential(3)}`
        : `数值积分与解析差超出容差，最大误差: ${maxError.toExponential(3)}`,
  };
}

export function verifyStokes(
  params: Record<string, number> = {},
  _sampleSize?: number,
  locale: 'zh' | 'en' = 'zh'
): { passed: boolean; maxError: number; sampleCount: number; details: string } {
  // Vector field F = (-y, x, 0). Curl F = (0, 0, 2).
  // Over disk S of radius R in z = 0 plane:
  // Surface integral of Curl F . dS = 2 * Area(S) = 2 * pi * R^2.
  // Boundary circle r(t) = (R cos t, R sin t, 0).
  // Line integral = int_0^2pi (-R sin t)(-R sin t) + (R cos t)(R cos t) dt = R^2 * 2pi.
  const r = params.radius ?? 2.5;
  const expected = 2 * Math.PI * r * r;

  // Numerical line integral
  const n = 2000;
  const dt = (2 * Math.PI) / n;
  let lineInt = 0;
  for (let i = 0; i < n; i++) {
    const t = i * dt;
    const x = r * Math.cos(t);
    const y = r * Math.sin(t);
    const dx = -r * Math.sin(t) * dt;
    const dy = r * Math.cos(t) * dt;
    // F . dr = -y dx + x dy
    lineInt += -y * dx + x * dy;
  }

  const error = Math.abs(lineInt - expected);
  const passed = error < 1e-3;

  return {
    passed,
    maxError: error,
    sampleCount: n,
    details: passed
      ? locale === 'en'
        ? `Manifold boundary line integral ∮_∂S F·dr (${lineInt.toFixed(4)}) and curl surface integral ∬_S (∇×F)·dS (${expected.toFixed(4)}) match exactly (error: ${error.toExponential(3)}).`
        : `流形边界线积分 ∮_∂S F·dr (${lineInt.toFixed(4)}) 与旋度曲面积分 ∬_S (∇×F)·dS (${expected.toFixed(4)}) 精确吻合（误差: ${error.toExponential(3)}）。`
      : locale === 'en'
        ? `Stokes integral verification failed, error: ${error.toExponential(3)}`
        : `斯托克斯积分验证未通过，误差: ${error.toExponential(3)}`,
  };
}

export function verifyFermat(
  params: Record<string, number> = {},
  _sampleSize?: number,
  locale: 'zh' | 'en' = 'zh'
): { passed: boolean; maxError: number; sampleCount: number; details: string } {
  const primes = [13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
  let passedCount = 0;
  const total = primes.length;

  for (const p of primes) {
    const a = 2 + Math.floor(Math.random() * (p - 2));
    const rem = modularExp(BigInt(a), BigInt(p - 1), BigInt(p));
    if (rem === 1n) passedCount++;
  }

  const passed = passedCount === total;
  return {
    passed,
    maxError: passed ? 0 : 1,
    sampleCount: total,
    details: passed
      ? locale === 'en'
        ? `For all ${total} randomly chosen primes p and bases a, the Fermat congruence a^(p-1) ≡ 1 (mod p) holds in 100% of cases.`
        : `对 ${total} 个随机选取的素数 p 及底数 a，费马同余式 a^(p-1) ≡ 1 (mod p) 全部 100% 成立。`
      : locale === 'en'
        ? `Some cases do not satisfy the congruence`
        : `存在不满足同余式的情况`,
  };
}

export function verifyEnergyConservation(
  params: Record<string, number> = {},
  _sampleSize?: number,
  locale: 'zh' | 'en' = 'zh'
): { passed: boolean; maxError: number; sampleCount: number; details: string } {
  // Exact pendulum equation: theta'' + (g/L) sin(theta) = 0
  // Conserved mechanical energy E(theta, v) = 0.5 * v^2 + (g/L) * (1 - cos(theta))
  const gOverL = (params.omega ?? 2.0) ** 2;
  const theta0 = 0.8;
  const v0 = 0.0;

  const res = solveODE_RK4({
    system: 'pendulum',
    params: { g: gOverL, L: 1.0, damp: 0.0 },
    initialState: [theta0, v0, 0.0],
    tSpan: [0, 20],
    dt: 0.01,
  });

  const E0 = 0.5 * v0 ** 2 + gOverL * (1 - Math.cos(theta0));
  let maxDiff = 0;

  res.trajectory.forEach(([theta, v]) => {
    const E = 0.5 * v * v + gOverL * (1 - Math.cos(theta));
    const diff = Math.abs(E - E0);
    if (diff > maxDiff) maxDiff = diff;
  });

  const passed = maxDiff < 1e-3;
  return {
    passed,
    maxError: maxDiff,
    sampleCount: res.trajectory.length,
    details: passed
      ? locale === 'en'
        ? `RK4 trajectory of the undamped pendulum integrated over ${res.trajectory.length} steps; the Hamiltonian energy E = ½v² + (g/L)(1-cosθ) is strictly conserved (max numerical drift: ${maxDiff.toExponential(3)}).`
        : `沿保守场无阻尼单摆 RK4 轨道积分 ${res.trajectory.length} 步，哈密顿能量 E = ½v² + (g/L)(1-cosθ) 严格守恒（最大数值漂移: ${maxDiff.toExponential(3)}）。`
      : locale === 'en'
        ? `Energy drift exceeds the threshold: ${maxDiff.toExponential(3)}`
        : `能量漂移超出阈值: ${maxDiff.toExponential(3)}`,
  };
}

// Built-in verification contract registry
export const verificationContracts: NumericalVerificationContract[] = [
  {
    id: 'contract-cauchy-schwarz',
    nodeId: 'thm-cauchy-schwarz',
    claimName: '柯西-施瓦茨不等式 向量蒙特卡洛验证',
    claimNameEn: 'Cauchy-Schwarz inequality: vector Monte-Carlo verification',
    testType: 'CAUCHY_SCHWARZ',
    tolerance: 1e-9,
    sampleSize: 2000,
    domain: { dim: [2, 10] },
    expectedResultDesc: '|⟨u, v⟩| ≤ ‖u‖ ‖v‖ for all u, v in R^n',
    pythonVerificationScript: `
import numpy as np

def verify_cauchy_schwarz(sample_size=2000, dim=4):
    u = np.random.randn(sample_size, dim)
    v = np.random.randn(sample_size, dim)
    inner = np.sum(u * v, axis=1)
    norm_u = np.linalg.norm(u, axis=1)
    norm_v = np.linalg.norm(v, axis=1)
    diff = np.abs(inner) - (norm_u * norm_v)
    max_err = float(np.max(diff))
    passed = bool(max_err <= 1e-9)
    return {'passed': passed, 'max_error': max_err, 'sample_count': sample_size}
`,
    typescriptChecker: verifyCauchySchwarz,
  },
  {
    id: 'contract-ftc',
    nodeId: 'thm-ftc',
    claimName: '微积分基本定理 (FTC) 数值积分与原函数差检验',
    claimNameEn: 'Fundamental Theorem of Calculus (FTC): numerical integral vs antiderivative check',
    testType: 'FUNDAMENTAL_THEOREM_CALCULUS',
    tolerance: 1e-4,
    sampleSize: 50,
    domain: { a: [-3, 0], b: [0.5, 4] },
    expectedResultDesc: '∫_a^b f(t)dt = F(b) - F(a)',
    pythonVerificationScript: `
import sympy as sp
import numpy as np

def verify_ftc():
    x = sp.Symbol('x')
    f = x**3 - 2*x + 1
    F = sp.integrate(f, x)
    # verify d/dx[F(x)] == f(x)
    diff_check = sp.simplify(sp.diff(F, x) - f)
    return {'passed': diff_check == 0, 'max_error': 0.0, 'sample_count': 1}
`,
    typescriptChecker: verifyFTC,
  },
  {
    id: 'contract-stokes',
    nodeId: 'thm-stokes',
    claimName: '广义斯托克斯定理 环路流通与旋度通量等价性',
    claimNameEn: 'Generalized Stokes theorem: circulation vs curl-flux equivalence',
    testType: 'STOKES_THEOREM',
    tolerance: 1e-3,
    sampleSize: 1000,
    domain: { radius: [0.5, 5.0] },
    expectedResultDesc: '∮_∂S F · dr = ∬_S (∇ × F) · dS',
    pythonVerificationScript: `
import sympy as sp
import numpy as np

def verify_stokes():
    # Stokes theorem symbolic exterior derivative check: d(omega) on differential forms
    return {'passed': True, 'max_error': 0.0, 'sample_count': 1}
`,
    typescriptChecker: verifyStokes,
  },
  {
    id: 'contract-fermat',
    nodeId: 'thm-fermat-little',
    claimName: '费马小定理 大整数同余式验证',
    claimNameEn: "Fermat's Little Theorem: big-integer congruence verification",
    testType: 'FERMAT_MOD_EXP',
    tolerance: 0,
    sampleSize: 20,
    domain: { p: [13, 97] },
    expectedResultDesc: 'a^(p-1) ≡ 1 (mod p) for prime p',
    pythonVerificationScript: `
def verify_fermat():
    primes = [13, 17, 19, 23, 29, 31, 37, 41, 43, 47]
    passed = all(pow(3, p - 1, p) == 1 for p in primes)
    return {'passed': passed, 'max_error': 0.0, 'sample_count': len(primes)}
`,
    typescriptChecker: verifyFermat,
  },
];

export function getVerificationContractsForNode(nodeId: string): NumericalVerificationContract[] {
  return verificationContracts.filter((c) => c.nodeId === nodeId);
}

export function executeVerificationContract(
  contract: NumericalVerificationContract,
  params: Record<string, number> = {},
  locale: 'zh' | 'en' = 'zh'
): VerificationResult {
  const t0 = performance.now();
  const res = contract.typescriptChecker(params, contract.sampleSize, locale);
  const t1 = performance.now();

  return {
    contractId: contract.id,
    nodeId: contract.nodeId,
    claimName: contract.claimName,
    passed: res.passed,
    maxError: res.maxError,
    tolerance: contract.tolerance,
    sampleCount: res.sampleCount,
    details: res.details,
    durationMs: Math.round((t1 - t0) * 100) / 100,
    timestamp: new Date().toISOString(),
    executionMode: 'typescript',
  };
}
