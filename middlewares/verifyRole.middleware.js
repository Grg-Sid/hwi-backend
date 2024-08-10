const { User } = require('../db/index');

const verifyRole = (role) => {
    return async (req, res, next) => {
        try {
            const userid = req.user;
            const user = await User.findById(userid);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            if (user.role !== role) {
                return res.status(403).json({
                    message: 'Unauthorized access: Insufficient role',
                });
            }
            next();
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    };
};

module.exports = { verifyRole };
