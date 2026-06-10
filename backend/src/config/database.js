const { Sequelize } = require('sequelize');
const env = require('./env');

const sequelizeOptions = {
  dialect: env.db.dialect,
  logging: false,
  define: {
    timestamps: true,
  },
};

const sequelize = env.db.url
  ? new Sequelize(env.db.url, sequelizeOptions)
  : new Sequelize(
      env.db.name,
      env.db.user,
      env.db.password,
      {
        host: env.db.host,
        port: env.db.port,
        ...sequelizeOptions,
      }
    );

module.exports = sequelize;
