const crypto = require('crypto');
const { Op } = require('sequelize');
const { User, UserPrivacy } = require('../models');
const { ApiError } = require('../utils/response');
const { signToken } = require('../utils/jwt');
const { getProfile } = require('./user.service');

const RESET_TOKEN_EXPIRES_MS = 60 * 60 * 1000;

const hashResetToken = (token) =>
  crypto.createHash('sha256').update(token).digest('hex');

const frontendUrl = () => {
  const configured = process.env.FRONTEND_URL || 'http://localhost:3000';
  return configured.split(',')[0].trim().replace(/\/$/, '');
};

const register = async ({ name, email, password, phone, address, dateOfBirth }) => {
  const existing = await User.findOne({ where: { email } });
  if (existing) {
    throw new ApiError(409, 'Email is already registered');
  }
  const user = await User.create({
    name,
    email,
    password,
    phone: phone?.trim() || null,
    address: address?.trim() || null,
    dateOfBirth: dateOfBirth || null,
  });
  await UserPrivacy.create({ userId: user.id, postVisibility: 'public' });
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

const forgotPassword = async ({ email }) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return {};
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = hashResetToken(resetToken);
  user.resetPasswordExpires = new Date(Date.now() + RESET_TOKEN_EXPIRES_MS);
  await user.save();

  return {
    resetLink: `${frontendUrl()}/reset-password?token=${resetToken}`,
  };
};

const resetPassword = async ({ token, password }) => {
  const user = await User.findOne({
    where: {
      resetPasswordToken: hashResetToken(token),
      resetPasswordExpires: { [Op.gt]: new Date() },
    },
  });

  if (!user) {
    throw new ApiError(400, 'Password reset link is invalid or has expired');
  }

  user.password = password;
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;
  await user.save();
};

module.exports = { register, login, forgotPassword, resetPassword };
