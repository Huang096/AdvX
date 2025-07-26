import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { createPublicClient, createWalletClient, http, defineChain } from 'viem';
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
const BUILD_DIR = path.resolve(__dirname, 'src', 'contract', 'build');

const privateKey = process.env.PRIVATE_KEY;
const rpcUrl = process.env.INJECTIVE_TESTNET_RPC_URL;

if (!privateKey || !rpcUrl) {
    throw new Error('PRIVATE_KEY and INJECTIVE_TESTNET_RPC_URL must be set in your .env file');
}

// --- Helper function to load contract artifacts ---
function loadContractArtifact(name) {
    try {
        const filePath = path.resolve(BUILD_DIR, `${name}.json`);
        const artifact = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        return {
            abi: artifact.abi,
            bytecode: artifact.bytecode,
        };
    } catch (e) {
        console.error(`Error loading artifact for ${name}:`, e.message);
        throw e;
    }
}

async function main() {
    console.log('--- RewardPool Deployment Script for Injective Testnet ---');

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

    // 2. Deploy RewardPool contract
    console.log('\nDeploying RewardPool contract...');
    const rewardPoolArtifact = loadContractArtifact('RewardPool');
    const rewardPoolHash = await walletClient.deployContract({
        abi: rewardPoolArtifact.abi,
        bytecode: `0x${rewardPoolArtifact.bytecode}`,
        args: [], // No constructor arguments needed
    });
    console.log(`  -> Deployment transaction sent. Hash: ${rewardPoolHash}`);
    console.log(`  -> Waiting for transaction confirmation...`);
    
    const rewardPoolReceipt = await publicClient.waitForTransactionReceipt({ 
        hash: rewardPoolHash,
        timeout: 120000 // 2 minutes timeout
    });
    const rewardPoolAddress = rewardPoolReceipt.contractAddress;
    
    if (!rewardPoolAddress) {
        throw new Error('Failed to deploy RewardPool contract.');
    }
    console.log(`✅ RewardPool contract deployed successfully at: ${rewardPoolAddress}`);
    console.log(`   View on Injective Explorer: ${injectiveTestnet.blockExplorers.default.url}/address/${rewardPoolAddress}`);

    // 3. Update config with new address
    const configPath = path.resolve(__dirname, 'src', 'contract', 'config.json');
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    config.rewardPoolAddress = rewardPoolAddress;
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log(`\n✅ Configuration updated with new RewardPool address: ${rewardPoolAddress}`);
}

main().catch((error) => {
    console.error('\n❌ Deployment failed:', error);
    process.exit(1);
});