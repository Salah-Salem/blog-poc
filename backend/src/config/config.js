require('dotenv').config();

const dbUrl =
  process.env.MYSQL_URL ||
  process.env.DATABASE_URL ||
  process.env.DB_URL ||
  '';

const base = {
  username: process.env.DB_USER || process.env.MYSQLUSER,
  password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD,
  database: process.env.DB_NAME || process.env.MYSQLDATABASE,
  host: process.env.DB_HOST || process.env.MYSQLHOST,
  port: Number(process.env.DB_PORT || process.env.MYSQLPORT) || undefined,
  dialect: process.env.DB_DIALECT || 'mysql',
  logging: false,
};

const production = dbUrl
  ? {
      use_env_variable: process.env.MYSQL_URL ? 'MYSQL_URL' : 'DATABASE_URL',
      dialect: 'mysql',
      logging: false,
    }
  : base;

module.exports = {
  development: base,
  test: { ...base, database: `${base.database}_test` },
  production,
};
