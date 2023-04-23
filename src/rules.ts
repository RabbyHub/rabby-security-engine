import { OpenApiService } from "@debank/rabby-api";
import { caseInsensitiveCompare } from "./utils";

export interface UserData {
  originWhitelist: string[];
  originBlacklist: string[];
}

export interface ContextActionData {
  origin?: {
    communityCount: number;
    popularLevel: string;
    url: string;
  };
}

export interface Context extends ContextActionData {
  userData: UserData;
}

export interface NumberValue {
  min: number | null; // 最小值
  minIncluded: boolean; // boolean, 最小值是否为小于等于
  max: number | null; // 最大值，null 代表无限大（小）
  maxIncluded: boolean; // boolean, 最大值是否为大于等于
}

export interface NumberDefine extends NumberValue {
  type: "int" | "float";
}

export interface BooleanDefine {
  type: "boolean";
}

export interface EnumDefine {
  type: "enum";
  list: string[];
  display: Record<string, string>;
}

export enum Level {
  SAFE = "safe",
  WARNING = "warning",
  DANGER = "danger",
  FORBIDDEN = "forbidden",
  ERROR = "error",
}

export type Threshold = {
  [key in Level]?: NumberValue | boolean | string[];
};

export interface RuleConfig {
  id: string; // 规则 id
  enable: boolean; // 是否启用
  valueDescription: string; // value 描述
  valueDefine: NumberDefine | BooleanDefine | EnumDefine; // value 定义
  defaultThreshold: Threshold; // 默认阈值
  customThreshold: Threshold; // 用户自定义阈值
  requires: string[]; // 规则运行依赖的主属性，需要全部有值才执行该规则
  getValue(ctx: Context, apiService: OpenApiService): Promise<any>; // 取值函数，从引擎外部获取数据
}

export const defaultRules: RuleConfig[] = [
  {
    // Origin 被 Rabby 标记为欺诈网址
    id: "1001",
    enable: true,
    valueDescription: "Site has been flagged as fraudulent by Rabby",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      danger: true,
    },
    customThreshold: {},
    requires: ["origin"],
    async getValue(ctx, apiService) {
      const origin = ctx.origin!;
      const { is_scam } = await apiService.getOriginIsScam(origin.url, 'rabby');
      return is_scam;
    },
  },
  {
    // Origin 被 MetaMask 标记为欺诈网址
    id: "1002",
    enable: true,
    valueDescription: "Site has been flagged as fraudulent by MetaMask",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      danger: true,
    },
    customThreshold: {},
    requires: ["origin"],
    async getValue(ctx, apiService) {
      const origin = ctx.origin!;
      const { is_scam } = await apiService.getOriginIsScam(origin.url, 'metamask');
      return is_scam;
    },
  },
  {
    // Origin 被 ScamSniffer 标记为欺诈网址
    id: "1003",
    enable: true,
    valueDescription: "Site has been flagged as fraudulent by ScamSniffer",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      danger: true,
    },
    customThreshold: {},
    requires: ["origin"],
    async getValue(ctx, apiService) {
      const origin = ctx.origin!;
      const { is_scam } = await apiService.getOriginIsScam(origin.url, 'scamsniffer');
      return is_scam;
    },
  },
  {
    // Origin 被知名社区平台收录数
    id: "1004",
    enable: true,
    valueDescription: "The number of community platforms that have listed this site",
    valueDefine: {
      type: "int",
      min: 0,
      minIncluded: true,
      max: 100,
      maxIncluded: true,
    },
    defaultThreshold: {
      danger: {
        max: 0,
        maxIncluded: true,
        min: null,
        minIncluded: false,
      },
      warning: {
        max: 1,
        maxIncluded: true,
        min: 0,
        minIncluded: false,
      },
    },
    customThreshold: {},
    requires: ["origin"],
    async getValue(ctx) {
      const origin = ctx.origin!;
      return origin.communityCount;
    },
  },
  {
    // Origin 使用人数
    id: "1005",
    enable: true,
    valueDescription: "Site popularity",
    valueDefine: {
      type: "enum",
      list: ["very_low", "low", "average", "high"],
      display: {
        very_low: "Very Low",
        low: "Low",
        average: "Average",
        high: "High",
      },
    },
    defaultThreshold: {
      danger: ["very_low"],
      warning: ["low"],
    },
    customThreshold: {},
    requires: ["origin"],
    async getValue(ctx) {
      const origin = ctx.origin!;
      return origin.popularLevel;
    },
  },
  {
    // Origin 在用户黑名单中
    id: "1006",
    enable: true,
    valueDescription: "Site has been added to your blacklist",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      forbidden: true,
    },
    customThreshold: {},
    requires: ["origin"],
    async getValue(ctx) {
      return ctx.userData.originBlacklist.some((item) =>
        caseInsensitiveCompare(item, ctx.origin!.url)
      );
    },
  },
  {
    // Origin 在用户白名单中
    id: "1007",
    enable: true,
    valueDescription: "Site has been added to your whitelist",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      safe: true,
    },
    customThreshold: {},
    requires: ["origin"],
    async getValue(ctx) {
      return ctx.userData.originWhitelist.some((item) =>
        caseInsensitiveCompare(item, ctx.origin!.url)
      );
    },
  },
];
