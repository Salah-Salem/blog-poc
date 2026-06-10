require('dotenv').config();

// Supports local .env names and Railway MySQL plugin variables (MYSQL*)
const env = {
  port: process.env.PORT || 5000,
  db: {
    host: process.env.DB_HOST || process.env.MYSQLHOST || 'localhost',
    port: Number(process.env.DB_PORT || process.env.MYSQLPORT) || 3306,
    name: process.env.DB_NAME || process.env.MYSQLDATABASE || 'blog_db',
    user: process.env.DB_USER || process.env.MYSQLUSER || 'root',
    password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || '',
    dialect: process.env.DB_DIALECT || 'mysql',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'change_me',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
};

module.exports = env;
