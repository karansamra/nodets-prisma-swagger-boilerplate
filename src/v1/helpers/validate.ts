import { Request } from 'express';
import { z } from 'zod';
import { IReturnType } from '@src/v1/types/common';

/**
 * General validation function for any key-value data
 * @param schema - Zod schema to validate against
 * @param data - The data object (key-value pairs) to validate
 * @returns Promise<IReturnType> - Returns success status and validated data or errors
 */
export const validateData = async <T = any>(
  schema: z.ZodTypeAny,
  data: unknown
): Promise<IReturnType & { validatedData?: T }> => {
  try {
    const validationResult = await schema.safeParseAsync(data);

    if (!validationResult.success) {
      const errors = validationResult.error.issues;
      const formattedErrors = errors.map((error) => {
        const pathString = error.path.join('.');
        const value = error.path.reduce(
          (acc: any, key) =>
            acc && typeof acc === 'object' ? acc[key] : undefined,
          data
        );

        return {
          type: 'field',
          value: value ?? '',
          msg: error.message,
          path: pathString,
          location: 'data',
        };
      });

      return { success: false, data: { resData: formattedErrors } };
    }

    return {
      success: true,
      data: { resData: {} },
      validatedData: validationResult.data as T,
    };
  } catch (error) {
    // Handle unexpected errors during validation
    const errorMessage =
      error instanceof Error ? error.message : 'Validation failed';
    return {
      success: false,
      data: {
        resData: [
          {
            msg: errorMessage,
            type: 'field',
            value: '',
            path: '',
            location: 'data',
          },
        ],
      },
    };
  }
};

/**
 * Request-specific validation function for Express controllers
 * @param req - Express Request object
 * @param schema - Zod schema to validate against
 * @param source - Source of data in request ('body', 'params', or 'query')
 * @returns Promise<IReturnType> - Returns success status and errors if validation fails
 */
const validateRequest = async (
  req: Request,
  schema: z.ZodTypeAny,
  source: 'body' | 'params' | 'query' = 'body'
): Promise<IReturnType> => {
  try {
    const validationResult = await schema.safeParseAsync(req[source]);

    if (!validationResult.success) {
      const errors = validationResult.error.issues;
      const formattedErrors = errors.map((error) => {
        const pathString = error.path.join('.');
        const value = error.path.reduce(
          (acc, key) => (acc && typeof acc === 'object' ? acc[key] : undefined),
          req[source]
        );

        return {
          type: source === 'body' ? 'field' : source,
          value: value ?? '',
          msg: error.message,
          path: pathString,
          location: source,
        };
      });

      return { success: false, data: { resData: formattedErrors } };
    }

    // Update the request object with validated data
    req[source] = validationResult.data;
    return { success: true, data: { resData: {} } };
  } catch (error) {
    // Handle unexpected errors during validation
    const errorMessage =
      error instanceof Error ? error.message : 'Validation failed';
    return {
      success: false,
      data: {
        resData: [
          {
            msg: errorMessage,
            type: 'field',
            value: '',
            path: '',
            location: source,
          },
        ],
      },
    };
  }
};

export default validateRequest;
