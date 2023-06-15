import { RuleConfig } from ".";

const rules: RuleConfig[] = [
  {
    // 签名内容是否属于发起签名的网站
    id: "1088",
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
    requires: ["verifyAddress"],
    async getValue(ctx) {
      const { allowOrigins, origin } = ctx.verifyAddress!;
      return allowOrigins.includes(origin);
    },
  },
];

export default rules;
