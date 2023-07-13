import { RuleConfig } from ".";
import { caseInsensitiveCompare } from "../utils";

const rules: RuleConfig[] = [
  {
    id: "1022",
    enable: true,
    valueDescription: "Spender address is an Externally Owned Account (EOA)",
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
    id: "1023",
    enable: true,
    valueDescription: "Spender address risk exposure",
    valueTooltip: "The total asset value approved and exposed to this contract",
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
    requires: ["tokenApprove"],
    async getValue(ctx) {
      const data = ctx.tokenApprove!;
      return data.riskExposure;
    },
  },
  {
    id: "1024",
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
