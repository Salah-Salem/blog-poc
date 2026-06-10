const postService = require('../services/post.service');
const { success } = require('../utils/response');

const createPost = async (req, res, next) => {
  try {
    await postService.createPost(req.user.id, req.body);
    return success(res, 201, { message: 'Post created successfully' });
  } catch (err) {
    next(err);
  }
};

const getPosts = async (req, res, next) => {
  try {
    const result = await postService.getPosts(req.query);
    return success(res, 200, result);
  } catch (err) {
    next(err);
  }
};

const getPost = async (req, res, next) => {
  try {
    const post = await postService.getPostById(req.params.id, req.user ?? null);
    return success(res, 200, { data: post });
  } catch (err) {
    next(err);
  }
};

const updatePost = async (req, res, next) => {
  try {
    await postService.updatePost(req.params.id, req.user, req.body);
    return success(res, 200, { message: 'Post updated' });
  } catch (err) {
    next(err);
  }
};

const deletePost = async (req, res, next) => {
  try {
    await postService.deletePost(req.params.id, req.user);
    return success(res, 200, { message: 'Post deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { createPost, getPosts, getPost, updatePost, deletePost };
