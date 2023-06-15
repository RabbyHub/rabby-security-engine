import { RuleConfig } from ".";
import { caseInsensitiveCompare } from "../utils";

const rules: RuleConfig[] = [
  {
    // receiver 是其他地址
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
      const { receiver, from } = ctx.buyNFT!;
      return !caseInsensitiveCompare(from, receiver);
    },
  },
  {
    // receive token 是否被标记为假资产
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
    // receive token 是否被标记为垃圾资产
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
