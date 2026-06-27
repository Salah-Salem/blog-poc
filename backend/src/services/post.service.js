const { literal, Op } = require('sequelize');
const { Post, User, UserPrivacy, Comment, PostReaction } = require('../models');
const { ApiError } = require('../utils/response');

const reactionCountLiteral = (type) =>
  literal(
    `(SELECT COUNT(*) FROM \`post_reactions\` AS \`reactionCountReactions\` WHERE \`reactionCountReactions\`.\`postId\` = \`Post\`.\`id\` AND \`reactionCountReactions\`.\`type\` = '${type}')`
  );

const currentUserReactionLiteral = (user) => {
  if (!user) return literal('NULL');
  return literal(
    `(SELECT \`type\` FROM \`post_reactions\` AS \`currentUserReactions\` WHERE \`currentUserReactions\`.\`postId\` = \`Post\`.\`id\` AND \`currentUserReactions\`.\`userId\` = ${Number(user.id)} LIMIT 1)`
  );
};

const authorAttributes = ['id', 'name', 'email', 'profileImage'];
const authorPrivacyInclude = {
  model: UserPrivacy,
  as: 'privacy',
  attributes: ['postVisibility'],
};

const postListAttributes = (user) => ({
  include: [
    [
      literal(
        '(SELECT COUNT(*) FROM `comments` AS `commentCountComments` WHERE `commentCountComments`.`postId` = `Post`.`id`)'
      ),
      'commentCount',
    ],
    [reactionCountLiteral('like'), 'likeCount'],
    [reactionCountLiteral('dislike'), 'dislikeCount'],
    [currentUserReactionLiteral(user), 'currentUserReaction'],
  ],
});

const createPost = async (userId, { title, content }) => {
  return Post.create({ title, content, userId });
};

const getPosts = async ({ page = 1, limit = 10, search = '' }, user = null) => {
  const currentPage = Math.max(Number(page) || 1, 1);
  const pageSize = Math.max(Number(limit) || 10, 1);
  const offset = (currentPage - 1) * pageSize;

  const where = {};
  if (search) where.title = { [Op.like]: `%${search}%` };

  const visibilityFilters = [{ '$author.privacy.postVisibility$': 'public' }];
  if (user) visibilityFilters.push({ userId: user.id });
  where[Op.and] = [{ [Op.or]: visibilityFilters }];

  const { count, rows } = await Post.findAndCountAll({
    where,
    attributes: postListAttributes(user),
    limit: pageSize,
    offset,
    order: [['createdAt', 'DESC']],
    include: [
      {
        model: User,
        as: 'author',
        attributes: authorAttributes,
        required: true,
        include: [{ ...authorPrivacyInclude, required: false }],
      },
    ],
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
  const postVisibility = post.author?.privacy?.postVisibility || 'public';
  if (postVisibility === 'public') return;
  if (!user) throw new ApiError(403, "This profile's posts are private");
  const isOwner = post.userId === user.id;
  const isAdmin = user.role === 'admin';
  if (!isOwner && !isAdmin) throw new ApiError(403, "This profile's posts are private");
};

const getPostById = async (id, user = null) => {
  const post = await Post.findByPk(id, {
    attributes: postListAttributes(user),
    include: [
      { model: User, as: 'author', attributes: authorAttributes, include: [authorPrivacyInclude] },
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

const getReactionSummary = async (postId, userId) => {
  const [likeCount, dislikeCount, currentReaction] = await Promise.all([
    PostReaction.count({ where: { postId, type: 'like' } }),
    PostReaction.count({ where: { postId, type: 'dislike' } }),
    PostReaction.findOne({ where: { postId, userId } }),
  ]);

  return {
    likeCount,
    dislikeCount,
    currentUserReaction: currentReaction?.type ?? null,
  };
};

const reactToPost = async (postId, user, { type }) => {
  if (!['like', 'dislike'].includes(type)) {
    throw new ApiError(422, 'type must be like or dislike');
  }

  const post = await Post.findByPk(postId, {
    include: [{ model: User, as: 'author', attributes: authorAttributes, include: [authorPrivacyInclude] }],
  });
  if (!post) throw new ApiError(404, 'Post not found');
  assertCanViewPost(post, user);

  const existing = await PostReaction.findOne({ where: { postId, userId: user.id } });

  if (!existing) {
    await PostReaction.create({ postId, userId: user.id, type });
  } else if (existing.type === type) {
    await existing.destroy();
  } else {
    existing.type = type;
    await existing.save();
  }

  return getReactionSummary(postId, user.id);
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

const updatePost = async (id, user, { title, content }) => {
  const post = await getEditablePost(id, user);
  if (title !== undefined) post.title = title;
  if (content !== undefined) post.content = content;
  await post.save();
  return post;
};

const deletePost = async (id, user) => {
  const post = await getEditablePost(id, user);
  await post.destroy();
};

module.exports = { createPost, getPosts, getPostById, updatePost, deletePost, reactToPost };
