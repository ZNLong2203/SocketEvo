const express = require('express');
const router = express.Router();
const authRoutes = require('./auth/auth.route');
const userRoutes = require('./users/users.route');
const messageRoutes = require('./messages/messages.route');

router.use("/uploads/images", express.static("uploads/images"));

router.use('/api/auth', authRoutes);
router.use('/api/users', userRoutes);
router.use('/api/messages', messageRoutes);

module.exports = router;