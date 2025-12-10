const noteService = require('../services/note.service');

const noteController = {
    async getAllNotes(req, res, next) {
        try {
            const userId = req.user.id;
            const notes = await noteService.getAllNotes(userId);

            res.status(200).json({
                notes
            });
        } catch (error) {
            next(error);
        }
    },

    async getNoteById(req, res, next) {
        try {
            const userId = req.user.id;
            const noteId = req.params.id;

            const note = await noteService.getNoteById(noteId, userId);

            res.status(200).json({
                note
            });
        } catch (error) {
            next(error);
        }
    },

    async createNote(req, res, next) {
        try {
            const userId = req.user.id;
            const { title, content, color } = req.body;

            const note = await noteService.createNote({
                userId,
                title,
                content,
                color
            });

            res.status(201).json({
                message: 'Note created successfully',
                note
            });
        } catch (error) {
            next(error);
        }
    },

    async updateNote(req, res, next) {
        try {
            const userId = req.user.id;
            const noteId = req.params.id;
            const updates = req.body;

            const note = await noteService.updateNote(noteId, userId, updates);

            res.status(200).json({
                message: 'Note updated successfully',
                note
            });
        } catch (error) {
            next(error);
        }
    },

    async deleteNote(req, res, next) {
        try {
            const userId = req.user.id;
            const noteId = req.params.id;

            await noteService.deleteNote(noteId, userId);

            res.status(200).json({
                message: 'Note deleted successfully'
            });
        } catch (error) {
            next(error);
        }
    },

    async toggleArchive(req, res, next) {
        try {
            const userId = req.user.id;
            const noteId = req.params.id;

            const note = await noteService.toggleArchive(noteId, userId);

            res.status(200).json({
                message: 'Note archive status updated',
                note
            });
        } catch (error) {
            next(error);
        }
    },

    async togglePin(req, res, next) {
        try {
            const userId = req.user.id;
            const noteId = req.params.id;

            const note = await noteService.togglePin(noteId, userId);

            res.status(200).json({
                message: 'Note pin status updated',
                note
            });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = noteController;
