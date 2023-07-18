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
  },
  {
    id: "1054",
    enable: true,
    valueDescription: "Trust value",
    valueTooltip:
      "Trust value refers to the top NFT approved and exposed to this contract. A low trust value indicates either risk or inactivity for 180 days.",
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
        max: 100000,
        maxIncluded: true,
      },
    },
    customThreshold: {},
    requires: ["collectionApprove"],
    async getValue(ctx) {
      const data = ctx.collectionApprove!;
      return data.riskExposure;
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
  },
];

export default rules;
