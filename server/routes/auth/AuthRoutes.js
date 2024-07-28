const express = require('express');
const router = express.Router();
const isAuth = require('../../utils/isAuth');
const AuthController = require('../../controllers/AuthController');

router.post('/login', AuthController.login);

module.exports = router;