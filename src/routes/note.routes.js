const express = require('express');
const router = express.Router();
const noteController = require('../controllers/note.controller');
const checklistController = require('../controllers/checklist.controller');
const labelController = require('../controllers/label.controller');
const reminderController = require('../controllers/reminder.controller');
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

// Checklist routes
// GET /api/notes/:noteId/checklist - Get all checklist items for a note
router.get('/:noteId/checklist', checklistController.getChecklistItems);

// POST /api/notes/:noteId/checklist - Add checklist item to note
router.post('/:noteId/checklist', checklistController.createChecklistItem);

// PUT /api/notes/:noteId/checklist/:itemId - Update checklist item
router.put('/:noteId/checklist/:itemId', checklistController.updateChecklistItem);

// PATCH /api/notes/:noteId/checklist/:itemId/toggle - Toggle checklist item
router.patch('/:noteId/checklist/:itemId/toggle', checklistController.toggleChecklistItem);

// DELETE /api/notes/:noteId/checklist/:itemId - Delete checklist item
router.delete('/:noteId/checklist/:itemId', checklistController.deleteChecklistItem);

// Label assignment routes
// GET /api/notes/:noteId/labels - Get all labels for a note
router.get('/:noteId/labels', labelController.getNotesLabels);

// POST /api/notes/:noteId/labels - Add label to note
router.post('/:noteId/labels', labelController.addLabelToNote);

// DELETE /api/notes/:noteId/labels/:labelId - Remove label from note
router.delete('/:noteId/labels/:labelId', labelController.removeLabelFromNote);

// Reminder routes
// POST /api/notes/:noteId/reminder - Set reminder for note
router.post('/:noteId/reminder', reminderController.setReminder);

// DELETE /api/notes/:noteId/reminder - Remove reminder from note
router.delete('/:noteId/reminder', reminderController.deleteReminder);

// Sharing routes
// GET /api/notes/shared/with-me - Get notes shared with authenticated user
router.get('/shared/with-me', noteController.getSharedNotes);

// POST /api/notes/:id/share - Share note with another user
router.post('/:id/share', noteController.shareNote);

// GET /api/notes/:id/shares - Get all shares for a note
router.get('/:id/shares', noteController.getNoteShares);

// DELETE /api/notes/:noteId/share/:sharedUserId - Unshare note
router.delete('/:noteId/share/:sharedUserId', noteController.unshareNote);

module.exports = router;
