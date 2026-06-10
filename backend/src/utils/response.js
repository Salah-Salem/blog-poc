const success = (res, statusCode = 200, payload = {}) =>
  res.status(statusCode).json({ success: true, ...payload });

const error = (res, statusCode = 500, message = 'Something went wrong') =>
  res.status(statusCode).json({ success: false, message });

class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = { success, error, ApiError };
