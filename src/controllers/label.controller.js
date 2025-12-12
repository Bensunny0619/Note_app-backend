const labelService = require('../services/label.service');

const labelController = {
    async getAllLabels(req, res, next) {
        try {
            const userId = req.user.id;
            const labels = await labelService.getAllLabels(userId);

            res.status(200).json({
                labels
            });
        } catch (error) {
            next(error);
        }
    },

    async createLabel(req, res, next) {
        try {
            const userId = req.user.id;
            const { name, color } = req.body;

            if (!name) {
                return res.status(400).json({
                    error: 'Label name is required'
                });
            }

            const label = await labelService.createLabel(userId, { name, color });

            res.status(201).json({
                message: 'Label created successfully',
                label
            });
        } catch (error) {
            next(error);
        }
    },

    async updateLabel(req, res, next) {
        try {
            const userId = req.user.id;
            const labelId = req.params.id;
            const updates = req.body;

            const label = await labelService.updateLabel(labelId, userId, updates);

            res.status(200).json({
                message: 'Label updated successfully',
                label
            });
        } catch (error) {
            next(error);
        }
    },

    async deleteLabel(req, res, next) {
        try {
            const userId = req.user.id;
            const labelId = req.params.id;

            await labelService.deleteLabel(labelId, userId);

            res.status(200).json({
                message: 'Label deleted successfully'
            });
        } catch (error) {
            next(error);
        }
    },

    async addLabelToNote(req, res, next) {
        try {
            const userId = req.user.id;
            const noteId = req.params.noteId;
            const { labelId } = req.body;

            if (!labelId) {
                return res.status(400).json({
                    error: 'Label ID is required'
                });
            }

            const assignment = await labelService.addLabelToNote(noteId, labelId, userId);

            res.status(200).json({
                message: 'Label added to note successfully',
                assignment
            });
        } catch (error) {
            next(error);
        }
    },

    async removeLabelFromNote(req, res, next) {
        try {
            const userId = req.user.id;
            const { noteId, labelId } = req.params;

            await labelService.removeLabelFromNote(noteId, labelId, userId);

            res.status(200).json({
                message: 'Label removed from note successfully'
            });
        } catch (error) {
            next(error);
        }
    },

    async getNotesLabels(req, res, next) {
        try {
            const noteId = req.params.noteId;
            const labels = await labelService.getNotesLabels(noteId);

            res.status(200).json({
                labels
            });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = labelController;
