const db = require('../db/db');

const reminderService = {
    async getReminderByNoteId(noteId) {
        const reminder = await db('reminders')
            .where({ note_id: noteId })
            .first();

        return reminder;
    },

    async setReminder(noteId, userId, reminderTime) {
        // Verify note belongs to user
        const note = await db('notes')
            .where({ id: noteId, user_id: userId })
            .first();

        if (!note) {
            const error = new Error('Note not found');
            error.status = 404;
            throw error;
        }

        // Check if reminder already exists
        const existing = await db('reminders')
            .where({ note_id: noteId })
            .first();

        if (existing) {
            // Update existing reminder
            const [reminder] = await db('reminders')
                .where({ note_id: noteId })
                .update({
                    reminder_time: reminderTime,
                    is_sent: false
                })
                .returning('*');

            return reminder;
        }

        // Create new reminder
        const [reminder] = await db('reminders')
            .insert({
                note_id: noteId,
                reminder_time: reminderTime,
                is_sent: false
            })
            .returning('*');

        return reminder;
    },

    async deleteReminder(noteId, userId) {
        // Verify note belongs to user
        const note = await db('notes')
            .where({ id: noteId, user_id: userId })
            .first();

        if (!note) {
            const error = new Error('Note not found');
            error.status = 404;
            throw error;
        }

        await db('reminders')
            .where({ note_id: noteId })
            .delete();

        return true;
    },

    async getUpcomingReminders(userId, limit = 10) {
        const reminders = await db('reminders')
            .join('notes', 'reminders.note_id', 'notes.id')
            .where('notes.user_id', userId)
            .where('reminders.is_sent', false)
            .where('reminders.reminder_time', '>', new Date())
            .orderBy('reminders.reminder_time', 'asc')
            .limit(limit)
            .select('reminders.*', 'notes.title', 'notes.content');

        return reminders;
    },

    async getDueReminders() {
        // Get all reminders that are due and not sent
        const reminders = await db('reminders')
            .join('notes', 'reminders.note_id', 'notes.id')
            .join('users', 'notes.user_id', 'users.id')
            .where('reminders.is_sent', false)
            .where('reminders.reminder_time', '<=', new Date())
            .select(
                'reminders.*',
                'notes.title',
                'notes.content',
                'users.email',
                'users.id as user_id'
            );

        return reminders;
    },

    async markReminderAsSent(reminderId) {
        await db('reminders')
            .where({ id: reminderId })
            .update({ is_sent: true });

        return true;
    }
};

module.exports = reminderService;
