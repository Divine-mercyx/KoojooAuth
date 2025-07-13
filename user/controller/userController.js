import User from '../models/user.js';
import { isValidEmail, createSuiWallet, formatUserResponse, isValidPasswordFullNameAndPhoneNumber } from '../utils/helpers.js';
import {Roles} from "../roles/roles.js";

export const register = async (req, res) => {
    const { fullName, email, password, phoneNumber, lastLoginIP, lastLoginDevice  } = req.body;
    if (!isValidEmail(email)) return res.code(400).send({ message: 'Invalid email format' });
    if (!isValidPasswordFullNameAndPhoneNumber(password, fullName, phoneNumber)) return res.code(400).send({ message: 'Invalid details, make sure all details are entered correctly' });
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });
        const { publicKey: suiAddress, privateKey: suiPrivateKey } = createSuiWallet();
        const newUser = new User({ fullName, email, password, phoneNumber, lastLoginIP, lastLoginDevice, suiAddress, suiPrivateKey });
        await newUser.save();
        const token = res.server.jwt.sign({ id: newUser._id, fullName: newUser.fullName, email: newUser.email });

        res.code(201).send({
            message: 'User registered successfully',
            success: true,
            token,
            user: formatUserResponse(newUser)
        });
    } catch(error) {
        console.error('Error during registration:', error);
        res.code(500).send({ message: 'Internal server error' });
    }
};


export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!isValidEmail(email)) return res.code(400).send({ message: 'Invalid email format' });
    try {
        const user = await User.findOne({ email });
        if (!user) res.code(404).send({ message: 'User not found' });
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) return res.code(401).send({ message: 'Invalid password' });
        const token = res.server.jwt.sign({ id: user._id, fullName: user.fullName, email: user.email });
        res.code(201).send({
            message: 'Login successful',
            success: true,
            token,
            user: formatUserResponse(user)
        })
    } catch (error) {
        console.error('Error during login:', error);
        res.code(500).send({ message: 'Internal server error' });
    }
}


export const promoteToTreasurer = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.code(404).send({ message: 'User not found' });
        if (user.role === Roles.TREASURER) return res.code(400).send({ message: 'User is already a treasurer' });
        user.role = Roles.TREASURER;
        await user.save();
        res.send({ message: 'User promoted to treasurer successfully', user: formatUserResponse(user) });
    } catch (error) {
        console.error('Error promoting user to treasurer:', error);
        res.code(500).send({ message: 'Internal server error' });
    }
}

export const deleteAccount = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.code(404).send({ message: 'User not found' });
        await User.deleteOne({ _id: user._id });
        res.send({ message: 'Account deleted successfully' });
    } catch (error) {
        console.error('Error deleting account:', error);
        res.code(500).send({ message: 'Internal server error' });
    }
}

export const getUserTrustScore = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.code(404).send({ message: 'User not found' });
        res.send({ overAllTrustScore: user.overAllTrustScore });
    } catch (error) {
        console.error('Error fetching user trust score:', error);
        res.code(500).send({ message: 'Internal server error' });
    }
}

export const getUserValidationToJoinGroup = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.code(404).send({ message: 'User not found' });
        if (user.isVerified && user.isActive && user.overAllTrustScore >= 50) {
            return res.send({ canJoinGroup: true, message: 'User is eligible to join groups' });
        }
        res.send({ canJoinGroup: false, message: 'User is not eligible to join groups' });
    } catch (error) {
        console.error('Error checking user eligibility for group:', error);
        res.code(500).send({ message: 'Internal server error' });
    }
}
