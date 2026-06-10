'use strict';

const bcrypt = require('bcryptjs');

const ADMIN_EMAIL = 'admin@blog.com';
const ADMIN_PASSWORD = 'admin123';

module.exports = {
  async up(queryInterface) {
    const [existing] = await queryInterface.sequelize.query(
      'SELECT id FROM users WHERE email = :email LIMIT 1',
      { replacements: { email: ADMIN_EMAIL } }
    );

    if (existing.length > 0) {
      return;
    }

    const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);
    const now = new Date();

    await queryInterface.bulkInsert('users', [
      {
        name: 'Site Admin',
        email: ADMIN_EMAIL,
        password: hashed,
        role: 'admin',
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', { email: ADMIN_EMAIL });
  },
};
