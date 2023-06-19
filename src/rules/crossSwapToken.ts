import { RuleConfig } from ".";
import { caseInsensitiveCompare } from "../utils";

const rules: RuleConfig[] = [
  {
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
