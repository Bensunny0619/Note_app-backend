const checklistService = require('../services/checklist.service');

const checklistController = {
    async getChecklistItems(req, res, next) {
        try {
            const noteId = req.params.noteId;
            const items = await checklistService.getChecklistItems(noteId);

            res.status(200).json({
                items
            });
        } catch (error) {
            next(error);
        }
    },

    async createChecklistItem(req, res, next) {
        try {
            const noteId = req.params.noteId;
            const { text, position } = req.body;

            if (!text) {
                return res.status(400).json({
                    error: 'Text is required for checklist item'
                });
            }

            const item = await checklistService.createChecklistItem(noteId, { text, position });

            res.status(201).json({
                message: 'Checklist item created successfully',
                item
            });
        } catch (error) {
            next(error);
        }
    },

    async updateChecklistItem(req, res, next) {
        try {
            const { noteId, itemId } = req.params;
            const updates = req.body;

            const item = await checklistService.updateChecklistItem(itemId, noteId, updates);

            res.status(200).json({
                message: 'Checklist item updated successfully',
                item
            });
        } catch (error) {
            next(error);
        }
    },

    async toggleChecklistItem(req, res, next) {
        try {
            const { noteId, itemId } = req.params;

            const item = await checklistService.toggleChecklistItem(itemId, noteId);

            res.status(200).json({
                message: 'Checklist item toggled successfully',
                item
            });
        } catch (error) {
            next(error);
        }
    },

    async deleteChecklistItem(req, res, next) {
        try {
            const { noteId, itemId } = req.params;

            await checklistService.deleteChecklistItem(itemId, noteId);

            res.status(200).json({
                message: 'Checklist item deleted successfully'
            });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = checklistController;
