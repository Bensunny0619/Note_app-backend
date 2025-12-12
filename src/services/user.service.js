const db = require('../db/db');

const userService = {
    async getUserProfile(userId) {
        const user = await db('users')
            .where({ id: userId })
            .select('id', 'email', 'name', 'avatar_url', 'preferences', 'created_at')
            .first();

        if (!user) {
            const error = new Error('User not found');
            error.status = 404;
            throw error;
        }

        // Parse preferences if it's a string
        if (typeof user.preferences === 'string') {
            user.preferences = JSON.parse(user.preferences);
        }

        return user;
    },

    async updateProfile(userId, updates) {
        // Only allow updating specific fields
        const allowedFields = ['name', 'avatar_url'];
        const filteredUpdates = {};

        for (const field of allowedFields) {
            if (updates[field] !== undefined) {
                filteredUpdates[field] = updates[field];
            }
        }

        const [user] = await db('users')
            .where({ id: userId })
            .update(filteredUpdates)
            .returning(['id', 'email', 'name', 'avatar_url', 'preferences']);

        return user;
    },

    async updatePreferences(userId, preferences) {
        // Get current preferences
        const user = await db('users')
            .where({ id: userId })
            .select('preferences')
            .first();

        let currentPrefs = {};
        if (user.preferences) {
            currentPrefs = typeof user.preferences === 'string'
                ? JSON.parse(user.preferences)
                : user.preferences;
        }

        // Merge with new preferences
        const updatedPrefs = { ...currentPrefs, ...preferences };

        const [updatedUser] = await db('users')
            .where({ id: userId })
            .update({ preferences: JSON.stringify(updatedPrefs) })
            .returning(['id', 'email', 'name', 'avatar_url', 'preferences']);

        return updatedUser;
    },

    async changePassword(userId, currentPassword, newPassword) {
        const bcrypt = require('bcrypt');

        // Get user
        const user = await db('users')
            .where({ id: userId })
            .first();

        if (!user) {
            const error = new Error('User not found');
            error.status = 404;
            throw error;
        }

        // Verify current password
        const isValid = await bcrypt.compare(currentPassword, user.password_hash);

        if (!isValid) {
            const error = new Error('Current password is incorrect');
            error.status = 401;
            throw error;
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        await db('users')
            .where({ id: userId })
            .update({ password_hash: hashedPassword });

        return true;
    }
};

module.exports = userService;
