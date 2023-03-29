const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');
const authMiddleware = require("../middleware/authMiddleware");

router.patch('/', authMiddleware.authVerifyMiddleware, userController.patchUser);
router.get('/', authMiddleware.authVerifyMiddleware, userController.getUserProfile);

module.exports = router;