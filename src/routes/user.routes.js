const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');

// All user routes require authentication
router.use(authMiddleware.verifyToken);

// GET /api/user/profile - Get user profile
router.get('/profile', userController.getProfile);

// PUT /api/user/profile - Update user profile
router.put('/profile', userController.updateProfile);

// PUT /api/user/preferences - Update user preferences
router.put('/preferences', userController.updatePreferences);

// PUT /api/user/password - Change password
router.put('/password', userController.changePassword);

module.exports = router;
