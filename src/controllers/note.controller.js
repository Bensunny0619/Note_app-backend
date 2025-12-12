const noteService = require('../services/note.service');

const noteController = {
    async getAllNotes(req, res, next) {
        try {
            const userId = req.user.id;
            const { page, limit, archived, pinned, labelId, search } = req.query;

            // If search query is provided, use search function
            if (search) {
                const result = await noteService.searchNotes(userId, search, { page, limit });
                return res.status(200).json(result);
            }

            // Otherwise get all notes with filters
            const options = {
                page,
                limit,
                archived: archived !== undefined ? archived === 'true' : undefined,
                pinned: pinned !== undefined ? pinned === 'true' : undefined,
                labelId
            };

            const result = await noteService.getAllNotes(userId, options);

            res.status(200).json(result);
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
    },

    async shareNote(req, res, next) {
        try {
            const userId = req.user.id;
            const noteId = req.params.id;
            const { email, permission } = req.body;

            if (!email) {
                return res.status(400).json({
                    error: 'Email is required'
                });
            }

            const share = await noteService.shareNote(noteId, userId, email, permission);

            res.status(200).json({
                message: 'Note shared successfully',
                share
            });
        } catch (error) {
            next(error);
        }
    },

    async unshareNote(req, res, next) {
        try {
            const userId = req.user.id;
            const { noteId, sharedUserId } = req.params;

            await noteService.unshareNote(noteId, userId, sharedUserId);

            res.status(200).json({
                message: 'Note unshared successfully'
            });
        } catch (error) {
            next(error);
        }
    },

    async getSharedNotes(req, res, next) {
        try {
            const userId = req.user.id;
            const notes = await noteService.getSharedNotes(userId);

            res.status(200).json({
                notes
            });
        } catch (error) {
            next(error);
        }
    },

    async getNoteShares(req, res, next) {
        try {
            const userId = req.user.id;
            const noteId = req.params.id;

            const shares = await noteService.getNoteShares(noteId, userId);

            res.status(200).json({
                shares
            });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = noteController;
