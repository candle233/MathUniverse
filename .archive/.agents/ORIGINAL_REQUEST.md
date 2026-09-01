# Original User Request

## 2026-08-29T04:38:29Z

MathUniverse is an open-source mathematical knowledge base and formal verification platform. This project implements a comprehensive internationalization (i18n) architecture that cleanly separates Chinese and English content, providing seamless dynamic locale switching across all mathematical theorems, UI components, formal verification tools, 3D visualizations, and export workflows.

Working directory: c:/Users/Mechrevo/Downloads/math-proj
Integrity mode: demo

## Requirements

### R1. Core i18n Architecture & Localization Context
Implement a high-performance, client-side and SSR-safe React i18n engine with LanguageContext and useLanguage() hook. Provide structured JSON/TypeScript dictionaries for Simplified Chinese (zh-CN) and English (en-US) supporting key-based translation, parameterized string interpolation, and persistent user locale preference in localStorage. Add an interactive language switcher widget (🌐 简体中文 / English) in the navigation bar.

### R2. Mathematical Content & Node Data Bilingual Decoupling
Decouple and isolate bilingual content across all mathematical entities (MathNode, Discipline, ProofStep, HistoricalContext, CampaignEra, FallacyCase). Dynamically render purely the active locale's text (titles, formal statements, intuitive explanations, history, and proof descriptions) rather than cluttered bilingual mixtures, while preserving mathematical symbols and LaTeX expressions intact.

### R3. Full-Spectrum UI & Visual Component Localization
Localize all views and interactive modules:
- Navigation bar, footer, search modal, bookmark drawer, and role switchers.
- 3D Knowledge Cosmos HUD, node inspection drawer, and filter controls.
- Lean 4 interactive verification workspace, tactic simulator, and theorem cards.
- Community PR moderation, review desk, and block markdown/LaTeX editor.
- WASM compute sandbox, parameter sliders, and 2D/3D plot canvases.
- ZFC axiom progression campaign and Fallacy Detective interactive puzzles.
- Admin dashboard, dynamic page builder, and academic export configurations.

### R4. Automated Testing, Key Parity & Verification
Develop comprehensive test suites verifying:
- Complete key parity between zh and en translation dictionaries (0 missing keys).
- Locale switching reactivity and fallback safety for missing or undefined translations.
- Clean Next.js compilation (npm run build) and 100% test pass rate (npm test).

## Acceptance Criteria

### Automated Verification & Integrity
- [ ] All TypeScript types, i18n dictionaries, and components compile cleanly with npm run build with 0 type errors.
- [ ] All existing test suites and new i18n unit tests pass 100% (npm test).
- [ ] Dictionary parity tests verify that all keys defined in Chinese exist in English with valid translations.

### Interactive & Localization Functionality
- [ ] Language switcher in Navbar toggles between Chinese and English smoothly without page reload or state disruption.
- [ ] Mathematical nodes render clean English or Chinese without redundant bilingual repetition when viewing detail pages and 3D graph tooltips.
- [ ] All interactive labs (3D Cosmos, Lean 4, Compute Engine, Fallacy Detective, ZFC Quest, Admin Studio) adapt their UI text to the selected locale.
