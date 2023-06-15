import { RuleConfig } from ".";

const rules: RuleConfig[] = [
  {
    // Receive 地址是一个 Token 合约地址
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
    // 有给 Receive 地址转账过的记录
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
    // Receive 地址是其他链上的合约地址
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
    // Receive 地址是交易所充值地址且不支持该 Token
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
    // Receive 地址是交易所地址但不是充值地址
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
    // Receive 地址在用户转账白名单中
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
