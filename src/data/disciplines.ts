import { MathDiscipline } from '@/types/math';

export const disciplines: MathDiscipline[] = [
  {
    id: 'analysis',
    mscCode: '26',
    nameZh: '实分析与微积分',
    nameEn: 'Real Analysis & Calculus',
    color: '#3b82f6', // blue
    icon: 'Activity',
    description: '研究极限、连续性、微分、积分、测度及泛函结构的数学分支。'
  },
  {
    id: 'algebra',
    mscCode: '20',
    nameZh: '近世代数与群论',
    nameEn: 'Abstract Algebra & Group Theory',
    color: '#8b5cf6', // purple
    icon: 'Boxes',
    description: '研究群、环、域、模及代数结构的对称性与同构。'
  },
  {
    id: 'number-theory',
    mscCode: '11',
    nameZh: '数论与算术几何',
    nameEn: 'Number Theory & Arithmetic',
    color: '#10b981', // emerald
    icon: 'Hash',
    description: '探索整数性质、素数分布、同余方程及丢番图方程的古老而深邃的学科。'
  },
  {
    id: 'topology',
    mscCode: '54',
    nameZh: '拓扑学与微分流形',
    nameEn: 'Topology & Differential Forms',
    color: '#f59e0b', // amber
    icon: 'Network',
    description: '研究空间在连续变形下保持不变的性质，从开集公理到光滑流形。'
  },
  {
    id: 'linear-algebra',
    mscCode: '15',
    nameZh: '高等线性代数与内积空间',
    nameEn: 'Linear Algebra & Inner Products',
    color: '#06b6d4', // cyan
    icon: 'Grid3X3',
    description: '向量空间、线性变换、特征值谱理论与内积几何结构。'
  }
];
