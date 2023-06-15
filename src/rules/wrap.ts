import { RuleConfig } from ".";
import { caseInsensitiveCompare } from "../utils";

const rules: RuleConfig[] = [
  {
    // 收到的 Wrap Token 数量和支付的原生 Token 数量偏差过大
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
  },
  {
    // receiver 是其他地址
    id: "1092",
    enable: true,
    valueDescription: "Recipient address does not match current address",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      danger: true,
    },
    customThreshold: {},
    requires: ["wrapToken"],
    async getValue(ctx) {
      const { receiver, from } = ctx.wrapToken!;
      return !caseInsensitiveCompare(from, receiver);
    },
  },
  {
    // 收到的原生代币数量和支付的 Wrap Token 数量偏差
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
  },
  {
    // receiver 是其他地址
    id: "1093",
    enable: true,
    valueDescription: "Recipient address does not match current address",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      danger: true,
    },
    customThreshold: {},
    requires: ["unwrapToken"],
    async getValue(ctx) {
      const { receiver, from } = ctx.unwrapToken!;
      return !caseInsensitiveCompare(from, receiver);
    },
  },
];

export default rules;
