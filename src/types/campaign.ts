/**
 * MathUniverse ZFC to Modern Math RPG Progression Engine Types
 * 6 Epochs of Mathematical Civilization, Axiom Unlocking,
 * Entity Synthesis, and Step-by-Step Derivation Verification.
 */

export type ZfcAxiomId =
  | 'AXIOM_EXTENSIONALITY'
  | 'AXIOM_EMPTY_SET'
  | 'AXIOM_PAIRING'
  | 'AXIOM_UNION'
  | 'AXIOM_POWER_SET'
  | 'AXIOM_INFINITY'
  | 'AXIOM_REPLACEMENT'
  | 'AXIOM_REGULARITY'
  | 'AXIOM_CHOICE';

export interface ZfcAxiomDefinition {
  id: ZfcAxiomId;
  nameZh: string;
  nameEn: string;
  firstOrderFormulaLatex: string;
  intuitionZh: string;
  intuitionEn?: string;
  epochIntroduced: number;
  category: 'FOUNDATION' | 'CONSTRUCTION' | 'INFINITARY' | 'CHOICE';
}

export interface ConstructedEntity {
  id: string;
  nameZh: string;
  nameEn: string;
  setNotation: string;
  formalDefinitionLatex: string;
  descriptionZh: string;
  descriptionEn?: string;
  requiredAxioms: ZfcAxiomId[];
  requiredEntities: string[];
  unlockedAtEpoch: number;
  discipline: 'SET_THEORY' | 'ARITHMETIC' | 'ALGEBRA' | 'ANALYSIS' | 'TOPOLOGY' | 'CATEGORY_THEORY';
}

export interface MilestoneDerivationStep {
  stepNumber: number;
  instructionZh: string;
  instructionEn?: string;
  validAxiomChoices: ZfcAxiomId[];
  correctFormula: string;
  formulaChoices: string[];
  explanationZh: string;
  explanationEn?: string;
}

export interface MilestoneChallenge {
  id: string;
  titleZh: string;
  titleEn: string;
  goalFormula: string;
  descriptionZh: string;
  descriptionEn?: string;
  inferenceSteps: MilestoneDerivationStep[];
}

export interface CampaignEpoch {
  epochNumber: number; // 1 to 6
  id: string;
  titleZh: string;
  titleEn: string;
  eraDescriptionZh: string;
  eraDescriptionEn?: string;
  requiredAxiomIds: ZfcAxiomId[];
  requiredEntityIds: string[];
  constructibleEntities: ConstructedEntity[];
  milestoneChallenge: MilestoneChallenge;
  rewardXp: number;
  badgeTitle: string;
  badgeTitleZh?: string;
  badgeTitleEn?: string;
  themeColor: string;
}

export interface UserCampaignProgress {
  unlockedEpochs: number[];
  unlockedAxioms: ZfcAxiomId[];
  inventoryEntities: string[];
  totalXp: number;
  currentStreak: number;
  completedChallenges: string[];
  activeStepPerEpoch: Record<number, number>;
  lastUpdated: string;
}

export interface UserLevelInfo {
  level: number;
  title: string;
  titleZh?: string;
  titleEn?: string;
  currentLevelXp: number;
  nextLevelXp: number;
  progressPercent: number;
}
