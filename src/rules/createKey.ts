import { RuleConfig } from ".";

const rules: RuleConfig[] = [
  {
    // 签名内容是否属于发起签名的网站
    id: "1089",
    enable: true,
    valueDescription:
      "Does the signature belong to the website that initiated it",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      danger: false,
    },
    customThreshold: {},
    requires: ["createKey"],
    async getValue(ctx) {
      const { allowOrigins, origin } = ctx.createKey!;
      return allowOrigins.includes(origin);
    },
  },
];

export default rules;
