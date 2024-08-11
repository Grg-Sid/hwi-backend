const { User } = require('../db/index');
const bcrypt = require('bcrypt');
const { generateAccessToken } = require('../utils/tokenUtils');

const handleLogin = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Bad request' });
    }
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const accessToken = generateAccessToken(user);

        res.status(200).json({
            message: 'Login successful',
            accessToken,
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Bad request' });
    }
};

const handleLogout = async (req, res) => {
    res.clearCookie('accessToken');
    res.status(200).json({ message: 'Logged out' });
};

module.exports = { handleLogin, handleLogout };
