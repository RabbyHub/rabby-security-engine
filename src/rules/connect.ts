import { RuleConfig } from ".";
import { caseInsensitiveCompare } from "../utils";

const rules: RuleConfig[] = [
  {
    id: "1001",
    enable: true,
    valueDescription: "Site has been flagged as phishing by Rabby",
    valueDefine: {
      type: "boolean",
    },
    descriptions: {
      danger: "The website has been flagged as scam by Rabby",
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
    id: "1002",
    enable: true,
    valueDescription: "Site has been flagged as phishing by MetaMask",
    valueDefine: {
      type: "boolean",
    },
    descriptions: {
      danger: "The website has been flagged as scam by MetaMask",
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
    id: "1003",
    enable: true,
    valueDescription: "Site has been flagged as phishing by ScamSniffer",
    descriptions: {
      danger: "The website has been flagged as scam by ScamSniffer",
    },
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
    id: "1004",
    enable: true,
    valueDescription:
      "The number of community platforms that have listed this site",
    descriptions: {
      warning: "The website has not been listed on any community platforms",
    },
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
    id: "1005",
    enable: true,
    valueDescription: "Site popularity",
    descriptions: {
      danger: "The website has very low popularity",
    },
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
      warning: ["very_low"],
    },
    customThreshold: {},
    requires: ["origin"],
    async getValue(ctx) {
      const origin = ctx.origin!;
      return origin.popularLevel;
    },
  },
  {
    id: "1006",
    enable: true,
    valueDescription: "Site has been added to your blacklist",
    descriptions: {
      forbidden: `The website has been marked as "Blocked" by you`,
    },
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
    id: "1007",
    enable: true,
    valueDescription: "Site has been added to your whitelist",
    descriptions: {
      safe: `The website has been marked as "Trusted" by you`,
    },
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
    id: "1070",
    enable: true,
    valueDescription: "Site has been verified by Rabby",
    descriptions: {
      safe: "The website has been verified by Rabby",
    },
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
];

export default rules;
