'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_privacies', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      postVisibility: {
        type: Sequelize.ENUM('public', 'private'),
        allowNull: false,
        defaultValue: 'public',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.sequelize.query(`
      INSERT INTO user_privacies (userId, postVisibility, createdAt, updatedAt)
      SELECT
        users.id,
        CASE
          WHEN EXISTS (
            SELECT 1
            FROM posts
            WHERE posts.userId = users.id
              AND posts.visibility = 'private'
          )
          THEN 'private'
          ELSE 'public'
        END,
        NOW(),
        NOW()
      FROM users
    `);

    await queryInterface.removeColumn('posts', 'visibility');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('posts', 'visibility', {
      type: Sequelize.ENUM('public', 'private'),
      allowNull: false,
      defaultValue: 'public',
    });

    await queryInterface.sequelize.query(`
      UPDATE posts
      INNER JOIN user_privacies ON user_privacies.userId = posts.userId
      SET posts.visibility = user_privacies.postVisibility
    `);

    await queryInterface.dropTable('user_privacies');

    if (queryInterface.sequelize.getDialect() === 'postgres') {
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_user_privacies_postVisibility";');
    }
  },
};
