/**
 * @author zhushiqi
 */
/* eslint-disable @typescript-eslint/no-explicit-any */

export class Validator {
  static isEmpty(val: any) {
    return ['', null, undefined].indexOf(val) > -1 || (val.trim ? val.trim() === '' : false);
  }

  static isNumber(val: any) {
    return /^(-|\+)?\d+(\.\d+)?$/.test(val);
  }

  static isInteger(val: any) {
    return /^(-|\+)?\d+$/.test(val);
  }

  static isZero(val: any) {
    return this.isNumber(val) && Number(val) === 0;
  }

  static min(val: any, minVal: number, equal = true) {
    return this.isNumber(val) && (equal ? val >= minVal : val > minVal);
  }

  static max(val: any, maxVal: number, equal = true) {
    return this.isNumber(val) && (equal ? val <= maxVal : val < maxVal);
  }

  static maxFloat(val: any, floatLength = 2) {
    // /^(-|\+)?\d+(\.\d{0,2})?$/
    return new RegExp(`^(-|\\+)?\\d+(\\.\\d{0,${floatLength}})?$`).test(val);
  }
}

/**
 * 用于修复 a-select 使用 required 校验无法通过的bug
 * @param message
 */
export function validatorSelect(message: string): FormRuleItem {
  return {
    required: true,
    trigger: 'blur',
    validator(rule, value) {
      if (Validator.isEmpty(value)) {
        return Promise.reject(message);
      }
      return Promise.resolve();
    },
  };
}
