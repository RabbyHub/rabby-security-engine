import { RuleConfig } from ".";
import { caseInsensitiveCompare } from "../utils";

const rules: RuleConfig[] = [
  {
    id: "1090",
    enable: true,
    valueDescription: "Fake token expected to be received in transaction",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      danger: true,
    },
    customThreshold: {},
    requires: ["swapTokenOrder"],
    async getValue(ctx) {
      return ctx.swapTokenOrder!.receiveTokenIsFake;
    },
    descriptions: {
      danger: `You will receive a scam token in the transaction`,
    },
  },
  {
    id: "1091",
    enable: true,
    valueDescription: "Scam token expected to be received in transaction",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      warning: true,
    },
    customThreshold: {},
    requires: ["swapTokenOrder"],
    async getValue(ctx) {
      return ctx.swapTokenOrder!.receiveTokenIsScam;
    },
    descriptions: {
      warning: `You will receive a low-quality token in the transaction; it might be a scam`,
    },
  },
  {
    id: "1095",
    enable: true,
    valueDescription: "Price difference is too big",
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
    requires: ["swapTokenOrder"],
    async getValue(ctx) {
      const { usdValuePercentage } = ctx.swapTokenOrder!;
      if (usdValuePercentage === null) return null;
      return usdValuePercentage * 100;
    },
    descriptions: {
      danger: `The price difference exceeds 20%, causing huge funds loss`,
      warning: `The price difference exceeds 10%, causing huge funds loss`,
    },
  },
  {
    id: "1094",
    enable: true,
    valueDescription: "Recipient address is unknown",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      danger: true,
    },
    customThreshold: {},
    requires: ["swapTokenOrder"],
    async getValue(ctx) {
      const { receiver, from, receiverInWallet } = ctx.swapTokenOrder!;
      if (receiverInWallet) return false;
      return !caseInsensitiveCompare(from, receiver);
    },
    descriptions: {
      danger: `The recipient address is not your current address`,
    },
  },
];

export default rules;
