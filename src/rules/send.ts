import { RuleConfig } from ".";

const rules: RuleConfig[] = [
  {
    id: "1016",
    enable: true,
    valueDescription: "Recipient address is a token contract address",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      danger: true,
    },
    customThreshold: {},
    requires: ["send"],
    async getValue(ctx) {
      const { isTokenContract } = ctx.send!;
      return isTokenContract;
    },
  },
  {
    id: "1018",
    enable: true,
    valueDescription: "Have you transferred to this address before",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      warning: false,
    },
    customThreshold: {},
    requires: ["send"],
    async getValue(ctx) {
      const { hasTransfer } = ctx.send!;
      return hasTransfer;
    },
  },
  {
    id: "1019",
    enable: true,
    valueDescription:
      "Recipient address is a contract address on a different chain",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      danger: true,
    },
    customThreshold: {},
    requires: ["send"],
    async getValue(ctx) {
      const { contract, chainId } = ctx.send!;
      if (!contract) return false;
      return !contract.chains.includes(chainId);
    },
  },
  {
    id: "1020",
    enable: true,
    valueDescription:
      "Recipient address is a deposit address on a CEX that does not support the current token",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      danger: true,
    },
    customThreshold: {},
    requires: ["send"],
    async getValue(ctx) {
      const { cex } = ctx.send!;
      if (!cex) return false;
      return !cex.supportToken;
    },
  },
  {
    id: "1021",
    enable: true,
    valueDescription: "Recipient address is a non-deposit address on a CEX",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      danger: true,
    },
    customThreshold: {},
    requires: ["send"],
    async getValue(ctx) {
      const { cex } = ctx.send!;
      if (!cex) return false;
      return cex && !cex.isDeposit;
    },
  },
  {
    id: "1033",
    enable: true,
    valueDescription: "Recipient address is in your whitelist",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      safe: true,
    },
    customThreshold: {},
    requires: ["send"],
    async getValue(ctx) {
      const { onTransferWhitelist } = ctx.send!;
      return onTransferWhitelist;
    },
  },
];

export default rules;
