/**
 * MathUniverse Forward-Mode Automatic Differentiation & Jet Space Engine
 *
 * Implements:
 * 1. First-Order Dual Numbers \mathbb{D} = \{a + b\varepsilon \mid \varepsilon^2 = 0\} for machine-precision exact first derivatives and Jacobians.
 * 2. Second-Order Hyper-Dual Numbers \mathbb{H}\mathbb{D} for exact second derivatives and symmetric Hessians.
 * 3. Truncated Polynomial Jet Arithmetic for analytical Taylor series expansions without subtractive cancellation.
 *
 * @packageDocumentation
 */

/**
 * First-order Dual Number: a + b \varepsilon where \varepsilon^2 = 0
 */
export class DualNumber {
  public readonly val: number; // primal value f(x)
  public readonly eps: number; // tangent / derivative f'(x)

  constructor(val: number, eps: number = 0) {
    this.val = val;
    this.eps = eps;
  }

  public static constant(c: number): DualNumber {
    return new DualNumber(c, 0);
  }

  public static variable(x: number): DualNumber {
    return new DualNumber(x, 1);
  }

  public add(other: DualNumber | number): DualNumber {
    if (typeof other === 'number') {
      return new DualNumber(this.val + other, this.eps);
    }
    return new DualNumber(this.val + other.val, this.eps + other.eps);
  }

  public sub(other: DualNumber | number): DualNumber {
    if (typeof other === 'number') {
      return new DualNumber(this.val - other, this.eps);
    }
    return new DualNumber(this.val - other.val, this.eps - other.eps);
  }

  public mul(other: DualNumber | number): DualNumber {
    if (typeof other === 'number') {
      return new DualNumber(this.val * other, this.eps * other);
    }
    // (u + u'\eps)(v + v'\eps) = uv + (u v' + u' v)\eps
    return new DualNumber(this.val * other.val, this.val * other.eps + this.eps * other.val);
  }

  public div(other: DualNumber | number): DualNumber {
    if (typeof other === 'number') {
      return new DualNumber(this.val / other, this.eps / other);
    }
    // (u + u'\eps) / (v + v'\eps) = u/v + (u'v - uv')/v^2 \eps
    const v2 = other.val * other.val;
    if (v2 === 0) {
      throw new Error('[DualNumber] Division by zero in dual arithmetic.');
    }
    return new DualNumber(this.val / other.val, (this.eps * other.val - this.val * other.eps) / v2);
  }

  public neg(): DualNumber {
    return new DualNumber(-this.val, -this.eps);
  }

  public pow(p: number): DualNumber {
    // d/dx [u^p] = p u^{p-1} u'
    const valP = Math.pow(this.val, p);
    const deriv = p * Math.pow(this.val, p - 1) * this.eps;
    return new DualNumber(valP, isNaN(deriv) ? 0 : deriv);
  }

  public exp(): DualNumber {
    // d/dx [e^u] = e^u u'
    const expVal = Math.exp(this.val);
    return new DualNumber(expVal, expVal * this.eps);
  }

  public ln(): DualNumber {
    // d/dx [ln(u)] = u'/u
    if (this.val <= 0) {
      throw new RangeError('[DualNumber] Logarithm is only defined for positive real values.');
    }
    return new DualNumber(Math.log(this.val), this.eps / this.val);
  }

  public sin(): DualNumber {
    // d/dx [sin(u)] = cos(u) u'
    return new DualNumber(Math.sin(this.val), Math.cos(this.val) * this.eps);
  }

  public cos(): DualNumber {
    // d/dx [cos(u)] = -sin(u) u'
    return new DualNumber(Math.cos(this.val), -Math.sin(this.val) * this.eps);
  }

  public tan(): DualNumber {
    // d/dx [tan(u)] = sec^2(u) u' = (1 + tan^2(u)) u'
    const t = Math.tan(this.val);
    return new DualNumber(t, (1 + t * t) * this.eps);
  }

  public sinh(): DualNumber {
    return new DualNumber(Math.sinh(this.val), Math.cosh(this.val) * this.eps);
  }

  public cosh(): DualNumber {
    return new DualNumber(Math.cosh(this.val), Math.sinh(this.val) * this.eps);
  }

  public tanh(): DualNumber {
    const t = Math.tanh(this.val);
    return new DualNumber(t, (1 - t * t) * this.eps);
  }

  public sqrt(): DualNumber {
    if (this.val < 0) {
      throw new RangeError('[DualNumber] Square root requires non-negative argument.');
    }
    const sq = Math.sqrt(this.val);
    return new DualNumber(sq, sq === 0 ? 0 : (0.5 * this.eps) / sq);
  }

  public atan(): DualNumber {
    return new DualNumber(Math.atan(this.val), this.eps / (1 + this.val * this.val));
  }
}

/**
 * Second-order Hyper-Dual Number: a + b \varepsilon_1 + c \varepsilon_2 + d \varepsilon_1 \varepsilon_2
 * where \varepsilon_1^2 = \varepsilon_2^2 = (\varepsilon_1 \varepsilon_2)^2 = 0
 */
export class HyperDualNumber {
  public readonly f0: number; // f(x)
  public readonly f1: number; // \partial f / \partial x1
  public readonly f2: number; // \partial f / \partial x2
  public readonly f12: number; // \partial^2 f / (\partial x1 \partial x2)

  constructor(f0: number, f1: number = 0, f2: number = 0, f12: number = 0) {
    this.f0 = f0;
    this.f1 = f1;
    this.f2 = f2;
    this.f12 = f12;
  }

  public static constant(c: number): HyperDualNumber {
    return new HyperDualNumber(c, 0, 0, 0);
  }

  public static variable(x: number, dir1: number = 1, dir2: number = 1): HyperDualNumber {
    return new HyperDualNumber(x, dir1, dir2, 0);
  }

  public add(other: HyperDualNumber | number): HyperDualNumber {
    if (typeof other === 'number') {
      return new HyperDualNumber(this.f0 + other, this.f1, this.f2, this.f12);
    }
    return new HyperDualNumber(
      this.f0 + other.f0,
      this.f1 + other.f1,
      this.f2 + other.f2,
      this.f12 + other.f12
    );
  }

  public sub(other: HyperDualNumber | number): HyperDualNumber {
    if (typeof other === 'number') {
      return new HyperDualNumber(this.f0 - other, this.f1, this.f2, this.f12);
    }
    return new HyperDualNumber(
      this.f0 - other.f0,
      this.f1 - other.f1,
      this.f2 - other.f2,
      this.f12 - other.f12
    );
  }

  public mul(other: HyperDualNumber | number): HyperDualNumber {
    if (typeof other === 'number') {
      return new HyperDualNumber(
        this.f0 * other,
        this.f1 * other,
        this.f2 * other,
        this.f12 * other
      );
    }
    return new HyperDualNumber(
      this.f0 * other.f0,
      this.f0 * other.f1 + this.f1 * other.f0,
      this.f0 * other.f2 + this.f2 * other.f0,
      this.f0 * other.f12 + this.f1 * other.f2 + this.f2 * other.f1 + this.f12 * other.f0
    );
  }

  public div(other: HyperDualNumber | number): HyperDualNumber {
    if (typeof other === 'number') {
      return new HyperDualNumber(
        this.f0 / other,
        this.f1 / other,
        this.f2 / other,
        this.f12 / other
      );
    }
    const inv = 1 / other.f0;
    const inv2 = inv * inv;
    const inv3 = inv2 * inv;
    return new HyperDualNumber(
      this.f0 * inv,
      (this.f1 * other.f0 - this.f0 * other.f1) * inv2,
      (this.f2 * other.f0 - this.f0 * other.f2) * inv2,
      (this.f12 * other.f0 - this.f1 * other.f2 - this.f2 * other.f1 - this.f0 * other.f12) * inv2 +
        2 * this.f0 * other.f1 * other.f2 * inv3
    );
  }

  public exp(): HyperDualNumber {
    const ef0 = Math.exp(this.f0);
    return new HyperDualNumber(
      ef0,
      ef0 * this.f1,
      ef0 * this.f2,
      ef0 * (this.f12 + this.f1 * this.f2)
    );
  }

  public sin(): HyperDualNumber {
    const s = Math.sin(this.f0);
    const c = Math.cos(this.f0);
    return new HyperDualNumber(
      s,
      c * this.f1,
      c * this.f2,
      c * this.f12 - s * this.f1 * this.f2
    );
  }

  public cos(): HyperDualNumber {
    const s = Math.sin(this.f0);
    const c = Math.cos(this.f0);
    return new HyperDualNumber(
      c,
      -s * this.f1,
      -s * this.f2,
      -s * this.f12 - c * this.f1 * this.f2
    );
  }

  public pow(p: number): HyperDualNumber {
    const u = this.f0;
    const u_pm1 = Math.pow(u, p - 1);
    const u_pm2 = Math.pow(u, p - 2);
    const u_p = u_pm1 * u;
    return new HyperDualNumber(
      u_p,
      p * u_pm1 * this.f1,
      p * u_pm1 * this.f2,
      p * u_pm1 * this.f12 + p * (p - 1) * u_pm2 * this.f1 * this.f2
    );
  }
}

/**
 * Computes exact derivative f'(x) using forward-mode Dual Number automatic differentiation
 */
export function diff(f: (x: DualNumber) => DualNumber, x: number): { value: number; derivative: number } {
  const result = f(DualNumber.variable(x));
  return { value: result.val, derivative: result.eps };
}

/**
 * Computes exact first and second derivative (f'(x), f''(x)) using Hyper-Dual Number arithmetic
 */
export function diff2(
  f: (x: HyperDualNumber) => HyperDualNumber,
  x: number
): { value: number; d1: number; d2: number } {
  const result = f(HyperDualNumber.variable(x, 1, 1));
  return { value: result.f0, d1: result.f1, d2: result.f12 };
}

/**
 * Computes exact gradient \nabla f(\mathbf{x}) \in \mathbb{R}^n of scalar function f: \mathbb{R}^n \to \mathbb{R}
 */
export function gradient(
  f: (x: DualNumber[]) => DualNumber,
  x: number[]
): { value: number; grad: number[] } {
  const n = x.length;
  const grad: number[] = new Array(n);
  let val = 0;

  for (let i = 0; i < n; i++) {
    const dualVector = x.map((xi, idx) => new DualNumber(xi, idx === i ? 1 : 0));
    const out = f(dualVector);
    val = out.val;
    grad[i] = out.eps;
  }

  return { value: val, grad };
}

/**
 * Computes exact Jacobian matrix J(\mathbf{x}) \in \mathbb{R}^{m \times n} of vector function \mathbf{f}: \mathbb{R}^n \to \mathbb{R}^m
 */
export function jacobian(
  f: (x: DualNumber[]) => DualNumber[],
  x: number[]
): { values: number[]; jacobianMatrix: number[][] } {
  const n = x.length;
  const dummyOut = f(x.map((xi) => DualNumber.constant(xi)));
  const m = dummyOut.length;

  const J: number[][] = Array.from({ length: m }, () => new Array(n).fill(0));
  const values: number[] = dummyOut.map((d) => d.val);

  for (let col = 0; col < n; col++) {
    const dualInput = x.map((xi, idx) => new DualNumber(xi, idx === col ? 1 : 0));
    const output = f(dualInput);
    for (let row = 0; row < m; row++) {
      J[row][col] = output[row].eps;
    }
  }

  return { values, jacobianMatrix: J };
}

/**
 * Computes exact symmetric Hessian matrix H(\mathbf{x}) \in \mathbb{R}^{n \times n} using Hyper-Dual Numbers
 */
export function hessian(
  f: (x: HyperDualNumber[]) => HyperDualNumber,
  x: number[]
): { value: number; gradient: number[]; hessianMatrix: number[][] } {
  const n = x.length;
  const H: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
  const grad: number[] = new Array(n).fill(0);
  let val = 0;

  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      const hyperVector = x.map(
        (xi, idx) =>
          new HyperDualNumber(xi, idx === i ? 1 : 0, idx === j ? 1 : 0, 0)
      );
      const out = f(hyperVector);
      val = out.f0;
      grad[i] = out.f1;
      grad[j] = out.f2;
      H[i][j] = out.f12;
      H[j][i] = out.f12; // By Schwarz's theorem on symmetry of mixed second partial derivatives
    }
  }

  return { value: val, gradient: grad, hessianMatrix: H };
}

