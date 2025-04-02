const express = require('express');
const router = express.Router();
const videoController = require('../controller/videoController');
const upload = require('../middleware/videoUploadMiddleware');
const auth = require('../middleware/authMiddleware');

router.post('/upload', auth, upload.single('video'), videoController.uploadVideo);
router.get('/stream/:id', videoController.streamVideo);
router.get('/:id', videoController.getVideo);
// Add other routes as needed

module.exports = router;