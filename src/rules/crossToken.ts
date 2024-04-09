import { RuleConfig } from ".";
import { caseInsensitiveCompare } from "../utils";

const rules: RuleConfig[] = [
  {
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
    id: "1103",
    enable: true,
    valueDescription: "Recipient address is unknown",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      danger: true,
    },
    customThreshold: {},
    requires: ["crossToken"],
    async getValue(ctx) {
      const { receiver, from, receiverInWallet } = ctx.crossToken!;
      if (receiverInWallet) return false;
      return !caseInsensitiveCompare(from, receiver);
    },
  },
];

export default rules;
