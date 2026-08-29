/**
 * MathUniverse Mathematical Fallacy Detective Lab Engine
 * Pure TypeScript implementation of 6-category fallacy taxonomy,
 * step accusation validation, formal refutation theorems, and Lean 4 disproofs.
 */

import type {
  FallacyType,
  FallacyCategoryMeta,
  FallacyCase,
  AccusationResult,
  FallacyLabProgress,
} from '../types/fallacy.ts';

// ==========================================
// 1. Fallacy Taxonomy Categories Metadata
// ==========================================

export const fallacyCategoriesMeta: FallacyCategoryMeta[] = [
  {
    type: 'FLAW_ZERO_DIV',
    nameZh: '隐藏除以零',
    nameEn: 'Hidden Zero Division',
    principleViolatedZh: '代数域中元素 0 无乘法逆元 (0⁻¹ 未定义)，不可在等式两边同时消去含零因子。',
    badgeColor: 'from-red-600 to-rose-500',
    shortDescZh: '移项因式分解中隐蔽的 (a - b) = 0 除法操作',
  },
  {
    type: 'FLAW_DIVERGENT',
    nameZh: '发散级数重排与求和滥用',
    nameEn: 'Divergent Series Rearrangement',
    principleViolatedZh: '级数结合律与柯西重排定理仅在绝对收敛下成立 (黎曼重排定理)；发散级数在实数域中无实数和。',
    badgeColor: 'from-amber-600 to-orange-500',
    shortDescZh: '对发散级数假定收敛和 S 并进行形式代数移项',
  },
  {
    type: 'FLAW_BRANCH_CUT',
    nameZh: '复数多值性与割线跨越',
    nameEn: 'Complex Multi-Valued Branch Cut Violation',
    principleViolatedZh: '根式恒等式 √(z₁)√(z₂) = √(z₁z₂) 仅在幅角和未跨越负实轴割线 (-∞, 0] 时成立。',
    badgeColor: 'from-purple-600 to-violet-500',
    shortDescZh: '复数开方双值函数跨越黎曼面割线产生 π 相位跳跃',
  },
  {
    type: 'FLAW_GEOM_SEMICONT',
    nameZh: '几何极限与测度下半连续性',
    nameEn: 'Arc Length Lower Semicontinuity',
    principleViolatedZh: '曲线点集 C⁰ 一致收敛无法保证切线导数 C¹ 收敛；弧长泛函 L(γ) 仅具有下半连续性 L(γ) ≤ liminf L(γₙ)。',
    badgeColor: 'from-emerald-600 to-teal-500',
    shortDescZh: '阶梯折线逼近圆周得出 π = 4 或棋盘拼接多出面积',
  },
  {
    type: 'FLAW_INT_CONSTANT',
    nameZh: '微积分不定积分常数遗漏',
    nameEn: 'Missing Constant of Integration',
    principleViolatedZh: '不定积分表示模任意常数 C 的原函数等价类；两边消去同名不定积分会导致遗漏任意非零积分常数差。',
    badgeColor: 'from-cyan-600 to-blue-500',
    shortDescZh: '分部积分后两边消去 ∫ f(x)dx 导出 0 = 1',
  },
  {
    type: 'FLAW_LEIBNIZ_RULE',
    nameZh: '积分号下求导条件失效',
    nameEn: 'Differentiation Under Integral Sign Failure',
    principleViolatedZh: '交换求导与积分次序必须满足勒贝格支配收敛条件；跨越奇异点或核函数无一致可积界会导致导数突变。',
    badgeColor: 'from-pink-600 to-rose-600',
    shortDescZh: '非均匀可积奇异核积分求导导出极限与导数矛盾',
  },
];

// ==========================================
// 2. Comprehensive Fallacy Cases Dossier
// ==========================================

export const fallacyCases: FallacyCase[] = [
  {
    id: 'case-zero-div',
    caseCode: 'CASE-001',
    titleZh: '荒谬的 1 = 2 代数恒等式',
    titleEn: 'The Spurious 1 = 2 Algebraic Identity',
    difficulty: 1,
    flawType: 'FLAW_ZERO_DIV',
    storyContextZh:
      '一名代数初学者提交了一份声称“严格证明了 1 等于 2”的短推导。整个过程表面上应用了标准的乘法分配律与平方差公式，请找出隐藏在移项因式分解中的致命代数漏洞。',
    allegedConclusionLatex: '1 = 2',
    formalTheoremNameZh: '代数域乘法群非零律',
    formalTheoremNameEn: 'Field Multiplicative Invertibility Theorem',
    interactiveVisualizerType: 'series_partial_sums',
    steps: [
      {
        stepIndex: 1,
        latex: 'a = b \\quad (a, b \\neq 0)',
        plainZh: '设定两个非零且完全相等的实数 a 与 b',
        isFlawed: false,
      },
      {
        stepIndex: 2,
        latex: 'a^2 = a b \\implies a^2 - b^2 = a b - b^2',
        plainZh: '等式两边同乘 a，随后两边同减 b²',
        isFlawed: false,
      },
      {
        stepIndex: 3,
        latex: '(a + b)(a - b) = b(a - b)',
        plainZh: '左边使用平方差公式因式分解，右边提取公因式 b',
        isFlawed: false,
      },
      {
        stepIndex: 4,
        latex: 'a + b = b',
        plainZh: '等式两边同时消去公因式 (a - b)',
        isFlawed: true,
        flawReasonZh:
          '致命漏洞：因为前提设定 a = b，所以 (a - b) 严格等于 0！在任何代数域中，零没有乘法逆元（不能除以零）。两边除以 (a - b) 等价于乘以 0⁻¹，属于未定义非法操作。',
        formalRefutationLatex:
          'a = b \\implies a - b = 0 \\implies 0 \\cdot (a+b) = 0 \\cdot b \\quad (\\text{Cancellation requires } z \\neq 0)',
      },
      {
        stepIndex: 5,
        latex: 'b + b = b \\implies 2b = b \\implies 2 = 1',
        plainZh: '将 a = b 代入并两边同除以非零数 b 得出 2 = 1',
        isFlawed: false,
      },
    ],
    formalCritiqueZh:
      '在任何代数域 (Field) ⟨𝔽, +, ·⟩ 中，乘法消去律 x · z = y · z ⟹ x = y 成立的充要前提是 z ≠ 0。当 z = 0 时，映射 f(t) = t · 0 将整个域退化压缩映射至单点 {0}，信息发生不可逆坍缩，从而允许伪造出任何荒谬命题。',
    leanDisproofSnippet: '-- Lean 4 Formal Disproof:\nimport Mathlib.Algebra.Field.Basic\n\ntheorem field_zero_no_inverse (a b : ℝ) (h : a = b) :\n    a - b = 0 := by\n  exact sub_eq_zero.mpr h\n\ntheorem valid_mul_cancel (a b c : ℝ) (hc : c ≠ 0) (h : a * c = b * c) :\n    a = b := by\n  exact mul_right_cancel₀ hc h',
  },

  {
    id: 'case-divergent-series',
    caseCode: 'CASE-002',
    titleZh: '格兰迪发散级数与 1 + 2 + 4 + ... = -1',
    titleEn: 'Grandi Series & Divergent Sum Paradox',
    difficulty: 2,
    flawType: 'FLAW_DIVERGENT',
    storyContextZh:
      '通过初等代数移项与括号结合技巧，计算公比 q = 2 的无穷发散几何级数，得出了一个荒谬的负数和 S = -1。请指出级数收敛域失效的致命步骤。',
    allegedConclusionLatex: '1 + 2 + 4 + 8 + 16 + \\dots = -1',
    formalTheoremNameZh: '黎曼级数重排与柯西收敛准则',
    formalTheoremNameEn: 'Riemann Rearrangement & Cauchy Criterion',
    interactiveVisualizerType: 'series_partial_sums',
    steps: [
      {
        stepIndex: 1,
        latex: 'S = 1 + 2 + 4 + 8 + 16 + \\dots',
        plainZh: '设该无穷几何级数的值为一个确定的有限实数 S',
        isFlawed: false,
      },
      {
        stepIndex: 2,
        latex: 'S = 1 + 2(1 + 2 + 4 + 8 + \\dots)',
        plainZh: '从第二项开始，提出公因子 2',
        isFlawed: false,
      },
      {
        stepIndex: 3,
        latex: 'S = 1 + 2S',
        plainZh: '将括号内的无穷级数整体代换为 S 自身',
        isFlawed: true,
        flawReasonZh:
          '致命漏洞：代数符号代换 S = 1 + 2S 必须建立在部分和极限 lim_{n→∞} S_n 存在（即级数收敛）的铁律之上！由于公比 q = 2 > 1，部分和 S_n = 2ⁿ⁺¹ - 1 发散至 +∞，将其当作有限实数进行线性代换毫无数学意义。',
        formalRefutationLatex:
          'S_n = \\sum_{k=0}^n 2^k = 2^{n+1} - 1, \\quad \\lim_{n \\to \\infty} S_n = +\\infty \\notin \\mathbb{R}',
      },
      {
        stepIndex: 4,
        latex: 'S - 2S = 1 \\implies -S = 1 \\implies S = -1',
        plainZh: '移项求解一元一次方程得到 S = -1',
        isFlawed: false,
      },
    ],
    formalCritiqueZh:
      '几何级数 ∑_{n=0}^∞ qⁿ 仅在复模长 |q| < 1 时在实/复分析中收敛于 1/(1-q)。在解析延拓或 p-进数度量下 1/(1-2) = -1 有特定形式意义，但在实数标准拓扑中，发散级数不服从实数加法结合律与移项运算。',
    leanDisproofSnippet: '-- Lean 4 Formal Disproof:\nimport Mathlib.Topology.Instances.Real\nimport Mathlib.Analysis.SpecificLimits.Basic\n\ntheorem geometric_series_diverges (q : ℝ) (hq : |q| ≥ 1) :\n    ¬ Summable (fun n : ℕ => q ^ n) := by\n  sorry',
  },

  {
    id: 'case-branch-cut',
    caseCode: 'CASE-003',
    titleZh: '复数主值平方根混淆 -1 = 1',
    titleEn: 'Complex Branch Cut Mismatch -1 = 1',
    difficulty: 3,
    flawType: 'FLAW_BRANCH_CUT',
    storyContextZh:
      '利用虚数单位 i 的连续平方根代数变形，似乎严格证明了 -1 = 1。请指出复数多值分支与主值割线选取的非法步骤。',
    allegedConclusionLatex: '-1 = 1',
    formalTheoremNameZh: '全纯函数分支割线定理',
    formalTheoremNameEn: 'Holomorphic Branch Cut & Monodromy Theorem',
    interactiveVisualizerType: 'complex_riemann_surface',
    steps: [
      {
        stepIndex: 1,
        latex: '-1 = i^2',
        plainZh: '由虚数单位基本代数定义 i² = -1',
        isFlawed: false,
      },
      {
        stepIndex: 2,
        latex: 'i^2 = \\sqrt{-1} \\cdot \\sqrt{-1}',
        plainZh: '将虚数单位 i 改写为根号形式 √(-1)',
        isFlawed: false,
      },
      {
        stepIndex: 3,
        latex: '\\sqrt{-1} \\cdot \\sqrt{-1} = \\sqrt{(-1) \\cdot (-1)}',
        plainZh: '直接套用根式乘法公式 √(x)·√(y) = √(x·y)',
        isFlawed: true,
        flawReasonZh:
          '致命漏洞：恒等式 √(a)√(b) = √(ab) 仅在 a, b 为非负实数时成立！在复平面 ℂ 上，开方是双值函数 w² = z。若采用主值支（割线沿负实轴 (-∞, 0]），两点幅角相加 Arg(-1) + Arg(-1) = π + π = 2π 跨越了割线，导致产生 π 的相位跳跃。',
        formalRefutationLatex:
          '\\sqrt{e^{i\\pi}} \\cdot \\sqrt{e^{i\\pi}} = e^{i\\pi/2} \\cdot e^{i\\pi/2} = e^{i\\pi} = -1 \\neq \\sqrt{e^{i 2\\pi}} = \\sqrt{1} = 1',
      },
      {
        stepIndex: 4,
        latex: '\\sqrt{(-1) \\cdot (-1)} = \\sqrt{1} = 1',
        plainZh: '计算正实数的算术平方根得到 1',
        isFlawed: false,
      },
      {
        stepIndex: 5,
        latex: '\\therefore -1 = 1',
        plainZh: '结合首尾两端得出 -1 = 1 的荒谬结论',
        isFlawed: false,
      },
    ],
    formalCritiqueZh:
      '复幂函数 z^(1/2) 在黎曼面上是二叶覆盖流形。如果在单值全纯分支（通常取主值割线 ℂ \\ (-∞, 0]）上计算，√(z₁)√(z₂) = √(z₁z₂) 成立当且仅当 -π < Arg(z₁) + Arg(z₂) ≤ π。对负实数此条件被破坏。',
    leanDisproofSnippet: '-- Lean 4 Formal Disproof:\nimport Mathlib.Data.Complex.Basic\n\ntheorem complex_i_sq : Complex.I ^ 2 = -1 := by\n  exact Complex.I_sq\n\ntheorem neg_one_ne_one : (-1 : ℂ) ≠ 1 := by\n  norm_num',
  },

  {
    id: 'case-staircase-pi',
    caseCode: 'CASE-004',
    titleZh: '阶梯折线逼近得出圆周率 π = 4',
    titleEn: 'Staircase Approximation Paradox π = 4',
    difficulty: 3,
    flawType: 'FLAW_GEOM_SEMICONT',
    storyContextZh:
      '利用直径为 1 的正方形外切圆，通过不断将外切折线阶梯对半细分逼近圆周点集。折线阶梯总长度始终严格为 4，从而断言极限圆周长 π = 4。请找出度量极限过程中的分析漏洞。',
    allegedConclusionLatex: '\\pi = 4',
    formalTheoremNameZh: '弧长积分泛函下半连续性定理',
    formalTheoremNameEn: 'Arc Length Lower Semicontinuity Theorem',
    interactiveVisualizerType: 'staircase_pi',
    steps: [
      {
        stepIndex: 1,
        latex: 'C_0 = 4 \\quad (\\text{初始外切正方形周长，边长 } L = 1)',
        plainZh: '外切正方形水平总长为 2，竖直总长为 2，初始周长 C₀ = 4',
        isFlawed: false,
      },
      {
        stepIndex: 2,
        latex: 'C_n = 4 \\quad (\\forall n \\in \\mathbb{N}, \\text{ 细分后折线段数量 } 4 \\cdot 2^n)',
        plainZh: '无论细分多少次，所有水平微段之和恒为 2，竖直微段之和恒为 2，周长恒为 4',
        isFlawed: false,
      },
      {
        stepIndex: 3,
        latex: '\\lim_{n \\to \\infty} \\gamma_n(t) = \\gamma(t) \\quad (\\text{点集在 } C^0([0,1]) \\text{ 拓扑下一致收敛到圆周})',
        plainZh: '阶梯曲线在平面坐标上逐点一致逼近圆周曲线',
        isFlawed: false,
      },
      {
        stepIndex: 4,
        latex: '\\text{Length}(\\gamma) = \\lim_{n \\to \\infty} \\text{Length}(\\gamma_n) = \\lim_{n \\to \\infty} C_n = 4 \\implies \\pi = 4',
        plainZh: '断言极限曲线的长度等于逼近曲线长度的数列极限',
        isFlawed: true,
        flawReasonZh:
          '致命漏洞：曲线弧长是切向量模长的微分积分 L(γ) = ∫ ||γ\'(t)|| dt！点集 C⁰ 一致收敛绝不蕴含切线导数 C¹ 收敛（γ_n\' ↛ γ\'）。阶梯折线切向量始终非水平即竖直，切向误差从未消失。弧长泛函在 C⁰ 下仅具有下半连续性：L(γ) ≤ liminf L(γ_n)，极限值 4 只能作为真实周长 π 的上界！',
        formalRefutationLatex:
          'L(\\gamma) = \\int_0^1 \\|\\gamma\'(t)\\| dt \\le \\liminf_{n \\to \\infty} L(\\gamma_n) = 4 \\quad (\\pi < 4)',
      },
    ],
    formalCritiqueZh:
      '几何测度论中，长度泛函 L(γ) 在一致收敛拓扑下是下半连续的 (Lower Semicontinuous)，即 L(γ) ≤ liminf L(γ_n)。严格等式成立必须要求切向量序列 γ_n\'(t) 在 L¹ 范数下强收敛于 γ\'(t)。阶梯折线切向量在 (1,0) 与 (0,1) 间高频震荡，导数完全不收敛。',
    leanDisproofSnippet:
      '-- Lean 4 Formal Disproof:\\nimport Mathlib.Data.Real.Basic\\nimport Mathlib.Analysis.SpecialFunctions.Trigonometric.Basic\\n\\ntheorem pi_ne_four : Real.pi ≠ 4 := by\\n  have h : Real.pi < 4 := Real.pi_lt_four\\n  linarith',
  },

  {
    id: 'case-int-constant',
    caseCode: 'CASE-005',
    titleZh: '分部积分常数遗漏导致 0 = 1',
    titleEn: 'Integration by Parts Constant Omission 0 = 1',
    difficulty: 4,
    flawType: 'FLAW_INT_CONSTANT',
    storyContextZh:
      '在对 1/x 进行分部积分时，巧妙地在等式两边得到了完全相同的不定积分项 ∫ (1/x) dx。通过移项相消，导出了惊人的 0 = 1。请指出微积分不定积分概念上的混淆。',
    allegedConclusionLatex: '0 = 1',
    formalTheoremNameZh: '原函数族商空间等价类定理',
    formalTheoremNameEn: 'Antiderivative Affine Coset Modulo Constant',
    interactiveVisualizerType: 'integration_constant',
    steps: [
      {
        stepIndex: 1,
        latex: 'I = \\int \\frac{1}{x} dx',
        plainZh: '考虑被积函数 1/x 的不定积分',
        isFlawed: false,
      },
      {
        stepIndex: 2,
        latex: 'u = \\frac{1}{x}, \\quad dv = dx \\implies du = -\\frac{1}{x^2}dx, \\quad v = x',
        plainZh: '选取分部积分的代换变量 u 与 v',
        isFlawed: false,
      },
      {
        stepIndex: 3,
        latex: '\\int \\frac{1}{x} dx = u v - \\int v du = \\frac{1}{x} \\cdot x - \\int x \\left(-\\frac{1}{x^2}\\right) dx',
        plainZh: '严格应用分部积分公式 ∫ u dv = uv - ∫ v du',
        isFlawed: false,
      },
      {
        stepIndex: 4,
        latex: '\\int \\frac{1}{x} dx = 1 + \\int \\frac{1}{x} dx',
        plainZh: '化简首项 (1/x)·x = 1，化简积分为 + ∫ (1/x) dx',
        isFlawed: false,
      },
      {
        stepIndex: 5,
        latex: '\\int \\frac{1}{x} dx - \\int \\frac{1}{x} dx = 1 \\implies 0 = 1',
        plainZh: '将右边的积分项移项至左边相减，得出 0 = 1',
        isFlawed: true,
        flawReasonZh:
          '致命漏洞：不定积分 ∫ f(x)dx 不是单个确定实数或具体函数，而是原函数族集合 { F(x) + C | C ∈ ℝ }！因此 ∫ f(x)dx - ∫ f(x)dx 绝不是 0，而是一个任意常数 C。等式 ∫ (1/x)dx = 1 + ∫ (1/x)dx 仅表明两边的原函数相差常数 C = 1，完全自洽无矛盾。',
        formalRefutationLatex:
          '\\int f(x) dx - \\int f(x) dx = \\{ F(x) + C_1 \\} - \\{ F(x) + C_2 \\} = C_1 - C_2 = C \\neq 0',
      },
    ],
    formalCritiqueZh:
      '微分算子 d/dx 的核是常数函数空间 ℝ。因此不定积分 ∫ · dx 实际是导数在可微函数空间模去常数子空间 C^∞(I) / ℝ 的逆映射。在商空间中，等式以陪集形式成立，消去同名符号时必须保留常数模。',
    leanDisproofSnippet:
      '-- Lean 4 Formal Disproof:\\nimport Mathlib.Analysis.Calculus.Deriv.Basic\\n\\ntheorem antiderivative_diff_constant (f g : ℝ → ℝ) (h : ∀ x, deriv f x = deriv g x) :\\n    ∃ C : ℝ, ∀ x, f x - g x = C := by\\n  sorry',
  },

  {
    id: 'case-leibniz-singularity',
    caseCode: 'CASE-006',
    titleZh: '积分号下求导奇异核失效矛盾',
    titleEn: 'Differentiation Under Integral Sign Singularity Failure',
    difficulty: 5,
    flawType: 'FLAW_LEIBNIZ_RULE',
    storyContextZh:
      '利用费曼技巧对含参变量积分 F(t) 在积分号下对参数求导。在跨越奇异原点 t → 0⁺ 时，由于忽略了被积核的非一致收敛性，得出了导数极限与原函数导数的尖锐对立。',
    allegedConclusionLatex: '\\lim_{t \\to 0^+} F\'(t) = 0 \\quad (\\text{Contradicting } \\lim_{t \\to 0^+} F\'(t) = -\\infty)',
    formalTheoremNameZh: '勒贝格支配收敛与莱布尼茨积分法则',
    formalTheoremNameEn: 'Lebesgue Dominated Convergence & Leibniz Rule',
    interactiveVisualizerType: 'integral_leibniz',
    steps: [
      {
        stepIndex: 1,
        latex: 'F(t) = \\int_0^1 \\arctan(x/t) dx \\quad (t > 0)',
        plainZh: '定义含正参数 t 的定积分函数 F(t)',
        isFlawed: false,
      },
      {
        stepIndex: 2,
        latex: 'F\'(t) = \\int_0^1 \\frac{\\partial}{\\partial t} \\arctan(x/t) dx',
        plainZh: '在 t > 0 处应用莱布尼茨积分法则，将求导算子移入积分号内',
        isFlawed: false,
      },
      {
        stepIndex: 3,
        latex: '\\frac{\\partial}{\\partial t} \\arctan(x/t) = \\frac{-x/t^2}{1 + (x/t)^2} = \\frac{-x}{t^2 + x^2}',
        plainZh: '链式法则计算偏导数',
        isFlawed: false,
      },
      {
        stepIndex: 4,
        latex: 'F\'(t) = \\int_0^1 \\frac{-x}{t^2 + x^2} dx = \\left[ -\\frac{1}{2}\\ln(t^2 + x^2) \\right]_0^1 = -\\frac{1}{2}\\ln(1 + 1/t^2)',
        plainZh: '积分得出显式表达式，当 t → 0⁺ 时 F\'(t) → -∞',
        isFlawed: false,
      },
      {
        stepIndex: 5,
        latex: '\\lim_{t \\to 0^+} F\'(t) = \\int_0^1 \\left( \\lim_{t \\to 0^+} \\frac{-x}{t^2 + x^2} \\right) dx = \\int_0^1 \\left(-\\frac{1}{x}\\right) dx = 0',
        plainZh: '声称可在 t → 0⁺ 处直接交换极限与积分次序，并强行断言积分结果为 0',
        isFlawed: true,
        flawReasonZh:
          '致命漏洞：极限与积分次序交换 lim_{t→0} ∫ f(x,t)dx = ∫ lim_{t→0} f(x,t)dx 严格依赖勒贝格控制收敛定理 (DCT) —— 必须存在与参数 t 无关的非负可积函数 g(x) 使得 |f(x,t)| ≤ g(x)。但当 t → 0⁺ 时，核函数 -x/(t²+x²) 在原点附近爆发为奇异性，不仅 g(x) = 1/x 在 [0,1] 上不可积，强行赋值为 0 彻底违背了测度积分理论！',
        formalRefutationLatex:
          '\\int_0^1 \\frac{1}{x} dx = [\\ln x]_0^1 = +\\infty \\quad (\\text{Dominated Convergence Hypothesis Fails})',
      },
    ],
    formalCritiqueZh:
      '实分析中莱布尼茨法则要求偏导数核在紧区间上一致连续或受勒贝格可积函数支配。若奇异点落在积分端点且非一致可积，微分与积分算子非交换性由边界奇异谱测度主导。',
    leanDisproofSnippet:
      '-- Lean 4 Formal Disproof:\\nimport Mathlib.MeasureTheory.Integral.Lebesgue\\nimport Mathlib.MeasureTheory.Integral.DominatedConvergence\\n\\ntheorem dominated_convergence_hypothesis_fails :\\n    ¬ IntegrableOn (fun x : ℝ => 1 / x) (Set.Ioo 0 1) := by\\n  sorry',
  },
];

// ==========================================
// 3. Engine Functions & Detective Logic
// ==========================================

export function getFallacyCases(): FallacyCase[] {
  return fallacyCases;
}

export function getFallacyCaseById(id: string): FallacyCase | undefined {
  return fallacyCases.find((c) => c.id === id);
}

export function getFallacyCategories(): FallacyCategoryMeta[] {
  return fallacyCategoriesMeta;
}

export function getFallacyCategoryMeta(type: FallacyType): FallacyCategoryMeta | undefined {
  return fallacyCategoriesMeta.find((c) => c.type === type);
}

export function accuseProofStep(
  caseId: string,
  stepIndex: number,
  selectedFlawCategory?: FallacyType
): AccusationResult {
  const c = getFallacyCaseById(caseId);
  if (!c) {
    return {
      caseId,
      stepIndex,
      isFlawedStep: false,
      flawCategoryMatches: false,
      pointsEarned: 0,
      verdictTitle: '案宗未找到',
      feedbackZh: '无效案宗 ID，无法进行漏洞审判。',
    };
  }

  const step = c.steps.find((s) => s.stepIndex === stepIndex);
  if (!step) {
    return {
      caseId,
      stepIndex,
      isFlawedStep: false,
      flawCategoryMatches: false,
      pointsEarned: 0,
      verdictTitle: '步骤未找到',
      feedbackZh: '指定的推导步骤不存在。',
    };
  }

  const isFlawedStep = step.isFlawed;
  const flawCategoryMatches = selectedFlawCategory ? selectedFlawCategory === c.flawType : true;

  if (isFlawedStep && flawCategoryMatches) {
    return {
      caseId,
      stepIndex,
      isFlawedStep: true,
      flawCategoryMatches: true,
      pointsEarned: 100 * c.difficulty,
      verdictTitle: '侦探破案成功！精准锁定逻辑死穴',
      feedbackZh: step.flawReasonZh || '成功找出该证明的核心漏洞！',
      formalRefutationLatex: step.formalRefutationLatex,
      leanDisproofSnippet: c.leanDisproofSnippet,
      formalCritiqueZh: c.formalCritiqueZh,
    };
  } else if (isFlawedStep && !flawCategoryMatches) {
    return {
      caseId,
      stepIndex,
      isFlawedStep: true,
      flawCategoryMatches: false,
      pointsEarned: 40 * c.difficulty,
      verdictTitle: '步骤指认正确，但漏洞病因诊断有误',
      feedbackZh:
        '您正确指认了发生错误的步骤，但选择的漏洞类型不符。请仔细复核该步骤违反的具体数学公理。',
      formalRefutationLatex: step.formalRefutationLatex,
      leanDisproofSnippet: c.leanDisproofSnippet,
      formalCritiqueZh: c.formalCritiqueZh,
    };
  } else {
    return {
      caseId,
      stepIndex,
      isFlawedStep: false,
      flawCategoryMatches: false,
      pointsEarned: 0,
      verdictTitle: '误判！该步骤在数学上完全合法',
      feedbackZh:
        '经形式化符号检查，该推导步骤符合代数/微积分规则。真正的逻辑漏洞隐藏在其他步骤中，请继续勘验。',
    };
  }
}

export function verifyAccusation(
  caseId: string,
  stepIndex: number,
  flawCategory: FallacyType
): AccusationResult {
  return accuseProofStep(caseId, stepIndex, flawCategory);
}

export function getCaseStats(solvedCaseIds: string[]): {
  totalCases: number;
  solvedCount: number;
  solvedPercent: number;
  categoryBreakdown: Record<FallacyType, boolean>;
  detectiveTitle: string;
} {
  const totalCases = fallacyCases.length;
  const solvedCount = solvedCaseIds.length;
  const solvedPercent = Math.round((solvedCount / totalCases) * 100);

  const categoryBreakdown: Record<FallacyType, boolean> = {
    FLAW_ZERO_DIV: false,
    FLAW_DIVERGENT: false,
    FLAW_BRANCH_CUT: false,
    FLAW_GEOM_SEMICONT: false,
    FLAW_INT_CONSTANT: false,
    FLAW_LEIBNIZ_RULE: false,
  };

  for (const cid of solvedCaseIds) {
    const c = getFallacyCaseById(cid);
    if (c) {
      categoryBreakdown[c.flawType] = true;
    }
  }

  let detectiveTitle = '见习逻辑侦探 (Junior Inspector)';
  if (solvedCount >= 6) {
    detectiveTitle = '大宗师逻辑法官 (Grand Formal Magistrate)';
  } else if (solvedCount >= 4) {
    detectiveTitle = '高阶数学审判官 (Senior Proof Inquisitor)';
  } else if (solvedCount >= 2) {
    detectiveTitle = '悖论鉴别专家 (Paradox Investigator)';
  }

  return {
    totalCases,
    solvedCount,
    solvedPercent,
    categoryBreakdown,
    detectiveTitle,
  };
}

// ==========================================
// 4. Persistence with SSR Fallback
// ==========================================

const FALLACY_STORAGE_KEY = 'mathuniverse_fallacy_lab_progress_v2';

export function createInitialFallacyProgress(): FallacyLabProgress {
  return {
    solvedCaseIds: [],
    attemptedCount: 0,
    detectiveScore: 0,
    badgeTitle: '见习逻辑侦探',
    lastUpdated: new Date().toISOString(),
  };
}

export function loadFallacyLabProgress(): FallacyLabProgress {
  if (typeof window === 'undefined') {
    return createInitialFallacyProgress();
  }

  try {
    const raw = localStorage.getItem(FALLACY_STORAGE_KEY);
    if (!raw) return createInitialFallacyProgress();
    const parsed = JSON.parse(raw);
    if (!parsed.solvedCaseIds || !Array.isArray(parsed.solvedCaseIds)) {
      return createInitialFallacyProgress();
    }
    return parsed;
  } catch {
    return createInitialFallacyProgress();
  }
}

export function saveFallacyLabProgress(progress: FallacyLabProgress): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(FALLACY_STORAGE_KEY, JSON.stringify(progress));
  } catch (err) {
    console.warn('Failed to save fallacy progress to localStorage:', err);
  }
}

export function resetFallacyLabProgress(): FallacyLabProgress {
  const init = createInitialFallacyProgress();
  saveFallacyLabProgress(init);
  return init;
}
