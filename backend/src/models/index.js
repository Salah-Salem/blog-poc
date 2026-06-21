const sequelize = require('../config/database');

const User = require('./User')(sequelize);
const Post = require('./Post')(sequelize);
const Comment = require('./Comment')(sequelize);
const PostReaction = require('./PostReaction')(sequelize);

User.hasMany(Post, { foreignKey: 'userId', as: 'posts', onDelete: 'CASCADE' });
User.hasMany(Comment, { foreignKey: 'userId', as: 'comments', onDelete: 'CASCADE' });
User.hasMany(PostReaction, { foreignKey: 'userId', as: 'postReactions', onDelete: 'CASCADE' });

Post.belongsTo(User, { foreignKey: 'userId', as: 'author' });
Post.hasMany(Comment, { foreignKey: 'postId', as: 'comments', onDelete: 'CASCADE' });
Post.hasMany(PostReaction, { foreignKey: 'postId', as: 'reactions', onDelete: 'CASCADE' });

Comment.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Comment.belongsTo(Post, { foreignKey: 'postId', as: 'post' });

PostReaction.belongsTo(User, { foreignKey: 'userId', as: 'user' });
PostReaction.belongsTo(Post, { foreignKey: 'postId', as: 'post' });

const db = {
  sequelize,
  User,
  Post,
  Comment,
  PostReaction,
};

module.exports = db;
