const express = require('express');
const router = express.Router();
const authRoutes = require('./auth/auth.route');
const userRoutes = require('./users/users.route');

router.use('/api/auth', authRoutes);
router.use('/api/users', userRoutes);

module.exports = router;