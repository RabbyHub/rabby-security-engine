interface Context {
  origin?: string;
}

interface NumberValue {
  min: number | null, // 最小值
  minIncluded: boolean, // boolean, 最小值是否为小于等于
  max: number | null, // 最大值，null 代表无限大（小）
  maxIncluded: boolean // boolean, 最大值是否为大于等于
}

export interface NumberDefine extends NumberValue {
  type: 'int' | 'float'
}

export interface BooleanDefine {
  type: 'boolean'
}

export interface EnumDefine {
  type: 'enum'
  list: string[]
  display: Record<string, string>
}

export enum Level {
  SAFE = 'safe',
  WARNING = 'warning',
  DANGER = 'danger',
  FORBIDDEN = 'forbidden',
}

export type Threshold = {
  [key in Level]?: NumberDefine | boolean | string[]
};

export interface RuleConfig {
  id: string // 规则 id
  enable: boolean // 是否启用
  valueDescription: string // value 描述
  valueDefine: NumberDefine | BooleanDefine | EnumDefine // value 定义
  defaultThreshold: Threshold // 默认阈值
  customThreshold: Threshold // 用户自定义阈值
  requires: string[] // 规则运行依赖的主属性，需要全部有值才执行该规则
  getValue(ctx: Context): Promise<any> // 取值函数，从引擎外部获取数据
}

export const defaultRules: RuleConfig[] = [
  {
    id: '1001',
    enable: true,
    valueDescription: '',
    valueDefine: {
      type: 'boolean'
    },
    defaultThreshold: {
      forbidden: true,
    },
    customThreshold: {},
    requires: ['origin'],
    async getValue(ctx) {
      // TODO
      return true
    }
  }
];