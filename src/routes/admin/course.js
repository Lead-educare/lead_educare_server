const router = require('express').Router();
const authMiddleware = require('../../middleware/authMiddleware');
const courseCategoryController = require('../../controllers/admin/course/category');

// Course category routes
router.post('/categories',
    authMiddleware.checkPermissions('can_create_category'),
    courseCategoryController.createCategory
    );

router.patch('/categories/:id',
    authMiddleware.checkPermissions('can_update_category'),
    courseCategoryController.updateCategory
);
router.delete('/categories/:id',
    authMiddleware.checkPermissions('can_delete_category'),
    courseCategoryController.deleteCategory
);

// Course routes



module.exports = router;
