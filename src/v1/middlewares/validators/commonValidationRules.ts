import { ValidationChain, check } from 'express-validator';
import * as commonMethods from '../../helpers/common';
import {
  EMAIL_REQUIRED,
  FIRST_NAME_LENGTH,
  LAST_NAME_LENGTH,
  LAST_NAME_REQUIRED,
  MUST_STRING,
  PASSWORD_LENGTH,
  PASSWORD_REQUIRED,
  VALID_EMAIL,
} from '../../helpers/locale.json';
const {
  response: {
    statuses: { error: errorStatus },
    create: createResponse,
  },
  responseStatusCodes: { validationError },
} = commonMethods;
export type Validation = {
  [key: string]: ValidationChain;
};

export const commonValidationRules: Validation = {
  firstName: check('firstName')
    .isLength({ min: 3 })
    .bail()
    .withMessage(FIRST_NAME_LENGTH.en),

  lastName: check('lastName')
    .trim()
    .notEmpty()
    .bail()
    .withMessage(LAST_NAME_REQUIRED.en)
    .isString()
    .withMessage(MUST_STRING.en)
    .isLength({ min: 3 })
    .bail()
    .withMessage(LAST_NAME_LENGTH.en),

  email: check('email')
    .trim()
    .notEmpty()
    .bail()
    .withMessage(EMAIL_REQUIRED.en)
    .isString()
    .bail()
    .withMessage(MUST_STRING.en)
    .isEmail()
    .withMessage(VALID_EMAIL.en)
    .isLength({ min: 5 })
    .bail()
    .withMessage(VALID_EMAIL.en),

  password: check('password')
    .trim()
    .notEmpty()
    .bail()
    .withMessage(PASSWORD_REQUIRED.en)
    .isLength({ min: 8 })
    .bail()
    .withMessage(PASSWORD_LENGTH.en),
};

export const isStringAndRequiredField = (
  key: string,
  message: string,
  translateObj: any
) => {
  return check(key)
    .isString()
    .withMessage(MUST_STRING.en)
    .trim()
    .notEmpty()
    .bail()
    .withMessage(translateObj.__(message));
};
