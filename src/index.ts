import { RuleConfig, Level } from "./rules";
import strategyDecision from "./strategyDecision";
import { OpenApiService } from "@debank/rabby-api";

export interface Result {
  id: string;
  level: Level;
  value: any;
  valueDescription: string;
  valueDefine: RuleConfig["valueDefine"];
}

class Engine {
  rules: RuleConfig[] = [];
  apiService: OpenApiService;

  constructor(rules: RuleConfig[], apiService: OpenApiService) {
    this.rules = rules;
    this.apiService = apiService;
  }

  async run(ctx) {
    const results: Result[] = [];
    await Promise.all(
      this.rules.map(async (rule) => {
        const deps = rule.requires;
        if (rule.enable && deps.every((key) => key in ctx)) {
          try {
            const value = await rule.getValue(ctx, this.apiService);
            const riskLevel = strategyDecision(value, rule);
            if (riskLevel) {
              results.push({
                id: rule.id,
                level: riskLevel,
                value,
                valueDescription: rule.valueDescription,
                valueDefine: rule.valueDefine,
              });
            }
          } catch (e) {
            results.push({
              id: rule.id,
              level: Level.ERROR,
              value: null,
              valueDescription: rule.valueDescription,
              valueDefine: rule.valueDefine,
            });
          }
        }
      })
    );
    return results;
  }

  reloadRules(rules: RuleConfig[]) {
    this.rules = rules;
  }
}

export default Engine;
