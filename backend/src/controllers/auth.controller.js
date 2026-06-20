const authService = require('../services/auth.service');
const { success } = require('../utils/response');

const register = async (req, res, next) => {
  try {
    await authService.register(req.body);
    return success(res, 201, { message: 'User created successfully' });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { token, user } = await authService.login(req.body);
    return success(res, 200, { token, user });
  } catch (err) {
    next(err);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { resetLink } = await authService.forgotPassword(req.body);
    const payload = {
      message: 'If an account exists for this email, a reset link has been generated.',
    };

    if (resetLink && process.env.NODE_ENV !== 'production') {
      payload.resetLink = resetLink;
    }

    return success(res, 200, payload);
  } catch (err) {
    next(err);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    await authService.resetPassword(req.body);
    return success(res, 200, { message: 'Password reset successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, forgotPassword, resetPassword };
