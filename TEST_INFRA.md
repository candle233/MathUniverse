# E2E Test Infra: MathUniverse i18n & Verification

## Test Philosophy
- Requirement-driven, opaque-box and contract-driven verification.
- 4-Tier test suite structure covering feature isolation, boundaries, cross-feature interactions, and full platform application scenarios.

## Feature Inventory
| # | Feature | Source | Tier 1 | Tier 2 | Tier 3 |
|---|---------|--------|:------:|:------:|:------:|
| 1 | LanguageContext & Hook | ORIGINAL_REQUEST R1 | 5 | 5 | ✓ |
| 2 | Key Path & Interpolation | ORIGINAL_REQUEST R1 | 5 | 5 | ✓ |
| 3 | Dictionary Key Parity | ORIGINAL_REQUEST R1/R4 | 5 | 5 | ✓ |
| 4 | MathNode Decoupling | ORIGINAL_REQUEST R2 | 5 | 5 | ✓ |
| 5 | Seed Data Cleanliness | ORIGINAL_REQUEST R2 | 5 | 5 | ✓ |
| 6 | Accessor Helper Fallbacks | ORIGINAL_REQUEST R2 | 5 | 5 | ✓ |
| 7 | UI Component Localization | ORIGINAL_REQUEST R3 | 5 | 5 | ✓ |
| 8 | ZFC & Fallacy Localization | ORIGINAL_REQUEST R3 | 5 | 5 | ✓ |
| 9 | Academic Export Localization | ORIGINAL_REQUEST R3 | 5 | 5 | ✓ |
| 10 | Next.js Production Compilation | ORIGINAL_REQUEST R4 | 5 | 5 | ✓ |

## Test Architecture
- **Test Runner**: Node 24 native type-stripping ESM runner (`node --experimental-strip-types tests/runTests.ts`).
- **Test Locations**: `tests/i18n.test.ts`, `tests/e2ePlatformIntegration.test.ts`, `tests/runTests.ts`.
- **Pass Semantics**: All test assertions must pass with exit code 0.

## Real-World Application Scenarios (Tier 4)
| # | Scenario | Features Exercised | Complexity |
|---|----------|--------------------|------------|
| 1 | Bilingual Exploration & Theme/Language Toggle | Locale Switcher, Navbar, Hero, 3D Cosmos, Seed Data | Medium |
| 2 | Mathematical Theorem Deep Dive & Lean Formal Proof | Node Detail, Tabbed Intuition/Statement, Lean Web Prover, Certificate | High |
| 3 | ZFC Campaign Axiom Unlock & Derivation Quest | ZFC Quest, Epochs, Synthesizer, XP calculation | High |
| 4 | Fallacy Detective Forensics Lab Accusation Flow | Fallacy Lab, Step Accusation, Refutation, Score | High |
| 5 | Full Academic Export Compilation (LaTeX, Typst, Beamer) | Academic Export Studio, Prerequisite Closure, Multilingual Content | High |

## Coverage Thresholds
- Tier 1: ≥5 per feature (50+ feature tests)
- Tier 2: ≥5 per feature (boundary and fallback cases)
- Tier 3: Pairwise combinations across language switches, storage states, and component rendering
- Tier 4: 5 realistic end-to-end platform workflows
