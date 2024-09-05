import { RuleConfig } from ".";

const rules: RuleConfig[] = [
  {
    id: "1071",
    enable: true,
    valueDescription: "Spender address is an Externally Owned Account (EOA)",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      danger: true,
    },
    customThreshold: {},
    requires: ["permit2"],
    async getValue(ctx) {
      const { isEOA } = ctx.permit2!;
      return isEOA;
    },
    descriptions: {
      danger: `The spender address is an Externally Owned Account (EOA), potentially a scam address`,
    },
  },
  {
    id: "1149",
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
    requires: ["permit2"],
    async getValue(ctx) {
      const { riskExposure } = ctx.permit2!;
      return riskExposure === 0 || riskExposure === null;
    },
  },
  {
    id: "1073",
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
    requires: ["permit2"],
    async getValue(ctx) {
      const data = ctx.permit2!;
      return data.deployDays;
    },
    descriptions: {
      warning: `The contract is only deployed within 3 days, indicating a scam`,
    },
  },
  {
    id: "1075",
    enable: true,
    valueDescription: "Spender address is a risky contract",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      danger: true,
    },
    customThreshold: {},
    requires: ["permit2"],
    async getValue(ctx) {
      const { isDanger } = ctx.permit2!;
      return isDanger;
    },
    descriptions: {
      danger: `The spender address is a risky contract`,
    },
  },
];

export default rules;
