const express = require('express');
const adminController = require('../controllers/admin.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

const router = express.Router();

// Every admin route requires a valid token AND the admin role.
router.use(authenticate, authorize('admin'));

router.get('/stats', adminController.getStats);

router.get('/users', adminController.listUsers);
router.patch('/users/:id/role', adminController.updateUserRole);
router.delete('/users/:id', adminController.deleteUser);

router.get('/posts', adminController.listPosts);
router.delete('/posts/:id', adminController.deletePost);

router.get('/comments', adminController.listComments);
router.delete('/comments/:id', adminController.deleteComment);

module.exports = router;
