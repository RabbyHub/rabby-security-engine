import { RuleConfig, Level, Threshold } from "./rules";
import strategyDecision from "./strategyDecision";
import { OpenApiService } from "@rabby-wallet/rabby-api";

export interface Result {
  id: string;
  level: Level;
  value: any;
  valueDescription: string;
  valueDefine: RuleConfig["valueDefine"];
  enable: boolean;
  threshold: Threshold;
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
        if (deps.some((key) => key in ctx)) {
          const enable = rule.enable;
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
                enable,
                threshold: {
                  ...rule.defaultThreshold,
                  ...(rule.customThreshold || {}),
                },
              });
            }
          } catch (e) {
            results.push({
              id: rule.id,
              level: Level.ERROR,
              value: null,
              valueDescription: rule.valueDescription,
              valueDefine: rule.valueDefine,
              enable,
              threshold: {
                ...rule.defaultThreshold,
                ...(rule.customThreshold || {}),
              },
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
