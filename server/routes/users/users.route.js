const express = require('express');
const router = express.Router();
const profileController = require('../../controllers/users.controller')

router.post('/', profileController.createProfile);
router.get('/', profileController.getAllUsers);

module.exports = router;