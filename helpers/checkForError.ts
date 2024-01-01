import { FieldValidationError, Result } from 'express-validator';
import { formatErrors } from './format';
import { Response } from 'express';

export function checkForError(
  res: Response,
  errors: Result<FieldValidationError>,
): boolean {
  if (!errors.isEmpty()) {
    res.status(400).json({
      errorsMessages: formatErrors(errors),
    });
    return true;
  }
  return false;
}
