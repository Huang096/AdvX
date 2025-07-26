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
    console.log('--- NFTRewardPool Deployment Script for Injective Testnet ---');

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
    if (balance === 0n) {
        console.error('\n❌ Error: Your deployment wallet has no INJ. Please use the faucet before deploying.');
        return;
    }

    // 2. Load existing addresses from config
    const configPath = path.resolve(__dirname, 'src', 'contract', 'config.json');
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    const petNftAddress = config.petNftAddress;
    
    console.log(`\nUsing existing SimplePetNFT address: ${petNftAddress}`);

    // 3. Deploy NFTRewardPool contract
    console.log('\nDeploying NFTRewardPool contract...');
    const nftRewardPoolArtifact = loadContractArtifact('NFTRewardPool');
    const nftRewardPoolHash = await walletClient.deployContract({
        abi: nftRewardPoolArtifact.abi,
        bytecode: `0x${nftRewardPoolArtifact.bytecode}`,
        args: [petNftAddress], // Pass the NFT contract address as constructor argument
    });
    console.log(`  -> Deployment transaction sent. Hash: ${nftRewardPoolHash}`);
    console.log(`  -> Waiting for transaction confirmation...`);
    const nftRewardPoolReceipt = await publicClient.waitForTransactionReceipt({ 
        hash: nftRewardPoolHash,
        timeout: 120000 // 2 minutes timeout
    });
    const nftRewardPoolAddress = nftRewardPoolReceipt.contractAddress;
    if (!nftRewardPoolAddress) {
        throw new Error('Failed to deploy NFTRewardPool contract.');
    }
    console.log(`✅ NFTRewardPool contract deployed successfully at: ${nftRewardPoolAddress}`);
    console.log(`   View on Injective Explorer: ${injectiveTestnet.blockExplorers.default.url}/address/${nftRewardPoolAddress}`);

    // 4. Update config with new address
    config.demoRewardPoolAddress = nftRewardPoolAddress;
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log(`\n✅ Configuration updated with new DemoRewardPool address: ${nftRewardPoolAddress}`);
}

main().catch((error) => {
    console.error('\n❌ Deployment failed:', error);
    process.exit(1);
}); 