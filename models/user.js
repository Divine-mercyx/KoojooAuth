import mongoose from 'mongoose';
import { Roles } from '../roles/roles.js';
import {comparePassword, hashPassword} from "../middlewares/userMiddleware.js";

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: Object.values(Roles), default: Roles.USER },
    phoneNumber: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    trustScore: { type: Number, default: 0 },
    lastLogin: { type: Date, default: Date.now },
    lastLoginIP: { type: String, default: '' },
    lastLoginDevice: { type: String, default: '' },
}, { timestamps: true });

userSchema.pre('save', hashPassword)
userSchema.methods.comparePassword = comparePassword

const User = mongoose.model('User', userSchema);

export default User;
