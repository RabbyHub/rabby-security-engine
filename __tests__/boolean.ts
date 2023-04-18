import Engine from "../src";

describe("boolean", () => {
  let engine: Engine;
  beforeEach(() => {
    const rules = [
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
          return ctx.origin === 1;
        },
      },
    ];
    engine = new Engine(rules);
  });

  test("1001 should be forbidden", async () => {
    const result = await engine.run({
      origin: 1,
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