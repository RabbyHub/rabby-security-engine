import { RuleConfig } from ".";

const rules: RuleConfig[] = [
  {
    id: "1144",
    enable: true,
    valueDescription: "You won't receive any assets from this order",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      danger: false,
    },
    customThreshold: {},
    requires: ["assetOrder"],
    async getValue(ctx) {
      const { hasReceiveAssets } = ctx.assetOrder!;
      return hasReceiveAssets;
    },
    descriptions: {
      danger: `You won't receive any assets from this order`,
    },
  }
];

export default rules;
