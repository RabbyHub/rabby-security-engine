import { RuleConfig } from ".";

const IGNORE_CHECK_CHAINS = ["mnt"];

const rules: RuleConfig[] = [
  {
    id: "1118",
    enable: true,
    valueDescription: "Gas required for this transaction ",
    valueDefine: {
      type: "int",
      min: 0,
      minIncluded: true,
      max: null,
      maxIncluded: false,
    },
    defaultThreshold: {
      warning: {
        min: 1000000,
        minIncluded: false,
        max: null,
        maxIncluded: false,
      },
    },
    customThreshold: {},
    requires: ["revokeApprove"],
    async getValue(ctx) {
      const data = ctx.revokeApprove!;

      if (data.chainId && IGNORE_CHECK_CHAINS.includes(data.chainId)) {
        return 0;
      }

      if (data.gasUsed === undefined || data.gasUsed === null) {
        return 0;
      }

      return data.gasUsed;
    },
    descriptions: {
      warning: `Gas required for this transaction is too big (>1,000,000); it might be a scam`,
    },
  },
];

export default rules;
