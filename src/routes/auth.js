const router = require('express').Router();

router.post('/register', register);

router.post('/login', login);
router.get('/:email/:otp', verifyOTP);
router.patch('/:email/:otp', resetPassword);
router.get('/:email', sendOTP);

router.patch('/password', AuthVerifyMiddleware, passwordUpdate);

module.exports = router;