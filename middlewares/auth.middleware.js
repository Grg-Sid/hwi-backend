const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const cookie = req.headers.cookie;
    if (!cookie) return res.sendStatus(401);
    const token = cookie.split('=')[1];
    // console.log('token:', token);
    try {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) return res.sendStatus(403);
            req.user = user;
            next();
        });
    } catch (error) {
        console.error('Error authenticating token:', error);
        return res.sendStatus(500);
    }
};

module.exports = { authenticateToken };
