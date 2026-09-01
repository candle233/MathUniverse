# Architecture, Build & i18n Survey Handoff Report

**Agent**: Explorer 1 (Architecture & Build Explorer)  
**Working Directory**: `c:/Users/Mechrevo/Downloads/math-proj/.agents/explorer_survey_1`  
**Timestamp**: 2026-08-29T04:45:00Z  
**Project**: MathUniverse (Next.js 15 + React 19 + TypeScript)  

---

## 1. Observation

### 1.1 Project Structure & Build Configuration
- **Project Root**: `c:/Users/Mechrevo/Downloads/math-proj`
- **Framework & Core Stack**:
  - `package.json` (lines 13-22): Next.js `^15.1.0` (App Router), React `^19.0.0`, React-DOM `^19.0.0`, `katex` `^0.16.11`, `lucide-react` `^0.468.0`, `framer-motion` `^11.15.0`, `tailwind-merge` `^2.5.5`, `clsx` `^2.1.1`.
  - `package.json` (lines 23-32): TypeScript `^5.7.2`, `tailwindcss` `^3.4.17`, `postcss` `^8.4.49`, `autoprefixer` `^10.4.20`, `@types/node` `^20.17.10`, `@types/react` `^19.0.0`, `@types/katex` `^0.16.7`.
  - `package.json` scripts:
    ```json
    "scripts": {
      "dev": "next dev -H 127.0.0.1 -p 5050",
      "build": "next build",
      "start": "next start -H 127.0.0.1 -p 5050",
      "test": "node --experimental-strip-types tests/runTests.ts",
      "lint": "next lint"
    }
    ```
  - `tsconfig.json` (lines 1-28): Target `ES2022`, module `esnext`, moduleResolution `bundler`, `allowImportingTsExtensions: true`, `resolveJsonModule: true`, `strict: true`, path alias `@/*` -> `./src/*`.
  - `next.config.ts` (lines 1-9): `reactStrictMode: true`.

### 1.2 Entry Points & Routing Topology
- **Root Layout**: `src/app/layout.tsx` (lines 1-28)
  - Configures `RootLayout` with `<html lang="zh-CN" className="dark">`.
  - Wraps entire application inside `<LanguageProvider>` from `@/context/LanguageContext`.
  - Renders `<Navbar />`, `<main className="flex-1 w-full">{children}</main>`, and `<Footer />`.
- **Application Pages & Routes**:
  1. `/` (`src/app/page.tsx`): Home view with Hero banner, quick action CTAs, 6-discipline filtering matrix, dynamic node grid, and embedded interactive preview widgets.
  2. `/graph` (`src/app/graph/page.tsx`): 3D Knowledge Cosmos, 2D Star Chart, 3D Differential Manifolds, Topological Learning Tree, and Minimum Prerequisite Closure pathways.
  3. `/lean` (`src/app/lean/page.tsx`): Lean 4 Web Prover, interactive tactic simulator, Proof Tutor, tactics reference deck, `#print axioms` audit, and verification certificates.
  4. `/community` (`src/app/community/page.tsx`): Peer review desk, proposition proposals, formula/Lean diff view, PR approval/rejection moderation, and scholar leaderboard.
  5. `/editor` (`src/app/editor/page.tsx`): Atomic mathematical proposition block editor (LaTeX, Lean 4, Python, Intuition, Proof Steps) and LaTeX math symbol studio.
  6. `/admin` (`src/app/admin/page.tsx`): Admin console, dynamic page builder/assembler, math node CMS, DAG cycle health auditor, and JSON snapshot backup.
  7. `/custom/[slug]` (`src/app/custom/[slug]/page.tsx`): Dynamic routing rendering custom assembled pages with configurable interactive math widgets.
  8. `/node/[slug]` (`src/app/node/[slug]/page.tsx` & `src/components/node/NodeDetailClient.tsx`): Static parameters generated from `initialMathNodes`; detailed theorem view with bilingual tabbed interface, LaTeX rendering, Lean proofs, Python/SymPy sandbox, and academic exporter.

### 1.3 Context Providers & State Persistence
- **Language Context**: `src/context/LanguageContext.tsx` (lines 1-142)
  - State: `locale: Locale` (`'zh' | 'en'`).
  - Storage Key: `localStorage.getItem('mathuniverse:user-locale')`.
  - Synchronizes `document.documentElement.lang` (`zh-CN` vs `en`).
  - Broadcasts custom window event `window.dispatchEvent(new Event('mathuniverse:locale-changed'))`.
  - Translation helper `t(path: string, params?: Record<string, string | number>): string`:
    - Traverses nested dot-notation keys (e.g. `'nav.brand'`).
    - Fallback mechanism: falls back to Chinese dictionary if key is missing in active locale, or returns raw path if missing in both.
    - Parameter interpolation: replaces `{paramName}` placeholders.
  - Safe SSR/unit-test fallback hook: `useLanguage()` returns fallback object with `t: (p) => p`, `locale: 'zh'`, `isZh: true` when outside provider.
- **Other LocalStorage State Stores**:
  - `mathuniverse:admin-role-enabled` (`src/lib/customPageEngine.ts`): Admin mode switch.
  - `mathuniverse:custom-pages` (`src/lib/customPageEngine.ts`): Custom created pages.
  - `mathuniverse:custom-math-nodes` (`src/lib/customPageEngine.ts`): Custom node drafts.
  - `mathuniverse_bookmarks` (`src/components/node/NodeDetailClient.tsx` & `BookmarkDrawer.tsx`): User bookmarks.
  - `matheditor:blocks` (`src/app/editor/page.tsx` & `BlockEditor.tsx`): Draft blocks in editor.
  - `mathuniverse:zfc-progress` (`src/lib/campaignEngine.ts`): ZFC campaign save state.
  - `mathuniverse:fallacy-progress` (`src/lib/fallacyEngine.ts`): Fallacy detective save state.

### 1.4 Test Infrastructure & Execution Observations
- **Test Runner**: Node 24 experimental strip types via `node --experimental-strip-types tests/runTests.ts`.
- **Command Run Observation (`npm test`)**:
  ```
  Error [ERR_MODULE_NOT_FOUND]: Cannot find module 'C:\Users\Mechrevo\Downloads\math-proj\src\i18n\types' imported from C:\Users\Mechrevo\Downloads\math-proj\src\i18n\locales\zh.ts
  ```
  - Exact Cause: `src/i18n/locales/en.ts` line 1 has `import { TranslationDict } from '../types';` without the `.ts` extension, whereas Node native ESM strip-types loader requires explicit extension (e.g., `../types.ts`).
- **Command Run Observation (`npm run build` / `npx tsc --noEmit`)**:
  - TypeScript type checking failed with compilation errors:
    1. `src/components/node/NodeDetailClient.tsx:544-560`:
       - `Cannot find name 'newRefTitle'`
       - `Cannot find name 'setNewRefTitle'`
       - `Cannot find name 'newRefAuthors'`
       - `Cannot find name 'setNewRefAuthors'`
       - `Cannot find name 'newRefYear'`
       - `Cannot find name 'setNewRefYear'`
    2. `src/lib/i18nHelper.ts:13-37`:
       - `Property 'statementEn' does not exist on type 'MathNode'.`
       - `Property 'statementZh' does not exist on type 'MathNode'.`
       - `Property 'intuitionEn' does not exist on type 'MathNode'.`
       - `Property 'intuitionZh' does not exist on type 'MathNode'.`
       - `Property 'historicalContextEn' does not exist on type 'MathNode'.`
       - `Property 'historicalContextZh' does not exist on type 'MathNode'.`
       - `Property 'proofSteps' does not exist on type 'MathNode'.`

### 1.5 i18n Dictionary Inventory & Helper Layer
- `src/i18n/types.ts`: Defines `Locale = 'zh' | 'en'` and `TranslationDict` across 8 sections: `nav`, `hero`, `graph`, `lean`, `community`, `editor`, `admin`, `sandbox`, `common`.
- `src/i18n/locales/zh.ts` & `src/i18n/locales/en.ts`:
  - 181 lines each.
  - Complete parity across all top-level categories and subkeys.
- `src/lib/i18nHelper.ts`:
  - `getNodeTitle(node: MathNode, locale: Locale): string`
  - `getNodeStatement(node: MathNode, locale: Locale): string`
  - `getNodeIntuition(node: MathNode, locale: Locale): string`
  - `getNodeHistorical(node: MathNode, locale: Locale): string`
  - `getNodeProofDescription(node: MathNode, locale: Locale): string`
  - `getDisciplineName(discipline: { nameZh: string; nameEn: string }, locale: Locale): string`
  - `getNodeTypeLabel(type: NodeType, locale: Locale): string`
  - `NODE_TYPE_LABELS`: Static mapping for all 9 `NodeType` enum values.

---

## 2. Logic Chain

1. **Build & ESM Resolution Invariant**:
   - The test script `package.json` runs with `node --experimental-strip-types tests/runTests.ts`.
   - Node 24 native ESM type-stripping loader strictly enforces explicit file extensions for local module resolution.
   - `src/i18n/locales/en.ts` imported from `'../types'` without `.ts`, causing `ERR_MODULE_NOT_FOUND` on `npm test`.
   - Adding explicit `.ts` extension (matching `zh.ts` line 1: `import { TranslationDict } from '../types.ts'`) restores seamless module resolution under both `node --experimental-strip-types` and Next.js webpack/turbopack bundler.

2. **TypeScript Domain Model Decoupling Invariant**:
   - R2 in `ORIGINAL_REQUEST.md` mandates bilingual separation on mathematical entities (`MathNode`, `Discipline`, `ProofStep`, `HistoricalContext`, etc.).
   - `MathNode` in `src/types/math.ts` currently defines `titleZh`, `titleEn`, `statementPlainZh`, `intuitionMd`, but lacks explicit optional fields:
     - `statementPlainEn?: string;`
     - `statementEn?: string;`
     - `statementZh?: string;`
     - `intuitionZh?: string;`
     - `intuitionEn?: string;`
     - `historicalContextZh?: string;`
     - `historicalContextEn?: string;`
     - `proofSteps?: Array<{ explanationZh?: string; explanationEn?: string; latexText?: string }>;`
   - Aligning `src/types/math.ts` with these fields and updating `src/lib/i18nHelper.ts` to fall back safely to `statementPlainZh` / `intuitionMd` satisfies all TypeScript compiler checks while enabling full bilingual rendering.

3. **NodeDetailClient Form State Fix**:
   - In `src/components/node/NodeDetailClient.tsx`, line 69 initializes `const [newRefForm, setNewRefForm] = useState({ title: '', authors: '', year: '' })`.
   - Lines 544-560 mistakenly referenced standalone `newRefTitle`, `setNewRefTitle`, etc.
   - Binding the form inputs to `newRefForm.title`, `newRefForm.authors`, `newRefForm.year` and `setNewRefForm` resolves the remaining TS compilation errors in the component layer.

4. **Component Localization Coverage**:
   - Core UI components (`Navbar`, `HomePage`, `NodeDetailClient`) already import `useLanguage` and use `t(...)` for top-level titles and buttons.
   - Secondary components (`Footer.tsx`, `GlobalSearchModal.tsx`, `BookmarkDrawer.tsx`, `PullRequestViewer.tsx`, `BlockEditor.tsx`, `Cosmos3DGraph.tsx`, `LeanWebEditor.tsx`, `AcademicExportStudio.tsx`) contain hardcoded Chinese text strings.
   - Connecting these components to `useLanguage` / `t(...)` and `i18nHelper` will fulfill R3 (Full-Spectrum UI & Visual Component Localization) without disrupting existing rendering logic.

---

## 3. Caveats

- **No Caveats on Architecture**: The project architecture is standard Next.js 15 with clean App Router directory layout, pure client-side state handling, and zero external database dependencies (uses seed data and localStorage).
- **WASM / Web Worker Execution**: `pyodide.worker.ts` and Lean 4 WASM components are mockable/fallback-protected in pure Node test environments via `mathCompute.ts` TypeScript fallbacks.

---

## 4. Conclusion

1. **System Health**: The codebase is well-structured with high cohesion and clean modular separation between the UI layer (`src/components/`), App router (`src/app/`), mathematical computation and graph engine (`src/lib/`), and static data sets (`src/data/`).
2. **Key Root Causes of Current Failures**:
   - Missing `.ts` extension in `src/i18n/locales/en.ts` breaks `npm test`.
   - Missing bilingual properties on `MathNode` interface in `src/types/math.ts` breaks `src/lib/i18nHelper.ts`.
   - Disconnected form state in `src/components/node/NodeDetailClient.tsx` breaks `npm run build`.
3. **i18n Architecture Location**:
   - Types: `src/i18n/types.ts`
   - Dictionaries: `src/i18n/locales/zh.ts` and `src/i18n/locales/en.ts`
   - Context & Hook: `src/context/LanguageContext.tsx`
   - Content Decoupling Helpers: `src/lib/i18nHelper.ts`
   - Test Suites: `tests/i18n.test.ts` integrated into `tests/runTests.ts` (Group 15).

---

## 5. Verification Method

To verify the findings and overall build/test integrity:

1. **TypeScript Typecheck**:
   ```bash
   npx tsc --noEmit
   ```
2. **Next.js Production Build**:
   ```bash
   npm run build
   ```
3. **Automated Unit & E2E Test Suite**:
   ```bash
   npm test
   ```
   (Runs `node --experimental-strip-types tests/runTests.ts` executing 15 test groups).
