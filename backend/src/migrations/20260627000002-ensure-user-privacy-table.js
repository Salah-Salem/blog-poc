'use strict';

const tableExists = async (queryInterface, tableName) => {
  try {
    await queryInterface.describeTable(tableName);
    return true;
  } catch (_) {
    return false;
  }
};

const columnExists = async (queryInterface, tableName, columnName) => {
  try {
    const table = await queryInterface.describeTable(tableName);
    return Boolean(table[columnName]);
  } catch (_) {
    return false;
  }
};

module.exports = {
  async up(queryInterface, Sequelize) {
    const hasPrivacyTable = await tableExists(queryInterface, 'user_privacies');
    if (!hasPrivacyTable) {
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
    }

    const hasUserPostVisibility = await columnExists(queryInterface, 'users', 'postVisibility');
    await queryInterface.sequelize.query(`
      INSERT INTO user_privacies (userId, postVisibility, createdAt, updatedAt)
      SELECT
        users.id,
        ${hasUserPostVisibility ? 'users.postVisibility' : "'public'"},
        NOW(),
        NOW()
      FROM users
      LEFT JOIN user_privacies ON user_privacies.userId = users.id
      WHERE user_privacies.id IS NULL
    `);

    if (hasUserPostVisibility) {
      await queryInterface.removeColumn('users', 'postVisibility');
    }
  },

  async down(queryInterface) {
    const hasPrivacyTable = await tableExists(queryInterface, 'user_privacies');
    if (hasPrivacyTable) {
      await queryInterface.dropTable('user_privacies');
    }

    if (queryInterface.sequelize.getDialect() === 'postgres') {
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_user_privacies_postVisibility";');
    }
  },
};
