import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { TransactionBlock } from '@mysten/sui.js/transactions'
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import User from '../../user/models/user.js';
import Stake from '../models/stake.js';

const provider = new SuiClient({
    url: getFullnodeUrl('mainnet'),
    network: 'mainnet'
});

provider.getChainIdentifier()
    .then(() => console.log('Sui Mainnet connected'))
    .catch(err => console.error('Connection failed:', err));

export const stakeTokens = async (req, res) => {
    const { validatorAddress, amount } = req.body;

    try {
        if (!validatorAddress.startsWith('0x') || validatorAddress.length < 32) {
            return res.status(400).send({ message: 'Invalid validator address' });
        }
        if (amount <= 0) {
            return res.status(400).send({ message: 'Amount must be positive' });
        }

        const user = await User.findById(req.user.id);
        if (!user || !user.suiPrivateKey) {
            return res.status(404).send({ message: 'User wallet not found' });
        }

        const keypair = Ed25519Keypair.fromSecretKey(user.suiPrivateKey);
        const tx = new TransactionBlock();
        tx.setSender(keypair.getPublicKey().toSuiAddress());
        tx.setGasBudget(50_000_000);

        const amountInMist = BigInt(amount * 1e9);
        const [coin] = tx.splitCoins(tx.gas, [tx.pure(amountInMist)]);
        tx.moveCall({
            target: '0x3::sui_system::request_add_stake',
            arguments: [tx.object('0x5'), coin, tx.pure(validatorAddress)]
        });

        const signedTx = await keypair.signTransactionBlock({
            transactionBlock: await tx.build({ client: provider })
        });

        const result = await provider.executeTransactionBlock({
            transactionBlock: signedTx.transactionBlockBytes,
            signature: signedTx.signature,
            options: { showEffects: true }
        });

        await Stake.create({ userId: user._id, validatorAddress, amount });
        res.send({ message: 'Staked successfully', success: true, result });
    } catch (err) {
        console.error('Stake error:', err);
        res.status(500).send({ message: 'Failed to stake', error: err.message });
    }
};

