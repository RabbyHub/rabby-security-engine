import { RuleConfig } from ".";

const rules: RuleConfig[] = [
  {
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
    descriptions: {
      danger: `The transaction is not associated with the website that initiated it`,
    },
  },
];

export default rules;
