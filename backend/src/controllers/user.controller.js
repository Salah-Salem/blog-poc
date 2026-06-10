const userService = require('../services/user.service');
const { success, ApiError } = require('../utils/response');

const getProfile = async (req, res, next) => {
  try {
    const profile = userService.getProfile(req.user);
    return success(res, 200, profile);
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const profile = await userService.updateProfile(req.user.id, req.body);
    return success(res, 200, { message: 'Profile updated', data: profile });
  } catch (err) {
    next(err);
  }
};

const changePassword = async (req, res, next) => {
  try {
    await userService.changePassword(req.user.id, req.body);
    return success(res, 200, { message: 'Password updated successfully' });
  } catch (err) {
    next(err);
  }
};

const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) throw new ApiError(400, 'No image file uploaded');
    const imagePath = `/uploads/avatars/${req.file.filename}`;
    const profile = await userService.updateProfileImage(req.user.id, imagePath);
    return success(res, 200, { message: 'Profile image updated', data: profile });
  } catch (err) {
    next(err);
  }
};

const getMyPosts = async (req, res, next) => {
  try {
    const result = await userService.getMyPosts(req.user.id, req.query);
    return success(res, 200, result);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  uploadAvatar,
  getMyPosts,
};
