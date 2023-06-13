import { RuleConfig } from ".";

const rules: RuleConfig[] = [
  {
    // Spender 是否为 EOA 地址
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
  },
  {
    // Spender 风险敞口
    id: "1072",
    enable: true,
    valueDescription: "Spender address risk exposure",
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
    requires: ["permit2"],
    async getValue(ctx) {
      const data = ctx.permit2!;
      return data.riskExposure;
    },
  },
  {
    // Spender 合约部署时间
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
  },
  {
    // 当前地址跟 Spender 交互过
    id: "1074",
    enable: true,
    valueDescription: "Have you interacted with this contract before",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      warning: false,
    },
    customThreshold: {},
    requires: ["permit2"],
    async getValue(ctx) {
      const { hasInteracted } = ctx.permit2!;
      return hasInteracted;
    },
  },
  {
    // Spender 合约是风险合约
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
  },
];

export default rules;
