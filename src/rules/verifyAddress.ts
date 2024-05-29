import { RuleConfig } from ".";

const rules: RuleConfig[] = [
  {
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
    descriptions: {
      danger: `The transaction is not associated with the website that initiated it`,
    },
  },
];

export default rules;
