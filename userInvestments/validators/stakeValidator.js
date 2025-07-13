export const validateStakeInput = (data) => {
    const errors = {};

    if (!data.validatorAddress?.startsWith('0x') || data.validatorAddress.length < 32) {
        errors.validatorAddress = 'Invalid validator address format';
    }

    if (Number(data.amount) <= 0) {
        errors.amount = 'Must be a positive number';
    }

    return {
        errors,
        isValid: Object.keys(errors).length === 0
    };
};
