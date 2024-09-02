/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, ZodEffects } from 'zod';

const formDataValidation =
  (schema: AnyZodObject | ZodEffects<AnyZodObject>, controller: any) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.body = schema.parse(JSON.parse(req.body?.data));
      return controller(req, res, next);
    } catch (error) {
      next(error);
    }
  };

export default formDataValidation;
