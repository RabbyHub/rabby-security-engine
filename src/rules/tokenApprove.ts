import { RuleConfig } from ".";
import { caseInsensitiveCompare } from "../utils";

const rules: RuleConfig[] = [
  {
    id: "1022",
    enable: true,
    valueDescription: "Spender address is an Externally Owned Account (EOA)",
    descriptions: {
      danger:
        "The spender address is an Externally Owned Account (EOA), potentially a scam address",
    },
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      danger: true,
    },
    customThreshold: {},
    requires: ["tokenApprove"],
    async getValue(ctx) {
      const { isEOA } = ctx.tokenApprove!;
      return isEOA;
    },
  },
  {
    id: "1150",
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
    requires: ["tokenApprove"],
    async getValue(ctx) {
      const { riskExposure } = ctx.tokenApprove!;
      return riskExposure === 0 || riskExposure === null;
    },
  },
  {
    id: "1024",
    enable: true,
    valueDescription: "Contract deployment duration is too short",
    descriptions: {
      warning: "The contract is only deployed within 3 days, indicating a scam",
    },
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
    requires: ["tokenApprove"],
    async getValue(ctx) {
      const data = ctx.tokenApprove!;
      return data.deployDays;
    },
  },
  {
    id: "1025",
    enable: true,
    valueDescription: "Have you interacted with this contract before",
    descriptions: {
      warning: "You have never interacted with this contract before",
    },
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      warning: false,
    },
    customThreshold: {},
    requires: ["tokenApprove"],
    async getValue(ctx) {
      const { hasInteracted } = ctx.tokenApprove!;
      return hasInteracted;
    },
  },
  {
    id: "1029",
    enable: true,
    valueDescription: "Spender address is a risky contract",
    descriptions: {
      danger: "The spender address is a risky contract",
    },
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      danger: true,
    },
    customThreshold: {},
    requires: ["tokenApprove"],
    async getValue(ctx) {
      const { isDanger } = ctx.tokenApprove!;
      return isDanger;
    },
  },
];

export default rules;
