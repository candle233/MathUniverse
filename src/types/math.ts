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

export type MathematicalObjectType =
  | 'AXIOM'
  | 'DEFINITION'
  | 'PROPOSITION'
  | 'PROOF'
  | 'FORMALIZATION'
  | 'EXAMPLE'
  | 'COUNTEREXAMPLE';

export type PropositionRole =
  | 'THEOREM'
  | 'LEMMA'
  | 'COROLLARY'
  | 'CONJECTURE'
  | 'PROPERTY';

export type VerificationStatus =
  | 'UNVERIFIED'
  | 'SYNTAX_CHECKED'
  | 'PEER_REVIEWED'
  | 'FORMALLY_VERIFIED'
  | 'VERIFICATION_FAILED';

/**
 * Relation Types distinguishing Prerequisite/Logical Derivations (DAG)
 * from Semantic Associations (can contain cycles like A <=> B).
 */
export type RelationType =
  // --- Prerequisite & Logical Derivations (Must be acyclic in G_prerequisite) ---
  | 'LOGICALLY_USES'           // Direct logical step in proof derivation
  | 'LEARNING_PREREQUISITE'    // Pedagogical concept prerequisite
  | 'REQUIRES_DEFINITION'      // Proposition requires understanding of concept
  | 'USES_LEMMA'               // Proof explicitly invokes lemma
  | 'COROLLARY_OF'             // Direct deduction from major theorem
  | 'PROVES'                   // Proof entity -> Proposition entity
  | 'INSTANCE_OF'              // Example -> Definition/Concept
  
  // --- Semantic Graph Relations (May contain cycles in G_semantic) ---
  | 'IMPLIES'                  // A => B semantic implication
  | 'EQUIVALENT_TO'            // A <=> B mathematical equivalence
  | 'GENERALIZES'              // Generalization (e.g. Stokes generalizes FTC)
  | 'SPECIALIZES'              // Special case (e.g. FTC is 1D case of Stokes)
  | 'COUNTEREXAMPLE_TO'        // Disproves or limits scope of a conjecture/claim
  | 'MOTIVATES'                // Intuitive or physical motivation
  | 'HISTORICALLY_RELATED'     // Historical development connection
  | 'COMPUTATIONALLY_SIMULATES'// Sandbox numerical or symbolic simulation relation
  | 'GENERALIZATION_OF';       // Legacy alias for GENERALIZES

export type EdgeRelationType = RelationType;

export type GraphType = 'PREREQUISITE_DAG' | 'SEMANTIC_GRAPH' | 'BOTH';

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
  dependencies?: string[]; // Independent dependencies for this specific proof
}

/**
 * Verifiable Provenance Record for Formal Verification
 */
export interface FormalVerificationRecord {
  statementRevision: string;
  statementHash: string; // SHA-256 of the formal statement
  proofHash: string;     // SHA-256 of the formal proof source
  leanVersion: string;   // e.g. "Lean (version 4.14.0)"
  mathlibCommit: string; // e.g. "v4.14.0"
  imports: string[];
  axiomsUsed: string[];  // e.g. ["propext", "Classical.choice", "Quot.sound"]
  result: 'PASSED' | 'FAILED' | 'SYNTAX_CHECKED' | 'UNVERIFIED';
  checkedAt: string;     // ISO timestamp
  checker: 'LEAN_KERNEL' | 'LEAN_SERVER' | 'MOCK_KERNEL' | 'COMMUNITY_AUDITED';
  environment?: {
    kernelType?: string;
    memoryLimitMb?: number;
    timeoutSec?: number;
  };
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
  verificationRecord?: FormalVerificationRecord;
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

export interface MathEdge {
  id: string;
  fromNodeId: string; // The dependent theorem / source node
  toNodeId: string;   // The prerequisite / target node
  relationType: RelationType;
  graphType: GraphType;
  description?: string;
  weight?: number;    // Pedagogical difficulty or importance weight
}

export interface DependencyEdge extends MathEdge {}

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
  objectType?: MathematicalObjectType;
  propositionRole?: PropositionRole;
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
  formalVerificationRecord?: FormalVerificationRecord;
  reputationScore: number;
  viewCount: number;
  difficultyLevel: 1 | 2 | 3 | 4 | 5; // 1: High School / Early Uni, 5: Research Frontier
  
  // Relations (Unified & Backward Compatible)
  dependencies: string[]; // Prerequisite node IDs (G_prerequisite)
  dependents: string[];   // Dependent node IDs (G_prerequisite)
  
  // Structured Dual-Graph Edges
  prerequisiteEdges?: MathEdge[];
  semanticEdges?: MathEdge[];
  
  proofs: Proof[];
  proofSteps?: ProofStep[];
  leanFormalization?: LeanVerification;
  codeSnippets?: CodeSnippet[];
  comments?: StepComment[];
  
  tags: string[];
  tagsEn?: string[];
  lastModified: string;
}
