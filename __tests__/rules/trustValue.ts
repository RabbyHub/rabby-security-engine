import Engine from "../../src";
import { defaultRules } from "../../src/rules";

// "trust value is $0" rule id per approve context
const cases = [
  ["tokenApprove", "1150"],
  ["permit", "1148"],
  ["permit2", "1149"],
  ["batchPermit2", "1145"],
  ["nftApprove", "1147"],
  ["collectionApprove", "1146"],
] as const;

describe("trust value is $0 rules", () => {
  test.each(cases)("%s (%s) warns unless manually marked safe", async (key, id) => {
    const engine = new Engine(
      defaultRules.filter((rule) => rule.id === id),
      {} as any
    );
    const run = (data: object) =>
      engine.run({ [key]: { riskExposure: 0, ...data } } as any);

    expect((await run({})).map((r) => r.id)).toEqual([id]);
    expect((await run({ isManualSafe: false })).map((r) => r.id)).toEqual([id]);
    expect(await run({ isManualSafe: true })).toEqual([]);
  });
});
