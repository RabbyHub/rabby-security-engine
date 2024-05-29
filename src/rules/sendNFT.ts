import { RuleConfig } from ".";

const rules: RuleConfig[] = [
  {
    id: "1036",
    enable: true,
    valueDescription: "Have you transferred to this address before",
    descriptions: {
      warning: "You've never transferred token to this address before",
    },
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      warning: false,
    },
    customThreshold: {},
    requires: ["sendNFT"],
    async getValue(ctx) {
      const { hasTransfer } = ctx.sendNFT!;
      return hasTransfer;
    },
  },
  {
    id: "1037",
    enable: true,
    valueDescription:
      "Recipient address is a contract address on a different chain",
    descriptions: {
      danger:
        "The recipient address is a contract address on a different chain, potentially causing funds loss",
    },
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      danger: true,
    },
    customThreshold: {},
    requires: ["sendNFT"],
    async getValue(ctx) {
      const { contract, chainId } = ctx.sendNFT!;
      if (!contract) return false;
      return !contract.chains.includes(chainId);
    },
  },
  {
    id: "1038",
    enable: true,
    valueDescription:
      "Recipient address is a deposit address on a CEX that does not support the current token",
    descriptions: {
      danger:
        "The recipient address is a deposit address on a CEX that does not support the current token. Please verify CEX support before transfer.",
    },
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      danger: true,
    },
    customThreshold: {},
    requires: ["sendNFT"],
    async getValue(ctx) {
      const { cex } = ctx.sendNFT!;
      if (!cex) return false;
      return !cex.supportToken;
    },
  },
  {
    id: "1039",
    enable: true,
    valueDescription: "Recipient address is a non-deposit address on a CEX",
    descriptions: {
      danger:
        "The recipient address is a non-deposit address from a CEX. Please ensure your deposit address is correct.",
    },
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      danger: true,
    },
    customThreshold: {},
    requires: ["sendNFT"],
    async getValue(ctx) {
      const { cex } = ctx.sendNFT!;
      if (!cex) return false;
      return cex && !cex.isDeposit;
    },
  },
  {
    id: "1042",
    enable: true,
    valueDescription: "Recipient address is in your whitelist",
    descriptions: {
      safe: "The recipient address is in your whitelist",
    },
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      safe: true,
    },
    customThreshold: {},
    requires: ["sendNFT"],
    async getValue(ctx) {
      const { onTransferWhitelist } = ctx.sendNFT!;
      return onTransferWhitelist;
    },
  },
];

export default rules;
