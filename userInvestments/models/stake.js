import mongoose from 'mongoose';

const stakeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    validatorAddress: { type: String, required: true },
    amount: { type: Number, required: true }, // in SUI
    stakedSuiId: { type: String, required: true }, // Object ID of the staked SUI
    status: { type: String, enum: ['staked', 'unstaked'], default: 'staked' },
    withdrawalStatus: { type: String, enum: ['pending', 'completed'], default: 'pending' }, // For tracking
    stakeTime: { type: Date, default: Date.now },
    unStakeTime: { type: Date },
    withdrawalInitiatedAt: { type: Date } // When unstaking was initiated
}, { timestamps: true });

export default mongoose.model('Stake', stakeSchema);
