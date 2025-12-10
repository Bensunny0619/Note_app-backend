const db = require('../db/db');

const noteService = {
    async getAllNotes(userId) {
        const notes = await db('notes')
            .where({ user_id: userId })
            .orderBy('is_pinned', 'desc')
            .orderBy('updated_at', 'desc')
            .select('*');

        return notes;
    },

    async getNoteById(noteId, userId) {
        const note = await db('notes')
            .where({ id: noteId, user_id: userId })
            .first();

        if (!note) {
            const error = new Error('Note not found');
            error.status = 404;
            throw error;
        }

        return note;
    },

    async createNote({ userId, title, content, color }) {
        const [note] = await db('notes')
            .insert({
                user_id: userId,
                title: title || '',
                content: content || '',
                color: color || '#ffffff'
            })
            .returning('*');

        return note;
    },

    async updateNote(noteId, userId, updates) {
        // Verify note belongs to user
        await this.getNoteById(noteId, userId);

        // Only allow updating specific fields
        const allowedFields = ['title', 'content', 'color', 'is_archived', 'is_pinned'];
        const filteredUpdates = {};

        for (const field of allowedFields) {
            if (updates[field] !== undefined) {
                filteredUpdates[field] = updates[field];
            }
        }

        const [note] = await db('notes')
            .where({ id: noteId, user_id: userId })
            .update(filteredUpdates)
            .returning('*');

        return note;
    },

    async deleteNote(noteId, userId) {
        // Verify note belongs to user
        await this.getNoteById(noteId, userId);

        await db('notes')
            .where({ id: noteId, user_id: userId })
            .delete();

        return true;
    },

    async toggleArchive(noteId, userId) {
        const note = await this.getNoteById(noteId, userId);

        const [updatedNote] = await db('notes')
            .where({ id: noteId, user_id: userId })
            .update({ is_archived: !note.is_archived })
            .returning('*');

        return updatedNote;
    },

    async togglePin(noteId, userId) {
        const note = await this.getNoteById(noteId, userId);

        const [updatedNote] = await db('notes')
            .where({ id: noteId, user_id: userId })
            .update({ is_pinned: !note.is_pinned })
            .returning('*');

        return updatedNote;
    }
};

module.exports = noteService;
