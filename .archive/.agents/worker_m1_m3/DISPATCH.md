## 2026-08-29T04:43:47Z

Worker 1 (Implementation Track Lead) Dispatch:
Mission: Implement Milestones M1, M2, and M3:
1. Fix ESM import in `src/i18n/locales/en.ts` (import from `../types.ts`).
2. Expand `src/i18n/types.ts`, `src/i18n/locales/zh.ts`, and `src/i18n/locales/en.ts` to include all 13 namespaces with 100% key parity (nav, hero, graph, lean, community, editor, admin, sandbox, zfc, fallacy, exportStudio, common, footer).
3. Ensure `src/context/LanguageContext.tsx` handles nested key resolution, interpolation (`{param}`), HTML `lang` attribute, localStorage `mathuniverse:user-locale`, and custom event `mathuniverse:locale-changed`.
4. Update `src/types/math.ts`, `src/types/campaign.ts`, `src/types/fallacy.ts` with optional bilingual fields (`statementPlainEn`, `statementPlainZh`, `intuitionEn`, `intuitionZh`, `historicalContextEn`, `historicalContextZh`, `explanationEn`, `explanationZh`, `proofSteps`).
5. Fix form state in `src/components/node/NodeDetailClient.tsx` (bind to `newRefForm`).
6. Update `src/lib/i18nHelper.ts` and `src/lib/utils.ts` to cleanly decouple bilingual labels and provide fallback logic.
7. Decouple parenthetical clumping in `src/data/seedData.ts`, `src/data/disciplines.ts`, `src/lib/campaignEngine.ts`, `src/lib/fallacyEngine.ts` into pure Chinese `titleZh` / `nameZh` and pure English `titleEn` / `nameEn`.
8. Integrate `useLanguage` / `t` and `i18nHelper` across UI components (`Navbar.tsx` language switcher, `Footer.tsx`, `GlobalSearchModal.tsx`, `BookmarkDrawer.tsx`, `NodeDetailClient.tsx`, `Cosmos3DGraph.tsx`, `LeanWebEditor.tsx`, `AcademicExportStudio.tsx`, `ZfcCampaignQuest.tsx`, `FallacyDetectiveLab.tsx`, `BlockEditor.tsx`, `PullRequestViewer.tsx`, etc.).
9. Verify your code with `npm test` and `npx tsc --noEmit` / `npm run build`.
10. Write your handoff report to `c:/Users/Mechrevo/Downloads/math-proj/.agents/worker_m1_m3/handoff.md` and send a message to parent.
