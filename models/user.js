import mongoose from 'mongoose';
import { Roles } from '../roles/roles.js';
import {comparePassword, hashPassword} from "../middlewares/userMiddleware.js";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: ''
    },
    bvn: {
        type: String,
        unique: true,
        sparse: true,
        default: ''
    },
    role: {
        type: String,
        required: true,
        enum: Object.values(Roles),
        default: Roles.USER
    },
    phoneNumber: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    overAllTrustScore: {
        type: Number,
        default: 0
    },
    totalGroupsJoined: {
        type: Number,
        default: 0
    },
    totalCyclesJoined: {
        type: Number,
        default: 0
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    lastLoginIP: {
        type: String,
        default: ''
    },
    lastLoginDevice: {
        type: String,
        default: ''
    },
    suiAddress: {
        type: String,
        unique: true,
        sparse: true
    },
    suiPrivateKey: {
        type: String,
        unique: true,
        sparse: true
    }
}, { timestamps: true });

userSchema.pre('save', hashPassword)
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};
const User = mongoose.model('User', userSchema);

export default User;
