import { Request } from 'express';
import { ValidationChain, validationResult } from 'express-validator';
import { IReturnType } from '../types/common';

const validate = async (
  req: Request,
  rules: ValidationChain[]
): Promise<IReturnType> => {
  try {
    const ruleArray = Array.isArray(rules) ? rules : [rules];
    await Promise.all(ruleArray.flatMap((validation) => validation.run(req)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return { success: false, data: { resData: errors.array() } };
    }
    return { success: true, data: { resData: {} } };
  } catch (error: any) {
    return { success: false, data: { resData: {} } };
  }
};

export default validate;
