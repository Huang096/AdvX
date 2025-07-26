import 'dotenv/config';
import { createWalletClient, http, parseEther } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

const injectiveTestnet = {
    id: 1439,
    name: 'Injective Testnet',
    rpcUrls: { default: { http: ['https://k8s.testnet.json-rpc.injective.network/'] } }
};

async function sendFunds() {
    const account = privateKeyToAccount(`0x${process.env.PRIVATE_KEY}`);
    const walletClient = createWalletClient({
        account,
        chain: injectiveTestnet,
        transport: http('https://k8s.testnet.json-rpc.injective.network/')
    });

    // Current NFTRewardPool address
    const contractAddress = '0x76081dc52b8a016afa899b0d69b7654d19cf5cbd';
    
    console.log('Sending 0.3 INJ to NFTRewardPool contract...');
    console.log('Contract:', contractAddress);
    
    const hash = await walletClient.sendTransaction({
        to: contractAddress,
        value: parseEther('0.3')
    });
    
    console.log('✅ Transaction sent! Hash:', hash);
    console.log('🔗 View transaction:', `https://testnet.blockscout.injective.network/tx/${hash}`);
    console.log('📄 View contract:', `https://testnet.blockscout.injective.network/address/${contractAddress}`);
    console.log('\nPlease wait a few minutes for confirmation, then try the demo button again.');
}

sendFunds().catch(console.error); 