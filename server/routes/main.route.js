const express = require('express');
const router = express.Router();
const authRoutes = require('./auth/auth.route');
const profileRoutes = require('./profile/profile.route');

router.use('/api/auth', authRoutes);
router.use('/api/profile', profileRoutes);

module.exports = router;