/**
 * MathUniverse Mathematical Fallacy Detective Lab Types
 * 6-Category Fallacy Taxonomy, Step Accusation Engine,
 * Formal Mathematical Critique, and Lean 4 Disproof Snippets.
 */

export type FallacyType =
  | 'FLAW_ZERO_DIV'
  | 'FLAW_DIVERGENT'
  | 'FLAW_BRANCH_CUT'
  | 'FLAW_GEOM_SEMICONT'
  | 'FLAW_INT_CONSTANT'
  | 'FLAW_LEIBNIZ_RULE';

export interface FallacyCategoryMeta {
  type: FallacyType;
  nameZh: string;
  nameEn: string;
  principleViolatedZh: string;
  badgeColor: string;
  shortDescZh: string;
}

export interface FallacyStep {
  stepIndex: number;
  latex: string;
  plainZh: string;
  isFlawed: boolean;
  flawReasonZh?: string;
  formalRefutationLatex?: string;
}

export interface FallacyCase {
  id: string;
  caseCode: string; // e.g. CASE-001
  titleZh: string;
  titleEn: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  flawType: FallacyType;
  storyContextZh: string;
  allegedConclusionLatex: string;
  steps: FallacyStep[];
  formalCritiqueZh: string;
  formalTheoremNameZh: string;
  leanDisproofSnippet?: string;
  interactiveVisualizerType?:
    | 'triangle_dissection'
    | 'staircase_pi'
    | 'complex_riemann_surface'
    | 'series_partial_sums'
    | 'integral_leibniz'
    | 'integration_constant';
}

export interface AccusationResult {
  caseId: string;
  stepIndex: number;
  isFlawedStep: boolean;
  flawCategoryMatches: boolean;
  pointsEarned: number;
  verdictTitle: string;
  feedbackZh: string;
  formalRefutationLatex?: string;
  leanDisproofSnippet?: string;
  formalCritiqueZh?: string;
}

export interface FallacyLabProgress {
  solvedCaseIds: string[];
  attemptedCount: number;
  detectiveScore: number;
  badgeTitle: string;
  lastUpdated: string;
}
