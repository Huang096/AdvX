import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { createPublicClient, createWalletClient, http, defineChain } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

// Import ABI and contract addresses from build artifacts
import RewardPool from './../src/contract/build/RewardPool.json' with { type: 'json' };
import contractConfig from './../src/contract/config.json' with { type: 'json' };

// --- Custom Chain Definition for Injective Testnet (same as deploy script) ---
const injectiveTestnet = defineChain({
    id: 1439,
    name: 'Injective Testnet',
    nativeCurrency: { name: 'Injective', symbol: 'INJ', decimals: 18 },
    rpcUrls: { default: { http: ['https://k8s.testnet.json-rpc.injective.network/'] } },
    blockExplorers: { default: { name: 'Injective Explorer', url: 'https://testnet.blockscout.injective.network' } },
    testnet: true,
});

// --- Configuration ---
const __dirname = path.resolve(path.dirname(''));
const privateKey = process.env.PRIVATE_KEY;
const rpcUrl = process.env.INJECTIVE_TESTNET_RPC_URL;

if (!privateKey || !rpcUrl) {
    throw new Error('PRIVATE_KEY and INJECTIVE_TESTNET_RPC_URL must be set in your .env file');
}

// --- Helper function to load scores ---
function loadScores() {
    try {
        const filePath = path.resolve(__dirname, 'scores.json');
        if (!fs.existsSync(filePath)) {
            throw new Error('scores.json not found. Please create it by copying scores.json.example');
        }
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        if (!Array.isArray(data) || data.length === 0) {
            throw new Error('scores.json is empty or not a valid array.');
        }
        const nftIds = data.map(item => BigInt(item.nftId));
        const scores = data.map(item => BigInt(item.score));
        return { nftIds, scores };
    } catch (e) {
        console.error(`Error loading scores.json:`, e.message);
        throw e;
    }
}

async function main() {
    console.log('--- Admin Script: Starting a New Reward Cycle ---');

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
    const [adminAddress] = await walletClient.getAddresses();
    console.log(`\nUsing Admin Wallet: ${adminAddress}`);

    // 2. Load scores from JSON file
    console.log('Loading scores from scores.json...');
    const { nftIds, scores } = loadScores();
    console.log(`  -> Found ${nftIds.length} score entries.`);
    
    // 3. Call the startNewCycleWithScores function
    console.log('\nCalling startNewCycleWithScores on RewardPool contract...');
    console.log(`  -> Contract: ${contractConfig.rewardPoolAddress}`);
    
    const hash = await walletClient.writeContract({
        address: contractConfig.rewardPoolAddress,
        abi: RewardPool.abi,
        functionName: 'startNewCycleWithScores',
        args: [nftIds, scores],
    });

    console.log(`  -> Transaction sent. Hash: ${hash}`);
    console.log('Waiting for transaction confirmation...');

    const receipt = await publicClient.waitForTransactionReceipt({ hash });

    if (receipt.status === 'success') {
        console.log('\n✅ New reward cycle started successfully!');
        console.log(`   View on Injective Explorer: ${injectiveTestnet.blockExplorers.default.url}/tx/${hash}`);
    } else {
        console.error('\n❌ Transaction failed!');
        console.log(`   Receipt:`, receipt);
    }
}

main().catch((error) => {
    console.error('\n❌ Script failed:', error.shortMessage || error.message);
    process.exit(1);
}); 