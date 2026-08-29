import { zh } from '../src/i18n/locales/zh';
import { en } from '../src/i18n/locales/en';
import {
  getNodeTitle,
  getNodeStatement,
  getNodeIntuition,
  getNodeTypeLabel,
  getDisciplineName,
} from '../src/lib/i18nHelper';
import { initialMathNodes } from '../src/data/seedData';
import { disciplines } from '../src/data/disciplines';

describe('MathUniverse i18n & Multi-language Separation Suite', () => {
  // Test 1: Recursive key parity between Chinese and English dictionaries
  test('i18n Dictionary Parity: All keys in zh exist in en and vice versa', () => {
    function getAllKeys(obj: any, prefix = ''): string[] {
      let keys: string[] = [];
      for (const k of Object.keys(obj)) {
        const fullKey = prefix ? `${prefix}.${k}` : k;
        if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
          keys = keys.concat(getAllKeys(obj[k], fullKey));
        } else {
          keys.push(fullKey);
        }
      }
      return keys;
    }

    const zhKeys = getAllKeys(zh).sort();
    const enKeys = getAllKeys(en).sort();

    const missingInEn = zhKeys.filter((k) => !enKeys.includes(k));
    const missingInZh = enKeys.filter((k) => !zhKeys.includes(k));

    expect(missingInEn).toEqual([]);
    expect(missingInZh).toEqual([]);
    expect(zhKeys.length).toBeGreaterThanOrEqual(50);
  });

  // Test 2: No empty translation strings
  test('i18n Translation Validity: No translation value is empty or undefined', () => {
    function checkValues(obj: any, path = '') {
      for (const k of Object.keys(obj)) {
        const currentPath = path ? `${path}.${k}` : k;
        const val = obj[k];
        if (typeof val === 'string') {
          expect(val.trim().length).toBeGreaterThan(0);
        } else if (typeof val === 'object' && val !== null) {
          checkValues(val, currentPath);
        }
      }
    }

    checkValues(zh, 'zh');
    checkValues(en, 'en');
  });

  // Test 3: MathNode Decoupled Bilingual Content Helpers
  test('Node Content Localization: Decouples Chinese and English without duplication', () => {
    const sampleNode = initialMathNodes.find((n) => n.id === 'thm-cauchy-schwarz');
    expect(sampleNode).toBeDefined();
    if (!sampleNode) return;

    // Chinese locale
    const zhTitle = getNodeTitle(sampleNode, 'zh');
    expect(zhTitle).toContain('柯西');
    expect(zhTitle).not.toContain('Cauchy');

    // English locale
    const enTitle = getNodeTitle(sampleNode, 'en');
    expect(enTitle).toContain('Cauchy');

    // Mathematical formula remains intact in both
    expect(sampleNode.statementLatex).toContain('\\sum');
  });

  // Test 4: Discipline Names Localization
  test('Discipline Localization: Correctly resolves discipline names for zh and en', () => {
    const analysis = disciplines.find((d) => d.id === 'analysis');
    expect(analysis).toBeDefined();
    if (!analysis) return;

    expect(getDisciplineName(analysis, 'zh')).toBe('数学分析与实变函数');
    expect(getDisciplineName(analysis, 'en')).toBe('Analysis');
  });

  // Test 5: Node Type Labels Localization
  test('NodeType Labels: Correctly provides localized labels for all node types', () => {
    expect(getNodeTypeLabel('THEOREM', 'zh')).toContain('定理');
    expect(getNodeTypeLabel('THEOREM', 'en')).toBe('Theorem');
    expect(getNodeTypeLabel('AXIOM', 'zh')).toContain('公理');
    expect(getNodeTypeLabel('AXIOM', 'en')).toBe('Axiom');
    expect(getNodeTypeLabel('DEFINITION', 'en')).toBe('Definition');
  });
});
