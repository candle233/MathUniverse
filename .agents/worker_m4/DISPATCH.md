## 2026-08-29T03:10:00Z
You are Worker 4 for Milestone 4 (M4: Academic Publishing & Toolchain Exporter) of the MathUniverse platform expansion project.

Working directory: c:/Users/Mechrevo/Downloads/math-proj/.agents/worker_m4
Project scope document: c:/Users/Mechrevo/Downloads/math-proj/PROJECT.md
Original request path: c:/Users/Mechrevo/Downloads/math-proj/.agents/ORIGINAL_REQUEST.md
Survey report: c:/Users/Mechrevo/Downloads/math-proj/.agents/explorer_survey_3/handoff.md

Your exclusive write ownership:
- src/types/export.ts
- src/lib/exportEngine.ts
- src/components/export/AcademicExportStudio.tsx
- src/components/math/TikzStudio.tsx
- 	ests/runTests.ts

Mission & Deliverables:
1. Export Engine Types & Architecture (src/types/export.ts, src/lib/exportEngine.ts):
   - Define export options (ExportFormat, ExportOptions, ExportDocumentResult).
   - Implement recursive prerequisite compilation (getOrderedPrerequisiteNodes): uses getTransitivePrerequisites and 	opologicalSort to assemble the full prerequisite theorem tree ordered logically from foundational axioms/definitions to the final theorem.
   - Implement generateLatexPaper: generates complete, compilable AMS-LaTeX documents (\documentclass[11pt,a4paper]{article}, msmath, amssymb, amsthm, mathtools, tikz-cd, listings, hyperref, xcolor), theorem environments, Lean 4 code listings, prerequisite theorem sections, proofs, and generated TikZ dependency diagrams.
   - Implement generateTypstDoc: generates clean, modern Typst 0.11+ documents (#set page, #set text, #rect axiom/theorem boxes, #block proof containers, native math equations $ ... $, prerequisite sections).
   - Implement generateBeamerPresentation: generates complete LaTeX Beamer presentation slides (\documentclass{beamer}, \usetheme{Madrid}, structured frames for motivation, formal statement, prerequisite lemmas, step-by-step proofs).
   - Implement generateMarkdownDoc: generates Quarto / Academic Markdown (.qmd / .md) with YAML frontmatter, math delimiters $$ ... , and prerequisite hierarchy.
   - Implement generateOverleafUrl: generates 1-click cloud Overleaf integration URL / form payloads.
   - Implement standalone diagram generators for TikZ commutative diagrams (	ikz-cd), natural deduction proof trees (ussproofs), and DAG flowcharts.
2. Academic Export Studio UI (src/components/export/AcademicExportStudio.tsx):
   - Interactive UI with target theorem selection, export format switching (LaTeX Article, Typst 0.11, Beamer Slides, Quarto Markdown, TikZ-cd Diagrams, Overleaf Cloud), configuration toggles (include prerequisite tree, include Lean 4 code, include intuition notes), code syntax preview, Copy to Clipboard, Download File buttons, and 1-click Open in Overleaf button.
3. Verification & Testing:
   - Enhance unit tests in 	ests/runTests.ts (extend Test Group 5 or add new group) with comprehensive checks for LaTeX, Typst, Beamer, Markdown, and Overleaf generators across multiple theorem nodes (e.g. Stokes, FTC, Heine-Borel, Cauchy-Schwarz, Fermat).
   - Run 
pm test, 
px tsc --noEmit, and 
pm run build in the terminal to verify all tests pass and zero build errors.
