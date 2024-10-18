// validateResource.ts
import { Request, Response, NextFunction } from 'express';
import { z, AnyZodObject } from 'zod';

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
        return res.status(422).json({
          message: 'Validation failed',
          errors: error.errors,
        });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

export default validateResource;
