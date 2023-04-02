const router = require('express').Router();
const authRoutes = require('./auth');
const adminRoutes = require('./admin');
const authMiddleware = require('../middleware/authMiddleware');
const publicRoutes = require('./public');
const userRoutes = require('./user');

router.use('/', publicRoutes);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/', authMiddleware.authVerifyMiddleware, adminRoutes);


module.exports = router;