import { OpenApiService } from "@debank/rabby-api";
import connectRules from "./connect";
import swapRules from "./swap";
import sendRules from "./send";
import tokenApproveRules from "./tokenApprove";
import sendNFTRules from "./sendNFT";
import nftApproveRules from "./nftApprove";
import collectionApproveRules from "./collectionApprove";
import wrapRules from "./wrap";
import permit from "./permit";
import permit2 from "./permit2";
import sellNFT from "./sellNFT";
import buyNFT from "./buyNFT";
import swapTokenOrder from "./swapTokenOrder";
import crossToken from "./crossToken";
import crossSwapToken from "./crossSwapToken";
import verifyAddress from "./verifyAddress";
import createKey from "./createKey";

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
  createKey?: {
    allowOrigins: string[];
    origin: string;
  };
  verifyAddress?: {
    allowOrigins: string[];
    origin: string;
  };
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
    slippageTolerance: number | null;
    usdValuePercentage: number | null;
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
    onTransferWhitelist: boolean;
  };
  permit?: {
    spender: string;
    isEOA: boolean;
    riskExposure: number;
    deployDays: number;
    hasInteracted: boolean;
    isDanger: boolean;
  };
  permit2?: {
    spender: string;
    isEOA: boolean;
    riskExposure: number;
    deployDays: number;
    hasInteracted: boolean;
    isDanger: boolean;
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
  sendNFT?: {
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
    usedChainList: string[];
    onTransferWhitelist: boolean;
  };
  nftApprove?: {
    chainId: string;
    spender: string;
    isEOA: boolean;
    riskExposure: number;
    deployDays: number;
    hasInteracted: boolean;
    isDanger: boolean;
  };
  collectionApprove?: {
    chainId: string;
    spender: string;
    isEOA: boolean;
    riskExposure: number;
    deployDays: number;
    hasInteracted: boolean;
    isDanger: boolean;
  };
  wrapToken?: {
    from: string;
    receiver: string;
    slippageTolerance: number;
  };
  unwrapToken?: {
    from: string;
    receiver: string;
    slippageTolerance: number;
  };
  sellNFT?: {
    specificBuyer: string | null;
    receiver: string;
    receiveTokenIsScam: boolean;
    receiveTokenIsFake: boolean;
    from: string;
  };
  buyNFT?: {
    from: string;
    receiver: string;
    receiveNFTIsScam: boolean;
    receiveNFTIsFake: boolean;
  };
  swapTokenOrder?: {
    receiveTokenIsScam: boolean;
    receiveTokenIsFake: boolean;
    receiver: string;
    from: string;
    usdValuePercentage: number;
  };
  crossToken?: {
    from: string;
    receiveTokenIsScam: boolean;
    receiveTokenIsFake: boolean;
    receiver: string;
    usdValuePercentage: number;
    usdValueChange: number;
  };
  crossSwapToken?: {
    from: string;
    receiveTokenIsScam: boolean;
    receiveTokenIsFake: boolean;
    receiver: string;
    usdValuePercentage: number;
    usdValueChange: number;
  };
  contractCall?: {
    id: string;
    chainId: string;
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
  ...connectRules,
  ...swapRules,
  ...sendRules,
  ...tokenApproveRules,
  ...sendNFTRules,
  ...nftApproveRules,
  ...collectionApproveRules,
  ...wrapRules,
  ...permit,
  ...permit2,
  ...crossSwapToken,
  ...crossToken,
  ...swapTokenOrder,
  ...buyNFT,
  ...sellNFT,
  ...verifyAddress,
  ...createKey,
];
