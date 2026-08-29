export type NodeType =
  | 'AXIOM'
  | 'DEFINITION'
  | 'LEMMA'
  | 'THEOREM'
  | 'COROLLARY'
  | 'PROPERTY'
  | 'EXAMPLE'
  | 'COUNTER_EXAMPLE'
  | 'CONJECTURE';

export type VerificationStatus =
  | 'UNVERIFIED'
  | 'PEER_REVIEWED'
  | 'FORMALLY_VERIFIED'
  | 'VERIFICATION_FAILED';

export type EdgeRelationType =
  | 'REQUIRES_DEFINITION'
  | 'USES_LEMMA'
  | 'COROLLARY_OF'
  | 'COUNTEREXAMPLE_TO'
  | 'GENERALIZATION_OF';

export type DisciplineId = string;

export interface MathDiscipline {
  id: string;
  mscCode: string; // e.g. "26" for Real Analysis, "11" for Number Theory
  nameZh: string;
  nameEn: string;
  color: string;
  icon: string;
  description: string;
  descriptionZh?: string;
  descriptionEn?: string;
}

export interface ProofStep {
  id: string;
  stepIndex: number;
  explanation: string;
  explanationZh?: string;
  explanationEn?: string;
  latexText: string;
  usedLemmas?: string[]; // IDs of referenced lemmas/definitions
  commentsCount: number;
}

export interface Proof {
  id: string;
  nodeId: string;
  title: string;
  titleZh?: string;
  titleEn?: string;
  approachType: 'ALGEBRAIC' | 'GEOMETRIC' | 'ANALYTIC' | 'COMBINATORIAL' | 'CONSTRUCTIVE' | 'FORMAL_LEAN';
  author: {
    id: string;
    name: string;
    reputation: number;
    avatar: string;
    isModerator?: boolean;
  };
  motivation: string; // Intuitive breakdown, metaphors, visual reasoning
  motivationZh?: string;
  motivationEn?: string;
  rigorousProof: string; // Full LaTeX/Markdown derivation
  rigorousProofZh?: string;
  rigorousProofEn?: string;
  steps: ProofStep[];
  isPrimary: boolean;
  verification: VerificationStatus;
  upvotes: number;
}

export interface LeanVerification {
  id: string;
  nodeId: string;
  theoremName: string;
  leanCode: string;
  mathlibImports: string[];
  proofStateOutput?: string;
  isVerified: boolean;
  verifiedAt?: string;
  axiomsUsed: string[]; // e.g. ["Classical.choice", "propext", "Quot.sound"]
  astHash: string;
}

export interface CodeSnippet {
  id: string;
  nodeId: string;
  language: 'python' | 'sagemath' | 'javascript';
  title: string;
  description: string;
  code: string;
  presetParams?: Record<string, { min: number; max: number; step: number; default: number; label: string }>;
  plotType?: '2d_plot' | '3d_surface' | 'sympy_symbolic' | 'vector_field' | 'fractal' | 'matrix';
}

export interface StepComment {
  id: string;
  stepIndex: number;
  author: {
    id: string;
    name: string;
    avatar: string;
    reputation: number;
  };
  content: string;
  createdAt: string;
  upvotes: number;
}

export interface DependencyEdge {
  id: string;
  fromNodeId: string; // The dependent theorem (e.g., Stokes' Theorem)
  toNodeId: string;   // The prerequisite (e.g., Fundamental Theorem of Calculus)
  relationType: EdgeRelationType;
  description?: string;
}

export interface PullRequest {
  id: string;
  nodeId: string;
  nodeTitle: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    reputation: number;
  };
  title: string;
  description: string;
  status: 'OPEN' | 'MERGED' | 'REJECTED' | 'DRAFT';
  createdAt: string;
  diff: {
    field: 'statementLatex' | 'intuitionMd' | 'proof' | 'dependencies' | 'lean';
    oldValue: string;
    newValue: string;
  };
  upvotes: number;
  downvotes: number;
  reviewers: Array<{
    name: string;
    decision: 'APPROVED' | 'CHANGES_REQUESTED';
    comment?: string;
  }>;
}

export interface MathNode {
  id: string;
  slug: string;
  titleZh: string;
  titleEn: string;
  nodeType: NodeType;
  disciplineId: string;
  mscCode: string;
  statementLatex: string;
  statementPlainZh: string;
  statementPlainEn?: string;
  statementZh?: string;
  statementEn?: string;
  intuitionMd: string;
  intuitionZh?: string;
  intuitionEn?: string;
  historicalContextZh?: string;
  historicalContextEn?: string;
  verification: VerificationStatus;
  reputationScore: number;
  viewCount: number;
  difficultyLevel: 1 | 2 | 3 | 4 | 5; // 1: High School / Early Uni, 5: Research Frontier
  
  // Relations
  dependencies: string[]; // Array of node IDs that this node depends on
  dependents: string[];   // Array of node IDs that depend on this node
  
  proofs: Proof[];
  proofSteps?: ProofStep[];
  leanFormalization?: LeanVerification;
  codeSnippets?: CodeSnippet[];
  comments?: StepComment[];
  
  tags: string[];
  tagsEn?: string[];
  lastModified: string;
}
