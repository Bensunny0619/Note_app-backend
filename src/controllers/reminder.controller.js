const reminderService = require('../services/reminder.service');

const reminderController = {
    async setReminder(req, res, next) {
        try {
            const userId = req.user.id;
            const noteId = req.params.noteId;
            const { reminderTime } = req.body;

            if (!reminderTime) {
                return res.status(400).json({
                    error: 'Reminder time is required'
                });
            }

            // Validate date
            const reminderDate = new Date(reminderTime);
            if (isNaN(reminderDate.getTime())) {
                return res.status(400).json({
                    error: 'Invalid reminder time format'
                });
            }

            if (reminderDate <= new Date()) {
                return res.status(400).json({
                    error: 'Reminder time must be in the future'
                });
            }

            const reminder = await reminderService.setReminder(noteId, userId, reminderTime);

            res.status(200).json({
                message: 'Reminder set successfully',
                reminder
            });
        } catch (error) {
            next(error);
        }
    },

    async deleteReminder(req, res, next) {
        try {
            const userId = req.user.id;
            const noteId = req.params.noteId;

            await reminderService.deleteReminder(noteId, userId);

            res.status(200).json({
                message: 'Reminder deleted successfully'
            });
        } catch (error) {
            next(error);
        }
    },

    async getUpcomingReminders(req, res, next) {
        try {
            const userId = req.user.id;
            const { limit } = req.query;

            const reminders = await reminderService.getUpcomingReminders(userId, limit);

            res.status(200).json({
                reminders
            });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = reminderController;
