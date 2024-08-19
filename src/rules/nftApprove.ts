import { RuleConfig } from ".";
import { caseInsensitiveCompare } from "../utils";

const rules: RuleConfig[] = [
  {
    id: "1043",
    enable: true,
    valueDescription: "Spender address is an Externally Owned Account (EOA)",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      danger: true,
    },
    customThreshold: {},
    requires: ["nftApprove"],
    async getValue(ctx) {
      const { isEOA } = ctx.nftApprove!;
      return isEOA;
    },
    descriptions: {
      danger:
        "The spender address is an Externally Owned Account (EOA), potentially a scam address",
    },
  },
  {
    id: "1147",
    enable: true,
    valueDescription:
      "This spender contract may be a phishing risk because its trust value is $0.",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      warning: true,
    },
    customThreshold: {},
    requires: ["nftApprove"],
    async getValue(ctx) {
      const { riskExposure } = ctx.nftApprove!;
      return riskExposure === 0;
    },
  },
  {
    id: "1045",
    enable: true,
    valueDescription: "Contract deployment duration is too short",
    valueDefine: {
      type: "int",
      min: 0,
      minIncluded: true,
      max: null,
      maxIncluded: false,
    },
    defaultThreshold: {
      warning: {
        min: 0,
        minIncluded: true,
        max: 3,
        maxIncluded: false,
      },
    },
    customThreshold: {},
    requires: ["nftApprove"],
    async getValue(ctx) {
      const data = ctx.nftApprove!;
      return data.deployDays || 0;
    },
    descriptions: {
      warning: "The contract is only deployed within 3 days, indicating a scam",
    },
  },
  {
    id: "1048",
    enable: true,
    valueDescription: "Have you interacted with this contract before",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      warning: false,
    },
    customThreshold: {},
    requires: ["nftApprove"],
    async getValue(ctx) {
      const { hasInteracted } = ctx.nftApprove!;
      return hasInteracted;
    },
    descriptions: {
      warning: "You have never interacted with this contract before",
    },
  },
  {
    id: "1052",
    enable: true,
    valueDescription: "Spender address is a risky contract",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      danger: true,
    },
    customThreshold: {},
    requires: ["nftApprove"],
    async getValue(ctx) {
      const { isDanger } = ctx.nftApprove!;
      return isDanger;
    },
    descriptions: {
      danger: "The spender address is a risky contract",
    },
  },
];

export default rules;
