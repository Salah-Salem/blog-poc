const { Comment, Post, User, UserPrivacy } = require('../models');
const { ApiError } = require('../utils/response');

const ensurePostExists = async (postId, user = null) => {
  const post = await Post.findByPk(postId, {
    include: [
      {
        model: User,
        as: 'author',
        attributes: ['id'],
        include: [{ model: UserPrivacy, as: 'privacy', attributes: ['postVisibility'] }],
      },
    ],
  });
  if (!post) {
    throw new ApiError(404, 'Post not found');
  }
  const postVisibility = post.author?.privacy?.postVisibility || 'public';
  const isOwner = user && post.userId === user.id;
  const isAdmin = user?.role === 'admin';
  if (postVisibility === 'private' && !isOwner && !isAdmin) {
    throw new ApiError(403, "This profile's posts are private");
  }
  return post;
};

const createComment = async (postId, user, { content }) => {
  await ensurePostExists(postId, user);
  return Comment.create({ content, postId, userId: user.id });
};

const getPostComments = async (postId, user = null) => {
  await ensurePostExists(postId, user);
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
