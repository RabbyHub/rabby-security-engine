import Engine from "../../src";
import { RuleConfig } from "../../src/rules";

describe("addLiquidity rules", () => {
  let engine: Engine;

  describe("Rule 1153 - Recipient address does not match", () => {
    beforeEach(() => {
      const rules: RuleConfig[] = [
        {
          id: "1153",
          enable: true,
          valueDescription: "Recipient address does not match current address",
          valueDefine: {
            type: "boolean",
          },
          defaultThreshold: {
            danger: true,
          },
          customThreshold: {},
          requires: ["addLiquidity"],
          async getValue(ctx) {
            const { receiverMatch } = ctx.addLiquidity!;
            return !receiverMatch;
          },
          descriptions: {
            danger: `Recipient address does not match current address`,
          },
        },
      ];
      engine = new Engine(rules, {} as any);
    });

    test("1153 should be empty when recipient match", async () => {
      const result = await engine.run({
        addLiquidity: {
          receiverMatch: true,
        },
      });
      expect(result).toEqual([]);
    });

    test("1153 should be danger when recipient does not matches", async () => {
      const result = await engine.run({
        addLiquidity: {
          receiverMatch: false,
        },
      });
      expect(result).toEqual([
        {
          id: "1153",
          level: "danger",
          value: true,
          valueDescription: "Recipient address does not match current address",
          valueDefine: {
            type: "boolean",
          },
          threshold: {
            danger: true,
          },
          enable: true,
        },
      ]);
    });

    test("1153 should be empty when addLiquidity context is missing", async () => {
      const result = await engine.run({
        other: "data",
      });
      expect(result).toEqual([]);
    });
  });

  describe("Rule 1154 - Price difference", () => {
    beforeEach(() => {
      const rules: RuleConfig[] = [
        {
          id: "1154",
          enable: true,
          valueDescription:
            "This pool's price differs greatly from the market price. You may lose money due to arbitrage.",
          valueDefine: {
            type: "percent",
            min: null,
            minIncluded: false,
            max: null,
            maxIncluded: false,
          },
          defaultThreshold: {
            danger: {
              max: null,
              maxIncluded: true,
              min: 10,
              minIncluded: true,
            },
            warning: {
              max: 10,
              maxIncluded: false,
              min: 5,
              minIncluded: true,
            },
          },
          customThreshold: {},
          requires: ["addLiquidity"],
          async getValue(ctx) {
            const { diff } = ctx.addLiquidity!;
            return diff;
          },
          descriptions: {
            danger: `This pool's price differs greatly from the market price. You may lose money due to arbitrage.`,
          },
        },
      ];
      engine = new Engine(rules, {} as any);
    });

    test("1154 should be empty when price difference is less than 5%", async () => {
      const result = await engine.run({
        addLiquidity: {
          diff: 4,
        },
      });
      expect(result).toEqual([]);
    });

    test("1154 should be danger when price difference is gte 10%", async () => {
      const result = await engine.run({
        addLiquidity: {
          diff: 11,
        },
      });
      expect(result).toEqual([
        {
          id: "1154",
          level: "danger",
          value: 11,
          valueDescription:
            "This pool's price differs greatly from the market price. You may lose money due to arbitrage.",
          valueDefine: {
            type: "percent",
            min: null,
            minIncluded: false,
            max: null,
            maxIncluded: false,
          },
          threshold: {
            danger: {
              max: null,
              maxIncluded: true,
              min: 10,
              minIncluded: true,
            },
            warning: {
              max: 10,
              maxIncluded: false,
              min: 5,
              minIncluded: true,
            },
          },
          enable: true,
        },
      ]);
    });

    test("1154 should be warning when price difference is between 5% and 10%", async () => {
      const result = await engine.run({
        addLiquidity: {
          diff: 7.5,
        },
      });
      expect(result).toEqual([
        {
          id: "1154",
          level: "warning",
          value: 7.5,
          valueDescription:
            "This pool's price differs greatly from the market price. You may lose money due to arbitrage.",
          valueDefine: {
            type: "percent",
            min: null,
            minIncluded: false,
            max: null,
            maxIncluded: false,
          },
          threshold: {
            danger: {
              max: null,
              maxIncluded: true,
              min: 10,
              minIncluded: true,
            },
            warning: {
              max: 10,
              maxIncluded: false,
              min: 5,
              minIncluded: true,
            },
          },
          enable: true,
        },
      ]);
    });

    test("1154 should be empty when addLiquidity context is missing", async () => {
      const result = await engine.run({
        other: "data",
      });
      expect(result).toEqual([]);
    });
  });

  describe("Both rules together", () => {
    beforeEach(() => {
      const rules: RuleConfig[] = [
        {
          id: "1153",
          enable: true,
          valueDescription: "Recipient address does not match current address",
          valueDefine: {
            type: "boolean",
          },
          defaultThreshold: {
            danger: true,
          },
          customThreshold: {},
          requires: ["addLiquidity"],
          async getValue(ctx) {
            const { receiverMatch } = ctx.addLiquidity!;
            return !receiverMatch;
          },
          descriptions: {
            danger: `Recipient address does not match current address`,
          },
        },
        {
          id: "1154",
          enable: true,
          valueDescription:
            "This pool's price differs greatly from the market price. You may lose money due to arbitrage.",
          valueDefine: {
            type: "percent",
            min: null,
            minIncluded: false,
            max: null,
            maxIncluded: false,
          },
          defaultThreshold: {
            danger: {
              max: null,
              maxIncluded: true,
              min: 10,
              minIncluded: true,
            },
            warning: {
              max: 10,
              maxIncluded: false,
              min: 5,
              minIncluded: true,
            },
          },
          customThreshold: {},
          requires: ["addLiquidity"],
          async getValue(ctx) {
            const { diff } = ctx.addLiquidity!;
            return diff;
          },
          descriptions: {
            danger: `This pool's price differs greatly from the market price. You may lose money due to arbitrage.`,
          },
        },
      ];
      engine = new Engine(rules, {} as any);
    });

    test("Both rules should trigger with receiverMatch false and diff in danger range", async () => {
      const result = await engine.run({
        addLiquidity: {
          receiverMatch: false,
          diff: 7.5,
        },
      });
      expect(result).toEqual([
        {
          id: "1153",
          level: "danger",
          value: true,
          valueDescription: "Recipient address does not match current address",
          valueDefine: {
            type: "boolean",
          },
          threshold: {
            danger: true,
          },
          enable: true,
        },
        {
          id: "1154",
          level: "warning",
          value: 7.5,
          valueDescription:
            "This pool's price differs greatly from the market price. You may lose money due to arbitrage.",
          valueDefine: {
            type: "percent",
            min: null,
            minIncluded: false,
            max: null,
            maxIncluded: false,
          },
          threshold: {
            danger: {
              max: null,
              maxIncluded: true,
              min: 10,
              minIncluded: true,
            },
            warning: {
              max: 10,
              maxIncluded: false,
              min: 5,
              minIncluded: true,
            },
          },
          enable: true,
        },
      ]);
    });

    test("Only rule 1153 should trigger", async () => {
      const result = await engine.run({
        addLiquidity: {
          receiverMatch: false,
          diff: -15,
        },
      });
      expect(result).toEqual([
        {
          id: "1153",
          level: "danger",
          value: true,
          valueDescription: "Recipient address does not match current address",
          valueDefine: {
            type: "boolean",
          },
          threshold: {
            danger: true,
          },
          enable: true,
        },
      ]);
    });

    test("Only rule 1154 should trigger", async () => {
      const result = await engine.run({
        addLiquidity: {
          receiverMatch: true,
          diff: 7.5,
        },
      });
      expect(result).toEqual([
        {
          id: "1154",
          level: "warning",
          value: 7.5,
          valueDescription:
            "This pool's price differs greatly from the market price. You may lose money due to arbitrage.",
          valueDefine: {
            type: "percent",
            min: null,
            minIncluded: false,
            max: null,
            maxIncluded: false,
          },
          threshold: {
            danger: {
              max: null,
              maxIncluded: true,
              min: 10,
              minIncluded: true,
            },
            warning: {
              max: 10,
              maxIncluded: false,
              min: 5,
              minIncluded: true,
            },
          },
          enable: true,
        },
      ]);
    });

    test("Neither rule should trigger", async () => {
      const result = await engine.run({
        addLiquidity: {
          receiverMatch: true,
          diff: -15,
        },
      });
      expect(result).toEqual([]);
    });
  });
});
