import { OpenApiService } from "@debank/rabby-api";
import { caseInsensitiveCompare } from "./utils";
import { TokenItem } from "@debank/rabby-api/dist/types";

export interface ContractAddress {
  chainId: string;
  address: string;
}

export interface UserData {
  originWhitelist: string[];
  originBlacklist: string[];
  contractWhitelist: ContractAddress[];
  contractBlacklist: ContractAddress[];
  addressWhitelist: string[];
  addressBlacklist: string[];
}

export interface ContextActionData {
  origin?: {
    communityCount: number;
    popularLevel: string;
    url: string;
  };
  swap?: {
    receiveTokenIsScam: boolean;
    receiveTokenIsFake: boolean;
    receiver: string;
    from: string;
    slippageTolerance: number;
    usdValuePercentage: number;
    chainId: string;
    contractAddress: string;
  };
  send?: {
    to: string;
    hasTransfer: boolean;
    contract: {
      chains: string[];
    } | null;
    chainId: string;
    cex: {
      id: string;
      isDeposit: boolean;
      supportToken?: boolean;
    } | null;
    isTokenContract: boolean;
    usedChainList: string[];
  };
  tokenApprove?: {
    chainId: string;
    spender: string;
    isEOA: boolean;
    riskExposure: number;
    deployDays: number;
    hasInteracted: boolean;
    isDanger: boolean;
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
  type: "int" | "float" | "percent";
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
  CLOSED = "closed",
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
    valueDescription: "Site has been flagged as phishing by Rabby",
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
      const { is_scam } = await apiService.getOriginIsScam(origin.url, "rabby");
      return is_scam;
    },
  },
  {
    // Origin 被 MetaMask 标记为欺诈网址
    id: "1002",
    enable: true,
    valueDescription: "Site has been flagged as phishing by MetaMask",
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
      const { is_scam } = await apiService.getOriginIsScam(
        origin.url,
        "metamask"
      );
      return is_scam;
    },
  },
  {
    // Origin 被 ScamSniffer 标记为欺诈网址
    id: "1003",
    enable: true,
    valueDescription: "Site has been flagged as phishing by ScamSniffer",
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
      const { is_scam } = await apiService.getOriginIsScam(
        origin.url,
        "scamsniffer"
      );
      return is_scam;
    },
  },
  {
    // Origin 被知名社区平台收录数
    id: "1004",
    enable: true,
    valueDescription:
      "The number of community platforms that have listed this site",
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
      list: ["very_low", "low", "medium", "high"],
      display: {
        very_low: "Very Low",
        low: "Low",
        medium: "Medium",
        high: "High",
      },
    },
    defaultThreshold: {
      danger: ["very_low"],
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
  {
    // receive token 是否被标记为假资产
    id: "1008",
    enable: true,
    valueDescription: "receive token 是否被标记为假资产",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      danger: true,
    },
    customThreshold: {},
    requires: ["swap"],
    async getValue(ctx) {
      return ctx.swap!.receiveTokenIsFake;
    },
  },
  {
    // receive token 是否被标记为垃圾资产
    id: "1009",
    enable: true,
    valueDescription: "receive token 是否被标记为垃圾资产",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      warning: true,
    },
    customThreshold: {},
    requires: ["swap"],
    async getValue(ctx) {
      return ctx.swap!.receiveTokenIsScam;
    },
  },
  {
    // receiver 是其他地址且不在白名单
    id: "1010",
    enable: true,
    valueDescription: "receiver 是其他地址且不在白名单",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      danger: true,
    },
    customThreshold: {},
    requires: ["swap"],
    async getValue(ctx) {
      const { receiver, from } = ctx.swap!;
      return !(
        caseInsensitiveCompare(from, receiver) ||
        ctx.userData.addressWhitelist.includes(receiver.toLowerCase())
      );
    },
  },
  {
    // 交易滑点
    id: "1011",
    enable: true,
    valueDescription: "交易滑点",
    valueDefine: {
      type: "percent",
      min: null,
      minIncluded: false,
      max: 100,
      maxIncluded: true,
    },
    defaultThreshold: {
      danger: {
        max: 100,
        maxIncluded: true,
        min: 20,
        minIncluded: false,
      },
      warning: {
        max: 20,
        maxIncluded: true,
        min: 10,
        minIncluded: true,
      },
    },
    customThreshold: {},
    requires: ["swap"],
    async getValue(ctx) {
      const { slippageTolerance } = ctx.swap!;
      return slippageTolerance * 100;
    },
  },
  {
    // 美元价值变化
    id: "1012",
    enable: true,
    valueDescription: "美元价值变化",
    valueDefine: {
      type: "percent",
      min: -100,
      minIncluded: true,
      max: null,
      maxIncluded: false,
    },
    defaultThreshold: {
      danger: {
        max: -20,
        maxIncluded: false,
        min: -100,
        minIncluded: true,
      },
      warning: {
        max: -10,
        maxIncluded: true,
        min: -20,
        minIncluded: true,
      },
    },
    customThreshold: {},
    requires: ["swap"],
    async getValue(ctx) {
      const { usdValuePercentage } = ctx.swap!;
      return usdValuePercentage * 100;
    },
  },
  {
    // 交互合约在用户合约黑名单且在当前链上
    id: "1014",
    enable: true,
    valueDescription: "交互合约在用户合约黑名单且在当前链上",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      forbidden: true,
    },
    customThreshold: {},
    requires: ["swap"],
    async getValue(ctx) {
      const { chainId, contractAddress } = ctx.swap!;
      return ctx.userData.contractBlacklist.some(
        (item) =>
          item.chainId === chainId &&
          caseInsensitiveCompare(item.address, contractAddress)
      );
    },
  },
  {
    // 交互合约在用户合约黑名单且不在当前链上
    id: "1015",
    enable: true,
    valueDescription: "交互合约在用户合约黑名单且不在当前链上",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      warning: true,
    },
    customThreshold: {},
    requires: ["swap"],
    async getValue(ctx) {
      const { chainId, contractAddress } = ctx.swap!;
      return ctx.userData.contractBlacklist.some(
        (item) =>
          item.chainId !== chainId &&
          caseInsensitiveCompare(item.address, contractAddress)
      );
    },
  },
  {
    // Receive 地址是一个 Token 合约地址
    id: "1016",
    enable: true,
    valueDescription: "Receive 地址是一个 Token 合约地址",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      danger: true,
    },
    customThreshold: {},
    requires: ["send"],
    async getValue(ctx) {
      const { isTokenContract } = ctx.send!;
      return isTokenContract;
    },
  },
  {
    // Receive 地址在当前链没有交易历史
    id: "1017",
    enable: true,
    valueDescription: "Receive 地址在当前链没有交易历史",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      warning: true,
    },
    customThreshold: {},
    requires: ["send"],
    async getValue(ctx) {
      const { usedChainList, chainId } = ctx.send!;
      return !usedChainList.includes(chainId);
    },
  },
  {
    // 有给 Receive 地址转账过的记录
    id: "1018",
    enable: true,
    valueDescription: "有给 Receive 地址转账过的记录",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      warning: false,
    },
    customThreshold: {},
    requires: ["send"],
    async getValue(ctx) {
      const { hasTransfer } = ctx.send!;
      return hasTransfer;
    },
  },
  {
    // Receive 地址是其他链上的合约地址
    id: "1019",
    enable: true,
    valueDescription: "Receive 地址是其他链上的合约地址",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      danger: true,
    },
    customThreshold: {},
    requires: ["send"],
    async getValue(ctx) {
      const { contract, chainId } = ctx.send!;
      if (!contract) return false;
      return !contract.chains.includes(chainId);
    },
  },
  {
    // Receive 地址是交易所充值地址且不支持该 Token
    id: "1020",
    enable: true,
    valueDescription: "Receive 地址是交易所充值地址且不支持该 Token",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      danger: true,
    },
    customThreshold: {},
    requires: ["send"],
    async getValue(ctx) {
      const { cex } = ctx.send!;
      if (!cex) return false;
      return !cex.supportToken;
    },
  },
  {
    // Receive 地址是交易所地址但不是充值地址
    id: "1021",
    enable: true,
    valueDescription: "Receive 地址是交易所地址但不是充值地址",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      danger: true,
    },
    customThreshold: {},
    requires: ["send"],
    async getValue(ctx) {
      const { cex } = ctx.send!;
      if (!cex) return false;
      return cex && !cex.isDeposit;
    },
  },
  {
    // Receive 地址在用户黑名单中
    id: "1031",
    enable: true,
    valueDescription: "Receive 地址在用户黑名单中",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      forbidden: true,
    },
    customThreshold: {},
    requires: ["send"],
    async getValue(ctx) {
      const { to } = ctx.send!;
      const { addressBlacklist } = ctx.userData;
      return addressBlacklist.includes(to.toLowerCase());
    },
  },
  {
    // Receive 地址在用户黑名单中
    id: "1032",
    enable: true,
    valueDescription: "Receive 地址在用户黑名单中",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      forbidden: true,
    },
    customThreshold: {},
    requires: ["send"],
    async getValue(ctx) {
      const { to } = ctx.send!;
      const { addressBlacklist } = ctx.userData;
      return addressBlacklist.includes(to.toLowerCase());
    },
  },
  {
    // Receive 地址在用户白名单中
    id: "1033",
    enable: true,
    valueDescription: "Receive 地址在用户白名单中",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      safe: true,
    },
    customThreshold: {},
    requires: ["send"],
    async getValue(ctx) {
      const { to } = ctx.send!;
      const { addressWhitelist } = ctx.userData;
      return addressWhitelist.includes(to.toLowerCase());
    },
  },
  {
    // Spender 是否为 EOA 地址
    id: "1022",
    enable: true,
    valueDescription: "Spender 是否为 EOA 地址",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      danger: true,
    },
    customThreshold: {},
    requires: ["tokenApprove"],
    async getValue(ctx) {
      const { isEOA } = ctx.tokenApprove!;
      return isEOA;
    },
  },
  {
    // Spender 风险敞口
    id: "1023",
    enable: true,
    valueDescription: "Spender 风险敞口",
    valueDefine: {
      type: "int",
      min: 0,
      minIncluded: true,
      max: null,
      maxIncluded: false,
    },
    defaultThreshold: {
      danger: {
        min: 0,
        minIncluded: true,
        max: 10000,
        maxIncluded: true,
      },
      warning: {
        min: 10000,
        minIncluded: false,
        max: 50000,
        maxIncluded: true,
      }
    },
    customThreshold: {},
    requires: ["tokenApprove"],
    async getValue(ctx) {
      const data = ctx.tokenApprove!;
      return data.riskExposure;
    },
  },
  {
    // Spender 合约部署时间
    id: "1024",
    enable: true,
    valueDescription: "Spender 合约部署时间",
    valueDefine: {
      type: "int",
      min: 0,
      minIncluded: true,
      max: null,
      maxIncluded: false,
    },
    defaultThreshold: {
      warning: {
        min: 0,
        minIncluded: true,
        max: 30,
        maxIncluded: true,
      }
    },
    customThreshold: {},
    requires: ["tokenApprove"],
    async getValue(ctx) {
      const data = ctx.tokenApprove!;
      return data.deployDays;
    },
  },
  {
    // 当前地址跟 Spender 交互过
    id: "1025",
    enable: true,
    valueDescription: "当前地址跟 Spender 交互过",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      warning: false,
    },
    customThreshold: {},
    requires: ["tokenApprove"],
    async getValue(ctx) {
      const { hasInteracted } = ctx.tokenApprove!;
      return hasInteracted;
    },
  },
  {
    // Spender 在用户合约白名单
    id: "1026",
    enable: true,
    valueDescription: "Spender 在用户合约白名单",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      safe: true,
    },
    customThreshold: {},
    requires: ["tokenApprove"],
    async getValue(ctx) {
      const { spender, chainId } = ctx.tokenApprove!;
      return ctx.userData.contractWhitelist.some(
        (item) =>
          item.chainId === chainId &&
          caseInsensitiveCompare(item.address, spender)
      );
    },
  },
  {
    // Spender 在用户合约黑名单且在当前链上
    id: "1027",
    enable: true,
    valueDescription: "Spender 在用户合约黑名单且在当前链上",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      forbidden: true,
    },
    customThreshold: {},
    requires: ["tokenApprove"],
    async getValue(ctx) {
      const { spender, chainId } = ctx.tokenApprove!;
      return ctx.userData.contractBlacklist.some(
        (item) =>
          item.chainId === chainId &&
          caseInsensitiveCompare(item.address, spender)
      );
    },
  },
  {
    // Spender 在用户合约黑名单且不在当前链上
    id: "1028",
    enable: true,
    valueDescription: "Spender 在用户合约黑名单且不在当前链上",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      warning: true,
    },
    customThreshold: {},
    requires: ["tokenApprove"],
    async getValue(ctx) {
      const { chainId, spender } = ctx.tokenApprove!;
      return ctx.userData.contractBlacklist.some(
        (item) =>
          item.chainId !== chainId &&
          caseInsensitiveCompare(item.address, spender)
      );
    },
  },
  {
    // Spender 合约是风险合约
    id: "1029",
    enable: true,
    valueDescription: "Spender 合约是风险合约",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      danger: true,
    },
    customThreshold: {},
    requires: ["tokenApprove"],
    async getValue(ctx) {
      const { isDanger } = ctx.tokenApprove!;
      return isDanger;
    },
  },
];
