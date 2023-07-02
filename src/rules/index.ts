import { OpenApiService } from "@rabby-wallet/rabby-api";
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
import batchPermit2 from './batchPermit2';
import batchSellNFT from './batchSellNFT';

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
  batchPermit2?: {
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
  batchSellNFT?: {
    specificBuyer: string | null;
    receiver: string;
    receiveTokenHasScam: boolean;
    receiveTokenHasFake: boolean;
    from: string;
  }
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
  min: number | null; // null means infinitesimal
  minIncluded: boolean;
  max: number | null; // null means infinite
  maxIncluded: boolean;
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
  id: string;
  enable: boolean;
  valueDescription: string;
  valueDefine: NumberDefine | BooleanDefine | EnumDefine;
  defaultThreshold: Threshold;
  customThreshold: Threshold;
  requires: string[];
  getValue(ctx: Context, apiService: OpenApiService): Promise<any>;
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
  ...batchPermit2,
  ...batchSellNFT,
];
