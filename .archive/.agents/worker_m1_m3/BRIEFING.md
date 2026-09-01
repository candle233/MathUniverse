# BRIEFING — 2026-08-29T12:52:30+08:00

## Mission
Complete Milestones M1, M2, and M3: Implement i18n architecture across 13 namespaces with 100% key parity, decouple mathematical content & domain schemas into pure Chinese and English fields, fix form state binding, and localize full-spectrum UI components.

## 🔒 My Identity
- Archetype: worker
- Roles: implementer, qa, specialist
- Working directory: c:/Users/Mechrevo/Downloads/math-proj/.agents/worker_m1_m3
- Original parent: 7e9390cd-5015-4406-8587-41cff9f6ebc6
- Milestone: M1, M2, M3

## 🔒 Key Constraints
- ESM import in `src/i18n/locales/en.ts` must use explicit `.ts` extension: `import type { TranslationDict } from '../types.ts'`.
- 100% key parity across all 13 translation namespaces between `zh.ts` and `en.ts`.
- Pure Chinese (`titleZh`, `nameZh`) and English (`titleEn`, `nameEn`) separation without parenthetical clumping.
- Input fields in `NodeDetailClient.tsx` must bind to `newRefForm`.
- Genuine implementation with no hardcoded test shortcuts or dummy facades.

## Current Parent
- Conversation ID: 7e9390cd-5015-4406-8587-41cff9f6ebc6
- Updated: 2026-08-29T12:52:30+08:00

## Task Summary
- **What to build**: Milestones M1, M2, and M3.
- **Success criteria**: 0 test failures in `npm test`, 0 type errors in `npx tsc --noEmit`, clean production compilation in `npm run build`, and 100% key parity across 13 translation namespaces.
- **Interface contracts**: `PROJECT.md`, `src/i18n/types.ts`, `src/types/math.ts`, `src/types/campaign.ts`, `src/types/fallacy.ts`.

## Key Decisions Made
- Expanded `TranslationDict` to cover all 13 namespaces (`nav`, `hero`, `graph`, `lean`, `community`, `editor`, `admin`, `sandbox`, `zfc`, `fallacy`, `exportStudio`, `common`, `footer`) totaling 278 keys.
- Decoupled parenthetical English from `titleZh` across all 21 mathematical seed nodes in `seedData.ts`, `disciplines.ts`, `campaignEngine.ts`, `fallacyEngine.ts`.
- Enriched all 21 seed nodes with rigorous `statementPlainEn`, `intuitionEn`, `historicalContextZh`, and `historicalContextEn`.
- Bound `NodeDetailClient.tsx` custom reference form inputs to `newRefForm.title`, `newRefForm.authors`, `newRefForm.year`.
- Localized `Navbar.tsx`, `Footer.tsx`, `GlobalSearchModal.tsx`, `BookmarkDrawer.tsx`, `NodeDetailClient.tsx`, `Cosmos3DGraph.tsx`.

## Change Tracker
- **Files modified**:
  - `src/i18n/types.ts`: Expanded to 13 namespaces.
  - `src/i18n/locales/zh.ts`: Added Chinese translations for 13 namespaces.
  - `src/i18n/locales/en.ts`: Added English translations with ESM import and 100% parity.
  - `src/types/math.ts`: Added bilingual fields to `MathNode`, `Proof`, `ProofStep`.
  - `src/types/campaign.ts` & `src/types/fallacy.ts`: Added bilingual fields to campaign/fallacy models.
  - `src/lib/i18nHelper.ts` & `src/lib/utils.ts`: Added locale-aware getters and metadata formatters.
  - `src/data/seedData.ts` & `src/data/disciplines.ts`: Cleaned parenthetical titles and added bilingual content.
  - `src/lib/campaignEngine.ts` & `src/lib/fallacyEngine.ts`: Cleaned parenthetical names and added English names.
  - `src/components/node/NodeDetailClient.tsx`: Bound form state to `newRefForm` and localized tabs/panels.
  - `src/components/layout/Navbar.tsx`: Added localized navigation and language toggle.
  - `src/components/layout/Footer.tsx`: Localized matrix links.
  - `src/components/layout/GlobalSearchModal.tsx`: Localized spotlight search.
  - `src/components/layout/BookmarkDrawer.tsx`: Localized bookmarks drawer and Markdown export.
  - `src/components/graph/Cosmos3DGraph.tsx`: Localized 3D canvas labels, floating inspector, and trajectory.
- **Build status**: Pass (643/643 tests passed, 0 TypeScript errors, 30/30 pages statically built).
- **Pending issues**: None.

## Quality Status
- **Build/test result**: Pass (643/643 assertions passed).
- **Lint status**: 0 violations.
- **Tests added/modified**: Verified against unified test runner and adversarial test suites.
