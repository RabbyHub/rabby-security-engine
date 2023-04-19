import Engine from "../src";
import { RuleConfig } from "../src/rules";

describe("boolean", () => {
  let engine: Engine;
  beforeEach(() => {
    const rules: RuleConfig[] = [
      {
        id: "1001",
        enable: true,
        valueDescription: "",
        valueDefine: {
          type: "boolean",
        },
        defaultThreshold: {
          forbidden: true,
        },
        customThreshold: {},
        requires: ["origin"],
        async getValue(ctx) {
          return ctx.origin!.url === "https://rabby1.io";
        },
      },
    ];
    engine = new Engine(rules, {} as any);
  });

  test("1001 should be forbidden", async () => {
    const result = await engine.run({
      origin: {
        url: "https://rabby1.io",
      },
    });
    expect(result).toEqual([
      {
        id: "1001",
        level: "forbidden",
        value: true,
        valueDescription: "",
        valueDefine: {
          type: "boolean",
        },
      },
    ]);
  });

  test("1001 should be empty", async () => {
    const result = await engine.run({
      origin: 2,
    });
    expect(result).toEqual([]);
  });

  test("should not run rule if require property not exist", async () => {
    const result = await engine.run({
      a: 1,
    });
    expect(result).toEqual([]);
  });
});
