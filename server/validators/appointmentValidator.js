const { body, param, validationResult } = require('express-validator');

/**
 * Appointment Validators
 * Validates appointment booking and management request bodies.
 */

// ─── Book Appointment Validator ───────────────────────────────────────────────
const validateBookAppointment = [
  body('doctor')
    .notEmpty().withMessage('Doctor ID is required.')
    .isMongoId().withMessage('Invalid Doctor ID format.'),

  body('date')
    .notEmpty().withMessage('Appointment date is required.')
    .isISO8601().withMessage('Date must be a valid ISO 8601 date.')
    .custom((value) => {
      const appointmentDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (appointmentDate < today) {
        throw new Error('Appointment date cannot be in the past.');
      }
      return true;
    }),

  body('time')
    .trim()
    .notEmpty().withMessage('Appointment time is required.')
    .matches(/^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i)
    .withMessage('Time must be in HH:MM AM/PM format (e.g. 10:00 AM).'),

  body('reason')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Reason must be under 500 characters.'),

  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Notes must be under 1000 characters.'),
];

// ─── Appointment ID Param Validator ──────────────────────────────────────────
const validateAppointmentId = [
  param('id')
    .isMongoId().withMessage('Invalid appointment ID format.'),
];

// ─── Validation Result Handler ───────────────────────────────────────────────
/**
 * Middleware to handle validation errors uniformly.
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Validation failed.',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

module.exports = {
  validateBookAppointment,
  validateAppointmentId,
  handleValidationErrors,
};
