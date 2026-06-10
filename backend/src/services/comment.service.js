const { Comment, Post, User } = require('../models');
const { ApiError } = require('../utils/response');

const ensurePostExists = async (postId) => {
  const post = await Post.findByPk(postId);
  if (!post) {
    throw new ApiError(404, 'Post not found');
  }
  return post;
};

const createComment = async (postId, userId, { content }) => {
  await ensurePostExists(postId);
  return Comment.create({ content, postId, userId });
};

const getPostComments = async (postId) => {
  await ensurePostExists(postId);
  return Comment.findAll({
    where: { postId },
    order: [['createdAt', 'DESC']],
    include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }],
  });
};

const getCommentOrThrow = async (commentId) => {
  const comment = await Comment.findByPk(commentId);
  if (!comment) {
    throw new ApiError(404, 'Comment not found');
  }
  return comment;
};

const assertCanModify = (comment, user) => {
  const isOwner = comment.userId === user.id;
  const isAdmin = user.role === 'admin';
  if (!isOwner && !isAdmin) {
    throw new ApiError(403, 'You are not allowed to modify this comment');
  }
};

const updateComment = async (commentId, user, { content }) => {
  const comment = await getCommentOrThrow(commentId);
  assertCanModify(comment, user);
  comment.content = content;
  await comment.save();
  return comment;
};

const deleteComment = async (commentId, user) => {
  const comment = await getCommentOrThrow(commentId);
  assertCanModify(comment, user);
  await comment.destroy();
};

module.exports = { createComment, getPostComments, updateComment, deleteComment };
