const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class PostReaction extends Model {}

  PostReaction.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      type: {
        type: DataTypes.ENUM('like', 'dislike'),
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'PostReaction',
      tableName: 'post_reactions',
    }
  );

  return PostReaction;
};
