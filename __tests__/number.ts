import Engine from "../src";
import { RuleConfig } from "../src/rules";

describe("number threshold test", () => {
  let engine: Engine;
  beforeEach(() => {
    const rules: RuleConfig[] = [
      {
        id: "1001",
        enable: true,
        valueDescription: "",
        valueDefine: {
          type: "int",
          min: 0,
          minIncluded: false,
          max: 50,
          maxIncluded: true,
        },
        defaultThreshold: {
          forbidden: {
            min: 0,
            minIncluded: true,
            max: 1,
            maxIncluded: true,
          },
          danger: {
            min: 2,
            minIncluded: true,
            max: 5,
            maxIncluded: false,
          },
          warning: {
            min: 5,
            minIncluded: false,
            max: 10,
            maxIncluded: false,
          },
          safe: {
            min: 10,
            minIncluded: true,
            max: 50,
            maxIncluded: false,
          },
        },
        customThreshold: {},
        requires: ["origin"],
        async getValue(ctx) {
          return ctx.origin!.communityCount;
        },
      },
    ];
    engine = new Engine(rules, {} as any);
  });

  test("forbidden", async () => {
    const result = await engine.run({ origin: { communityCount: 0 } });
    expect(result).toEqual([
      {
        id: "1001",
        level: "forbidden",
        value: 0,
        valueDefine: {
          max: 50,
          maxIncluded: true,
          min: 0,
          minIncluded: false,
          type: "int",
        },
        valueDescription: "",
        threshold: {
          forbidden: {
            min: 0,
            minIncluded: true,
            max: 1,
            maxIncluded: true,
          },
          danger: {
            min: 2,
            minIncluded: true,
            max: 5,
            maxIncluded: false,
          },
          warning: {
            min: 5,
            minIncluded: false,
            max: 10,
            maxIncluded: false,
          },
          safe: {
            min: 10,
            minIncluded: true,
            max: 50,
            maxIncluded: false,
          },
        },
        enable: true,
      },
    ]);
  });

  test("danger", async () => {
    const result = await engine.run({ origin: { communityCount: 2 } });
    expect(result).toEqual([
      {
        id: "1001",
        level: "danger",
        value: 2,
        valueDefine: {
          max: 50,
          maxIncluded: true,
          min: 0,
          minIncluded: false,
          type: "int",
        },
        valueDescription: "",
        threshold: {
          forbidden: {
            min: 0,
            minIncluded: true,
            max: 1,
            maxIncluded: true,
          },
          danger: {
            min: 2,
            minIncluded: true,
            max: 5,
            maxIncluded: false,
          },
          warning: {
            min: 5,
            minIncluded: false,
            max: 10,
            maxIncluded: false,
          },
          safe: {
            min: 10,
            minIncluded: true,
            max: 50,
            maxIncluded: false,
          },
        },
        enable: true
      },
    ]);
  });

  test("warning", async () => {
    const result = await engine.run({ origin: { communityCount: 6 } });
    expect(result).toEqual([
      {
        id: "1001",
        level: "warning",
        value: 6,
        valueDefine: {
          max: 50,
          maxIncluded: true,
          min: 0,
          minIncluded: false,
          type: "int",
        },
        valueDescription: "",
        threshold: {
          forbidden: {
            min: 0,
            minIncluded: true,
            max: 1,
            maxIncluded: true,
          },
          danger: {
            min: 2,
            minIncluded: true,
            max: 5,
            maxIncluded: false,
          },
          warning: {
            min: 5,
            minIncluded: false,
            max: 10,
            maxIncluded: false,
          },
          safe: {
            min: 10,
            minIncluded: true,
            max: 50,
            maxIncluded: false,
          },
        },
        enable: true
      },
    ]);
  });

  test("safe", async () => {
    const result = await engine.run({ origin: { communityCount: 10 } });
    expect(result).toEqual([
      {
        id: "1001",
        level: "safe",
        value: 10,
        valueDefine: {
          max: 50,
          maxIncluded: true,
          min: 0,
          minIncluded: false,
          type: "int",
        },
        valueDescription: "",
        threshold: {
          forbidden: {
            min: 0,
            minIncluded: true,
            max: 1,
            maxIncluded: true,
          },
          danger: {
            min: 2,
            minIncluded: true,
            max: 5,
            maxIncluded: false,
          },
          warning: {
            min: 5,
            minIncluded: false,
            max: 10,
            maxIncluded: false,
          },
          safe: {
            min: 10,
            minIncluded: true,
            max: 50,
            maxIncluded: false,
          },
        },
        enable: true
      },
    ]);
  });

  test("null", async () => {
    const result = await engine.run({ origin: { communityCount: 5 } });
    expect(result).toEqual([]);
  });
});

describe("number infinite test", () => {
  let engine: Engine;
  beforeEach(() => {
    const rules: RuleConfig[] = [
      {
        id: "1001",
        enable: true,
        valueDescription: "",
        valueDefine: {
          type: "float",
          min: null,
          minIncluded: false,
          max: null,
          maxIncluded: false,
        },
        defaultThreshold: {
          forbidden: {
            min: null,
            minIncluded: false,
            max: 1,
            maxIncluded: true,
          },
          danger: {
            min: 1.5,
            minIncluded: true,
            max: null,
            maxIncluded: false,
          },
          warning: {
            min: 5,
            minIncluded: false,
            max: 10,
            maxIncluded: false,
          },
          safe: {
            min: 10,
            minIncluded: true,
            max: 50,
            maxIncluded: false,
          },
        },
        customThreshold: {},
        requires: ["origin"],
        async getValue(ctx) {
          return ctx.origin!.communityCount;
        },
      },
    ];
    engine = new Engine(rules, {} as any);
  });

  test("forbidden", async () => {
    const result = await engine.run({ origin: { communityCount: -9999.999 } });
    expect(result).toEqual([
      {
        id: "1001",
        level: "forbidden",
        value: -9999.999,
        valueDefine: {
          type: "float",
          min: null,
          minIncluded: false,
          max: null,
          maxIncluded: false,
        },
        valueDescription: "",
        threshold: {
          forbidden: {
            min: null,
            minIncluded: false,
            max: 1,
            maxIncluded: true,
          },
          danger: {
            min: 1.5,
            minIncluded: true,
            max: null,
            maxIncluded: false,
          },
          warning: {
            min: 5,
            minIncluded: false,
            max: 10,
            maxIncluded: false,
          },
          safe: {
            min: 10,
            minIncluded: true,
            max: 50,
            maxIncluded: false,
          },
        },
        enable: true,
      },
    ]);
  });

  test("danger", async () => {
    const result = await engine.run({
      origin: { communityCount: 200000000.000002 },
    });
    expect(result).toEqual([
      {
        id: "1001",
        level: "danger",
        value: 200000000.000002,
        valueDefine: {
          type: "float",
          min: null,
          minIncluded: false,
          max: null,
          maxIncluded: false,
        },
        valueDescription: "",
        threshold: {
          forbidden: {
            min: null,
            minIncluded: false,
            max: 1,
            maxIncluded: true,
          },
          danger: {
            min: 1.5,
            minIncluded: true,
            max: null,
            maxIncluded: false,
          },
          warning: {
            min: 5,
            minIncluded: false,
            max: 10,
            maxIncluded: false,
          },
          safe: {
            min: 10,
            minIncluded: true,
            max: 50,
            maxIncluded: false,
          },
        },
        enable: true,
      },
    ]);
  });

  test("both infinite and reload rules", async () => {
    engine.reloadRules([
      {
        id: "1001",
        enable: true,
        valueDescription: "",
        valueDefine: {
          type: "float",
          min: null,
          minIncluded: false,
          max: null,
          maxIncluded: false,
        },
        defaultThreshold: {
          forbidden: {
            min: null,
            minIncluded: false,
            max: null,
            maxIncluded: false,
          },
          danger: {
            min: 1.5,
            minIncluded: true,
            max: null,
            maxIncluded: false,
          },
          warning: {
            min: 5,
            minIncluded: false,
            max: 10,
            maxIncluded: false,
          },
          safe: {
            min: 10,
            minIncluded: true,
            max: 50,
            maxIncluded: false,
          },
        },
        customThreshold: {},
        requires: ["origin"],
        async getValue(ctx) {
          return ctx.origin!.communityCount;
        },
      },
    ]);

    const result = await engine.run({
      origin: { communityCount: 200000000.000002 },
    });
    expect(result).toEqual([
      {
        id: "1001",
        level: "forbidden",
        value: 200000000.000002,
        valueDefine: {
          type: "float",
          min: null,
          minIncluded: false,
          max: null,
          maxIncluded: false,
        },
        valueDescription: "",
        threshold: {
          forbidden: {
            min: null,
            minIncluded: false,
            max: null,
            maxIncluded: false,
          },
          danger: {
            min: 1.5,
            minIncluded: true,
            max: null,
            maxIncluded: false,
          },
          warning: {
            min: 5,
            minIncluded: false,
            max: 10,
            maxIncluded: false,
          },
          safe: {
            min: 10,
            minIncluded: true,
            max: 50,
            maxIncluded: false,
          },
        },
        enable: true
      },
    ]);
  });
});
