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
const rpcUrl = process.env.INJECTIVE_TESTNET_RPC_URL; // Use the Injective Testnet RPC URL

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
    console.log('--- Contract Deployment Script for Injective Testnet ---');

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

    // 2. Load contract artifacts
    console.log('\nLoading contract artifacts...');
    const simplePetNFTArtifact = loadContractArtifact('SimplePetNFT');
    const rewardPoolArtifact = loadContractArtifact('RewardPool');
    const demoRewardPoolArtifact = loadContractArtifact('DemoRewardPool'); // Load the new artifact
    console.log('Artifacts loaded successfully.');

    // 3. Deploy SimplePetNFT contract
    console.log('\nDeploying SimplePetNFT contract...');
    const petNftHash = await walletClient.deployContract({
        abi: simplePetNFTArtifact.abi,
        bytecode: `0x${simplePetNFTArtifact.bytecode}`,
        args: [deployerAddress], // The owner of the NFT contract will be the deployer
    });
    console.log(`  -> Deployment transaction sent. Hash: ${petNftHash}`);
    const petNftReceipt = await publicClient.waitForTransactionReceipt({ hash: petNftHash });
    const petNftAddress = petNftReceipt.contractAddress;
    if (!petNftAddress) {
        throw new Error('Failed to deploy SimplePetNFT contract.');
    }
    console.log(`✅ SimplePetNFT contract deployed successfully at: ${petNftAddress}`);
    console.log(`   View on Injective Explorer: ${injectiveTestnet.blockExplorers.default.url}/address/${petNftAddress}`);

    // 4. Deploy RewardPool contract
    console.log('\nDeploying RewardPool contract...');
    const rewardPoolHash = await walletClient.deployContract({
        abi: rewardPoolArtifact.abi,
        bytecode: `0x${rewardPoolArtifact.bytecode}`,
        args: [petNftAddress], // Pass the newly deployed NFT contract address to the constructor
    });
    console.log(`  -> Deployment transaction sent. Hash: ${rewardPoolHash}`);
    const rewardPoolReceipt = await publicClient.waitForTransactionReceipt({ hash: rewardPoolHash });
    const rewardPoolAddress = rewardPoolReceipt.contractAddress;
    if (!rewardPoolAddress) {
        throw new Error('Failed to deploy RewardPool contract.');
    }
    console.log(`✅ RewardPool contract deployed successfully at: ${rewardPoolAddress}`);
    console.log(`   View on Injective Explorer: ${injectiveTestnet.blockExplorers.default.url}/address/${rewardPoolAddress}`);

    // 5. Deploy DemoRewardPool contract
    console.log('\nDeploying DemoRewardPool contract...');
    const demoRewardPoolHash = await walletClient.deployContract({
        abi: demoRewardPoolArtifact.abi,
        bytecode: `0x${demoRewardPoolArtifact.bytecode}`,
        args: [], // No constructor arguments needed for this contract
    });
    console.log(`  -> Deployment transaction sent. Hash: ${demoRewardPoolHash}`);
    const demoRewardPoolReceipt = await publicClient.waitForTransactionReceipt({ hash: demoRewardPoolHash });
    const demoRewardPoolAddress = demoRewardPoolReceipt.contractAddress;
    if (!demoRewardPoolAddress) {
        throw new Error('Failed to deploy DemoRewardPool contract.');
    }
    console.log(`✅ DemoRewardPool contract deployed successfully at: ${demoRewardPoolAddress}`);
    console.log(`   View on Injective Explorer: ${injectiveTestnet.blockExplorers.default.url}/address/${demoRewardPoolAddress}`);


    console.log('\n\n--- Deployment Summary ---');
    console.log('SimplePetNFT Address:    ', petNftAddress);
    console.log('RewardPool Address:      ', rewardPoolAddress);
    console.log('DemoRewardPool Address:  ', demoRewardPoolAddress); // Add to summary
    console.log('--------------------------\n');

    // 6. Save deployed addresses to a config file for frontend use
    const config = {
        petNftAddress,
        rewardPoolAddress,
        demoRewardPoolAddress, // Add the new address to the config
        injective_testnet_rpc_url: rpcUrl,
        // Add other relevant info if needed
    };
    const configPath = path.resolve(__dirname, 'src', 'contract', 'config.json');
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log(`Deployment configuration saved to: ${configPath}`);
}

main().catch((error) => {
    console.error('\n❌ Deployment failed:', error);
    process.exit(1);
}); 