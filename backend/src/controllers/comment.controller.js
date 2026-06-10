const commentService = require('../services/comment.service');
const { success } = require('../utils/response');

const createComment = async (req, res, next) => {
  try {
    await commentService.createComment(req.params.id, req.user.id, req.body);
    return success(res, 201, { message: 'Comment added' });
  } catch (err) {
    next(err);
  }
};

const getPostComments = async (req, res, next) => {
  try {
    const comments = await commentService.getPostComments(req.params.id);
    return res.status(200).json(comments);
  } catch (err) {
    next(err);
  }
};

const updateComment = async (req, res, next) => {
  try {
    await commentService.updateComment(req.params.commentId, req.user, req.body);
    return success(res, 200, { message: 'Comment updated' });
  } catch (err) {
    next(err);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    await commentService.deleteComment(req.params.commentId, req.user);
    return success(res, 200, { message: 'Comment deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { createComment, getPostComments, updateComment, deleteComment };
