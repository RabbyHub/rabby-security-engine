import Engine from "../src";

describe("multi rules", () => {
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
          safe: true,
        },
        customThreshold: {},
        requires: ["origin"],
        async getValue(ctx) {
          return ctx.origin.url === 'https://rabby.io';
        },
      },
      {
        id: "1002",
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
          return ctx.origin.communityCount < 1;
        },
      }
    ];
    engine = new Engine(rules);
  })

  test("both trigger", async () => {
    const result = await engine.run({
      origin: {
        url: 'https://rabby.io',
        communityCount: 0,
      },
    });
    expect(result).toEqual([
      {
        id: "1001",
        level: "safe",
        value: true,
        valueDescription: "",
        valueDefine: {
          type: "boolean",
        },
      },
      {
        id: "1002",
        level: "forbidden",
        value: true,
        valueDescription: "",
        valueDefine: {
          type: "boolean",
        },
      },
    ]);
  });

  test("only trigger one", async () => {
    const result = await engine.run({
      origin: {
        url: 'https://rabby.io',
        communityCount: 3,
      },
    });
    expect(result).toEqual([
      {
        id: "1001",
        level: "safe",
        value: true,
        valueDescription: "",
        valueDefine: {
          type: "boolean",
        },
      }
    ]);
  });

  test("custom threshold", async () => {
    engine.reloadRules([
      {
        id: "1001",
        enable: true,
        valueDescription: "",
        valueDefine: {
          type: "boolean",
        },
        defaultThreshold: {
          safe: true,
        },
        customThreshold: {
          forbidden: true,
        },
        requires: ["origin"],
        async getValue(ctx) {
          return ctx.origin.url === 'https://rabby.io';
        },
      },
      {
        id: "1002",
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
          return ctx.origin.communityCount < 1;
        },
      }
    ]);
    const result = await engine.run({
      origin: {
        url: 'https://rabby.io',
        communityCount: 3,
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
      }
    ]);
  })
});