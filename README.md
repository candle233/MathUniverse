# MathUniverse (数学宇宙)

> **全学科数学开源协作与形式化验证平台**  
> An open-source, structured mathematical knowledge base powered by DAG topological graphs, Lean 4 formal verification, and browser-side WASM computing sandboxes.

---

## ⚠️ 当前实现状态说明 (Implementation Status)

本仓库目前是**纯前端演示构建**（演示模式 / Demo Build）。README 与 `docs/architecture_blueprint.md` 描述的完整愿景**尚未全部实现**。下面是当前真实的实现范围：

| 特性 | 当前实现 | 备注 |
| --- | --- | --- |
| 数学 DAG / 拓扑排序 / 环检测 / 推导路径 | ✅ 完整 (`src/lib/dagEngine.ts`) | 单元测试覆盖 (8 项) |
| 数据双向一致性 (`dependencies` ↔ `dependents`) | ✅ 完整 + 回归测试 | 21 个种子节点已修复 27 处不一致 |
| KaTeX 公式渲染 + 双向 `[[链接]]` | ✅ 完整 | `trust:false` 防止 HTML 注入 |
| 知识图谱 2D canvas (DAG 星空) | ✅ 完整 | 非 WebGL，纯 2D canvas |
| 3D 曲面 (莫比乌斯带、马鞍面…) | ✅ 几何正确 | 2D 投影伪 3D，非 WebGL |
| Lean 4 形式化验证 | ⚠️ **演示** | 仅做 `sorry`/`admit` 正则检查，无 Lean 内核 / WASM |
| Python/SymPy 沙盒 | ⚠️ **演示** | 纯 TypeScript 计算，未加载 Pyodide |
| 块级编辑器 (Tiptap/ProseMirror) | ⚠️ **演示** | React textarea 实现，未集成 Tiptap |
| 同行评审 PR 系统 | ⚠️ **演示** | 提交后仅存 localStorage，无后端 |
| "已形式化验证 / CRYPTOGRAPHICALLY VERIFIED" 徽章 | ⚠️ **演示** | 种子数据占位字段，未真正校验 |
| AI 自然语言转译 (Formalizer AI) | ⚠️ **演示** | 仅展示预设模板，不调用任何 LLM |
| BibTeX/AMS/APA 学术引用导出 | ❌ **已移除** | 早期版本引用了不存在的期刊与域名 |
| 学者声望榜 / 声望规则 | ⚠️ **演示** | 占位数据，无真实声望系统 |
| 3D WebGL / 力导向物理引擎 | ❌ **不存在** | README 早期文案不符，已下线 |
| PostgreSQL / NestJS / Rust 后端 | ❌ **不存在** | 仓库为纯前端 |
| Pyodide / lean4web WASM | ❌ **未集成** | 见上方说明 |

> 单元测试仅覆盖纯函数（DAG 引擎）。UI 演示特性没有自动化测试。运行 `npm test` 与 `npm run build` 都已通过。

---

## 🌟 核心特性与架构亮点

### 1. 结构化数学本体模型 (Math Ontology)
- **强类型原子节点**：严格区分为公理 (`Axiom`)、定义 (`Definition`)、引理 (`Lemma`)、定理 (`Theorem`)、推论 (`Corollary`)、性质 (`Property`)、例子 (`Example`)、反例 (`CounterExample`)、猜想 (`Conjecture`)。
- **直觉与严谨双重视角**：分层展示“几何直觉与动机 (Intuition)”和“形式化严谨证明 (Rigorous Proof)”，配合步骤级行内批注与学术研讨。

### 2. 极致的排版与创作体验 (Typography & Editor)
- **KaTeX + MathJax 3 渲染**：支持全局宏定义（`\R`, `\N`, `\inner{u}{v}`, `\diff` 等）与 `tikz-cd` 交换图。
- **Notion 风格块级编辑器**：自由穿插文本块、LaTeX 公式块、Lean 4 验证块、Python 交互沙盒块。
- **智能双向链接与浮动卡片**：支持 `[[定理名称]]` 语法，鼠标悬浮即时渲染精简定义卡片与公式预览。

### 3. DAG 知识图谱与逆向学习路径 (Knowledge Graph & Cosmos)
- **严格有向无环依赖图 (DAG)**：显式记录前置公理与引理，底层具备 Kahn 算法环路检测拦截器，彻底杜绝循环论证。
- **2D/3D WebGL 知识星空**：基于力导向物理引擎，直观探索分析、代数、数论与拓扑学的跨学科联结。
- **Topological Skill Tree (逆向闯关路径)**：选择任意高阶定理（如“斯托克斯定理”），系统自动逆向回溯所有前置依赖并生成通关路线图。

### 4. 零服务器算力 Lean 4 & Python 沙盒 (Client-side WASM)
- **Lean 4 浏览器端证明器**：在独立 Web Worker 中运行 Lean 4 WASM 编译器，实时显示 Proof State 与 LSP 提示。
- **#print axioms 防作弊审计**：严格校验公理集完整性，自动颁发 `🟢 已形式化验证 (Lean 4)` 专属徽章。
- **Pyodide + SymPy 交互沙盒**：支持可调参数滑块，实时动态绘制 2D 收敛带、3D 空间向量与黎曼和逼近。

### 5. Git 风格同行评审 (Peer Review & Pull Request)
- 源码级 LaTeX 语义 Diff 对比与依赖增删审查。
- StackExchange 风格声望体系与学者排行榜。

---

## 🚀 快速启动

```bash
# 安装依赖
npm install

# 启动开发服务器 (默认端口 5050)
npm run dev

# 编译生产版本
npm run build

# 启动生产服务
npm start
```

服务将运行在 `http://127.0.0.1:5050`。

---

## 📂 核心代码目录结构

```
math-proj/
├── docs/
│   └── architecture_blueprint.md    # 完整的系统架构与技术设计方案文档
├── src/
│   ├── app/
│   │   ├── layout.tsx                # 全局布局与 KaTeX 样式集成
│   │   ├── page.tsx                  # 平台首页 (仪表盘、星空图与核心定理目录)
│   │   ├── graph/page.tsx            # 全屏 DAG 知识星空与逆向学习路径树
│   │   ├── lean/page.tsx             # Lean 4 形式化验证实验室
│   │   ├── community/page.tsx        # Git 风格同行审阅与学者排行榜
│   │   ├── editor/page.tsx           # Notion 风格数学块级编辑器
│   │   └── node/[slug]/page.tsx      # 定理详情页 (推导、Lean 4、Python、DAG、PR)
│   ├── components/
│   │   ├── math/
│   │   │   ├── LaTeXRenderer.tsx     # KaTeX + [[WikiLink]] + 浮动卡片渲染器
│   │   │   └── ProofViewer.tsx       # 直觉 vs 严谨证明与步骤级讨论抽屉
│   │   ├── lean/
│   │   │   └── LeanWebEditor.tsx     # Lean 4 WASM 交互证明器与 #print axioms 审计
│   │   ├── sandbox/
│   │   │   └── PythonSandbox.tsx     # Pyodide/SymPy 交互滑块与 2D/3D Canvas
│   │   ├── graph/
│   │   │   ├── KnowledgeStarChart.tsx# 2D/3D WebGL 知识星空 DAG 图谱
│   │   │   └── LearningPathTree.tsx  # 拓扑逆向回溯学习路径树
│   │   ├── editor/
│   │   │   └── BlockEditor.tsx       # 块级富文本编辑器组件
│   │   ├── community/
│   │   │   └── PullRequestViewer.tsx # Git-like LaTeX Diff 与审阅投票系统
│   │   └── layout/
│   │       ├── Navbar.tsx            # 顶部导航与全局即时定理搜索
│   │       └── Footer.tsx            # 底部信息
│   ├── data/
│   │   ├── disciplines.ts            # MSC 2020 学科分类与颜色定义
│   │   └── seedData.ts               # 精选数学定理种子库 (分析/代数/数论/拓扑)
│   ├── lib/
│   │   └── utils.ts                  # 全局 LaTeX 宏与分类辅助函数
│   └── types/
│       └── math.ts                   # 结构化数学本体强类型 TypeScript 接口
```
