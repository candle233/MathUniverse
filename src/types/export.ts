import type { MathNode } from './math.ts';

export type ExportFormat =
  | 'latex_paper'
  | 'typst'
  | 'beamer'
  | 'quarto_md'
  | 'tikz_cd'
  | 'proof_tree'
  | 'overleaf';

export interface ExportOptions {
  format: ExportFormat;
  includePrerequisites: boolean;
  includeProofs: boolean;
  includeIntuition: boolean;
  includeLeanCode: boolean;
  includeTikzDiagram?: boolean;
  authorName?: string;
  documentTitle?: string;
  institution?: string;
  paperSize?: 'a4' | 'letter';
  fontSize?: '10pt' | '11pt' | '12pt';
  themeName?: string;
  typstVersion?: string;
}

export interface ExportDocumentResult {
  format: ExportFormat;
  content: string;
  fileExtension: string;
  mimeType: string;
  suggestedFilename: string;
  prerequisiteCount: number;
  lineCount: number;
  byteSize: number;
  targetNodeId: string;
  overleafUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface TikzDiagramOptions {
  diagramType:
    | 'dependency_dag'
    | 'commutative_square'
    | 'short_exact_sequence'
    | 'natural_deduction'
    | 'first_isomorphism'
    | 'snake_lemma'
    | 'custom';
  title?: string;
  direction?: 'LR' | 'TD';
  scale?: number;
}

export interface OverleafExportPayload {
  snip_uri?: string;
  snip?: string;
  name: string;
  engine?: 'pdflatex' | 'xelatex' | 'lualatex';
  url: string;
}
