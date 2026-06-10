const express = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/user.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { avatarUpload } = require('../middleware/upload.middleware');
const { validate } = require('../middleware/validation.middleware');

const router = express.Router();

router.get('/profile', authenticate, userController.getProfile);
router.put(
  '/profile',
  authenticate,
  [
    body('name').optional().trim().notEmpty().withMessage('name cannot be empty'),
    body('phone').optional({ nullable: true }).trim().isLength({ max: 30 }),
    body('address').optional({ nullable: true }).trim().isLength({ max: 500 }),
    body('dateOfBirth')
      .optional({ nullable: true })
      .isISO8601()
      .withMessage('dateOfBirth must be a valid date (YYYY-MM-DD)'),
  ],
  validate,
  userController.updateProfile
);
router.put(
  '/password',
  authenticate,
  [
    body('currentPassword').notEmpty().withMessage('currentPassword is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('newPassword must be at least 6 characters'),
  ],
  validate,
  userController.changePassword
);
router.post(
  '/profile/avatar',
  authenticate,
  avatarUpload.single('avatar'),
  userController.uploadAvatar
);
router.get('/me/posts', authenticate, userController.getMyPosts);

module.exports = router;
