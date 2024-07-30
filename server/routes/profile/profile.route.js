const express = require('express');
const router = express.Router();
const profileController = require('../../controllers/profile.controller')

router.post('/', profileController.createProfile);

module.exports = router;