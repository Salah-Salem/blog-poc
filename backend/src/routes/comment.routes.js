const express = require('express');
const { body } = require('express-validator');
const commentController = require('../controllers/comment.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');

const router = express.Router();

const commentValidation = [
  body('content').trim().notEmpty().withMessage('content is required'),
];

router.put(
  '/:commentId',
  authenticate,
  commentValidation,
  validate,
  commentController.updateComment
);
router.delete('/:commentId', authenticate, commentController.deleteComment);

module.exports = router;
