const express = require('express');
const router = express.Router();
const isAuth = require('../../utils/isAuth');

router.post('/login', isAuth);

module.exports = router;