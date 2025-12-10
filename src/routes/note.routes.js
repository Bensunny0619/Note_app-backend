const express = require('express');
const router = express.Router();
const noteController = require('../controllers/note.controller');
const authMiddleware = require('../middleware/auth.middleware');

// All note routes require authentication
router.use(authMiddleware.verifyToken);

// GET /api/notes - Get all notes for authenticated user
router.get('/', noteController.getAllNotes);

// GET /api/notes/:id - Get a specific note
router.get('/:id', noteController.getNoteById);

// POST /api/notes - Create a new note
router.post('/', noteController.createNote);

// PUT /api/notes/:id - Update a note
router.put('/:id', noteController.updateNote);

// DELETE /api/notes/:id - Delete a note
router.delete('/:id', noteController.deleteNote);

// PATCH /api/notes/:id/archive - Archive/unarchive a note
router.patch('/:id/archive', noteController.toggleArchive);

// PATCH /api/notes/:id/pin - Pin/unpin a note
router.patch('/:id/pin', noteController.togglePin);

module.exports = router;
