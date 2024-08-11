const jwt = require('jsonwebtoken');

const generateAccessToken = (user) => {
    // console.log('User:', user);
    return jwt.sign(
        { id: user._id, username: user.username, role: user.role },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: '1d',
        }
    );
};

module.exports = { generateAccessToken };
