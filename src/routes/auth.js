const router = require('express').Router();
const authController = require('../controllers/auth');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/:email/:otp', authController.verifyOTP);
router.patch('/:email/:otp', authController.resetPassword);
router.get('/:email', authController.resendOtp);
router.patch('/password', authMiddleware.authVerifyMiddleware , authController.passwordChange);

router.get('/auth-check', authMiddleware.authVerifyMiddleware, (req, res)=>{
    res.status(200).json({ok: true});
});



router.post('/register', register);

router.post('/login', login);
router.get('/:email/:otp', verifyOTP);
router.patch('/:email/:otp', resetPassword);
router.get('/:email', sendOTP);

router.patch('/password', AuthVerifyMiddleware, passwordUpdate);


module.exports = router;