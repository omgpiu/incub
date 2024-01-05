import { check } from 'express-validator';

export const baseValidation = [
  check('name')
    .notEmpty()
    .withMessage('Name is required')
    .bail()
    .isString()
    .withMessage('Name must be a string')
    .bail()
    .isLength({ min: 1, max: 15 })
    .withMessage('Name must be between 1 and 15 characters long'),
  check('description')
    .notEmpty()
    .withMessage('Description field is required')
    .bail()
    .isString()
    .withMessage('Description must be a string')
    .bail()
    .isLength({ min: 1, max: 500 })
    .withMessage('description name must be between 1 and 500 characters long'),
  check('websiteUrl')
    .notEmpty()
    .withMessage('WebsiteUrl is required')
    .bail()
    .isString()
    .withMessage('WebsiteUrl must be a string')
    .bail()
    .matches(
      /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
    )
    .withMessage('WebsiteUrl must be a valid URL'),
];