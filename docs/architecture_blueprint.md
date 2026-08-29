# MathUniverse (数学宇宙) 系统架构与工程实现方案

## 1. 架构总览与核心设计理念

MathUniverse 是一个集**结构化数学本体 (Math Ontology)**、**知识图谱 (DAG Dependency Graph)**、**LaTeX 极致排版**、**Lean 4 形式化验证**及**交互式计算**于一体的下一代全学科数学开源协作平台。

### 核心设计原则
1. **本体原子化与逻辑严格性**：所有数学概念均拆解为公理、定义、定理、引理、推论、性质、反例等强类型节点，通过有向无环图进行前置依赖追踪，严禁循环论证。
2. **渐进式学习认知（直觉 vs 严谨）**：通过“动机与几何直觉 (Intuition)”与“形式化推导 (Formal Proof)”分层渲染，降低认知门槛。
3. **零服务端算力负担的形式化验证**：充分利用现代浏览器算力，将 Lean 4 编译器及 Python/SymPy 沙盒全面迁移至 WebAssembly (WASM) 客户端运行。
4. **Git 风格的学术同行评审**：引入基于语义 Diff 的 Pull Request 机制与声望权限体系，保障人类数学知识库的正确性与演进活力。

---

## 2. 系统技术栈选型

| 层次 | 技术选型 | 选用理由 |
| :--- | :--- | :--- |
| **前端应用** | Next.js 15 (React 19, TypeScript) | SSR/SSG 保证海量数学条目的 SEO 与首屏毫秒级加载；Server Components 降低客户端 bundle 体积。 |
| **编辑器内核** | Tiptap (ProseMirror 底层) | 模块化块级编辑器体系，天然支持公式块、代码块、双向内链块自定义扩展。 |
| **数学排版** | KaTeX (主) + MathJax 3 (辅助) | KaTeX 处理 >95% 高频公式渲染（首屏速度快）；MathJax 3 Web Worker 异步渲染复杂 `tikz-cd` 交换图。 |
| **图谱可视化** | Cosmograph / Three.js + D3.js | 基于 WebGL GPU 实例渲染，轻松支撑 10 万+ 数学节点与依赖关系的流畅交互（60 FPS）。 |
| **后端 API** | Node.js (NestJS) / Rust (Axum) | 高并发 I/O 驱动，结合 WebSocket/WebRTC 处理实时协同与 LSP 流式数据。 |
| **数据库** | PostgreSQL 16 (Relational + JSONB + pgvector) + Apache AGE / Neo4j | 解决富文本海量存储与多层级 DAG 依赖拓扑排序的性能冲突。 |
| **形式化沙盒** | Lean 4 WASM (`lean4web` Web Worker) | 浏览器端纯静态运行 Lean 4 证明检查器，完全解耦云端算力消耗。 |
| **代码沙盒** | Pyodide (WASM) + Plotly / Three.js | 浏览器内原生运行 SymPy、NumPy、Matplotlib，动态生成 2D/3D 可视化图形。 |

---

## 3. 核心数据库 Schema 设计 (PostgreSQL / Prisma)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum NodeType {
  AXIOM            // 公理
  DEFINITION       // 定义
  LEMMA            // 引理
  THEOREM          // 定理
  COROLLARY        // 推论
  PROPERTY         // 性质
  EXAMPLE          // 例子
  COUNTER_EXAMPLE  // 反例
  CONJECTURE       // 猜想
}

enum VerificationStatus {
  UNVERIFIED          // 未验证
  PEER_REVIEWED       // 人工评审通过
  FORMALLY_VERIFIED   // Lean 4 机器验证通过
  VERIFICATION_FAILED // 形式化验证失败
}

enum EdgeRelationType {
  REQUIRES_DEFINITION // 依赖定义
  USES_LEMMA          // 使用引理/前置定理
  COROLLARY_OF        // 是...的推论
  COUNTEREXAMPLE_TO   // 是...的反例
  GENERALIZATION_OF   // 是...的推广
}

model MathDiscipline {
  id          String     @id @default(uuid())
  mscCode     String     @unique // MSC 2020 编号, 如 "03", "11", "14", "53"
  nameZh      String     // 如 "数论", "代数几何"
  nameEn      String     // 如 "Number Theory", "Algebraic Geometry"
  description String?
  nodes       MathNode[]
}

model MathNode {
  id              String             @id @default(uuid())
  slug            String             @unique // 唯一 URL 标识, 如 "cauchy-schwarz-inequality"
  title           String             // 节点名称 (如 "柯西-施瓦茨不等式")
  nodeType        NodeType
  disciplineId    String             // 学科分类
  discipline      MathDiscipline     @relation(fields: [disciplineId], references: [id])
  statementLatex  String             // 定理/定义的严谨 LaTeX 陈述
  intuitionMd     String?            // 直觉与几何动机 (Markdown + LaTeX)
  verification    VerificationStatus @default(UNVERIFIED)
  reputationScore Int                @default(0)
  
  // 关联
  proofs          Proof[]
  codeSnippets    CodeSnippet[]
  leanCodes       LeanFormalization[]
  
  // DAG 依赖图 (出边与入边)
  dependencies    DependencyEdge[]   @relation("FromNode") // 该节点依赖的前置
  dependents      DependencyEdge[]   @relation("ToNode")   // 依赖该节点的后继
  
  createdAt       DateTime           @default(now())
  updatedAt       DateTime           @updatedAt

  @@index([disciplineId])
  @@index([nodeType])
  @@index([verification])
}

model DependencyEdge {
  id           String           @id @default(uuid())
  fromNodeId   String           // 依赖方 (如: 定理 A)
  toNodeId     String           // 被依赖的前置 (如: 引理 B)
  relationType EdgeRelationType
  
  fromNode     MathNode         @relation("FromNode", fields: [fromNodeId], references: [id], onDelete: Cascade)
  toNode       MathNode         @relation("ToNode", fields: [toNodeId], references: [id], onDelete: Cascade)

  @@unique([fromNodeId, toNodeId, relationType])
  @@index([fromNodeId])
  @@index([toNodeId])
}

model Proof {
  id              String             @id @default(uuid())
  nodeId          String
  title           String             // 证明名称 (如 "代数证明 (向量内积法)", "几何证明")
  authorId        String
  rigorousProof   String             // 严谨推导正文 (Markdown + LaTeX)
  isPrimary       Boolean            @default(false)
  verification    VerificationStatus @default(UNVERIFIED)
  
  node            MathNode           @relation(fields: [nodeId], references: [id], onDelete: Cascade)
  steps           ProofStep[]        // 步骤级行内批注
  createdAt       DateTime           @default(now())
  updatedAt       DateTime           @updatedAt
}

model ProofStep {
  id          String        @id @default(uuid())
  proofId     String
  stepIndex   Int
  content     String
  proof       Proof         @relation(fields: [proofId], references: [id], onDelete: Cascade)
  comments    StepComment[]

  @@unique([proofId, stepIndex])
}

model LeanFormalization {
  id              String             @id @default(uuid())
  nodeId          String
  leanCode        String             // Lean 4 源码
  mathlibImports  String[]           // 依赖的 Mathlib 模块 (如 ["Mathlib.Analysis.InnerProductSpace.Basic"])
  theoremName     String             // Lean 中的定理声明标识符
  proofHash       String             // 编译 AST 哈希
  status          VerificationStatus @default(UNVERIFIED)
  verifiedAt      DateTime?
  
  node            MathNode           @relation(fields: [nodeId], references: [id], onDelete: Cascade)
}

model CodeSnippet {
  id         String   @id @default(uuid())
  nodeId     String
  language   String   // "python", "sagemath"
  code       String   // SymPy/NumPy 源码
  presetArgs Json?    // 预设交互参数
  node       MathNode @relation(fields: [nodeId], references: [id], onDelete: Cascade)
}

model StepComment {
  id        String    @id @default(uuid())
  stepId    String
  userId    String
  content   String
  createdAt DateTime  @default(now())
  step      ProofStep @relation(fields: [stepId], references: [id], onDelete: Cascade)
}
```
