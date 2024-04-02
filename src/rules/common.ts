import { RuleConfig } from ".";

const rules: RuleConfig[] = [
  {
    id: "1139",
    enable: true,
    valueDescription: "Recipient address is unknown",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      danger: true,
    },
    customThreshold: {},
    requires: ["common"],
    async getValue(ctx) {
      const { receiverInWallet } = ctx.common!;
      return !receiverInWallet;
    },
  },
];

export default rules;
