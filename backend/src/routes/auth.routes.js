const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');
const { validate } = require('../middleware/validation.middleware');

const router = express.Router();

const profileFieldsValidation = [
  body('phone').optional({ nullable: true }).trim().isLength({ max: 30 }),
  body('address').optional({ nullable: true }).trim().isLength({ max: 500 }),
  body('dateOfBirth')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('dateOfBirth must be a valid date (YYYY-MM-DD)'),
];

router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('name is required'),
    body('email').isEmail().withMessage('a valid email is required'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('password must be at least 6 characters'),
    ...profileFieldsValidation,
  ],
  validate,
  authController.register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('a valid email is required'),
    body('password').notEmpty().withMessage('password is required'),
  ],
  validate,
  authController.login
);

router.post(
  '/forgot-password',
  [body('email').isEmail().withMessage('a valid email is required')],
  validate,
  authController.forgotPassword
);

router.post(
  '/reset-password',
  [
    body('token').notEmpty().withMessage('token is required'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('password must be at least 6 characters'),
  ],
  validate,
  authController.resetPassword
);

module.exports = router;
