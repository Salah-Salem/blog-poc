const path = require('path');
const { error } = require('../utils/response');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';

  if (err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 409;
    message = err.errors?.[0]?.message || 'Resource already exists';
  } else if (err.name === 'SequelizeValidationError') {
    statusCode = 422;
    message = err.errors?.[0]?.message || 'Validation error';
  }

  if (statusCode === 500) {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  return error(res, statusCode, message);
};

const notFound = (req, res) => {
  // API clients get JSON; browsers get a friendly HTML 404 page.
  const wantsJson =
    req.originalUrl.startsWith('/api') ||
    req.accepts(['html', 'json']) === 'json';

  if (wantsJson) {
    return error(res, 404, `Route ${req.method} ${req.originalUrl} not found`);
  }

  return res
    .status(404)
    .sendFile(path.join(__dirname, '..', '..', 'public', '404.html'));
};

module.exports = { errorHandler, notFound };
