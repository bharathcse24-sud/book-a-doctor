const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');
const {
  getDashboardStats,
  manageUsers,
  getAllAppointmentsAdmin,
  updateAppointmentStatus,
  deleteUser,
} = require('../controllers/adminController');

router.use(protect, adminOnly);

router.get('/stats', getDashboardStats);
router.get('/users', manageUsers);
router.delete('/users/:id', deleteUser);
router.get('/appointments', getAllAppointmentsAdmin);
router.put('/appointments/:id/status', updateAppointmentStatus);

module.exports = router;
