const db = require('../db/db');

const noteService = {
    async getAllNotes(userId, options = {}) {
        const { page = 1, limit = 50, archived, pinned, labelId } = options;
        const offset = (page - 1) * limit;

        let query = db('notes')
            .where({ user_id: userId });

        // Apply filters
        if (archived !== undefined) {
            query = query.where({ is_archived: archived });
        }
        if (pinned !== undefined) {
            query = query.where({ is_pinned: pinned });
        }
        if (labelId) {
            query = query
                .join('note_labels', 'notes.id', 'note_labels.note_id')
                .where('note_labels.label_id', labelId);
        }

        const notes = await query
            .orderBy('is_pinned', 'desc')
            .orderBy('updated_at', 'desc')
            .limit(limit)
            .offset(offset)
            .select('notes.*');

        // Get total count for pagination
        const countQuery = db('notes').where({ user_id: userId });
        if (archived !== undefined) {
            countQuery.where({ is_archived: archived });
        }
        if (pinned !== undefined) {
            countQuery.where({ is_pinned: pinned });
        }
        const [{ count }] = await countQuery.count('* as count');

        return {
            notes,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: parseInt(count),
                totalPages: Math.ceil(count / limit)
            }
        };
    },

    async searchNotes(userId, searchQuery, options = {}) {
        const { page = 1, limit = 50 } = options;
        const offset = (page - 1) * limit;

        const notes = await db('notes')
            .where({ user_id: userId })
            .where(function () {
                this.where('title', 'ilike', `%${searchQuery}%`)
                    .orWhere('content', 'ilike', `%${searchQuery}%`);
            })
            .orderBy('is_pinned', 'desc')
            .orderBy('updated_at', 'desc')
            .limit(limit)
            .offset(offset)
            .select('*');

        // Get total count
        const [{ count }] = await db('notes')
            .where({ user_id: userId })
            .where(function () {
                this.where('title', 'ilike', `%${searchQuery}%`)
                    .orWhere('content', 'ilike', `%${searchQuery}%`);
            })
            .count('* as count');

        return {
            notes,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: parseInt(count),
                totalPages: Math.ceil(count / limit)
            }
        };
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
    },

    async shareNote(noteId, userId, sharedWithEmail, permission = 'read') {
        // Verify note belongs to user
        await this.getNoteById(noteId, userId);

        // Find user to share with
        const sharedWithUser = await db('users')
            .where({ email: sharedWithEmail })
            .first();

        if (!sharedWithUser) {
            const error = new Error('User not found with that email');
            error.status = 404;
            throw error;
        }

        if (sharedWithUser.id === userId) {
            const error = new Error('Cannot share note with yourself');
            error.status = 400;
            throw error;
        }

        // Check if already shared
        const existing = await db('shared_notes')
            .where({ note_id: noteId, shared_with_user_id: sharedWithUser.id })
            .first();

        if (existing) {
            // Update permission
            const [share] = await db('shared_notes')
                .where({ note_id: noteId, shared_with_user_id: sharedWithUser.id })
                .update({ permission })
                .returning('*');

            return share;
        }

        // Create new share
        const [share] = await db('shared_notes')
            .insert({
                note_id: noteId,
                shared_with_user_id: sharedWithUser.id,
                permission
            })
            .returning('*');

        return share;
    },

    async unshareNote(noteId, userId, sharedWithUserId) {
        // Verify note belongs to user
        await this.getNoteById(noteId, userId);

        await db('shared_notes')
            .where({ note_id: noteId, shared_with_user_id: sharedWithUserId })
            .delete();

        return true;
    },

    async getSharedNotes(userId) {
        // Get notes shared with this user
        const notes = await db('notes')
            .join('shared_notes', 'notes.id', 'shared_notes.note_id')
            .join('users', 'notes.user_id', 'users.id')
            .where('shared_notes.shared_with_user_id', userId)
            .orderBy('notes.updated_at', 'desc')
            .select(
                'notes.*',
                'shared_notes.permission',
                'users.email as owner_email',
                'users.name as owner_name'
            );

        return notes;
    },

    async getNoteShares(noteId, userId) {
        // Verify note belongs to user
        await this.getNoteById(noteId, userId);

        const shares = await db('shared_notes')
            .join('users', 'shared_notes.shared_with_user_id', 'users.id')
            .where('shared_notes.note_id', noteId)
            .select(
                'shared_notes.*',
                'users.email',
                'users.name'
            );

        return shares;
    },

    async checkNoteAccess(noteId, userId) {
        // Check if user owns the note
        const ownedNote = await db('notes')
            .where({ id: noteId, user_id: userId })
            .first();

        if (ownedNote) {
            return { hasAccess: true, permission: 'write', isOwner: true };
        }

        // Check if note is shared with user
        const sharedNote = await db('shared_notes')
            .where({ note_id: noteId, shared_with_user_id: userId })
            .first();

        if (sharedNote) {
            return { hasAccess: true, permission: sharedNote.permission, isOwner: false };
        }

        return { hasAccess: false, permission: null, isOwner: false };
    }
};

module.exports = noteService;
