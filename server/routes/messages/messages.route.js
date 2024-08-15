const express = require('express');
const router = express.Router();
const messageController = require('../../controllers/message.controller')
const multer = require('multer');

const uploadImage = multer({ dest: "uploads/images/" });
const uploadAudio = multer({ dest: "uploads/audio/" });

// Path: api/messages/

router.post('/', messageController.addMessage);
router.get('/contacts/:from', messageController.getInitialContactsWithMessages);
router.get('/:from/:to', messageController.getMessages);

router.post('/image', uploadImage.single('image'), messageController.uploadImageMessages);
router.post('/audio', uploadAudio.single('audio'), messageController.uploadAudioMessages);

module.exports = router;