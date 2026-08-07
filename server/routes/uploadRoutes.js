const express = require('express');
const router = express.Router();
const { uploadReport } = require('../controllers/uploadController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/:appointmentId', protect, upload.single('report'), uploadReport);

module.exports = router;
