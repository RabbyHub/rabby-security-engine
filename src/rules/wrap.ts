import { RuleConfig } from ".";
import { caseInsensitiveCompare } from "../utils";

const rules: RuleConfig[] = [
  {
    id: "1061",
    enable: true,
    valueDescription: "Wrap token received does not match the token paid",
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
        min: 5,
        minIncluded: false,
      },
      warning: {
        max: 5,
        maxIncluded: true,
        min: 0,
        minIncluded: false,
      },
    },
    customThreshold: {},
    requires: ["wrapToken"],
    async getValue(ctx) {
      const { slippageTolerance } = ctx.wrapToken!;
      return slippageTolerance * 100;
    },
    descriptions: {
      danger: `You'll receive fewer wrap tokens than what you paid, by a difference greater than 5%`,
      warning: `You'll receive fewer wrap tokens than what you paid, by a difference between 0% and 5%`,
    },
  },
  {
    id: "1092",
    enable: true,
    valueDescription: "Recipient address is unknown",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      danger: true,
    },
    customThreshold: {},
    requires: ["wrapToken"],
    async getValue(ctx) {
      const { receiver, from, receiverInWallet } = ctx.wrapToken!;
      if (receiverInWallet) return false;
      return !caseInsensitiveCompare(from, receiver);
    },
    descriptions: {
      danger: `The recipient address doesn't match your current address and isn't marked as "Trusted" by you`,
    },
  },
  {
    id: "1062",
    enable: true,
    valueDescription: "Token received mismatch with wrap token paid",
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
        min: 5,
        minIncluded: false,
      },
      warning: {
        max: 5,
        maxIncluded: true,
        min: 0,
        minIncluded: false,
      },
    },
    customThreshold: {},
    requires: ["unwrapToken"],
    async getValue(ctx) {
      const { slippageTolerance } = ctx.unwrapToken!;
      return slippageTolerance * 100;
    },
    descriptions: {
      danger: `You'll receive fewer tokens than what you paid using Wrap Token, by a difference greater than 5%`,
      warning: `You'll receive fewer tokens than what you paid using Wrap Token, by a difference between 0% and 5%`,
    },
  },
  {
    id: "1093",
    enable: true,
    valueDescription: "Recipient address is unknown",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      danger: true,
    },
    customThreshold: {},
    requires: ["unwrapToken"],
    async getValue(ctx) {
      const { receiver, from, receiverInWallet } = ctx.unwrapToken!;
      if (receiverInWallet) return false;
      return !caseInsensitiveCompare(from, receiver);
    },
    descriptions: {
      danger: `The recipient address doesn't match your current address and isn't marked as "Trusted" by you`,
    },
  },
];

export default rules;
