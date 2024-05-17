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
    id: "1044",
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
        max: 50000,
        maxIncluded: true,
      },
    },
    customThreshold: {},
    requires: ["nftApprove"],
    async getValue(ctx) {
      const data = ctx.nftApprove!;
      return data.riskExposure;
    },
    descriptions: {
      danger: `The USD value of the top NFT that has approved to this spender is lower than $10,000`,
      warning: `The USD value of the top NFT that has approved to this spender is lower than $50,000`,
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
