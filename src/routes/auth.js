const router = require('express').Router();
const authController = require('../controllers/auth');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/auth-check', authMiddleware.authVerifyMiddleware, (req, res)=>{
    res.status(200).json({ok: true});
});
router.get('/superadmin-check', authMiddleware.authVerifyMiddleware, authMiddleware.isSuperAdmin, (req, res)=>{
    res.status(200).json({ok: true});
});

router.get('/permission-check', authMiddleware.authVerifyMiddleware, authMiddleware.checkPermissions('can_delete_user'), (req, res)=>{
    res.status(200).json({ok: true});
});


router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/:email/:otp', authController.verifyOTP);
router.patch('/:email/:otp', authController.resetPassword);
router.get('/:email', authController.sendOtp);
router.patch('/password', authMiddleware.authVerifyMiddleware , authController.passwordChange);

module.exports = router;