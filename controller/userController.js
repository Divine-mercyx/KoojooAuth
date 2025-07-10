import User from '../models/user.js';

const isValidEmail = (email) => {
    return /^[\w.-]+@[\w.-]+\.\w{2,4}$/.test(email);
};



export const register = async (req, res) => {
    const { fullName, email, password, phoneNumber, lastLoginIP, lastLoginDevice  } = req.body;
    if (!isValidEmail(email)) return res.code(400).send({ message: 'Invalid email format' });
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });
        const newUser = new User({ fullName, email, password, phoneNumber, lastLoginIP, lastLoginDevice });
        await newUser.save();
        res.code(201).send({ message: 'User registered successfully', success: true });
    } catch(error) {
        console.error('Error during registration:', error);
        res.code(500).send({ message: 'Internal server error' });
    }
};



