const { User, Post, Comment } = require('../models');
const { ApiError } = require('../utils/response');

const getStats = async () => {
  const [users, admins, posts, comments] = await Promise.all([
    User.count(),
    User.count({ where: { role: 'admin' } }),
    Post.count(),
    Comment.count(),
  ]);
  return { users, admins, posts, comments };
};

const listUsers = async () =>
  User.findAll({
    attributes: ['id', 'name', 'email', 'role', 'createdAt'],
    order: [['createdAt', 'DESC']],
  });

const updateUserRole = async (id, role, currentUserId) => {
  if (!['admin', 'user'].includes(role)) {
    throw new ApiError(422, 'Invalid role');
  }
  const user = await User.findByPk(id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  if (user.id === currentUserId && role !== 'admin') {
    throw new ApiError(400, 'You cannot remove your own admin role');
  }
  user.role = role;
  await user.save();
  return { id: user.id, name: user.name, email: user.email, role: user.role };
};

const deleteUser = async (id, currentUserId) => {
  if (Number(id) === Number(currentUserId)) {
    throw new ApiError(400, 'You cannot delete your own account');
  }
  const user = await User.findByPk(id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  await user.destroy();
};

const listAllPosts = async () =>
  Post.findAll({
    order: [['createdAt', 'DESC']],
    include: [{ model: User, as: 'author', attributes: ['id', 'name', 'email'] }],
  });

const listAllComments = async () =>
  Comment.findAll({
    order: [['createdAt', 'DESC']],
    include: [
      { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
      { model: Post, as: 'post', attributes: ['id', 'title'] },
    ],
  });

module.exports = {
  getStats,
  listUsers,
  updateUserRole,
  deleteUser,
  listAllPosts,
  listAllComments,
};
