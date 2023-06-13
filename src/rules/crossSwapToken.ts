import { RuleConfig } from ".";
import { caseInsensitiveCompare } from "../utils";

const rules: RuleConfig[] = [
  {
    // receive token 是否被标记为假资产
    id: "1107",
    enable: true,
    valueDescription: "Fake token expected to be received in transaction",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      danger: true,
    },
    customThreshold: {},
    requires: ["crossSwapToken"],
    async getValue(ctx) {
      return ctx.crossSwapToken!.receiveTokenIsFake;
    },
  },
  {
    // receive token 是否被标记为垃圾资产
    id: "1108",
    enable: true,
    valueDescription: "Scam token expected to be received in transaction",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      warning: true,
    },
    customThreshold: {},
    requires: ["crossSwapToken"],
    async getValue(ctx) {
      return ctx.crossSwapToken!.receiveTokenIsScam;
    },
  },
  {
    // 美元价值变化
    id: "1104",
    enable: true,
    valueDescription: "Price difference is too big",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      warning: true,
    },
    customThreshold: {},
    requires: ["crossSwapToken"],
    async getValue(ctx) {
      const { usdValuePercentage, usdValueChange } = ctx.crossSwapToken!;
      if (usdValueChange < -100 && usdValuePercentage < -0.03) {
        return true;
      }
      return false;
    },
  },
  {
    // receiver 是其他地址
    id: "1096",
    enable: true,
    valueDescription: "Recipient address does not match current address",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      danger: true,
    },
    customThreshold: {},
    requires: ["crossSwapToken"],
    async getValue(ctx) {
      const { receiver, from } = ctx.crossSwapToken!;
      return !caseInsensitiveCompare(from, receiver);
    },
  },
];

export default rules;
