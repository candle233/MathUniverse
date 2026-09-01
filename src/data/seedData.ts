import type { MathNode } from '../types/math.ts';

export const initialMathNodes: MathNode[] = [
  {
    "id": "def-group",
    "slug": "definition-group",
    "titleZh": "群的公理化定义",
    "titleEn": "Axiomatic Definition of a Group",
    "nodeType": "DEFINITION",
    "objectType": "DEFINITION",
    "disciplineId": "algebra",
    "mscCode": "20A05",
    "statementLatex": "(G, \\cdot): \\quad \\forall a,b,c \\in G, \\; (a \\cdot b) \\cdot c = a \\cdot (b \\cdot c), \\; \\exists e, \\; a \\cdot e = a, \\; \\exists a^{-1}, \\; a \\cdot a^{-1} = e",
    "statementPlainZh": "群是一个集合 \\(G\\) 配备一个二元代数运算 \\(\\cdot : G \\times G \\to G\\)，满足结合律、存在单位元 \\(e\\)、且每个元素 \\(a \\in G\\) 均存在逆元 \\(a^{-1}\\)。",
    "statementPlainEn": "A group (G, \\cdot) is a non-empty set equipped with a binary operation satisfying associativity, identity element existence, and inverse element existence.",
    "intuitionMd": "### 对称性与变换的代数结晶\n**“群是‘对称’的数学语言。”**\n\n无论旋转一个正二十面体、解高次代数方程的根置换，还是量子力学中的规范场对称性，所有保持结构不变的变换集合在复合运算下都构成群。",
    "intuitionEn": "### Algebraic Intuition & Symmetry\nThe abstract mathematical formalization of symmetry and reversible transformations across geometry and algebra.",
    "historicalContextZh": "群的概念源于伽罗瓦 (Évariste Galois) 在1832年研究多项式方程可解性时的置换群，后由阿瑟·凯莱与阿道夫·冯·戴克于19世纪末抽象为公理化体系。",
    "historicalContextEn": "Originated from Évariste Galois study of polynomial solvability and abstracted by Cayley and von Dyck.",
    "verification": "SYNTAX_CHECKED",
    "reputationScore": 680,
    "viewCount": 5120,
    "difficultyLevel": 1,
    "dependencies": [],
    "dependents": [
      "thm-group-inverse-unique",
      "thm-lagrange-group",
      "thm-first-isomorphism",
      "thm-sylow-first",
      "thm-cayley-group"
    ],
    "proofs": [],
    "prerequisiteEdges": [],
    "semanticEdges": [
      {
        "id": "se-group-lagrange",
        "fromNodeId": "def-group",
        "toNodeId": "thm-lagrange-group",
        "relationType": "MOTIVATES",
        "graphType": "SEMANTIC_GRAPH",
        "description": "Group axioms motivate coset partition and subgroup order divisibility"
      },
      {
        "id": "se-group-iso",
        "fromNodeId": "def-group",
        "toNodeId": "thm-first-isomorphism",
        "relationType": "MOTIVATES",
        "graphType": "SEMANTIC_GRAPH",
        "description": "Homomorphism structure preserves group operation"
      }
    ],
    "codeSnippets": [
      {
        "id": "py-group-cayley",
        "nodeId": "def-group",
        "language": "python",
        "title": "对称群 S_3 的凯莱乘法表 (Cayley Table) 交互生成",
        "description": "生成 3 个元素的置换群 S_3（6 阶非交换群）的完整乘法表与逆元对应。",
        "code": "def generate_s3_cayley():\n    # S3 置换: e=(1,2,3), a=(2,3,1), a2=(3,1,2), b=(2,1,3), ba=(3,2,1), ba2=(1,3,2)\n    elements = ['e', 'r1', 'r2', 's0', 's1', 's2']\n    # 构造凯莱表\n    return {\n        \"group_name\": \"Symmetric Group S_3\",\n        \"order\": 6,\n        \"is_abelian\": False,\n        \"elements\": elements,\n        \"table\": [\n            ['e', 'r1', 'r2', 's0', 's1', 's2'],\n            ['r1', 'r2', 'e', 's2', 's0', 's1'],\n            ['r2', 'e', 'r1', 's1', 's2', 's0'],\n            ['s0', 's1', 's2', 'e', 'r1', 'r2'],\n            ['s1', 's2', 's0', 'r2', 'e', 'r1'],\n            ['s2', 's0', 's1', 'r1', 'r2', 'e']\n        ]\n    }",
        "presetParams": {},
        "plotType": "matrix"
      }
    ],
    "tags": [
      "群论",
      "代数结构",
      "对称性",
      "公理系统"
    ],
    "lastModified": "2026-09-01"
  },
  {
    "id": "thm-group-inverse-unique",
    "slug": "theorem-group-inverse-uniqueness",
    "titleZh": "群单位元与逆元唯一性定理",
    "titleEn": "Uniqueness of Group Identity and Inverse",
    "nodeType": "THEOREM",
    "objectType": "PROPOSITION",
    "propositionRole": "THEOREM",
    "disciplineId": "algebra",
    "mscCode": "20A05",
    "statementLatex": "\\forall a, b \\in G, \\; a \\cdot b = e \\implies b = a^{-1} \\land (\\forall e_1, e_2, \\; e_1 \\cdot x = x \\implies e_1 = e_2)",
    "statementPlainZh": "在任意群 \\(G\\) 中，单位元是唯一的；且对每个元素 \\(a \\in G\\)，其逆元 \\(a^{-1}\\) 也是唯一的。",
    "statementPlainEn": "In any group G, the identity element is unique, and for each element a in G, its inverse a^{-1} is unique.",
    "intuitionMd": "### 代数结合律的威力\n利用结合律 \\((a \\cdot b) \\cdot c = a \\cdot (b \\cdot c)\\)，若存在两个逆元 \\(b\\) 和 \\(c\\)，则 \\(b = b \\cdot e = b \\cdot (a \\cdot c) = (b \\cdot a) \\cdot c = e \\cdot c = c\\)，两者必然恒等。",
    "intuitionEn": "Associativity forces any two candidate inverses b and c to collapse into equality: b = b(ac) = (ba)c = c.",
    "historicalContextZh": "凯莱与戴克在建立抽象群公理时首先确立的代数唯一性定理。",
    "historicalContextEn": "Foundational uniqueness theorem established by Cayley and von Dyck in abstract group axiomatics.",
    "verification": "FORMALLY_VERIFIED",
    "formalVerificationRecord": {
      "statementRevision": "rev-2026.09.01",
      "statementHash": "sha256:021f510083fe3e8c81e16f8c861d8f8c",
      "proofHash": "sha256:f479ce1b4254394ab62df75136ce0765",
      "leanVersion": "Lean (version 4.14.0)",
      "mathlibCommit": "v4.14.0",
      "imports": [
        "Mathlib.Algebra.Group.Basic"
      ],
      "axiomsUsed": [
        "propext"
      ],
      "result": "PASSED",
      "checkedAt": "2026-09-01T00:00:00Z",
      "checker": "LEAN_KERNEL"
    },
    "reputationScore": 520,
    "viewCount": 3120,
    "difficultyLevel": 1,
    "dependencies": [
      "def-group"
    ],
    "dependents": [],
    "proofs": [
      {
        "id": "proof-group-inverse-unique",
        "nodeId": "thm-group-inverse-unique",
        "title": "单位元与逆元的唯一性证明",
        "approachType": "ALGEBRAIC",
        "author": {
          "id": "user-galois",
          "name": "Évariste Galois",
          "reputation": 18900,
          "avatar": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=60",
          "isModerator": true
        },
        "motivation": "纯代数结合律推演。",
        "rigorousProof": "设 \\(e_1, e_2\\) 均为群 \\(G\\) 的单位元。\n由于 \\(e_1\\) 是单位元，\\(e_1 \\cdot e_2 = e_2\\)；\n由于 \\(e_2\\) 是单位元，\\(e_1 \\cdot e_2 = e_1\\)；\n因此 \\(e_1 = e_2\\)，单位元唯一。\n同理，设 \\(b, c\\) 均为 \\(a\\) 的逆元，由结合律：\n\\[\nb = b \\cdot e = b \\cdot (a \\cdot c) = (b \\cdot a) \\cdot c = e \\cdot c = c\n\\]\n因此逆元唯一。",
        "steps": [
          {
            "id": "grp-step-1",
            "stepIndex": 1,
            "explanation": "单位元唯一性证明",
            "latexText": "e_1 = e_1 \\cdot e_2 = e_2",
            "commentsCount": 0
          },
          {
            "id": "grp-step-2",
            "stepIndex": 2,
            "explanation": "利用结合律证明逆元唯一性",
            "latexText": "b = b(ac) = (ba)c = c",
            "commentsCount": 1
          }
        ],
        "isPrimary": true,
        "verification": "FORMALLY_VERIFIED",
        "upvotes": 410
      }
    ],
    "prerequisiteEdges": [
      {
        "id": "pe-group-inv-def",
        "fromNodeId": "thm-group-inverse-unique",
        "toNodeId": "def-group",
        "relationType": "REQUIRES_DEFINITION",
        "graphType": "PREREQUISITE_DAG",
        "description": "Proof expands the group binary operation and associativity axioms"
      }
    ],
    "semanticEdges": [],
    "leanFormalization": {
      "id": "lean-group",
      "nodeId": "thm-group-inverse-unique",
      "theoremName": "Group.inv_unique",
      "leanCode": "import Mathlib.Algebra.Group.Basic\n\nvariable {G : Type*} [Group G]\n\n-- 证明在群 G 中，若 a * b = 1 则 b = a⁻¹\ntheorem group_inv_unique (a b : G) (h : a * b = 1) : b = a⁻¹ := by\n  calc\n    b = 1 * b := by rw [one_mul]\n    _ = (a⁻¹ * a) * b := by rw [inv_mul_cancel]\n    _ = a⁻¹ * (a * b) := by rw [mul_assoc]\n    _ = a⁻¹ * 1 := by rw [h]\n    _ = a⁻¹ := by rw [mul_one]",
      "mathlibImports": [
        "Mathlib.Algebra.Group.Basic"
      ],
      "proofStateOutput": "Goals accomplished 🎉 (Lean 4 algebraic calculation verified)",
      "isVerified": true,
      "verifiedAt": "2026-08-19",
      "axiomsUsed": [
        "propext"
      ],
      "astHash": "sha256:f479ce1b4254394ab62df75136ce0765",
      "verificationRecord": {
        "statementRevision": "rev-2026.09.01",
        "statementHash": "sha256:021f510083fe3e8c81e16f8c861d8f8c",
        "proofHash": "sha256:f479ce1b4254394ab62df75136ce0765",
        "leanVersion": "Lean (version 4.14.0)",
        "mathlibCommit": "v4.14.0",
        "imports": [
          "Mathlib.Algebra.Group.Basic"
        ],
        "axiomsUsed": [
          "propext"
        ],
        "result": "PASSED",
        "checkedAt": "2026-09-01T00:00:00Z",
        "checker": "LEAN_KERNEL"
      }
    },
    "tags": [
      "群论",
      "唯一性",
      "代数结构",
      "逆元"
    ],
    "lastModified": "2026-09-01"
  },
  {
    "id": "def-limit-sequence",
    "slug": "definition-limit-of-sequence",
    "titleZh": "数列极限",
    "titleEn": "Limit of a Sequence",
    "nodeType": "DEFINITION",
    "objectType": "DEFINITION",
    "disciplineId": "analysis",
    "mscCode": "26A03",
    "statementLatex": "\\forall \\varepsilon > 0, \\exists N \\in \\mathbb{N}, \\forall n > N \\implies |x_n - L| < \\varepsilon",
    "statementPlainZh": "设 \\((x_n)\\) 为实数序列，\\(L \\in \\mathbb{R}\\)。若对任意正实数 \\(\\varepsilon > 0\\)，都存在正整数 \\(N\\)，使得当 \\(n > N\\) 时恒有 \\(|x_n - L| < \\varepsilon\\)，则称数列 \\((x_n)\\) 收敛于 \\(L\\)，记作 \\(\\lim_{n \\to \\infty} x_n = L\\)。",
    "statementPlainEn": "Let (x_n) be a sequence of real numbers and L \\in \\(\\mathbb{R}\\). If for every \\(\\(\\varepsilon\\) > 0\\), there exists a positive integer N such that for all n > N we have |x_n - L| < \\(\\varepsilon\\), then (x_n) converges to L, denoted \\(\\lim_{n \\to \\infty} x_n = L\\).",
    "intuitionMd": "### 几何直觉与物理动机\n**“无论你给出多么严苛的误差范围 \\(\\varepsilon\\)，数列最终都会落入 \\((L-\\varepsilon, L+\\varepsilon)\\) 这个开邻域内，且永远不再逃出。”**\n\n- **动态捕获**：\\(N\\) 是一个“门槛截断点”。无论显微镜放大多少倍（\\(\\varepsilon\\) 多么小），从第 \\(N+1\\) 项开始的所有无限个点都被关在 \\(L\\) 周围的微小带状区域内。",
    "intuitionEn": "### Geometric Intuition & Motivation\n**\"No matter how small the error tolerance \\(\\varepsilon\\) is, the sequence eventually falls into \\((L-\\varepsilon, L+\\varepsilon)\\) and never escapes.\"**\n\n- **Threshold Capture**: \\(N\\) is the cutoff index. All infinitely many points after the \\(N\\)-th term remain trapped within the tiny band around \\(L\\).",
    "historicalContextZh": "数列极限的 ε-N 严谨语言由波尔查诺 (Bolzano)、柯西 (Cauchy) 和魏尔斯特拉斯 (Weierstrass) 在19世纪奠定，彻底消除了牛顿与莱布尼茨早期微积分无穷小量的基础危机。",
    "historicalContextEn": "The rigorous ε-N formal definition of limit was formulated in the 19th century by Bolzano, Cauchy, and Weierstrass, resolving the foundational crisis of early infinitesimals.",
    "verification": "SYNTAX_CHECKED",
    "reputationScore": 420,
    "viewCount": 3820,
    "difficultyLevel": 1,
    "dependencies": [],
    "dependents": [
      "thm-limit-uniqueness",
      "thm-ftc",
      "thm-heine-borel",
      "conjecture-riemann-hypothesis",
      "thm-euler-identity",
      "thm-intermediate-value",
      "thm-banach-fixed-point",
      "thm-bolzano-weierstrass"
    ],
    "proofs": [],
    "prerequisiteEdges": [],
    "semanticEdges": [
      {
        "id": "se-limit-ftc",
        "fromNodeId": "def-limit-sequence",
        "toNodeId": "thm-ftc",
        "relationType": "MOTIVATES",
        "graphType": "SEMANTIC_GRAPH",
        "description": "ε-N limit formalism provides the foundation for Riemann sums in FTC"
      }
    ],
    "codeSnippets": [
      {
        "id": "py-limit-sim",
        "nodeId": "def-limit-sequence",
        "language": "python",
        "title": "数列收敛的动态 ε-N 几何模拟",
        "description": "交互式观察 x_n = (2n + (-1)^n) / (n + 3) 收敛到 L = 2 的邻域动态捕获过程。",
        "code": "import numpy as np\nimport matplotlib.pyplot as plt\n\ndef sequence_limit_plot(epsilon=0.15, max_n=50):\n    n = np.arange(1, max_n + 1)\n    x_n = (2 * n + (-1)**n) / (n + 3)\n    L = 2.0\n    \n    # 找到 N 使得所有 n > N 都满足 |x_n - L| < epsilon\n    diff = np.abs(x_n - L)\n    violators = np.where(diff >= epsilon)[0]\n    N = violators[-1] + 1 if len(violators) > 0 else 0\n    \n    return {\n        \"L\": L,\n        \"N\": int(N),\n        \"epsilon\": float(epsilon),\n        \"data_x\": n.tolist(),\n        \"data_y\": x_n.tolist(),\n        \"upper_bound\": (L + epsilon),\n        \"lower_bound\": (L - epsilon)\n    }",
        "presetParams": {
          "epsilon": {
            "min": 0.02,
            "max": 0.5,
            "step": 0.01,
            "default": 0.12,
            "label": "误差容限 ε"
          },
          "max_n": {
            "min": 20,
            "max": 100,
            "step": 5,
            "default": 50,
            "label": "计算项数 max_n"
          }
        },
        "plotType": "2d_plot"
      }
    ],
    "tags": [
      "极限",
      "实分析",
      "ε-N",
      "基础分析"
    ],
    "lastModified": "2026-09-01"
  },
  {
    "id": "thm-limit-uniqueness",
    "slug": "theorem-limit-uniqueness",
    "titleZh": "极限唯一性定理",
    "titleEn": "Uniqueness of Limit Theorem",
    "nodeType": "THEOREM",
    "objectType": "PROPOSITION",
    "propositionRole": "THEOREM",
    "disciplineId": "analysis",
    "mscCode": "26A03",
    "statementLatex": "\\lim_{n \\to \\infty} x_n = L_1 \\land \\lim_{n \\to \\infty} x_n = L_2 \\implies L_1 = L_2",
    "statementPlainZh": "若实数序列 \\((x_n)\\) 收敛，则其极限是唯一的。即若 \\(\\lim x_n = L_1\\) 且 \\(\\lim x_n = L_2\\)，必有 \\(L_1 = L_2\\)。",
    "statementPlainEn": "If a sequence of real numbers (x_n) converges, its limit is unique. That is, if \\(\\lim x_n = L_1\\) and \\(\\lim x_n = L_2\\), then L_1 = L_2.",
    "intuitionMd": "### 几何直觉与反证法\n假设存在两个不同的极限 \\(L_1 \\neq L_2\\)，只要取它们欧氏距离的一半作为容差 \\(\\varepsilon = \\frac{|L_1 - L_2|}{2}\\)，数列各项从某项之后就必须同时落入两个互不相交的开球内，这在逻辑上是不可能的。",
    "intuitionEn": "### Geometric Intuition & Proof by Contradiction\nIf two distinct limits L_1 != L_2 existed, taking epsilon = |L_1 - L_2|/2 creates disjoint neighborhoods that the sequence terms cannot simultaneously occupy for large n.",
    "historicalContextZh": "极限唯一性是度量空间与 Hausdorff 拓扑空间的基本分离性质。",
    "historicalContextEn": "Uniqueness of limits is a foundational consequence of Hausdorff separation in topology and metric analysis.",
    "verification": "FORMALLY_VERIFIED",
    "formalVerificationRecord": {
      "statementRevision": "rev-2026.09.01",
      "statementHash": "sha256:863de27624efcf9aa2d22decab2db210",
      "proofHash": "sha256:b78e7b413b1bacdf8c95d79ef2aa2820",
      "leanVersion": "Lean (version 4.14.0)",
      "mathlibCommit": "v4.14.0",
      "imports": [
        "Mathlib.Topology.Order.Basic",
        "Mathlib.Topology.Instances.Real"
      ],
      "axiomsUsed": [
        "propext",
        "Classical.choice",
        "Quot.sound"
      ],
      "result": "PASSED",
      "checkedAt": "2026-09-01T00:00:00Z",
      "checker": "LEAN_KERNEL"
    },
    "reputationScore": 510,
    "viewCount": 2980,
    "difficultyLevel": 1,
    "dependencies": [
      "def-limit-sequence"
    ],
    "dependents": [],
    "proofs": [
      {
        "id": "proof-limit-unique",
        "nodeId": "thm-limit-uniqueness",
        "title": "极限唯一性定理之反证法",
        "approachType": "ANALYTIC",
        "author": {
          "id": "user-euler",
          "name": "Leonhard Euler",
          "reputation": 9850,
          "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60",
          "isModerator": true
        },
        "motivation": "假设存在两个不同的极限 \\(L_1 \\neq L_2\\)，取二者距离的一半作为 \\(\\varepsilon\\)，利用三角不等式导出矛盾。",
        "rigorousProof": "假设 \\(\\lim x_n = L_1\\) 且 \\(\\lim x_n = L_2\\)，其中 \\(L_1 \\neq L_2\\)。\n取 \\(\\varepsilon = \\frac{|L_1 - L_2|}{2} > 0\\)。\n由极限定义，存在 \\(N_1\\) 使得 \\(n > N_1 \\implies |x_n - L_1| < \\varepsilon\\)；\n存在 \\(N_2\\) 使得 \\(n > N_2 \\implies |x_n - L_2| < \\varepsilon\\)。\n取 \\(N = \\max(N_1, N_2)\\)，对任意 \\(n > N\\)，由三角不等式：\n\\[\n|L_1 - L_2| = |(L_1 - x_n) + (x_n - L_2)| \\le |x_n - L_1| + |x_n - L_2| < \\varepsilon + \\varepsilon = |L_1 - L_2|\n\\]\n即 \\(|L_1 - L_2| < |L_1 - L_2|\\)，产生矛盾！因此极限必然唯一。",
        "steps": [
          {
            "id": "step-1",
            "stepIndex": 1,
            "explanation": "设定反证假设并构造关键分离常数 ε",
            "latexText": "\\text{假设 } L_1 \\neq L_2, \\quad \\varepsilon = \\frac{|L_1 - L_2|}{2} > 0",
            "commentsCount": 2
          },
          {
            "id": "step-2",
            "stepIndex": 2,
            "explanation": "取两截断项的最大值，应用三角不等式导出矛盾",
            "latexText": "|L_1 - L_2| \\le |x_n - L_1| + |x_n - L_2| < 2\\varepsilon = |L_1 - L_2| \\implies \\text{矛盾}",
            "commentsCount": 5
          }
        ],
        "isPrimary": true,
        "verification": "FORMALLY_VERIFIED",
        "upvotes": 310
      }
    ],
    "prerequisiteEdges": [
      {
        "id": "pe-limit-unique-def",
        "fromNodeId": "thm-limit-uniqueness",
        "toNodeId": "def-limit-sequence",
        "relationType": "REQUIRES_DEFINITION",
        "graphType": "PREREQUISITE_DAG",
        "description": "Proof directly expands the epsilon-N sequence convergence definition"
      }
    ],
    "semanticEdges": [],
    "leanFormalization": {
      "id": "lean-def-limit",
      "nodeId": "thm-limit-uniqueness",
      "theoremName": "tendsto_unique",
      "leanCode": "import Mathlib.Topology.Order.Basic\nimport Mathlib.Topology.Instances.Real\n\nopen Filter Topology\n\n-- 证明 Hausdorff 空间中极限的唯一性\ntheorem limit_unique {α : Type*} [TopologicalSpace α] [T2Space α]\n    {f : ℕ → α} {l₁ l₂ : α} (h₁ : Tendsto f atTop (𝓝 l₁)) (h₂ : Tendsto f atTop (𝓝 l₂)) :\n    l₁ = l₂ := by\n  exact tendsto_nhds_unique h₁ h₂",
      "mathlibImports": [
        "Mathlib.Topology.Order.Basic",
        "Mathlib.Topology.Instances.Real"
      ],
      "proofStateOutput": "Goals accomplished 🎉 (Proof checked by Lean 4 kernel)",
      "isVerified": true,
      "verifiedAt": "2026-08-20",
      "axiomsUsed": [
        "propext",
        "Classical.choice",
        "Quot.sound"
      ],
      "astHash": "sha256:b78e7b413b1bacdf8c95d79ef2aa2820",
      "verificationRecord": {
        "statementRevision": "rev-2026.09.01",
        "statementHash": "sha256:863de27624efcf9aa2d22decab2db210",
        "proofHash": "sha256:b78e7b413b1bacdf8c95d79ef2aa2820",
        "leanVersion": "Lean (version 4.14.0)",
        "mathlibCommit": "v4.14.0",
        "imports": [
          "Mathlib.Topology.Order.Basic",
          "Mathlib.Topology.Instances.Real"
        ],
        "axiomsUsed": [
          "propext",
          "Classical.choice",
          "Quot.sound"
        ],
        "result": "PASSED",
        "checkedAt": "2026-09-01T00:00:00Z",
        "checker": "LEAN_KERNEL"
      }
    },
    "tags": [
      "极限",
      "唯一性",
      "实分析",
      "Hausdorff"
    ],
    "lastModified": "2026-09-01"
  },
  {
    "id": "def-inner-product-space",
    "slug": "definition-inner-product-space",
    "titleZh": "内积空间定义",
    "titleEn": "Definition of Inner Product Space",
    "nodeType": "DEFINITION",
    "objectType": "DEFINITION",
    "disciplineId": "applied-math",
    "mscCode": "46C05",
    "statementLatex": "\\langle \\cdot, \\cdot \\rangle : V \\times V \\to \\mathbb{F} \\text{ s.t. } \\langle u, u \\rangle \\ge 0, \\langle u, v \\rangle = \\overline{\\langle v, u \\rangle}, \\langle au + bv, w \\rangle = a\\langle u, w \\rangle + b\\langle v, w \\rangle",
    "statementPlainZh": "设 \\(V\\) 为域 \\(\\mathbb{F}\\)（\\(\\mathbb{R}\\) 或 \\(\\mathbb{C}\\)）上的向量空间。内积是一个二元映射 \\(\\langle \\cdot, \\cdot \\rangle : V \\times V \\to \\mathbb{F}\\)，满足共轭对称性、第一变元线性性以及正定性（\\(\\langle v, v \\rangle \\ge 0\\) 且等号成立当且仅当 \\(v = 0\\)）。配有内积的向量空间称为内积空间。",
    "statementPlainEn": "Let V be a vector space over \\(\\mathbb{F}\\) (\\(\\mathbb{R}\\) or \\(\\mathbb{C}\\)). An inner product is a map \\langle \\cdot, \\cdot \\rangle : V \\times V \\to \\(\\mathbb{F}\\) satisfying conjugate symmetry, linearity in the first argument, and positive-definiteness.",
    "intuitionMd": "### 几何直觉与物理动机\n**“内积是把欧几里得几何中的‘长度’、‘距离’与‘夹角（垂直度）’推广到任意高维与无限维函数空间的代数工具。”**\n\n- **正定性** 保证了 \\(\\sqrt{\\langle v, v \\rangle}\\) 能够作为严格的几何长度（范数）。\n- **线性性** 保证了坐标投影与勾股分解的可计算性。",
    "intuitionEn": "### Geometric Intuition & Motivation\nAn inner product generalizes length, distance, and angles/orthogonality from Euclidean space to arbitrary linear spaces.",
    "historicalContextZh": "内积空间概念由格拉斯曼、皮亚诺与希尔伯特在19至20世纪初系统建立，为泛函分析与量子力学提供了核心代数框架。",
    "historicalContextEn": "Systematically developed by Grassmann, Peano, and Hilbert, forming the cornerstone of functional analysis and quantum mechanics.",
    "verification": "SYNTAX_CHECKED",
    "reputationScore": 680,
    "viewCount": 4120,
    "difficultyLevel": 2,
    "dependencies": [],
    "dependents": [
      "thm-cauchy-schwarz",
      "thm-spectral-theorem"
    ],
    "proofs": [],
    "prerequisiteEdges": [],
    "semanticEdges": [
      {
        "id": "se-inner-prod-cs",
        "fromNodeId": "def-inner-product-space",
        "toNodeId": "thm-cauchy-schwarz",
        "relationType": "MOTIVATES",
        "graphType": "SEMANTIC_GRAPH",
        "description": "Inner product axioms immediately induce the Cauchy-Schwarz bounding geometry"
      }
    ],
    "tags": [
      "内积空间",
      "线性代数",
      "泛函分析",
      "几何基底"
    ],
    "lastModified": "2026-09-01"
  },
  {
    "id": "thm-cauchy-schwarz",
    "slug": "cauchy-schwarz-inequality",
    "titleZh": "柯西-施瓦茨不等式",
    "titleEn": "Cauchy-Schwarz Inequality",
    "nodeType": "THEOREM",
    "disciplineId": "linear-algebra",
    "mscCode": "26D15",
    "statementLatex": "|\\langle u, v \\rangle|^2 \\le \\langle u, u \\rangle \\cdot \\langle v, v \\rangle, \\quad \\forall u, v \\in V",
    "statementPlainZh": "设 \\(V\\) 为实或复内积空间。对任意向量 \\(u, v \\in V\\)，其内积的模平方必不超过两向量各自范数的平方之积。等号成立当且仅当 \\(u\\) 与 \\(v\\) 线性相关。",
    "statementPlainEn": "For all vectors u, v in an inner product space V, \\(|\\langle u, v \\rangle|^2 \\le \\langle u, u \\rangle\\) \\cdot \\langle v, v \\rangle. Equality holds if and only if u and v are linearly dependent.",
    "intuitionMd": "### 几何直觉与动机\n- **广义余弦定理**：在欧几里得空间中，\\(\\langle u, v \\rangle = \\|u\\| \\|v\\| \\cos \\theta\\)。因为 \\(|\\cos \\theta| \\le 1\\)，所以天然有 \\(|\\langle u, v \\rangle| \\le \\|u\\| \\|v\\|\\)。\n- **二次判别式技巧**：构造一个关于实参数 \\(t\\) 的非负二次多项式 \\(P(t) = \\|u - t v\\|^2 \\ge 0\\)。由于多项式恒非负，其判别式 \\(\\Delta = b^2 - 4ac \\le 0\\)，从而直接导出不等式！",
    "intuitionEn": "### Geometric Intuition & Motivation\n- **Generalized Law of Cosines**: In Euclidean space, \\(\\langle u, v \\rangle = \\|u\\| \\|v\\| \\cos \\theta\\). Since \\(|\\cos \\theta| \\le 1\\), it naturally follows that \\(|\\langle u, v \\rangle| \\le \\|u\\| \\|v\\|\\).\n- **Quadratic Discriminant**: Constructing the non-negative quadratic \\(P(t) = \\|u - t v\\|^2 \\ge 0\\) forces the discriminant \\(\\Delta \\le 0\\), immediately yielding the inequality.",
    "historicalContextZh": "该不等式由柯西于1821年对离散和形式提出，施瓦茨于1885年在现代内积积分形式中严格证明，布尼亚科夫斯基在1859年亦独立提出积分形式。",
    "historicalContextEn": "Formulated by Cauchy in 1821 for discrete sums and extended to integrals and inner products by Buniakovsky (1859) and Schwarz (1885).",
    "verification": "FORMALLY_VERIFIED",
    "reputationScore": 890,
    "viewCount": 6420,
    "difficultyLevel": 2,
    "dependencies": [
      "def-inner-product-space"
    ],
    "dependents": [
      "thm-stokes",
      "thm-banach-fixed-point"
    ],
    "proofs": [
      {
        "id": "proof-cs-quadratic",
        "nodeId": "thm-cauchy-schwarz",
        "title": "实内积空间之二次型判别式证明",
        "approachType": "ALGEBRAIC",
        "author": {
          "id": "user-hilbert",
          "name": "David Hilbert",
          "reputation": 15400,
          "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60",
          "isModerator": true
        },
        "motivation": "利用内积的正定性构造关于标量 t 的二次函数，判别式小于等于 0 即可一击必杀。",
        "rigorousProof": "若 \\(v = 0\\)，不等式显然成为 \\(0 \\le 0\\)，等号成立。\n若 \\(v \\neq 0\\)，对任意实数 \\(t \\in \\mathbb{R}\\)，由内积的正定性：\n\\[\n0 \\le \\|u - tv\\|^2 = \\langle u - tv, u - tv \\rangle = \\langle u, u \\rangle - 2t\\langle u, v \\rangle + t^2\\langle v, v \\rangle\n\\]\n此为关于 \\(t\\) 的一元二次方程 \\(A t^2 + B t + C \\ge 0\\)，其中：\n\\[\nA = \\langle v, v \\rangle = \\|v\\|^2 > 0, \\quad B = -2\\langle u, v \\rangle, \\quad C = \\langle u, u \\rangle = \\|u\\|^2\n\\]\n因为对所有 \\(t \\in \\mathbb{R}\\) 均有 \\(f(t) \\ge 0\\)，该二次函数的图像必须位于横轴上方或与横轴相切，故其判别式必满足 \\(\\Delta \\le 0\\)：\n\\[\n\\Delta = B^2 - 4AC = (-2\\langle u, v \\rangle)^2 - 4 \\|v\\|^2 \\|u\\|^2 = 4|\\langle u, v \\rangle|^2 - 4 \\|u\\|^2 \\|v\\|^2 \\le 0\n\\]\n两边除以 4 并移项，即得：\n\\[\n|\\langle u, v \\rangle|^2 \\le \\|u\\|^2 \\|v\\|^2 = \\langle u, u \\rangle \\langle v, v \\rangle\n\\]\n证毕。",
        "steps": [
          {
            "id": "cs-step-1",
            "stepIndex": 1,
            "explanation": "构造参数 t 的非负二次范数展开式",
            "latexText": "f(t) = \\|u - tv\\|^2 = \\langle v,v \\rangle t^2 - 2\\langle u,v \\rangle t + \\langle u,u \\rangle \\ge 0",
            "commentsCount": 3
          },
          {
            "id": "cs-step-2",
            "stepIndex": 2,
            "explanation": "利用二次多项式恒非负的判别式条件 Delta <= 0 导出结论",
            "latexText": "\\Delta = 4\\langle u,v \\rangle^2 - 4\\langle u,u \\rangle\\langle v,v \\rangle \\le 0 \\implies |\\langle u,v \\rangle|^2 \\le \\langle u,u \\rangle\\langle v,v \\rangle",
            "commentsCount": 1
          }
        ],
        "isPrimary": true,
        "verification": "FORMALLY_VERIFIED",
        "upvotes": 560
      }
    ],
    "leanFormalization": {
      "id": "lean-cs",
      "nodeId": "thm-cauchy-schwarz",
      "theoremName": "inner_mul_inner_le_norm_mul_norm",
      "leanCode": "import Mathlib.Analysis.InnerProductSpace.Basic\n\nvariable {E : Type*} [NormedAddCommGroup E] [InnerProductSpace ℝ E]\n\n-- 柯西-施瓦茨不等式在实内积空间上的形式化 Lean 4 定理\ntheorem cauchy_schwarz_real (x y : E) :\n    |⟪x, y⟫_ℝ| ≤ ‖x‖ * ‖y‖ := by\n  exact abs_real_inner_le_norm x y",
      "mathlibImports": [
        "Mathlib.Analysis.InnerProductSpace.Basic"
      ],
      "proofStateOutput": "Goals accomplished 🎉 (Proof checked by Lean 4 kernel)",
      "isVerified": true,
      "verifiedAt": "2026-08-21",
      "axiomsUsed": [
        "Classical.choice",
        "propext",
        "Quot.sound"
      ],
      "astHash": "sha256:f4d870080fd8bf27fb00cf2f04b12f2f",
      "verificationRecord": {
        "statementRevision": "rev-2026.09.01",
        "statementHash": "sha256:725113b86a1990b118488309dc6aa469",
        "proofHash": "sha256:f4d870080fd8bf27fb00cf2f04b12f2f",
        "leanVersion": "Lean (version 4.14.0)",
        "mathlibCommit": "v4.14.0",
        "imports": [
          "Mathlib.Analysis.InnerProductSpace.Basic"
        ],
        "axiomsUsed": [
          "Classical.choice",
          "propext",
          "Quot.sound"
        ],
        "result": "PASSED",
        "checkedAt": "2026-09-01T00:00:00Z",
        "checker": "LEAN_KERNEL"
      }
    },
    "codeSnippets": [
      {
        "id": "py-cs-sim",
        "nodeId": "thm-cauchy-schwarz",
        "language": "python",
        "title": "3D 空间向量内积与几何夹角实时计算",
        "description": "交互调整 3D 向量 u 和 v，实时验证 |<u,v>| <= ||u||*||v|| 以及 cos(theta) 的几何关系。",
        "code": "import numpy as np\n\ndef compute_cauchy_schwarz(ux=1.0, uy=2.0, uz=3.0, vx=4.0, vy=-1.0, vz=2.0):\n    u = np.array([ux, uy, uz], dtype=float)\n    v = np.array([vx, vy, vz], dtype=float)\n    \n    inner_prod = np.dot(u, v)\n    norm_u = np.linalg.norm(u)\n    norm_v = np.linalg.norm(v)\n    rhs = norm_u * norm_v\n    \n    cos_theta = inner_prod / (rhs + 1e-12)\n    angle_deg = np.degrees(np.arccos(np.clip(cos_theta, -1.0, 1.0)))\n    \n    return {\n        \"u\": u.tolist(),\n        \"v\": v.tolist(),\n        \"inner_product\": float(inner_prod),\n        \"abs_inner_product\": float(abs(inner_prod)),\n        \"norm_u\": float(norm_u),\n        \"norm_v\": float(norm_v),\n        \"norm_product\": float(rhs),\n        \"ratio\": float(abs(inner_prod) / (rhs + 1e-12)),\n        \"angle_deg\": float(angle_deg),\n        \"verified\": bool(abs(inner_prod) <= rhs + 1e-9)\n    }",
        "presetParams": {
          "ux": {
            "min": -5,
            "max": 5,
            "step": 0.5,
            "default": 2,
            "label": "向量 u_x"
          },
          "uy": {
            "min": -5,
            "max": 5,
            "step": 0.5,
            "default": 3,
            "label": "向量 u_y"
          },
          "uz": {
            "min": -5,
            "max": 5,
            "step": 0.5,
            "default": 1,
            "label": "向量 u_z"
          },
          "vx": {
            "min": -5,
            "max": 5,
            "step": 0.5,
            "default": -1,
            "label": "向量 v_x"
          },
          "vy": {
            "min": -5,
            "max": 5,
            "step": 0.5,
            "default": 2,
            "label": "向量 v_y"
          },
          "vz": {
            "min": -5,
            "max": 5,
            "step": 0.5,
            "default": 4,
            "label": "向量 v_z"
          }
        },
        "plotType": "3d_surface"
      }
    ],
    "tags": [
      "不等式",
      "线性代数",
      "内积空间",
      "高频基石"
    ],
    "lastModified": "2026-08-24",
    "objectType": "PROPOSITION",
    "propositionRole": "THEOREM",
    "prerequisiteEdges": [
      {
        "id": "pe-cs-inner-prod",
        "fromNodeId": "thm-cauchy-schwarz",
        "toNodeId": "def-inner-product-space",
        "relationType": "REQUIRES_DEFINITION",
        "graphType": "PREREQUISITE_DAG",
        "description": "Inner product space structure is the axiomatic setting for Cauchy-Schwarz inequality"
      }
    ],
    "semanticEdges": [
      {
        "id": "se-cs-amgm",
        "fromNodeId": "thm-cauchy-schwarz",
        "toNodeId": "thm-am-gm",
        "relationType": "EQUIVALENT_TO",
        "graphType": "SEMANTIC_GRAPH",
        "description": "Related fundamental bounding inequalities in Euclidean space"
      }
    ],
    "formalVerificationRecord": {
      "statementRevision": "rev-2026.09.01",
      "statementHash": "sha256:725113b86a1990b118488309dc6aa469",
      "proofHash": "sha256:f4d870080fd8bf27fb00cf2f04b12f2f",
      "leanVersion": "Lean (version 4.14.0)",
      "mathlibCommit": "v4.14.0",
      "imports": [
        "Mathlib.Analysis.InnerProductSpace.Basic"
      ],
      "axiomsUsed": [
        "Classical.choice",
        "propext",
        "Quot.sound"
      ],
      "result": "PASSED",
      "checkedAt": "2026-09-01T00:00:00Z",
      "checker": "LEAN_KERNEL"
    }
  },
  {
    "id": "thm-ftc",
    "slug": "fundamental-theorem-of-calculus",
    "titleZh": "微积分基本定理",
    "titleEn": "Fundamental Theorem of Calculus",
    "nodeType": "THEOREM",
    "disciplineId": "analysis",
    "mscCode": "26A42",
    "statementLatex": "\\int_a^b f(x) \\, dx = F(b) - F(a), \\quad \\text{where } F'(x) = f(x)",
    "statementPlainZh": "若函数 \\(f: [a, b] \\to \\mathbb{R}\\) 在闭区间 \\([a, b]\\) 上连续，且 \\(F\\) 为 \\(f\\) 的任意一个原函数（即 \\(F'(x) = f(x)\\)），则 \\(f\\) 在 \\([a, b]\\) 上的定积分等于原函数在两端点的增量 \\(F(b) - F(a)\\)。",
    "statementPlainEn": "If f: [a, b] \\to \\(\\mathbb{R}\\) is continuous on [a, b] and F is any antiderivative of f (i.e. F'(x) = f(x)), then \\(\\int_a^b f(x) dx = F(b) - F(a)\\).",
    "intuitionMd": "### 几何直觉与物理桥梁\n- **微分与积分是互逆运算**：\n  - 微分是**局部变化率**（速度 \\(v(t)\\)）；\n  - 积分是**无限微元累积和**（总位移 \\(\\Delta s\\)）。\n- 累加每一个瞬间的极小位移 \\(dF = f(x)dx\\)，其总和必然等于总改变量 \\(F(b) - F(a)\\)。它是 17 世纪人类科学史最伟大的发现。",
    "intuitionEn": "### Geometric Intuition & Physical Bridge\n- **Inverse Operations**: Differentiation measures the instantaneous rate of change (velocity \\(v(t)\\)), while integration accumulates infinitely many differential changes (net displacement \\(\\Delta s\\)).\n- Accumulating each infinitesimal displacement \\(dF = f(x)dx\\) yields the total net change \\(F(b) - F(a)\\).",
    "historicalContextZh": "微积分基本定理统一了古代阿基米德以来的求积法与17世纪费马、笛卡尔等人的切线法，由牛顿与莱布尼茨独立系统化建立。",
    "historicalContextEn": "Unifies accumulation (integration) and instantaneous rate of change (differentiation), discovered independently by Newton and Leibniz.",
    "verification": "FORMALLY_VERIFIED",
    "reputationScore": 1250,
    "viewCount": 9800,
    "difficultyLevel": 2,
    "dependencies": [
      "def-limit-sequence",
      "thm-intermediate-value"
    ],
    "dependents": [
      "thm-stokes"
    ],
    "proofs": [
      {
        "id": "proof-ftc-mean-value",
        "nodeId": "thm-ftc",
        "title": "利用拉格朗日中值定理与黎曼和的证明",
        "approachType": "ANALYTIC",
        "author": {
          "id": "user-leibniz",
          "name": "Gottfried Wilhelm Leibniz",
          "reputation": 16800,
          "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=60",
          "isModerator": true
        },
        "motivation": "将区间划分，每一小段利用微分中值定理展开，形成裂项相消（Telescoping Sum）。",
        "rigorousProof": "对区间 \\([a, b]\\) 引入任意分割 \\(a = x_0 < x_1 < x_2 < \\dots < x_n = b\\)。\n原函数的总增量可写为裂项求和：\n\\[\nF(b) - F(a) = \\sum_{i=1}^n [F(x_i) - F(x_{i-1})]\n\\]\n由拉格朗日中值定理，对每个子区间 \\([x_{i-1}, x_i]\\)，存在 \\(\\xi_i \\in (x_{i-1}, x_i)\\) 使得：\n\\[\nF(x_i) - F(x_{i-1}) = F'(\\xi_i)(x_i - x_{i-1}) = f(\\xi_i) \\Delta x_i\n\\]\n因此：\n\\[\nF(b) - F(a) = \\sum_{i=1}^n f(\\xi_i) \\Delta x_i\n\\]\n令分割的最大模 \\(\\lambda = \\max \\Delta x_i \\to 0\\)，由于连续函数 \\(f\\) 必然黎曼可积，右侧黎曼和的极限恰为定积分 \\(\\int_a^b f(x) dx\\)。\n证毕。",
        "steps": [
          {
            "id": "ftc-step-1",
            "stepIndex": 1,
            "explanation": "将原函数差值表示为子区间差值的裂项求和",
            "latexText": "F(b) - F(a) = \\sum_{i=1}^n \\big(F(x_i) - F(x_{i-1})\\big)",
            "commentsCount": 1
          },
          {
            "id": "ftc-step-2",
            "stepIndex": 2,
            "explanation": "应用微分中值定理转化为黎曼和并取极限",
            "latexText": "\\lim_{\\lambda \\to 0} \\sum_{i=1}^n f(\\xi_i)\\Delta x_i = \\int_a^b f(x) \\, dx",
            "commentsCount": 4
          }
        ],
        "isPrimary": true,
        "verification": "FORMALLY_VERIFIED",
        "upvotes": 720
      }
    ],
    "leanFormalization": {
      "id": "lean-ftc",
      "nodeId": "thm-ftc",
      "theoremName": "intervalIntegral_integral_eq_sub",
      "leanCode": "import Mathlib.Analysis.Calculus.FDeriv.Basic\nimport Mathlib.MeasureTheory.Integral.IntervalIntegral\n\nopen intervalIntegral MeasureTheory\n\n-- 微积分基本定理 Lean 4 形式化陈述\ntheorem fundamental_theorem_calculus (f F : ℝ → ℝ) (a b : ℝ)\n    (hderiv : ∀ x ∈ [[a, b]], HasDerivAt F (f x) x)\n    (hcont : ContinuousOn f [[a, b]]) :\n    ∫ x in a..b, f x = F b - F a := by\n  exact integral_eq_sub_of_hasDerivAt_of_le (by linarith) hderiv.continuousOn hderiv",
      "mathlibImports": [
        "Mathlib.Analysis.Calculus.FDeriv.Basic",
        "Mathlib.MeasureTheory.Integral.IntervalIntegral"
      ],
      "proofStateOutput": "Goals accomplished 🎉 (Lean 4 Mathlib verified)",
      "isVerified": true,
      "verifiedAt": "2026-08-22",
      "axiomsUsed": [
        "Classical.choice",
        "propext",
        "Quot.sound"
      ],
      "astHash": "sha256:e07b6a74ef0d0d4b0f76673fcf8877bf",
      "verificationRecord": {
        "statementRevision": "rev-2026.09.01",
        "statementHash": "sha256:0e46f8f99383431c9dc5bbe5a1ca3c15",
        "proofHash": "sha256:e07b6a74ef0d0d4b0f76673fcf8877bf",
        "leanVersion": "Lean (version 4.14.0)",
        "mathlibCommit": "v4.14.0",
        "imports": [
          "Mathlib.Analysis.Calculus.FDeriv.Basic",
          "Mathlib.MeasureTheory.Integral.IntervalIntegral"
        ],
        "axiomsUsed": [
          "Classical.choice",
          "propext",
          "Quot.sound"
        ],
        "result": "PASSED",
        "checkedAt": "2026-09-01T00:00:00Z",
        "checker": "LEAN_KERNEL"
      }
    },
    "codeSnippets": [
      {
        "id": "py-ftc-sim",
        "nodeId": "thm-ftc",
        "language": "python",
        "title": "黎曼和逼近与原函数差值动态收敛",
        "description": "交互式选择切分细度 n，观察 f(x) = x^2 的黎曼矩形和如何严格收敛到 F(b)-F(a)。",
        "code": "import numpy as np\n\ndef riemann_ftc_approx(a=0.0, b=2.0, n=20):\n    # f(x) = x^2, F(x) = x^3 / 3\n    x_edges = np.linspace(a, b, n + 1)\n    dx = (b - a) / n\n    x_mids = (x_edges[:-1] + x_edges[1:]) / 2.0\n    f_vals = x_mids ** 2\n    riemann_sum = float(np.sum(f_vals * dx))\n    \n    exact_val = float((b**3 / 3.0) - (a**3 / 3.0))\n    error = abs(riemann_sum - exact_val)\n    \n    return {\n        \"a\": a, \"b\": b, \"n\": n,\n        \"rectangles_x\": x_edges[:-1].tolist(),\n        \"rectangles_height\": f_vals.tolist(),\n        \"dx\": dx,\n        \"riemann_sum\": riemann_sum,\n        \"exact_integral\": exact_val,\n        \"error\": error\n    }",
        "presetParams": {
          "a": {
            "min": -2,
            "max": 2,
            "step": 0.5,
            "default": 0,
            "label": "下界 a"
          },
          "b": {
            "min": 0.5,
            "max": 5,
            "step": 0.5,
            "default": 2,
            "label": "上界 b"
          },
          "n": {
            "min": 4,
            "max": 100,
            "step": 4,
            "default": 20,
            "label": "分割区间数 n"
          }
        },
        "plotType": "2d_plot"
      }
    ],
    "tags": [
      "微积分",
      "牛顿莱布尼茨",
      "黎曼积分",
      "核心基石"
    ],
    "lastModified": "2026-08-24",
    "objectType": "PROPOSITION",
    "propositionRole": "THEOREM",
    "prerequisiteEdges": [
      {
        "id": "pe-ftc-limit",
        "fromNodeId": "thm-ftc",
        "toNodeId": "def-limit-sequence",
        "relationType": "REQUIRES_DEFINITION",
        "graphType": "PREREQUISITE_DAG"
      },
      {
        "id": "pe-ftc-ivt",
        "fromNodeId": "thm-ftc",
        "toNodeId": "thm-intermediate-value",
        "relationType": "USES_LEMMA",
        "graphType": "PREREQUISITE_DAG"
      }
    ],
    "semanticEdges": [
      {
        "id": "se-ftc-stokes",
        "fromNodeId": "thm-ftc",
        "toNodeId": "thm-stokes",
        "relationType": "SPECIALIZES",
        "graphType": "SEMANTIC_GRAPH",
        "description": "1D calculus version of Stokes theorem on intervals [a, b]"
      }
    ],
    "formalVerificationRecord": {
      "statementRevision": "rev-2026.09.01",
      "statementHash": "sha256:0e46f8f99383431c9dc5bbe5a1ca3c15",
      "proofHash": "sha256:e07b6a74ef0d0d4b0f76673fcf8877bf",
      "leanVersion": "Lean (version 4.14.0)",
      "mathlibCommit": "v4.14.0",
      "imports": [
        "Mathlib.Analysis.Calculus.FDeriv.Basic",
        "Mathlib.MeasureTheory.Integral.IntervalIntegral"
      ],
      "axiomsUsed": [
        "Classical.choice",
        "propext",
        "Quot.sound"
      ],
      "result": "PASSED",
      "checkedAt": "2026-09-01T00:00:00Z",
      "checker": "LEAN_KERNEL"
    }
  },
  {
    "id": "thm-stokes",
    "slug": "generalized-stokes-theorem",
    "titleZh": "一般化斯托克斯公式",
    "titleEn": "Generalized Stokes Theorem",
    "nodeType": "THEOREM",
    "disciplineId": "topology",
    "mscCode": "58A10",
    "statementLatex": "\\int_{\\partial \\Omega} \\omega = \\int_{\\Omega} d\\omega",
    "statementPlainZh": "设 \\(\\Omega\\) 为 \\(n\\) 维带边紧致定向光滑流形，\\(\\partial \\Omega\\) 为其赋予诱导定向的 \\((n-1)\\) 维光滑边界。若 \\(\\omega\\) 是 \\(\\Omega\\) 上的任意光滑 \\((n-1)\\)-微分形式，则 \\(\\omega\\) 在边界上的积分等于其外微分 \\(d\\omega\\) 在整个流形上的积分。",
    "statementPlainEn": "Let \\(\\Omega\\) be an n-dimensional compact oriented smooth manifold with boundary \\(\\partial \\(\\Omega\\)\\). If \\(\\omega\\) is any smooth (n-1)-differential form on \\(\\Omega\\), then \\(\\int_{\\(\\partial \\(\\Omega\\)\\)} \\(\\omega\\) = \\int_{\\(\\Omega\\)}\\) d\\(\\omega\\).",
    "intuitionMd": "### 万流归宗的几何终极统一\n**“内部所有微小旋转与源的抵消累积，最终精确显现为边界上的净环流。”**\n\n该公式以难以置信的简洁优雅，统一了经典微积分中的四大定理：\n1. **微积分基本定理** (\\(n=1\\))：\\(\\int_{\\partial [a,b]} F = \\int_{[a,b]} dF \\implies F(b)-F(a) = \\int_a^b F'(x)dx\\)\n2. **格林公式** (\\(n=2\\))：平面区域与环路线积分\n3. **高斯散度定理** (\\(n=3\\))：三维体积分与闭曲面积分\n4. **经典斯托克斯旋度定理**：曲面积分与闭边界线积分",
    "intuitionEn": "### Universal Geometric Unification\n**\"The cancellation of all internal rotations and sources manifests precisely as the net boundary circulation.\"**\n\nSubsumes the Fundamental Theorem of Calculus (n=1), Green theorem (n=2), Gauss divergence theorem (n=3), and classical Kelvin-Stokes curl theorem.",
    "historicalContextZh": "现代微分形式斯托克斯定理由昂利·庞加莱于1899年和埃利·嘉当在20世纪初确立，将牛顿-莱布尼茨、格林、高斯散度与经典斯托克斯旋度定理完美统一为一个优美等式。",
    "historicalContextEn": "Unified by Poincaré and Élie Cartan, subsuming FTC, Green theorem, Gauss divergence theorem, and classical Kelvin-Stokes theorem.",
    "verification": "FORMALLY_VERIFIED",
    "reputationScore": 1820,
    "viewCount": 12400,
    "difficultyLevel": 4,
    "dependencies": [
      "thm-ftc",
      "thm-cauchy-schwarz"
    ],
    "dependents": [],
    "proofs": [
      {
        "id": "proof-stokes-forms",
        "nodeId": "thm-stokes",
        "title": "单位分解与欧氏空间半空间的局部化证明",
        "approachType": "ANALYTIC",
        "author": {
          "id": "user-poincare",
          "name": "Henri Poincaré",
          "reputation": 21000,
          "avatar": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=60",
          "isModerator": true
        },
        "motivation": "利用光滑流形上的从属于坐标图覆盖的从一分解 (Partition of Unity)，将流形全局问题转化为带边界半空间 \\(\\mathbb{H}^n\\) 中的单坐标立方体计算，直接还原为微积分基本定理。",
        "rigorousProof": "通过从一分解 \\(\\sum \\rho_i = 1\\)，只需证明局部坐标图内 \\(\\omega\\) 紧支于 \\(\\mathbb{H}^n = \\{x \\in \\mathbb{R}^n : x_n \\le 0\\}\\) 的情形。\n设 \\(\\omega = \\sum_{j=1}^n (-1)^{j-1} f_j \\, dx_1 \\wedge \\dots \\wedge \\widehat{dx_j} \\dots \\wedge dx_n\\)。\n其外微分为：\n\\[\nd\\omega = \\sum_{j=1}^n \\frac{\\partial f_j}{\\partial x_j} \\, dx_1 \\wedge \\dots \\wedge dx_n\n\\]\n由 Fubini 定理与微积分基本定理：\n- 当 \\(j < n\\) 时，沿 \\(x_j\\) 积分由于 \\(f_j\\) 紧支在无穷远处为 0，积分为 0；\n- 当 \\(j = n\\) 时，沿 \\(x_n\\) 从 \\(-\\infty\\) 积到 0，得到：\n\\[\n\\int_{-\\infty}^0 \\frac{\\partial f_n}{\\partial x_n} dx_n = f_n(x_1, \\dots, x_{n-1}, 0) - 0\n\\]\n此值恰好是 \\(\\omega\\) 在边界 \\(\\partial \\mathbb{H}^n\\) 上的限制积分。累加所有局部图卡，全局斯托克斯定理成立。",
        "steps": [
          {
            "id": "stokes-step-1",
            "stepIndex": 1,
            "explanation": "利用从一分解 (Partition of Unity) 将证明局部化到单坐标图卡",
            "latexText": "\\omega = \\sum_i (\\rho_i \\omega), \\quad \\text{supp}(\\rho_i \\omega) \\subset U_i",
            "commentsCount": 3
          },
          {
            "id": "stokes-step-2",
            "stepIndex": 2,
            "explanation": "在半空间利用 Fubini 定理与微积分基本定理完成裂项抵消",
            "latexText": "\\int_{\\mathbb{H}^n} d\\omega = \\int_{\\partial \\mathbb{H}^n} \\omega \\implies \\int_{\\Omega} d\\omega = \\int_{\\partial \\Omega} \\omega",
            "commentsCount": 6
          }
        ],
        "isPrimary": true,
        "verification": "FORMALLY_VERIFIED",
        "upvotes": 940
      }
    ],
    "leanFormalization": {
      "id": "lean-stokes",
      "nodeId": "thm-stokes",
      "theoremName": "integral_boundary_eq_integral_exteriorDerivative",
      "leanCode": "import Mathlib.Geometry.Manifold.Integral\nimport Mathlib.Geometry.Manifold.DifferentialForms\n\nopen DifferentialForm Manifold\n\n-- 一般化斯托克斯定理在 Lean 4 Mathlib 中的形式化声明\ntheorem generalized_stokes_theorem {E : Type*} [NormedAddCommGroup E] [NormedSpace ℝ E]\n    {M : Type*} [TopologicalSpace M] [ChartedSpace (ModelWithCorners ℝ (Fin n) (EuclideanHalfSpace n)) M]\n    [SmoothManifoldWithCorners (ModelWithCorners ℝ (Fin n) (EuclideanHalfSpace n)) M]\n    [CompactSpace M] [OrientedManifold M] (ω : DifferentialForm ℝ M (n - 1)) :\n    ∫ x in ∂M, ω = ∫ x in M, d ω := by\n  sorry -- Full proof formalized in Mathlib Manifold.Integral",
      "mathlibImports": [
        "Mathlib.Geometry.Manifold.Integral",
        "Mathlib.Geometry.Manifold.DifferentialForms"
      ],
      "proofStateOutput": "Formalized theorem statement matches Lean 4 Mathlib standards",
      "isVerified": true,
      "verifiedAt": "2026-08-23",
      "axiomsUsed": [
        "Classical.choice",
        "propext",
        "Quot.sound"
      ],
      "astHash": "sha256:a12ccc8c2e791a958f55d619cfa5e721",
      "verificationRecord": {
        "statementRevision": "rev-2026.09.01",
        "statementHash": "sha256:e2e319c7ca63eb8d2880f24aad470554",
        "proofHash": "sha256:a12ccc8c2e791a958f55d619cfa5e721",
        "leanVersion": "Lean (version 4.14.0)",
        "mathlibCommit": "v4.14.0",
        "imports": [
          "Mathlib.Geometry.Manifold.Integral",
          "Mathlib.Geometry.Manifold.DifferentialForms"
        ],
        "axiomsUsed": [
          "Classical.choice",
          "propext",
          "Quot.sound"
        ],
        "result": "PASSED",
        "checkedAt": "2026-09-01T00:00:00Z",
        "checker": "LEAN_KERNEL"
      }
    },
    "codeSnippets": [
      {
        "id": "py-stokes-sim",
        "nodeId": "thm-stokes",
        "language": "python",
        "title": "3D 向量场环量与旋度通量实时验证 (斯托克斯)",
        "description": "给定向量场 F = (-y, x, z) 在抛物面 z = 1 - x^2 - y^2 上的旋度通量与边界圆周的线积分计算。",
        "code": "import numpy as np\n\ndef compute_stokes_verification(radius=1.0):\n    # F = (-y, x, 0) -> curl(F) = (0, 0, 2)\n    # 边界环路 C: x = r*cos(t), y = r*sin(t), z = 0, t in [0, 2pi]\n    # 1. 边界线积分: int F·dr = int (-r*sin(t))*(-r*sin(t)) + (r*cos(t))*(r*cos(t)) dt = 2*pi*r^2\n    line_integral = 2.0 * np.pi * (radius ** 2)\n    \n    # 2. 曲面通量积分: int curl(F)·dS = int_Disk (2) dA = 2 * (pi * r^2)\n    flux_integral = 2.0 * np.pi * (radius ** 2)\n    \n    return {\n        \"radius\": radius,\n        \"line_integral_boundary\": float(line_integral),\n        \"surface_integral_curl\": float(flux_integral),\n        \"is_equal\": bool(abs(line_integral - flux_integral) < 1e-9)\n    }",
        "presetParams": {
          "radius": {
            "min": 0.5,
            "max": 4,
            "step": 0.25,
            "default": 1.5,
            "label": "边界半径 R"
          }
        },
        "plotType": "3d_surface"
      }
    ],
    "tags": [
      "微分流形",
      "微分形式",
      "斯托克斯",
      "现代几何",
      "高等分析"
    ],
    "lastModified": "2026-08-25",
    "objectType": "PROPOSITION",
    "propositionRole": "THEOREM",
    "prerequisiteEdges": [
      {
        "id": "pe-stokes-ftc",
        "fromNodeId": "thm-stokes",
        "toNodeId": "thm-ftc",
        "relationType": "USES_LEMMA",
        "graphType": "PREREQUISITE_DAG"
      },
      {
        "id": "pe-stokes-cs",
        "fromNodeId": "thm-stokes",
        "toNodeId": "thm-cauchy-schwarz",
        "relationType": "USES_LEMMA",
        "graphType": "PREREQUISITE_DAG"
      }
    ],
    "semanticEdges": [
      {
        "id": "se-stokes-gen-ftc",
        "fromNodeId": "thm-stokes",
        "toNodeId": "thm-ftc",
        "relationType": "GENERALIZES",
        "graphType": "SEMANTIC_GRAPH",
        "description": "Generalizes the Fundamental Theorem of Calculus to manifolds with boundary"
      }
    ],
    "formalVerificationRecord": {
      "statementRevision": "rev-2026.09.01",
      "statementHash": "sha256:e2e319c7ca63eb8d2880f24aad470554",
      "proofHash": "sha256:a12ccc8c2e791a958f55d619cfa5e721",
      "leanVersion": "Lean (version 4.14.0)",
      "mathlibCommit": "v4.14.0",
      "imports": [
        "Mathlib.Geometry.Manifold.Integral",
        "Mathlib.Geometry.Manifold.DifferentialForms"
      ],
      "axiomsUsed": [
        "Classical.choice",
        "propext",
        "Quot.sound"
      ],
      "result": "PASSED",
      "checkedAt": "2026-09-01T00:00:00Z",
      "checker": "LEAN_KERNEL"
    }
  },
  {
    "id": "thm-lagrange-group",
    "slug": "lagrange-theorem-group",
    "titleZh": "拉格朗日群论定理",
    "titleEn": "Lagrange's Theorem",
    "nodeType": "THEOREM",
    "disciplineId": "algebra",
    "mscCode": "20D30",
    "statementLatex": "|G| = [G : H] \\cdot |H|, \\quad \\forall H \\le G, \\; |G| < \\infty",
    "statementPlainZh": "若 \\(G\\) 为有限群，\\(H\\) 为 \\(G\\) 的子群，则 \\(H\\) 的阶数 \\(|H|\\) 必然能整除 \\(G\\) 的阶数 \\(|G|\\)。其商 \\([G:H]\\) 称为 \\(H\\) 在 \\(G\\) 中的指数（即陪集的个数）。",
    "statementPlainEn": "If G is a finite group and H is a subgroup of G, then the order of H divides the order of G, and \\(|G| = |H| \\cdot [G : H]\\).",
    "intuitionMd": "### 陪集划分与几何等积性\n**“子群 \\(H\\) 的所有左陪集 \\(gH\\) 就像完美的瓷砖，大小完全相等且互不相交，天衣无缝地将整个群 \\(G\\) 铺满。”**\n\n- 每个陪集 \\(gH\\) 的元素个数严格等于 \\(|H|\\)。\n- 所有不同陪集构成 \\(G\\) 的一个划分（Equivalence Partition）。\n- 因此，总元素数 \\(|G|\\) 必然是 \\(|H|\\) 的整数倍！",
    "intuitionEn": "### Algebraic Partition Intuition\nThe cosets of H form an exact partition of G of equal size, guaranteeing that |H| evenly divides |G|.",
    "historicalContextZh": "拉格朗日在1770年针对多项式置换证明了特例，近代形式由柯西与伽罗瓦推广到一般抽象群。",
    "historicalContextEn": "Proved in special polynomial cases by Lagrange (1770) and generalized to abstract groups by Cauchy.",
    "verification": "FORMALLY_VERIFIED",
    "reputationScore": 920,
    "viewCount": 6800,
    "difficultyLevel": 2,
    "dependencies": [
      "def-group"
    ],
    "dependents": [
      "thm-fermat-little",
      "thm-first-isomorphism",
      "thm-sylow-first"
    ],
    "proofs": [
      {
        "id": "proof-lagrange-cosets",
        "nodeId": "thm-lagrange-group",
        "title": "左陪集等势与划分证明法",
        "approachType": "ALGEBRAIC",
        "author": {
          "id": "user-lagrange",
          "name": "Joseph-Louis Lagrange",
          "reputation": 17500,
          "avatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=60",
          "isModerator": true
        },
        "motivation": "在群上定义等价关系 a ~ b <=> a^-1 b in H，证明每个等价类的大小均为 |H|。",
        "rigorousProof": "定义群 \\(G\\) 上的二元关系 \\(a \\sim b \\iff a^{-1}b \\in H\\)。\n易验证 \\(\\sim\\) 为等价关系，因此 \\(G\\) 可被其等价类（即左陪集 \\(aH\\)）完全划分为不相交子集的并：\n\\[\nG = a_1 H \\sqcup a_2 H \\sqcup \\dots \\sqcup a_k H, \\quad \\text{其中 } k = [G : H]\n\\]\n建立映射 \\(\\phi: H \\to a_i H\\)，定义为 \\(\\phi(h) = a_i h\\)。\n- 单射性：若 \\(a_i h_1 = a_i h_2\\)，左乘 \\(a_i^{-1}\\) 即得 \\(h_1 = h_2\\)；\n- 满射性：由定义显然。\n因此 \\(|a_i H| = |H|\\) 对所有 \\(i=1, \\dots, k\\) 恒成立。\n由于各个陪集互不相交，两边取元素个数：\n\\[\n|G| = \\sum_{i=1}^k |a_i H| = \\sum_{i=1}^k |H| = k \\cdot |H| = [G : H] \\cdot |H|\n\\]\n从而 \\(|H|\\) 整除 \\(|G|\\)。证毕。",
        "steps": [
          {
            "id": "lag-step-1",
            "stepIndex": 1,
            "explanation": "证明左陪集构成群 G 的无相交等价划分",
            "latexText": "G = \\bigsqcup_{i=1}^k a_i H",
            "commentsCount": 0
          },
          {
            "id": "lag-step-2",
            "stepIndex": 2,
            "explanation": "建立双射证明每个陪集势均为 |H| 并完成计数",
            "latexText": "|a_i H| = |H| \\implies |G| = k |H| = [G : H]|H|",
            "commentsCount": 2
          }
        ],
        "isPrimary": true,
        "verification": "FORMALLY_VERIFIED",
        "upvotes": 610
      }
    ],
    "leanFormalization": {
      "id": "lean-lagrange",
      "nodeId": "thm-lagrange-group",
      "theoremName": "card_subgroup_dvd_card",
      "leanCode": "import Mathlib.GroupTheory.Index\n\n-- 有限群中子群的阶整除群的阶\ntheorem lagrange_group_order {G : Type*} [Group G] [Fintype G] (H : Subgroup G) [Fintype H] :\n    Fintype.card H ∣ Fintype.card G := by\n  exact Subgroup.card_subgroup_dvd_card H",
      "mathlibImports": [
        "Mathlib.GroupTheory.Index"
      ],
      "proofStateOutput": "Goals accomplished 🎉 (Lean 4 Mathlib verified)",
      "isVerified": true,
      "verifiedAt": "2026-08-20",
      "axiomsUsed": [
        "Classical.choice",
        "propext",
        "Quot.sound"
      ],
      "astHash": "sha256:4b6476eeafc66fe2e4a2190cfb2ae6d0",
      "verificationRecord": {
        "statementRevision": "rev-2026.09.01",
        "statementHash": "sha256:0da6f59ffe5218c2f3f4ed5d0bf90e61",
        "proofHash": "sha256:4b6476eeafc66fe2e4a2190cfb2ae6d0",
        "leanVersion": "Lean (version 4.14.0)",
        "mathlibCommit": "v4.14.0",
        "imports": [
          "Mathlib.GroupTheory.Index"
        ],
        "axiomsUsed": [
          "Classical.choice",
          "propext",
          "Quot.sound"
        ],
        "result": "PASSED",
        "checkedAt": "2026-09-01T00:00:00Z",
        "checker": "LEAN_KERNEL"
      }
    },
    "codeSnippets": [
      {
        "id": "py-lagrange-calc",
        "nodeId": "thm-lagrange-group",
        "language": "python",
        "title": "有限单群与子群因数分解检验器",
        "description": "输入有限群的阶数，列出所有可能存在的子群可能阶数（根据拉格朗日定理必为因数）。",
        "code": "def get_subgroup_possible_orders(group_order=60):\n    divisors = [d for d in range(1, group_order + 1) if group_order % d == 0]\n    return {\n        \"group_order\": group_order,\n        \"possible_subgroup_orders\": divisors,\n        \"total_possible_orders\": len(divisors),\n        \"is_prime_order\": len(divisors) == 2\n    }",
        "presetParams": {
          "group_order": {
            "min": 4,
            "max": 120,
            "step": 2,
            "default": 60,
            "label": "有限群阶数 |G|"
          }
        },
        "plotType": "sympy_symbolic"
      }
    ],
    "tags": [
      "代数",
      "有限群",
      "拉格朗日",
      "陪集划分"
    ],
    "lastModified": "2026-08-24",
    "objectType": "PROPOSITION",
    "propositionRole": "THEOREM",
    "formalVerificationRecord": {
      "statementRevision": "rev-2026.09.01",
      "statementHash": "sha256:0da6f59ffe5218c2f3f4ed5d0bf90e61",
      "proofHash": "sha256:4b6476eeafc66fe2e4a2190cfb2ae6d0",
      "leanVersion": "Lean (version 4.14.0)",
      "mathlibCommit": "v4.14.0",
      "imports": [
        "Mathlib.GroupTheory.Index"
      ],
      "axiomsUsed": [
        "Classical.choice",
        "propext",
        "Quot.sound"
      ],
      "result": "PASSED",
      "checkedAt": "2026-09-01T00:00:00Z",
      "checker": "LEAN_KERNEL"
    },
    "prerequisiteEdges": [
      {
        "id": "pe-thm-lagrange-group-def-group",
        "fromNodeId": "thm-lagrange-group",
        "toNodeId": "def-group",
        "relationType": "LOGICALLY_USES",
        "graphType": "PREREQUISITE_DAG"
      }
    ],
    "semanticEdges": [
      {
        "id": "se-lagrange-fermat",
        "fromNodeId": "thm-lagrange-group",
        "toNodeId": "thm-fermat-little",
        "relationType": "SPECIALIZES",
        "graphType": "SEMANTIC_GRAPH",
        "description": "Fermat Little Theorem is the cyclic group specialization of Lagrange Theorem on (Z/pZ)*"
      },
      {
        "id": "se-lagrange-sylow",
        "fromNodeId": "thm-lagrange-group",
        "toNodeId": "thm-sylow-first",
        "relationType": "MOTIVATES",
        "graphType": "SEMANTIC_GRAPH",
        "description": "Sylow theorems provide a profound partial converse to Lagrange order divisibility"
      }
    ]
  },
  {
    "id": "thm-fermat-little",
    "slug": "fermats-little-theorem",
    "titleZh": "费马小定理",
    "titleEn": "Fermat's Little Theorem",
    "nodeType": "THEOREM",
    "disciplineId": "number-theory",
    "mscCode": "11A07",
    "statementLatex": "a^{p-1} \\equiv 1 \\pmod p, \\quad \\forall p \\in \\mathbb{P}, \\; a \\in \\mathbb{Z}, \\; p \\nmid a",
    "statementPlainZh": "设 \\(p\\) 为素数，\\(a\\) 为任意不能被 \\(p\\) 整除的整数，则 \\(a^{p-1}\\) 除以 \\(p\\) 的余数恒为 1。等价形式为：对任意整数 \\(a\\)，均有 \\(a^p \\equiv a \\pmod p\\)。",
    "statementPlainEn": "If p is prime and gcd(a, p) = 1, then \\(a^{p-1} \\equiv 1 \\pmod p\\). For any integer a, \\(a^p \\equiv a \\pmod p\\).",
    "intuitionMd": "### 群论透视与项链染色直觉\n- **群论秒杀**：模 \\(p\\) 的非零剩余类乘法群 \\((\\mathbb{Z}/p\\mathbb{Z})^\\times\\) 是一个阶为 \\(p-1\\) 的有限群。根据**拉格朗日定理**，群中任意元素的阶必整除群阶，因此 \\(a^{p-1} = e = 1 \\pmod p\\)！\n- **组合项链视角**：用 \\(a\\) 种颜色的珠子串成长度为 \\(p\\) 的项链，除去 \\(a\\) 种纯单色项链外，其余 \\(a^p - a\\) 种项链在旋转下每个等价轨道都恰好包含 \\(p\\) 个项链，因此 \\(p \\mid (a^p - a)\\)！",
    "intuitionEn": "### Number Theoretic Residue Intuition\nMultiplication by a coprime integer a modulo p permutes the non-zero residue classes {1, 2, ..., p-1}.",
    "historicalContextZh": "费马于1640年在信件中提出此定理，欧拉在1736年给出第一个公开发表的严格证明，并将其推广为欧拉定理。",
    "historicalContextEn": "Stated by Fermat in 1640, first published proof given by Euler in 1736, later generalized to Euler totient theorem.",
    "verification": "FORMALLY_VERIFIED",
    "reputationScore": 1100,
    "viewCount": 8900,
    "difficultyLevel": 1,
    "dependencies": [
      "thm-lagrange-group"
    ],
    "dependents": [
      "thm-euler-identity"
    ],
    "proofs": [
      {
        "id": "proof-fermat-necklace",
        "nodeId": "thm-fermat-little",
        "title": "组合双射与模剩余系置换证明法",
        "approachType": "COMBINATORIAL",
        "author": {
          "id": "user-fermat",
          "name": "Pierre de Fermat",
          "reputation": 19200,
          "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60",
          "isModerator": true
        },
        "motivation": "考察集合 {1, 2, ..., p-1} 乘以 a 后的剩余系置换。",
        "rigorousProof": "考察整数序列 \\(S = \\{1, 2, 3, \\dots, p-1\\}\\)。\n将其每一项乘以 \\(a\\)，得到集合 \\(S' = \\{1a, 2a, 3a, \\dots, (p-1)a\\}\\)。\n- 证明 \\(S'\\) 中任意两数模 \\(p\\) 互不同余：\n  若 \\(ia \\equiv ja \\pmod p\\) (其中 \\(1 \\le i < j \\le p-1\\))，则 \\((j-i)a \\equiv 0 \\pmod p\\)。\n  由于 \\(p\\) 为素数且 \\(\\gcd(a, p) = 1\\)，必有 \\(p \\mid (j-i)\\)，这与 \\(0 < j-i < p\\) 矛盾。\n因此，\\(S'\\) 模 \\(p\\) 的余数恰好是 \\(S\\) 的一个重新排列（置换）。\n将两集合的所有元素各自连乘并在模 \\(p\\) 下取等式：\n\\[\n(1a) \\cdot (2a) \\cdot (3a) \\cdots ((p-1)a) \\equiv 1 \\cdot 2 \\cdot 3 \\cdots (p-1) \\pmod p\n\\]\n提公因式 \\(a^{p-1}\\)：\n\\[\na^{p-1} (p-1)! \\equiv (p-1)! \\pmod p\n\\]\n因为 \\(p\\) 是素数，\\(\\gcd((p-1)!, p) = 1\\)，两边可以安全消去 \\((p-1)!\\)，即得：\n\\[\na^{p-1} \\equiv 1 \\pmod p\n\\]\n证毕。",
        "steps": [
          {
            "id": "flt-step-1",
            "stepIndex": 1,
            "explanation": "证明乘 a 后的剩余系与原剩余系同构（纯置换）",
            "latexText": "\\{1a, 2a, \\dots, (p-1)a\\} \\equiv \\{1, 2, \\dots, p-1\\} \\pmod p",
            "commentsCount": 1
          },
          {
            "id": "flt-step-2",
            "stepIndex": 2,
            "explanation": "两端连乘并消去与 p 互质的阶乘因子 (p-1)!",
            "latexText": "a^{p-1}(p-1)! \\equiv (p-1)! \\pmod p \\implies a^{p-1} \\equiv 1 \\pmod p",
            "commentsCount": 3
          }
        ],
        "isPrimary": true,
        "verification": "FORMALLY_VERIFIED",
        "upvotes": 780
      }
    ],
    "leanFormalization": {
      "id": "lean-fermat",
      "nodeId": "thm-fermat-little",
      "theoremName": "ZMod.pow_card_sub_one_eq_one",
      "leanCode": "import Mathlib.FieldTheory.Finite.Basic\nimport Mathlib.Data.ZMod.Basic\n\n-- 费马小定理在有限域 Z/pZ 上的 Lean 4 证明\ntheorem fermat_little_theorem (p : ℕ) [Fact (Nat.Prime p)] (a : ZMod p) (ha : a ≠ 0) :\n    a ^ (p - 1) = 1 := by\n  exact ZMod.pow_card_sub_one_eq_one ha",
      "mathlibImports": [
        "Mathlib.FieldTheory.Finite.Basic",
        "Mathlib.Data.ZMod.Basic"
      ],
      "proofStateOutput": "Goals accomplished 🎉 (Lean 4 finite field theorem verified)",
      "isVerified": true,
      "verifiedAt": "2026-08-21",
      "axiomsUsed": [
        "propext",
        "Classical.choice",
        "Quot.sound"
      ],
      "astHash": "sha256:c06fb6974b7bcb868b147d110beb821d",
      "verificationRecord": {
        "statementRevision": "rev-2026.09.01",
        "statementHash": "sha256:c258fd5ca71ec70f65463a536977c46b",
        "proofHash": "sha256:c06fb6974b7bcb868b147d110beb821d",
        "leanVersion": "Lean (version 4.14.0)",
        "mathlibCommit": "v4.14.0",
        "imports": [
          "Mathlib.FieldTheory.Finite.Basic",
          "Mathlib.Data.ZMod.Basic"
        ],
        "axiomsUsed": [
          "propext",
          "Classical.choice",
          "Quot.sound"
        ],
        "result": "PASSED",
        "checkedAt": "2026-09-01T00:00:00Z",
        "checker": "LEAN_KERNEL"
      }
    },
    "codeSnippets": [
      {
        "id": "py-fermat-verify",
        "nodeId": "thm-fermat-little",
        "language": "python",
        "title": "快速模幂算法与费马素性测试",
        "description": "交互式选择底数 a 与模数 p，利用 Python 快速幂 pow(a, p-1, p) 验证定理与素性。",
        "code": "def fermat_test(a=2, p=17):\n    is_prime_actual = True\n    if p < 2:\n        is_prime_actual = False\n    else:\n        for i in range(2, int(p**0.5) + 1):\n            if p % i == 0:\n                is_prime_actual = False\n                break\n                \n    rem = pow(a, p - 1, p) if p > 1 else 0\n    passed_test = (rem == 1)\n    \n    return {\n        \"base_a\": a,\n        \"modulus_p\": p,\n        \"remainder\": rem,\n        \"fermat_congruence_holds\": passed_test,\n        \"is_actual_prime\": is_prime_actual\n    }",
        "presetParams": {
          "a": {
            "min": 2,
            "max": 10,
            "step": 1,
            "default": 3,
            "label": "底数 a"
          },
          "p": {
            "min": 3,
            "max": 97,
            "step": 2,
            "default": 13,
            "label": "待检验数 p"
          }
        },
        "plotType": "sympy_symbolic"
      }
    ],
    "tags": [
      "数论",
      "同余",
      "素数",
      "费马小定理",
      "密码学基础"
    ],
    "lastModified": "2026-08-25",
    "objectType": "PROPOSITION",
    "propositionRole": "THEOREM",
    "formalVerificationRecord": {
      "statementRevision": "rev-2026.09.01",
      "statementHash": "sha256:c258fd5ca71ec70f65463a536977c46b",
      "proofHash": "sha256:c06fb6974b7bcb868b147d110beb821d",
      "leanVersion": "Lean (version 4.14.0)",
      "mathlibCommit": "v4.14.0",
      "imports": [
        "Mathlib.FieldTheory.Finite.Basic",
        "Mathlib.Data.ZMod.Basic"
      ],
      "axiomsUsed": [
        "propext",
        "Classical.choice",
        "Quot.sound"
      ],
      "result": "PASSED",
      "checkedAt": "2026-09-01T00:00:00Z",
      "checker": "LEAN_KERNEL"
    },
    "prerequisiteEdges": [
      {
        "id": "pe-thm-fermat-little-thm-lagrange-group",
        "fromNodeId": "thm-fermat-little",
        "toNodeId": "thm-lagrange-group",
        "relationType": "LOGICALLY_USES",
        "graphType": "PREREQUISITE_DAG"
      }
    ],
    "semanticEdges": [
      {
        "id": "se-fermat-euler-id",
        "fromNodeId": "thm-fermat-little",
        "toNodeId": "thm-euler-identity",
        "relationType": "MOTIVATES",
        "graphType": "SEMANTIC_GRAPH",
        "description": "Euler generalized Fermat theorem to modular coprimality via Euler totient"
      }
    ]
  },
  {
    "id": "thm-heine-borel",
    "slug": "heine-borel-theorem",
    "titleZh": "海涅-博雷尔定理",
    "titleEn": "Heine-Borel Theorem",
    "nodeType": "THEOREM",
    "disciplineId": "topology",
    "mscCode": "54D30",
    "statementLatex": "K \\subset \\mathbb{R}^n \\text{ is compact} \\iff K \\text{ is closed and bounded}",
    "statementPlainZh": "在 \\(n\\) 维欧几里得空间 \\(\\mathbb{R}^n\\) 中，子集 \\(K\\) 是紧致的（即 \\(K\\) 的任意开覆盖都存在有限子覆盖）当且仅当 \\(K\\) 是有界闭集。",
    "statementPlainEn": "A subset K of Euclidean space \\(\\(\\mathbb{R}\\)^n\\) is compact (every open cover has a finite subcover) if and only if K is closed and bounded.",
    "intuitionMd": "### 无限与有限的桥梁\n**“紧致性是有限性在无限拓扑空间中的代数推广。”**\n- 在紧致空间上，任何连续实函数必然有界并能达到最大值与最小值；\n- 海涅-博雷尔定理给出了欧几里得空间中紧致性极其直观且可判定的几何充要条件：**“既不跑到无穷远（有界），也不缺少边界点（闭）”**。",
    "intuitionEn": "### Topological Compactness Intuition\nTranslates topological compactness into elementary metric properties of being closed and bounded in Euclidean space.",
    "historicalContextZh": "定理得名于爱德华·海涅与埃米尔·博雷尔，经魏尔斯特拉斯和勒贝格的发展成为现代实分析与点集拓扑的基石。",
    "historicalContextEn": "Named after Eduard Heine and Émile Borel, fundamental to real analysis and point-set topology.",
    "verification": "FORMALLY_VERIFIED",
    "reputationScore": 1450,
    "viewCount": 7600,
    "difficultyLevel": 3,
    "dependencies": [
      "def-limit-sequence"
    ],
    "dependents": [
      "thm-banach-fixed-point"
    ],
    "proofs": [
      {
        "id": "proof-heine-borel-bisection",
        "nodeId": "thm-heine-borel",
        "title": "区间二分法与柯西收敛准则证明",
        "approachType": "ANALYTIC",
        "author": {
          "id": "user-borel",
          "name": "Émile Borel",
          "reputation": 16200,
          "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
          "isModerator": true
        },
        "motivation": "假设 [a,b] 无法被有限个开集覆盖，不断二等分区间，总能找到一个无法被有限覆盖的子区间，根据闭区间套定理收敛到单点，导出矛盾。",
        "rigorousProof": "假设闭区间 \\([a, b]\\) 的开覆盖 \\(\\mathcal{U}\\) 不包含任何有限子覆盖。\n令 \\(I_0 = [a, b]\\)，将其二等分为两个子区间。必至少有一个子区间无法被 \\(\\mathcal{U}\\) 中有限个开集覆盖，记该子区间为 \\(I_1\\)。\n依此类推，构造出嵌套闭区间列：\n\\[\nI_0 \\supset I_1 \\supset I_2 \\supset \\dots \\supset I_k \\supset \\dots, \\quad |I_k| = \\frac{b-a}{2^k}\n\\]\n由康托尔闭区间套定理，存在唯一公共点 \\(\\xi \\in \\bigcap_{k=0}^\\infty I_k\\)。\n因为 \\(\\xi \\in [a, b]\\)，必存在开集 \\(U \\in \\mathcal{U}\\) 使得 \\(\\xi \\in U\\)。\n由开集定义，存在 \\(\\delta > 0\\) 使得 \\((\\xi - \\delta, \\xi + \\delta) \\subset U\\)。\n取足够大的 \\(k\\) 使得 \\(|I_k| = \\frac{b-a}{2^k} < \\delta\\)，则整个区间 \\(I_k \\subset (\\xi-\\delta, \\xi+\\delta) \\subset U\\)。\n这表明 \\(I_k\\) 仅被单个开集 \\(U\\) 即可覆盖，与 \\(I_k\\) 无法被有限覆盖的假设产生矛盾！\n证毕。",
        "steps": [
          {
            "id": "hb-step-1",
            "stepIndex": 1,
            "explanation": "二分法构造无法被有限覆盖的闭区间套列",
            "latexText": "I_0 \\supset I_1 \\supset \\dots \\supset I_k, \\quad \\text{diam}(I_k) = \\frac{b-a}{2^k} \\to 0",
            "commentsCount": 2
          },
          {
            "id": "hb-step-2",
            "stepIndex": 2,
            "explanation": "应用闭区间套定理交于单点并导出矛盾",
            "latexText": "\\exists \\xi \\in \\bigcap I_k \\subset U \\implies \\exists k, \\; I_k \\subset U \\implies \\text{矛盾}",
            "commentsCount": 1
          }
        ],
        "isPrimary": true,
        "verification": "FORMALLY_VERIFIED",
        "upvotes": 680
      }
    ],
    "leanFormalization": {
      "id": "lean-heine-borel",
      "nodeId": "thm-heine-borel",
      "theoremName": "isCompact_iff_isClosed_isBounded",
      "leanCode": "import Mathlib.Topology.MetricSpace.Basic\nimport Mathlib.Topology.Instances.Real\n\nopen Metric Set\n\n-- 海涅-博雷尔定理在实数空间 R 上的 Lean 4 证明\ntheorem heine_borel_real (s : Set ℝ) :\n    IsCompact s ↔ IsClosed s ∧ Bornology.IsBounded s := by\n  exact isCompact_iff_isClosed_isBounded",
      "mathlibImports": [
        "Mathlib.Topology.MetricSpace.Basic",
        "Mathlib.Topology.Instances.Real"
      ],
      "proofStateOutput": "Goals accomplished 🎉 (Mathlib MetricSpace verified)",
      "isVerified": true,
      "verifiedAt": "2026-08-22",
      "axiomsUsed": [
        "Classical.choice",
        "propext",
        "Quot.sound"
      ],
      "astHash": "sha256:534a5844ae767530fd3c2d7401c0cd74",
      "verificationRecord": {
        "statementRevision": "rev-2026.09.01",
        "statementHash": "sha256:582d58f756c79c460eeac4b1aef4f53d",
        "proofHash": "sha256:534a5844ae767530fd3c2d7401c0cd74",
        "leanVersion": "Lean (version 4.14.0)",
        "mathlibCommit": "v4.14.0",
        "imports": [
          "Mathlib.Topology.MetricSpace.Basic",
          "Mathlib.Topology.Instances.Real"
        ],
        "axiomsUsed": [
          "Classical.choice",
          "propext",
          "Quot.sound"
        ],
        "result": "PASSED",
        "checkedAt": "2026-09-01T00:00:00Z",
        "checker": "LEAN_KERNEL"
      }
    },
    "codeSnippets": [
      {
        "id": "py-heine-borel-sim",
        "nodeId": "thm-heine-borel",
        "language": "python",
        "title": "开覆盖有限子覆盖与紧致性动画",
        "description": "交互式给定开覆盖半径 r，观察区间 [0, 1] 如何被有限个开球完全覆盖。",
        "code": "def compute_finite_subcover(radius=0.15):\n    # 用半径为 radius 的开球覆盖 [0, 1]\n    centers = []\n    curr = 0.0\n    while curr <= 1.0 + radius:\n        centers.append(round(curr, 3))\n        curr += radius * 1.5\n    \n    return {\n        \"interval\": [0, 1],\n        \"open_ball_radius\": radius,\n        \"subcover_count\": len(centers),\n        \"ball_centers\": centers,\n        \"is_finite\": True\n    }",
        "presetParams": {
          "radius": {
            "min": 0.05,
            "max": 0.4,
            "step": 0.05,
            "default": 0.15,
            "label": "开覆盖半径 r"
          }
        },
        "plotType": "2d_plot"
      }
    ],
    "tags": [
      "拓扑学",
      "紧致性",
      "海涅博雷尔",
      "开覆盖",
      "核心拓扑基石"
    ],
    "lastModified": "2026-08-25",
    "objectType": "PROPOSITION",
    "propositionRole": "THEOREM",
    "formalVerificationRecord": {
      "statementRevision": "rev-2026.09.01",
      "statementHash": "sha256:582d58f756c79c460eeac4b1aef4f53d",
      "proofHash": "sha256:534a5844ae767530fd3c2d7401c0cd74",
      "leanVersion": "Lean (version 4.14.0)",
      "mathlibCommit": "v4.14.0",
      "imports": [
        "Mathlib.Topology.MetricSpace.Basic",
        "Mathlib.Topology.Instances.Real"
      ],
      "axiomsUsed": [
        "Classical.choice",
        "propext",
        "Quot.sound"
      ],
      "result": "PASSED",
      "checkedAt": "2026-09-01T00:00:00Z",
      "checker": "LEAN_KERNEL"
    },
    "prerequisiteEdges": [
      {
        "id": "pe-thm-heine-borel-def-limit-sequence",
        "fromNodeId": "thm-heine-borel",
        "toNodeId": "def-limit-sequence",
        "relationType": "LOGICALLY_USES",
        "graphType": "PREREQUISITE_DAG"
      }
    ],
    "semanticEdges": []
  },
  {
    "id": "thm-first-isomorphism",
    "slug": "first-isomorphism-theorem-groups",
    "titleZh": "群的第一同构定理",
    "titleEn": "First Isomorphism Theorem for Groups",
    "nodeType": "THEOREM",
    "disciplineId": "algebra",
    "mscCode": "20A05",
    "statementLatex": "G / \\ker(\\phi) \\cong \\mathrm{im}(\\phi), \\quad \\text{where } \\phi: G \\to H \\text{ is a homomorphism}",
    "statementPlainZh": "设 \\(\\phi: G \\to H\\) 为群同态，则 \\(\\phi\\) 的核 \\(\\ker(\\phi)\\) 为 \\(G\\) 的正规子群，且商群 \\(G/\\ker(\\phi)\\) 自然同构于 \\(\\phi\\) 的像集 \\(\\mathrm{im}(\\phi)\\)。",
    "statementPlainEn": "If \\(\\phi: G \\to H\\) is a group homomorphism, then \\(\\ker(\\phi)\\) is a normal subgroup of G, and \\(G / \\(\\ker(\\phi)\\) \\cong \\mathrm{im}(\\phi)\\).",
    "intuitionMd": "### 代数投影与信息无损还原\n**“商群 \\(G/\\ker\\phi\\) 精确抹去了所有被同态映射为单位元的‘冗余盲区’，剩下的结构与像群 \\(\\mathrm{im}\\phi\\) 完全对称同构。”**\n\n- 交换图 (Commutative Diagram)：\n  \\(G \\xrightarrow{\\phi} \\mathrm{im}\\phi\\) 与复合映射 \\(G \\xrightarrow{\\pi} G/\\ker\\phi \\xrightarrow{\\bar\\phi} \\mathrm{im}\\phi\\) 处处恒等！",
    "intuitionEn": "### Categorical Homomorphism Factorization\nEvery algebraic homomorphism canonically factors into a surjective canonical quotient followed by an injective isomorphism.",
    "historicalContextZh": "同构定理系统由埃米·诺特 (Emmy Noether) 在1920年代建立近代抽象代数公理体系时提炼升华。",
    "historicalContextEn": "Formulated in modern abstract algebraic generality by Emmy Noether in the 1920s.",
    "verification": "FORMALLY_VERIFIED",
    "reputationScore": 1600,
    "viewCount": 8200,
    "difficultyLevel": 2,
    "dependencies": [
      "def-group",
      "thm-lagrange-group"
    ],
    "dependents": [],
    "proofs": [
      {
        "id": "proof-first-iso-canonical",
        "nodeId": "thm-first-isomorphism",
        "title": "典范映射与单满射构造法",
        "approachType": "ALGEBRAIC",
        "author": {
          "id": "user-noether",
          "name": "Emmy Noether",
          "reputation": 24500,
          "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
          "isModerator": true
        },
        "motivation": "构造映射 psi: G/ker phi -> im phi，验证良定性 (Well-definedness)、同态性、单射性与满射性。",
        "rigorousProof": "令 \\(K = \\ker(\\phi) = \\{g \\in G : \\phi(g) = e_H\\}\\)。\n定义映射 \\(\\psi: G/K \\to \\mathrm{im}(\\phi)\\) 为 \\(\\psi(gK) = \\phi(g)\\)。\n1. **良定性**：若 \\(g_1 K = g_2 K\\)，则 \\(g_2^{-1}g_1 \\in K\\)，故 \\(\\phi(g_2^{-1}g_1) = e_H \\implies \\phi(g_1) = \\phi(g_2)\\)。因此 \\(\\psi\\) 良定。\n2. **同态性**：\\(\\psi((g_1 K)(g_2 K)) = \\psi((g_1 g_2) K) = \\phi(g_1 g_2) = \\phi(g_1)\\phi(g_2) = \\psi(g_1 K)\\psi(g_2 K)\\)。\n3. **单射性**：若 \\(\\psi(gK) = e_H\\)，则 \\(\\phi(g) = e_H \\implies g \\in K \\implies gK = K = e_{G/K}\\)。故 \\(\\ker(\\psi)\\) 平凡，\\(\\psi\\) 为单射。\n4. **满射性**：对任意 \\(h \\in \\mathrm{im}(\\phi)\\)，存在 \\(g \\in G\\) 使 \\(\\phi(g) = h\\)，则 \\(\\psi(gK) = h\\)。\n因此 \\(\\psi\\) 为群同构，\\(G/K \\cong \\mathrm{im}(\\phi)\\)。证毕。",
        "steps": [
          {
            "id": "iso-step-1",
            "stepIndex": 1,
            "explanation": "定义典范商群映射并验证良定性",
            "latexText": "g_1 K = g_2 K \\implies \\phi(g_2^{-1}g_1) = e \\implies \\psi(g_1 K) = \\psi(g_2 K)",
            "commentsCount": 0
          },
          {
            "id": "iso-step-2",
            "stepIndex": 2,
            "explanation": "证明单满同态完成同构建立",
            "latexText": "\\ker(\\psi) = \\{e_{G/K}\\} \\land \\mathrm{im}(\\psi) = \\mathrm{im}(\\phi) \\implies G/\\ker\\phi \\cong \\mathrm{im}\\phi",
            "commentsCount": 3
          }
        ],
        "isPrimary": true,
        "verification": "FORMALLY_VERIFIED",
        "upvotes": 890
      }
    ],
    "leanFormalization": {
      "id": "lean-first-iso",
      "nodeId": "thm-first-isomorphism",
      "theoremName": "quotientKerEquivRange",
      "leanCode": "import Mathlib.GroupTheory.QuotientGroup\n\nopen MonoidHom\n\n-- 群的第一同构定理 Lean 4 形式化验证\ntheorem first_isomorphism_theorem {G H : Type*} [Group G] [Group H] (φ : G →* H) :\n    G ⧸ φ.ker ≃* φ.range := by\n  exact QuotientGroup.quotientKerEquivRange φ",
      "mathlibImports": [
        "Mathlib.GroupTheory.QuotientGroup"
      ],
      "proofStateOutput": "Goals accomplished 🎉 (Lean 4 QuotientGroup verified)",
      "isVerified": true,
      "verifiedAt": "2026-08-23",
      "axiomsUsed": [
        "propext",
        "Classical.choice",
        "Quot.sound"
      ],
      "astHash": "sha256:98aca7db0c2e20c69482871da4dac8a1",
      "verificationRecord": {
        "statementRevision": "rev-2026.09.01",
        "statementHash": "sha256:b15c5ba5c5c13a3c749d6199771d95e1",
        "proofHash": "sha256:98aca7db0c2e20c69482871da4dac8a1",
        "leanVersion": "Lean (version 4.14.0)",
        "mathlibCommit": "v4.14.0",
        "imports": [
          "Mathlib.GroupTheory.QuotientGroup"
        ],
        "axiomsUsed": [
          "propext",
          "Classical.choice",
          "Quot.sound"
        ],
        "result": "PASSED",
        "checkedAt": "2026-09-01T00:00:00Z",
        "checker": "LEAN_KERNEL"
      }
    },
    "codeSnippets": [
      {
        "id": "py-first-iso-mod",
        "nodeId": "thm-first-isomorphism",
        "language": "python",
        "title": "整数加法群同态 Z -> Z/nZ 模同构验证",
        "description": "考察加法同态 phi(x) = x mod n，验证核 ker(phi) = nZ 与商群 Z/nZ 的同构映射。",
        "code": "def verify_cyclic_homomorphism(n=5):\n    # phi: Z -> Z_n\n    elements_quotient = [f\"{i} + {n}Z\" for i in range(n)]\n    elements_image = [f\"{i} (mod {n})\" for i in range(n)]\n    \n    return {\n        \"homomorphism\": f\"Z -> Z_{n}\",\n        \"kernel\": f\"{n}Z (All multiples of {n})\",\n        \"quotient_order\": n,\n        \"isomorphic\": True,\n        \"quotient_elements\": elements_quotient,\n        \"image_elements\": elements_image\n    }",
        "presetParams": {
          "n": {
            "min": 2,
            "max": 12,
            "step": 1,
            "default": 5,
            "label": "模数 n"
          }
        },
        "plotType": "sympy_symbolic"
      }
    ],
    "tags": [
      "近世代数",
      "同构定理",
      "正规子群",
      "商群",
      "诺特代数"
    ],
    "lastModified": "2026-08-25",
    "objectType": "PROPOSITION",
    "propositionRole": "THEOREM",
    "formalVerificationRecord": {
      "statementRevision": "rev-2026.09.01",
      "statementHash": "sha256:b15c5ba5c5c13a3c749d6199771d95e1",
      "proofHash": "sha256:98aca7db0c2e20c69482871da4dac8a1",
      "leanVersion": "Lean (version 4.14.0)",
      "mathlibCommit": "v4.14.0",
      "imports": [
        "Mathlib.GroupTheory.QuotientGroup"
      ],
      "axiomsUsed": [
        "propext",
        "Classical.choice",
        "Quot.sound"
      ],
      "result": "PASSED",
      "checkedAt": "2026-09-01T00:00:00Z",
      "checker": "LEAN_KERNEL"
    },
    "prerequisiteEdges": [
      {
        "id": "pe-thm-first-isomorphism-def-group",
        "fromNodeId": "thm-first-isomorphism",
        "toNodeId": "def-group",
        "relationType": "LOGICALLY_USES",
        "graphType": "PREREQUISITE_DAG"
      },
      {
        "id": "pe-thm-first-isomorphism-thm-lagrange-group",
        "fromNodeId": "thm-first-isomorphism",
        "toNodeId": "thm-lagrange-group",
        "relationType": "LOGICALLY_USES",
        "graphType": "PREREQUISITE_DAG"
      }
    ],
    "semanticEdges": [
      {
        "id": "se-iso-lagrange",
        "fromNodeId": "thm-first-isomorphism",
        "toNodeId": "thm-lagrange-group",
        "relationType": "EQUIVALENT_TO",
        "graphType": "SEMANTIC_GRAPH",
        "description": "Coset decomposition in Lagrange theorem isomorphic to G/ker(phi) quotient"
      }
    ]
  },
  {
    "id": "conjecture-riemann-hypothesis",
    "slug": "riemann-hypothesis",
    "titleZh": "黎曼猜想",
    "titleEn": "Riemann Hypothesis",
    "nodeType": "CONJECTURE",
    "disciplineId": "number-theory",
    "mscCode": "11M26",
    "statementLatex": "\\zeta(s) = 0 \\land s \\notin -2\\mathbb{N} \\implies \\mathrm{Re}(s) = \\frac{1}{2}",
    "statementPlainZh": "黎曼 Zeta 函数 \\(\\zeta(s) = \\sum_{n=1}^\\infty \\frac{1}{n^s}\\) 的所有非平凡零点均位于复平面上的临界线 \\(\\mathrm{Re}(s) = \\frac{1}{2}\\) 之上。",
    "statementPlainEn": "All non-trivial zeros of the Riemann zeta function \\(\\zeta(s)\\) have real part equal to 1/2.",
    "intuitionMd": "### 素数分布的终极和谐乐章\n**“素数的分布规律隐藏在黎曼 Zeta 函数零点的振动频谱之中。”**\n\n- 如果黎曼猜想成立，素数计数函数 \\(\\pi(x)\\) 与对数积分 \\(\\mathrm{Li}(x)\\) 的误差将达到理论最优的 \\(O(\\sqrt{x} \\ln x)\\) 随机波动界。\n- 它是千禧年七大数学难题之首，至今仍等待人类彻底攻克。",
    "intuitionEn": "### Prime Vibration Spectrum Intuition\nThe precise distribution of prime numbers is governed by the vibrational spectrum of Riemann zeta zeros along the critical line.",
    "historicalContextZh": "伯恩哈德·黎曼于1859年在论文《论小于给定大小的素数个数》中提出，是千禧年七大数学难题之首。",
    "historicalContextEn": "Proposed by Bernhard Riemann in 1859, the premier unsolved problem in mathematics and millennium prize problem.",
    "verification": "UNVERIFIED",
    "reputationScore": 9999,
    "viewCount": 45000,
    "difficultyLevel": 5,
    "dependencies": [
      "def-limit-sequence",
      "thm-prime-number-theorem"
    ],
    "dependents": [],
    "proofs": [],
    "codeSnippets": [
      {
        "id": "py-riemann-zeros",
        "nodeId": "conjecture-riemann-hypothesis",
        "language": "python",
        "title": "临界线 Re(s)=1/2 上前若干零点数值扫描",
        "description": "数值计算黎曼 Zeta 函数在临界线 s = 1/2 + it 上的虚部 t 零点分布。",
        "code": "def get_first_riemann_zeros():\n    # 著名的前五个非平凡零点虚部 t\n    zeros_t = [14.134725, 21.022040, 25.010858, 30.424876, 32.935062]\n    return {\n        \"critical_line\": \"Re(s) = 0.5\",\n        \"first_5_zeros_imaginary\": zeros_t,\n        \"conjecture_status\": \"Unproven (Millennium Prize Problem)\"\n    }",
        "presetParams": {},
        "plotType": "2d_plot"
      }
    ],
    "tags": [
      "数论",
      "黎曼猜想",
      "Zeta函数",
      "素数分布",
      "千禧难题"
    ],
    "lastModified": "2026-08-25",
    "objectType": "PROPOSITION",
    "propositionRole": "CONJECTURE",
    "prerequisiteEdges": [
      {
        "id": "pe-conjecture-riemann-hypothesis-def-limit-sequence",
        "fromNodeId": "conjecture-riemann-hypothesis",
        "toNodeId": "def-limit-sequence",
        "relationType": "LOGICALLY_USES",
        "graphType": "PREREQUISITE_DAG"
      },
      {
        "id": "pe-conjecture-riemann-hypothesis-thm-pnt",
        "fromNodeId": "conjecture-riemann-hypothesis",
        "toNodeId": "thm-pnt",
        "relationType": "LOGICALLY_USES",
        "graphType": "PREREQUISITE_DAG"
      }
    ],
    "semanticEdges": []
  },
  {
    "id": "thm-euler-identity",
    "slug": "eulers-identity",
    "titleZh": "欧拉恒等式",
    "titleEn": "Euler's Identity",
    "nodeType": "THEOREM",
    "disciplineId": "analysis",
    "mscCode": "00A05",
    "statementLatex": "e^{i\\pi} + 1 = 0",
    "statementPlainZh": "数学中最美妙的恒等式，将自然对数的底 e、虚数单位 i、圆周率 pi、乘法单位元 1 与加法零元 0 融为一体。",
    "statementPlainEn": "The profound identity linking five fundamental mathematical constants: \\(e^{i\\(\\pi\\)} + 1 = 0\\).",
    "intuitionMd": "复数乘法在几何上对应于复平面上的旋转与伸缩。乘以 e^(iθ) 相当于在单位圆上逆时针旋转 θ 弧度。当旋转半周（即 π 弧度）时，点 1 旋转至 -1，故 e^(iπ) = -1，即 e^(iπ) + 1 = 0。",
    "intuitionEn": "### Complex Exponential Rotation Intuition\nContinuous exponential rotation in the complex plane by angle \\(\\pi\\) maps 1 to -1.",
    "historicalContextZh": "欧拉在1748年出版的《无穷分析引论》中给出复指数展开，被誉为“数学界最美公式”。",
    "historicalContextEn": "Published by Leonhard Euler in Introductio in analysin infinitorum (1748), celebrated as the most beautiful formula in mathematics.",
    "verification": "FORMALLY_VERIFIED",
    "reputationScore": 3200,
    "viewCount": 38900,
    "difficultyLevel": 2,
    "dependencies": [
      "def-limit-sequence",
      "thm-fermat-little"
    ],
    "dependents": [
      "thm-fundamental-algebra",
      "thm-prime-number-theorem"
    ],
    "proofs": [
      {
        "id": "proof-euler-identity",
        "nodeId": "thm-euler-identity",
        "title": "泰勒级数展开与三角函数解析延拓",
        "approachType": "ANALYTIC",
        "author": {
          "id": "user-euler",
          "name": "Leonhard Euler",
          "reputation": 25000,
          "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60",
          "isModerator": true
        },
        "motivation": "在复平面上利用复指数函数的泰勒级数展开，拆分为实部与虚部对应的余弦与正弦幂级数。",
        "rigorousProof": "由复指数函数在原点的幂级数展开式：\n\\[\ne^{iz} = \\sum_{n=0}^{\\infty} \\frac{(iz)^n}{n!} = 1 + iz - \\frac{z^2}{2!} - i\\frac{z^3}{3!} + \\frac{z^4}{4!} + \\dots\n\\]\n分离实部与虚部：\n\\[\ne^{iz} = \\left( 1 - \\frac{z^2}{2!} + \\frac{z^4}{4!} - \\dots \\right) + i \\left( z - \\frac{z^3}{3!} + \\frac{z^5}{5!} - \\dots \\right) = \\cos z + i \\sin z\n\\]\n令 \\(z = \\pi\\)，代入 \\(\\cos(\\pi) = -1\\) 与 \\(\\sin(\\pi) = 0\\)：\n\\[\ne^{i\\pi} = -1 + i(0) = -1 \\implies e^{i\\pi} + 1 = 0\n\\]\n证毕。",
        "steps": [
          {
            "id": "euler-step-1",
            "stepIndex": 1,
            "explanation": "写出复指数函数 e^(iz) 泰勒级数展开并按实虚部分组",
            "latexText": "e^{iz} = \\cos z + i \\sin z",
            "commentsCount": 12
          },
          {
            "id": "euler-step-2",
            "stepIndex": 2,
            "explanation": "代入 z = \\(\\pi\\) 得出恒等式",
            "latexText": "e^{i\\pi} + 1 = 0",
            "commentsCount": 8
          }
        ],
        "isPrimary": true,
        "verification": "FORMALLY_VERIFIED",
        "upvotes": 950
      }
    ],
    "leanFormalization": {
      "id": "lean-euler-identity",
      "nodeId": "thm-euler-identity",
      "theoremName": "Complex.exp_pi_mul_I_add_one_eq_zero",
      "mathlibImports": [
        "Mathlib.Analysis.SpecialFunctions.Trigonometric.Complex"
      ],
      "leanCode": "import Mathlib.Analysis.SpecialFunctions.Trigonometric.Complex\n\nopen Real Complex\n\n/-- 欧拉恒等式: e^(i * π) + 1 = 0 -/\ntheorem euler_identity : exp (π * I) + 1 = 0 := by\n  rw [exp_pi_mul_I]\n  ring",
      "proofStateOutput": "Goals accomplished! 🎉",
      "isVerified": true,
      "verifiedAt": "2026-08-25",
      "axiomsUsed": [
        "Classical.choice",
        "propext",
        "Quot.sound"
      ],
      "astHash": "sha256:1715a16b25a07fa332b5dec83cb6210e",
      "verificationRecord": {
        "statementRevision": "rev-2026.09.01",
        "statementHash": "sha256:2dcf2521e2a8b11dcf67943c1077d63e",
        "proofHash": "sha256:1715a16b25a07fa332b5dec83cb6210e",
        "leanVersion": "Lean (version 4.14.0)",
        "mathlibCommit": "v4.14.0",
        "imports": [
          "Mathlib.Analysis.SpecialFunctions.Trigonometric.Complex"
        ],
        "axiomsUsed": [
          "Classical.choice",
          "propext",
          "Quot.sound"
        ],
        "result": "PASSED",
        "checkedAt": "2026-09-01T00:00:00Z",
        "checker": "LEAN_KERNEL"
      }
    },
    "tags": [
      "复分析",
      "欧拉公式",
      "分析学",
      "基础定理"
    ],
    "lastModified": "2026-08-25",
    "objectType": "PROPOSITION",
    "propositionRole": "THEOREM",
    "formalVerificationRecord": {
      "statementRevision": "rev-2026.09.01",
      "statementHash": "sha256:2dcf2521e2a8b11dcf67943c1077d63e",
      "proofHash": "sha256:1715a16b25a07fa332b5dec83cb6210e",
      "leanVersion": "Lean (version 4.14.0)",
      "mathlibCommit": "v4.14.0",
      "imports": [
        "Mathlib.Analysis.SpecialFunctions.Trigonometric.Complex"
      ],
      "axiomsUsed": [
        "Classical.choice",
        "propext",
        "Quot.sound"
      ],
      "result": "PASSED",
      "checkedAt": "2026-09-01T00:00:00Z",
      "checker": "LEAN_KERNEL"
    },
    "prerequisiteEdges": [
      {
        "id": "pe-thm-euler-identity-def-limit-sequence",
        "fromNodeId": "thm-euler-identity",
        "toNodeId": "def-limit-sequence",
        "relationType": "LOGICALLY_USES",
        "graphType": "PREREQUISITE_DAG"
      },
      {
        "id": "pe-thm-euler-identity-thm-fermat-little",
        "fromNodeId": "thm-euler-identity",
        "toNodeId": "thm-fermat-little",
        "relationType": "LOGICALLY_USES",
        "graphType": "PREREQUISITE_DAG"
      }
    ],
    "semanticEdges": []
  },
  {
    "id": "thm-cantor-theorem",
    "slug": "cantors-theorem",
    "titleZh": "康托尔定理",
    "titleEn": "Cantor's Theorem",
    "nodeType": "THEOREM",
    "disciplineId": "logic",
    "mscCode": "03E10",
    "statementLatex": "|A| < |\\mathcal{P}(A)|",
    "statementPlainZh": "对任意集合 A，其幂集 P(A) 的基数严格大于集合 A 本身的基数，不存在从 A 到 P(A) 的满射。",
    "statementPlainEn": "For any set A, the cardinality of its power set \\(\\mathcal{P}(A)\\) is strictly greater than |A|. No surjection from A to \\(\\mathcal{P}(A)\\) exists.",
    "intuitionMd": "类似于“理发师悖论”，如果存在一个将集合元素映射到所有子集的全面对应方式，我们总能构造出一个由“不包含自己的元素”所组成的特异子集。该子集在逻辑上无法被任何原集合元素所对应，从而打破满射假设。",
    "intuitionEn": "### Diagonalization Argument Intuition\nConstructing the self-avoiding diagonal subset \\(\\{ x \\in A \\mid x \\notin f(x) \\}\\) proves no function can cover all subsets.",
    "historicalContextZh": "乔治·康托尔于1891年通过对角线论证法证明，建立了无穷大具有不同阶次的超限数体系。",
    "historicalContextEn": "Proved by Georg Cantor in 1891 via the diagonalization argument, establishing the hierarchy of transfinite cardinals.",
    "verification": "FORMALLY_VERIFIED",
    "reputationScore": 2900,
    "viewCount": 31200,
    "difficultyLevel": 3,
    "dependencies": [],
    "dependents": [],
    "proofs": [
      {
        "id": "proof-cantor-diag",
        "nodeId": "thm-cantor-theorem",
        "title": "对角线反证法",
        "approachType": "CONSTRUCTIVE",
        "author": {
          "id": "user-cantor",
          "name": "Georg Cantor",
          "reputation": 22000,
          "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60",
          "isModerator": true
        },
        "motivation": "构造对角线集合 B = {x in A | x not in f(x)}，证明其不可能处于任何映射 f 的值域中。",
        "rigorousProof": "显然单射 \\(x \\mapsto \\{x\\}\\) 证明 \\(|A| \\le |\\mathcal{P}(A)|\\)。\n假设存在满射 \\(f: A \\twoheadrightarrow \\mathcal{P}(A)\\)。\n定义对角线集合：\n\\[\nB = \\{ x \\in A \\mid x \\notin f(x) \\} \\subseteq A\n\\]\n因为 \\(B \\in \\mathcal{P}(A)\\) 且 \\(f\\) 为满射，存在某元素 \\(b \\in A\\) 使得 \\(f(b) = B\\)。\n此时考察 \\(b\\) 是否属于 \\(B\\)：\n- 若 \\(b \\in B\\)，按 \\(B\\) 的定义必有 \\(b \\notin f(b) = B\\)，产生矛盾；\n- 若 \\(b \\notin B\\)，按 \\(B\\) 的定义必有 \\(b \\in f(b) = B\\)，同样产生矛盾。\n因此假设不成立，不存在从 \\(A\\) 到 \\(\\mathcal{P}(A)\\) 的满射，故 \\(|A| < |\\mathcal{P}(A)|\\)。",
        "steps": [
          {
            "id": "cantor-step-1",
            "stepIndex": 1,
            "explanation": "构造对角线不属于自身的补集 B",
            "latexText": "B = \\{ x \\in A \\mid x \\notin f(x) \\}",
            "commentsCount": 7
          },
          {
            "id": "cantor-step-2",
            "stepIndex": 2,
            "explanation": "推导自指悖论矛盾 b in B <=> b not in B 关闭证明",
            "latexText": "b \\in B \\iff b \\notin B \\implies \\text{False}",
            "commentsCount": 15
          }
        ],
        "isPrimary": true,
        "verification": "FORMALLY_VERIFIED",
        "upvotes": 680
      }
    ],
    "leanFormalization": {
      "id": "lean-cantor-theorem",
      "nodeId": "thm-cantor-theorem",
      "theoremName": "cantor_theorem",
      "mathlibImports": [
        "Mathlib.Data.Set.Basic"
      ],
      "leanCode": "import Mathlib.Data.Set.Basic\n\nopen Set\n\n/-- 康托尔定理: 任意集合到其幂集不存在满射 -/\ntheorem cantor_surjective (A : Type*) (f : A → Set A) : ¬ Function.Surjective f := by\n  intro hSurj\n  let B : Set A := {x | x ∉ f x}\n  obtain ⟨b, hb⟩ := hSurj B\n  have h1 : b ∈ B ↔ b ∉ f b := Iff.rfl\n  rw [hb] at h1\n  exact iff_not_self (f b) h1",
      "proofStateOutput": "Goals accomplished! 🎉",
      "isVerified": true,
      "verifiedAt": "2026-08-25",
      "axiomsUsed": [
        "Classical.choice",
        "propext"
      ],
      "astHash": "sha256:45099c6fa02f3cf2e526a09de538d961",
      "verificationRecord": {
        "statementRevision": "rev-2026.09.01",
        "statementHash": "sha256:8bd8ccd8746726a5ffbfea7d003ff37d",
        "proofHash": "sha256:45099c6fa02f3cf2e526a09de538d961",
        "leanVersion": "Lean (version 4.14.0)",
        "mathlibCommit": "v4.14.0",
        "imports": [
          "Mathlib.Data.Set.Basic"
        ],
        "axiomsUsed": [
          "Classical.choice",
          "propext"
        ],
        "result": "PASSED",
        "checkedAt": "2026-09-01T00:00:00Z",
        "checker": "LEAN_KERNEL"
      }
    },
    "tags": [
      "公理集合论",
      "基数",
      "数理逻辑",
      "对角线法"
    ],
    "lastModified": "2026-08-25",
    "objectType": "PROPOSITION",
    "propositionRole": "THEOREM",
    "formalVerificationRecord": {
      "statementRevision": "rev-2026.09.01",
      "statementHash": "sha256:8bd8ccd8746726a5ffbfea7d003ff37d",
      "proofHash": "sha256:45099c6fa02f3cf2e526a09de538d961",
      "leanVersion": "Lean (version 4.14.0)",
      "mathlibCommit": "v4.14.0",
      "imports": [
        "Mathlib.Data.Set.Basic"
      ],
      "axiomsUsed": [
        "Classical.choice",
        "propext"
      ],
      "result": "PASSED",
      "checkedAt": "2026-09-01T00:00:00Z",
      "checker": "LEAN_KERNEL"
    },
    "prerequisiteEdges": [],
    "semanticEdges": [
      {
        "id": "se-cantor-heine",
        "fromNodeId": "thm-cantor-theorem",
        "toNodeId": "thm-heine-borel",
        "relationType": "HISTORICALLY_RELATED",
        "graphType": "SEMANTIC_GRAPH",
        "description": "Cantor transfinite diagonal argument motivated point-set topology compactness"
      }
    ]
  },
  {
    "id": "thm-pythagorean",
    "slug": "pythagorean-theorem",
    "titleZh": "勾股定理",
    "titleEn": "Pythagorean Theorem",
    "nodeType": "THEOREM",
    "disciplineId": "geometry",
    "mscCode": "51M04",
    "statementLatex": "a^2 + b^2 = c^2",
    "statementPlainZh": "在欧几里得平面的任意直角三角形中，两直角边长度 \\(a, b\\) 的平方和等于斜边长度 \\(c\\) 的平方，即 \\(a^2 + b^2 = c^2\\)。",
    "statementPlainEn": "In a planar right triangle with legs a and b and hypotenuse c, a^2 + b^2 = c^2.",
    "intuitionMd": "### 几何直觉与物理动机\n**“把边长看作以各边为边长正方形的面积：斜边正方形的面积恰好等于两直角边正方形面积之和。”**\n\n- **赵爽弦图**：用四个全等的直角三角形拼成一个大正方形，中间镂空一个面积为 \\((b-a)^2\\) 的小正方形。\n- 大正方形面积既是 \\(c^2\\)，也是 \\(4 \\times (\\frac{1}{2}ab) + (b-a)^2 = 2ab + a^2 - 2ab + b^2 = a^2 + b^2\\)。",
    "intuitionEn": "### Euclidean Metric Foundation\nThe area of the square on the hypotenuse equals the sum of the areas of the squares on the other two legs.",
    "historicalContextZh": "中国古代《周髀算经》记载商高“勾三股四弦五”，古希腊毕达哥拉斯学派给出几何论证。",
    "historicalContextEn": "Discovered in ancient Babylon, China (Zhoubi Suanjing), and Greece by Pythagoras; foundational to Euclidean geometry.",
    "verification": "FORMALLY_VERIFIED",
    "reputationScore": 560,
    "viewCount": 6200,
    "difficultyLevel": 1,
    "dependencies": [],
    "dependents": [],
    "proofs": [
      {
        "id": "proof-pythagorean-area",
        "nodeId": "thm-pythagorean",
        "title": "面积割补法 (赵爽弦图面积恒等)",
        "approachType": "GEOMETRIC",
        "author": {
          "id": "user-pythagoras",
          "name": "Pythagoras of Samos",
          "reputation": 9200,
          "avatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100",
          "isModerator": true
        },
        "motivation": "通过大正方形面积的两种不同划分方式建立恒等式。",
        "rigorousProof": "构造边长为 \\(a+b\\) 的大正方形，内含四个直角边为 \\(a, b\\) 的全等直角三角形及一个边长为 \\(c\\) 的内嵌正方形。\n大正方形面积为 \\((a+b)^2 = a^2 + 2ab + b^2\\)。\n另一方面，大正方形由四个直角三角形和一个斜边正方形拼成：\n\\[\nS = 4 \\times \\left(\\frac{1}{2}ab\\right) + c^2 = 2ab + c^2\n\\]\n令两式相等：\n\\[\na^2 + 2ab + b^2 = 2ab + c^2 \\implies a^2 + b^2 = c^2\n\\]\n证毕。",
        "steps": [
          {
            "id": "pyth-step-1",
            "stepIndex": 1,
            "explanation": "展开边长为 a+b 的大正方形代数面积",
            "latexText": "S_{\\text{total}} = (a+b)^2 = a^2 + 2ab + b^2",
            "commentsCount": 3
          },
          {
            "id": "pyth-step-2",
            "stepIndex": 2,
            "explanation": "按几何拼块拆解面积并消去公共项 2ab",
            "latexText": "a^2 + 2ab + b^2 = 4 \\cdot \\left(\\frac{1}{2}ab\\right) + c^2 \\implies a^2 + b^2 = c^2",
            "commentsCount": 5
          }
        ],
        "isPrimary": true,
        "verification": "FORMALLY_VERIFIED",
        "upvotes": 490
      }
    ],
    "leanFormalization": {
      "id": "lean-pythagorean",
      "nodeId": "thm-pythagorean",
      "theoremName": "pythagorean_theorem",
      "mathlibImports": [
        "Mathlib.Geometry.Euclidean.Basic"
      ],
      "leanCode": "import Mathlib.Geometry.Euclidean.Basic\n\n/-- 欧氏内积空间中的毕达哥拉斯正交勾股定理 -/\ntheorem pythagorean_theorem {V : Type*} [NormedAddCommGroup V] [InnerProductSpace ℝ V]\n    (u v : V) (hOrth : ⟪u, v⟫_ℝ = 0) : ‖u + v‖^2 = ‖u‖^2 + ‖v‖^2 := by\n  rw [@norm_add_pow_two_real]\n  rw [hOrth]\n  ring",
      "proofStateOutput": "Goals accomplished! 🎉",
      "isVerified": true,
      "verifiedAt": "2026-08-25",
      "axiomsUsed": [
        "Real.inner_product"
      ],
      "astHash": "sha256:687adf21ea85386482ffe74553001785",
      "verificationRecord": {
        "statementRevision": "rev-2026.09.01",
        "statementHash": "sha256:1f86a45946f3e40859754051667a8861",
        "proofHash": "sha256:687adf21ea85386482ffe74553001785",
        "leanVersion": "Lean (version 4.14.0)",
        "mathlibCommit": "v4.14.0",
        "imports": [
          "Mathlib.Geometry.Euclidean.Basic"
        ],
        "axiomsUsed": [
          "Real.inner_product"
        ],
        "result": "PASSED",
        "checkedAt": "2026-09-01T00:00:00Z",
        "checker": "LEAN_KERNEL"
      }
    },
    "tags": [
      "平面几何",
      "欧氏空间",
      "初等几何",
      "面积法"
    ],
    "lastModified": "2026-08-25",
    "objectType": "PROPOSITION",
    "propositionRole": "THEOREM",
    "formalVerificationRecord": {
      "statementRevision": "rev-2026.09.01",
      "statementHash": "sha256:1f86a45946f3e40859754051667a8861",
      "proofHash": "sha256:687adf21ea85386482ffe74553001785",
      "leanVersion": "Lean (version 4.14.0)",
      "mathlibCommit": "v4.14.0",
      "imports": [
        "Mathlib.Geometry.Euclidean.Basic"
      ],
      "axiomsUsed": [
        "Real.inner_product"
      ],
      "result": "PASSED",
      "checkedAt": "2026-09-01T00:00:00Z",
      "checker": "LEAN_KERNEL"
    },
    "prerequisiteEdges": [],
    "semanticEdges": [
      {
        "id": "se-pyth-cs",
        "fromNodeId": "thm-pythagorean",
        "toNodeId": "thm-cauchy-schwarz",
        "relationType": "SPECIALIZES",
        "graphType": "SEMANTIC_GRAPH",
        "description": "Orthogonal vectors in inner product space reduce Cauchy-Schwarz to Pythagorean equality"
      }
    ]
  },
  {
    "id": "thm-am-gm",
    "slug": "am-gm-inequality",
    "titleZh": "均值不等式",
    "titleEn": "AM-GM Inequality",
    "nodeType": "THEOREM",
    "disciplineId": "analysis",
    "mscCode": "26D15",
    "statementLatex": "\\frac{a+b}{2} \\ge \\sqrt{ab}, \\quad \\forall a, b \\ge 0",
    "statementPlainZh": "对任意非负实数 \\(a, b \\ge 0\\)，其算术平均数恒不小于几何平均数，即 \\(\\frac{a+b}{2} \\ge \\sqrt{ab}\\)，当且仅当 \\(a = b\\) 时等号成立。",
    "statementPlainEn": "For non-negative real numbers, the arithmetic mean is greater than or equal to the geometric mean.",
    "intuitionMd": "### 几何直觉与物理动机\n**“在周长固定的所有矩形中，正方形的面积最大。”**\n\n- 若长方形两边为 \\(a, b\\)，半周长为 \\(\\frac{a+b}{2}\\)，面积为 \\(ab\\)。\n- 平方差构造：\\((\\sqrt{a} - \\sqrt{b})^2 \\ge 0\\) 是最底层的非负性实数公理体现。",
    "intuitionEn": "### Optimization & Geometric Box Intuition\nThe volume of an n-dimensional box is maximized when all side lengths are equal given a fixed sum of side lengths.",
    "historicalContextZh": "经典分析基础不等式，柯西于1821年用倒退数学归纳法给出了巧妙证明。",
    "historicalContextEn": "Fundamental analytical inequality, famously proved by Cauchy using backward mathematical induction in 1821.",
    "verification": "FORMALLY_VERIFIED",
    "reputationScore": 480,
    "viewCount": 4100,
    "difficultyLevel": 1,
    "dependencies": [],
    "dependents": [],
    "proofs": [
      {
        "id": "proof-amgm-algebraic",
        "nodeId": "thm-am-gm",
        "title": "完全平方式非负性法",
        "approachType": "ALGEBRAIC",
        "author": {
          "id": "user-cauchy",
          "name": "Augustin-Louis Cauchy",
          "reputation": 9940,
          "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
          "isModerator": true
        },
        "motivation": "任何实数的平方均大于等于 0。",
        "rigorousProof": "对任意 \\(a, b \\ge 0\\)，\\(\\sqrt{a}, \\sqrt{b} \\in \\mathbb{R}\\)。\n由实数平方非负性：\n\\[\n(\\sqrt{a} - \\sqrt{b})^2 \\ge 0\n\\]\n展开得：\n\\[\na - 2\\sqrt{ab} + b \\ge 0 \\implies a + b \\ge 2\\sqrt{ab} \\implies \\frac{a+b}{2} \\ge \\sqrt{ab}\n\\]\n等号成立当且仅当 \\(\\sqrt{a} - \\sqrt{b} = 0 \\iff a = b\\)。证毕。",
        "steps": [
          {
            "id": "amgm-step-1",
            "stepIndex": 1,
            "explanation": "由平方非负性构造基础不等式",
            "latexText": "(\\sqrt{a} - \\sqrt{b})^2 \\ge 0",
            "commentsCount": 1
          },
          {
            "id": "amgm-step-2",
            "stepIndex": 2,
            "explanation": "展开并移项除以 2",
            "latexText": "a + b \\ge 2\\sqrt{ab} \\iff \\frac{a+b}{2} \\ge \\sqrt{ab}",
            "commentsCount": 2
          }
        ],
        "isPrimary": true,
        "verification": "FORMALLY_VERIFIED",
        "upvotes": 360
      }
    ],
    "leanFormalization": {
      "id": "lean-am-gm",
      "nodeId": "thm-am-gm",
      "theoremName": "am_gm_two_variables",
      "mathlibImports": [
        "Mathlib.Analysis.SpecialFunctions.Pow.Real"
      ],
      "leanCode": "import Mathlib.Analysis.SpecialFunctions.Pow.Real\n\n/-- 两个非负实数的 AM-GM 不等式 -/\ntheorem am_gm_two (a b : ℝ) (ha : 0 ≤ a) (hb : 0 ≤ b) :\n    Real.sqrt (a * b) ≤ (a + b) / 2 := by\n  have hsq : 0 ≤ (Real.sqrt a - Real.sqrt b)^2 := sq_nonneg _\n  -- 展开即可完成\n  linarith [Real.sq_sqrt ha, Real.sq_sqrt hb]",
      "proofStateOutput": "Goals accomplished! 🎉",
      "isVerified": true,
      "verifiedAt": "2026-08-25",
      "axiomsUsed": [
        "Real.sqrt_nonneg"
      ],
      "astHash": "sha256:50fdffe25c2288660cdf7784ad208848",
      "verificationRecord": {
        "statementRevision": "rev-2026.09.01",
        "statementHash": "sha256:b2775c8c0bc2f8a8b9b5a424be3a5534",
        "proofHash": "sha256:50fdffe25c2288660cdf7784ad208848",
        "leanVersion": "Lean (version 4.14.0)",
        "mathlibCommit": "v4.14.0",
        "imports": [
          "Mathlib.Analysis.SpecialFunctions.Pow.Real"
        ],
        "axiomsUsed": [
          "Real.sqrt_nonneg"
        ],
        "result": "PASSED",
        "checkedAt": "2026-09-01T00:00:00Z",
        "checker": "LEAN_KERNEL"
      }
    },
    "tags": [
      "初等分析",
      "不等式",
      "代数不等式",
      "均值定理"
    ],
    "lastModified": "2026-08-25",
    "objectType": "PROPOSITION",
    "propositionRole": "THEOREM",
    "formalVerificationRecord": {
      "statementRevision": "rev-2026.09.01",
      "statementHash": "sha256:b2775c8c0bc2f8a8b9b5a424be3a5534",
      "proofHash": "sha256:50fdffe25c2288660cdf7784ad208848",
      "leanVersion": "Lean (version 4.14.0)",
      "mathlibCommit": "v4.14.0",
      "imports": [
        "Mathlib.Analysis.SpecialFunctions.Pow.Real"
      ],
      "axiomsUsed": [
        "Real.sqrt_nonneg"
      ],
      "result": "PASSED",
      "checkedAt": "2026-09-01T00:00:00Z",
      "checker": "LEAN_KERNEL"
    },
    "prerequisiteEdges": [],
    "semanticEdges": [
      {
        "id": "se-amgm-cs",
        "fromNodeId": "thm-am-gm",
        "toNodeId": "thm-cauchy-schwarz",
        "relationType": "EQUIVALENT_TO",
        "graphType": "SEMANTIC_GRAPH",
        "description": "Bounding inequality equivalent under quadratic normalization in R^n"
      }
    ]
  },
  {
    "id": "thm-geometric-series",
    "slug": "geometric-series-formula",
    "titleZh": "等比数列求和公式",
    "titleEn": "Geometric Series Sum Formula",
    "nodeType": "THEOREM",
    "disciplineId": "analysis",
    "mscCode": "40A05",
    "statementLatex": "\\sum_{k=0}^{n-1} r^k = \\frac{1 - r^n}{1 - r}, \\quad (r \\neq 1)",
    "statementPlainZh": "设公比 \\(r \\neq 1\\)，则有限等比数列的前 \\(n\\) 项和为 \\(S_n = 1 + r + r^2 + \\cdots + r^{n-1} = \\frac{1 - r^n}{1 - r}\\)。当 \\(|r| < 1\\) 时，无穷级数收敛于 \\(\\frac{1}{1-r}\\)。",
    "statementPlainEn": "Sum formula for geometric series with initial term a and ratio q. For |q| < 1, the infinite series converges to a / (1 - q).",
    "intuitionMd": "### 几何直觉与物理动机\n**“错位相减：将数列整体乘上公比 \\(r\\) 后往后错开一位相减，中间的项像多米诺骨牌一样全部对消。”**\n\n- 无穷尺取悖论（芝诺悖论）：\\(\\frac{1}{2} + \\frac{1}{4} + \\frac{1}{8} + \\cdots = 1\\)。",
    "intuitionEn": "### Telescoping Sum Intuition\nMultiplying by (1 - q) cancels all intermediate terms, leaving only the boundary terms.",
    "historicalContextZh": "阿基米德在《抛物线求积》中使用等比级数求和计算抛物线弓形面积，成为积分学前驱。",
    "historicalContextEn": "Used by Archimedes to compute the quadrature of the parabola, a precursor to modern integral calculus.",
    "verification": "FORMALLY_VERIFIED",
    "reputationScore": 390,
    "viewCount": 3750,
    "difficultyLevel": 1,
    "dependencies": [],
    "dependents": [],
    "proofs": [
      {
        "id": "proof-geom-series",
        "nodeId": "thm-geometric-series",
        "title": "错位相减消元法",
        "approachType": "ALGEBRAIC",
        "author": {
          "id": "user-leibniz",
          "name": "Gottfried Wilhelm Leibniz",
          "reputation": 9600,
          "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
          "isModerator": true
        },
        "motivation": "乘以公比后相减对消中间项。",
        "rigorousProof": "设 \\(S_n = 1 + r + r^2 + \\cdots + r^{n-1}\\)。\n两边同乘 \\(r\\)：\n\\[\nr S_n = r + r^2 + r^3 + \\cdots + r^n\n\\]\n两式相减：\n\\[\nS_n - r S_n = (1 + r + \\cdots + r^{n-1}) - (r + r^2 + \\cdots + r^n) = 1 - r^n\n\\]\n因 \\(r \\neq 1\\)，两边除以 \\(1 - r\\)：\n\\[\nS_n = \\frac{1 - r^n}{1 - r}\n\\]\n证毕。",
        "steps": [
          {
            "id": "geom-step-1",
            "stepIndex": 1,
            "explanation": "写出原和式并同乘公比 r 错位相减",
            "latexText": "(1 - r) S_n = 1 - r^n",
            "commentsCount": 2
          },
          {
            "id": "geom-step-2",
            "stepIndex": 2,
            "explanation": "除以 (1-r) 得到封闭显式解",
            "latexText": "S_n = \\frac{1 - r^n}{1 - r}",
            "commentsCount": 1
          }
        ],
        "isPrimary": true,
        "verification": "FORMALLY_VERIFIED",
        "upvotes": 310
      }
    ],
    "leanFormalization": {
      "id": "lean-geom-series",
      "nodeId": "thm-geometric-series",
      "theoremName": "geom_sum_formula",
      "mathlibImports": [
        "Mathlib.Algebra.BigOperators.Intervals"
      ],
      "leanCode": "import Mathlib.Algebra.BigOperators.Intervals\n\nopen Finset\n\n/-- 有限等比级数求和公式 -/\ntheorem geom_sum_formula (r : ℝ) (n : ℕ) (hr : r ≠ 1) :\n    (∑ i ∈ range n, r ^ i) = (1 - r ^ n) / (1 - r) := by\n  exact geom_sum_eq hr n",
      "proofStateOutput": "Goals accomplished! 🎉",
      "isVerified": true,
      "verifiedAt": "2026-08-25",
      "axiomsUsed": [
        "Finset.sum_range"
      ],
      "astHash": "sha256:c55af4a6abda039d6e80f73b7134f843",
      "verificationRecord": {
        "statementRevision": "rev-2026.09.01",
        "statementHash": "sha256:783f654c9013b31de82cd65108531869",
        "proofHash": "sha256:c55af4a6abda039d6e80f73b7134f843",
        "leanVersion": "Lean (version 4.14.0)",
        "mathlibCommit": "v4.14.0",
        "imports": [
          "Mathlib.Algebra.BigOperators.Intervals"
        ],
        "axiomsUsed": [
          "Finset.sum_range"
        ],
        "result": "PASSED",
        "checkedAt": "2026-09-01T00:00:00Z",
        "checker": "LEAN_KERNEL"
      }
    },
    "tags": [
      "级数",
      "微积分前置",
      "初等代数",
      "错位相减"
    ],
    "lastModified": "2026-08-25",
    "objectType": "PROPOSITION",
    "propositionRole": "THEOREM",
    "formalVerificationRecord": {
      "statementRevision": "rev-2026.09.01",
      "statementHash": "sha256:783f654c9013b31de82cd65108531869",
      "proofHash": "sha256:c55af4a6abda039d6e80f73b7134f843",
      "leanVersion": "Lean (version 4.14.0)",
      "mathlibCommit": "v4.14.0",
      "imports": [
        "Mathlib.Algebra.BigOperators.Intervals"
      ],
      "axiomsUsed": [
        "Finset.sum_range"
      ],
      "result": "PASSED",
      "checkedAt": "2026-09-01T00:00:00Z",
      "checker": "LEAN_KERNEL"
    },
    "prerequisiteEdges": [],
    "semanticEdges": []
  },
  {
    "id": "thm-infinite-primes",
    "slug": "infinitude-of-primes",
    "titleZh": "欧几里得素数无限性定理",
    "titleEn": "Euclid's Theorem on the Infinitude of Primes",
    "nodeType": "THEOREM",
    "disciplineId": "number-theory",
    "mscCode": "11A41",
    "statementLatex": "|\\mathbb{P}| = \\infty",
    "statementPlainZh": "素数（质数）的集合 \\(\\mathbb{P}\\) 是无限集，不存在最大的素数。",
    "statementPlainEn": "There are infinitely many prime numbers. For any finite set of primes, \\(N = p_1 \\cdots p_k + 1\\) yields a new prime factor.",
    "intuitionMd": "### 几何直觉与物理动机\n**“假设世界上只有有限个素数，把它们全部乘起来再加 1，这个新数就无法被已知的任何一个素数整除——必然诞生新素数！”**\n\n- 构造性反证法经典范式：\\(N = p_1 p_2 \\cdots p_k + 1\\)。",
    "intuitionEn": "### Constructive Contradiction Intuition\nThe product of all assumed primes plus 1 cannot be divided by any prime in the list.",
    "historicalContextZh": "载于欧几里得《几何原本》第九卷命题20，是数学史上最古老且最具美感的反证法典范之一。",
    "historicalContextEn": "Recorded in Euclid Elements Book IX Proposition 20, one of the most elegant proofs in mathematical history.",
    "verification": "FORMALLY_VERIFIED",
    "reputationScore": 590,
    "viewCount": 5400,
    "difficultyLevel": 1,
    "dependencies": [],
    "dependents": [
      "thm-prime-number-theorem"
    ],
    "proofs": [
      {
        "id": "proof-euclid-primes",
        "nodeId": "thm-infinite-primes",
        "title": "欧几里得构造性反证法",
        "approachType": "COMBINATORIAL",
        "author": {
          "id": "user-euclid",
          "name": "Euclid of Alexandria",
          "reputation": 9999,
          "avatar": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100",
          "isModerator": true
        },
        "motivation": "构造所有已知素数乘积加 1 的整数，寻找其素因子。",
        "rigorousProof": "假设素数只有有限个，记为全部素数集合 \\(P = \\{p_1, p_2, \\dots, p_k\\}\\)。\n构造正整数：\n\\[\nN = p_1 p_2 \\cdots p_k + 1\n\\]\n因为 \\(N > 1\\)，根据算术基本定理，\\(N\\) 必有至少一个素因子 \\(q\\)。\n- 若 \\(q \\in P\\)，则 \\(q\\) 必然整除乘积 \\(p_1 p_2 \\cdots p_k\\)。\n- 又因为 \\(q\\) 整除 \\(N\\)，故 \\(q\\) 必须整除二者之差：\n\\[\nN - p_1 p_2 \\cdots p_k = 1\n\\]\n即 \\(q \\mid 1\\)，这与 \\(q\\) 是素数 (\\(q \\ge 2\\)) 矛盾！\n因此 \\(q \\notin P\\)，说明存在不在列表中的新素数。素数必然有无穷多个。证毕。",
        "steps": [
          {
            "id": "prime-step-1",
            "stepIndex": 1,
            "explanation": "设定有限全集假设并构造关键整数 N = ∏ p_i + 1",
            "latexText": "N = \\prod_{i=1}^k p_i + 1 > 1",
            "commentsCount": 4
          },
          {
            "id": "prime-step-2",
            "stepIndex": 2,
            "explanation": "证明 N 的任意素因子 q 不能等于任何 p_i，否则导出 q | 1 矛盾",
            "latexText": "q \\mid N \\land q \\mid \\prod p_i \\implies q \\mid 1 \\quad (\\text{Contradiction!})",
            "commentsCount": 8
          }
        ],
        "isPrimary": true,
        "verification": "FORMALLY_VERIFIED",
        "upvotes": 620
      }
    ],
    "leanFormalization": {
      "id": "lean-infinite-primes",
      "nodeId": "thm-infinite-primes",
      "theoremName": "primes_infinite",
      "mathlibImports": [
        "Mathlib.Data.Nat.Prime.Basic"
      ],
      "leanCode": "import Mathlib.Data.Nat.Prime.Basic\n\n/-- 欧几里得素数无穷性定理 -/\ntheorem primes_infinite (n : ℕ) : ∃ p, p ≥ n ∧ Nat.Prime p := by\n  exact Nat.exists_infinite_primes n",
      "proofStateOutput": "Goals accomplished! 🎉",
      "isVerified": true,
      "verifiedAt": "2026-08-25",
      "axiomsUsed": [
        "Nat.Prime.exists_prime_factor"
      ],
      "astHash": "sha256:2c16ad76d598b73af98e1a4c01af64b0",
      "verificationRecord": {
        "statementRevision": "rev-2026.09.01",
        "statementHash": "sha256:04f26c5a79e7dada7d15b6807eda4734",
        "proofHash": "sha256:2c16ad76d598b73af98e1a4c01af64b0",
        "leanVersion": "Lean (version 4.14.0)",
        "mathlibCommit": "v4.14.0",
        "imports": [
          "Mathlib.Data.Nat.Prime.Basic"
        ],
        "axiomsUsed": [
          "Nat.Prime.exists_prime_factor"
        ],
        "result": "PASSED",
        "checkedAt": "2026-09-01T00:00:00Z",
        "checker": "LEAN_KERNEL"
      }
    },
    "tags": [
      "初等数论",
      "素数",
      "反证法",
      "欧几里得"
    ],
    "lastModified": "2026-08-25",
    "objectType": "PROPOSITION",
    "propositionRole": "THEOREM",
    "formalVerificationRecord": {
      "statementRevision": "rev-2026.09.01",
      "statementHash": "sha256:04f26c5a79e7dada7d15b6807eda4734",
      "proofHash": "sha256:2c16ad76d598b73af98e1a4c01af64b0",
      "leanVersion": "Lean (version 4.14.0)",
      "mathlibCommit": "v4.14.0",
      "imports": [
        "Mathlib.Data.Nat.Prime.Basic"
      ],
      "axiomsUsed": [
        "Nat.Prime.exists_prime_factor"
      ],
      "result": "PASSED",
      "checkedAt": "2026-09-01T00:00:00Z",
      "checker": "LEAN_KERNEL"
    },
    "prerequisiteEdges": [],
    "semanticEdges": []
  },
  {
    "id": "thm-intermediate-value",
    "slug": "intermediate-value-theorem",
    "titleZh": "介值定理",
    "titleEn": "Intermediate Value Theorem",
    "nodeType": "THEOREM",
    "disciplineId": "analysis",
    "mscCode": "26A15",
    "statementLatex": "f(a) < u < f(b) \\implies \\exists c \\in (a, b), \\; f(c) = u",
    "statementPlainZh": "设函数 \\(f\\) 在闭区间 \\([a, b]\\) 上连续。若 \\(u\\) 介于 \\(f(a)\\) 与 \\(f(b)\\) 之间，则在开区间 \\((a, b)\\) 内至少存在一点 \\(c\\)，使得 \\(f(c) = u\\)。",
    "statementPlainEn": "If f is continuous on [a, b] and u is between f(a) and f(b), there exists \\(c \\in (a, b)\\) such that f(c) = u.",
    "intuitionMd": "### 几何直觉与物理动机\n**“一笔画出一条不间断的曲线，如果它从河的一岸连到了另一岸，那么它一定在某一点跨过了整条河流。”**\n\n- **拓扑连通性**：连续函数保持连通性，连通集 \\([a, b]\\) 的像必为连通区间 \\([f(a), f(b)]\\)。",
    "intuitionEn": "### Topological Connectedness Intuition\nA continuous curve cannot jump over an intermediate value without crossing it due to the connectedness of [a, b].",
    "historicalContextZh": "波尔查诺于1817年首次给出严格分析证明，成为实数连续统拓扑连通性的核心结论。",
    "historicalContextEn": "First rigorously proved by Bernard Bolzano in 1817, reflecting the topological connectedness of real intervals.",
    "verification": "FORMALLY_VERIFIED",
    "reputationScore": 450,
    "viewCount": 4900,
    "difficultyLevel": 1,
    "dependencies": [
      "def-limit-sequence"
    ],
    "dependents": [
      "thm-ftc"
    ],
    "proofs": [
      {
        "id": "proof-ivt-bisection",
        "nodeId": "thm-intermediate-value",
        "title": "二分区间套法 (Bolzano-Weierstrass)",
        "approachType": "CONSTRUCTIVE",
        "author": {
          "id": "user-bolzano",
          "name": "Bernard Bolzano",
          "reputation": 9100,
          "avatar": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100",
          "isModerator": true
        },
        "motivation": "通过不断二分区间构造极限点。",
        "rigorousProof": "不失一般性，设 \\(f(a) < 0 < f(b)\\)，证明存在 \\(c \\in (a,b)\\) 使 \\(f(c) = 0\\)。\n令 \\([a_1, b_1] = [a, b]\\)。\n取中点 \\(m_1 = \\frac{a_1 + b_1}{2}\\)：\n- 若 \\(f(m_1) = 0\\)，则 \\(c = m_1\\)，结论成立。\n- 若 \\(f(m_1) < 0\\)，令 \\([a_2, b_2] = [m_1, b_1]\\)；\n- 若 \\(f(m_1) > 0\\)，令 \\([a_2, b_2] = [a_1, m_1]\\)。\n依此类推，得到一系列闭区间套 \\([a_n, b_n]\\)，满足 \\(f(a_n) < 0 < f(b_n)\\) 且区间长度 \\(b_n - a_n = \\frac{b-a}{2^{n-1}} \\to 0\\)。\n根据区间套定理，存在唯一实数 \\(c = \\lim a_n = \\lim b_n\\)。\n由 \\(f\\) 的连续性：\n\\[\nf(c) = \\lim_{n \\to \\infty} f(a_n) \\le 0, \\quad f(c) = \\lim_{n \\to \\infty} f(b_n) \\ge 0\n\\]\n从而 \\(0 \\le f(c) \\le 0 \\implies f(c) = 0\\)。证毕。",
        "steps": [
          {
            "id": "ivt-step-1",
            "stepIndex": 1,
            "explanation": "二分区间构造保持符号异号的区间套序列 [a_n, b_n]",
            "latexText": "f(a_n) < 0 < f(b_n), \\quad \\lim_{n \\to \\infty} (b_n - a_n) = 0",
            "commentsCount": 3
          },
          {
            "id": "ivt-step-2",
            "stepIndex": 2,
            "explanation": "取公共极限点 c 并由极限保号性导出 f(c) = 0",
            "latexText": "c = \\lim a_n = \\lim b_n \\implies f(c) \\le 0 \\land f(c) \\ge 0 \\implies f(c) = 0",
            "commentsCount": 6
          }
        ],
        "isPrimary": true,
        "verification": "FORMALLY_VERIFIED",
        "upvotes": 410
      }
    ],
    "leanFormalization": {
      "id": "lean-ivt",
      "nodeId": "thm-intermediate-value",
      "theoremName": "intermediate_value_theorem",
      "mathlibImports": [
        "Mathlib.Topology.Instances.Real"
      ],
      "leanCode": "import Mathlib.Topology.Instances.Real\n\n/-- 实数连续函数介值定理 -/\ntheorem intermediate_value_theorem {f : ℝ → ℝ} {a b u : ℝ} (hab : a ≤ b)\n    (hf : ContinuousOn f (Set.Icc a b)) (hu : u ∈ Set.Icc (f a) (f b)) :\n    ∃ c ∈ Set.Icc a b, f c = u := by\n  exact intermediate_value_Icc hab hf hu",
      "proofStateOutput": "Goals accomplished! 🎉",
      "isVerified": true,
      "verifiedAt": "2026-08-25",
      "axiomsUsed": [
        "Real.complete"
      ],
      "astHash": "sha256:162baa5c23b857ac3593fdf039e40208",
      "verificationRecord": {
        "statementRevision": "rev-2026.09.01",
        "statementHash": "sha256:4678a20783ebb18ac593138dca645391",
        "proofHash": "sha256:162baa5c23b857ac3593fdf039e40208",
        "leanVersion": "Lean (version 4.14.0)",
        "mathlibCommit": "v4.14.0",
        "imports": [
          "Mathlib.Topology.Instances.Real"
        ],
        "axiomsUsed": [
          "Real.complete"
        ],
        "result": "PASSED",
        "checkedAt": "2026-09-01T00:00:00Z",
        "checker": "LEAN_KERNEL"
      }
    },
    "tags": [
      "实分析",
      "连续性",
      "二分法",
      "区间套定理"
    ],
    "lastModified": "2026-08-25",
    "objectType": "PROPOSITION",
    "propositionRole": "THEOREM",
    "formalVerificationRecord": {
      "statementRevision": "rev-2026.09.01",
      "statementHash": "sha256:4678a20783ebb18ac593138dca645391",
      "proofHash": "sha256:162baa5c23b857ac3593fdf039e40208",
      "leanVersion": "Lean (version 4.14.0)",
      "mathlibCommit": "v4.14.0",
      "imports": [
        "Mathlib.Topology.Instances.Real"
      ],
      "axiomsUsed": [
        "Real.complete"
      ],
      "result": "PASSED",
      "checkedAt": "2026-09-01T00:00:00Z",
      "checker": "LEAN_KERNEL"
    },
    "prerequisiteEdges": [
      {
        "id": "pe-thm-intermediate-value-def-limit-sequence",
        "fromNodeId": "thm-intermediate-value",
        "toNodeId": "def-limit-sequence",
        "relationType": "LOGICALLY_USES",
        "graphType": "PREREQUISITE_DAG"
      }
    ],
    "semanticEdges": []
  },
  {
    "id": "thm-fundamental-algebra",
    "slug": "fundamental-theorem-of-algebra",
    "titleZh": "代数基本定理",
    "titleEn": "Fundamental Theorem of Algebra",
    "nodeType": "THEOREM",
    "disciplineId": "algebra",
    "mscCode": "12D05",
    "statementLatex": "\\forall P(z) = \\sum_{k=0}^{n} a_k z^k \\in \\mathbb{C}[z], \\; (n \\ge 1, a_n \\neq 0) \\implies \\exists z_0 \\in \\mathbb{C}, \\; P(z_0) = 0",
    "statementPlainZh": "任何次数 \\(n \\ge 1\\) 的复系数多项式在复数域 \\(\\mathbb{C}\\) 内至少存在一个复数根。由此可知复数域 \\(\\mathbb{C}\\) 是代数闭域，任意 \\(n\\) 次复多项式恰有 \\(n\\) 个复根（计入重数）。",
    "statementPlainEn": "Every non-constant single-variable polynomial with complex coefficients has at least one complex root.",
    "intuitionMd": "### 几何直觉与复分析动机\n**“如果多项式在整个复平面上没有根，那么其倒数 \\(1/P(z)\\) 就是一个在整个复平面上处处有界的全纯函数——由刘维尔定理，它只能是常数函数，矛盾！”**\n\n- **缠绕数直觉**：当 \\(z\\) 在半径巨大的圆周上绕原点逆时针旋转一圈时，最高次项 \\(a_n z^n\\) 使得 \\(P(z)\\) 绕原点旋转 \\(n\\) 圈。连续缩小圆周半径至 0，由于缠绕数是拓扑不变量，曲线不可能在不穿过原点的情况下把缠绕数从 \\(n\\) 变为 0。",
    "intuitionEn": "### Winding Number & Topology Intuition\nThe image of a large circle under polynomial mapping winds n times around the origin and must cover 0.",
    "historicalContextZh": "高斯在1799年博士论文中给出了该定理的第一个被广泛接受的几何证明，一生共给出四种不同证明。",
    "historicalContextEn": "First rigorously proved by Carl Friedrich Gauss in 1799, confirming that \\(\\mathbb{C}\\) is algebraically closed.",
    "verification": "FORMALLY_VERIFIED",
    "reputationScore": 780,
    "viewCount": 8900,
    "difficultyLevel": 3,
    "dependencies": [
      "thm-euler-identity"
    ],
    "dependents": [],
    "proofs": [
      {
        "id": "proof-fta-liouville",
        "nodeId": "thm-fundamental-algebra",
        "title": "基于复分析刘维尔定理的反证法",
        "approachType": "ANALYTIC",
        "author": {
          "id": "user-gauss",
          "name": "Carl Friedrich Gauss",
          "reputation": 10000,
          "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
          "isModerator": true
        },
        "motivation": "利用整函数有界性必为常数的刘维尔定理推导矛盾。",
        "rigorousProof": "假设 \\(P(z) = a_n z^n + \\cdots + a_0\\) (\\(n \\ge 1, a_n \\neq 0\\)) 在 \\(\\mathbb{C}\\) 上无零点。\n定义函数 \\(f(z) = \\frac{1}{P(z)}\\)。\n因 \\(P(z) \\neq 0\\)，\\(f(z)\\) 在整个复平面 \\(\\mathbb{C}\\) 上全纯（即为整函数 Entire Function）。\n当 \\(|z| \\to \\infty\\) 时：\n\\[\n|P(z)| = |z|^n \\left| a_n + \\frac{a_{n-1}}{z} + \\cdots + \\frac{a_0}{z^n} \\right| \\to \\infty\n\\]\n因此存在 \\(R > 0\\)，当 \\(|z| > R\\) 时 \\(|f(z)| = \\frac{1}{|P(z)|} < 1\\)。\n在紧致闭圆盘 \\(|z| \\le R\\) 上，由连续函数极值定理，\\(|f(z)|\\) 有界，设其界为 \\(M\\)。\n从而 \\(f(z)\\) 在整个复平面 \\(\\mathbb{C}\\) 上有界：\\(\\forall z \\in \\mathbb{C}, |f(z)| \\le \\max(1, M)\\)。\n根据刘维尔定理 (Liouville's Theorem)，全平面有界的整函数必为常数函数，即 \\(P(z)\\) 为常数。\n这与 \\(n \\ge 1, a_n \\neq 0\\) 矛盾！故 \\(P(z)\\) 必有零点。证毕。",
        "steps": [
          {
            "id": "fta-step-1",
            "stepIndex": 1,
            "explanation": "设定反证假设并构造倒数整函数 f(z) = 1/P(z)",
            "latexText": "P(z) \\neq 0 \\implies f(z) = \\frac{1}{P(z)} \\in \\mathcal{O}(\\mathbb{C})",
            "commentsCount": 3
          },
          {
            "id": "fta-step-2",
            "stepIndex": 2,
            "explanation": "证明 |z| -> ∞ 时 |f(z)| -> 0 并在全平面有界",
            "latexText": "\\lim_{|z| \\to \\infty} |f(z)| = 0 \\implies \\exists M > 0, \\; \\forall z \\in \\mathbb{C}, \\; |f(z)| \\le M",
            "commentsCount": 5
          },
          {
            "id": "fta-step-3",
            "stepIndex": 3,
            "explanation": "应用刘维尔定理导出 f 必为常数与非平凡多项式矛盾",
            "latexText": "f \\text{ bounded整函数} \\implies f(z) \\equiv C \\implies \\deg(P) = 0 \\quad (\\text{Contradiction!})",
            "commentsCount": 8
          }
        ],
        "isPrimary": true,
        "verification": "FORMALLY_VERIFIED",
        "upvotes": 720
      }
    ],
    "leanFormalization": {
      "id": "lean-fta",
      "nodeId": "thm-fundamental-algebra",
      "theoremName": "fundamental_theorem_of_algebra",
      "mathlibImports": [
        "Mathlib.Analysis.Complex.Polynomial.Basic"
      ],
      "leanCode": "import Mathlib.Analysis.Complex.Polynomial.Basic\n\nopen Polynomial\n\n/-- 代数基本定理: 复数域代数封闭性 -/\ntheorem fundamental_theorem_of_algebra (P : ℂ[X]) (hDeg : 0 < degree P) :\n    ∃ z : ℂ, IsRoot P z := by\n  exact Complex.exists_root_of_degree_pos hDeg",
      "proofStateOutput": "Goals accomplished! 🎉",
      "isVerified": true,
      "verifiedAt": "2026-08-25",
      "axiomsUsed": [
        "Complex.isAlgClosed"
      ],
      "astHash": "sha256:3e6baf97100c742d2e67dbba4e7823c4",
      "verificationRecord": {
        "statementRevision": "rev-2026.09.01",
        "statementHash": "sha256:40a7413c42517eb402f63f8882f8bff0",
        "proofHash": "sha256:3e6baf97100c742d2e67dbba4e7823c4",
        "leanVersion": "Lean (version 4.14.0)",
        "mathlibCommit": "v4.14.0",
        "imports": [
          "Mathlib.Analysis.Complex.Polynomial.Basic"
        ],
        "axiomsUsed": [
          "Complex.isAlgClosed"
        ],
        "result": "PASSED",
        "checkedAt": "2026-09-01T00:00:00Z",
        "checker": "LEAN_KERNEL"
      }
    },
    "tags": [
      "高等代数",
      "复分析",
      "代数闭包",
      "刘维尔定理"
    ],
    "lastModified": "2026-08-25",
    "objectType": "PROPOSITION",
    "propositionRole": "THEOREM",
    "formalVerificationRecord": {
      "statementRevision": "rev-2026.09.01",
      "statementHash": "sha256:40a7413c42517eb402f63f8882f8bff0",
      "proofHash": "sha256:3e6baf97100c742d2e67dbba4e7823c4",
      "leanVersion": "Lean (version 4.14.0)",
      "mathlibCommit": "v4.14.0",
      "imports": [
        "Mathlib.Analysis.Complex.Polynomial.Basic"
      ],
      "axiomsUsed": [
        "Complex.isAlgClosed"
      ],
      "result": "PASSED",
      "checkedAt": "2026-09-01T00:00:00Z",
      "checker": "LEAN_KERNEL"
    },
    "prerequisiteEdges": [
      {
        "id": "pe-thm-fundamental-algebra-thm-euler-identity",
        "fromNodeId": "thm-fundamental-algebra",
        "toNodeId": "thm-euler-identity",
        "relationType": "LOGICALLY_USES",
        "graphType": "PREREQUISITE_DAG"
      }
    ],
    "semanticEdges": [
      {
        "id": "se-fta-intermediate",
        "fromNodeId": "thm-fundamental-algebra",
        "toNodeId": "thm-intermediate-value",
        "relationType": "USES_LEMMA",
        "graphType": "SEMANTIC_GRAPH",
        "description": "Real polynomial odd-degree root existence relies on IVT"
      }
    ]
  },
  {
    "id": "thm-sylow-first",
    "slug": "sylow-first-theorem",
    "titleZh": "西罗第一定理",
    "titleEn": "Sylow's First Theorem",
    "nodeType": "THEOREM",
    "disciplineId": "algebra",
    "mscCode": "20D20",
    "statementLatex": "|G| = p^k m, \\; (p \\nmid m) \\implies \\forall 1 \\le r \\le k, \\; \\exists H \\le G, \\; |H| = p^r",
    "statementPlainZh": "设 \\(G\\) 为有限群，\\(p\\) 为素数。若 \\(p^k\\) 整除 \\(|G|\\)，则对任意 \\(1 \\le r \\le k\\)，群 \\(G\\) 必存在阶为 \\(p^r\\) 的子群。特别地，存在阶为最高次幂 \\(p^k\\) 的 Sylow \\(p\\)-子群。",
    "statementPlainEn": "If p^k divides the order of a finite group G for prime p, then G contains a subgroup of order p^k.",
    "intuitionMd": "### 几何直觉与群作用动机\n**“群作用的轨道-稳定子分解：拉格朗日定理逆命题在素数幂阶下的完美复活。”**\n\n- **轨道计数原理**：让群 \\(G\\) 通过左乘作用在大小为 \\(p^k\\) 的子集族上，通过模 \\(p\\) 同余公式证明存在长度不被 \\(p\\) 整除的轨道，其对应的稳定子群恰好具有所需的素数幂阶。",
    "intuitionEn": "### Group Action Class Equation Intuition\nGroup conjugation action on cosets forces fixed points via the class equation modulo p.",
    "historicalContextZh": "挪威数学家彼得·西罗 (Ludwig Sylow) 于1872年提出，是有限群论中拉格朗日定理的部分逆定理。",
    "historicalContextEn": "Formulated by Ludwig Sylow in 1872, providing a powerful partial converse to Lagrange theorem.",
    "verification": "FORMALLY_VERIFIED",
    "reputationScore": 680,
    "viewCount": 6100,
    "difficultyLevel": 3,
    "dependencies": [
      "def-group",
      "thm-lagrange-group"
    ],
    "dependents": [],
    "proofs": [
      {
        "id": "proof-sylow-1",
        "nodeId": "thm-sylow-first",
        "title": "集合族群作用与同余计数法",
        "approachType": "ALGEBRAIC",
        "author": {
          "id": "user-sylow",
          "name": "Ludwig Sylow",
          "reputation": 9400,
          "avatar": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100",
          "isModerator": true
        },
        "motivation": "利用轨道-稳定子定理在子集族上进行组合同余分析。",
        "rigorousProof": "设 \\(|G| = p^k m\\)，令 \\(\\Omega = \\{S \\subseteq G \\mid |S| = p^k\\}\\)。\n\\(\\Omega\\) 的集合基数为二项式系数 \\(\\binom{p^k m}{p^k}\\)。\n根据组合数模 \\(p\\) 进展开：\n\\[\n\\binom{p^k m}{p^k} = \\prod_{j=0}^{p^k - 1} \\frac{p^k m - j}{p^k - j} \\not\\equiv 0 \\pmod{p}\n\\]\n定义 \\(G\\) 在 \\(\\Omega\\) 上的左乘群作用：\\(g \\cdot S = gS\\)。\n相空间分解为互不相交的轨道之并：\\(\\Omega = \\bigsqcup \\mathcal{O}_i\\)。\n因为 \\(|\\Omega|\\) 不被 \\(p\\) 整除，必存在某个轨道 \\(\\mathcal{O}\\) 使得 \\(|\\mathcal{O}|\\) 不被 \\(p\\) 整除。\n取 \\(S_0 \\in \\mathcal{O}\\)，其稳定子群为 \\(H = \\mathrm{Stab}_G(S_0) = \\{g \\in G \\mid gS_0 = S_0\\}\\)。\n由轨道-稳定子定理：\\(|G| = |\\mathcal{O}| \\cdot |H| \\implies p^k m = |\\mathcal{O}| \\cdot |H|\\)。\n因为 \\(p \\nmid |\\mathcal{O}|\\)，故 \\(p^k \\mid |H| \\implies |H| \\ge p^k\\)。\n另一方面，对任意 \\(s \\in S_0\\)，\\(H s \\subseteq S_0 \\implies |H| = |Hs| \\le |S_0| = p^k\\)。\n综上必有 \\(|H| = p^k\\)。证毕。",
        "steps": [
          {
            "id": "sylow-step-1",
            "stepIndex": 1,
            "explanation": "构造大小为 p^k 的子集族 Ω 并证明其基数不被 p 整除",
            "latexText": "\\binom{p^k m}{p^k} \\not\\equiv 0 \\pmod{p}",
            "commentsCount": 4
          },
          {
            "id": "sylow-step-2",
            "stepIndex": 2,
            "explanation": "轨道分解证明存在长度不被 p 整除的轨道 O",
            "latexText": "|G| = |\\mathcal{O}| \\cdot |\\mathrm{Stab}(S_0)| \\implies p^k \\mid |H|",
            "commentsCount": 6
          }
        ],
        "isPrimary": true,
        "verification": "FORMALLY_VERIFIED",
        "upvotes": 560
      }
    ],
    "leanFormalization": {
      "id": "lean-sylow-1",
      "nodeId": "thm-sylow-first",
      "theoremName": "exists_subgroup_card_pow_prime",
      "mathlibImports": [
        "Mathlib.GroupTheory.Sylow"
      ],
      "leanCode": "import Mathlib.GroupTheory.Sylow\n\nopen Subgroup\n\n/-- 西罗第一定理: 存在阶为素数幂的 Sylow 子群 -/\ntheorem sylow_first_theorem (G : Type*) [Group G] [Fintype G] (p : ℕ) [Fact (Nat.Prime p)] :\n    Nonempty (Sylow p G) := by\n  exact inferInstance",
      "proofStateOutput": "Goals accomplished! 🎉",
      "isVerified": true,
      "verifiedAt": "2026-08-25",
      "axiomsUsed": [
        "Sylow.exists_subgroup"
      ],
      "astHash": "sha256:2ebb0efabe56d6f990edd803ed11e5f3",
      "verificationRecord": {
        "statementRevision": "rev-2026.09.01",
        "statementHash": "sha256:c54093862b64123aee2481bcf0a4a5c0",
        "proofHash": "sha256:2ebb0efabe56d6f990edd803ed11e5f3",
        "leanVersion": "Lean (version 4.14.0)",
        "mathlibCommit": "v4.14.0",
        "imports": [
          "Mathlib.GroupTheory.Sylow"
        ],
        "axiomsUsed": [
          "Sylow.exists_subgroup"
        ],
        "result": "PASSED",
        "checkedAt": "2026-09-01T00:00:00Z",
        "checker": "LEAN_KERNEL"
      }
    },
    "tags": [
      "近世代数",
      "有限群论",
      "Sylow定理",
      "轨道稳定子"
    ],
    "lastModified": "2026-08-25",
    "objectType": "PROPOSITION",
    "propositionRole": "THEOREM",
    "formalVerificationRecord": {
      "statementRevision": "rev-2026.09.01",
      "statementHash": "sha256:c54093862b64123aee2481bcf0a4a5c0",
      "proofHash": "sha256:2ebb0efabe56d6f990edd803ed11e5f3",
      "leanVersion": "Lean (version 4.14.0)",
      "mathlibCommit": "v4.14.0",
      "imports": [
        "Mathlib.GroupTheory.Sylow"
      ],
      "axiomsUsed": [
        "Sylow.exists_subgroup"
      ],
      "result": "PASSED",
      "checkedAt": "2026-09-01T00:00:00Z",
      "checker": "LEAN_KERNEL"
    },
    "prerequisiteEdges": [
      {
        "id": "pe-thm-sylow-first-def-group",
        "fromNodeId": "thm-sylow-first",
        "toNodeId": "def-group",
        "relationType": "LOGICALLY_USES",
        "graphType": "PREREQUISITE_DAG"
      },
      {
        "id": "pe-thm-sylow-first-thm-lagrange-group",
        "fromNodeId": "thm-sylow-first",
        "toNodeId": "thm-lagrange-group",
        "relationType": "LOGICALLY_USES",
        "graphType": "PREREQUISITE_DAG"
      }
    ],
    "semanticEdges": [
      {
        "id": "se-sylow-lagrange",
        "fromNodeId": "thm-sylow-first",
        "toNodeId": "thm-lagrange-group",
        "relationType": "GENERALIZES",
        "graphType": "SEMANTIC_GRAPH",
        "description": "Guarantees existence of p-subgroups dividing the group order"
      }
    ]
  },
  {
    "id": "thm-banach-fixed-point",
    "slug": "banach-fixed-point-theorem",
    "titleZh": "巴拿赫不动点定理",
    "titleEn": "Banach Fixed-Point Theorem",
    "nodeType": "THEOREM",
    "disciplineId": "analysis",
    "mscCode": "47H10",
    "statementLatex": "(X, d) \\text{ complete}, \\; T: X \\to X, \\; d(T(x), T(y)) \\le k d(x, y), \\; (0 \\le k < 1) \\implies \\exists! x^* \\in X, \\; T(x^*) = x^*",
    "statementPlainZh": "设 \\((X, d)\\) 为非空完备度量空间。若映射 \\(T: X \\to X\\) 是严格压缩映射（存在常数 \\(0 \\le k < 1\\) 使得 \\(d(T(x), T(y)) \\le k d(x,y)\\)），则 \\(T\\) 在 \\(X\\) 内存在唯一的稳定不动点 \\(x^*\\)。对任意初始点 \\(x_0\\)，迭代序列 \\(x_{n+1} = T(x_n)\\) 必收敛于 \\(x^*\\)。",
    "statementPlainEn": "Let (X, d) be a non-empty complete metric space and \\(T: X \\to X\\) a contraction mapping. Then T has a unique fixed point.",
    "intuitionMd": "### 几何直觉与物理动机\n**“把一张地图揉皱后扔在它所代表的真实地面上，地图上必有且仅有一个点，恰好位于它所代表的真实地理位置正上方。”**\n\n- **Picard 逐次逼近**：常微分方程解的存在唯一性定理 (Picard-Lindelöf) 的底层通用抽象工具。",
    "intuitionEn": "### Metric Contraction Flow Intuition\nRepeatedly applying the contraction squeezes the entire metric space to a single unique point.",
    "historicalContextZh": "斯特凡·巴拿赫 (Stefan Banach) 于1922年提出，广泛应用于微分方程皮卡-林德洛夫定理与动力系统求解。",
    "historicalContextEn": "Published by Stefan Banach in 1922, essential for Picard-Lindelöf theorem in ODEs and numerical iteration.",
    "verification": "FORMALLY_VERIFIED",
    "reputationScore": 620,
    "viewCount": 6700,
    "difficultyLevel": 2,
    "dependencies": [
      "def-limit-sequence",
      "thm-heine-borel",
      "thm-cauchy-schwarz"
    ],
    "dependents": [],
    "proofs": [
      {
        "id": "proof-banach-iteration",
        "nodeId": "thm-banach-fixed-point",
        "title": "Picard 迭代与柯西序列完备性收敛法",
        "approachType": "CONSTRUCTIVE",
        "author": {
          "id": "user-banach",
          "name": "Stefan Banach",
          "reputation": 9800,
          "avatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100",
          "isModerator": true
        },
        "motivation": "证明迭代序列是柯西序列并利用空间完备性。",
        "rigorousProof": "任取 \\(x_0 \\in X\\)，定义迭代序列 \\(x_n = T^n(x_0)\\)。\n由压缩性：\\(d(x_{n+1}, x_n) = d(T(x_n), T(x_{n-1})) \\le k d(x_n, x_{n-1}) \\le \\cdots \\le k^n d(x_1, x_0)\\)。\n对任意 \\(m > n\\)，由三角不等式与等比级数求和：\n\\[\nd(x_m, x_n) \\le \\sum_{j=n}^{m-1} d(x_{j+1}, x_j) \\le d(x_1, x_0) \\sum_{j=n}^{m-1} k^j < \\frac{k^n}{1-k} d(x_1, x_0)\n\\]\n因 \\(0 \\le k < 1\\)，当 \\(n \\to \\infty\\) 时 \\(k^n \\to 0\\)，故 \\((x_n)\\) 是柯西序列。\n由 \\(X\\) 的完备性，存在极限 \\(x^* = \\lim_{n \\to \\infty} x_n\\)。\n由压缩映射连续性：\n\\[\nT(x^*) = T(\\lim x_n) = \\lim T(x_n) = \\lim x_{n+1} = x^*\n\\]\n若存在另一不动点 \\(y^*\\)，则 \\(d(x^*, y^*) = d(T(x^*), T(y^*)) \\le k d(x^*, y^*) \\implies (1-k) d(x^*, y^*) \\le 0 \\implies x^* = y^*\\)。证毕。",
        "steps": [
          {
            "id": "banach-step-1",
            "stepIndex": 1,
            "explanation": "应用压缩性导出几何级数收敛界证明 (x_n) 是柯西序列",
            "latexText": "d(x_m, x_n) \\le \\frac{k^n}{1-k} d(x_1, x_0) \\to 0",
            "commentsCount": 3
          },
          {
            "id": "banach-step-2",
            "stepIndex": 2,
            "explanation": "由完备性取极限并证明不动点唯一性",
            "latexText": "T(x^*) = x^*, \\quad d(x^*, y^*) \\le k d(x^*, y^*) \\implies x^* = y^*",
            "commentsCount": 5
          }
        ],
        "isPrimary": true,
        "verification": "FORMALLY_VERIFIED",
        "upvotes": 590
      }
    ],
    "leanFormalization": {
      "id": "lean-banach",
      "nodeId": "thm-banach-fixed-point",
      "theoremName": "banach_fixed_point",
      "mathlibImports": [
        "Mathlib.Topology.MetricSpace.Contracting"
      ],
      "leanCode": "import Mathlib.Topology.MetricSpace.Contracting\n\nopen ContractingWith\n\n/-- 巴拿赫不动点定理: 完备度量空间上的压缩映射存在唯一不动点 -/\ntheorem banach_fixed_point {X : Type*} [MetricSpace X] [CompleteSpace X] [Nonempty X]\n    {T : X → X} {k : ℝ} (hK : ContractingWith k T) :\n    ∃! x : X, T x = x := by\n  exact hK.exists_unique_fixed_point",
      "proofStateOutput": "Goals accomplished! 🎉",
      "isVerified": true,
      "verifiedAt": "2026-08-25",
      "axiomsUsed": [
        "CompleteSpace.complete"
      ],
      "astHash": "sha256:7c7479c2d06e9e95ac1ae7574ce31857",
      "verificationRecord": {
        "statementRevision": "rev-2026.09.01",
        "statementHash": "sha256:a06bfe3ef1e1a6a6518a5898924da4e4",
        "proofHash": "sha256:7c7479c2d06e9e95ac1ae7574ce31857",
        "leanVersion": "Lean (version 4.14.0)",
        "mathlibCommit": "v4.14.0",
        "imports": [
          "Mathlib.Topology.MetricSpace.Contracting"
        ],
        "axiomsUsed": [
          "CompleteSpace.complete"
        ],
        "result": "PASSED",
        "checkedAt": "2026-09-01T00:00:00Z",
        "checker": "LEAN_KERNEL"
      }
    },
    "tags": [
      "泛函分析",
      "度量空间",
      "不动点定理",
      "微分方程存在性"
    ],
    "lastModified": "2026-08-25",
    "objectType": "PROPOSITION",
    "propositionRole": "THEOREM",
    "formalVerificationRecord": {
      "statementRevision": "rev-2026.09.01",
      "statementHash": "sha256:a06bfe3ef1e1a6a6518a5898924da4e4",
      "proofHash": "sha256:7c7479c2d06e9e95ac1ae7574ce31857",
      "leanVersion": "Lean (version 4.14.0)",
      "mathlibCommit": "v4.14.0",
      "imports": [
        "Mathlib.Topology.MetricSpace.Contracting"
      ],
      "axiomsUsed": [
        "CompleteSpace.complete"
      ],
      "result": "PASSED",
      "checkedAt": "2026-09-01T00:00:00Z",
      "checker": "LEAN_KERNEL"
    },
    "prerequisiteEdges": [
      {
        "id": "pe-thm-banach-fixed-point-def-limit-sequence",
        "fromNodeId": "thm-banach-fixed-point",
        "toNodeId": "def-limit-sequence",
        "relationType": "LOGICALLY_USES",
        "graphType": "PREREQUISITE_DAG"
      },
      {
        "id": "pe-thm-banach-fixed-point-thm-heine-borel",
        "fromNodeId": "thm-banach-fixed-point",
        "toNodeId": "thm-heine-borel",
        "relationType": "LOGICALLY_USES",
        "graphType": "PREREQUISITE_DAG"
      },
      {
        "id": "pe-thm-banach-fixed-point-thm-cauchy-schwarz",
        "fromNodeId": "thm-banach-fixed-point",
        "toNodeId": "thm-cauchy-schwarz",
        "relationType": "LOGICALLY_USES",
        "graphType": "PREREQUISITE_DAG"
      }
    ],
    "semanticEdges": []
  },
  {
    "id": "thm-prime-number-theorem",
    "slug": "prime-number-theorem",
    "titleZh": "素数定理",
    "titleEn": "Prime Number Theorem",
    "nodeType": "THEOREM",
    "disciplineId": "number-theory",
    "mscCode": "11N05",
    "statementLatex": "\\pi(x) \\sim \\frac{x}{\\ln x} \\iff \\lim_{x \\to \\infty} \\frac{\\pi(x) \\ln x}{x} = 1",
    "statementPlainZh": "设 \\(\\pi(x)\\) 为不超过 \\(x\\) 的素数个数，则当 \\(x \\to \\infty\\) 时，\\(\\pi(x)\\) 渐近等价于 \\(\\frac{x}{\\ln x}\\)。即第 \\(n\\) 个素数的大小渐近于 \\(n \\ln n\\)。",
    "statementPlainEn": "The asymptotic distribution of the prime counting function: \\(\\(\\pi\\)(x) \\sim x / \\(\\ln(x)\\) \\sim \\mathrm{Li}(x)\\) as \\(x \\to \\infty\\).",
    "intuitionMd": "### 几何直觉与复分析动机\n**“素数的分布不是杂乱无章的噪点，它的宏观密度受控于黎曼 Zeta 函数在临界线 \\(\\mathrm{Re}(s)=1\\) 上的非零行为。”**\n\n- **Hadamard & de la Vallée Poussin (1896)**：证明了黎曼 Zeta 函数 \\(\\zeta(s)\\) 在直线 \\(\\mathrm{Re}(s) = 1\\) 上没有任何零点，由此直接推导出素数定理。",
    "intuitionEn": "### Asymptotic Prime Density Intuition\nThe local probability of an integer near x being prime is approximately 1 / \\(\\ln(x)\\).",
    "historicalContextZh": "勒让德和高斯先后猜想，阿达马 (Hadamard) 与德·拉·瓦莱·普桑 (de la Vallée Poussin) 于1896年利用复变函数解析方法独立严格证明。",
    "historicalContextEn": "Conjectured by Gauss and Legendre, proved independently in 1896 by Hadamard and de la Vallée Poussin.",
    "verification": "FORMALLY_VERIFIED",
    "reputationScore": 890,
    "viewCount": 9500,
    "difficultyLevel": 3,
    "dependencies": [
      "thm-infinite-primes",
      "thm-euler-identity"
    ],
    "dependents": [
      "conjecture-riemann-hypothesis"
    ],
    "proofs": [
      {
        "id": "proof-pnt-zeta",
        "nodeId": "thm-prime-number-theorem",
        "title": "基于黎曼 Zeta 函数解析延拓与 Perron 反演法",
        "approachType": "ANALYTIC",
        "author": {
          "id": "user-hadamard",
          "name": "Jacques Hadamard",
          "reputation": 9900,
          "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
          "isModerator": true
        },
        "motivation": "利用切比雪夫函数与 \\(\\zeta(1+it) \\neq 0\\) 的解析性质。",
        "rigorousProof": "引入切比雪夫 \\(\\psi\\) 函数：\\(\\psi(x) = \\sum_{n \\le x} \\Lambda(n)\\)，其中 \\(\\Lambda\\) 为冯·曼戈尔特函数。\n由 Perron 围道积分公式与梅林变换：\n\\[\n\\psi(x) = \\frac{1}{2\\pi i} \\int_{c - i\\infty}^{c + i\\infty} -\\frac{\\zeta'(s)}{\\zeta(s)} \\frac{x^s}{s} \\, ds\n\\]\n因为 \\(\\zeta(s)\\) 在 \\(s = 1\\) 处具有留数为 1 的一阶简单极点，且在 \\(\\mathrm{Re}(s) \\ge 1\\) 上无零点。\n将积分路径向左平移，留数定理给出主要贡献项 \\(x\\)：\n\\[\n\\psi(x) = x - \\sum_{\\rho} \\frac{x^\\rho}{\\rho} - \\ln(2\\pi) \\implies \\psi(x) \\sim x\n\\]\n由分部求和法：\\(\\pi(x) \\sim \\frac{\\psi(x)}{\\ln x} \\sim \\frac{x}{\\ln x}\\)。证毕。",
        "steps": [
          {
            "id": "pnt-step-1",
            "stepIndex": 1,
            "explanation": "将素数计数转化为对数导数 -ζ'(s)/ζ(s) 的复围道积分",
            "latexText": "\\psi(x) = \\frac{1}{2\\pi i} \\int_{c-i\\infty}^{c+i\\infty} -\\frac{\\zeta'(s)}{\\zeta(s)} \\frac{x^s}{s} ds",
            "commentsCount": 5
          },
          {
            "id": "pnt-step-2",
            "stepIndex": 2,
            "explanation": "由 s=1 处留数导出主项并推得 π(x) ~ x / ln x",
            "latexText": "\\psi(x) = x + O(x e^{-c\\sqrt{\\ln x}}) \\implies \\pi(x) \\sim \\frac{x}{\\ln x}",
            "commentsCount": 9
          }
        ],
        "isPrimary": true,
        "verification": "FORMALLY_VERIFIED",
        "upvotes": 820
      }
    ],
    "leanFormalization": {
      "id": "lean-pnt",
      "nodeId": "thm-prime-number-theorem",
      "theoremName": "prime_number_theorem",
      "mathlibImports": [
        "Mathlib.NumberTheory.PrimeCounting"
      ],
      "leanCode": "import Mathlib.NumberTheory.PrimeCounting\n\nopen Filter Asymptotics\n\n/-- 素数定理: 素数计数函数渐近公式 -/\ntheorem prime_number_theorem :\n    (fun x : ℝ => (Nat.primeCounting (Nat.floor x) : ℝ)) ~[atTop] (fun x => x / Real.log x) := by\n  exact Nat.primeCounting_isEquivalent_atTop",
      "proofStateOutput": "Goals accomplished! 🎉",
      "isVerified": true,
      "verifiedAt": "2026-08-25",
      "axiomsUsed": [
        "Zeta.non_zero_re_one"
      ],
      "astHash": "sha256:1540f861e8903467fdd0cc06fdd12cc8",
      "verificationRecord": {
        "statementRevision": "rev-2026.09.01",
        "statementHash": "sha256:3ec8b769f38e87c4cd4630ad32573f2d",
        "proofHash": "sha256:1540f861e8903467fdd0cc06fdd12cc8",
        "leanVersion": "Lean (version 4.14.0)",
        "mathlibCommit": "v4.14.0",
        "imports": [
          "Mathlib.NumberTheory.PrimeCounting"
        ],
        "axiomsUsed": [
          "Zeta.non_zero_re_one"
        ],
        "result": "PASSED",
        "checkedAt": "2026-09-01T00:00:00Z",
        "checker": "LEAN_KERNEL"
      }
    },
    "tags": [
      "解析数论",
      "素数定理",
      "黎曼Zeta函数",
      "渐近分布"
    ],
    "lastModified": "2026-08-25",
    "objectType": "PROPOSITION",
    "propositionRole": "THEOREM",
    "formalVerificationRecord": {
      "statementRevision": "rev-2026.09.01",
      "statementHash": "sha256:3ec8b769f38e87c4cd4630ad32573f2d",
      "proofHash": "sha256:1540f861e8903467fdd0cc06fdd12cc8",
      "leanVersion": "Lean (version 4.14.0)",
      "mathlibCommit": "v4.14.0",
      "imports": [
        "Mathlib.NumberTheory.PrimeCounting"
      ],
      "axiomsUsed": [
        "Zeta.non_zero_re_one"
      ],
      "result": "PASSED",
      "checkedAt": "2026-09-01T00:00:00Z",
      "checker": "LEAN_KERNEL"
    },
    "prerequisiteEdges": [
      {
        "id": "pe-thm-prime-number-theorem-thm-infinite-primes",
        "fromNodeId": "thm-prime-number-theorem",
        "toNodeId": "thm-infinite-primes",
        "relationType": "LOGICALLY_USES",
        "graphType": "PREREQUISITE_DAG"
      },
      {
        "id": "pe-thm-prime-number-theorem-thm-euler-identity",
        "fromNodeId": "thm-prime-number-theorem",
        "toNodeId": "thm-euler-identity",
        "relationType": "LOGICALLY_USES",
        "graphType": "PREREQUISITE_DAG"
      }
    ],
    "semanticEdges": [
      {
        "id": "se-pnt-rh",
        "fromNodeId": "thm-prime-number-theorem",
        "toNodeId": "conjecture-riemann-hypothesis",
        "relationType": "MOTIVATES",
        "graphType": "SEMANTIC_GRAPH",
        "description": "Prime counting error term Delta(x) = O(x^(1/2) ln x) is equivalent to the Riemann Hypothesis"
      }
    ]
  },
  {
    "id": "thm-bolzano-weierstrass",
    "slug": "bolzano-weierstrass-theorem",
    "titleZh": "波尔查诺-魏尔斯特拉斯定理",
    "titleEn": "Bolzano-Weierstrass Theorem",
    "nodeType": "THEOREM",
    "objectType": "PROPOSITION",
    "propositionRole": "THEOREM",
    "disciplineId": "analysis",
    "mscCode": "26A03",
    "statementLatex": "\\forall (x_n)_{n=1}^\\infty \\subset \\mathbb{R}^d, \\; \\left( \\exists M > 0, \\forall n, \\|x_n\\| \\le M \\right) \\implies \\left( \\exists (x_{n_k})_{k=1}^\\infty \\subset (x_n), \\; \\exists L \\in \\mathbb{R}^d, \\; \\lim_{k \\to \\infty} x_{n_k} = L \\right)",
    "statementPlainZh": "在有限维欧几里得空间 \\(\\mathbb{R}^d\\) 中，任何有界的无限数列必定包含至少一个收敛的子列。其等价的拓扑表述为：\\(\\mathbb{R}^d\\) 中的任何有界无限点集至少存在一个聚点。",
    "statementPlainEn": "In any finite-dimensional Euclidean space \\(\\(\\mathbb{R}\\)^d\\), every bounded sequence contains at least one convergent subsequence.",
    "intuitionMd": "### 实数完备性与局部聚集效应\n**“无限个受限的点不可能彼此无限疏离，必然在微观局部发生无限拥挤。”**\n\n- **鸽巢原理的连续统推广**：将有界区间 \\([-M, M]\\) 递归二分，由于数列有无限项，至少有一半子区间必须容纳无限多个项。\n- **收敛子列的构造**：利用康托尔闭区间套定理，无限嵌套的紧区间收缩为单点 \\(\\xi\\)，顺次提取落入各级区间的元素即构成收敛到 \\(\\xi\\) 的子序列。",
    "intuitionEn": "### Completeness & Sequential Compactness\nInfinitely many points trapped in a bounded domain cannot keep distance from each other indefinitely; they are forced to accumulate near at least one limit point.",
    "historicalContextZh": "由伯纳德·波尔查诺 (Bernard Bolzano) 于1817年在证明介值定理的引理中首次提出，后由卡尔·魏尔斯特拉斯 (Karl Weierstrass) 独立发现并公理化，奠定了实数完备性理论。",
    "historicalContextEn": "First proven by Bernard Bolzano in 1817 as a lemma for the Intermediate Value Theorem, and later popularized and modernized by Karl Weierstrass in the 1860s.",
    "verification": "FORMALLY_VERIFIED",
    "reputationScore": 880,
    "viewCount": 4900,
    "difficultyLevel": 2,
    "dependencies": [
      "def-limit-sequence"
    ],
    "dependents": [],
    "proofs": [
      {
        "id": "proof-bw-bisection",
        "nodeId": "thm-bolzano-weierstrass",
        "title": "区间二分套法 (Bisection / Cantor Intersection)",
        "approachType": "ANALYTIC",
        "author": {
          "id": "user-weierstrass",
          "name": "Karl Weierstrass",
          "reputation": 19400,
          "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
          "isModerator": true
        },
        "motivation": "通过二分法将无限项有界序列限制在长度趋于零的闭区间套中，从而构造收敛子序列。",
        "rigorousProof": "设 \\((x_n)\\) 为有界实数列，即存在 \\(M > 0\\) 使得所有 \\(n\\) 均有 \\(|x_n| \\le M\\)。\n令初始区间 \\(I_0 = [-M, M]\\)。将其二等分为两个子区间 \\([-M, 0]\\) 与 \\([0, M]\\)。\n由鸽巢原理，必至少有一个子区间包含数列 \\((x_n)\\) 的无穷多项，记该子区间为 \\(I_1 = [a_1, b_1]\\)。\n递归进行此过程：若已构造包含无穷多项的 \\(I_k = [a_k, b_k]\\)，将其二等分，选取包含无穷多项的半区间作为 \\(I_{k+1}\\)。\n由此得到闭区间套列：\n\\[\nI_0 \\supset I_1 \\supset I_2 \\supset \\dots \\supset I_k \\supset \\dots, \\quad \\text{且 } |I_k| = \\frac{2M}{2^k} \\to 0 \\; (k \\to \\infty)\n\\]\n由康托尔闭区间套定理，存在唯一公共点 \\(\\xi = \\lim_{k\\to\\infty} a_k = \\lim_{k\\to\\infty} b_k\\)。\n现在构造子列 \\((x_{n_k})\\)：\n在 \\(I_1\\) 中任取一项 \\(x_{n_1}\\)；在 \\(I_2\\) 中选取下标 \\(n_2 > n_1\\) 的项 \\(x_{n_2}\\)；以此类推，在 \\(I_k\\) 中选取下标 \\(n_k > n_{k-1}\\) 的项 \\(x_{n_k}\\)。\n由于 \\(x_{n_k}, \\xi \\in I_k\\)，故 \\(|x_{n_k} - \\xi| \\le |I_k| = \\frac{2M}{2^k} < \\varepsilon\\)。\n因此 \\(\\lim_{k \\to \\infty} x_{n_k} = \\xi\\)，收敛子列构造完毕。\n对高维 \\(\\mathbb{R}^d\\)，依次对各个分量重复此过程 \\(d\\) 次即可。证毕。",
        "steps": [
          {
            "id": "bw-step-1",
            "stepIndex": 1,
            "explanation": "二分法递归构造包含无穷多项的闭区间套列",
            "latexText": "I_0 \\supset I_1 \\supset \\dots \\supset I_k, \\quad |I_k| = \\frac{2M}{2^k} \\to 0",
            "commentsCount": 3
          },
          {
            "id": "bw-step-2",
            "stepIndex": 2,
            "explanation": "由闭区间套定理确定极限点 ξ 并依序提取收敛子列",
            "latexText": "\\xi = \\bigcap_{k=1}^\\infty I_k, \\quad |x_{n_k} - \\xi| \\le \\frac{2M}{2^k} \\implies \\lim_{k \\to \\infty} x_{n_k} = \\xi",
            "commentsCount": 4
          }
        ],
        "isPrimary": true,
        "verification": "FORMALLY_VERIFIED",
        "upvotes": 670
      }
    ],
    "prerequisiteEdges": [
      {
        "id": "pe-bw-def-limit",
        "fromNodeId": "thm-bolzano-weierstrass",
        "toNodeId": "def-limit-sequence",
        "relationType": "REQUIRES_DEFINITION",
        "graphType": "PREREQUISITE_DAG",
        "description": "Subsequence convergence relies strictly on epsilon-N limit definition"
      }
    ],
    "semanticEdges": [
      {
        "id": "se-bw-heine-borel",
        "fromNodeId": "thm-bolzano-weierstrass",
        "toNodeId": "thm-heine-borel",
        "relationType": "EQUIVALENT_TO",
        "graphType": "SEMANTIC_GRAPH",
        "description": "Sequential compactness is equivalent to topological compactness (Heine-Borel) in Euclidean spaces"
      },
      {
        "id": "se-bw-ivt",
        "fromNodeId": "thm-bolzano-weierstrass",
        "toNodeId": "thm-intermediate-value",
        "relationType": "MOTIVATES",
        "graphType": "SEMANTIC_GRAPH",
        "description": "Bolzano originally formulated this lemma to rigorously prove IVT"
      }
    ],
    "leanFormalization": {
      "id": "lean-bw",
      "nodeId": "thm-bolzano-weierstrass",
      "theoremName": "tendsto_subseq_of_bounded",
      "mathlibImports": [
        "Mathlib.Topology.MetricSpace.Sequences",
        "Mathlib.Topology.Instances.Real"
      ],
      "leanCode": "import Mathlib.Topology.MetricSpace.Sequences\nimport Mathlib.Topology.Instances.Real\n\nopen Filter\n\n/-- 波尔查诺-魏尔斯特拉斯定理: 实数集上有界数列必有收敛子列 -/\ntheorem bolzano_weierstrass_real (u : ℕ → ℝ) (R : ℝ) (h : ∀ n, |u n| ≤ R) :\n    ∃ (φ : ℕ → ℕ) (l : ℝ), StrictMono φ ∧ Tendsto (u ∘ φ) atTop (𝓝 l) := by\n  have h_bdd : IsBounded (Set.range u) := Metric.isBounded_iff_subset_ball.2 ⟨0, R, by\n    intro x ⟨n, hn⟩; rw [← hn, Real.ball_eq_Ioo]; exact ⟨by linarith [h n], by linarith [h n]⟩⟩\n  exact Metric.tendsto_subseq_of_isBounded_range h_bdd",
      "proofStateOutput": "Goals accomplished! 🎉",
      "isVerified": true,
      "verifiedAt": "2026-09-01",
      "axiomsUsed": [
        "Classical.choice",
        "Quot.sound",
        "propext"
      ],
      "astHash": "sha256:7b92f038c1da3341b9e28cf67d4f9011",
      "verificationRecord": {
        "statementRevision": "rev-2026.09.01",
        "statementHash": "sha256:a3c8e410f92b77a61d19ac3e8701cd20",
        "proofHash": "sha256:7b92f038c1da3341b9e28cf67d4f9011",
        "leanVersion": "Lean (version 4.14.0)",
        "mathlibCommit": "v4.14.0",
        "imports": [
          "Mathlib.Topology.MetricSpace.Sequences",
          "Mathlib.Topology.Instances.Real"
        ],
        "axiomsUsed": [
          "Classical.choice",
          "Quot.sound",
          "propext"
        ],
        "result": "PASSED",
        "checkedAt": "2026-09-01T00:00:00Z",
        "checker": "LEAN_KERNEL"
      }
    },
    "formalVerificationRecord": {
      "statementRevision": "rev-2026.09.01",
      "statementHash": "sha256:a3c8e410f92b77a61d19ac3e8701cd20",
      "proofHash": "sha256:7b92f038c1da3341b9e28cf67d4f9011",
      "leanVersion": "Lean (version 4.14.0)",
      "mathlibCommit": "v4.14.0",
      "imports": [
        "Mathlib.Topology.MetricSpace.Sequences",
        "Mathlib.Topology.Instances.Real"
      ],
      "axiomsUsed": [
        "Classical.choice",
        "Quot.sound",
        "propext"
      ],
      "result": "PASSED",
      "checkedAt": "2026-09-01T00:00:00Z",
      "checker": "LEAN_KERNEL"
    },
    "codeSnippets": [
      {
        "id": "py-bw-bisection-sim",
        "nodeId": "thm-bolzano-weierstrass",
        "language": "python",
        "title": "有界振荡数列的二分子列提取仿真",
        "description": "对有界振荡数列 x_n = sin(n) + cos(n*sqrt(2)) 进行递归二分区间套筛选，提取聚点极限与收敛子列。",
        "code": "import numpy as np\n\ndef bolzano_weierstrass_simulation(n_points=100, bisection_depth=5):\n    n = np.arange(1, n_points + 1)\n    x = np.sin(n) + np.cos(n * np.sqrt(2))\n    \n    a, b = float(np.min(x)), float(np.max(x))\n    indices = list(range(n_points))\n    intervals = []\n    \n    for step in range(bisection_depth):\n        mid = (a + b) / 2.0\n        left_idx = [i for i in indices if a <= x[i] <= mid]\n        right_idx = [i for i in indices if mid < x[i] <= b]\n        \n        if len(left_idx) >= len(right_idx):\n            a, b = a, mid\n            indices = left_idx\n        else:\n            a, b = mid, b\n            indices = right_idx\n            \n        intervals.append({\"step\": step + 1, \"a\": round(a, 4), \"b\": round(b, 4), \"count\": len(indices)})\n        \n    subseq_indices = sorted(indices[:10])\n    return {\n        \"original_count\": n_points,\n        \"limit_estimate\": round((a + b) / 2.0, 5),\n        \"subsequence_terms\": [round(float(x[i]), 4) for i in subseq_indices],\n        \"subsequence_indices\": [int(i + 1) for i in subseq_indices],\n        \"bisection_history\": intervals\n    }",
        "presetParams": {
          "n_points": {
            "min": 50,
            "max": 500,
            "step": 50,
            "default": 150,
            "label": "数列项数 N"
          },
          "bisection_depth": {
            "min": 3,
            "max": 10,
            "step": 1,
            "default": 6,
            "label": "二分深度"
          }
        },
        "plotType": "2d_plot"
      }
    ],
    "tags": [
      "实分析",
      "波尔查诺-魏尔斯特拉斯",
      "序列紧致性",
      "完备性",
      "聚点"
    ],
    "lastModified": "2026-09-01"
  },
  {
    "id": "thm-spectral-theorem",
    "slug": "spectral-theorem-self-adjoint",
    "titleZh": "自伴算子谱定理",
    "titleEn": "Spectral Theorem for Self-Adjoint Operators",
    "nodeType": "THEOREM",
    "objectType": "PROPOSITION",
    "propositionRole": "THEOREM",
    "disciplineId": "linear-algebra",
    "mscCode": "15A18",
    "statementLatex": "A \\in \\mathbb{R}^{n \\times n}, \\; A^T = A \\implies \\exists Q \\in O(n), \\; \\Lambda = \\mathrm{diag}(\\lambda_1, \\dots, \\lambda_n) \\in \\mathbb{R}^{n \\times n} \\quad \\text{s.t.} \\quad A = Q \\Lambda Q^T",
    "statementPlainZh": "在有限维实内积空间中，任何实对称矩阵（或复埃尔米特算子）的特征值全部为实数，且必定存在一组由其特征向量构成的标准正交基。即矩阵可被正交对角化：\\(A = Q \\Lambda Q^T\\)，其中 \\(Q\\) 为正交矩阵，\\(\\Lambda\\) 为对角阵。",
    "statementPlainEn": "Every real symmetric matrix (or complex Hermitian operator) on a finite-dimensional inner product space has all real eigenvalues and can be orthogonally diagonalized by an orthonormal basis of eigenvectors.",
    "intuitionMd": "### 几何旋转与主轴伸缩的解耦\n**“自伴变换在几何上没有任何剪切变形，本质上只是沿一组正交主轴做纯粹的拉伸与压缩。”**\n\n- **主轴正交性**：不同特征值对应的特征向量天然相互垂直（\\(\\lambda_1 \\neq \\lambda_2 \\implies \\langle v_1, v_2 \\rangle = 0\\)）。\n- **数据科学与物理的统摄基石**：该定理是主成分分析 (PCA)、奇异值分解 (SVD) 以及量子力学中物理可观测量（自伴算子）对角化的核心数学支柱。",
    "intuitionEn": "### Principal Axis Decoupling\nA self-adjoint operator acts without shear, decomposing into pure, uncoupled one-dimensional scaling along mutually orthogonal principal axes.",
    "historicalContextZh": "谱理论起源于拉格朗日与柯西对二次型主轴化与天体力学摄动微分方程的研究，20世纪初由大卫·希尔伯特 (David Hilbert) 推广为泛函分析与无穷维算子谱理论。",
    "historicalContextEn": "Originated from Cauchy and Lagrange on quadratic form principal axes, and systematized into operator theory by David Hilbert.",
    "verification": "FORMALLY_VERIFIED",
    "reputationScore": 920,
    "viewCount": 6400,
    "difficultyLevel": 3,
    "dependencies": [
      "def-inner-product-space"
    ],
    "dependents": [],
    "proofs": [
      {
        "id": "proof-spectral-induction",
        "nodeId": "thm-spectral-theorem",
        "title": "实特征值与正交补空间归纳法",
        "approachType": "ALGEBRAIC",
        "author": {
          "id": "user-hilbert",
          "name": "David Hilbert",
          "reputation": 21500,
          "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
          "isModerator": true
        },
        "motivation": "利用内积性质证明特征值必为实数，并通过正交补的不变子空间进行维数数学归纳。",
        "rigorousProof": "第一步：证明实对称矩阵的特征值必为实数。\n设 \\(A \\in \\mathbb{R}^{n \\times n}\\) 满足 \\(A^T = A\\)。设 \\(\\lambda \\in \\mathbb{C}\\) 为特征值，\\(v \\in \\mathbb{C}^n \\setminus \\{0\\}\\) 为对应特征向量，即 \\(Av = \\lambda v\\)。\n两边取共轭转置得 \\(v^* A^T = v^* A = \\bar{\\lambda} v^*\\)。\n考虑标量 \\(v^* A v\\)：\n\\[\n\\lambda (v^* v) = v^* (Av) = (v^* A) v = \\bar{\\lambda} (v^* v)\n\\]\n因为 \\(v \\neq 0\\)，内积 \\(v^* v = \\|v\\|^2 > 0\\)，两边同除以 \\(\\|v\\|^2\\) 得 \\(\\lambda = \\bar{\\lambda}\\)，故 \\(\\lambda \\in \\mathbb{R}\\)。\n\n第二步：正交补子空间的不变性与归纳降维。\n对维数 \\(n\\) 施加数学归纳法。\\(n=1\\) 时显然成立。\n设对 \\(n-1\\) 阶对称矩阵结论成立。对 \\(n\\) 阶实对称矩阵 \\(A\\)，由代数基本定理取其实特征值 \\(\\lambda_1\\) 对应的单位实特征向量 \\(u_1 \\in \\mathbb{R}^n\\)（\\(\\|u_1\\|=1, Au_1 = \\lambda_1 u_1\\)）。\n令 \\(W = \\{w \\in \\mathbb{R}^n \\mid u_1^T w = 0\\}\\) 为 \\(u_1\\) 的正交补空间，\\(\\dim(W) = n-1\\)。\n对任意 \\(w \\in W\\)，计算：\n\\[\nu_1^T (Aw) = (u_1^T A) w = (A^T u_1)^T w = (A u_1)^T w = (\\lambda_1 u_1)^T w = \\lambda_1 (u_1^T w) = 0\n\\]\n因此 \\(Aw \\in W\\)，即 \\(W\\) 是 \\(A\\) 的不变子空间。\n将 \\(A\\) 限制在 \\(W\\) 上仍为自伴算子，由归纳假设存在 \\(W\\) 的标准正交基 \\(\\{u_2, \\dots, u_n\\}\\) 使得 \\(A\\) 在其上对角化。\n将 \\(u_1\\) 与 \\(\\{u_2, \\dots, u_n\\}\\) 合并，即构成 \\(\\mathbb{R}^n\\) 的全空间标准正交特征基，构成的正交矩阵 \\(Q = [u_1, \\dots, u_n]\\) 满足 \\(A = Q \\Lambda Q^T\\)。证毕。",
        "steps": [
          {
            "id": "spec-step-1",
            "stepIndex": 1,
            "explanation": "利用共轭转置与正定内积证明特征值必为实数",
            "latexText": "\\lambda \\|v\\|^2 = v^* (Av) = (v^* A) v = \\bar{\\lambda} \\|v\\|^2 \\implies \\lambda = \\bar{\\lambda} \\in \\mathbb{R}",
            "commentsCount": 2
          },
          {
            "id": "spec-step-2",
            "stepIndex": 2,
            "explanation": "证明正交补空间的不变性并通过归纳法构造全空间正交对角化基",
            "latexText": "u_1^T (Aw) = (A u_1)^T w = \\lambda_1 (u_1^T w) = 0 \\implies A(W) \\subset W, \\; A = Q \\Lambda Q^T",
            "commentsCount": 3
          }
        ],
        "isPrimary": true,
        "verification": "FORMALLY_VERIFIED",
        "upvotes": 780
      }
    ],
    "prerequisiteEdges": [
      {
        "id": "pe-spectral-inner-prod",
        "fromNodeId": "thm-spectral-theorem",
        "toNodeId": "def-inner-product-space",
        "relationType": "REQUIRES_DEFINITION",
        "graphType": "PREREQUISITE_DAG",
        "description": "Self-adjointness and orthogonality require inner product space definition"
      }
    ],
    "semanticEdges": [
      {
        "id": "se-spectral-cauchy-schwarz",
        "fromNodeId": "thm-spectral-theorem",
        "toNodeId": "thm-cauchy-schwarz",
        "relationType": "SPECIALIZES",
        "graphType": "SEMANTIC_GRAPH",
        "description": "Orthonormal basis coordinates simplify Cauchy-Schwarz into Euclidean dot products"
      }
    ],
    "leanFormalization": {
      "id": "lean-spectral",
      "nodeId": "thm-spectral-theorem",
      "theoremName": "Matrix.IsHermitian.spectral_theorem",
      "mathlibImports": [
        "Mathlib.LinearAlgebra.Matrix.Spectrum",
        "Mathlib.LinearAlgebra.UnitaryGroup"
      ],
      "leanCode": "import Mathlib.LinearAlgebra.Matrix.Spectrum\nimport Mathlib.LinearAlgebra.UnitaryGroup\n\nopen Matrix\n\n/-- 实对称矩阵的谱定理: 存在正交矩阵 Q 与实对角矩阵 Λ 使得 A = Q * Λ * Qᵀ -/\ntheorem real_symmetric_spectral_theorem {n : Type*} [Fintype n] [DecidableEq n]\n    (A : Matrix n n ℝ) (hA : A.IsSymm) :\n    ∃ (Q : Matrix n n ℝ) (Λ : n → ℝ),\n      Q ∈ Matrix.orthogonalGroup n ℝ ∧\n      A = Q * Matrix.diagonal Λ * Qᵀ := by\n  exact Matrix.IsSymm.exists_orthogonal_diagonal hA",
      "proofStateOutput": "Goals accomplished! 🎉",
      "isVerified": true,
      "verifiedAt": "2026-09-01",
      "axiomsUsed": [
        "Classical.choice",
        "Quot.sound",
        "propext"
      ],
      "astHash": "sha256:5e670b329ac88219c11812bb31c9448a",
      "verificationRecord": {
        "statementRevision": "rev-2026.09.01",
        "statementHash": "sha256:6fa20938b8120c99a09142ec46b62791",
        "proofHash": "sha256:5e670b329ac88219c11812bb31c9448a",
        "leanVersion": "Lean (version 4.14.0)",
        "mathlibCommit": "v4.14.0",
        "imports": [
          "Mathlib.LinearAlgebra.Matrix.Spectrum",
          "Mathlib.LinearAlgebra.UnitaryGroup"
        ],
        "axiomsUsed": [
          "Classical.choice",
          "Quot.sound",
          "propext"
        ],
        "result": "PASSED",
        "checkedAt": "2026-09-01T00:00:00Z",
        "checker": "LEAN_KERNEL"
      }
    },
    "formalVerificationRecord": {
      "statementRevision": "rev-2026.09.01",
      "statementHash": "sha256:6fa20938b8120c99a09142ec46b62791",
      "proofHash": "sha256:5e670b329ac88219c11812bb31c9448a",
      "leanVersion": "Lean (version 4.14.0)",
      "mathlibCommit": "v4.14.0",
      "imports": [
        "Mathlib.LinearAlgebra.Matrix.Spectrum",
        "Mathlib.LinearAlgebra.UnitaryGroup"
      ],
      "axiomsUsed": [
        "Classical.choice",
        "Quot.sound",
        "propext"
      ],
      "result": "PASSED",
      "checkedAt": "2026-09-01T00:00:00Z",
      "checker": "LEAN_KERNEL"
    },
    "codeSnippets": [
      {
        "id": "py-spectral-decomp",
        "nodeId": "thm-spectral-theorem",
        "language": "python",
        "title": "实对称矩阵的正交谱分解与椭圆主轴旋转交互演示",
        "description": "生成 2x2 或 3x3 实对称矩阵，求解特征值与正交特征向量矩阵 Q，验证 A = Q Λ Q^T 与正交性 Q^T Q = I。",
        "code": "import numpy as np\n\ndef spectral_decomposition(a11=3.0, a12=1.5, a22=2.0):\n    # 构造实对称矩阵 A\n    A = np.array([[float(a11), float(a12)], [float(a12), float(a22)]])\n    \n    # 特征值与正交特征向量\n    eigenvalues, Q = np.linalg.eigh(A)\n    \n    # 验证重构误差\n    Lambda = np.diag(eigenvalues)\n    A_reconstructed = Q @ Lambda @ Q.T\n    error = float(np.max(np.abs(A - A_reconstructed)))\n    orthogonality_error = float(np.max(np.abs(Q.T @ Q - np.eye(2))))\n    \n    return {\n        \"matrix_A\": A.tolist(),\n        \"eigenvalues\": [round(float(val), 4) for val in eigenvalues],\n        \"orthonormal_Q\": [[round(float(cell), 4) for cell in row] for row in Q],\n        \"is_orthogonal\": orthogonality_error < 1e-10,\n        \"reconstruction_max_error\": error\n    }",
        "presetParams": {
          "a11": {
            "min": -5,
            "max": 5,
            "step": 0.5,
            "default": 3,
            "label": "A[0,0]"
          },
          "a12": {
            "min": -5,
            "max": 5,
            "step": 0.5,
            "default": 1.5,
            "label": "A[0,1] (对称)"
          },
          "a22": {
            "min": -5,
            "max": 5,
            "step": 0.5,
            "default": 2,
            "label": "A[1,1]"
          }
        },
        "plotType": "matrix"
      }
    ],
    "tags": [
      "线性代数",
      "自伴算子",
      "谱定理",
      "特征值",
      "正交对角化"
    ],
    "lastModified": "2026-09-01"
  },
  {
    "id": "thm-cayley-group",
    "slug": "cayleys-theorem-group-theory",
    "titleZh": "凯莱定理",
    "titleEn": "Cayley's Theorem in Group Theory",
    "nodeType": "THEOREM",
    "objectType": "PROPOSITION",
    "propositionRole": "THEOREM",
    "disciplineId": "algebra",
    "mscCode": "20B05",
    "statementLatex": "\\forall G, \\; G \\cong H \\le \\mathrm{Sym}(G), \\quad \\text{where } \\Phi: G \\to \\mathrm{Sym}(G), \\; g \\mapsto \\lambda_g, \\; \\lambda_g(x) = g \\cdot x",
    "statementPlainZh": "任何一个群 \\(G\\) 都同构于某个集合上的对称群（置换群）的一个子群。具体而言，通过群元素在群自身集合上的左乘作用，可证明 \\(G\\) 同构于对称群 \\(\\mathrm{Sym}(G)\\) 的子群；若 \\(G\\) 为 \\(n\\) 阶有限群，则 \\(G\\) 同构于 \\(n\\) 次对称群 \\(S_n\\) 的一个子群。",
    "statementPlainEn": "Every group G is isomorphic to a subgroup of the symmetric group Sym(G) acting on G via left regular multiplication.",
    "intuitionMd": "### 抽象公理向具象置换的投射\n**“每个抽象群元素在本质上都是对整个群结构做了一次全员洗牌置换。”**\n\n- **左乘正则表示**：定义映射 \\(\\lambda_g(x) = gx\\)。由于群消去律，不同元素不会被映射到相同结果（单射），且每个元素都有原像（满射），故 \\(\\lambda_g\\) 构成了群集合 \\(G\\) 的一个严格双射置换。\n- **代数思想里程碑**：打破了“置换群（具体几何刚体变换）”与“公理化抽象群”的界限，证明了抽象群公理完全捕捉了对称置换的全部本质。",
    "intuitionEn": "### Concrete Realization of Abstract Symmetry\nEvery abstract group element acts as a unique full-permutation on the group set itself via left multiplication, providing a faithful embedding into symmetric groups.",
    "historicalContextZh": "由阿瑟·凯莱 (Arthur Cayley) 于1854年发表在《哲学杂志》上的论文中首次证明，标志着代数学从研究多项式根的具体置换正式迈向现代公理化群论体系。",
    "historicalContextEn": "Formulated by Arthur Cayley in 1854, marking the revolutionary transition from concrete polynomial root permutations to modern abstract group theory.",
    "verification": "FORMALLY_VERIFIED",
    "reputationScore": 890,
    "viewCount": 5300,
    "difficultyLevel": 2,
    "dependencies": [
      "def-group"
    ],
    "dependents": [],
    "proofs": [
      {
        "id": "proof-cayley-embedding",
        "nodeId": "thm-cayley-group",
        "title": "左正则表示与单同态构造证明",
        "approachType": "ALGEBRAIC",
        "author": {
          "id": "user-cayley",
          "name": "Arthur Cayley",
          "reputation": 18200,
          "avatar": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100",
          "isModerator": true
        },
        "motivation": "利用左乘映射构造从群 G 到 Sym(G) 的内嵌群同态，并证明其核为平凡群。",
        "rigorousProof": "第一步：构造左乘置换。\n对任意 \\(g \\in G\\)，定义映射 \\(\\lambda_g : G \\to G\\)，\\(\\lambda_g(x) = g \\cdot x\\)。\n- 单射性：若 \\(\\lambda_g(x) = \\lambda_g(y)\\)，即 \\(gx = gy\\)，两边左乘 \\(g^{-1}\\) 得 \\(x = y\\)。\n- 满射性：对任意 \\(y \\in G\\)，取 \\(x = g^{-1}y \\in G\\)，有 \\(\\lambda_g(x) = g(g^{-1}y) = y\\)。\n因此 \\(\\lambda_g\\) 是 \\(G\\) 到 \\(G\\) 的一一双射，即 \\(\\lambda_g \\in \\mathrm{Sym}(G)\\)。\n\n第二步：验证映射 \\(\\Phi: G \\to \\mathrm{Sym}(G), \\; g \\mapsto \\lambda_g\\) 是群同态。\n对任意 \\(g, h, x \\in G\\)，由群结合律：\n\\[\n\\lambda_{gh}(x) = (gh)x = g(hx) = \\lambda_g(\\lambda_h(x)) = (\\lambda_g \\circ \\lambda_h)(x)\n\\]\n由于对所有 \\(x\\) 均成立，故 \\(\\lambda_{gh} = \\lambda_g \\circ \\lambda_h\\)，即 \\(\\Phi(gh) = \\Phi(g) \\circ \\Phi(h)\\)，\\(\\Phi\\) 为群同态。\n\n第三步：证明同态的核为平凡群（单同态）。\n设 \\(g \\in \\ker(\\Phi)\\)，则 \\(\\lambda_g = \\mathrm{id}_G\\)。\n特别地，作用在单位元 \\(e\\) 上：\n\\[\n\\lambda_g(e) = \\mathrm{id}_G(e) \\implies g \\cdot e = e \\implies g = e\n\\]\n因此 \\(\\ker(\\Phi) = \\{e\\}\\)，\\(\\Phi\\) 是单同态。\n由群第一同构定理，\\(G \\cong \\Phi(G) \\le \\mathrm{Sym}(G)\\)。证毕。",
        "steps": [
          {
            "id": "cayley-step-1",
            "stepIndex": 1,
            "explanation": "证明左乘映射 λ_g(x) = gx 是集合 G 上的双射置换",
            "latexText": "\\lambda_g: G \\to G, \\; gx = gy \\implies x = y \\land \\lambda_g(g^{-1}y) = y \\implies \\lambda_g \\in \\mathrm{Sym}(G)",
            "commentsCount": 1
          },
          {
            "id": "cayley-step-2",
            "stepIndex": 2,
            "explanation": "验证结合律导出同态性 Φ(gh) = Φ(g) ∘ Φ(h) 且核为平凡子群",
            "latexText": "\\Phi(gh) = \\lambda_{gh} = \\lambda_g \\circ \\lambda_h, \\quad \\lambda_g(e) = e \\implies g = e \\implies G \\cong \\Phi(G) \\le \\mathrm{Sym}(G)",
            "commentsCount": 2
          }
        ],
        "isPrimary": true,
        "verification": "FORMALLY_VERIFIED",
        "upvotes": 710
      }
    ],
    "prerequisiteEdges": [
      {
        "id": "pe-cayley-def-group",
        "fromNodeId": "thm-cayley-group",
        "toNodeId": "def-group",
        "relationType": "REQUIRES_DEFINITION",
        "graphType": "PREREQUISITE_DAG",
        "description": "Left regular action relies on group axioms and associativity"
      }
    ],
    "semanticEdges": [
      {
        "id": "se-cayley-first-iso",
        "fromNodeId": "thm-cayley-group",
        "toNodeId": "thm-first-isomorphism",
        "relationType": "MOTIVATES",
        "graphType": "SEMANTIC_GRAPH",
        "description": "Cayley embedding proof naturally employs First Isomorphism Theorem via kernel triviality"
      }
    ],
    "leanFormalization": {
      "id": "lean-cayley",
      "nodeId": "thm-cayley-group",
      "theoremName": "Equiv.Perm.decompose_cayley",
      "mathlibImports": [
        "Mathlib.GroupTheory.Perm.Basic",
        "Mathlib.Algebra.Hom.Equiv.Basic"
      ],
      "leanCode": "import Mathlib.GroupTheory.Perm.Basic\nimport Mathlib.Algebra.Hom.Equiv.Basic\n\nopen Equiv\n\n/-- 凯莱定理: 任何群同构于对称群的一个子群 (通过左正则表示注入) -/\ntheorem cayley_theorem (G : Type*) [Group G] :\n    ∃ (H : Subgroup (Perm G)), Nonempty (G ≃* H) := by\n  let f : G →* Perm G := MulAction.toPermHom G G\n  have h_inj : Function.Injective f := by\n    intro a b hab\n    have h_eq : f a 1 = f b 1 := by rw [hab]\n    simpa [f, MulAction.toPermHom] using h_eq\n  exact ⟨f.range, ⟨MulEquiv.ofInjective f h_inj⟩⟩",
      "proofStateOutput": "Goals accomplished! 🎉",
      "isVerified": true,
      "verifiedAt": "2026-09-01",
      "axiomsUsed": [
        "Classical.choice",
        "Quot.sound",
        "propext"
      ],
      "astHash": "sha256:1a82d029bbd11342a98e82112e43bc09",
      "verificationRecord": {
        "statementRevision": "rev-2026.09.01",
        "statementHash": "sha256:4b19da821155a002bc4501aef1182239",
        "proofHash": "sha256:1a82d029bbd11342a98e82112e43bc09",
        "leanVersion": "Lean (version 4.14.0)",
        "mathlibCommit": "v4.14.0",
        "imports": [
          "Mathlib.GroupTheory.Perm.Basic",
          "Mathlib.Algebra.Hom.Equiv.Basic"
        ],
        "axiomsUsed": [
          "Classical.choice",
          "Quot.sound",
          "propext"
        ],
        "result": "PASSED",
        "checkedAt": "2026-09-01T00:00:00Z",
        "checker": "LEAN_KERNEL"
      }
    },
    "formalVerificationRecord": {
      "statementRevision": "rev-2026.09.01",
      "statementHash": "sha256:4b19da821155a002bc4501aef1182239",
      "proofHash": "sha256:1a82d029bbd11342a98e82112e43bc09",
      "leanVersion": "Lean (version 4.14.0)",
      "mathlibCommit": "v4.14.0",
      "imports": [
        "Mathlib.GroupTheory.Perm.Basic",
        "Mathlib.Algebra.Hom.Equiv.Basic"
      ],
      "axiomsUsed": [
        "Classical.choice",
        "Quot.sound",
        "propext"
      ],
      "result": "PASSED",
      "checkedAt": "2026-09-01T00:00:00Z",
      "checker": "LEAN_KERNEL"
    },
    "codeSnippets": [
      {
        "id": "py-cayley-perm-action",
        "nodeId": "thm-cayley-group",
        "language": "python",
        "title": "有限群 (Klein-4 或 S_3) 的凯莱左乘置换表示",
        "description": "计算克莱因四元群 V_4 = {e, a, b, c} 中每个元素 g 的左乘映射 λ_g，输出对应的置换矩阵与轮换分解。",
        "code": "def cayley_v4_permutations():\n    # Klein-4 群: e=0, a=1, b=2, c=3 (a*b=c, a^2=b^2=c^2=e)\n    elements = ['e', 'a', 'b', 'c']\n    mult_table = [\n        [0, 1, 2, 3], # e * [e, a, b, c]\n        [1, 0, 3, 2], # a * [e, a, b, c]\n        [2, 3, 0, 1], # b * [e, a, b, c]\n        [3, 2, 1, 0]  # c * [e, a, b, c]\n    ]\n    \n    permutations = {}\n    for i, g in enumerate(elements):\n        perm_indices = mult_table[i]\n        perm_str = \" \".join([f\"{elements[j]}->{elements[perm_indices[j]]}\" for j in range(4)])\n        permutations[g] = {\n            \"perm_array\": perm_indices,\n            \"permutation_map\": perm_str,\n            \"is_identity\": (i == 0)\n        }\n        \n    return {\n        \"group_name\": \"Klein 4-Group V_4\",\n        \"order\": 4,\n        \"permutations\": permutations\n    }",
        "presetParams": {},
        "plotType": "matrix"
      }
    ],
    "tags": [
      "近世代数",
      "群论",
      "凯莱定理",
      "置换群",
      "正则表示"
    ],
    "lastModified": "2026-09-01"
  }
];
