/**
 * MathUniverse ZFC to Modern Math RPG Campaign Engine
 * Pure TypeScript implementation of the 6-Epoch mathematical civilization progression,
 * constructive set-theoretic synthesis, proof validation, and RPG state persistence.
 */

import type {
  ZfcAxiomId,
  ZfcAxiomDefinition,
  ConstructedEntity,
  CampaignEpoch,
  UserCampaignProgress,
  UserLevelInfo,
} from '../types/campaign.ts';

// ==========================================
// 1. ZFC Axioms Registry (Formal First-Order Logic)
// ==========================================

export const zfcAxiomRegistry: Record<ZfcAxiomId, ZfcAxiomDefinition> = {
  AXIOM_EXTENSIONALITY: {
    id: 'AXIOM_EXTENSIONALITY',
    nameZh: '外延公理',
    nameEn: 'Axiom of Extensionality',
    firstOrderFormulaLatex: '\\forall x \\forall y (\\forall z (z \\in x \\iff z \\in y) \\implies x = y)',
    intuitionZh: '两个集合相等，当且仅当它们包含完全相同的元素。集合的同一性由其内容唯一确定。',
    intuitionEn: 'Two sets are equal if and only if they contain precisely the same elements. Set identity is determined entirely by membership.',
    epochIntroduced: 1,
    category: 'FOUNDATION',
  },
  AXIOM_EMPTY_SET: {
    id: 'AXIOM_EMPTY_SET',
    nameZh: '空集存在公理',
    nameEn: 'Axiom of Empty Set',
    firstOrderFormulaLatex: '\\exists x \\forall y (y \\notin x)',
    intuitionZh: '存在一个不包含任何元素的集合，记作 \\emptyset。这是整个纯集合论宇宙的创世原点。',
    intuitionEn: 'There exists a set containing no elements, denoted \\emptyset. This is the genesis origin of the set-theoretic cosmos.',
    epochIntroduced: 1,
    category: 'FOUNDATION',
  },
  AXIOM_PAIRING: {
    id: 'AXIOM_PAIRING',
    nameZh: '无序配对公理',
    nameEn: 'Axiom of Pairing',
    firstOrderFormulaLatex: '\\forall x \\forall y \\exists z \\forall w (w \\in z \\iff (w = x \\lor w = y))',
    intuitionZh: '任意两个集合 x 和 y，都可以组合成一个新的无序二元集合 {x, y}。',
    intuitionEn: 'For any two sets x and y, there exists a set {x, y} containing exactly x and y.',
    epochIntroduced: 1,
    category: 'CONSTRUCTION',
  },
  AXIOM_UNION: {
    id: 'AXIOM_UNION',
    nameZh: '并集公理',
    nameEn: 'Axiom of Union',
    firstOrderFormulaLatex: '\\forall \\mathcal{F} \\exists A \\forall x (x \\in A \\iff \\exists Y \\in \\mathcal{F} (x \\in Y))',
    intuitionZh: '任意集合族 \\mathcal{F}，都存在包含所有成员集合元素的大并集 \\bigcup \\mathcal{F}。',
    intuitionEn: 'For any family of sets \\mathcal{F}, there exists a set \\bigcup \\mathcal{F} containing all elements of members of \\mathcal{F}.',
    epochIntroduced: 1,
    category: 'CONSTRUCTION',
  },
  AXIOM_POWER_SET: {
    id: 'AXIOM_POWER_SET',
    nameZh: '幂集公理',
    nameEn: 'Axiom of Power Set',
    firstOrderFormulaLatex: '\\forall x \\exists y \\forall z (z \\in y \\iff z \\subseteq x)',
    intuitionZh: '对任意集合 x，其所有子集构成的集合 \\mathcal{P}(x) 存在。康托尔对角线法证明幂集严格大于原集基数。',
    intuitionEn: 'For any set x, the power set \\mathcal{P}(x) containing all subsets of x exists. Cantor theorem proves |P(x)| > |x|.',
    epochIntroduced: 4,
    category: 'INFINITARY',
  },
  AXIOM_INFINITY: {
    id: 'AXIOM_INFINITY',
    nameZh: '无穷公理',
    nameEn: 'Axiom of Infinity',
    firstOrderFormulaLatex: '\\exists x (\\emptyset \\in x \\land \\forall y \\in x (y \\cup \\{y\\} \\in x))',
    intuitionZh: '存在包含空集且对后继运算封闭的归纳集合，从而在公理系统内宣告无穷自然数集 \\omega 的存在。',
    intuitionEn: 'There exists an inductive set containing the empty set and closed under succession, establishing the infinite set \\omega.',
    epochIntroduced: 2,
    category: 'INFINITARY',
  },
  AXIOM_REPLACEMENT: {
    id: 'AXIOM_REPLACEMENT',
    nameZh: '替换公理模式',
    nameEn: 'Axiom Schema of Replacement',
    firstOrderFormulaLatex: '\\forall x (\\forall y \\in x \\exists! z \\phi(y, z) \\implies \\exists Y \\forall y \\in x \\exists z \\in Y \\phi(y, z))',
    intuitionZh: '若一个类函数将集合 x 的每个元素映射到唯一对象，则其像集也是一个合法的真集合。',
    intuitionEn: 'If a class function maps each element of a set x to a unique object, its image is also a valid set.',
    epochIntroduced: 3,
    category: 'CONSTRUCTION',
  },
  AXIOM_REGULARITY: {
    id: 'AXIOM_REGULARITY',
    nameZh: '正则公理',
    nameEn: 'Axiom of Regularity',
    firstOrderFormulaLatex: '\\forall x (x \\neq \\emptyset \\implies \\exists y \\in x (x \\cap y = \\emptyset))',
    intuitionZh: '任何非空集合 x 都包含一个与 x 不相交的 \\in-极小元。杜绝了集合包含自身的自指怪圈 x \\in x。',
    intuitionEn: 'Every non-empty set x contains an \\in-minimal element disjoint from x, precluding circular sets like x \\in x.',
    epochIntroduced: 2,
    category: 'FOUNDATION',
  },
  AXIOM_CHOICE: {
    id: 'AXIOM_CHOICE',
    nameZh: '选择公理',
    nameEn: 'Axiom of Choice',
    firstOrderFormulaLatex: '\\forall X (\\emptyset \\notin X \\implies \\exists f: X \\to \\bigcup X, \\forall A \\in X (f(A) \\in A))',
    intuitionZh: '对任意互不相交的非空集合族，都存在一个选择函数从每个集合中恰好挑出一个元素。等价于良序定理与佐恩引理。',
    intuitionEn: 'For any collection of non-empty sets, there exists a choice function selecting an element from each set.',
    epochIntroduced: 6,
    category: 'CHOICE',
  },
};

// ==========================================
// 2. The 6 Epochs of Mathematical Civilization
// ==========================================

export const campaignEpochs: CampaignEpoch[] = [
  {
    epochNumber: 1,
    id: 'epoch-1',
    titleZh: '第一纪元：公理创世纪与空集奠基',
    titleEn: 'Epoch I: Axiomatic Genesis & The Empty Set',
    eraDescriptionZh:
      '从宇宙最虚无的原点出发，利用 ZFC 外延公理、空集公理、配对公理与并集公理，严格确立空集唯一性，构造库拉托夫斯基有序对与笛卡尔积。',
    themeColor: 'from-blue-600 to-cyan-500',
    requiredAxiomIds: ['AXIOM_EXTENSIONALITY', 'AXIOM_EMPTY_SET', 'AXIOM_PAIRING', 'AXIOM_UNION'],
    requiredEntityIds: [],
    rewardXp: 150,
    badgeTitle: '虚空奠基者 (Void Founder)',
    constructibleEntities: [
      {
        id: 'entity-empty-set',
        nameZh: '空集 ∅',
        nameEn: 'The Empty Set',
        setNotation: '\\emptyset = \\{\\}',
        formalDefinitionLatex: '\\exists! \\emptyset, \\quad \\forall x (x \\notin \\emptyset)',
        descriptionZh: '不包含任何元素的唯一基础集合，基数为 0，为一切数学构造的基底。',
        requiredAxioms: ['AXIOM_EMPTY_SET', 'AXIOM_EXTENSIONALITY'],
        requiredEntities: [],
        unlockedAtEpoch: 1,
        discipline: 'SET_THEORY',
      },
      {
        id: 'entity-singleton-empty',
        nameZh: '单元素空集 {∅}',
        nameEn: 'Singleton Empty Set',
        setNotation: '\\{\\emptyset\\}',
        formalDefinitionLatex: 'y \\in \\{\\emptyset\\} \\iff y = \\emptyset',
        descriptionZh: '用集合包裹空集所形成的单元素集，基数为 1，构成冯·诺依曼自然数 1 的原型。',
        requiredAxioms: ['AXIOM_PAIRING'],
        requiredEntities: ['entity-empty-set'],
        unlockedAtEpoch: 1,
        discipline: 'SET_THEORY',
      },
      {
        id: 'entity-ordered-pair',
        nameZh: '库拉托夫斯基有序对 (a, b)',
        nameEn: 'Kuratowski Ordered Pair',
        setNotation: '(a, b) := \\{\\{a\\}, \\{a, b\\}\\}',
        formalDefinitionLatex: '(a, b) = (c, d) \\iff a = c \\land b = d',
        descriptionZh: '完全由纯无序集合构造出的具有非对称顺序的二元组，为二元关系与映射奠定基础。',
        requiredAxioms: ['AXIOM_PAIRING'],
        requiredEntities: ['entity-singleton-empty'],
        unlockedAtEpoch: 1,
        discipline: 'SET_THEORY',
      },
      {
        id: 'entity-cartesian-product',
        nameZh: '笛卡尔积 A × B',
        nameEn: 'Cartesian Product',
        setNotation: 'A \\times B := \\{ (a, b) \\mid a \\in A, b \\in B \\}',
        formalDefinitionLatex: 'A \\times B \\subset \\mathcal{P}(\\mathcal{P}(A \\cup B))',
        descriptionZh: '两个集合元素所有可能有序对的集合，解锁几何坐标系与代数二元运算。',
        requiredAxioms: ['AXIOM_PAIRING', 'AXIOM_UNION'],
        requiredEntities: ['entity-ordered-pair'],
        unlockedAtEpoch: 1,
        discipline: 'SET_THEORY',
      },
    ],
    milestoneChallenge: {
      id: 'challenge-epoch-1',
      titleZh: '外延性与有序对构造推导',
      titleEn: 'Extensionality & Ordered Pair Derivation',
      goalFormula: '(a, b) = (c, d) \\iff a = c \\land b = d',
      descriptionZh: '通过外延公理确立空集唯一性，并利用配对公理推导出库拉托夫斯基有序对的特征性质。',
      inferenceSteps: [
        {
          stepNumber: 1,
          instructionZh: '步骤 1：证明空集的唯一性 —— 若存在两个空集 A 和 B，应用哪条公理断言 A = B？',
          validAxiomChoices: ['AXIOM_EXTENSIONALITY'],
          correctFormula: '\\forall z (z \\in A \\iff z \\in B) \\implies A = B',
          formulaChoices: [
            '\\forall z (z \\in A \\iff z \\in B) \\implies A = B',
            '\\exists f: A \\to B \\text{ (Bijective Choice)}',
            'A \\cup B = A \\implies A = B',
          ],
          explanationZh: '正确！由于 A 和 B 均无元素，命题 z ∈ A ↔ z ∈ B 对任意 z 恒为真，由外延公理立即得出 A = B，空集唯一。',
        },
        {
          stepNumber: 2,
          instructionZh: '步骤 2：如何用无序集合构造非对称的有序对 (a, b)？',
          validAxiomChoices: ['AXIOM_PAIRING'],
          correctFormula: '(a, b) := \\{\\{a\\}, \\{a, b\\}\\}',
          formulaChoices: [
            '(a, b) := \\{\\{a\\}, \\{a, b\\}\\}',
            '(a, b) := \\{a, b\\}',
            '(a, b) := \\{a \\cup b, a \\cap b\\}',
          ],
          explanationZh: '正确！库拉托夫斯基构造 { {a}, {a, b} } 巧妙利用单元素子集区分了首项 a 与次项 b。',
        },
        {
          stepNumber: 3,
          instructionZh: '步骤 3：验证有序对相等判定定理：{{a}, {a, b}} = {{c}, {c, d}} 推出什么？',
          validAxiomChoices: ['AXIOM_EXTENSIONALITY'],
          correctFormula: 'a = c \\land b = d',
          formulaChoices: [
            'a = c \\land b = d',
            'a + b = c + d',
            '\\{a, b\\} \\cap \\{c, d\\} = \\emptyset',
          ],
          explanationZh: '正确！交集 ⋂(a, b) = {a} 给出 a = c，继而并集 ⋃(a, b) = {a, b} 给出 b = d。',
        },
      ],
    },
  },

  {
    epochNumber: 2,
    id: 'epoch-2',
    titleZh: '第二纪元：冯·诺依曼序数与皮亚诺算术',
    titleEn: 'Epoch II: Von Neumann Ordinals & Peano Arithmetic',
    eraDescriptionZh:
      '利用无穷公理引入归纳集合，以 0 = ∅，n+1 = n ∪ {n} 的优雅递归构造自然数集 ω = ℕ，借助正则公理消除集合自指，建立数学归纳法。',
    themeColor: 'from-emerald-600 to-teal-500',
    requiredAxiomIds: ['AXIOM_INFINITY', 'AXIOM_REGULARITY', 'AXIOM_PAIRING', 'AXIOM_UNION'],
    requiredEntityIds: ['entity-empty-set', 'entity-singleton-empty'],
    rewardXp: 200,
    badgeTitle: '自然数创生者 (Ordinal Creator)',
    constructibleEntities: [
      {
        id: 'entity-von-neumann-0',
        nameZh: '序数 0',
        nameEn: 'Ordinal 0',
        setNotation: '0 := \\emptyset',
        formalDefinitionLatex: '0 = \\emptyset',
        descriptionZh: '冯·诺依曼序数系统的零元，定义为空集。',
        requiredAxioms: ['AXIOM_EMPTY_SET'],
        requiredEntities: ['entity-empty-set'],
        unlockedAtEpoch: 2,
        discipline: 'ARITHMETIC',
      },
      {
        id: 'entity-von-neumann-1',
        nameZh: '序数 1',
        nameEn: 'Ordinal 1',
        setNotation: '1 := 0 \\cup \\{0\\} = \\{\\emptyset\\}',
        formalDefinitionLatex: '1 = \\{0\\}',
        descriptionZh: '只包含元素 0 的单元素序数，基数为 1。',
        requiredAxioms: ['AXIOM_PAIRING', 'AXIOM_UNION'],
        requiredEntities: ['entity-von-neumann-0'],
        unlockedAtEpoch: 2,
        discipline: 'ARITHMETIC',
      },
      {
        id: 'entity-von-neumann-2',
        nameZh: '序数 2',
        nameEn: 'Ordinal 2',
        setNotation: '2 := 1 \\cup \\{1\\} = \\{0, 1\\} = \\{\\emptyset, \\{\\emptyset\\}\\}',
        formalDefinitionLatex: '2 = \\{0, 1\\}',
        descriptionZh: '包含 0 和 1 两个前置序数的集合，其基数等于 2。',
        requiredAxioms: ['AXIOM_PAIRING', 'AXIOM_UNION'],
        requiredEntities: ['entity-von-neumann-1'],
        unlockedAtEpoch: 2,
        discipline: 'ARITHMETIC',
      },
      {
        id: 'entity-natural-numbers-omega',
        nameZh: '自然数集 ω = ℕ',
        nameEn: 'Set of Natural Numbers ω',
        setNotation: '\\omega := \\{0, 1, 2, 3, \\dots\\}',
        formalDefinitionLatex: '\\omega = \\bigcap \\{ I \\mid \\emptyset \\in I \\land \\forall x \\in I (x \\cup \\{x\\} \\in I) \\}',
        descriptionZh: '最小的归纳集合，所有有限序数的集合，数学中第一个可数无穷基数 ℵ₀。',
        requiredAxioms: ['AXIOM_INFINITY', 'AXIOM_REGULARITY'],
        requiredEntities: ['entity-von-neumann-2'],
        unlockedAtEpoch: 2,
        discipline: 'ARITHMETIC',
      },
      {
        id: 'entity-peano-successor',
        nameZh: '皮亚诺后继函数 S(n)',
        nameEn: 'Peano Successor Map',
        setNotation: 'S(n) := n \\cup \\{n\\}',
        formalDefinitionLatex: 'S: \\omega \\to \\omega, \\quad S(n) \\neq 0 \\land (S(n) = S(m) \\implies n = m)',
        descriptionZh: '生成自然数链条的单射映射，满足皮亚诺五大公理。',
        requiredAxioms: ['AXIOM_INFINITY'],
        requiredEntities: ['entity-natural-numbers-omega'],
        unlockedAtEpoch: 2,
        discipline: 'ARITHMETIC',
      },
    ],
    milestoneChallenge: {
      id: 'challenge-epoch-2',
      titleZh: '自然数集 ω 与皮亚诺公理推导',
      titleEn: 'Natural Number Set ω & Peano Postulates',
      goalFormula: 'S(n) = S(m) \\implies n = m \\quad \\land \\quad \\forall n, S(n) \\neq 0',
      descriptionZh: '利用无穷公理构造包含所有有限序数的集合 ω，并证明后继映射单射性。',
      inferenceSteps: [
        {
          stepNumber: 1,
          instructionZh: '步骤 1：无穷公理直接保证了存在哪种集合？',
          validAxiomChoices: ['AXIOM_INFINITY'],
          correctFormula: '\\exists I (\\emptyset \\in I \\land \\forall y \\in I (y \\cup \\{y\\} \\in I))',
          formulaChoices: [
            '\\exists I (\\emptyset \\in I \\land \\forall y \\in I (y \\cup \\{y\\} \\in I))',
            '\\exists x (x \\times x = x)',
            '\\forall x \\exists y (y = \\mathcal{P}(x))',
          ],
          explanationZh: '正确！无穷公理断言存在一个包含空集且对后继运算封闭的归纳集 I。',
        },
        {
          stepNumber: 2,
          instructionZh: '步骤 2：如何定义最小的自然数序数集合 ω？',
          validAxiomChoices: ['AXIOM_EXTENSIONALITY', 'AXIOM_INFINITY'],
          correctFormula: '\\omega = \\bigcap \\{ K \\subseteq I \\mid K \\text{ is inductive} \\}',
          formulaChoices: [
            '\\omega = \\bigcap \\{ K \\subseteq I \\mid K \\text{ is inductive} \\}',
            '\\omega = \\bigcup_{n=1}^\\infty \\mathcal{P}(n)',
            '\\omega = I \\setminus \\emptyset',
          ],
          explanationZh: '正确！所有归纳子集的任意交集依然是归纳集，且是包含在 I 中的唯一最小归纳集 ω。',
        },
        {
          stepNumber: 3,
          instructionZh: '步骤 3：为什么对于任何自然数 n，后继 S(n) 永远不等于 0？',
          validAxiomChoices: ['AXIOM_EXTENSIONALITY', 'AXIOM_REGULARITY'],
          correctFormula: 'n \\in S(n) = n \\cup \\{n\\} \\implies S(n) \\neq \\emptyset = 0',
          formulaChoices: [
            'n \\in S(n) = n \\cup \\{n\\} \\implies S(n) \\neq \\emptyset = 0',
            'S(n) > 0 \\text{ by real order}',
            '\\text{Because choice axiom forbids null successors}',
          ],
          explanationZh: '正确！因为 n ∈ S(n)，所以 S(n) 必定非空，而 0 = ∅，故 S(n) ≠ 0，皮亚诺公理成立！',
        },
      ],
    },
  },
  {
    epochNumber: 3,
    id: 'epoch-3',
    titleZh: '第三纪元：数系代数化与群环域结构',
    titleEn: 'Epoch III: Algebraic Structures & Number Systems',
    eraDescriptionZh:
      '使用商集等价类构造整数环 ℤ 与有理数域 ℚ，引入群、环、域与同态定理，奠定近代抽象代数的雄伟基石。',
    themeColor: 'from-amber-500 to-orange-600',
    requiredAxiomIds: ['AXIOM_REPLACEMENT', 'AXIOM_PAIRING', 'AXIOM_UNION'],
    requiredEntityIds: ['entity-natural-numbers-omega', 'entity-cartesian-product'],
    rewardXp: 250,
    badgeTitle: '代数结构师 (Algebraic Architect)',
    constructibleEntities: [
      {
        id: 'entity-integers-z',
        nameZh: '整数环 ℤ',
        nameEn: 'Ring of Integers ℤ',
        setNotation: '\\mathbb{Z} := (\\mathbb{N} \\times \\mathbb{N}) / \\sim',
        formalDefinitionLatex: '(a, b) \\sim (c, d) \\iff a + d = b + c',
        descriptionZh: '通过自然数对的形式差等价类构造的完备加法阿贝尔群与整环。',
        requiredAxioms: ['AXIOM_REPLACEMENT'],
        requiredEntities: ['entity-natural-numbers-omega', 'entity-cartesian-product'],
        unlockedAtEpoch: 3,
        discipline: 'ALGEBRA',
      },
      {
        id: 'entity-rationals-q',
        nameZh: '有理数域 ℚ',
        nameEn: 'Field of Rationals ℚ',
        setNotation: '\\mathbb{Q} := (\\mathbb{Z} \\times (\\mathbb{Z} \\setminus \\{0\\})) / \\sim',
        formalDefinitionLatex: '(p, q) \\sim (r, s) \\iff p \\cdot s = q \\cdot r',
        descriptionZh: '整数环的分式域，每一个非零元都拥有乘法逆元的最小特征 0 域。',
        requiredAxioms: ['AXIOM_REPLACEMENT'],
        requiredEntities: ['entity-integers-z'],
        unlockedAtEpoch: 3,
        discipline: 'ALGEBRA',
      },
      {
        id: 'entity-group',
        nameZh: '群结构 (G, ·)',
        nameEn: 'Group Structure',
        setNotation: '(G, \\cdot)',
        formalDefinitionLatex: '\\forall a, b, c \\in G ((a \\cdot b) \\cdot c = a \\cdot (b \\cdot c) \\land \\exists e (a \\cdot e = a) \\land \\exists a^{-1} (a \\cdot a^{-1} = e))',
        descriptionZh: '满足结合律、包含单位元与逆元的代数对称性核心载体。',
        requiredAxioms: ['AXIOM_REPLACEMENT'],
        requiredEntities: ['entity-integers-z'],
        unlockedAtEpoch: 3,
        discipline: 'ALGEBRA',
      },
      {
        id: 'entity-field',
        nameZh: '代数域 (𝔽, +, ·)',
        nameEn: 'Algebraic Field',
        setNotation: '(\\mathbb{F}, +, \\cdot)',
        formalDefinitionLatex: '(\\mathbb{F}, +) \\text{ is Abelian} \\land (\\mathbb{F} \\setminus \\{0\\}, \\cdot) \\text{ is Abelian} \\land \\text{Distributive}',
        descriptionZh: '加法与乘法均构成交换群且满足分配律的代数系统，支持四则运算。',
        requiredAxioms: ['AXIOM_REPLACEMENT'],
        requiredEntities: ['entity-rationals-q', 'entity-group'],
        unlockedAtEpoch: 3,
        discipline: 'ALGEBRA',
      },
    ],
    milestoneChallenge: {
      id: 'challenge-epoch-3',
      titleZh: '商集等价类构造 ℤ 与 ℚ 域公理',
      titleEn: 'Quotient Equivalence Construction of ℤ & ℚ',
      goalFormula: '[(a, b)] + [(c, d)] = [(a+c, b+d)], \\quad [(p, q)] \\cdot [(r, s)] = [(pr, qs)]',
      descriptionZh: '严格证明 (ℕ × ℕ)/~ 的等价关系相容性，建立良定义的加法与乘法运算。',
      inferenceSteps: [
        {
          stepNumber: 1,
          instructionZh: '步骤 1：定义整数等价关系 (a, b) ~ (c, d) 的充分必要条件是什么？',
          validAxiomChoices: ['AXIOM_REPLACEMENT', 'AXIOM_EXTENSIONALITY'],
          correctFormula: 'a + d = b + c',
          formulaChoices: [
            'a + d = b + c',
            'a - c = b - d \\text{ (Unsafe in } \\mathbb{N})',
            'a \\cdot d = b \\cdot c',
          ],
          explanationZh: '正确！在 ℕ 中减法未定义，必须使用纯加法交叉形式 a + d = b + c 保证良定义。',
        },
        {
          stepNumber: 2,
          instructionZh: '步骤 2：证明加法 [(a, b)] + [(c, d)] := [(a+c, b+d)] 与代表元选取无关需要依赖什么？',
          validAxiomChoices: ['AXIOM_REPLACEMENT'],
          correctFormula: '(a \\sim a\' \\land b \\sim b\') \\implies (a+c, b+d) \\sim (a\'+c, b\'+d)',
          formulaChoices: [
            '(a \\sim a\' \\land b \\sim b\') \\implies (a+c, b+d) \\sim (a\'+c, b\'+d)',
            '\\mathbb{N} \\text{ is uncountable}',
            '\\text{Choice axiom implies unique coset representation}',
          ],
          explanationZh: '正确！通过代数加法消去律直接推导代表元替换的不变性。',
        },
        {
          stepNumber: 3,
          instructionZh: '步骤 3：在有理数域 ℚ 中，为什么元素 [(0, 1)] 没有乘法逆元？',
          validAxiomChoices: ['AXIOM_REPLACEMENT', 'AXIOM_EXTENSIONALITY'],
          correctFormula: '\\forall (p, q), \\quad 0 \\cdot q = 0 \\neq 1 \\cdot p \\implies [(0, 1)] \\cdot [(p, q)] \\neq [(1, 1)]',
          formulaChoices: [
            '\\forall (p, q), \\quad 0 \\cdot q = 0 \\neq 1 \\cdot p \\implies [(0, 1)] \\cdot [(p, q)] \\neq [(1, 1)]',
            '\\text{Because 0 is negative in } \\mathbb{Q}',
            '\\text{Because } \\mathbb{Q} \\text{ is not a Hausdorff space}',
          ],
          explanationZh: '正确！域公理要求仅有非零元拥有乘法逆元，零乘任何元素恒为零，这也是一切除以零谬误的根源！',
        },
      ],
    },
  },

  {
    epochNumber: 4,
    id: 'epoch-4',
    titleZh: '第四纪元：实数连续统与微积分完备性',
    titleEn: 'Epoch IV: The Continuum & Real Completeness',
    eraDescriptionZh:
      '激活幂集公理生成不可数势 2^ℵ₀，利用戴德金分割填补有理数的针尖缝隙，建立具备确界公理的完备实数域 ℝ 与柯西分析。',
    themeColor: 'from-purple-600 to-pink-500',
    requiredAxiomIds: ['AXIOM_POWER_SET', 'AXIOM_EXTENSIONALITY'],
    requiredEntityIds: ['entity-rationals-q'],
    rewardXp: 300,
    badgeTitle: '连续统统御者 (Continuum Master)',
    constructibleEntities: [
      {
        id: 'entity-continuum-power-set',
        nameZh: '连续统幂集 𝒫(ℕ)',
        nameEn: 'Power Set 𝒫(ℕ)',
        setNotation: '2^{\\aleph_0} = |\\mathcal{P}(\\mathbb{N})|',
        formalDefinitionLatex: '|\\mathcal{P}(\\mathbb{N})| > |\\mathbb{N}| = \\aleph_0',
        descriptionZh: '由康托尔定理确立的严格大于可数无穷的不可数连续统基数。',
        requiredAxioms: ['AXIOM_POWER_SET'],
        requiredEntities: ['entity-natural-numbers-omega'],
        unlockedAtEpoch: 4,
        discipline: 'ANALYSIS',
      },
      {
        id: 'entity-dedekind-cut',
        nameZh: '戴德金分割 (A, B)',
        nameEn: 'Dedekind Cut',
        setNotation: '\\alpha = (A, B) \\subset \\mathbb{Q} \\times \\mathbb{Q}',
        formalDefinitionLatex: 'A \\neq \\emptyset, A \\neq \\mathbb{Q}, \\quad a \\in A \\land q < a \\implies q \\in A, \\quad A \\text{ has no maximum}',
        descriptionZh: '将有理数划分为下组 A 与上组 B，无缝填补无理数缝隙的实数定义。',
        requiredAxioms: ['AXIOM_POWER_SET'],
        requiredEntities: ['entity-rationals-q'],
        unlockedAtEpoch: 4,
        discipline: 'ANALYSIS',
      },
      {
        id: 'entity-reals-r',
        nameZh: '完备实数域 ℝ',
        nameEn: 'Complete Real Field ℝ',
        setNotation: '\\mathbb{R} := \\{ A \\subset \\mathbb{Q} \\mid A \\text{ is a Dedekind cut} \\}',
        formalDefinitionLatex: '\\mathbb{R} \\text{ is the unique complete Archimedean ordered field}',
        descriptionZh: '满足上确界性质的完备阿基米德有序域，微积分极限与连续性的舞台。',
        requiredAxioms: ['AXIOM_POWER_SET', 'AXIOM_EXTENSIONALITY'],
        requiredEntities: ['entity-dedekind-cut'],
        unlockedAtEpoch: 4,
        discipline: 'ANALYSIS',
      },
      {
        id: 'entity-supremum-property',
        nameZh: '上确界完备性原理',
        nameEn: 'Least Upper Bound Property',
        setNotation: '\\forall S \\subset \\mathbb{R} (S \\neq \\emptyset \\land \\text{bdd above} \\implies \\exists \\sup S \\in \\mathbb{R})',
        formalDefinitionLatex: '\\sup S = \\bigcup_{A \\in S} A',
        descriptionZh: '任何非空有上界的实数子集必存在最小上界，等价于单调有界收敛定理与柯西完备性。',
        requiredAxioms: ['AXIOM_POWER_SET', 'AXIOM_UNION'],
        requiredEntities: ['entity-reals-r'],
        unlockedAtEpoch: 4,
        discipline: 'ANALYSIS',
      },
    ],
    milestoneChallenge: {
      id: 'challenge-epoch-4',
      titleZh: '戴德金分割上确界定理证明',
      titleEn: 'Dedekind Cut Supremum Property Proof',
      goalFormula: '\\sup S = \\bigcup_{A \\in S} A \\in \\mathbb{R}',
      descriptionZh: '在戴德金分割实数体系中，证明非空有上界实数集族 S 的上确界恰好是其下组的并集。',
      inferenceSteps: [
        {
          stepNumber: 1,
          instructionZh: '步骤 1：设 S 是非空有上界的实数（戴德金下割集）集合，令 M = ⋃_{A ∈ S} A。M 是否非空且不为 ℚ？',
          validAxiomChoices: ['AXIOM_UNION', 'AXIOM_POWER_SET'],
          correctFormula: 'M = \\bigcup_{A \\in S} A \\neq \\emptyset \\quad \\land \\quad M \\neq \\mathbb{Q} \\text{ (since } \\exists \\text{ upper bound } B_0)',
          formulaChoices: [
            'M = \\bigcup_{A \\in S} A \\neq \\emptyset \\quad \\land \\quad M \\neq \\mathbb{Q} \\text{ (since } \\exists \\text{ upper bound } B_0)',
            'M = \\bigcap_{A \\in S} A = \\emptyset',
            'M \\text{ requires Axiom of Choice to be well-defined}',
          ],
          explanationZh: '正确！因为 S 非空，所以 M 包含成员的元素故非空；因为 S 有上界，上界的补集元素不属于任何 A，故 M ≠ ℚ。',
        },
        {
          stepNumber: 2,
          instructionZh: '步骤 2：证明 M 向下封闭且无最大元。若 p ∈ M 且 q < p，为什么 q ∈ M？',
          validAxiomChoices: ['AXIOM_UNION'],
          correctFormula: '\\exists A_0 \\in S (p \\in A_0) \\implies q \\in A_0 \\implies q \\in \\bigcup_{A \\in S} A = M',
          formulaChoices: [
            '\\exists A_0 \\in S (p \\in A_0) \\implies q \\in A_0 \\implies q \\in \\bigcup_{A \\in S} A = M',
            '\\text{By Archimedean property } q - p > 0',
            '\\text{By compactness of closed intervals}',
          ],
          explanationZh: '正确！由于每个 A₀ 是戴德金分割，其自身向下封闭，故 q 必属于 A₀，进而属于并集 M。',
        },
        {
          stepNumber: 3,
          instructionZh: '步骤 3：结论：M 是 S 的什么元？',
          validAxiomChoices: ['AXIOM_EXTENSIONALITY', 'AXIOM_POWER_SET'],
          correctFormula: 'M = \\sup S \\in \\mathbb{R}',
          formulaChoices: [
            'M = \\sup S \\in \\mathbb{R}',
            'M = \\inf S \\notin \\mathbb{R}',
            'M = \\lim_{n \\to \\infty} A_n',
          ],
          explanationZh: '正确！M 是包含所有 A ∈ S 的最小割集，直接证明了实数域的戴德金完备性！',
        },
      ],
    },
  },
  {
    epochNumber: 5,
    id: 'epoch-5',
    titleZh: '第五纪元：点集拓扑学与微分流形',
    titleEn: 'Epoch V: General Topology & Smooth Manifolds',
    eraDescriptionZh:
      '摆脱具体度量约束，在开集与邻域的抽象结构上建立拓扑学，解锁豪斯多夫分离公理 T₂、海涅-博雷尔紧致性、光滑流形与切丛。',
    themeColor: 'from-indigo-600 to-violet-500',
    requiredAxiomIds: ['AXIOM_POWER_SET', 'AXIOM_UNION'],
    requiredEntityIds: ['entity-reals-r'],
    rewardXp: 350,
    badgeTitle: '流形制图师 (Manifold Cartographer)',
    constructibleEntities: [
      {
        id: 'entity-topological-space',
        nameZh: '拓扑空间 (X, τ)',
        nameEn: 'Topological Space',
        setNotation: '(X, \\tau), \\quad \\tau \\subset \\mathcal{P}(X)',
        formalDefinitionLatex: '\\emptyset, X \\in \\tau \\land \\bigcup U_i \\in \\tau \\land \\bigcap_{i=1}^n U_i \\in \\tau',
        descriptionZh: '对任意并集与有限交集封闭的开集族 τ，为极限与连续映射提供最广阔的几何舞台。',
        requiredAxioms: ['AXIOM_POWER_SET', 'AXIOM_UNION'],
        requiredEntities: ['entity-reals-r'],
        unlockedAtEpoch: 5,
        discipline: 'TOPOLOGY',
      },
      {
        id: 'entity-hausdorff-t2',
        nameZh: '豪斯多夫 T₂ 空间',
        nameEn: 'Hausdorff T₂ Space',
        setNotation: 'T_2 \\text{ Separation}',
        formalDefinitionLatex: '\\forall x \\neq y \\in X, \\quad \\exists U, V \\in \\tau (x \\in U \\land y \\in V \\land U \\cap V = \\emptyset)',
        descriptionZh: '任意两点均可被不相交开邻域分离的优良空间，保证极限序列的唯一性。',
        requiredAxioms: ['AXIOM_POWER_SET'],
        requiredEntities: ['entity-topological-space'],
        unlockedAtEpoch: 5,
        discipline: 'TOPOLOGY',
      },
      {
        id: 'entity-compactness',
        nameZh: '紧致空间 (Compactness)',
        nameEn: 'Compact Space',
        setNotation: 'X = \\bigcup_{i \\in I} U_i \\implies \\exists \\{i_1, \\dots, i_k\\} (X = \\bigcup_{j=1}^k U_{i_j})',
        formalDefinitionLatex: '\\text{Every open cover has a finite subcover}',
        descriptionZh: '将无限检验坍缩为有限可达性的核心拓扑性质，海涅-博雷尔定理的现代身躯。',
        requiredAxioms: ['AXIOM_POWER_SET'],
        requiredEntities: ['entity-topological-space'],
        unlockedAtEpoch: 5,
        discipline: 'TOPOLOGY',
      },
      {
        id: 'entity-smooth-manifold',
        nameZh: '光滑流形 (M, 𝒜)',
        nameEn: 'Smooth Manifold',
        setNotation: '(M, \\mathcal{A}), \\quad \\phi_\\alpha: U_\\alpha \\to \\mathbb{R}^n',
        formalDefinitionLatex: '\\phi_\\beta \\circ \\phi_\\alpha^{-1} \\in C^\\infty(\\phi_\\alpha(U_\\alpha \\cap U_\\beta), \\mathbb{R}^n)',
        descriptionZh: '局部同胚于 ℝⁿ 且坐标转换映射无限次可微的弯曲空间，现代广义相对论与规范场论的基础。',
        requiredAxioms: ['AXIOM_POWER_SET'],
        requiredEntities: ['entity-hausdorff-t2', 'entity-compactness'],
        unlockedAtEpoch: 5,
        discipline: 'TOPOLOGY',
      },
    ],
    milestoneChallenge: {
      id: 'challenge-epoch-5',
      titleZh: '海涅-博雷尔有限子覆盖与流形图册推导',
      titleEn: 'Heine-Borel Finite Subcover & Manifold Atlas',
      goalFormula: '\\phi_\\beta \\circ \\phi_\\alpha^{-1} \\in C^\\infty \\quad \\land \\quad \\bigcup_{j=1}^k U_{i_j} = K',
      descriptionZh: '验证紧致集有限子覆盖性质，并证明光滑流形局部坐标变换的相容条件。',
      inferenceSteps: [
        {
          stepNumber: 1,
          instructionZh: '步骤 1：海涅-博雷尔定理断言：在欧氏空间 ℝⁿ 中，子集 K 紧致的充要条件是什么？',
          validAxiomChoices: ['AXIOM_POWER_SET'],
          correctFormula: 'K \\text{ is Compact} \\iff K \\text{ is Closed and Bounded in } \\mathbb{R}^n',
          formulaChoices: [
            'K \\text{ is Compact} \\iff K \\text{ is Closed and Bounded in } \\mathbb{R}^n',
            'K \\text{ is Compact} \\iff K \\text{ is Connected and Open}',
            'K \\text{ is Compact} \\iff |K| < \\infty',
          ],
          explanationZh: '正确！在有限维欧氏空间中，紧致性等价于有界闭集。在一般拓扑空间中，紧致性定义为任意开覆盖存在有限子覆盖。',
        },
        {
          stepNumber: 2,
          instructionZh: '步骤 2：为什么紧致空间上的连续实值函数必然能达到最大值与最小值？',
          validAxiomChoices: ['AXIOM_EXTENSIONALITY', 'AXIOM_POWER_SET'],
          correctFormula: 'f(K) \\subset \\mathbb{R} \\text{ is compact} \\implies f(K) \\text{ is closed & bounded} \\implies \\sup f(K) \\in f(K)',
          formulaChoices: [
            'f(K) \\subset \\mathbb{R} \\text{ is compact} \\implies f(K) \\text{ is closed & bounded} \\implies \\sup f(K) \\in f(K)',
            '\\text{Because derivatives are zero at boundaries}',
            '\\text{By intermediate value theorem on rationals}',
          ],
          explanationZh: '正确！连续映射保持紧致性，故像集 f(K) 是 ℝ 中的有界闭集，上确界和下确界必在集合内被取到（极值定理）。',
        },
        {
          stepNumber: 3,
          instructionZh: '步骤 3：光滑流形图册 𝒜 中两个重叠卡 (U_α, φ_α) 与 (U_β, φ_β) 的转移函数必须满足什么条件？',
          validAxiomChoices: ['AXIOM_POWER_SET'],
          correctFormula: '\\phi_\\beta \\circ \\phi_\\alpha^{-1}: \\phi_\\alpha(U_\\alpha \\cap U_\\beta) \\to \\phi_\\beta(U_\\alpha \\cap U_\\beta) \\text{ is a } C^\\infty \\text{ Diffeomorphism}',
          formulaChoices: [
            '\\phi_\\beta \\circ \\phi_\\alpha^{-1}: \\phi_\\alpha(U_\\alpha \\cap U_\\beta) \\to \\phi_\\beta(U_\\alpha \\cap U_\\beta) \\text{ is a } C^\\infty \\text{ Diffeomorphism}',
            '\\phi_\\beta \\circ \\phi_\\alpha^{-1} = \\text{id}',
            'U_\\alpha \\cap U_\\beta = \\emptyset',
          ],
          explanationZh: '正确！卡间转移映射的光滑微分同胚性保证了在流形上做微积分（导数、切向量、微分形式、斯托克斯定理）的良定义！',
        },
      ],
    },
  },

  {
    epochNumber: 6,
    id: 'epoch-6',
    titleZh: '第六纪元：现代数学、范畴论与形式化证明',
    titleEn: 'Epoch VI: Modern Math, Category Theory & Lean 4',
    eraDescriptionZh:
      '掌握选择公理 AC 与佐恩引理，探索无限维希尔伯特空间算子谱系，攀登范畴论伴随函子宏观架构，最终融入 Lean 4 形式化验证机器内核。',
    themeColor: 'from-rose-600 via-purple-600 to-indigo-600',
    requiredAxiomIds: ['AXIOM_CHOICE'],
    requiredEntityIds: ['entity-topological-space', 'entity-smooth-manifold', 'entity-field'],
    rewardXp: 500,
    badgeTitle: '形式化大宗师 (Grand Formalist Master)',
    constructibleEntities: [
      {
        id: 'entity-zorns-lemma',
        nameZh: '佐恩引理 (Zorn\'s Lemma)',
        nameEn: 'Zorn\'s Lemma',
        setNotation: '(P, \\le) \\text{ inductive posets have maximal elements}',
        formalDefinitionLatex: '\\forall \\text{chain } C \\subset P (\\exists u \\in P, \\forall c \\in C (c \\le u)) \\implies \\exists m \\in P (m \\le x \\implies x = m)',
        descriptionZh: '等价于选择公理与良序定理的强大存在性工具，代数基底与哈恩-巴拿赫定理的发动机。',
        requiredAxioms: ['AXIOM_CHOICE'],
        requiredEntities: ['entity-topological-space'],
        unlockedAtEpoch: 6,
        discipline: 'SET_THEORY',
      },
      {
        id: 'entity-hilbert-space',
        nameZh: '希尔伯特空间 ℋ',
        nameEn: 'Hilbert Space',
        setNotation: '\\mathcal{H} = (V, \\langle \\cdot, \\cdot \\rangle)',
        formalDefinitionLatex: '\\langle u, v \\rangle = \\overline{\\langle v, u \\rangle} \\land \\|u\\| = \\sqrt{\\langle u, u \\rangle} \\land \\mathcal{H} \\text{ is Cauchy complete}',
        descriptionZh: '完备无限维内积空间，量子力学波函数与泛函分析傅里叶展开的严格载体。',
        requiredAxioms: ['AXIOM_CHOICE', 'AXIOM_POWER_SET'],
        requiredEntities: ['entity-reals-r', 'entity-field'],
        unlockedAtEpoch: 6,
        discipline: 'ANALYSIS',
      },
      {
        id: 'entity-category-theory',
        nameZh: '范畴 𝒞 与函子 F',
        nameEn: 'Category 𝒞 & Functor F',
        setNotation: '\\mathcal{C} = (\\mathrm{Ob}(\\mathcal{C}), \\mathrm{Hom}(\\mathcal{C}))',
        formalDefinitionLatex: 'f \\circ (g \\circ h) = (f \\circ g) \\circ h \\land f \\circ \\mathrm{id}_A = f = \\mathrm{id}_B \\circ f',
        descriptionZh: '数学结构之结构，将代数、几何与逻辑抽象为对象与态射的高维宇宙。',
        requiredAxioms: ['AXIOM_REPLACEMENT'],
        requiredEntities: ['entity-field'],
        unlockedAtEpoch: 6,
        discipline: 'CATEGORY_THEORY',
      },
      {
        id: 'entity-adjunction',
        nameZh: '伴随函子对 F ⊣ G',
        nameEn: 'Adjoint Functor Pair',
        setNotation: 'F \\dashv G: \\quad \\mathcal{C} \\rightleftarrows \\mathcal{D}',
        formalDefinitionLatex: '\\mathrm{Hom}_{\\mathcal{D}}(F(C), D) \\cong \\mathrm{Hom}_{\\mathcal{C}}(C, G(D))',
        descriptionZh: '“伴随函子无处不在”（Saunders Mac Lane），统摄自由对象、张量积与万有性质的皇冠定理。',
        requiredAxioms: ['AXIOM_REPLACEMENT'],
        requiredEntities: ['entity-category-theory'],
        unlockedAtEpoch: 6,
        discipline: 'CATEGORY_THEORY',
      },
      {
        id: 'entity-lean4-kernel',
        nameZh: 'Lean 4 形式化内核 (CiC)',
        nameEn: 'Lean 4 Formal Kernel',
        setNotation: '\\text{Calculus of Inductive Constructions (CiC)}',
        formalDefinitionLatex: '\\Gamma \\vdash t : T \\quad (\\text{Curry-Howard-Lambek Correspondence})',
        descriptionZh: '利用依值类型论将数学证明转化为计算机完全可判定的项归约检验，消除人类推导的一切含混与漏洞。',
        requiredAxioms: ['AXIOM_EXTENSIONALITY', 'AXIOM_CHOICE'],
        requiredEntities: ['entity-category-theory', 'entity-hilbert-space'],
        unlockedAtEpoch: 6,
        discipline: 'CATEGORY_THEORY',
      },
    ],
    milestoneChallenge: {
      id: 'challenge-epoch-6',
      titleZh: '选择公理、伴随函子与形式化证明',
      titleEn: 'Axiom of Choice, Adjunctions & Formal Verification',
      goalFormula: '\\mathrm{Hom}_{\\mathcal{D}}(F(C), D) \\cong \\mathrm{Hom}_{\\mathcal{C}}(C, G(D)) \\quad \\land \\quad \\Gamma \\vdash p : \\mathrm{Thm}',
      descriptionZh: '利用佐恩引理建立哈恩-巴拿赫泛函延拓定理，确立范畴伴随同构，并通过柯里-霍华德同构在 Lean 4 中完成无漏洞机检。',
      inferenceSteps: [
        {
          stepNumber: 1,
          instructionZh: '步骤 1：在无限维向量空间中，选择公理 AC 的哪种等价形式是证明任意向量空间存在哈梅尔基 (Hamel Basis) 的关键？',
          validAxiomChoices: ['AXIOM_CHOICE'],
          correctFormula: '\\text{Zorn\'s Lemma on linearly independent subset posets } (\\mathcal{L}, \\subseteq)',
          formulaChoices: [
            '\\text{Zorn\'s Lemma on linearly independent subset posets } (\\mathcal{L}, \\subseteq)',
            '\\text{Cantor\'s Intersection Theorem}',
            '\\text{Gram-Schmidt finite induction algorithm}',
          ],
          explanationZh: '正确！任何线性无关子集构成的偏序集中，任意全序链由其并集给出的上界，由佐恩引理存在极大元，即为全空间的哈梅尔基。',
        },
        {
          stepNumber: 2,
          instructionZh: '步骤 2：范畴论中伴随函子对 F ⊣ G 的自然同构表达是什么？',
          validAxiomChoices: ['AXIOM_REPLACEMENT', 'AXIOM_CHOICE'],
          correctFormula: '\\mathrm{Hom}_{\\mathcal{D}}(F(C), D) \\cong \\mathrm{Hom}_{\\mathcal{C}}(C, G(D))',
          formulaChoices: [
            '\\mathrm{Hom}_{\\mathcal{D}}(F(C), D) \\cong \\mathrm{Hom}_{\\mathcal{C}}(C, G(D))',
            'F(C) \\times G(D) = \\emptyset',
            '\\mathrm{Ob}(\\mathcal{C}) = \\mathrm{Ob}(\\mathcal{D})',
          ],
          explanationZh: '正确！左函子 F 与右函子 G 之间的态射双射自然同构定义了范畴论最高统一视角的伴随性。',
        },
        {
          stepNumber: 3,
          instructionZh: '步骤 3：柯里-霍华德-兰贝克同构 (Curry-Howard-Lambek) 的三位一体本质是什么？',
          validAxiomChoices: ['AXIOM_EXTENSIONALITY', 'AXIOM_CHOICE'],
          correctFormula: '\\text{Propositions as Types, Proofs as Programs, Categories as Cartesians}',
          formulaChoices: [
            '\\text{Propositions as Types, Proofs as Programs, Categories as Cartesians}',
            '\\text{Numbers as Sets, Functions as Graphs, Operations as Matrices}',
            '\\text{Algebra as Geometry, Topology as Groups, Logic as Truth Tables}',
          ],
          explanationZh: '正确！命题即类型，证明即程序项，范畴即语义。当 Lean 4 内核成功类型检查程序项通过时，该数学定理获得永恒的机器形式化认证！',
        },
      ],
    },
  },
];

// ==========================================
// 3. Level & XP Mechanics
// ==========================================

export const USER_LEVEL_TITLES: Array<{ minXp: number; title: string }> = [
  { minXp: 0, title: '虚空学徒 (Apprentice of the Void)' },
  { minXp: 200, title: '公理建构师 (Axiom Architect)' },
  { minXp: 500, title: '代数拓荒者 (Algebraic Pioneer)' },
  { minXp: 900, title: '连续统探险家 (Continuum Explorer)' },
  { minXp: 1400, title: '流形制图师 (Manifold Cartographer)' },
  { minXp: 2000, title: '形式化大宗师 (Grand Formalist Master)' },
];

export function calculateUserLevel(totalXp: number): UserLevelInfo {
  let level = 1;
  let title = USER_LEVEL_TITLES[0].title;

  for (let i = USER_LEVEL_TITLES.length - 1; i >= 0; i--) {
    if (totalXp >= USER_LEVEL_TITLES[i].minXp) {
      level = i + 1;
      title = USER_LEVEL_TITLES[i].title;
      break;
    }
  }

  const currentLevelMin = USER_LEVEL_TITLES[level - 1]?.minXp ?? 0;
  const nextLevelMin = USER_LEVEL_TITLES[level]?.minXp ?? currentLevelMin + 500;
  const currentLevelXp = Math.max(0, totalXp - currentLevelMin);
  const neededXp = nextLevelMin - currentLevelMin;
  const progressPercent = Math.min(100, Math.round((currentLevelXp / (neededXp || 1)) * 100));

  return {
    level,
    title,
    currentLevelXp,
    nextLevelXp: nextLevelMin,
    progressPercent,
  };
}

// ==========================================
// 4. State Management & Engine Functions
// ==========================================

export function createInitialProgress(): UserCampaignProgress {
  return {
    unlockedEpochs: [1],
    unlockedAxioms: ['AXIOM_EXTENSIONALITY', 'AXIOM_EMPTY_SET'],
    inventoryEntities: ['entity-empty-set'],
    totalXp: 100,
    currentStreak: 1,
    completedChallenges: [],
    activeStepPerEpoch: { 1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1 },
    lastUpdated: new Date().toISOString(),
  };
}

export function getAllEpochs(): CampaignEpoch[] {
  return campaignEpochs;
}

export function getEpoch(epochNumber: number): CampaignEpoch | undefined {
  return campaignEpochs.find((e) => e.epochNumber === epochNumber);
}

export function getAllAxioms(): ZfcAxiomDefinition[] {
  return Object.values(zfcAxiomRegistry);
}

export function getAxiom(axiomId: ZfcAxiomId): ZfcAxiomDefinition | undefined {
  return zfcAxiomRegistry[axiomId];
}

export function unlockAxiom(
  progress: UserCampaignProgress,
  axiomId: ZfcAxiomId
): UserCampaignProgress {
  if (progress.unlockedAxioms.includes(axiomId)) {
    return progress;
  }

  return {
    ...progress,
    unlockedAxioms: [...progress.unlockedAxioms, axiomId],
    totalXp: progress.totalXp + 30,
    lastUpdated: new Date().toISOString(),
  };
}

export function canUnlockEpoch(
  progress: UserCampaignProgress,
  epochNumber: number
): { canUnlock: boolean; missingAxioms: ZfcAxiomId[]; missingEntities: string[] } {
  const epoch = getEpoch(epochNumber);
  if (!epoch) {
    return { canUnlock: false, missingAxioms: [], missingEntities: [] };
  }

  const missingAxioms = epoch.requiredAxiomIds.filter(
    (axId) => !progress.unlockedAxioms.includes(axId)
  );

  const missingEntities = epoch.requiredEntityIds.filter(
    (entId) => !progress.inventoryEntities.includes(entId)
  );

  const canUnlock = missingAxioms.length === 0 && missingEntities.length === 0;
  return { canUnlock, missingAxioms, missingEntities };
}

export function unlockEpoch(
  progress: UserCampaignProgress,
  epochNumber: number
): UserCampaignProgress {
  if (progress.unlockedEpochs.includes(epochNumber)) {
    return progress;
  }

  return {
    ...progress,
    unlockedEpochs: [...progress.unlockedEpochs, epochNumber],
    totalXp: progress.totalXp + 50,
    lastUpdated: new Date().toISOString(),
  };
}

export function canSynthesizeEntity(
  progress: UserCampaignProgress,
  entityId: string
): {
  canSynthesize: boolean;
  missingAxioms: ZfcAxiomId[];
  missingEntities: string[];
  entity?: ConstructedEntity;
} {
  let targetEntity: ConstructedEntity | undefined;
  for (const ep of campaignEpochs) {
    const found = ep.constructibleEntities.find((e) => e.id === entityId);
    if (found) {
      targetEntity = found;
      break;
    }
  }

  if (!targetEntity) {
    return { canSynthesize: false, missingAxioms: [], missingEntities: [] };
  }

  const missingAxioms = targetEntity.requiredAxioms.filter(
    (axId) => !progress.unlockedAxioms.includes(axId)
  );
  const missingEntities = targetEntity.requiredEntities.filter(
    (entId) => !progress.inventoryEntities.includes(entId)
  );

  const canSynthesize = missingAxioms.length === 0 && missingEntities.length === 0;
  return { canSynthesize, missingAxioms, missingEntities, entity: targetEntity };
}

export function synthesizeEntity(
  progress: UserCampaignProgress,
  entityId: string
): {
  success: boolean;
  progress: UserCampaignProgress;
  message: string;
  entity?: ConstructedEntity;
} {
  if (progress.inventoryEntities.includes(entityId)) {
    return {
      success: true,
      progress,
      message: '该数学实体已在物品栏中。',
    };
  }

  const check = canSynthesizeEntity(progress, entityId);
  if (!check.canSynthesize || !check.entity) {
    const entName = check.entity?.nameZh || entityId;
    return {
      success: false,
      progress,
      message: '缺少前置公理或前置数学实体，无法合成 ' + entName + '。',
      entity: check.entity,
    };
  }

  const updatedProgress: UserCampaignProgress = {
    ...progress,
    inventoryEntities: [...progress.inventoryEntities, entityId],
    totalXp: progress.totalXp + 40,
    lastUpdated: new Date().toISOString(),
  };

  return {
    success: true,
    progress: updatedProgress,
    message: '成功合成数学实体【' + check.entity.nameZh + '】！获得 +40 XP',
    entity: check.entity,
  };
}

export function verifyMilestoneStep(
  epochNumber: number,
  stepNumber: number,
  selectedAxiom: ZfcAxiomId,
  selectedFormula: string
): {
  isCorrect: boolean;
  explanation: string;
  isLastStep: boolean;
  nextStepNumber: number;
} {
  const epoch = getEpoch(epochNumber);
  if (!epoch) {
    return {
      isCorrect: false,
      explanation: '未知纪元编号。',
      isLastStep: false,
      nextStepNumber: stepNumber,
    };
  }

  const step = epoch.milestoneChallenge.inferenceSteps.find((s) => s.stepNumber === stepNumber);
  if (!step) {
    return {
      isCorrect: false,
      explanation: '步骤未找到。',
      isLastStep: false,
      nextStepNumber: stepNumber,
    };
  }

  const axiomMatches = step.validAxiomChoices.includes(selectedAxiom);
  const formulaMatches = step.correctFormula.trim() === selectedFormula.trim();

  if (axiomMatches && formulaMatches) {
    const isLastStep = stepNumber >= epoch.milestoneChallenge.inferenceSteps.length;
    return {
      isCorrect: true,
      explanation: step.explanationZh,
      isLastStep,
      nextStepNumber: isLastStep ? stepNumber : stepNumber + 1,
    };
  } else if (!axiomMatches) {
    return {
      isCorrect: false,
      explanation: '所选公理不适用于当前推导步骤，请仔细审阅公理前提条件。',
      isLastStep: false,
      nextStepNumber: stepNumber,
    };
  } else {
    return {
      isCorrect: false,
      explanation: '公理选取正确，但推导所得的目标公式不精确或逻辑跳步，请重新选择公式。',
      isLastStep: false,
      nextStepNumber: stepNumber,
    };
  }
}

export function completeEpochChallenge(
  progress: UserCampaignProgress,
  epochNumber: number
): {
  progress: UserCampaignProgress;
  rewardedXp: number;
  badgeAwarded: string;
} {
  const epoch = getEpoch(epochNumber);
  if (!epoch) {
    return { progress, rewardedXp: 0, badgeAwarded: '' };
  }

  const challengeId = epoch.milestoneChallenge.id;
  const isAlreadyCompleted = progress.completedChallenges.includes(challengeId);

  const rewardedXp = isAlreadyCompleted ? 20 : epoch.rewardXp;
  const completedChallenges = isAlreadyCompleted
    ? progress.completedChallenges
    : [...progress.completedChallenges, challengeId];

  // Auto-unlock next epoch if exists
  const nextEpochNum = epochNumber + 1;
  const unlockedEpochs =
    nextEpochNum <= 6 && !progress.unlockedEpochs.includes(nextEpochNum)
      ? [...progress.unlockedEpochs, nextEpochNum]
      : progress.unlockedEpochs;

  const nextEpoch = getEpoch(nextEpochNum);
  let unlockedAxioms = [...progress.unlockedAxioms];
  if (nextEpoch) {
    // Also unlock first required axiom of next epoch to smooth progression
    for (const ax of nextEpoch.requiredAxiomIds) {
      if (!unlockedAxioms.includes(ax)) {
        unlockedAxioms.push(ax);
        break;
      }
    }
  }

  const updatedProgress: UserCampaignProgress = {
    ...progress,
    completedChallenges,
    unlockedEpochs,
    unlockedAxioms,
    totalXp: progress.totalXp + rewardedXp,
    lastUpdated: new Date().toISOString(),
  };

  return {
    progress: updatedProgress,
    rewardedXp,
    badgeAwarded: epoch.badgeTitle,
  };
}

// ==========================================
// 5. LocalStorage Persistence with SSR Fallback
// ==========================================

const STORAGE_KEY = 'mathuniverse_zfc_campaign_progress_v2';

export function loadProgressFromStorage(): UserCampaignProgress {
  if (typeof window === 'undefined') {
    return createInitialProgress();
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialProgress();
    const parsed = JSON.parse(raw);
    if (!parsed.unlockedEpochs || !Array.isArray(parsed.unlockedEpochs)) {
      return createInitialProgress();
    }
    return parsed;
  } catch {
    return createInitialProgress();
  }
}

export function saveProgressToStorage(progress: UserCampaignProgress): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (err) {
    console.warn('Failed to save campaign progress to localStorage:', err);
  }
}

export function resetProgress(): UserCampaignProgress {
  const initial = createInitialProgress();
  saveProgressToStorage(initial);
  return initial;
}
