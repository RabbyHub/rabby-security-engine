import { RuleConfig } from ".";
import { caseInsensitiveCompare } from "../utils";

const rules: RuleConfig[] = [
  {
    id: "1114",
    enable: true,
    valueDescription: "Does the order have a specific buyer",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      warning: true,
    },
    customThreshold: {},
    requires: ["batchSellNFT", "assetOrder"],
    async getValue(ctx) {
      const { specificBuyer } = (ctx.batchSellNFT || ctx.assetOrder)!;
      return !!specificBuyer;
    },
  },
  {
    id: "1115",
    enable: true,
    valueDescription:
      "Is the earnings from the order be paid to my current address",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      danger: false,
    },
    customThreshold: {},
    requires: ["batchSellNFT", "assetOrder"],
    async getValue(ctx) {
      const { receiver, from } = (ctx.batchSellNFT || ctx.assetOrder)!;
      return caseInsensitiveCompare(from, receiver);
    },
  },
  {
    id: "1116",
    enable: true,
    valueDescription: "Fake token expected to be received in transaction",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      danger: true,
    },
    customThreshold: {},
    requires: ["batchSellNFT"],
    async getValue(ctx) {
      return ctx.batchSellNFT!.receiveTokenHasFake;
    },
  },
  {
    id: "1117",
    enable: true,
    valueDescription: "Scam token expected to be received in transaction",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      warning: true,
    },
    customThreshold: {},
    requires: ["batchSellNFT"],
    async getValue(ctx) {
      return ctx.batchSellNFT!.receiveTokenHasScam;
    },
  },
];

export default rules;
