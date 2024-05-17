import { RuleConfig } from ".";
import { caseInsensitiveCompare } from "../utils";

const rules: RuleConfig[] = [
  {
    id: "1085",
    enable: true,
    valueDescription:
      "Is the earnings from the order be paid to my current address",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      danger: true,
    },
    customThreshold: {},
    requires: ["buyNFT"],
    async getValue(ctx) {
      const { receiver, from } = ctx.buyNFT!;
      return !caseInsensitiveCompare(from, receiver);
    },
    descriptions: {
      danger: `The recipient address is not your current address`,
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
    descriptions: {
      danger: `You will receive a scam NFT in the transaction`,
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
    descriptions: {
      warning: `You will receive a low-quality NFT in the transaction; it might be a scam`,
    },
  },
];

export default rules;
