import { RuleConfig } from ".";
import { caseInsensitiveCompare } from "../utils";

const rules: RuleConfig[] = [
  {
    // 是否有指定买家
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
  },
  {
    // receiver 是其他地址
    id: "1082",
    enable: true,
    valueDescription: "Is the earnings from the order be paid to my current address",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      danger: true,
    },
    customThreshold: {},
    requires: ["sellNFT"],
    async getValue(ctx) {
      const { receiver, from } = ctx.sellNFT!;
      return !caseInsensitiveCompare(from, receiver);
    },
  },
  {
    // receive token 是否被标记为假资产
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
  },
  {
    // receive token 是否被标记为垃圾资产
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
  },
];

export default rules;
