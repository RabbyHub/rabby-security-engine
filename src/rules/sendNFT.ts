import { RuleConfig } from ".";

const rules: RuleConfig[] = [
  {
    id: "1036",
    enable: true,
    valueDescription: "Have you transferred to this address before",
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
