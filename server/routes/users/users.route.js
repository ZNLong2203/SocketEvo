const express = require('express');
const router = express.Router();
const profileController = require('../../controllers/users.controller')

// Path: api/users/

router.post('/', profileController.createProfile);
router.get('/', profileController.getAllUsers);

module.exports = router;