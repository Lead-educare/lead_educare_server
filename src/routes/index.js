const router = require('express').Router();
const authRoutes = require('./auth');
const adminRoutes = require('./admin');
const authMiddleware = require('../middleware/authMiddleware');

const userRoutes = require('./user');
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/admin', authMiddleware.authVerifyMiddleware, adminRoutes);


module.exports = router;