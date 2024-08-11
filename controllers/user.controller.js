const bcrypt = require('bcrypt');
const { User } = require('../db/index');

const createUser = async (req, res) => {
    const { email, password, firstName, lastName } = req.body;
    if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({
            message: 'email, password, first name and last name are required',
        });
    }

    try {
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ message: 'email already exists' });
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const newUser = new User({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword,
        });

        await newUser.save();

        return res.status(201).json({ message: `New User ${email} created` });
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({ message: 'Failed to create user' });
    }
};

const createGovUser = async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden' });
    }
    const { email, password, firstName, lastName } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            message: 'email, password, first name and last name are required',
        });
    }
    try {
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ message: 'email already exists' });
        }
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);
        const newUser = new User({
            email: email,
            password: hashedPassword,
            firstName: firstName,
            lastName: lastName,
            role: 'gov',
        });
        await newUser.save();
        return res
            .status(201)
            .json({ message: `New Gov User ${email} created` });
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({ message: 'Failed to create user' });
    }
};

const getUser = async (req, res) => {
    try {
        console.log('req.user:', req.user);
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json(user);
    } catch (error) {
        console.error('Error getting user:', error);
        return res.status(500).json({ message: 'Failed to get user' });
    }
};

module.exports = {
    createUser,
    createGovUser,
    getUser,
};
