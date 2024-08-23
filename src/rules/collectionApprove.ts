import { RuleConfig } from ".";

const rules: RuleConfig[] = [
  {
    id: "1053",
    enable: true,
    valueDescription: "Spender address is an Externally Owned Account (EOA)",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      danger: true,
    },
    customThreshold: {},
    requires: ["collectionApprove"],
    async getValue(ctx) {
      const { isEOA } = ctx.collectionApprove!;
      return isEOA;
    },
    descriptions: {
      danger:
        "The spender address is an Externally Owned Account (EOA), potentially a scam address",
    },
  },
  {
    id: "1146",
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
    requires: ["collectionApprove"],
    async getValue(ctx) {
      const { riskExposure } = ctx.collectionApprove!;
      return riskExposure === 0 || riskExposure === null;
    },
  },
  {
    id: "1055",
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
    requires: ["collectionApprove"],
    async getValue(ctx) {
      const data = ctx.collectionApprove!;
      return data.deployDays || 0;
    },
    descriptions: {
      warning: `The contract is only deployed within 3 days, indicating a scam`,
    },
  },
  {
    id: "1056",
    enable: true,
    valueDescription: "Have you interacted with this contract before",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      warning: false,
    },
    customThreshold: {},
    requires: ["collectionApprove"],
    async getValue(ctx) {
      const { hasInteracted } = ctx.collectionApprove!;
      return hasInteracted;
    },
    descriptions: {
      warning: `You have never interacted with this contract before`,
    },
  },
  {
    id: "1060",
    enable: true,
    valueDescription: "Spender address is a risky contract",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      danger: true,
    },
    customThreshold: {},
    requires: ["collectionApprove"],
    async getValue(ctx) {
      const { isDanger } = ctx.collectionApprove!;
      return isDanger;
    },
    descriptions: {
      danger: `The spender address is a risky contract`,
    },
  },
];

export default rules;
