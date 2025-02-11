const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        let token = req.cookies.token;
        if (!token) {
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.split(" ")[1];
            }
            }
        if (!token) {
            return res.status(401).json({ message: 'Authorization token required' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.error('Token verification failed:', err);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

const adminMiddleware = (req, res, next) => {
    const adminEmails = (process.env.ADMIN_EMAILS || '')
        .split(',')
        .map((email) => email.trim().toLowerCase())
        .filter(Boolean);

    if (!adminEmails.length) {
        return res.status(503).json({ message: 'Admin access is not configured' });
    }

    if (!req.user || !adminEmails.includes(String(req.user.email).toLowerCase())) {
        return res.status(403).json({ message: 'Forbidden' });
    }

    next();
};

module.exports = { authMiddleware, adminMiddleware };
