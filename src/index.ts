import { RuleConfig, Level } from "./rules";
import strategyDecision from './strategyDecision';

export interface Result {
  id: string;
  level: Level;
  value: any;
  valueDescription: string;
  valueDefine: RuleConfig['valueDefine'];
}

class Engine {
  rules: RuleConfig[] = [];

  constructor(rules) {
    this.rules = rules;
  }
  
  async run(ctx) {
    const results: Result[] = []
    this.rules.forEach(async (rule) => {
      const deps = rule.requires;
      if (deps.every(key => key in ctx)) {
        const value = await rule.getValue(ctx);
        const riskLevel = strategyDecision(value, rule);
        if (riskLevel) {
          results.push({
            id: rule.id,
            level: riskLevel,
            value,
            valueDescription: rule.valueDescription,
            valueDefine: rule.valueDefine,
          })
        }
      }
    })
    return results;
  }
  
  reloadRules(rules) {
    this.rules = rules
  }
}

export default Engine;
