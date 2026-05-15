const jwt = require('jsonwebtoken');
const client = require('../models/client');

// Middleware to authenticate JWT token
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({
                message: 'Access token required'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from database
        const user = await client.findByPk(decoded.id);
        if (!user) {
            return res.status(401).json({
                message: 'Invalid token'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: 'Token expired'
            });
        }
        return res.status(403).json({
            message: 'Invalid token'
        });
    }
};

module.exports = { authenticateToken };