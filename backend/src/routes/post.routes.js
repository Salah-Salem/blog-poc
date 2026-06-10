const express = require('express');
const { body } = require('express-validator');
const postController = require('../controllers/post.controller');
const commentController = require('../controllers/comment.controller');
const { authenticate, optionalAuthenticate } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');

const router = express.Router();

const postValidation = [
  body('title').trim().notEmpty().withMessage('title is required'),
  body('content').trim().notEmpty().withMessage('content is required'),
  body('visibility').optional().isIn(['public', 'private']).withMessage('visibility must be public or private'),
];

router.get('/', postController.getPosts);
router.get('/:id', optionalAuthenticate, postController.getPost);
router.post('/', authenticate, postValidation, validate, postController.createPost);
router.put('/:id', authenticate, postValidation, validate, postController.updatePost);
router.delete('/:id', authenticate, postController.deletePost);

router.get('/:id/comments', commentController.getPostComments);
router.post(
  '/:id/comments',
  authenticate,
  [body('content').trim().notEmpty().withMessage('content is required')],
  validate,
  commentController.createComment
);

module.exports = router;
