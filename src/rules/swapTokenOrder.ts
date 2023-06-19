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
  },
  {
    id: "1094",
    enable: true,
    valueDescription: "Recipient address does not match current address",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      danger: true,
    },
    customThreshold: {},
    requires: ["swapTokenOrder"],
    async getValue(ctx) {
      const { receiver, from } = ctx.swapTokenOrder!;
      return !caseInsensitiveCompare(from, receiver);
    },
  },
];

export default rules;
