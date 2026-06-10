const app = require('./app');
const env = require('./config/env');
const { sequelize } = require('./models');

const start = async () => {
  // eslint-disable-next-line no-console
  console.log('[startup] NODE_ENV:', process.env.NODE_ENV);
  // eslint-disable-next-line no-console
  console.log('[startup] DB config:', {
    usingUrl: Boolean(env.db.url),
    host: env.db.url ? '(from MYSQL_URL)' : env.db.host,
    port: env.db.port,
    name: env.db.name,
  });

  try {
    await sequelize.authenticate();
    // eslint-disable-next-line no-console
    console.log('Database connection established successfully.');

    app.listen(env.port, '0.0.0.0', () => {
      // eslint-disable-next-line no-console
      console.log(`Server is running on port ${env.port}`);
    });
  } catch (err) {
    const { db } = env;
    // eslint-disable-next-line no-console
    console.error('Unable to start the server:', err.message || err);
    if (process.env.NODE_ENV === 'production') {
      // eslint-disable-next-line no-console
      console.error('DB target:', {
        usingUrl: Boolean(db.url),
        host: db.url ? '(from MYSQL_URL)' : db.host,
        port: db.port,
        database: db.name,
        user: db.user,
      });
      if (
        !db.url &&
        (db.host === 'localhost' || db.host === '127.0.0.1' || db.host === '::1')
      ) {
        // eslint-disable-next-line no-console
        console.error(
          'Railway hint: add MYSQL_URL=${{MySQL.MYSQL_URL}} on this service, or reference MySQL vars: DB_HOST=${{MySQL.MYSQLHOST}}, DB_PORT=${{MySQL.MYSQLPORT}}, DB_NAME=${{MySQL.MYSQLDATABASE}}, DB_USER=${{MySQL.MYSQLUSER}}, DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}'
        );
      }
    }
    process.exit(1);
  }
};

start();
