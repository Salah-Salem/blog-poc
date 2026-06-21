const { literal } = require('sequelize');
const { User, Post, Comment } = require('../models');
const { ApiError } = require('../utils/response');

const postReactionAttributes = (userId) => ({
  include: [
    [
      literal(
        '(SELECT COUNT(*) FROM `post_reactions` AS `likeCountReactions` WHERE `likeCountReactions`.`postId` = `Post`.`id` AND `likeCountReactions`.`type` = \'like\')'
      ),
      'likeCount',
    ],
    [
      literal(
        '(SELECT COUNT(*) FROM `post_reactions` AS `dislikeCountReactions` WHERE `dislikeCountReactions`.`postId` = `Post`.`id` AND `dislikeCountReactions`.`type` = \'dislike\')'
      ),
      'dislikeCount',
    ],
    [
      literal(
        `(SELECT \`type\` FROM \`post_reactions\` AS \`currentUserReactions\` WHERE \`currentUserReactions\`.\`postId\` = \`Post\`.\`id\` AND \`currentUserReactions\`.\`userId\` = ${Number(userId)} LIMIT 1)`
      ),
      'currentUserReaction',
    ],
  ],
});

const getProfile = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  profileImage: user.profileImage,
  phone: user.phone,
  address: user.address,
  dateOfBirth: user.dateOfBirth,
});

const updateProfile = async (userId, { name, phone, address, dateOfBirth }) => {
  const user = await User.findByPk(userId);
  if (!user) throw new ApiError(404, 'User not found');

  if (name !== undefined) user.name = name.trim();
  if (phone !== undefined) user.phone = phone?.trim() || null;
  if (address !== undefined) user.address = address?.trim() || null;
  if (dateOfBirth !== undefined) user.dateOfBirth = dateOfBirth || null;

  await user.save();
  return getProfile(user);
};

const changePassword = async (userId, { currentPassword, newPassword }) => {
  const user = await User.findByPk(userId);
  if (!user) throw new ApiError(404, 'User not found');

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) throw new ApiError(401, 'Current password is incorrect');

  user.password = newPassword;
  await user.save();
};

const updateProfileImage = async (userId, imagePath) => {
  const user = await User.findByPk(userId);
  if (!user) throw new ApiError(404, 'User not found');
  user.profileImage = imagePath;
  await user.save();
  return getProfile(user);
};

const getMyPosts = async (userId, { page = 1, limit = 10 } = {}) => {
  const currentPage = Math.max(Number(page) || 1, 1);
  const pageSize = Math.max(Number(limit) || 10, 1);
  const offset = (currentPage - 1) * pageSize;

  const { count, rows } = await Post.findAndCountAll({
    where: { userId },
    attributes: postReactionAttributes(userId),
    limit: pageSize,
    offset,
    order: [['createdAt', 'DESC']],
    include: [
      { model: User, as: 'author', attributes: ['id', 'name', 'email', 'profileImage'] },
      {
        model: Comment,
        as: 'comments',
        include: [{ model: User, as: 'user', attributes: ['id', 'name'] }],
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

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  updateProfileImage,
  getMyPosts,
};
