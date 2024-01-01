import { check } from 'express-validator';
import { RESOLUTION } from '../db';

export const baseInputValidation = [
  check('title')
    .notEmpty()
    .withMessage('Title is required')
    .bail()
    .isString()
    .withMessage('Tittle must be a string'),
  check('author')
    .notEmpty()
    .withMessage('Author must be a string')
    .bail()
    .isString()
    .withMessage('Author must be a string'),
  check('availableResolutions')
    .notEmpty()
    .withMessage('Available Resolutions are required')
    .bail()
    .isArray()
    .withMessage('Available Resolutions must be an array')
    .bail()
    .custom((resolutions: string[]) =>
      resolutions.every((resolution) => RESOLUTION.includes(resolution)),
    )
    .withMessage(
      `Available Resolutions must be one of the following: ${RESOLUTION.join(
        ', ',
      )}`,
    ),
];

export const putValidation = [
  check('canBeDownloaded')
    .notEmpty()
    .withMessage('canBeDownloaded field is required')
    .bail()
    .isBoolean()
    .withMessage('canBeDownloaded must be a boolean'),
  check('minAgeRestriction')
    .notEmpty()
    .withMessage('minAgeRestriction field is required')
    .bail()
    .isNumeric()
    .withMessage('minAgeRestriction must be a number'),
  check('publicationDate')
    .notEmpty()
    .withMessage('publicationDate field is required')
    .bail()
    .isISO8601()
    .withMessage('publicationDate must be a date in ISO 8601 format'),
];