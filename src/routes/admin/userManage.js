const router = require('express').Router();
const authMiddleware = require('../../middleware/authMiddleware');
const manageUser = require('../../controllers/admin/manageUser');

router.get('/users', authMiddleware.checkPermissions('can_view_users'), manageUser.getAllUsers);

module.exports = router;