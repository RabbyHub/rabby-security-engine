import { RuleConfig } from ".";

const rules: RuleConfig[] = [
  {
    id: "1077",
    enable: true,
    valueDescription: "Spender address is an Externally Owned Account (EOA)",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      danger: true,
    },
    customThreshold: {},
    requires: ["permit"],
    async getValue(ctx) {
      const { isEOA } = ctx.permit!;
      return isEOA;
    },
    descriptions: {
      danger: `The spender address is an Externally Owned Account (EOA), potentially a scam address`,
    },
  },
  {
    id: "1148",
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
    requires: ["permit"],
    async getValue(ctx) {
      const { riskExposure } = ctx.permit!;
      return riskExposure === 0;
    },
  },
  {
    id: "1079",
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
    requires: ["permit"],
    async getValue(ctx) {
      const data = ctx.permit!;
      return data.deployDays;
    },
    descriptions: {
      warning: `The contract is only deployed within 3 days, indicating a scam`,
    },
  },
  {
    id: "1080",
    enable: true,
    valueDescription: "Have you interacted with this contract before",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      warning: false,
    },
    customThreshold: {},
    requires: ["permit"],
    async getValue(ctx) {
      const { hasInteracted } = ctx.permit!;
      return hasInteracted;
    },
    descriptions: {
      warning: `You have never interacted with this contract before`,
    },
  },
  {
    id: "1106",
    enable: true,
    valueDescription: "Spender address is a risky contract",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      danger: true,
    },
    customThreshold: {},
    requires: ["permit"],
    async getValue(ctx) {
      const { isDanger } = ctx.permit!;
      return isDanger;
    },
    descriptions: {
      danger: `The spender address is a risky contract`,
    },
  },
];

export default rules;
