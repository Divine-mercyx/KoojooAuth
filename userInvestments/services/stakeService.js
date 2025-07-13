import { TransactionBlock } from '@mysten/sui.js/transactions';

export default class StakeService {
    constructor(provider) {
        if (!provider) throw new Error('Sui provider required');
        this.provider = provider;
    }

    async validateWalletFunds(senderAddress) {
        const { totalBalance } = await this.provider.getBalance({ owner: senderAddress });
        if (BigInt(totalBalance) < 100_000_000n) {
            throw new Error(`Insufficient funds (${totalBalance/1e9} SUI). Minimum 0.1 SUI required`);
        }
    }

    async buildStakeTransaction(keypair, validatorAddress, amountInMist) {
        const tx = new TransactionBlock();
        tx.setSender(keypair.getPublicKey().toSuiAddress());
        tx.setGasBudget(50_000_000);

        const [coin] = tx.splitCoins(tx.gas, [tx.pure(amountInMist)]);
        tx.moveCall({
            target: '0x3::sui_system::request_add_stake',
            arguments: [tx.object('0x5'), coin, tx.pure(validatorAddress)]
        });

        return tx;
    }

    async estimateGasCost(tx) {
        const dryRun = await this.provider.dryRunTransactionBlock({
            transactionBlock: await tx.build({ client: this.provider })
        });
        return dryRun.effects.gasUsed;
    }


    async executeTransaction(keypair, tx) {
        const signedTx = await keypair.signTransactionBlock({
            transactionBlock: await tx.build({ client: this.provider })
        });

        return this.provider.executeTransactionBlock({
            transactionBlock: signedTx.transactionBlockBytes,
            signature: signedTx.signature,
            options: { showEffects: true }
        });
    }
}
