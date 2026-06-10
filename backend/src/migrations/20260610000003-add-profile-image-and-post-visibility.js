'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'profileImage', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('posts', 'visibility', {
      type: Sequelize.ENUM('public', 'private'),
      allowNull: false,
      defaultValue: 'public',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('posts', 'visibility');
    await queryInterface.removeColumn('users', 'profileImage');
    if (queryInterface.sequelize.getDialect() === 'postgres') {
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_posts_visibility";');
    }
  },
};
