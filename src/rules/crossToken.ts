import { RuleConfig } from ".";
import { caseInsensitiveCompare } from "../utils";

const rules: RuleConfig[] = [
  {
    // receive token 是否被标记为假资产
    id: "1097",
    enable: true,
    valueDescription: "Fake token expected to be received in transaction",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      danger: true,
    },
    customThreshold: {},
    requires: ["crossToken"],
    async getValue(ctx) {
      return ctx.crossToken!.receiveTokenIsFake;
    },
  },
  {
    // receive token 是否被标记为垃圾资产
    id: "1098",
    enable: true,
    valueDescription: "Scam token expected to be received in transaction",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      warning: true,
    },
    customThreshold: {},
    requires: ["crossToken"],
    async getValue(ctx) {
      return ctx.crossToken!.receiveTokenIsScam;
    },
  },
  {
    // 美元价值变化
    id: "1105",
    enable: true,
    valueDescription: "Price difference is too big",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      warning: true
    },
    customThreshold: {},
    requires: ["crossToken"],
    async getValue(ctx) {
      const { usdValuePercentage, usdValueChange } = ctx.crossToken!;
      if (usdValueChange < -100 && usdValuePercentage < -0.003) {
        return true;
      }
      return false;
    },
  },
  {
    // receiver 是其他地址
    id: "1103",
    enable: true,
    valueDescription: "Recipient address does not match current address",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      danger: true,
    },
    customThreshold: {},
    requires: ["crossToken"],
    async getValue(ctx) {
      const { receiver, from } = ctx.crossToken!;
      return !caseInsensitiveCompare(from, receiver);
    },
  },
];

export default rules;
