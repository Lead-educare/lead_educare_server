const router = require('express').Router();
const authRoutes = require('./auth');

const userRoutes = require('./user');
router.use('/auth', authRoutes);
router.use('/users', userRoutes);

router.use('/auth', authRoutes);


module.exports = router;