import { RuleConfig, Level, Threshold, NumberDefine } from "./rules";

const getFinalRiskLevel = (levels: string[]) => {
  const priority = [Level.FORBIDDEN, Level.DANGER, Level.WARNING, Level.SAFE];
  for (let i = 0; i < priority.length; i++) {
    if (levels.includes(priority[i])) return priority[i];
  }
  return null;
};

const numberThresholdCheck = (
  value: number | null,
  threshold: NumberDefine
) => {
  const { max, min, minIncluded, maxIncluded } = threshold;
  if (value === null) {
    return false;
  }
  if (max === null || min === null) {
    if (max === null && min !== null) {
      // infinity but not infinitesimal
      if (minIncluded) {
        return min <= value;
      } else {
        return min < value;
      }
    } else if (max !== null && min === null) {
      // infinitesimal but not infinity
      if (maxIncluded) {
        return max >= value;
      } else {
        return max > value;
      }
    } else {
      // infinitesimal and infinity
      return true;
    }
  } else {
    if (maxIncluded && minIncluded) {
      // [min, max]
      return max >= value && min <= value;
    } else if (maxIncluded) {
      // (min, max]
      return max >= value && min < value;
    } else if (minIncluded) {
      // [min, max)
      return max > value && min <= value;
    } else {
      // (min, max)
      return max > value && min < value;
    }
  }
};

const strategyDecision = (
  value: boolean | number | string,
  config: RuleConfig
) => {
  const { defaultThreshold, customThreshold, valueDefine } = config;
  const thresholds: Threshold = {
    ...defaultThreshold,
    ...customThreshold,
  };
  const { type } = valueDefine;
  switch (type) {
    case "boolean": {
      const list = Object.keys(thresholds).filter((key) => {
        const threshold: boolean = thresholds[key];
        return threshold === (value as boolean);
      });
      return getFinalRiskLevel(list);
    }
    case "enum": {
      const list = Object.keys(thresholds).filter((key) => {
        const threshold: string[] = thresholds[key];
        return threshold.includes(value as string);
      });
      return getFinalRiskLevel(list);
    }
    case "int":
    case "float": {
      const list = Object.keys(thresholds).filter((key) => {
        const threshold: NumberDefine = thresholds[key];
        return numberThresholdCheck(value as number, threshold);
      });
      return getFinalRiskLevel(list);
    }
    case "percent": {
      const list = Object.keys(thresholds).filter((key) => {
        const threshold: NumberDefine = thresholds[key];
        return numberThresholdCheck(
          value === null ? null : value as number,
          threshold
        );
      });
      return getFinalRiskLevel(list);
    }
  }
};

export default strategyDecision;
