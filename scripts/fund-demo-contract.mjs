import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { createPublicClient, createWalletClient, http, defineChain, parseEther } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

// --- Custom Chain Definition for Injective Testnet ---
const injectiveTestnet = defineChain({
    id: 1439,
    name: 'Injective Testnet',
    nativeCurrency: {
        name: 'Injective',
        symbol: 'INJ',
        decimals: 18,
    },
    rpcUrls: {
        default: {
            http: ['https://k8s.testnet.json-rpc.injective.network/'],
        },
        public: {
            http: ['https://k8s.testnet.json-rpc.injective.network/'],
        },
    },
    blockExplorers: {
        default: { name: 'Injective Explorer', url: 'https://testnet.blockscout.injective.network' },
    },
    testnet: true,
});

// --- Configuration ---
const __dirname = path.resolve(path.dirname(''));
const privateKey = process.env.PRIVATE_KEY;
const rpcUrl = process.env.INJECTIVE_TESTNET_RPC_URL;

if (!privateKey || !rpcUrl) {
    throw new Error('PRIVATE_KEY and INJECTIVE_TESTNET_RPC_URL must be set in your .env file');
}

async function main() {
    console.log('--- Funding NFTRewardPool Contract ---');

    // 1. Initialize client and wallet
    const account = privateKeyToAccount(`0x${privateKey}`);
    const walletClient = createWalletClient({
        account,
        chain: injectiveTestnet,
        transport: http(rpcUrl),
    });
    const publicClient = createPublicClient({
        chain: injectiveTestnet,
        transport: http(rpcUrl),
    });

    const [deployerAddress] = await walletClient.getAddresses();
    console.log(`\nWallet Address: ${deployerAddress}`);
    const balance = await publicClient.getBalance({ address: deployerAddress });
    console.log(`Wallet Balance: ${balance / BigInt(1e18)} INJ`);
    
    // 2. Load contract address from config
    const configPath = path.resolve(__dirname, 'src', 'contract', 'config.json');
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    const nftRewardPoolAddress = config.demoRewardPoolAddress;
    
    console.log(`\nNFTRewardPool Contract Address: ${nftRewardPoolAddress}`);

    // 3. Send 0.2 INJ to the NFTRewardPool contract
    const amount = parseEther('0.2');
    console.log(`\nSending 0.2 INJ to NFTRewardPool contract...`);
    
    const hash = await walletClient.sendTransaction({
        to: nftRewardPoolAddress,
        value: amount,
    });
    
    console.log(`  -> Transaction sent. Hash: ${hash}`);
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    
    if (receipt.status === 'success') {
        console.log(`✅ Successfully sent 0.2 INJ to NFTRewardPool contract!`);
        console.log(`   View on Injective Explorer: ${injectiveTestnet.blockExplorers.default.url}/tx/${hash}`);
        
        // Check contract balance
        const contractBalance = await publicClient.getBalance({ address: nftRewardPoolAddress });
        console.log(`   Contract Balance: ${contractBalance / BigInt(1e18)} INJ`);
    } else {
        console.log('❌ Transaction failed');
    }
}

main().catch((error) => {
    console.error('\n❌ Funding failed:', error);
    process.exit(1);
}); 