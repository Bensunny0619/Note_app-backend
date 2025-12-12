const express = require('express');
const router = express.Router();
const reminderController = require('../controllers/reminder.controller');
const authMiddleware = require('../middleware/auth.middleware');

// All reminder routes require authentication
router.use(authMiddleware.verifyToken);

// GET /api/reminders/upcoming - Get upcoming reminders
router.get('/upcoming', reminderController.getUpcomingReminders);

module.exports = router;
