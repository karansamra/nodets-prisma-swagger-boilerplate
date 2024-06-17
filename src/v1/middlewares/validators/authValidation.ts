import { NextFunction, Request, Response } from 'express';
import { ValidationChain, check } from 'express-validator';
import * as commonMethods from '../../helpers/common';
import { handleError } from '../../helpers/errorHandling';
import { translate } from '../../helpers/multilingual';
import validate from '../../helpers/validate';
import {
  commonValidationRules,
  isStringAndRequiredField,
} from './commonValidationRules';
const {
  response: {
    statuses: { error: errorStatus },
    create: createResponse,
  },
  responseStatusCodes: { validationError },
} = commonMethods;

export const addUserValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const translateObj = translate(req.headers.lang);
    let validationRules: ValidationChain[] = [
      isStringAndRequiredField(
        'firstName',
        'FIRST_NAME_REQUIRED',
        translateObj
      ),
      isStringAndRequiredField('lastName', 'LAST_NAME_REQUIRED', translateObj),
      commonValidationRules.email,
      commonValidationRules.password,
      check('confirmPassword')
        .equals(req.body.password)
        .withMessage(translateObj.__('CONFORM_PASSWORD')),
      check('endUserType')
        .notEmpty()
        .bail()
        .withMessage(translateObj.__('USER_TYPE'))
        .isInt()
        .bail()
        .withMessage(translateObj.__('USER_TYPE_NUMBER'))
        .isIn([1, 2])
        .withMessage(translateObj.__('USER_TYPE_IN_VALUES')),
    ];
    const validationResult = await validate(req, validationRules);
    if (!validationResult.success) {
      throw new (handleError as any)(
        translateObj.__('HEADERS_MISSING'),
        validationError,
        validationResult.data.resData
      );
    }
    next();
  } catch (error: any) {
    return createResponse(
      res,
      errorStatus,
      {},
      error.message,
      error.code,
      error.errorData
    );
  }
};
