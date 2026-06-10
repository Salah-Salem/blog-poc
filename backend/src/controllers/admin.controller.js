const adminService = require('../services/admin.service');
const postService = require('../services/post.service');
const commentService = require('../services/comment.service');
const { success } = require('../utils/response');

const getStats = async (req, res, next) => {
  try {
    const stats = await adminService.getStats();
    return success(res, 200, { data: stats });
  } catch (err) {
    next(err);
  }
};

const listUsers = async (req, res, next) => {
  try {
    const users = await adminService.listUsers();
    return success(res, 200, { data: users });
  } catch (err) {
    next(err);
  }
};

const updateUserRole = async (req, res, next) => {
  try {
    const user = await adminService.updateUserRole(
      req.params.id,
      req.body.role,
      req.user.id
    );
    return success(res, 200, { message: 'User role updated', data: user });
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    await adminService.deleteUser(req.params.id, req.user.id);
    return success(res, 200, { message: 'User deleted' });
  } catch (err) {
    next(err);
  }
};

const listPosts = async (req, res, next) => {
  try {
    const posts = await adminService.listAllPosts();
    return success(res, 200, { data: posts });
  } catch (err) {
    next(err);
  }
};

const deletePost = async (req, res, next) => {
  try {
    await postService.deletePost(req.params.id, req.user);
    return success(res, 200, { message: 'Post deleted' });
  } catch (err) {
    next(err);
  }
};

const listComments = async (req, res, next) => {
  try {
    const comments = await adminService.listAllComments();
    return success(res, 200, { data: comments });
  } catch (err) {
    next(err);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    await commentService.deleteComment(req.params.id, req.user);
    return success(res, 200, { message: 'Comment deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getStats,
  listUsers,
  updateUserRole,
  deleteUser,
  listPosts,
  deletePost,
  listComments,
  deleteComment,
};
