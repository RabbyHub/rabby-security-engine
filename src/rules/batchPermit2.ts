import { RuleConfig } from ".";

const rules: RuleConfig[] = [
  {
    id: "1109",
    enable: true,
    valueDescription: "Spender address is an Externally Owned Account (EOA)",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      danger: true,
    },
    customThreshold: {},
    requires: ["batchPermit2"],
    async getValue(ctx) {
      const { isEOA } = ctx.batchPermit2!;
      return isEOA;
    },
    descriptions: {
      danger: `The spender address is an Externally Owned Account (EOA), potentially a scam address`,
    },
  },
  {
    id: "1145",
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
    requires: ["batchPermit2"],
    async getValue(ctx) {
      const { riskExposure } = ctx.batchPermit2!;
      return riskExposure === 0;
    },
  },
  {
    id: "1111",
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
    requires: ["batchPermit2"],
    async getValue(ctx) {
      const data = ctx.batchPermit2!;
      return data.deployDays;
    },
    descriptions: {
      warning: `The contract is only deployed within 3 days, indicating a scam`,
    },
  },
  {
    id: "1112",
    enable: true,
    valueDescription: "Have you interacted with this contract before",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      warning: false,
    },
    customThreshold: {},
    requires: ["batchPermit2"],
    async getValue(ctx) {
      const { hasInteracted } = ctx.batchPermit2!;
      return hasInteracted;
    },
    descriptions: {
      warning: `You have never interacted with this contract before`,
    },
  },
  {
    id: "1113",
    enable: true,
    valueDescription: "Spender address is a risky contract",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      danger: true,
    },
    customThreshold: {},
    requires: ["batchPermit2"],
    async getValue(ctx) {
      const { isDanger } = ctx.batchPermit2!;
      return isDanger;
    },
    descriptions: {
      danger: `The spender address is a risky contract`,
    },
  },
];

export default rules;
