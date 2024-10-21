import { z } from 'zod';

import {
  EMAIL_REQUIRED,
  PASSWORD_REQUIRED,
  VALID_EMAIL,
  USERNAME_REQUIRED,
  USERNAME_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  EMAIL_MIN_LENGTH,
  EMAIL_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  UUID_REQUIRED,
  INVALID_UUID_FORMAT,
  INVALID_PAGE_NUMBER,
  INVALID_PAGE_LIMIT,
} from '../../../helpers/locale.json';
import {
  defaultRecordsPerPageLimit,
  defaultStartingPage,
  defaultZeroValue,
  emailMaxLength,
  emailMinLength,
  passwordMaxLength,
  passwordMinLength,
  userNameMaxLength,
  userNameMinLength,
} from '../../../helpers/validationConstants';

export const signupSchema = z.object({
  body: z.object({
    userName: z
      .string({ required_error: USERNAME_REQUIRED.en })
      .trim()
      .min(userNameMinLength, { message: USERNAME_MIN_LENGTH.en })
      .max(userNameMaxLength, { message: USERNAME_MAX_LENGTH.en }),
    email: z
      .string({ required_error: EMAIL_REQUIRED.en })
      .trim()
      .email({ message: VALID_EMAIL.en })
      .min(emailMinLength, { message: EMAIL_MIN_LENGTH.en })
      .max(emailMaxLength, { message: EMAIL_MAX_LENGTH.en }),
    password: z
      .string({ required_error: PASSWORD_REQUIRED.en })
      .min(passwordMinLength, { message: PASSWORD_MIN_LENGTH.en })
      .max(passwordMaxLength, { message: PASSWORD_MAX_LENGTH.en }),
  }),
});

export const uuidSchema = z.object({
  params: z.object({
    userId: z
      .string({ required_error: UUID_REQUIRED.en })
      .uuid(INVALID_UUID_FORMAT.en),
  }),
});

export const listUsersSchema = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .transform((val) => (val ? Number(val) : defaultStartingPage))
      .refine((val) => val > defaultZeroValue, {
        message: INVALID_PAGE_NUMBER.en,
      }),
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? Number(val) : defaultRecordsPerPageLimit))
      .refine((val) => val > defaultZeroValue, {
        message: INVALID_PAGE_LIMIT.en,
      }),
    search: z.string().optional(),
  }),
});
