const express = require('express');
const router = express.Router();
const isAuth = require('../../utils/isAuth');
const AuthController = require('../../controllers/auth.controller');

// Path: api/auth/

router.post('/login', AuthController.login);

module.exports = router;