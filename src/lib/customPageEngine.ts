import { MathNode } from '@/types/math';
import { initialMathNodes } from '@/data/seedData';

export interface CustomPageWidget {
  id: string;
  type:
    | 'cosmos_3d'
    | 'math_compute'
    | 'zfc_campaign'
    | 'fallacy_detective'
    | 'academic_export'
    | 'lean_editor'
    | 'custom_richtext'
    | 'node_showcase';
  title: string;
  description?: string;
  config?: {
    customContent?: string;
    targetNodeId?: string;
    initialDiscipline?: string;
    columns?: 1 | 2;
  };
}

export interface CustomPageConfig {
  id: string;
  slug: string;
  titleZh: string;
  titleEn: string;
  description: string;
  iconName: 'Layout' | 'Sparkles' | 'Atom' | 'Boxes' | 'Layers' | 'Cpu' | 'GraduationCap' | 'FolderPlus';
  category: 'custom' | 'research' | 'course' | 'workshop';
  isPublished: boolean;
  showInNav: boolean;
  createdAt: string;
  updatedAt: string;
  widgets: CustomPageWidget[];
}

export interface PageTemplate {
  id: string;
  nameZh: string;
  nameEn: string;
  category: CustomPageConfig['category'];
  iconName: CustomPageConfig['iconName'];
  descriptionZh: string;
  defaultSlug: string;
  widgets: Array<Omit<CustomPageWidget, 'id'>>;
}

export const PAGE_TEMPLATES: PageTemplate[] = [
  {
    id: 'tmpl-seminar',
    nameZh: '大学前沿讨论班专题模板',
    nameEn: 'Advanced Mathematics Seminar',
    category: 'research',
    iconName: 'Atom',
    descriptionZh: '适用于组织前沿数学物理或高阶几何拓扑研讨，包含导言讲义、3D星系图谱与常微分相空间求解器。',
    defaultSlug: 'advanced-seminar',
    widgets: [
      {
        type: 'custom_richtext',
        title: '专题研讨大纲与核心背景',
        config: {
          customContent: `## 🌌 现代数理几何前沿研讨课\n\n本界面由课程主讲人配置，旨在将抽象流形拓扑与具体微分方程相空间轨道结合。\n\n> **核心研究命题**：\n> 流形上的测地流与积分不变量，探讨切丛上的辛同胚与刘维尔定理。`,
        },
      },
      {
        type: 'cosmos_3d',
        title: '3D 宇宙星系拓扑依赖图谱',
        description: '三维力导向六大学科星云聚类',
      },
      {
        type: 'math_compute',
        title: '客户端 RK4 动力系统模拟器',
        description: '实时数值演化洛伦兹混沌与极限环',
      },
    ],
  },
  {
    id: 'tmpl-olympiad',
    nameZh: '公理推导与反例侦探特训营',
    nameEn: 'Axiomatic & Counterexample Bootcamp',
    category: 'workshop',
    iconName: 'GraduationCap',
    descriptionZh: '聚焦公理化严谨训练，包含 ZFC 创世科技树 RPG、数学伪证明侦探实验室与 Typst 讲义导出。',
    defaultSlug: 'olympiad-bootcamp',
    widgets: [
      {
        type: 'custom_richtext',
        title: '特训营挑战须知',
        config: {
          customContent: `### 🎯 公理严谨性特训目标\n1. 从 9 条 ZFC 公理出发亲手完成 6 大纪元构造\n2. 识别隐藏的除零、复数割线与积分下半连续性证明谬误\n3. 一键编译生成出版级 Typst 研讨课讲义`,
        },
      },
      {
        type: 'zfc_campaign',
        title: 'ZFC 创世科技树战役',
        description: '从公理出发构造现代数学大厦',
      },
      {
        type: 'fallacy_detective',
        title: '数学伪证明侦探实验室',
        description: '侦破隐藏逻辑谬误与经典数学悖论',
      },
      {
        type: 'academic_export',
        title: '出版级学术讲义导出工坊',
        description: '一键生成 LaTeX、Typst 与 Beamer 幻灯片',
      },
    ],
  },
  {
    id: 'tmpl-formal-prover',
    nameZh: 'Lean 4 形式化机器证明实战工坊',
    nameEn: 'Lean 4 Formal Prover Workshop',
    category: 'course',
    iconName: 'Cpu',
    descriptionZh: '专注于形式化数学验证，配备零算力 Lean 4 交互编辑器与 #print axioms 安全审查证书。',
    defaultSlug: 'lean4-workshop',
    widgets: [
      {
        type: 'custom_richtext',
        title: 'Lean 4 形式化导引',
        config: {
          customContent: `### 🛡️ 机器形式化验证实验室\n在浏览器中编写策略（Tactics），体验 \`simp\`, \`ring\`, \`linarith\` 策略树展开并获取机器级别绝对无漏洞认证。`,
        },
      },
      {
        type: 'lean_editor',
        title: 'Lean 4 在线形式化编辑器',
        description: '支持 Mathlib 策略与目标证明状态机',
      },
      {
        type: 'academic_export',
        title: '形式化论文与代码排版导出',
      },
    ],
  },
];

const STORAGE_CUSTOM_PAGES_KEY = 'mathuniverse:custom-pages';
const STORAGE_ADMIN_ROLE_KEY = 'mathuniverse:admin-role-enabled';
const STORAGE_CUSTOM_NODES_KEY = 'mathuniverse:custom-math-nodes';

export const INITIAL_CUSTOM_PAGES: CustomPageConfig[] = [
  {
    id: 'page-quantum-geometry',
    slug: 'quantum-geometry',
    titleZh: '量子几何与微观拓扑研讨厅',
    titleEn: 'Quantum Geometry & Microscopic Topology Seminar',
    description: '管理员定制研讨专题：聚焦非对易几何、曲面曲率与辛流形物理计算',
    iconName: 'Atom',
    category: 'research',
    isPublished: true,
    showInNav: true,
    createdAt: '2026-08-29T10:00:00.000Z',
    updatedAt: '2026-08-29T10:00:00.000Z',
    widgets: [
      {
        id: 'w-1',
        type: 'custom_richtext',
        title: '专题研讨前言与物理背景',
        config: {
          customContent: `## 🌌 量子几何与非交换代数研讨专题\n\n本界面由 **平台管理员** 通过可视化装配器创建，用于组织《现代数学物理基础》专题研究。\n\n> **核心研究命题**：\n> 在普朗克尺度下，经典光滑流形结构可能失效，时空坐标满足非对易代数关系 $[x_i, x_j] = i \\theta_{ij}$。通过将 3D 星系图谱拓扑依赖与常微分动力系统结合，探索微观对称性破缺。`,
        },
      },
      {
        id: 'w-2',
        type: 'cosmos_3d',
        title: '3D 宇宙星系几何拓扑聚类',
        description: '探索几何与拓扑学星云的前置推导网络',
      },
      {
        id: 'w-3',
        type: 'math_compute',
        title: '客户端符号与动力系统求解器',
        description: '实时演化非线性相空间微分散度',
      },
    ],
  },
  {
    id: 'page-axiom-olympiad',
    slug: 'axiom-olympiad',
    titleZh: '公理奥林匹克训练营',
    titleEn: 'Axiomatic Olympiad Bootcamp',
    description: '管理员定制竞赛界面：针对本科生拔尖数学人才的形式化推导与反例侦探特训',
    iconName: 'GraduationCap',
    category: 'course',
    isPublished: true,
    showInNav: true,
    createdAt: '2026-08-29T11:30:00.000Z',
    updatedAt: '2026-08-29T11:30:00.000Z',
    widgets: [
      {
        id: 'w-1',
        type: 'custom_richtext',
        title: '奥林匹克训练营指南',
        config: {
          customContent: `### 🎯 公理奥林匹克集训目标\n1. 从 9 条 ZFC 公理出发完成 6 大纪元构造闯关\n2. 识别隐藏的除零、复数割线与积分下半连续性证明谬误\n3. 一键编译生成 Typst 研讨课讲义`,
        },
      },
      {
        id: 'w-2',
        type: 'zfc_campaign',
        title: 'ZFC 创世科技树战役',
      },
      {
        id: 'w-3',
        type: 'fallacy_detective',
        title: '数学伪证明侦探实验室',
      },
      {
        id: 'w-4',
        type: 'academic_export',
        title: '出版级学术讲义导出工坊',
      },
    ],
  },
];

// Helper to load custom pages from localStorage
export function loadCustomPages(): CustomPageConfig[] {
  if (typeof window === 'undefined') return INITIAL_CUSTOM_PAGES;
  try {
    const raw = window.localStorage.getItem(STORAGE_CUSTOM_PAGES_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_CUSTOM_PAGES_KEY, JSON.stringify(INITIAL_CUSTOM_PAGES));
      return INITIAL_CUSTOM_PAGES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_CUSTOM_PAGES;
  } catch {
    return INITIAL_CUSTOM_PAGES;
  }
}

// Helper to save custom pages
export function saveCustomPages(pages: CustomPageConfig[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_CUSTOM_PAGES_KEY, JSON.stringify(pages));
    window.dispatchEvent(new Event('mathuniverse:custom-pages-updated'));
  } catch (err) {
    console.warn('Failed to save custom pages to localStorage', err);
  }
}

// Helper to get admin role state
export function getIsAdminMode(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(STORAGE_ADMIN_ROLE_KEY) === 'true';
  } catch {
    return false;
  }
}

// Helper to toggle admin role
export function setIsAdminMode(isAdmin: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_ADMIN_ROLE_KEY, isAdmin ? 'true' : 'false');
    window.dispatchEvent(new Event('mathuniverse:admin-role-updated'));
  } catch (err) {
    console.warn('Failed to save admin state to localStorage', err);
  }
}

// Custom Math Nodes Local Storage Store
export function loadActiveMathNodes(): MathNode[] {
  if (typeof window === 'undefined') return initialMathNodes;
  try {
    const raw = window.localStorage.getItem(STORAGE_CUSTOM_NODES_KEY);
    if (!raw) {
      return initialMathNodes;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return initialMathNodes;
  } catch {
    return initialMathNodes;
  }
}

export function saveActiveMathNodes(nodes: MathNode[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_CUSTOM_NODES_KEY, JSON.stringify(nodes));
    window.dispatchEvent(new Event('mathuniverse:nodes-updated'));
  } catch (err) {
    console.warn('Failed to save custom nodes to localStorage', err);
  }
}

export function updateSingleMathNode(updatedNode: MathNode): MathNode[] {
  const currentNodes = loadActiveMathNodes();
  const exists = currentNodes.some((n) => n.id === updatedNode.id);
  let updatedList: MathNode[];

  if (exists) {
    updatedList = currentNodes.map((n) => (n.id === updatedNode.id ? updatedNode : n));
  } else {
    updatedList = [updatedNode, ...currentNodes];
  }

  saveActiveMathNodes(updatedList);
  return updatedList;
}

export function deleteMathNodeById(nodeId: string): MathNode[] {
  const currentNodes = loadActiveMathNodes();
  const updatedList = currentNodes.filter((n) => n.id !== nodeId);
  saveActiveMathNodes(updatedList);
  return updatedList;
}

export function resetMathNodesToSeed(): MathNode[] {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(STORAGE_CUSTOM_NODES_KEY);
    window.dispatchEvent(new Event('mathuniverse:nodes-updated'));
  }
  return initialMathNodes;
}
