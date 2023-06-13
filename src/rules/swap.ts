import { RuleConfig } from ".";
import { caseInsensitiveCompare } from "../utils";

const rules: RuleConfig[] = [
  {
    // receive token 是否被标记为假资产
    id: "1008",
    enable: true,
    valueDescription: "Fake token expected to be received in transaction",
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
    // receive token 是否被标记为垃圾资产
    id: "1009",
    enable: true,
    valueDescription: "Scam token expected to be received in transaction",
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
    // 交易滑点
    id: "1011",
    enable: true,
    valueDescription: "Slippage is too high",
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
    // 美元价值变化
    id: "1012",
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
    requires: ["swap"],
    async getValue(ctx) {
      const { usdValuePercentage } = ctx.swap!;
      if (usdValuePercentage === null) return null;
      return usdValuePercentage * 100;
    },
  },
  {
    // receiver 是其他地址
    id: "1069",
    enable: true,
    valueDescription: "Recipient address does not match current address",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      danger: true,
    },
    customThreshold: {},
    requires: ["swap"],
    async getValue(ctx) {
      const { receiver, from } = ctx.swap!;
      return !caseInsensitiveCompare(from, receiver);
    },
  },
];

export default rules;
