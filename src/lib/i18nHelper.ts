import type { Locale } from '../i18n/types.ts';
import type { MathNode, NodeType } from '../types/math.ts';

export function getNodeTitle(node: MathNode, locale: Locale): string {
  if (locale === 'en') {
    return node.titleEn || node.titleZh;
  }
  return node.titleZh || node.titleEn;
}

export function getNodeStatement(node: MathNode, locale: Locale): string {
  if (locale === 'en') {
    return node.statementPlainEn || node.statementPlainZh;
  }
  return node.statementPlainZh || node.statementPlainEn || '';
}

export function getNodeIntuition(node: MathNode, locale: Locale): string {
  if (locale === 'en') {
    return node.intuitionEn || node.intuitionMd;
  }
  return node.intuitionMd || node.intuitionEn || '';
}

export function getNodeHistorical(node: MathNode, locale: Locale): string {
  if (locale === 'en') {
    return node.historicalContextEn || node.historicalContextZh || '';
  }
  return node.historicalContextZh || node.historicalContextEn || '';
}

export function getNodeProofDescription(node: MathNode, locale: Locale): string {
  if (node.proofs && node.proofs.length > 0) {
    const primary = node.proofs.find((p) => p.isPrimary) || node.proofs[0];
    return primary.rigorousProof || primary.motivation || '';
  }
  return '';
}

export function getDisciplineName(
  discipline: { nameZh: string; nameEn: string },
  locale: Locale
): string {
  if (locale === 'en') {
    return discipline.nameEn || discipline.nameZh;
  }
  return discipline.nameZh || discipline.nameEn;
}

export const NODE_TYPE_LABELS: Record<NodeType, { zh: string; en: string }> = {
  AXIOM: { zh: '公理 (Axiom)', en: 'Axiom' },
  DEFINITION: { zh: '定义 (Definition)', en: 'Definition' },
  LEMMA: { zh: '引理 (Lemma)', en: 'Lemma' },
  THEOREM: { zh: '定理 (Theorem)', en: 'Theorem' },
  COROLLARY: { zh: '推论 (Corollary)', en: 'Corollary' },
  PROPERTY: { zh: '性质 (Property)', en: 'Property' },
  EXAMPLE: { zh: '范例 (Example)', en: 'Example' },
  COUNTER_EXAMPLE: { zh: '反例 (Counterexample)', en: 'Counterexample' },
  CONJECTURE: { zh: '猜想 (Conjecture)', en: 'Conjecture' },
};

export function getNodeTypeLabel(type: NodeType, locale: Locale): string {
  const item = NODE_TYPE_LABELS[type];
  if (!item) return type;
  return locale === 'en' ? item.en : item.zh;
}
