const session = require('express-session');

// Middleware to check if user is authenticated
const authenticateSession = (req, res, next) => {
    if (req.session.user) {
        next(); // User is authenticated, proceed to the next middleware/route
    } else {
        return res.status(401).json({ message: 'Unauthorized access' }); // User is not authenticated
    }
};

module.exports = authenticateSession;
