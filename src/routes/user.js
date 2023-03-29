const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');
const authMiddleware = require("../middleware/authMiddleware");

router.patch('/', authMiddleware.authVerifyMiddleware, userController.patchUser);
router.get('/', authMiddleware.authVerifyMiddleware, userController.getUserProfile);

const {register, login, passwordUpdate, verifyOTP, sendOTP, resetPassword, getUserProfile,
    patchUser
} = require('../controllers/userController');
const {AuthVerifyMiddleware} = require("../middleware/AuthVerifyMiddleware");


router.patch('/users', AuthVerifyMiddleware, patchUser);
router.get('/users', AuthVerifyMiddleware, getUserProfile);

// Auth check route
router.get('/auth-check', AuthVerifyMiddleware, (req, res)=>{
    res.status(200).json({ok: true});
});



module.exports = router;