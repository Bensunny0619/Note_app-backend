const db = require('../db/db');

const labelService = {
    async getAllLabels(userId) {
        const labels = await db('labels')
            .where({ user_id: userId })
            .orderBy('name', 'asc')
            .select('*');

        return labels;
    },

    async getLabelById(labelId, userId) {
        const label = await db('labels')
            .where({ id: labelId, user_id: userId })
            .first();

        if (!label) {
            const error = new Error('Label not found');
            error.status = 404;
            throw error;
        }

        return label;
    },

    async createLabel(userId, { name, color }) {
        // Check if label with same name already exists for user
        const existing = await db('labels')
            .where({ user_id: userId, name })
            .first();

        if (existing) {
            const error = new Error('Label with this name already exists');
            error.status = 409;
            throw error;
        }

        const [label] = await db('labels')
            .insert({
                user_id: userId,
                name,
                color: color || '#808080'
            })
            .returning('*');

        return label;
    },

    async updateLabel(labelId, userId, updates) {
        // Verify label belongs to user
        await this.getLabelById(labelId, userId);

        // Only allow updating specific fields
        const allowedFields = ['name', 'color'];
        const filteredUpdates = {};

        for (const field of allowedFields) {
            if (updates[field] !== undefined) {
                filteredUpdates[field] = updates[field];
            }
        }

        const [label] = await db('labels')
            .where({ id: labelId, user_id: userId })
            .update(filteredUpdates)
            .returning('*');

        return label;
    },

    async deleteLabel(labelId, userId) {
        // Verify label belongs to user
        await this.getLabelById(labelId, userId);

        // Delete label (cascade will remove note_labels entries)
        await db('labels')
            .where({ id: labelId, user_id: userId })
            .delete();

        return true;
    },

    async addLabelToNote(noteId, labelId, userId) {
        // Verify label belongs to user
        await this.getLabelById(labelId, userId);

        // Verify note belongs to user
        const note = await db('notes')
            .where({ id: noteId, user_id: userId })
            .first();

        if (!note) {
            const error = new Error('Note not found');
            error.status = 404;
            throw error;
        }

        // Check if already assigned
        const existing = await db('note_labels')
            .where({ note_id: noteId, label_id: labelId })
            .first();

        if (existing) {
            return existing; // Already assigned, return existing
        }

        const [assignment] = await db('note_labels')
            .insert({
                note_id: noteId,
                label_id: labelId
            })
            .returning('*');

        return assignment;
    },

    async removeLabelFromNote(noteId, labelId, userId) {
        // Verify label belongs to user
        await this.getLabelById(labelId, userId);

        // Verify note belongs to user
        const note = await db('notes')
            .where({ id: noteId, user_id: userId })
            .first();

        if (!note) {
            const error = new Error('Note not found');
            error.status = 404;
            throw error;
        }

        await db('note_labels')
            .where({ note_id: noteId, label_id: labelId })
            .delete();

        return true;
    },

    async getNotesLabels(noteId) {
        const labels = await db('labels')
            .join('note_labels', 'labels.id', 'note_labels.label_id')
            .where('note_labels.note_id', noteId)
            .select('labels.*');

        return labels;
    }
};

module.exports = labelService;
