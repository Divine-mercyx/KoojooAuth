import mongoose from 'mongoose';

const stakeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    validatorAddress: { type: String, required: true },
    amount: { type: Number, required: true }, // in SUI
    status: { type: String, enum: ['staked', 'unstaked'], default: 'staked' },
    stakeTime: { type: Date, default: Date.now },
    unStakeTime: { type: Date },
}, { timestamps: true });

export default mongoose.model('Stake', stakeSchema);
