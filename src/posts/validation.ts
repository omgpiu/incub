import { check } from 'express-validator';

export const baseValidation = [
  check('title')
    .notEmpty()
    .withMessage('Title is required')
    .bail()
    .isString()
    .withMessage('Title must be a string')
    .bail()
    .isLength({ min: 1, max: 30 })
    .withMessage('Name must be between 1 and 15 characters long'),
  check('shortDescription')
    .notEmpty()
    .withMessage('shortDescription field is required')
    .bail()
    .isString()
    .withMessage('shortDescription must be a string')
    .bail()
    .isLength({ min: 1, max: 100 })
    .withMessage(
      'shortDescription name must be between 1 and 100 characters long',
    ),
  check('content')
    .notEmpty()
    .withMessage('content field is required')
    .bail()
    .isString()
    .withMessage('content must be a string')
    .bail()
    .isLength({ min: 1, max: 1000 })
    .withMessage('content name must be between 1 and 1000 characters long'),
  check('blogId')
    .notEmpty()
    .withMessage('blogId field is required')
    .bail()
    .isString()
    .withMessage('blogId must be a string'),
];

export const putValidation = [
  check('id')
    .notEmpty()
    .withMessage('id is required')
    .bail()
    .isString()
    .withMessage('id must be a string'),
  check('blogName')
    .notEmpty()
    .withMessage('blogName is required')
    .bail()
    .isString()
    .withMessage('blogName must be a string'),
];
