/**
 * Sandbox Type Models for MathUniverse
 * Defines types for Pyodide Web Worker messaging, Parameter Sliders,
 * Multi-Modal 2D/3D Plot Payloads, and Automated Mathematical Verification Contracts.
 */

// ==========================================
// 1. Pyodide Web Worker Communication Types
// ==========================================

export type PyodideState = 'idle' | 'loading' | 'installing' | 'ready' | 'running' | 'error' | 'terminated';

export interface PyodideInitRequest {
  type: 'INIT';
  packages?: string[]; // e.g. ['sympy', 'numpy', 'scipy']
}

export interface PyodideRunRequest {
  type: 'RUN_CODE';
  runId: string;
  code: string;
  params: Record<string, number>;
  timeoutMs?: number;
}

export interface PyodideVerifyRequest {
  type: 'VERIFY_CLAIM';
  runId: string;
  contractId: string;
  nodeId: string;
  testCode: string;
  params?: Record<string, number>;
  tolerance?: number;
  sampleSize?: number;
}

export type PyodideWorkerRequest = PyodideInitRequest | PyodideRunRequest | PyodideVerifyRequest;

export interface PyodideReadyResponse {
  type: 'READY';
  version: string;
  loadedPackages: string[];
}

export interface PyodideStatusResponse {
  type: 'STATUS';
  state: PyodideState;
  message: string;
  messageEn?: string;
  progress?: number; // 0 - 100
}

export interface PyodideExecutionSuccessResponse {
  type: 'EXECUTION_SUCCESS';
  runId: string;
  stdout: string;
  stderr: string;
  resultExpression?: string;
  latexResult?: string;
  plotPayload?: PlotDataPayload;
  executionTimeMs: number;
}

export interface PyodideExecutionErrorResponse {
  type: 'EXECUTION_ERROR';
  runId: string;
  errorType: string;
  errorMessage: string;
  errorMessageEn?: string;
  traceback?: string;
}

export interface PyodideVerifyResponse {
  type: 'VERIFY_RESULT';
  runId: string;
  contractId: string;
  nodeId: string;
  passed: boolean;
  maxError: number;
  sampleCount: number;
  details: string;
  detailsEn?: string;
  durationMs: number;
}

export type PyodideWorkerResponse =
  | PyodideReadyResponse
  | PyodideStatusResponse
  | PyodideExecutionSuccessResponse
  | PyodideExecutionErrorResponse
  | PyodideVerifyResponse;

// ==========================================
// 2. Interactive Parameter Slider Configuration
// ==========================================

export interface ParameterSliderConfig {
  id?: string;
  label: string;
  symbol?: string; // e.g. "α", "k", "x₀", "ε"
  min: number;
  max: number;
  step: number;
  default: number;
  unit?: string;
  description?: string;
}

export type SliderParamMap = Record<string, ParameterSliderConfig>;
export type ParameterValues = Record<string, number>;

// ==========================================
// 3. Multi-Modal Live 2D/3D Plot Payloads
// ==========================================

export type PlotMode =
  | '2d_curve'
  | '2d_taylor_comparison'
  | '2d_riemann_sum'
  | '2d_sequence_limit'
  | '2d_vector_field'
  | '3d_surface'
  | '3d_attractor'
  | 'complex_phase_portrait';

export interface Curve2DSeries {
  id: string;
  label: string;
  color: string;
  points: Array<{ x: number; y: number }>;
  strokeWidth?: number;
  dashPattern?: number[];
}

export interface RiemannRect {
  x: number;
  width: number;
  height: number;
  isPositive: boolean;
}

export interface VectorFieldArrow {
  x: number;
  y: number;
  dx: number;
  dy: number;
  magnitude: number;
  angle: number;
}

export interface Surface3DVertex {
  x: number;
  y: number;
  z: number;
  u: number;
  v: number;
}

export interface Surface3DFace {
  indices: [number, number, number, number]; // Quad polygon
  color?: string;
  normal?: [number, number, number];
}

export interface Surface3DMesh {
  name: string;
  vertices: Surface3DVertex[];
  faces: Surface3DFace[];
  bounds: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    minZ: number;
    maxZ: number;
  };
}

export interface Attractor3DTrajectory {
  system: 'lorenz' | 'rossler' | 'chen' | 'aizawa' | 'thomas';
  trajectory: Array<[number, number, number]>; // [x, y, z] points
  t: number[];
}

export interface ComplexGridPoint {
  x: number; // Re(z)
  y: number; // Im(z)
  u: number; // Re(f(z))
  v: number; // Im(f(z))
  modulus: number; // |f(z)|
  argument: number; // arg(f(z)) in [-pi, pi]
  isDiscontinuity?: boolean;
}

export interface PlotDataPayload {
  mode: PlotMode;
  title: string;
  xRange?: [number, number];
  yRange?: [number, number];
  zRange?: [number, number];
  curves?: Curve2DSeries[];
  riemannRects?: RiemannRect[];
  sequenceLimit?: {
    L: number;
    N: number;
    epsilon: number;
    points: Array<{ n: number; val: number; isInside: boolean }>;
  };
  vectorField?: {
    grid: VectorFieldArrow[];
    streamlines?: Array<Array<{ x: number; y: number }>>;
  };
  surface3D?: Surface3DMesh;
  attractor3D?: Attractor3DTrajectory;
  complexGrid?: {
    points: ComplexGridPoint[];
    resX: number;
    resY: number;
  };
  metadata?: Record<string, string | number | boolean>;
}

// ==========================================
// 4. Automated Mathematical Node Verification
// ==========================================

export type VerificationTestType =
  | 'CAUCHY_SCHWARZ'
  | 'FUNDAMENTAL_THEOREM_CALCULUS'
  | 'STOKES_THEOREM'
  | 'FERMAT_MOD_EXP'
  | 'IDENTITY_MONTE_CARLO'
  | 'ODE_ENERGY_CONSERVATION'
  | 'SYMPY_SYMBOLIC_ZERO';

export interface NumericalVerificationContract {
  id: string;
  nodeId: string;
  claimName: string;
  claimNameEn?: string;
  testType: VerificationTestType;
  tolerance: number;
  sampleSize: number;
  domain: Record<string, [number, number]>;
  expectedResultDesc: string;
  pythonVerificationScript: string;
  typescriptChecker: (params: Record<string, number>, sampleSize?: number, locale?: 'zh' | 'en') => {
    passed: boolean;
    maxError: number;
    sampleCount: number;
    details: string;
  };
}

export interface VerificationResult {
  contractId: string;
  nodeId: string;
  claimName: string;
  passed: boolean;
  maxError: number;
  tolerance: number;
  sampleCount: number;
  details: string;
  durationMs: number;
  timestamp: string;
  executionMode: 'pyodide' | 'typescript';
}
