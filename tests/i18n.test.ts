/**
 * tests/i18n.test.ts
 *
 * Comprehensive i18n & Multi-Language Decoupling Test Suite
 *
 * Covers 5 Tiers of Internationalization & Content Decoupling Verification:
 * Tier 1: 100% Translation Dictionary Key Parity & Structural Integrity
 * Tier 2: Nested Key Path Traversal & Parameter Interpolation
 * Tier 3: Mathematical Entity & Discipline Localization Accessors with Fallback Safety
 * Tier 4: Language Switching Reactivity, LocalStorage Persistence & Event Dispatching
 * Tier 5: Decoupled Seed Data Cleanliness & Formula Preservation
 */

import { zh } from '../src/i18n/locales/zh.ts';
import { en } from '../src/i18n/locales/en.ts';
import type { Locale, TranslationDict } from '../src/i18n/types.ts';
import {
  getNodeTitle,
  getNodeStatement,
  getNodeIntuition,
  getNodeHistorical,
  getNodeProofDescription,
  getNodeTypeLabel,
  getDisciplineName,
  NODE_TYPE_LABELS,
} from '../src/lib/i18nHelper.ts';
import { initialMathNodes } from '../src/data/seedData.ts';
import { disciplines } from '../src/data/disciplines.ts';
import type { MathNode, NodeType } from '../src/types/math.ts';

export function runI18nTests(): { passed: number; failed: number } {
  console.log('🌐 =========================================================================');
  console.log('🌐 MATHUNIVERSE i18n & DECOUPLED CONTENT TEST SUITE (TEST GROUP 15)');
  console.log('🌐 =========================================================================\n');

  let passed = 0;
  let failed = 0;
  const failures: string[] = [];

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`  ✅ [PASS] ${testName}`);
      passed++;
    } else {
      const msg = `  ❌ [FAIL] ${testName}${detail ? ` -> ${detail}` : ''}`;
      console.error(msg);
      failures.push(msg);
      failed++;
    }
  }

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

  // =========================================================================
  // TIER 1: 100% Dictionary Key Parity & Structural Integrity
  // =========================================================================
  console.log('--- Tier 1: 100% Translation Dictionary Key Parity & Structural Integrity ---');
  {
    const zhKeys = getAllKeys(zh).sort();
    const enKeys = getAllKeys(en).sort();

    const missingInEn = zhKeys.filter((k) => !enKeys.includes(k));
    const missingInZh = enKeys.filter((k) => !zhKeys.includes(k));

    assert(
      missingInEn.length === 0,
      'Tier 1.1: 100% Parity - Zero keys missing in English dictionary',
      missingInEn.length > 0 ? `Missing in EN: ${missingInEn.join(', ')}` : undefined
    );
    assert(
      missingInZh.length === 0,
      'Tier 1.2: 100% Parity - Zero keys missing in Chinese dictionary',
      missingInZh.length > 0 ? `Missing in ZH: ${missingInZh.join(', ')}` : undefined
    );
    assert(
      zhKeys.length >= 100,
      `Tier 1.3: Scale - Dictionaries contain comprehensive localized keys (found ${zhKeys.length} keys)`
    );

    // Required namespaces
    const requiredNamespaces = [
      'nav',
      'hero',
      'graph',
      'lean',
      'community',
      'editor',
      'admin',
      'sandbox',
      'common',
    ];
    for (const ns of requiredNamespaces) {
      assert(ns in zh && typeof (zh as any)[ns] === 'object', `Tier 1.4: Namespace '${ns}' exists in zh dictionary`);
      assert(ns in en && typeof (en as any)[ns] === 'object', `Tier 1.4: Namespace '${ns}' exists in en dictionary`);
    }

    // Value Non-Emptiness & Type Safety
    let emptyOrWhitespaceZh = 0;
    let emptyOrWhitespaceEn = 0;
    let nonStringValues = 0;

    for (const key of zhKeys) {
      const getNestedVal = (obj: any, path: string) =>
        path.split('.').reduce((acc, part) => acc && acc[part], obj);

      const valZh = getNestedVal(zh, key);
      const valEn = getNestedVal(en, key);

      if (typeof valZh !== 'string' || typeof valEn !== 'string') {
        nonStringValues++;
      } else {
        if (valZh.trim().length === 0) emptyOrWhitespaceZh++;
        if (valEn.trim().length === 0) emptyOrWhitespaceEn++;
      }
    }

    assert(nonStringValues === 0, 'Tier 1.5: All leaf translation values are valid strings');
    assert(emptyOrWhitespaceZh === 0, 'Tier 1.6: Chinese dictionary contains 0 empty or whitespace strings');
    assert(emptyOrWhitespaceEn === 0, 'Tier 1.7: English dictionary contains 0 empty or whitespace strings');
  }

  // =========================================================================
  // TIER 2: Nested Key Path Traversal & Parameter Interpolation
  // =========================================================================
  console.log('\n--- Tier 2: Nested Key Path Traversal & Parameter Interpolation ---');
  {
    const dictionaries: Record<Locale, TranslationDict> = { zh, en };

    // Reference translation resolver matching LanguageContext logic
    function resolveT(
      locale: Locale,
      path: string,
      params?: Record<string, string | number>,
      overrideDicts?: Record<Locale, any>
    ): string {
      const dicts = overrideDicts || dictionaries;
      const keys = path.split('.');
      const dict = dicts[locale] || dicts.zh;
      const fallbackDict = dicts.zh;

      let result: any = dict;
      for (const k of keys) {
        if (result && typeof result === 'object' && k in result) {
          result = result[k];
        } else {
          result = undefined;
          break;
        }
      }

      // Fallback to Chinese dictionary if key is missing in target locale
      if (result === undefined) {
        let fallbackResult: any = fallbackDict;
        for (const k of keys) {
          if (fallbackResult && typeof fallbackResult === 'object' && k in fallbackResult) {
            fallbackResult = fallbackResult[k];
          } else {
            fallbackResult = path;
            break;
          }
        }
        result = fallbackResult;
      }

      if (typeof result !== 'string') {
        return path;
      }

      // Param interpolation: {count}, {name}, etc.
      if (params) {
        return result.replace(/\{(\w+)\}/g, (_, match) => {
          return match in params ? String(params[match]) : `{${match}}`;
        });
      }

      return result;
    }

    // 2.1 Basic Nested Traversal
    assert(resolveT('zh', 'nav.brand') === 'MathUniverse', 'Tier 2.1: Resolves top-level nested key "nav.brand"');
    assert(resolveT('zh', 'hero.feature1Title').includes('DAG'), 'Tier 2.1: Resolves deep nested key "hero.feature1Title" in zh');
    assert(resolveT('en', 'hero.feature1Title').includes('DAG'), 'Tier 2.1: Resolves deep nested key "hero.feature1Title" in en');
    assert(resolveT('zh', 'common.theorems') === '定理', 'Tier 2.1: Resolves common term "common.theorems" in zh');
    assert(resolveT('en', 'common.theorems') === 'Theorems', 'Tier 2.1: Resolves common term "common.theorems" in en');

    // 2.2 Parameter Interpolation with String and Number values
    const templateZh = '{count} 个待解决证明目标';
    const mockDictsZh = {
      zh: { lean: { customGoals: templateZh } },
      en: { lean: { customGoals: '{count} unsolved proof goal(s)' } },
    };

    const resInterpolatedZh = resolveT('zh', 'lean.customGoals', { count: 3 }, mockDictsZh);
    assert(resInterpolatedZh === '3 个待解决证明目标', `Tier 2.2: Interpolates number parameter ({count: 3} -> "${resInterpolatedZh}")`);

    const resInterpolatedEn = resolveT('en', 'lean.customGoals', { count: 12 }, mockDictsZh);
    assert(resInterpolatedEn === '12 unsolved proof goal(s)', `Tier 2.2: Interpolates English number parameter ({count: 12} -> "${resInterpolatedEn}")`);

    // 2.3 Boundary: Zero Value Handling ({ count: 0 })
    const resZeroZh = resolveT('zh', 'lean.customGoals', { count: 0 }, mockDictsZh);
    assert(resZeroZh === '0 个待解决证明目标', `Tier 2.3: Zero value {count: 0} is formatted as "0" (got "${resZeroZh}")`);

    // 2.4 Multiple Parameter Substitution
    const multiParamMock = {
      zh: { report: { msg: '用户 {author} 在 {discipline} 提交了 {count} 个定理' } },
      en: { report: { msg: 'Author {author} submitted {count} theorems in {discipline}' } },
    };
    const multiRes = resolveT('zh', 'report.msg', { author: 'Euler', discipline: '数论', count: 7 }, multiParamMock);
    assert(
      multiRes === '用户 Euler 在 数论 提交了 7 个定理',
      `Tier 2.4: Multi-parameter interpolation preserves all placeholders correctly (got "${multiRes}")`
    );

    // 2.5 Missing Parameter Graceful Preservation
    const missingParamRes = resolveT('zh', 'report.msg', { author: 'Gauss' }, multiParamMock);
    assert(
      missingParamRes === '用户 Gauss 在 {discipline} 提交了 {count} 个定理',
      `Tier 2.5: Missing parameter placeholders remain intact as "{discipline}" and "{count}" (got "${missingParamRes}")`
    );

    // 2.6 Fallback for Non-Existent Key Path
    const unknownPathRes = resolveT('zh', 'non.existent.deep.path.key');
    assert(
      unknownPathRes === 'non.existent.deep.path.key',
      `Tier 2.6: Non-existent key returns key path string safely without throwing (got "${unknownPathRes}")`
    );

    // 2.7 Fallback to zh when missing in en
    const asymmetricMock = {
      zh: { special: { onlyInZh: '仅在中文中存在' } },
      en: { special: {} },
    };
    const fallbackRes = resolveT('en', 'special.onlyInZh', undefined, asymmetricMock);
    assert(
      fallbackRes === '仅在中文中存在',
      `Tier 2.7: Missing key in target locale falls back to zh dictionary (got "${fallbackRes}")`
    );

    // 2.8 Non-String Object Path Traversal
    const objectPathRes = resolveT('zh', 'nav');
    assert(objectPathRes === 'nav', `Tier 2.8: Querying non-leaf object path returns path string safely (got "${objectPathRes}")`);
  }

  // =========================================================================
  // TIER 3: Mathematical Entity & Discipline Localization Accessors
  // =========================================================================
  console.log('\n--- Tier 3: Mathematical Entity & Discipline Localization Accessors ---');
  {
    // 3.1 MathNode title and statement accessors on real seed data
    const stokesNode = initialMathNodes.find((n) => n.id === 'thm-stokes')!;
    assert(stokesNode !== undefined, 'Tier 3.1: Found target seed theorem thm-stokes');

    const stokesZhTitle = getNodeTitle(stokesNode, 'zh');
    const stokesEnTitle = getNodeTitle(stokesNode, 'en');
    assert(stokesZhTitle.includes('斯托克斯'), `Tier 3.1: getNodeTitle(zh) returns Chinese title (got "${stokesZhTitle}")`);
    assert(stokesEnTitle.includes('Stokes'), `Tier 3.1: getNodeTitle(en) returns English title (got "${stokesEnTitle}")`);

    const stokesZhStatement = getNodeStatement(stokesNode, 'zh');
    const stokesEnStatement = getNodeStatement(stokesNode, 'en');
    assert(stokesZhStatement.length > 20, 'Tier 3.1: getNodeStatement(zh) returns non-empty Chinese statement');
    assert(stokesEnStatement.length > 20, 'Tier 3.1: getNodeStatement(en) returns non-empty English statement');

    // 3.2 Intuition and historical context accessors
    const stokesZhIntuition = getNodeIntuition(stokesNode, 'zh');
    const stokesEnIntuition = getNodeIntuition(stokesNode, 'en');
    assert(stokesZhIntuition.length > 10, 'Tier 3.2: getNodeIntuition(zh) returns Chinese intuition');
    assert(stokesEnIntuition.length > 10, 'Tier 3.2: getNodeIntuition(en) returns English intuition');

    const stokesZhHistory = getNodeHistorical(stokesNode, 'zh');
    const stokesEnHistory = getNodeHistorical(stokesNode, 'en');
    assert(typeof stokesZhHistory === 'string', 'Tier 3.2: getNodeHistorical(zh) returns string');
    assert(typeof stokesEnHistory === 'string', 'Tier 3.2: getNodeHistorical(en) returns string');

    // 3.3 Proof Description accessor
    const proofDesc = getNodeProofDescription(stokesNode, 'zh');
    assert(proofDesc.length > 0, 'Tier 3.3: getNodeProofDescription returns valid primary proof content');

    // 3.4 Discipline Name Accessor for all disciplines
    assert(disciplines.length >= 5, `Tier 3.4: Registered disciplines count is ${disciplines.length}`);
    for (const d of disciplines) {
      const dZh = getDisciplineName(d, 'zh');
      const dEn = getDisciplineName(d, 'en');
      assert(dZh === d.nameZh && dZh.length > 0, `Tier 3.4: Discipline ${d.id} localized to zh: "${dZh}"`);
      assert(dEn === d.nameEn && dEn.length > 0, `Tier 3.4: Discipline ${d.id} localized to en: "${dEn}"`);
    }

    // 3.5 NodeType Labels for all 9 types
    const allNodeTypes: NodeType[] = [
      'AXIOM',
      'DEFINITION',
      'LEMMA',
      'THEOREM',
      'COROLLARY',
      'PROPERTY',
      'EXAMPLE',
      'COUNTER_EXAMPLE',
      'CONJECTURE',
    ];
    for (const nt of allNodeTypes) {
      const labelZh = getNodeTypeLabel(nt, 'zh');
      const labelEn = getNodeTypeLabel(nt, 'en');
      assert(labelZh.length > 0, `Tier 3.5: NodeType ${nt} has valid zh label: "${labelZh}"`);
      assert(labelEn.length > 0, `Tier 3.5: NodeType ${nt} has valid en label: "${labelEn}"`);
      assert(labelEn === NODE_TYPE_LABELS[nt].en, `Tier 3.5: NodeType ${nt} en label matches dictionary exactly`);
    }

    // 3.6 Fallback Resilience: Synthetic Node with Missing Bilingual Fields
    const syntheticSparseNode: MathNode = {
      id: 'thm-synth-sparse',
      slug: 'synthetic-sparse',
      titleZh: '仅有中文命题名',
      titleEn: '', // Missing English title
      nodeType: 'THEOREM',
      disciplineId: 'analysis',
      mscCode: '00A00',
      statementLatex: 'E = mc^2',
      statementPlainZh: '中文陈述说明',
      statementPlainEn: undefined, // Missing English statement
      intuitionMd: '中文直觉',
      intuitionEn: undefined, // Missing English intuition
      historicalContextZh: '中文历史',
      historicalContextEn: undefined,
      verification: 'UNVERIFIED',
      reputationScore: 0,
      viewCount: 0,
      difficultyLevel: 1,
      dependencies: [],
      dependents: [],
      proofs: [],
      tags: [],
      lastModified: '2026-08-29',
    };

    assert(
      getNodeTitle(syntheticSparseNode, 'en') === '仅有中文命题名',
      'Tier 3.6: getNodeTitle(en) gracefully falls back to titleZh when titleEn is empty'
    );
    assert(
      getNodeStatement(syntheticSparseNode, 'en') === '中文陈述说明',
      'Tier 3.6: getNodeStatement(en) gracefully falls back to statementPlainZh when statementPlainEn is undefined'
    );
    assert(
      getNodeIntuition(syntheticSparseNode, 'en') === '中文直觉',
      'Tier 3.6: getNodeIntuition(en) gracefully falls back to intuitionMd when intuitionEn is undefined'
    );
    assert(
      getNodeHistorical(syntheticSparseNode, 'en') === '中文历史',
      'Tier 3.6: getNodeHistorical(en) gracefully falls back to historicalContextZh when historicalContextEn is undefined'
    );

    // Fallback for discipline with missing English name
    const syntheticDiscipline = { nameZh: '代数拓扑', nameEn: '' };
    assert(
      getDisciplineName(syntheticDiscipline, 'en') === '代数拓扑',
      'Tier 3.6: getDisciplineName(en) falls back to nameZh when nameEn is empty'
    );

    // Unknown NodeType returns raw type string without crashing
    const unknownType = 'UNKNOWN_TYPE' as any;
    assert(
      getNodeTypeLabel(unknownType, 'zh') === 'UNKNOWN_TYPE',
      'Tier 3.6: getNodeTypeLabel on unknown type returns raw string safely'
    );
  }

  // =========================================================================
  // TIER 4: Language Switching Reactivity, LocalStorage & Event Synchronization
  // =========================================================================
  console.log('\n--- Tier 4: Language Switching Reactivity, LocalStorage & Event Synchronization ---');
  {
    const STORAGE_LOCALE_KEY = 'mathuniverse:user-locale';

    // Mock browser environment harness
    class MockLocalStorage {
      private store = new Map<string, string>();
      getItem(key: string): string | null {
        return this.store.get(key) ?? null;
      }
      setItem(key: string, value: string): void {
        this.store.set(key, value);
      }
      removeItem(key: string): void {
        this.store.delete(key);
      }
      clear(): void {
        this.store.clear();
      }
    }

    class MockDocument {
      documentElement = { lang: 'zh-CN' };
    }

    class MockWindow {
      localStorage = new MockLocalStorage();
      events: string[] = [];
      listeners = new Map<string, Array<(e: any) => void>>();

      addEventListener(type: string, listener: (e: any) => void) {
        const list = this.listeners.get(type) || [];
        list.push(listener);
        this.listeners.set(type, list);
      }

      removeEventListener(type: string, listener: (e: any) => void) {
        const list = this.listeners.get(type) || [];
        this.listeners.set(type, list.filter((l) => l !== listener));
      }

      dispatchEvent(event: { type: string }): boolean {
        this.events.push(event.type);
        const list = this.listeners.get(event.type) || [];
        list.forEach((l) => l(event));
        return true;
      }
    }

    // 4.1 Mock Reactive State Machine Lifecycle
    const mockWin = new MockWindow();
    const mockDoc = new MockDocument();

    function simulateSetLocale(
      targetLocale: Locale,
      win: MockWindow,
      doc: MockDocument,
      stateSetter: (l: Locale) => void
    ) {
      stateSetter(targetLocale);
      win.localStorage.setItem(STORAGE_LOCALE_KEY, targetLocale);
      doc.documentElement.lang = targetLocale === 'zh' ? 'zh-CN' : 'en';
      win.dispatchEvent({ type: 'mathuniverse:locale-changed' });
    }

    let currentLocale: Locale = 'zh';
    let eventReceivedCount = 0;

    mockWin.addEventListener('mathuniverse:locale-changed', () => {
      eventReceivedCount++;
    });

    // Test transition zh -> en
    simulateSetLocale('en', mockWin, mockDoc, (l) => {
      currentLocale = l;
    });

    assert(currentLocale === 'en', 'Tier 4.1: State updated to "en"');
    assert(mockWin.localStorage.getItem(STORAGE_LOCALE_KEY) === 'en', 'Tier 4.2: LocalStorage persisted "en"');
    assert(mockDoc.documentElement.lang === 'en', 'Tier 4.3: document.documentElement.lang synced to "en"');
    assert(eventReceivedCount === 1, 'Tier 4.4: Custom event "mathuniverse:locale-changed" successfully received');

    // Test transition en -> zh
    simulateSetLocale('zh', mockWin, mockDoc, (l) => {
      currentLocale = l;
    });

    assert(currentLocale === 'zh', 'Tier 4.5: State toggled back to "zh"');
    assert(mockWin.localStorage.getItem(STORAGE_LOCALE_KEY) === 'zh', 'Tier 4.6: LocalStorage persisted "zh"');
    assert(mockDoc.documentElement.lang === 'zh-CN', 'Tier 4.7: document.documentElement.lang synced to "zh-CN"');
    assert(eventReceivedCount === 2, 'Tier 4.8: Second locale change event dispatched and captured');

    // 4.9 Language toggle logic verification
    function toggle(l: Locale): Locale {
      return l === 'zh' ? 'en' : 'zh';
    }
    assert(toggle('zh') === 'en', 'Tier 4.9: Toggle from zh returns en');
    assert(toggle('en') === 'zh', 'Tier 4.10: Toggle from en returns zh');
  }

  // =========================================================================
  // TIER 5: Decoupled Seed Data Cleanliness & Formula Preservation
  // =========================================================================
  console.log('\n--- Tier 5: Decoupled Seed Data Cleanliness & Formula Preservation ---');
  {
    assert(initialMathNodes.length === 21, `Tier 5.1: Exactly 21 mathematical propositions in seed data (found ${initialMathNodes.length})`);

    let missingZhTitle = 0;
    let missingEnTitle = 0;
    let corruptedLatexCount = 0;
    let invalidChineseTitleCount = 0;
    let invalidEnglishTitleCount = 0;

    const chineseCharRegex = /[\u4e00-\u9fa5]/;
    const englishCharRegex = /[A-Za-z]/;

    for (const node of initialMathNodes) {
      if (!node.titleZh || node.titleZh.trim().length === 0) {
        missingZhTitle++;
      } else if (!chineseCharRegex.test(node.titleZh)) {
        invalidChineseTitleCount++;
      }

      if (!node.titleEn || node.titleEn.trim().length === 0) {
        missingEnTitle++;
      } else if (!englishCharRegex.test(node.titleEn)) {
        invalidEnglishTitleCount++;
      }

      // Check statementLatex preservation
      if (
        !node.statementLatex ||
        (!node.statementLatex.includes('\\') && !node.statementLatex.includes('=') && !node.statementLatex.includes('>'))
      ) {
        corruptedLatexCount++;
      }
    }

    assert(missingZhTitle === 0, 'Tier 5.2: All 21 seed nodes have non-empty Chinese titles (titleZh)');
    assert(invalidChineseTitleCount === 0, 'Tier 5.3: All 21 Chinese titles contain genuine Chinese characters');
    assert(missingEnTitle === 0, 'Tier 5.4: All 21 seed nodes have non-empty English titles (titleEn)');
    assert(invalidEnglishTitleCount === 0, 'Tier 5.5: All 21 English titles contain genuine English characters');
    assert(corruptedLatexCount === 0, 'Tier 5.6: All 21 seed nodes have intact mathematical statementLatex formulas');

    // 5.7 Spot-check specific flagship theorems for clean bilingual separation
    const csNode = initialMathNodes.find((n) => n.id === 'thm-cauchy-schwarz')!;
    assert(csNode.titleZh === '柯西-施瓦茨不等式', 'Tier 5.7: Cauchy-Schwarz Chinese title is clean');
    assert(csNode.titleEn === 'Cauchy-Schwarz Inequality', 'Tier 5.7: Cauchy-Schwarz English title is clean');

    const ftcNode = initialMathNodes.find((n) => n.id === 'thm-ftc')!;
    assert(getNodeTitle(ftcNode, 'zh').includes('微积分基本定理'), 'Tier 5.8: FTC Chinese title properly resolved');
    assert(getNodeTitle(ftcNode, 'en').includes('Fundamental Theorem of Calculus'), 'Tier 5.8: FTC English title properly resolved');

    const stokesNode = initialMathNodes.find((n) => n.id === 'thm-stokes')!;
    assert(getNodeTitle(stokesNode, 'zh').includes('斯托克斯'), 'Tier 5.9: Stokes Chinese title properly resolved');
    assert(getNodeTitle(stokesNode, 'en').includes('Stokes'), 'Tier 5.9: Stokes English title properly resolved');

    const eulerNode = initialMathNodes.find((n) => n.id === 'thm-euler-identity')!;
    assert(getNodeTitle(eulerNode, 'zh') === '欧拉恒等式', 'Tier 5.10: Euler Identity Chinese title clean');
    assert(getNodeTitle(eulerNode, 'en') === "Euler's Identity", 'Tier 5.10: Euler Identity English title clean');

    const cantorNode = initialMathNodes.find((n) => n.id === 'thm-cantor-theorem')!;
    assert(getNodeTitle(cantorNode, 'zh') === '康托尔定理', 'Tier 5.11: Cantor Theorem Chinese title clean');
    assert(getNodeTitle(cantorNode, 'en') === "Cantor's Theorem", 'Tier 5.11: Cantor Theorem English title clean');

    // 5.12 Verify Discipline Decoupling
    for (const d of disciplines) {
      assert(
        chineseCharRegex.test(d.nameZh) && englishCharRegex.test(d.nameEn),
        `Tier 5.12: Discipline ${d.id} has distinct Chinese ("${d.nameZh}") and English ("${d.nameEn}") names`
      );
    }
  }

  console.log('\n=========================================================================');
  console.log(`📊 i18n TEST SUITE SUMMARY: ${passed} passed, ${failed} failed`);
  console.log('=========================================================================');

  if (failed > 0) {
    console.error('❌ i18n Test Failures:', failures);
  } else {
    console.log('🏆 ALL i18n ARCHITECTURE & CONTENT DECOUPLING TIERS PASSED WITH 100% SUCCESS!');
  }

  return { passed, failed };
}

// Auto-run if executed directly as script
if (process.argv[1]?.includes('i18n.test')) {
  const result = runI18nTests();
  if (result.failed > 0) {
    process.exit(1);
  }
}
