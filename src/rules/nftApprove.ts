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
  },
  {
    id: "1044",
    enable: true,
    valueDescription: "Trust value",
    valueTooltip:
      "Trust value refers to the top NFT approved and exposed to this contract. When trust value is low, it's more likely to be risky.",
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
    requires: ["nftApprove"],
    async getValue(ctx) {
      const data = ctx.nftApprove!;
      return data.riskExposure;
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
  },
];

export default rules;
