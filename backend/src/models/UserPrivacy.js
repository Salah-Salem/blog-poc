const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class UserPrivacy extends Model {}

  UserPrivacy.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      postVisibility: {
        type: DataTypes.ENUM('public', 'private'),
        allowNull: false,
        defaultValue: 'public',
      },
    },
    {
      sequelize,
      modelName: 'UserPrivacy',
      tableName: 'user_privacies',
    }
  );

  return UserPrivacy;
};
