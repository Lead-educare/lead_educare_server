const authMiddleware = require("../../middleware/authMiddleware");
const rolePermissionController = require("../../controllers/admin/rolePermission");
const router = require('express').Router();

router.get('/roles',  authMiddleware.checkPermissions('can_view_roles'), rolePermissionController.getRoles);
router.post('/roles',  authMiddleware.checkPermissions('can_create_role'), rolePermissionController.createRole);
router.delete('/roles/:id',  authMiddleware.checkPermissions('can_delete_role'), rolePermissionController.deleteRole);
router.post('/permissions', authMiddleware.checkPermissions('can_create_permission'), rolePermissionController.createPermission);

module.exports = router;