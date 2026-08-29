# UI & Requirement Specification and Localization Mining Report

## Observation
We thoroughly examined `ORIGINAL_REQUEST.md`, `PROJECT.md`, `src/` directory, components, pages, context, and existing i18n infrastructure.

Key observable facts and sources:
1. **`ORIGINAL_REQUEST.md` Requirements**:
   - **R1: Core i18n Architecture & Localization Context**: Client-side & SSR-safe React i18n engine via `LanguageContext` and `useLanguage()`. Structured dictionaries for Simplified Chinese (`zh-CN` / `zh`) and English (`en-US` / `en`) with key-based nested paths and parameter interpolation (`{count}`, `{name}`). Persistent user preference in `localStorage` (`mathuniverse:user-locale`) and language switcher (🌐 简体中文 / English) in `Navbar`.
   - **R2: Mathematical Content & Node Data Bilingual Decoupling**: Isolate bilingual content across all entities (`MathNode`, `Discipline`, `ProofStep`, `HistoricalContext`, `CampaignEra`, `FallacyCase`). Render active locale cleanly without bilingual concatenation, preserving mathematical symbols and LaTeX expressions.
   - **R3: Full-Spectrum UI & Visual Component Localization**: Localize navigation, footer, search modal, bookmark drawer, 3D Cosmos HUD/drawers/filters, Lean 4 workspace/tactic simulator/theorem cards, Community PR moderation/editor, WASM sandbox/sliders/canvas, ZFC campaign & Fallacy Detective puzzles, Admin dashboard & academic export configs.
   - **R4: Automated Testing, Key Parity & Verification**: 1:1 key parity between `zh` and `en` dictionaries (0 missing keys), fallback safety, clean `npm run build`, and 100% test pass rate (`npm test`).

2. **Existing i18n Codebase Status**:
   - `src/i18n/types.ts`: Defines `Locale = 'zh' | 'en'` and `TranslationDict` interface with 9 namespaces (`nav`, `hero`, `graph`, `lean`, `community`, `editor`, `admin`, `sandbox`, `common`).
   - `src/i18n/locales/zh.ts` & `src/i18n/locales/en.ts`: Initial dictionaries exist with 181 lines each, but need comprehensive extension to cover all newly discovered modules, tools, and widgets (e.g. `footer`, `zfc`, `fallacy`, `exportStudio`, `diagrams`, `timeline`, `practice`, `flashcards`).
   - `src/context/LanguageContext.tsx`: Implements `LanguageProvider`, `useLanguage()`, `localStorage` key `'mathuniverse:user-locale'`, `window.dispatchEvent('mathuniverse:locale-changed')`, nested key resolution, and parameter interpolation `{param}` with Chinese fallback.
   - `src/lib/i18nHelper.ts`: Provides helper functions (`getNodeTitle`, `getNodeStatement`, `getNodeIntuition`, `getNodeHistorical`, `getNodeProofDescription`, `getDisciplineName`, `getNodeTypeLabel`, `NODE_TYPE_LABELS`).

3. **Codebase Component & Page Inventory**:
   - `src/components/layout/`: `Navbar.tsx`, `Footer.tsx`, `GlobalSearchModal.tsx`, `BookmarkDrawer.tsx`.
   - `src/components/graph/`: `Cosmos3DGraph.tsx`, `KnowledgeStarChart.tsx`, `LearningPathTree.tsx`.
   - `src/components/lean/`: `LeanWebEditor.tsx`, `LeanTacticSimulator.tsx`, `LeanTacticsDeck.tsx`, `MathlibFinder.tsx`, `VerificationCertificate.tsx`.
   - `src/components/community/`: `PullRequestViewer.tsx`, `SubmitPrModal.tsx`.
   - `src/components/editor/`: `BlockEditor.tsx`, `LatexSymbolStudio.tsx`.
   - `src/components/export/`: `AcademicExportStudio.tsx`.
   - `src/components/node/`: `NodeDetailClient.tsx`.
   - `src/components/sandbox/`: `MathComputeEngine.tsx`, `PythonSandbox.tsx`, `ParameterSliders.tsx`, `Plot2DCanvas.tsx`, `Plot3DSurface.tsx`, `NodeVerificationPanel.tsx`.
   - `src/components/math/`: `ZfcCampaignQuest.tsx`, `FallacyDetectiveLab.tsx`, `DynamicalSystemsLab.tsx`, `ThreeMathSurface.tsx`, `TikzStudio.tsx`, `AiMathTranslator.tsx`, `CommutativeDiagramViewer.tsx`, `CounterExampleGallery.tsx`, `FormulaAssistant.tsx`, `LaTeXRenderer.tsx`, `MathFlashcardSystem.tsx`, `MathPracticeHub.tsx`, `MathTimeline.tsx`, `MscTreeExplorer.tsx`, `ProofTutorGame.tsx`, `ProofViewer.tsx`.
   - `src/app/`: `page.tsx` (Homepage), `admin/page.tsx` (Admin dashboard & page builder), `community/page.tsx`, `editor/page.tsx`, `graph/page.tsx`, `lean/page.tsx`, `node/[slug]/page.tsx`, `custom/[slug]/page.tsx`, `layout.tsx`.

---

## Features Discovered

| # | Category | Feature | Description | Inputs | Outputs | Error Behavior | Discovered Via |
|---|----------|---------|-------------|--------|---------|----------------|----------------|
| 1 | i18n Architecture | Dynamic Locale Switcher | Toggle between Simplified Chinese (`zh-CN`) and English (`en-US`) in Navbar and persists in `localStorage` | Click button `中 / EN` | Active locale changes, dispatches event, re-renders all UI | Falls back to browser language or `zh` if localStorage unavailable | `src/context/LanguageContext.tsx`, `src/components/layout/Navbar.tsx` |
| 2 | i18n Architecture | Nested Key Translation & Interpolation | Resolves nested dictionary paths (e.g. `nav.brand`, `hero.title`) and interpolates parameters like `{count}` | Path string `k1.k2`, optional params object | Translated string with substituted values | Returns original path string if missing in both target & fallback dictionary | `src/context/LanguageContext.tsx` |
| 3 | Content Decoupling | Entity Locale Selector Helpers | Extracts pure Chinese or pure English titles, statements, intuition, history, and proof descriptions without bilingual pollution | `MathNode`, `locale` | Pure localized string | Falls back to alternative language if target is empty | `src/lib/i18nHelper.ts` |
| 4 | Layout & Nav | Global Search Modal | Spotlight search modal with `Cmd+K` / `Ctrl+K` shortcut, filtering by titles, MSC, LaTeX, and tags | Search query string, keyboard arrows | Filtered node list with LaTeX formulas and MSC codes | Displays "未找到匹配的数学定理或命题" / localized empty hint | `src/components/layout/GlobalSearchModal.tsx` |
| 5 | Layout & Nav | Bookmark Drawer & Export | Slide-out drawer tracking saved nodes in localStorage with 1-click Markdown export | Bookmarked IDs in `localStorage` | Filtered node cards, downloadable `.md` file | Graceful empty state when no bookmarks saved | `src/components/layout/BookmarkDrawer.tsx` |
| 6 | Layout & Nav | Admin / Visitor Mode Switcher | Toggles admin privileges and unlocks custom page assembler and node CMS | Button click | Admin badges and controls displayed | Persists mode in localStorage | `src/components/layout/Navbar.tsx`, `src/lib/customPageEngine.ts` |
| 7 | Layout & Nav | Footer Academic Matrix | Comprehensive navigation to core tools, classic theorems, and external standards (Lean 4, Mathlib, MSC 2020, arXiv) | User click navigation | Target route / external link | Safe `noopener,noreferrer` for external links | `src/components/layout/Footer.tsx` |
| 8 | 3D Graph | 3D Knowledge Cosmos & Force Layout | WebGL / Canvas 3D particle simulation of 6 discipline nebulae with Coulomb repulsion & Hooke attraction | Graph nodes, orbital shells, target ID | Interactive 3D celestial sphere, orbit rotation | Bounds clamped, minimum distance guards against camera collapse | `src/components/graph/Cosmos3DGraph.tsx` |
| 9 | 3D Graph | Nebula Cruise & Camera Flythrough | Cinematic camera flythrough and focus on specific discipline nebulae or nodes | Nebula ID / Node ID | Smooth interpolated camera rotation, zoom, pan | Clamped zoom limits (0.35x - 3.8x) | `src/components/graph/Cosmos3DGraph.tsx` |
| 10 | 3D Graph | Minimum Prerequisite Closure HUD | Top-left HUD displaying closure readiness %, total prerequisites, unlearned nodes, and critical bottleneck gates | Target Node ID, known node IDs | Readiness bar, bottleneck alerts, step-by-step checklist | Renders 0% with full sequence if no known nodes | `src/components/graph/Cosmos3DGraph.tsx`, `src/lib/prerequisiteClosure.ts` |
| 11 | 2D Graph | Knowledge Star Chart with Viewport Streaming | 2D force-directed star canvas with dynamic viewport culling and prerequisite / dependent highlighting | Selected node ID, discipline filter | Interactive 2D graph with legend and node detail card | Graceful fallback when WebGL/Canvas resized | `src/components/graph/KnowledgeStarChart.tsx` |
| 12 | Learning Path | Hierarchical Topological Skill Tree | Cascading 3-tier filter (Discipline -> Subcategory -> Target Theorem) computing DAG skill path | Filter selections, completed nodes set | Step-by-step prerequisite progression cards | Recalculates dynamically when category changes | `src/components/graph/LearningPathTree.tsx` |
| 13 | Lean 4 Lab | Lean 4 Web Verification Editor | Browser-based Lean 4 code editor with simulation of proof state and #print axioms audit | Lean source code, theorem name | Proof state terminal, axioms integrity list, verification badge | Detects `sorry`/`admit` and flags as failed | `src/components/lean/LeanWebEditor.tsx` |
| 14 | Lean 4 Lab | Tactic State Machine Simulator | Step-by-step interactive simulator showing context hypotheses and goals transformation | Scenario ID, step index | Real-time hypotheses table & target goal box | Disabled next button when proof is completed | `src/components/lean/LeanTacticSimulator.tsx` |
| 15 | Lean 4 Lab | Tactics Mastery Deck | 10-card quick reference deck with usage conditions, code snippets, and 1-click code copying | Category filter, card index | Flashcard presentation with LaTeX and Lean code | Auto-resets index when category changes | `src/components/lean/LeanTacticsDeck.tsx` |
| 16 | Lean 4 Lab | Official Mathlib Finder | Searchable index of official Mathlib 4 lemmas with type signatures and module import paths | Query string | Filtered lemma cards with 1-click copy | Empty result message on no match | `src/components/lean/MathlibFinder.tsx` |
| 17 | Lean 4 Lab | Digital Verification Certificate | Formal verification certificate dialog with AST hash, axioms used, and printable layout | Verified node data | Full-screen formal certificate with watermark | Displays demo warning when unverified | `src/components/lean/VerificationCertificate.tsx` |
| 18 | Community | Peer Review PR Desk | Git-style PR review workbench with semantic LaTeX and code diff (red deletions, green additions) | Selected PR ID | Detailed PR view with reviewer feedback and voting | Disables voting once user has voted | `src/components/community/PullRequestViewer.tsx` |
| 19 | Community | Propose Revision PR Modal | Modal form for proposing amendments to LaTeX statement, intuition, or Lean code | Target node, target field, title, rationale, new text | Local PR draft stored in `localStorage` | Validates required fields before saving | `src/components/community/SubmitPrModal.tsx` |
| 20 | Community | Scholar Leaderboard & Reputation | Displays contributor rankings, reputations, and peer-review contribution metrics | Top scholars data | Ranked cards with medals (Gold, Silver, Bronze) | Display-only in demo mode | `src/app/community/page.tsx` |
| 21 | Block Editor | Notion-Style Block Editor | Modular content builder supporting Text, LaTeX, Lean, Intuition, Python, and Proof Step blocks | Content blocks array | Real-time rendered preview and drag/reorder controls | Prevents moving first block up or last block down | `src/components/editor/BlockEditor.tsx` |
| 22 | LaTeX Studio | High-Order Math Symbol Studio | Comprehensive categorized catalog of LaTeX symbols with copy-to-clipboard | Category filter, search query | Symbol cards with KaTeX preview and code snippet | Auto-clears copied toast after 1.5s | `src/components/editor/LatexSymbolStudio.tsx` |
| 23 | Academic Export | Multi-Target Academic Publishing Studio | Compiles target node and topological prerequisite closure into AMS-LaTeX, Typst 0.11+, Beamer, Quarto, TikZ, and Overleaf | Target node ID, export format, options | Formatted code preview, download file, Overleaf 1-click URL | Generates fallback minimal document if target node missing | `src/components/export/AcademicExportStudio.tsx`, `src/lib/exportEngine.ts` |
| 24 | Compute Sandbox | Pyodide / SymPy WebAssembly Sandbox | Web Worker client-side Python execution engine with SymPy calculus and live parameter binding | Python script, slider params | stdout, stderr, LaTeX result, 2D/3D plot payloads | 8s watchdog guard with fallback to native TS engine | `src/components/sandbox/PythonSandbox.tsx` |
| 25 | Compute Sandbox | Multi-Tab Math Compute Engine | Pure client-side calculus (Taylor/Fourier), linear algebra (Eigenvalues/Gram-Schmidt), ODE (RK4), and number theory | Selected tab, formula inputs, slider params | Real-time numerical calculations, matrix tables, 2D/3D charts | Validates numerical inputs and clamps bounds | `src/components/sandbox/MathComputeEngine.tsx` |
| 26 | Compute Sandbox | Reactive Parameter Sliders | Dynamic slider controls with debounced state binding injecting variables into Python / math scopes | Slider config map, current values | Interactive range sliders + number inputs | Clamps within [min, max] range | `src/components/sandbox/ParameterSliders.tsx` |
| 27 | Compute Sandbox | Multi-Modal 2D Plot Canvas | Canvas renderer for 2D function curves, Taylor approximations, Riemann sums, sequence limits, and vector fields | PlotDataPayload object | Scaled 2D coordinate grid with zoom/pan and coordinate hover | Displays "等待计算绘图数据..." when payload empty | `src/components/sandbox/Plot2DCanvas.tsx` |
| 28 | Compute Sandbox | 3D Surface & Attractor Canvas | 3D projected surface (Möbius, Torus, Saddle) and chaotic strange attractor (Lorenz) renderer | Surface mesh / attractor trajectory | Rotatable, zoomable 3D wireframe / shaded rendering | Auto-rotates smoothly when not dragging | `src/components/sandbox/Plot3DSurface.tsx` |
| 29 | Compute Sandbox | Automated Numerical Node Verification | Monte Carlo identity checks (Cauchy-Schwarz, FTC numerical integral, Fermat mod exp, Stokes flux) | Contract ID, sample size | Max error, sample count, duration ms, pass/fail status | Flags numerical deviation exceeding tolerance as failed | `src/components/sandbox/NodeVerificationPanel.tsx`, `src/lib/mathCompute.ts` |
| 30 | Gamified Quest | ZFC to Modern Math RPG Campaign | 6 civilization epochs with axiom unlock progression, entity synthesis crucible, and milestone derivation challenges | User progress in `localStorage`, user actions | Unlocked epochs, XP level, badges, formal step verification | Shows missing prerequisite alert when unlocking too early | `src/components/math/ZfcCampaignQuest.tsx`, `src/lib/campaignEngine.ts` |
| 31 | Gamified Quest | Mathematical Fallacy Detective Lab | 6 fallacy taxonomy cases with story context, step accusation debugger, formal critiques, and Lean 4 disproofs | Case ID, suspected step index, fallacy type | Points earned, verdict message, formal refutation LaTeX | Alerts user if step is accused without selection | `src/components/math/FallacyDetectiveLab.tsx`, `src/lib/fallacyEngine.ts` |
| 32 | Admin Studio | Dynamic Page Assembler | Visual drag-and-drop page builder to assemble custom mathematical portals with modular widgets | Title (zh/en), slug, icon, category, widgets list | Dynamic route `/custom/[slug]` generated and listed in nav | Validates slug uniqueness and required metadata | `src/app/admin/page.tsx`, `src/lib/customPageEngine.ts` |
| 33 | Admin Studio | Proposition CMS & DAG Health Audit | Proposition creator with full LaTeX/Lean fields + DAG topological sorting & cycle detection audit | Node data, proposition graph | DAG acyclic status, isolated node count, MSC coverage | Highlights cycle paths if circular dependencies exist | `src/app/admin/page.tsx`, `src/lib/dagEngine.ts` |
| 34 | Auxiliary Labs | AI Natural Language Formalizer Assistant | Translates informal mathematical statements into LaTeX and Lean 4 formal code with predefined theorems | Natural language prompt | LaTeX formula, Lean 4 formal definition, dependency list | Simulated generation with copy actions | `src/components/math/AiMathTranslator.tsx` |
| 35 | Auxiliary Labs | Commutative Diagram Viewer | SVG interactive visualization of commutative diagrams (First Isomorphism, Short Exact Sequence, Snake Lemma) | Diagram config object | Interactive nodes and morphism arrows with LaTeX labels | Fallback readable ASCII labels in SVG text | `src/components/math/CommutativeDiagramViewer.tsx` |
| 36 | Auxiliary Labs | Counterexample & Monster Gallery | Gallery of pathological counterexamples disproving famous conjectures with significance analysis | Selected counterexample ID | Mathematical formula, target conjecture, historical impact | Formatted LaTeX display of pathological functions | `src/components/math/CounterExampleGallery.tsx` |
| 37 | Auxiliary Labs | Dynamical Systems Phase Plane Lab | Phase space simulations (Lotka-Volterra, Van der Pol, Pendulum, Duffing) with click-to-add trajectories | Model selection, system parameters, canvas clicks | Animated vector fields and real-time numerical trajectories | Auto-clears out-of-bounds trajectory points | `src/components/math/DynamicalSystemsLab.tsx` |
| 38 | Auxiliary Labs | TikZ Diagram Studio | TikZ / TikZ-cd template studio generating publication-grade LaTeX commutative diagrams | Template selection | Live formula preview, raw TikZ code, 1-click download | Overleaf export compatible | `src/components/math/TikzStudio.tsx` |
| 39 | Auxiliary Labs | Spaced Repetition Flashcards | Flashcard memory training system for mathematical definitions and theorems | Card flip, rating score (1-5) | Spaced repetition schedule, mastery rate | Local progress tracking | `src/components/math/MathFlashcardSystem.tsx` |
| 40 | Auxiliary Labs | Interactive Proof Construction Tutor | Multiple-choice step-by-step proof reasoning game | Selected derivation step options | Immediate verification, detailed rationale, completion score | Incorrect answer explains why chosen option fails | `src/components/math/ProofTutorGame.tsx` |
| 41 | Auxiliary Labs | Multi-Approach Proof Viewer | Multi-tab proof viewer with intuitive breakdown vs rigorous derivation and step-level commentary | Proof index, view mode toggle | Formatted LaTeX steps, author metadata, comment feed | Renders "暂无证明记录" when node has no proofs | `src/components/math/ProofViewer.tsx` |
| 42 | Auxiliary Labs | MSC 2020 Hierarchical Explorer | Interactive classification tree covering MSC 2020 mathematics codes | Category expansion | Hierarchical tree with node counts and direct links | Collapsible subcategory branches | `src/components/math/MscTreeExplorer.tsx` |
| 43 | Auxiliary Labs | Historical Mathematical Timeline | Chronological timeline of world mathematical milestones from Antiquity to 21st Century | Era selection | Interactive timeline cards with mathematicians and formulas | Responsive vertical / horizontal layout | `src/components/math/MathTimeline.tsx` |

---

## Edge Cases

| # | Feature | Input | Observed Behavior |
|---|---------|-------|-------------------|
| 1 | Locale Switching | Undefined / missing translation key in `en` dictionary (e.g. `zfc.nonExistentKey`) | `LanguageContext.t()` gracefully falls back to `zh` dictionary value; if missing in both, returns key path string `zfc.nonExistentKey` without crashing |
| 2 | Locale Switching | User clears browser storage or visits in incognito mode with `navigator.language` = 'en-US' | Auto-detects browser locale prefix `'en'`, sets locale to `'en'`, sets `document.documentElement.lang = 'en'` |
| 3 | Parameter Interpolation | Translated template `"已保存 {count} 个重点命题"` with `params: { count: 0 }` | Correctly replaces `{count}` with `0` -> `"已保存 0 个重点命题"`; does not evaluate 0 as falsy missing parameter |
| 4 | Parameter Interpolation | Template with missing param `{unknownKey}` | Leaves literal token `{unknownKey}` unchanged in translated string without throw |
| 5 | Mathematical Node Decoupling | Node with empty `statementEn` viewed in English locale | `getNodeStatement()` falls back to `statementZh` so formula is never blank |
| 6 | 3D Knowledge Cosmos | Isolated node with zero prerequisites and zero dependents selected | Renders single star node in 3D cosmos; HUD calculates 100% readiness and 0 total prerequisites; does not produce NaN in layout forces |
| 7 | Prerequisite Closure | Circular dependency artificially injected in graph | DAG cycle detector detects cycle path; prerequisite closure engine avoids infinite loop via visited Set guard |
| 8 | Search Modal | Search query with special LaTeX symbols `\int`, `\partial`, `\alpha` or punctuation | Filter sanitizes and matches against `statementLatex` and `tags` cleanly |
| 9 | Academic Export | Document title containing quotation marks or special LaTeX characters (e.g. `%`, `$`, `&`) | `exportEngine.ts` properly escapes metadata and injects valid preamble without syntax breakage |
| 10 | Fallacy Detective | User attempts to submit accusation without selecting a suspect step | Triggers client alert prompting step selection; does not submit invalid payload |
| 11 | ZFC Campaign | User attempts to synthesize entity without having required axiom or constituent entity unlocked | Engine rejects synthesis, returns `{ success: false, message: "缺少必要前置公理" }`, preserves XP state |
| 12 | Custom Page Builder | Admin deletes active custom page while user is viewing `/custom/[slug]` | `/custom/[slug]` renders friendly 404 card with navigation links back to `/admin` and `/` |

---

## Complete Localization Dictionary Namespace & Key Catalog

To achieve 100% bilingual parity (zh-CN & en-US) across all views and interactive modules, the following dictionary schema is required:

### 1. `nav` Namespace
| Key | zh-CN Translation | en-US Translation |
|-----|-------------------|-------------------|
| `brand` | MathUniverse | MathUniverse |
| `brandSubtitle` | 全学科数学开源知识库与形式化平台 | Unified Mathematics Knowledge Base & Formal Proving Platform |
| `graph` | 知识星空 | Cosmos Graph |
| `lean` | Lean 4 实验室 | Lean 4 Lab |
| `community` | 同行评审 | Peer Review |
| `editor` | 创作中心 | Editor Studio |
| `admin` | 管理控制台 | Admin Console |
| `visitor` | 访客 (演示环境) | Visitor (Demo) |
| `adminMode` | ⚡ 管理员模式 | ⚡ Admin Mode |
| `visitorMode` | 访客 (点击切管理员) | Visitor (Switch to Admin) |
| `switchToAdmin` | 切换至管理员模式 | Switch to Admin Mode |
| `searchPlaceholder` | 全局搜索数学概念、定理、Lean 代码 (按 ⌘K / Ctrl+K)... | Search concepts, theorems, Lean formal code (⌘K / Ctrl+K)... |
| `language` | 语言 | Language |
| `langZh` | 简体中文 | 简体中文 (Chinese) |
| `langEn` | English | English |
| `bookmarks` | 收藏夹 | Bookmarks |
| `bookmarksCount` | 已保存 {count} 个命题 | {count} saved propositions |

### 2. `hero` Namespace
| Key | zh-CN Translation | en-US Translation |
|-----|-------------------|-------------------|
| `badge` | 下一代现代数学统一结构化知识基础设施 | Next-Generation Unified Mathematical Knowledge Infrastructure |
| `title` | 数学结构化知识库 | Mathematical Structured Knowledge Base |
| `subtitle` | 基于有向无环图 (DAG) 与 Lean 4 形式化验证的多学科数学知识网络，探索两千余年人类严谨数理智慧 | A multi-disciplinary knowledge network powered by Directed Acyclic Graph (DAG) and Lean 4 formal verification, exploring over two millennia of rigorous human mathematical wisdom. |
| `ctaCosmos` | 探索 3D 知识宇宙 | Explore 3D Cosmos |
| `ctaLean` | Lean 4 形式化实验室 | Lean 4 Formal Lab |
| `ctaEditor` | 原子化块级创作 | Atomic Block Editor |
| `searchPlaceholder` | 输入定理、公理或关键词（如柯西-施瓦茨、微积分基本定理、群论、ZFC）... | Search theorems, axioms or keywords (e.g. Cauchy-Schwarz, FTC, Group Theory, ZFC)... |
| `quickAccess` | 推荐探索 | Featured Explorations |
| `feature1Title` | 原子化数学命题 DAG 拓扑 | Atomic Mathematical DAG Topology |
| `feature1Desc` | 严格区分公理、定义、引理与定理，自动化拓扑排序消除循环定义 | Strict distinction between axioms, definitions, lemmas, and theorems with automated cycle-free topological sorting. |
| `feature2Title` | Lean 4 交互式形式化验证 | Lean 4 Interactive Formal Verification |
| `feature2Desc` | 浏览器端运行策略证明树，#print axioms 机器级别绝对无漏洞保障 | Run tactic proof trees in the browser with machine-grade #print axioms soundness guarantee. |
| `feature3Title` | 3D WebGL 知识星系与漫游 | 3D WebGL Knowledge Cosmos & Flythrough |
| `feature3Desc` | 六大学科聚类星云粒子漫游，一键计算目标定理前置闭包路径 | Navigate through clustered discipline nebulae and compute minimal prerequisite closures for any theorem. |
| `feature4Title` | 客户端符号与动力系统求解 | Client-Side Symbolic & Dynamical Compute |
| `feature4Desc` | 集成 Pyodide/SymPy 符号演算与 RK4 混沌微分动力学实时演化 | Seamless integration of Pyodide/SymPy symbolic calculus and real-time RK4 chaotic phase-space dynamics. |
| `feature5Title` | “从公理创世”ZFC 游戏化战役 | Gamified "Genesis from Axioms" ZFC Quest |
| `feature5Desc` | 6 大文明纪元 RPG 闯关模式与数学伪证明反例侦探工坊 | 6 civilization eras RPG progression campaign and interactive Fallacy Detective proof forensics workshop. |
| `feature6Title` | 出版级学术讲义导出工坊 | Publication-Grade Academic Exporter |
| `feature6Desc` | 递归解析依赖前置树，一键生成 AMS-LaTeX 论文、Typst 讲义与 Beamer 幻灯片 | Recursively resolves dependency trees to generate AMS-LaTeX papers, modern Typst notes, and Beamer slides in one click. |

### 3. `graph` Namespace
| Key | zh-CN Translation | en-US Translation |
|-----|-------------------|-------------------|
| `title` | 3D 数学宇宙星系图谱 | 3D Mathematical Knowledge Cosmos |
| `subtitle` | 探索有向无环图 (DAG) 拓扑推导依赖与六大学科星云聚类 | Explore DAG derivation dependencies and 6-discipline clustered nebulae |
| `searchPlaceholder` | 在星空中检索定理或概念... | Search theorems or concepts across the cosmos... |
| `allDisciplines` | 全部学科 | All Disciplines |
| `clusterView` | 星云聚类视图 | Nebulae Cluster View |
| `prereqPathway` | 前置推导闭包路径 | Prerequisite Pathway |
| `resetCamera` | 重置视角 | Reset View |
| `nebulaDust` | 星云尘埃 | Nebulae Dust |
| `nebulaDustOn` | 星云尘埃 开 | Nebulae Dust ON |
| `nebulaDustOff` | 星云尘埃 关 | Nebulae Dust OFF |
| `zoomIn` | 放大 | Zoom In |
| `zoomOut` | 缩小 | Zoom Out |
| `controlsHint` | 左键旋转 · Shift/右键平移 · 滚轮缩放 · 双击直达定理 | Left-Click: Rotate · Shift/Right-Click: Pan · Scroll: Zoom · Double-Click: Jump to Theorem |
| `nodeDetail` | 命题节点详情 | Node Details |
| `prerequisites` | 直接前置依赖 | Direct Prerequisites |
| `dependents` | 后续推导定理 | Subsequent Theorems |
| `formalCode` | Lean 4 形式化代码 | Lean 4 Formal Code |
| `intuitiveExpl` | 直觉图解与释义 | Intuitive Explanation |
| `viewDetails` | 进入完整词条 | View Full Article |
| `close` | 关闭 | Close |
| `targetTheorem` | 目标定理 | Target Theorem |
| `calculateClosure` | 计算最小前置闭包 | Compute Prerequisite Closure |
| `totalPrereqs` | 个前置命题 | prerequisites required |
| `flowView` | 闭包路径流 | Closure Flow |
| `hasseView` | Hasse 骨架 | Hasse Skeleton |
| `fullView` | 全量连线 | Full Graph |
| `nebulaeCruise` | 星云巡航 | Nebula Cruise |
| `universeOverview` | 全宇宙全景 | Full Cosmos |
| `readinessPercentage` | 就绪 | Ready |
| `totalPrereqsCount` | 前置依赖总数 | Total Prerequisites |
| `unlearnedNodesCount` | 未掌握阶梯 | Unlearned Nodes |
| `estStudyHours` | 预估通关研习时长 | Estimated Study Time |
| `hours` | 小时 | hours |
| `bottlenecksTitle` | 关键拓扑枢纽定理 | Critical Bottleneck Milestone Theorems |
| `markLearned` | 标记已学 | Mark as Learned |
| `alreadyLearned` | 已掌握 | Mastered |
| `learningTrajectory` | 拓扑学习阶梯 | Topological Learning Trajectory |
| `streamLoading` | 视口流式加载 | Viewport Streaming |
| `fullMode` | 全景模式 | Full View |

### 4. `lean` Namespace
| Key | zh-CN Translation | en-US Translation |
|-----|-------------------|-------------------|
| `title` | Lean 4 形式化证明实验室 | Lean 4 Formal Verification Lab |
| `subtitle` | 体验定理机器证明，探究从 ZFC 基础公理到现代拓扑的绝对严谨性 | Experience machine-checked theorem proving from foundational ZFC axioms to modern topology. |
| `tacticsTitle` | 常用证明策略速查 (Tactics Deck) | Tactics Quick Reference Deck |
| `proofTutor` | 交互式证明向导 (Proof Tutor) | Interactive Proof Tutor |
| `verifyStatus` | 验证状态 | Verification Status |
| `checkAxioms` | 公理依赖审查 (#print axioms) | Axiom Audit (#print axioms) |
| `copyCode` | 复制代码 | Copy Code |
| `copied` | 已复制代码 | Code Copied |
| `verifiedBadge` | Lean 4 形式化已验证 | Lean 4 Formally Verified |
| `failedBadge` | 验证失败 / 存在 Sorry | Verification Failed / Sorry Present |
| `unverifiedBadge` | 待形式化验证 | Pending Formal Verification |
| `certificateTitle` | 数学形式化验证数字证书 | Formal Verification Certificate |
| `runVerification` | 运行形式化验证 | Run Formal Verification |
| `tacticState` | 证明目标状态机 | Proof Goal State |
| `goalsRemaining` | 个待解决证明目标 | unsolved proof goal(s) |
| `noOpenGoals` | 所有证明目标已完全闭合 🎉 | Goals accomplished 🎉 (No open goals) |
| `simulatedNotice` | 演示模式：模拟验证状态 | Demo Mode: Simulated Verification |
| `hypotheses` | 上下文假设 | Context Hypotheses |
| `targetGoal` | 目标项 | Target Goal |
| `nextTactic` | 执行下一步策略 | Execute Next Tactic |
| `resetProof` | 重置证明 | Reset Proof |
| `whenToUse` | 适用证明场景 | When to Use |
| `proofStateEffect` | 代码示例与目标转换 | Proof State Effect & Example |
| `finderTitle` | Lean 4 官方 Mathlib 定理检索助手 | Official Mathlib Lemma Finder |
| `finderSubtitle` | 快速检索 Mathlib 模块引用、定理类型签名与官方形式化证明模式 | Search Mathlib module imports, type signatures, and formal proof patterns |
| `copyDeclaration` | 复制 Lean 声明 | Copy Lean Declaration |

### 5. `community` Namespace
| Key | zh-CN Translation | en-US Translation |
|-----|-------------------|-------------------|
| `title` | 同行评审与社区审校中心 | Peer Review & Moderation Desk |
| `subtitle` | 公开透明的数学命题提案、勘误审校与共识投票机制 | Transparent community proposals, errata review, and consensus verification. |
| `openPrs` | 待审校 PR | Open PRs |
| `mergedPrs` | 已合入知识库 | Merged into Core |
| `submitPr` | 提交新命题 / 勘误提案 | Submit Proposal / Errata PR |
| `formulaDiff` | LaTeX 与 Lean 代码比对 (Diff) | LaTeX & Lean Code Diff |
| `approve` | 批准提案 (Approve) | Approve & Merge |
| `requestChanges` | 请求修订 (Request Changes) | Request Changes |
| `author` | 提案作者 | Proposal Author |
| `reviewers` | 评审专家 | Peer Reviewers |
| `status` | 审核状态 | Review Status |
| `reputationReward` | 通过合并奖励: +50 声望 | Merged Reward: +50 Reputation |
| `currentVersion` | 当前版本 (Current) | Current Version |
| `proposedVersion` | 提议新版本 (Proposed) | Proposed Version |
| `saveLocalDraft` | 保存草稿到本地 | Save Draft Locally |
| `draftSavedTitle` | 草稿已保存到本机（演示） | Draft Saved Locally (Demo) |
| `leaderboardTitle` | 示例学者榜 | Scholar Leaderboard |
| `rulesTitle` | 声望规则示意 | Reputation Rules |

### 6. `editor` Namespace
| Key | zh-CN Translation | en-US Translation |
|-----|-------------------|-------------------|
| `title` | 原子化数学命题创作工坊 | Atomic Mathematical Node Studio |
| `subtitle` | 结构化块级编辑器与 LaTeX 符号快速排版工作台 | Structured block-based editor and LaTeX formula assistant workbench. |
| `blockEditor` | 块级内容编辑器 | Block Content Editor |
| `latexStudio` | LaTeX 数学符号速查工坊 | LaTeX Math Symbol Studio |
| `preview` | 实时渲染预览 | Real-Time Rendering Preview |
| `returnToEdit` | 返回编辑 | Return to Edit |
| `publishNode` | 发布至本地知识库 | Publish to Local Knowledge Base |
| `mscCode` | MSC 2020 分类代码 | MSC 2020 Classification Code |
| `discipline` | 所属学科大类 | Mathematical Discipline |
| `nodeType` | 命题类型 | Node Type |
| `titleZh` | 中文名称 | Chinese Title |
| `titleEn` | 英文名称 (English Title) | English Title |
| `statement` | LaTeX 公式陈述 | LaTeX Statement Formula |
| `addBlock` | 添加内容块 | Add Content Block |
| `addText` | 文本与内联公式 | Text & Inline LaTeX |
| `addLatex` | 独立 LaTeX 块 | Block LaTeX Formula |
| `addLean` | Lean 4 验证块 | Lean 4 Code Block |
| `addIntuition` | 直觉/动机块 | Intuition Block |
| `symbolStudioTitle` | LaTeX 全学科高阶数学符号库 | High-Order Math Notation Studio |
| `searchSymbols` | 搜索符号 (如 int, cup, 偏导)... | Search symbols (e.g. int, cup, grad)... |
| `symbolCopied` | 已复制符号 | Symbol Copied |

### 7. `admin` Namespace
| Key | zh-CN Translation | en-US Translation |
|-----|-------------------|-------------------|
| `title` | MathUniverse 管理员控制台与页面装配系统 | MathUniverse Admin Studio & Dynamic Page Assembler |
| `subtitle` | 动态添加与装配全新数学界面、维护数学命题拓扑、巡检 DAG 环依赖与仲裁同行 PR | Assemble custom mathematics portals, maintain proposition graphs, audit DAG health, and moderate community PRs. |
| `adminActive` | ⚡ 管理员权限 (已激活) | ⚡ Admin Mode (Active) |
| `switchAdmin` | 切换至管理员模式 | Switch to Admin Mode |
| `pageBuilder` | 动态界面与新页面装配器 | Dynamic Page Assembler |
| `nodeCms` | 数学命题与定理创作台 | Math Node CMS |
| `dagHealth` | DAG 拓扑健康度巡检 | DAG Topology Health |
| `prModeration` | 同行评审 PR 审核台 | Peer Review Moderation |
| `backup` | 知识库备份与迁移 | Backup & Data Export |
| `createPage` | 装配发布全新数学定制界面 | Assemble & Publish New Mathematics Page |
| `pageNameZh` | 界面中文名称 | Chinese Page Title |
| `pageNameEn` | 英文标题 (English Title) | English Page Title |
| `slug` | 路由路径 (URL Slug) | URL Slug |
| `category` | 分类标签 (Category) | Category |
| `description` | 界面功能简述 (Description) | Page Description |
| `addModule` | 添加该模块 | Add Module |
| `savePage` | 立即生成并发布自定义界面 | Publish Custom Page Now |
| `publishedPages` | 已发布的自定义管理界面库 | Published Custom Pages Library |
| `deletePage` | 删除界面 | Delete Page |
| `exportJson` | 导出全量数据库 JSON 快照 | Export Full Database JSON Snapshot |
| `dagStatus` | DAG 无环验证状态 | DAG Acyclic Status |
| `totalNodes` | 总命题节点数 | Total Proposition Nodes |
| `isolatedNodes` | 孤立孤岛命题数 | Isolated Island Nodes |
| `mscCount` | 覆盖 MSC 学科大类 | MSC Disciplines Covered |

### 8. `sandbox` Namespace
| Key | zh-CN Translation | en-US Translation |
|-----|-------------------|-------------------|
| `title` | 客户端数学计算与推导实验室 | Client-Side Mathematical Computation Sandbox |
| `subtitle` | 基于 Pyodide WebAssembly 与 SymPy 的纯前端高精度符号计算沙盒 | High-precision symbolic and numerical computation in pure WebAssembly powered by Pyodide and SymPy. |
| `computeEngine` | 符号与数值计算引擎 | Symbolic & Numerical Engine |
| `runCode` | 执行计算代码 | Execute Code |
| `resetCode` | 重置代码 | Reset Code |
| `paramSliders` | 交互参数调节滑块 | Interactive Parameter Sliders |
| `plot2D` | 2D 动态函数图像 | 2D Dynamic Plot Canvas |
| `plot3D` | 3D 微分曲面投影 | 3D Differential Surface |
| `zfcQuest` | “从公理创世”ZFC 战役 | "Genesis from Axioms" ZFC Quest |
| `fallacyDetective` | 数学伪证明侦探实验室 | Mathematical Fallacy Detective Lab |
| `academicExport` | 出版级学术排版导出工坊 | Academic Export Studio |
| `exportLatex` | 导出 AMS-LaTeX 论文 | Export AMS-LaTeX Paper |
| `exportTypst` | 导出现代 Typst 讲义 | Export Modern Typst Notes |
| `exportBeamer` | 导出 Beamer 演示文稿 | Export Beamer Presentation |
| `exportQuarto` | 导出 Quarto / Markdown | Export Quarto / Markdown |
| `exportTikz` | 导出 TikZ 拓扑图谱 | Export TikZ Diagram |
| `detectiveVerdict` | 指控判决与证据分析 | Forensic Verdict & Proof Analysis |
| `investigateFallacy` | 侦查此伪证明漏洞 | Investigate Proof Fallacy |
| `maxError` | 最大绝对误差 | Maximum Absolute Error |
| `samplesCount` | 有效采样规模 | Valid Sample Count |
| `executionTime` | 验证耗时 | Execution Time |

### 9. `zfc` Namespace
| Key | zh-CN Translation | en-US Translation |
|-----|-------------------|-------------------|
| `title` | “从公理创世”ZFC 现代数学战役 | "Genesis from Axioms" ZFC Mathematical Quest |
| `subtitle` | 从空集与外延公理出发，亲手合成数系、拓扑与现代代数文明 | Construct number systems, topology, and modern algebra from the empty set and ZFC axioms. |
| `userLevel` | 数学文明境界 | Civilization Level |
| `totalXp` | 战役声望点数 | Quest XP |
| `epochGenesis` | 创世：空集与外延 | Genesis: Void & Extensionality |
| `epochPeano` | 序数与自然数算术 | Peano Arithmetic & Naturals |
| `epochNumberSystems` | 整数、有理数与代数系统 | Integers, Rationals & Algebra |
| `epochReals` | 戴德金分割与实数连续统 | Dedekind Cuts & Real Continuum |
| `epochTopology` | 点集拓扑与度量空间 | Point-Set Topology & Metric Spaces |
| `epochModern` | 现代代数与范畴宇宙 | Modern Algebra & Category Cosmos |
| `unlockEpoch` | 解锁新纪元 | Unlock Civilization Era |
| `unlockAxiom` | 领悟新公理 | Unlock Axiom |
| `synthesizeEntity` | 炼金合成实体 | Synthesize Mathematical Entity |
| `crucible` | 公理构造熔炉 | Axiomatic Synthesis Crucible |
| `recipeRequirements` | 所需原料与公理 | Required Ingredients & Axioms |
| `milestoneChallenge` | 纪元终极形式化推导挑战 | Era Milestone Derivation Challenge |
| `selectAxiomPrompt` | 第一步：选择支撑公理 | Step 1: Select Justifying Axiom |
| `selectFormulaPrompt` | 第二步：选择目标推导公式 | Step 2: Select Derived Formula |
| `verifyStep` | 提交推导论证 | Submit Inference Step |
| `stepCorrect` | 推导正确！形式化推论有效 | Correct Step! Valid Formal Inference |
| `stepIncorrect` | 推导存在逻辑跳跃或公理不匹配 | Incorrect Step: Invalid Axiom or Formula Choice |

### 10. `fallacy` Namespace
| Key | zh-CN Translation | en-US Translation |
|-----|-------------------|-------------------|
| `title` | 数学伪证明侦探实验室 | Mathematical Fallacy Detective Lab |
| `subtitle` | 侦破看似严丝合缝却包含致命逻辑漏洞的经典伪证明与诡辩 | Uncover subtle logical fallacies in classical mathematical pseudo-proofs and paradoxes. |
| `detectiveScore` | 侦探积分 | Detective Score |
| `detectiveTitle` | 侦探头衔 | Forensic Title |
| `allCategories` | 全部伪证明类型 | All Fallacy Categories |
| `zeroDiv` | 隐蔽除零漏洞 | Hidden Division by Zero |
| `divergentSeries` | 发散级数重排 | Divergent Series Rearrangement |
| `branchCut` | 复数主值分支割线 | Complex Branch Cut Errors |
| `semicontinuity` | 极限周长与几何不连续 | Semicontinuity & Geometric Limits |
| `intConstant` | 积分常数丢失 | Omission of Integration Constant |
| `leibnizRule` | 积分号下求导奇点 | Leibniz Rule Singularity |
| `caseStory` | 案件背景与伪证明经过 | Case Background & Bogus Derivation |
| `allegedConclusion` | 荒谬伪结论 | Absurd False Conclusion |
| `accuseStepButton` | 锁定此步骤并指控漏洞 | Accuse Selected Step |
| `verdictTitle` | 逻辑裁判官裁决 | Mathematical Magistrate Verdict |
| `formalCritique` | 严谨数学批注与正确结论 | Rigorous Critique & Ground Truth |
| `leanDisproof` | Lean 4 反驳与证伪源码 | Lean 4 Refutation Snippet |

### 11. `exportStudio` Namespace
| Key | zh-CN Translation | en-US Translation |
|-----|-------------------|-------------------|
| `title` | 出版级学术讲义与排版导出工坊 | Publication-Grade Academic Exporter Studio |
| `subtitle` | 一键将目标定理及其拓扑 DAG 前置闭包编译打包为 AMS-LaTeX、Typst 0.11+、Beamer 幻灯片、Quarto 或 1-Click Overleaf | Compile theorems and recursive DAG closures into AMS-LaTeX, Typst 0.11+, Beamer, Quarto, or Overleaf. |
| `targetTheoremLabel` | 目标导出定理 / 命题 | Target Theorem / Proposition |
| `overleafCompile` | Overleaf 一键云编译 | 1-Click Overleaf Cloud Project |
| `copyAll` | 复制全文 | Copy All |
| `downloadCode` | 下载源码文件 | Download Source File |
| `docTitleCustom` | 自定义文档主标题 | Custom Document Title |
| `authorName` | 作者署名 | Author Name |
| `institution` | 研究机构 / 平台 | Institution / Network |
| `togglePrereqs` | 递归 DAG 前置依赖闭包 | Recursive DAG Prerequisite Closure |
| `toggleProofs` | 严谨数学证明 | Rigorous Mathematical Proofs |
| `toggleIntuition` | 几何直觉动机 | Geometric Intuition & Motivation |
| `toggleLean` | Lean 4 形式化 | Lean 4 Formal Verification |
| `toggleTikz` | TikZ 拓扑/交换图 | TikZ Dependency / Commutative Graphs |
| `hierarchyPrereqs` | 拓扑偏序前置推导序列 | Topological Prerequisite Hierarchy |
| `linesCount` | 行代码 | lines of code |
| `relatedPropositions` | 个关联命题 | related propositions |

### 12. `common` Namespace
| Key | zh-CN Translation | en-US Translation |
|-----|-------------------|-------------------|
| `save` | 保存 | Save |
| `cancel` | 取消 | Cancel |
| `delete` | 删除 | Delete |
| `edit` | 编辑 | Edit |
| `close` | 关闭 | Close |
| `loading` | 正在加载... | Loading... |
| `success` | 操作成功 | Success |
| `error` | 发生错误 | Error |
| `search` | 搜索 | Search |
| `filter` | 筛选 | Filter |
| `back` | 返回 | Back |
| `next` | 下一步 | Next |
| `submit` | 提交 | Submit |
| `verified` | 已验证 | Verified |
| `unverified` | 未验证 | Unverified |
| `axioms` | 公理 | Axioms |
| `definitions` | 定义 | Definitions |
| `theorems` | 定理 | Theorems |
| `lemmas` | 引理 | Lemmas |
| `conjectures` | 猜想 | Conjectures |
| `history` | 历史背景与渊源 | Historical Context |
| `references` | 经典参考文献 | Key References |
| `tags` | 标签 | Tags |
| `share` | 分享 | Share |
| `bookmark` | 收藏 | Bookmark |
| `bookmarked` | 已收藏 | Bookmarked |
| `viewProof` | 查看严谨证明 | View Rigorous Proof |
| `backHome` | 返回首页 | Back to Home |
| `notFound` | 未找到内容 | Not Found |
| `demoBadge` | 演示环境 | Demo Environment |

### 13. `footer` Namespace
| Key | zh-CN Translation | en-US Translation |
|-----|-------------------|-------------------|
| `brandSubtitle` | 数学宇宙开源知识库 | Open-Source Mathematical Cosmos |
| `mission` | 致力于构建人类全学科数学公理、定义、定理的统一 DAG 知识图谱与 Lean 4 形式化验证协作平台。 | Dedicated to building a unified DAG knowledge graph and Lean 4 formal verification platform for all human mathematical disciplines. |
| `trustBadge` | 100% 形式化可信 | 100% Formally Trusted |
| `coreExplore` | 核心功能探索 | Core Feature Explorations |
| `classicTheorems` | 经典数学命题直达 | Classic Theorems Direct Access |
| `academicResources` | 开源文献与外部学术 | Open-Source Literature & Academic Standards |
| `copyright` | 基于 MIT 协议与 CC-BY-SA 4.0 开源 | Open Source under MIT License • CC-BY-SA 4.0 |

---

## Logic Chain
1. **Observation 1 (`ORIGINAL_REQUEST.md`)**: R1-R4 stipulate a complete bilingual decoupling and localization architecture across all UI modules, views, HUDs, dialogs, drawers, and mathematical entities, with 100% key parity between `zh` and `en`.
2. **Observation 2 (`src/` Codebase Scan)**: Discovered 9 top-level routes/pages (`page.tsx`, `admin`, `community`, `editor`, `graph`, `lean`, `node/[slug]`, `custom/[slug]`), 35+ React UI components across `layout`, `graph`, `lean`, `community`, `editor`, `export`, `node`, `sandbox`, `math`.
3. **Observation 3 (Current Translation Files)**: Current `src/i18n/types.ts`, `src/i18n/locales/zh.ts`, `src/i18n/locales/en.ts` cover 9 namespaces with ~180 lines, but omit newly implemented modules like `Footer`, `ZfcCampaignQuest`, `FallacyDetectiveLab`, `AcademicExportStudio`, `DynamicalSystemsLab`, `TikzStudio`, `AiMathTranslator`, `CommutativeDiagramViewer`, `CounterExampleGallery`, `MathPracticeHub`, `MathTimeline`, `MscTreeExplorer`, `ProofTutorGame`.
4. **Observation 4 (Hardcoded Chinese & English Strings)**: Multiple components currently contain hardcoded strings that need migration to `useLanguage()` and `t()` or helper functions (`getNodeTitle`, `getNodeStatement`, `getNodeIntuition`, `getNodeTypeLabel`, `getDisciplineName`).
5. **Logic Deduction**:
   - Expanding `TranslationDict` interface in `src/i18n/types.ts` to add namespaces (`zfc`, `fallacy`, `exportStudio`, `footer`, etc.) and missing keys will establish the full contract.
   - Populating `src/i18n/locales/zh.ts` and `src/i18n/locales/en.ts` with 100% key parity guarantees 0 missing keys during dictionary parity unit tests.
   - Updating UI components to bind text dynamically via `t('namespace.key')` and `getNodeTitle(node, locale)` fulfills R1, R2, and R3.
   - Writing unit tests verifying key parity and reactivity satisfies R4.

---

## Caveats
- **LaTeX Math Formulas**: Mathematical formulas (`statementLatex`, mathematical symbols $\in, \forall, \int$) should remain identical in both Chinese and English locales; only explanatory narrative, natural language descriptions, and theorem titles should be translated.
- **Dynamic Custom Pages**: Custom pages created in the Admin Studio (`/custom/[slug]`) store both `titleZh` and `titleEn`. Components rendering custom page links (such as `Navbar`) must check `locale` to render `page.titleEn` or `page.titleZh`.
- **Seed Data Bilingual Fields**: Mathematical entities in `src/data/seedData.ts` already contain `titleZh`, `titleEn`, `statementPlainZh`, `intuitionMd`, `historicalContextZh`. `statementLatex` is universal. Proof step explanations should support localized fields.

---

## Conclusion
The UI inventory, requirement matrix (R1-R4), discovered features, edge cases, and complete bilingual localization dictionary schema have been fully mined and documented. The project is prepared for dictionary expansion, component i18n binding, and automated parity testing.

---

## Verification Method
1. **Dictionary Parity Verification**: Run key parity unit tests comparing `Object.keys` recursively between `zh` and `en` dictionaries.
2. **Build Verification**: Run `npm run build` to confirm zero TypeScript compilation errors across all components and i18n types.
3. **Test Suite Verification**: Run `npm test` to verify all DAG, math compute, campaign, fallacy, export, and i18n tests pass 100%.
4. **Visual Inspection**: Toggle language switcher button in `Navbar` on `/`, `/graph`, `/lean`, `/community`, `/editor`, `/admin`, `/node/thm-cauchy-schwarz` to verify seamless locale switching without text clipping or untranslated gaps.
