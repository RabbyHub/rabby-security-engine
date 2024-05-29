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
    descriptions: {
      danger: `You will receive a scam token in the transaction`,
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
    descriptions: {
      warning: `You will receive a low-quality token in the transaction; it might be a scam`,
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
      warning: true,
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
    descriptions: {
      warning: `The price difference is big, causing huge funds loss`,
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
    descriptions: {
      danger: `The recipient address is not your current address`,
    },
  },
];

export default rules;
