const courseCategoryController = require("../controllers/admin/course/category");
const router = require('express').Router();

router.get('/course/categories', courseCategoryController.getCategories);


module.exports = router;