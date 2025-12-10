const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db/db');

const authService = {
    async signup({ email, password }) {
        // Check if user already exists
        const existingUser = await db('users').where({ email }).first();

        if (existingUser) {
            const error = new Error('User with this email already exists');
            error.status = 409;
            throw error;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const [user] = await db('users')
            .insert({
                email,
                password_hash: hashedPassword
            })
            .returning(['id', 'email', 'created_at']);

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
        );

        return {
            user: {
                id: user.id,
                email: user.email
            },
            token
        };
    },

    async login({ email, password }) {
        // Find user
        const user = await db('users').where({ email }).first();

        if (!user) {
            const error = new Error('Invalid email or password');
            error.status = 401;
            throw error;
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password_hash);

        if (!isValidPassword) {
            const error = new Error('Invalid email or password');
            error.status = 401;
            throw error;
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
        );

        return {
            user: {
                id: user.id,
                email: user.email
            },
            token
        };
    }
};

module.exports = authService;
