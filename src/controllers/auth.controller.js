const authService = require('../services/auth.service');

const authController = {
    async signup(req, res, next) {
        try {
            const { email, password } = req.body;

            // Validation
            if (!email || !password) {
                return res.status(400).json({
                    error: 'Email and password are required'
                });
            }

            const result = await authService.signup({ email, password });

            res.status(201).json({
                message: 'User created successfully',
                user: result.user,
                token: result.token
            });
        } catch (error) {
            next(error);
        }
    },

    async login(req, res, next) {
        try {
            const { email, password } = req.body;

            // Validation
            if (!email || !password) {
                return res.status(400).json({
                    error: 'Email and password are required'
                });
            }

            const result = await authService.login({ email, password });

            res.status(200).json({
                message: 'Login successful',
                user: result.user,
                token: result.token
            });
        } catch (error) {
            next(error);
        }
    },

    async logout(req, res, next) {
        try {
            // For JWT-based auth, logout is typically handled client-side
            // by removing the token. This endpoint can be used for logging
            // or token blacklisting if needed.

            res.status(200).json({
                message: 'Logout successful'
            });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = authController;
