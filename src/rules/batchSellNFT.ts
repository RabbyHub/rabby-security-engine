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
    descriptions: {
      warning: `The order has a specific buyer; Ensure that you intend to sell to this buyer`,
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
    descriptions: {
      danger: `The earnings from the order are not paid to your current address`,
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
    descriptions: {
      danger: `You will receive a scam token in the transaction`,
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
    descriptions: {
      warning: `You will receive a low-quality token in the transaction; it might be a scam`,
    },
  },
];

export default rules;
