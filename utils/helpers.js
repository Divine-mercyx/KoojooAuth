import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';

export const isValidEmail = (email) =>
    /^[\w.-]+@[\w.-]+\.\w{2,4}$/.test(email);

export const createSuiWallet = () => {
    const keypair = new Ed25519Keypair();
    return {
        publicKey: keypair.getPublicKey().toSuiAddress(),
        privateKey: keypair.export().privateKey,
    };
};

export const formatUserResponse = (user) => ({
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    lastLoginIP: user.lastLoginIP,
    lastLoginDevice: user.lastLoginDevice,
    suiAddress: user.suiAddress
});
