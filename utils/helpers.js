import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';

export const isValidEmail = (email) =>
    /^[\w.-]+@[\w.-]+\.\w{2,4}$/.test(email);


export const isValidPasswordFullNameAndPhoneNumber = (password, fullName, phoneNumber) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/; // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const fullNameRegex = /^[a-zA-Z\s]+$/; // Only letters and spaces
    const phoneNumberRegex = /^\+?[1-9]\d{1,14}$/; // E.164 format

    return (
        passwordRegex.test(password) &&
        fullNameRegex.test(fullName) &&
        phoneNumberRegex.test(phoneNumber)
    );
}

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
