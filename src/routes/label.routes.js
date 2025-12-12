const express = require('express');
const router = express.Router();
const labelController = require('../controllers/label.controller');
const authMiddleware = require('../middleware/auth.middleware');

// All label routes require authentication
router.use(authMiddleware.verifyToken);

// GET /api/labels - Get all labels for authenticated user
router.get('/', labelController.getAllLabels);

// POST /api/labels - Create a new label
router.post('/', labelController.createLabel);

// PUT /api/labels/:id - Update a label
router.put('/:id', labelController.updateLabel);

// DELETE /api/labels/:id - Delete a label
router.delete('/:id', labelController.deleteLabel);

module.exports = router;
