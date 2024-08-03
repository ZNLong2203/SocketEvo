const express = require('express');
const router = express.Router();
const messageController = require('../../controllers/message.controller')
const multer = require('multer');

const uploadImage = multer({ dest: "uploads/images/" });

// Path: api/messages/

router.post('/', messageController.addMessage);
router.get('/:from/:to', messageController.getMessages);

router.post('/image', uploadImage.single('image'), messageController.uploadImageMessages);

module.exports = router;