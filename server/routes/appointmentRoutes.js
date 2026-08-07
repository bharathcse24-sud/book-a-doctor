const express = require('express');
const router = express.Router();
const { bookAppointment, getMyAppointments, cancelAppointment, getAllAppointments } = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, bookAppointment);
router.get('/my', protect, getMyAppointments);
router.put('/:id/cancel', protect, cancelAppointment);
router.get('/all', protect, getAllAppointments);

module.exports = router;
