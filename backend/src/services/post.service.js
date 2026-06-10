const { Op } = require('sequelize');
const { Post, User, Comment } = require('../models');
const { ApiError } = require('../utils/response');

const createPost = async (userId, { title, content, visibility = 'public' }) => {
  if (!['public', 'private'].includes(visibility)) {
    throw new ApiError(422, 'visibility must be public or private');
  }
  return Post.create({ title, content, userId, visibility });
};

const getPosts = async ({ page = 1, limit = 10, search = '' }) => {
  const currentPage = Math.max(Number(page) || 1, 1);
  const pageSize = Math.max(Number(limit) || 10, 1);
  const offset = (currentPage - 1) * pageSize;

  const where = { visibility: 'public' };
  if (search) where.title = { [Op.like]: `%${search}%` };

  const { count, rows } = await Post.findAndCountAll({
    where,
    limit: pageSize,
    offset,
    order: [['createdAt', 'DESC']],
    include: [{ model: User, as: 'author', attributes: ['id', 'name', 'email', 'profileImage'] }],
  });

  return {
    data: rows,
    pagination: {
      total: count,
      page: currentPage,
      limit: pageSize,
      totalPages: Math.ceil(count / pageSize),
    },
  };
};

const assertCanViewPost = (post, user) => {
  if (post.visibility === 'public') return;
  if (!user) throw new ApiError(403, 'This post is private');
  const isOwner = post.userId === user.id;
  const isAdmin = user.role === 'admin';
  if (!isOwner && !isAdmin) throw new ApiError(403, 'This post is private');
};

const getPostById = async (id, user = null) => {
  const post = await Post.findByPk(id, {
    include: [
      { model: User, as: 'author', attributes: ['id', 'name', 'email', 'profileImage'] },
      {
        model: Comment,
        as: 'comments',
        include: [{ model: User, as: 'user', attributes: ['id', 'name', 'profileImage'] }],
      },
    ],
  });

  if (!post) throw new ApiError(404, 'Post not found');
  assertCanViewPost(post, user);
  return post;
};

const getEditablePost = async (id, user) => {
  const post = await Post.findByPk(id);
  if (!post) throw new ApiError(404, 'Post not found');
  const isOwner = post.userId === user.id;
  const isAdmin = user.role === 'admin';
  if (!isOwner && !isAdmin) {
    throw new ApiError(403, 'You are not allowed to modify this post');
  }
  return post;
};

const updatePost = async (id, user, { title, content, visibility }) => {
  const post = await getEditablePost(id, user);
  if (title !== undefined) post.title = title;
  if (content !== undefined) post.content = content;
  if (visibility !== undefined) {
    if (!['public', 'private'].includes(visibility)) {
      throw new ApiError(422, 'visibility must be public or private');
    }
    post.visibility = visibility;
  }
  await post.save();
  return post;
};

const deletePost = async (id, user) => {
  const post = await getEditablePost(id, user);
  await post.destroy();
};

module.exports = { createPost, getPosts, getPostById, updatePost, deletePost };
