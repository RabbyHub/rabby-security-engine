import { RuleConfig } from ".";

const rules: RuleConfig[] = [
  {
    id: "1151",
    enable: true,
    valueDescription:
      "Recipient address is NOT in your whitelist",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      danger: false,
    },
    customThreshold: {},
    requires: ["transferOwner"],
    async getValue(ctx) {
      const { receiverInWhitelist } = ctx.transferOwner!;
      return !!receiverInWhitelist;
    },
    descriptions: {
      danger: `Recipient address is NOT in your whitelist`,
    },
  },
];

export default rules;
