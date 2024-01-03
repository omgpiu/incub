import { NextFunction, Request, Response } from 'express';
import {
  FieldValidationError,
  Result,
  ValidationChain,
  validationResult,
} from 'express-validator';
import { formatErrors } from '../helpers';
import { IMiddleware } from '../interfaces';

export class ValidateMiddleware implements IMiddleware {
  rules: ValidationChain[];

  constructor(rules: ValidationChain[]) {
    this.rules = rules;
  }

  async execute(req: Request, res: Response, next: NextFunction) {
    await Promise.all(this.rules.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const formattedErrors = formatErrors(
        errors as Result<FieldValidationError>,
      );
      res.status(400).json({ errorsMessages: formattedErrors });
      return;
    }

    next();
  }
}
