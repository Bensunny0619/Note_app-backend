const userService = require('../services/user.service');

const userController = {
    async getProfile(req, res, next) {
        try {
            const userId = req.user.id;
            const profile = await userService.getUserProfile(userId);

            res.status(200).json({
                profile
            });
        } catch (error) {
            next(error);
        }
    },

    async updateProfile(req, res, next) {
        try {
            const userId = req.user.id;
            const updates = req.body;

            const profile = await userService.updateProfile(userId, updates);

            res.status(200).json({
                message: 'Profile updated successfully',
                profile
            });
        } catch (error) {
            next(error);
        }
    },

    async updatePreferences(req, res, next) {
        try {
            const userId = req.user.id;
            const preferences = req.body;

            const profile = await userService.updatePreferences(userId, preferences);

            res.status(200).json({
                message: 'Preferences updated successfully',
                profile
            });
        } catch (error) {
            next(error);
        }
    },

    async changePassword(req, res, next) {
        try {
            const userId = req.user.id;
            const { currentPassword, newPassword } = req.body;

            if (!currentPassword || !newPassword) {
                return res.status(400).json({
                    error: 'Current password and new password are required'
                });
            }

            if (newPassword.length < 6) {
                return res.status(400).json({
                    error: 'New password must be at least 6 characters long'
                });
            }

            await userService.changePassword(userId, currentPassword, newPassword);

            res.status(200).json({
                message: 'Password changed successfully'
            });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = userController;
