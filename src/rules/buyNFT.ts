import { RuleConfig } from ".";
import { caseInsensitiveCompare } from "../utils";

const rules: RuleConfig[] = [
  {
    id: "1085",
    enable: true,
    valueDescription: "Is the earnings from the order be paid to my current address",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      danger: true,
    },
    customThreshold: {},
    requires: ["buyNFT"],
    async getValue(ctx) {
      const { receiver, from, receiverInWallet } = ctx.buyNFT!;
      if (receiverInWallet) return false;
      return !caseInsensitiveCompare(from, receiver);
    },
  },
  {
    id: "1086",
    enable: true,
    valueDescription: "Fake token expected to be received in transaction",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      danger: true,
    },
    customThreshold: {},
    requires: ["buyNFT"],
    async getValue(ctx) {
      return ctx.buyNFT!.receiveNFTIsFake;
    },
  },
  {
    id: "1087",
    enable: true,
    valueDescription: "Scam token expected to be received in transaction",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      warning: true,
    },
    customThreshold: {},
    requires: ["buyNFT"],
    async getValue(ctx) {
      return ctx.buyNFT!.receiveNFTIsScam;
    },
  },
];

export default rules;
