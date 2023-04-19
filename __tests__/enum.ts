import Engine from "../src";
import { RuleConfig } from "../src/rules";

const originTest = {
  "https://very-low.com": "very_low",
  "https://low.com": "low",
  "https://high.com": "high",
  "https://very-high.com": "very_high",
};

describe("enum", () => {
  let engine: Engine;
  beforeEach(() => {
    const rules: RuleConfig[] = [
      {
        id: "1001",
        enable: true,
        valueDescription: "",
        valueDefine: {
          type: "enum",
          list: ["very_low", "low", "high", "very_high"],
          display: {},
        },
        defaultThreshold: {
          forbidden: ["very_low", "low"],
          warning: ["high"],
          safe: ["very_high"],
        },
        customThreshold: {},
        requires: ["origin"],
        async getValue(ctx) {
          const url = ctx.origin!.url;
          return originTest[url] || "high";
        },
      },
    ];
    engine = new Engine(rules, {} as any);
  });

  test("forbidden", async () => {
    const result = await engine.run({
      origin: {
        url: "https://low.com",
      },
    });
    expect(result).toEqual([
      {
        id: "1001",
        level: "forbidden",
        value: "low",
        valueDefine: {
          type: "enum",
          list: ["very_low", "low", "high", "very_high"],
          display: {},
        },
        valueDescription: "",
      },
    ]);
  });

  test("warning", async () => {
    const result = await engine.run({
      origin: {
        url: "https://high.com",
      },
    });
    expect(result).toEqual([
      {
        id: "1001",
        level: "warning",
        value: "high",
        valueDefine: {
          type: "enum",
          list: ["very_low", "low", "high", "very_high"],
          display: {},
        },
        valueDescription: "",
      },
    ]);
  });

  test("safe", async () => {
    const result = await engine.run({
      origin: {
        url: "https://very-high.com",
      },
    });
    expect(result).toEqual([
      {
        id: "1001",
        level: "safe",
        value: "very_high",
        valueDefine: {
          type: "enum",
          list: ["very_low", "low", "high", "very_high"],
          display: {},
        },
        valueDescription: "",
      },
    ]);
  });
});
