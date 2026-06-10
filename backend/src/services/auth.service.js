const { User } = require('../models');
const { ApiError } = require('../utils/response');
const { signToken } = require('../utils/jwt');
const { getProfile } = require('./user.service');

const register = async ({ name, email, password, phone, address, dateOfBirth }) => {
  const existing = await User.findOne({ where: { email } });
  if (existing) {
    throw new ApiError(409, 'Email is already registered');
  }
  await User.create({
    name,
    email,
    password,
    phone: phone?.trim() || null,
    address: address?.trim() || null,
    dateOfBirth: dateOfBirth || null,
  });
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const token = signToken({ id: user.id, email: user.email, role: user.role });
  return { token, user: getProfile(user) };
};

module.exports = { register, login };
