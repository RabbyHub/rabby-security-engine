import { RuleConfig } from ".";
import { caseInsensitiveCompare } from "../utils";

const rules: RuleConfig[] = [
  {
    id: "1008",
    enable: true,
    valueDescription: "Fake token expected to be received in transaction",
    descriptions: {
      danger: "You will receive a scam token in the transaction",
    },
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
    id: "1009",
    enable: true,
    valueDescription: "Scam token expected to be received in transaction",
    descriptions: {
      warning:
        "You will receive a low-quality token in the transaction; it might be a scam",
    },
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
    id: "1011",
    enable: true,
    valueDescription: "Slippage is too high",
    descriptions: {
      danger: "The slippage is very high (> 20%), causing huge funds loss",
      warning: "The slippage is high (> 10%), causing huge funds loss",
    },
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
      const { slippageTolerance, receiver, from } = ctx.swap!;
      if (!caseInsensitiveCompare(from, receiver)) {
        return 0;
      }
      if (slippageTolerance === null) return null;
      return slippageTolerance * 100;
    },
  },
  {
    id: "1012",
    enable: true,
    valueDescription: "Price difference is too big",
    descriptions: {
      danger: "The price difference exceeds 20%, causing huge funds loss",
      warning: "The price difference exceeds 10%, causing huge funds loss",
    },
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
      if (usdValuePercentage === null) return null;
      return usdValuePercentage * 100;
    },
  },
  {
    id: "1069",
    enable: true,
    valueDescription: "Recipient address is unknown",
    descriptions: {
      danger: "The recipient address is not your current address",
    },
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      danger: true,
    },
    customThreshold: {},
    requires: ["swap"],
    async getValue(ctx) {
      const { receiver, from, receiverInWallet } = ctx.swap!;
      if (receiverInWallet) return false;
      return !caseInsensitiveCompare(from, receiver);
    },
  },
];

export default rules;
