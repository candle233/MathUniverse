import { MathNode } from '@/types/math';

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
