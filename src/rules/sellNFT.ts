import { RuleConfig } from ".";
import { caseInsensitiveCompare } from "../utils";

const rules: RuleConfig[] = [
  {
    id: "1081",
    enable: true,
    valueDescription: "Does the order have a specific buyer",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      warning: true,
    },
    customThreshold: {},
    requires: ["sellNFT"],
    async getValue(ctx) {
      return !!ctx.sellNFT!.specificBuyer;
    },
    descriptions: {
      warning: `The order has a specific buyer; Ensure that you intend to sell to this buyer`,
    },
  },
  {
    id: "1082",
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
    requires: ["sellNFT"],
    async getValue(ctx) {
      const { receiver, from } = ctx.sellNFT!;
      return caseInsensitiveCompare(from, receiver);
    },
    descriptions: {
      danger: `The earnings from the order are not paid to your current address`,
    },
  },
  {
    id: "1083",
    enable: true,
    valueDescription: "Fake token expected to be received in transaction",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      danger: true,
    },
    customThreshold: {},
    requires: ["sellNFT"],
    async getValue(ctx) {
      return ctx.sellNFT!.receiveTokenIsFake;
    },
    descriptions: {
      danger: `You will receive a scam token in the transaction`,
    },
  },
  {
    id: "1084",
    enable: true,
    valueDescription: "Scam token expected to be received in transaction",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      warning: true,
    },
    customThreshold: {},
    requires: ["sellNFT"],
    async getValue(ctx) {
      return ctx.sellNFT!.receiveTokenIsScam;
    },
    descriptions: {
      warning: `You will receive a low-quality token in the transaction; it might be a scam`,
    },
  },
];

export default rules;
