# Project: MathUniverse i18n Architecture & Decoupling

## Architecture
- **Framework**: Next.js 15 (React 19, TypeScript 5.7, Tailwind CSS, KaTeX).
- **Core i18n Engine**: `src/context/LanguageContext.tsx` with `LanguageProvider`, `useLanguage()`, `localStorage` key `'mathuniverse:user-locale'`, custom window event `'mathuniverse:locale-changed'`, and nested key interpolation `t(path, params)`.
- **Localization Dictionaries**: `src/i18n/types.ts`, `src/i18n/locales/zh.ts`, `src/i18n/locales/en.ts` with 13 namespaces (`nav`, `hero`, `graph`, `lean`, `community`, `editor`, `admin`, `sandbox`, `zfc`, `fallacy`, `exportStudio`, `common`, `footer`) and 278 translation keys with 100% parity.
- **Mathematical Entity Decoupling**: `src/types/math.ts`, `src/types/campaign.ts`, `src/types/fallacy.ts`, `src/data/seedData.ts`, `src/data/disciplines.ts`, `src/lib/i18nHelper.ts`.
- **UI Component Matrix**: `src/components/layout/`, `src/components/graph/`, `src/components/lean/`, `src/components/community/`, `src/components/editor/`, `src/components/export/`, `src/components/sandbox/`, `src/components/node/`, `src/components/math/`, and `src/app/` pages.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Core Language Context | Locale state ('zh'/'en'), persistence, event dispatch, HTML lang attribute sync | M1 | ORIGINAL_REQUEST R1 |
| 2 | Key Path Resolution & Interpolation | Nested dot-notation traversal and parameter substitution with fallback | M1 | ORIGINAL_REQUEST R1 |
| 3 | Navbar Language Switcher | Interactive language switcher button toggling between 简体中文 and English | M1 | ORIGINAL_REQUEST R1 |
| 4 | Type-Safe Translation Dictionaries | Complete parity across 13 namespaces for zh-CN and en-US | M1 | ORIGINAL_REQUEST R1 |
| 5 | MathNode Schema Decoupling | Bilingual fields (statementPlainEn/Zh, intuitionEn/Zh, historicalEn/Zh) in MathNode & ProofStep | M2 | ORIGINAL_REQUEST R2 |
| 6 | Seed Data Bilingual Separation | 21 seed nodes cleansed of parenthetical clumping with full English and Chinese prose | M2 | ORIGINAL_REQUEST R2 |
| 7 | Discipline & Category Decoupling | Pure Chinese & English labels for disciplines, node types, and verification badges | M2 | ORIGINAL_REQUEST R2 |
| 8 | ZFC Campaign & Fallacy Decoupling | Pure localized axiom titles, epoch badges, and fallacy case descriptions | M2 | ORIGINAL_REQUEST R2 |
| 9 | LaTeX & Symbol Preservation | Formulas and LaTeX strings kept untouched and locale-neutral | M2 | ORIGINAL_REQUEST R2 |
| 10 | Entity Accessor Helpers | i18n helper methods returning active locale text with safe fallbacks | M2 | ORIGINAL_REQUEST R2 |
| 11 | Layout & Navigation UI Localization | Navbar, Footer, SearchModal, BookmarkDrawer, Admin switcher | M3 | ORIGINAL_REQUEST R3 |
| 12 | 3D/2D Cosmos & Learning Tree Localization | 3D Cosmos HUD, flythrough controls, star chart, topological skill tree | M3 | ORIGINAL_REQUEST R3 |
| 13 | Lean 4 Lab & Verification UI | Lean editor, tactic simulator, tactics deck, Mathlib finder, certificate | M3 | ORIGINAL_REQUEST R3 |
| 14 | Community & Editor UI | PR review desk, propose revision modal, Notion-style block editor, symbol studio | M3 | ORIGINAL_REQUEST R3 |
| 15 | Compute Sandbox & Sliders UI | Python/SymPy sandbox, compute engine, parameter sliders, 2D/3D plots, verification panel | M3 | ORIGINAL_REQUEST R3 |
| 16 | Auxiliary Labs & Game Quest UI | ZFC Quest, Fallacy Lab, dynamical systems, commutative diagrams, counterexamples, flashcards | M3 | ORIGINAL_REQUEST R3 |
| 17 | Admin Console & Academic Export Studio | Page assembler, DAG health audit, AMS-LaTeX / Typst / Beamer export studio | M3 | ORIGINAL_REQUEST R3 |
| 18 | 100% Dictionary Key Parity Testing | Test asserting 0 missing keys and 1:1 bidirectional structure match | M4 | ORIGINAL_REQUEST R4 |
| 19 | Locale Reactivity & Fallback Testing | Test validating persistence, event handling, interpolation, and fallbacks | M4 | ORIGINAL_REQUEST R4 |
| 20 | Zero TypeScript Compiler Errors | `npx tsc --noEmit` and `npm run build` pass with 0 errors | M4 | ORIGINAL_REQUEST R4 |
| 21 | Full Platform Test Suite Execution | 100% pass rate on `npm test` across all unit, integration, and E2E test groups | M4 | ORIGINAL_REQUEST R4 |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Core i18n Architecture & Dictionaries | `src/i18n/types.ts`, `src/i18n/locales/zh.ts`, `src/i18n/locales/en.ts`, `src/context/LanguageContext.tsx`, `src/components/layout/Navbar.tsx` | none | DONE |
| M2 | Math Content & Node Data Decoupling | `src/types/math.ts`, `src/types/campaign.ts`, `src/types/fallacy.ts`, `src/data/seedData.ts`, `src/data/disciplines.ts`, `src/lib/campaignEngine.ts`, `src/lib/fallacyEngine.ts`, `src/lib/i18nHelper.ts`, `src/lib/utils.ts` | M1 | DONE |
| M3 | Full-Spectrum UI & Component Localization | `src/components/layout/*`, `src/components/graph/*`, `src/components/lean/*`, `src/components/community/*`, `src/components/editor/*`, `src/components/export/*`, `src/components/sandbox/*`, `src/components/node/*`, `src/components/math/*`, `src/app/*` | M1, M2 | DONE |
| M4 | Comprehensive Testing, Parity & Verification | `tests/i18n.test.ts`, `tests/runTests.ts`, `tests/e2ePlatformIntegration.test.ts`, `npm test`, `npm run build` | M1, M2, M3 | DONE |

## Interface Contracts
### LanguageContext ↔ All Components
- `useLanguage(): { locale: 'zh' | 'en'; setLocale: (l: 'zh' | 'en') => void; toggleLocale: () => void; isZh: boolean; isEn: boolean; t: (path: string, params?: Record<string, string | number>) => string }`

### i18nHelper ↔ Math Entities
- `getNodeTitle(node: MathNode, locale: Locale): string`
- `getNodeStatement(node: MathNode, locale: Locale): string`
- `getNodeIntuition(node: MathNode, locale: Locale): string`
- `getNodeHistorical(node: MathNode, locale: Locale): string`
- `getNodeProofDescription(node: MathNode, locale: Locale): string`
- `getDisciplineName(discipline: MathDiscipline, locale: Locale): string`
- `getNodeTypeLabel(type: NodeType, locale: Locale): string`

## Code Layout
- `src/i18n/`: Translation dictionary definitions (`types.ts`, `locales/zh.ts`, `locales/en.ts`).
- `src/context/`: React context providers (`LanguageContext.tsx`).
- `src/types/`: Domain TypeScript type definitions (`math.ts`, `campaign.ts`, `fallacy.ts`, `export.ts`, `sandbox.ts`).
- `src/data/`: Static seed datasets (`seedData.ts`, `disciplines.ts`).
- `src/lib/`: Business logic engines & helpers (`i18nHelper.ts`, `utils.ts`, `campaignEngine.ts`, `fallacyEngine.ts`, `dagEngine.ts`, `exportEngine.ts`, `mathCompute.ts`, `customPageEngine.ts`).
- `src/components/`: Modular React components.
- `src/app/`: Next.js App Router entry points and routes.
- `tests/`: Automated test suites (`runTests.ts`, `i18n.test.ts`, `i18n_stress_chaos.test.ts`, etc.).
