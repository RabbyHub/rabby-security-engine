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
  },
  {
    id: "1078",
    enable: true,
    valueDescription: "Contract trust value",
    valueTooltip:
      "Trust value refers to the total asset value approved and exposed to this contract. When trust value is low, it's more likely to be risky.",
    valueDefine: {
      type: "int",
      min: 0,
      minIncluded: true,
      max: null,
      maxIncluded: false,
    },
    defaultThreshold: {
      danger: {
        min: 0,
        minIncluded: true,
        max: 10000,
        maxIncluded: true,
      },
      warning: {
        min: 10000,
        minIncluded: false,
        max: 50000,
        maxIncluded: true,
      },
    },
    customThreshold: {},
    requires: ["permit"],
    async getValue(ctx) {
      const data = ctx.permit!;
      return data.riskExposure;
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
  },
];

export default rules;
