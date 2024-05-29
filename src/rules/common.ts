import { caseInsensitiveCompare } from "../utils";
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
      const { receiverInWallet, from, receiver } = ctx.common!;
      if (!receiver) return false;
      if (receiverInWallet) return false;
      return !caseInsensitiveCompare(from, receiver);
    },
    descriptions: {
      danger: `The recipient address is unknown`,
    },
  },
];

export default rules;
