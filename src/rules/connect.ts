import { RuleConfig } from ".";
import { caseInsensitiveCompare } from "../utils";

const rules: RuleConfig[] = [
  {
    // Origin 被 Rabby 标记为欺诈网址
    id: "1001",
    enable: true,
    valueDescription: "Site has been flagged as phishing by Rabby",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      danger: true,
    },
    customThreshold: {},
    requires: ["origin"],
    async getValue(ctx, apiService) {
      const origin = ctx.origin!;
      const { is_scam } = await apiService.getOriginIsScam(origin.url, "rabby");
      return is_scam;
    },
  },
  {
    // Origin 被 MetaMask 标记为欺诈网址
    id: "1002",
    enable: true,
    valueDescription: "Site has been flagged as phishing by MetaMask",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      danger: true,
    },
    customThreshold: {},
    requires: ["origin"],
    async getValue(ctx, apiService) {
      const origin = ctx.origin!;
      const { is_scam } = await apiService.getOriginIsScam(
        origin.url,
        "metamask"
      );
      return is_scam;
    },
  },
  {
    // Origin 被 ScamSniffer 标记为欺诈网址
    id: "1003",
    enable: true,
    valueDescription: "Site has been flagged as phishing by ScamSniffer",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      danger: true,
    },
    customThreshold: {},
    requires: ["origin"],
    async getValue(ctx, apiService) {
      const origin = ctx.origin!;
      const { is_scam } = await apiService.getOriginIsScam(
        origin.url,
        "scamsniffer"
      );
      return is_scam;
    },
  },
  {
    // Origin 被知名社区平台收录数
    id: "1004",
    enable: true,
    valueDescription:
      "The number of community platforms that have listed this site",
    valueDefine: {
      type: "int",
      min: 0,
      minIncluded: true,
      max: 100,
      maxIncluded: true,
    },
    defaultThreshold: {
      warning: {
        max: 0,
        maxIncluded: true,
        min: null,
        minIncluded: false,
      },
    },
    customThreshold: {},
    requires: ["origin"],
    async getValue(ctx) {
      const origin = ctx.origin!;
      return origin.communityCount;
    },
  },
  {
    // Origin 使用人数
    id: "1005",
    enable: true,
    valueDescription: "Site popularity",
    valueDefine: {
      type: "enum",
      list: ["very_low", "low", "medium", "high"],
      display: {
        very_low: "Very Low",
        low: "Low",
        medium: "Medium",
        high: "High",
      },
    },
    defaultThreshold: {
      danger: ["very_low"],
    },
    customThreshold: {},
    requires: ["origin"],
    async getValue(ctx) {
      const origin = ctx.origin!;
      return origin.popularLevel;
    },
  },
  {
    // Origin 在用户黑名单中
    id: "1006",
    enable: true,
    valueDescription: "Site has been added to your blacklist",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      forbidden: true,
    },
    customThreshold: {},
    requires: ["origin"],
    async getValue(ctx) {
      return ctx.userData.originBlacklist.some((item) =>
        caseInsensitiveCompare(item, ctx.origin!.url)
      );
    },
  },
  {
    // Origin 在用户白名单中
    id: "1007",
    enable: true,
    valueDescription: "Site has been added to your whitelist",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      safe: true,
    },
    customThreshold: {},
    requires: ["origin"],
    async getValue(ctx) {
      return ctx.userData.originWhitelist.some((item) =>
        caseInsensitiveCompare(item, ctx.origin!.url)
      );
    },
  },
  {
    // Origin 被 Rabby 认证过
    id: "1070",
    enable: true,
    valueDescription: "Site has been verified by Rabby",
    valueDefine: {
      type: "boolean",
    },
    defaultThreshold: {
      safe: true,
    },
    customThreshold: {},
    requires: ["origin"],
    async getValue(ctx, apiService) {
      const origin = ctx.origin!.url;
      const { is_verified } = await apiService.isOriginVerified(origin);
      return !!is_verified;
    },
  },
]

export default rules;