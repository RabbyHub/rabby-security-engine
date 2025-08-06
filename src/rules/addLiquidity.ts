import { RuleConfig } from ".";

const rules: RuleConfig[] = [
  {
    id: "1153",
    enable: true,
    valueDescription: "Recipient address does not match current address",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      danger: true,
    },
    customThreshold: {},
    requires: ["addLiquidity"],
    async getValue(ctx) {
      const { receiverMatch } = ctx.addLiquidity!;
      return !receiverMatch;
    },
    descriptions: {
      danger: `Recipient address does not match current address`,
    },
  },
  {
    id: "1154",
    enable: true,
    valueDescription:
      "This pool’s price differs greatly from the market price. You may lose money due to arbitrage.",
    valueDefine: {
      type: "percent",
      min: null,
      minIncluded: false,
      max: null,
      maxIncluded: false,
    },
    defaultThreshold: {
      danger: {
        max: null,
        maxIncluded: true,
        min: 10,
        minIncluded: true,
      },
      warning: {
        max: 10,
        maxIncluded: false,
        min: 5,
        minIncluded: true,
      },
    },
    customThreshold: {},
    requires: ["addLiquidity"],
    async getValue(ctx) {
      const { diff } = ctx.addLiquidity!;
      return diff;
    },
    descriptions: {
      danger: `The price difference between this pool price and the market price is at least 10%. You may lose money due to arbitrage.`,
      warning: `The price difference between this pool price and the market price is at least 5%. You may lose money due to arbitrage.`,
    },
  },
];

export default rules;
