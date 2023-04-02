const authMiddleware = require("../../middleware/authMiddleware");
const rolePermissionController = require("../../controllers/admin/rolePermission");
const router = require('express').Router();

router.get('/',  authMiddleware.checkPermissions('can_view_roles'), rolePermissionController.getRoles);
router.post('/',  authMiddleware.checkPermissions('can_create_role'), rolePermissionController.createRole);
router.delete('/:id',  authMiddleware.checkPermissions('can_delete_role'), rolePermissionController.deleteRole);
router.post('/permissions', authMiddleware.checkPermissions('can_create_permission'), rolePermissionController.createPermission);

module.exports = router;