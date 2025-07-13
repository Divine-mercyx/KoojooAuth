import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';

const provider = new SuiClient({
    url: getFullnodeUrl('mainnet'),
    network: 'mainnet'
});

provider.getChainIdentifier()
    .then(() => console.log('Sui Mainnet connected'))
    .catch(err => console.error('Connection failed:', err));

export default provider;
