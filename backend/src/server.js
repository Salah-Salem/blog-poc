const app = require('./app');
const env = require('./config/env');
const { sequelize } = require('./models');

const start = async () => {
  try {
    await sequelize.authenticate();
    // eslint-disable-next-line no-console
    console.log('Database connection established successfully.');

    app.listen(env.port, '0.0.0.0', () => {
      // eslint-disable-next-line no-console
      console.log(`Server is running on port ${env.port}`);
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Unable to start the server:', err.message);
    process.exit(1);
  }
};

start();
