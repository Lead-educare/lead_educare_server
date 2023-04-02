const router = require('express').Router();
const rolePermissionRoutes = require('./rolePermission');
const userManageRoutes = require('./userManage');
const courseRoutes = require('./course');
const authMiddleware = require('../../middleware/authMiddleware');

router.use('/roles', rolePermissionRoutes);
router.use('/users', userManageRoutes);
router.use('/course', courseRoutes);

module.exports = router;