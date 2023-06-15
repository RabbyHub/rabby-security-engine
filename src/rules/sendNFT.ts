import { RuleConfig } from ".";

const rules: RuleConfig[] = [
  {
    // 有给 Receive 地址转账过的记录
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
    // Receive 地址是其他链上的合约地址
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
    // Receive 地址是交易所充值地址且不支持该 Token
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
    // Receive 地址是交易所地址但不是充值地址
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
    // Receive 地址在用户转账白名单中
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
