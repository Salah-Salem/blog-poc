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

module.exports = { register, login };
