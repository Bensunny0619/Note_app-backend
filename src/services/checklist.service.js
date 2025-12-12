const db = require('../db/db');

const checklistService = {
    async getChecklistItems(noteId) {
        const items = await db('checklist_items')
            .where({ note_id: noteId })
            .orderBy('position', 'asc')
            .select('*');

        return items;
    },

    async createChecklistItem(noteId, { text, position }) {
        const [item] = await db('checklist_items')
            .insert({
                note_id: noteId,
                text,
                position: position || 0,
                is_checked: false
            })
            .returning('*');

        return item;
    },

    async updateChecklistItem(itemId, noteId, updates) {
        // Verify item belongs to note
        const item = await db('checklist_items')
            .where({ id: itemId, note_id: noteId })
            .first();

        if (!item) {
            const error = new Error('Checklist item not found');
            error.status = 404;
            throw error;
        }

        // Only allow updating specific fields
        const allowedFields = ['text', 'is_checked', 'position'];
        const filteredUpdates = {};

        for (const field of allowedFields) {
            if (updates[field] !== undefined) {
                filteredUpdates[field] = updates[field];
            }
        }

        const [updatedItem] = await db('checklist_items')
            .where({ id: itemId, note_id: noteId })
            .update(filteredUpdates)
            .returning('*');

        return updatedItem;
    },

    async toggleChecklistItem(itemId, noteId) {
        const item = await db('checklist_items')
            .where({ id: itemId, note_id: noteId })
            .first();

        if (!item) {
            const error = new Error('Checklist item not found');
            error.status = 404;
            throw error;
        }

        const [updatedItem] = await db('checklist_items')
            .where({ id: itemId, note_id: noteId })
            .update({ is_checked: !item.is_checked })
            .returning('*');

        return updatedItem;
    },

    async deleteChecklistItem(itemId, noteId) {
        const item = await db('checklist_items')
            .where({ id: itemId, note_id: noteId })
            .first();

        if (!item) {
            const error = new Error('Checklist item not found');
            error.status = 404;
            throw error;
        }

        await db('checklist_items')
            .where({ id: itemId, note_id: noteId })
            .delete();

        return true;
    }
};

module.exports = checklistService;
