import { FieldValidationError, Result } from 'express-validator';

export function formatErrors(errors: Result<FieldValidationError>) {
  return errors.array().map((err) => {
    return { message: err.msg, field: err?.path };
  });
}
