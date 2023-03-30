const router = require('express').Router();
const rolePermissionRoutes = require('./rolePermission');
const userManageRoutes = require('./userManage');

router.use('/', rolePermissionRoutes);
router.use('/', userManageRoutes);

module.exports = router;