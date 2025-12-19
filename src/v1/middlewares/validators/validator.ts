// validateResource.ts
import { Request, Response, NextFunction } from 'express';
import { z, AnyZodObject } from 'zod';
import { responseStatusCodes } from '../../helpers/common';
import {
  VALIDATION_ERROR,
  INTERNAL_SERVER_ERROR,
} from '../../helpers/locale.json';

const validateResource =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      next();
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        return res.status(responseStatusCodes.validationError).json({
          message: VALIDATION_ERROR.en,
          errors: error.errors,
        });
      }
      return res
        .status(responseStatusCodes.internalServerError)
        .json({ message: INTERNAL_SERVER_ERROR.en });
    }
  };

export default validateResource;
