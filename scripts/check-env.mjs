import 'dotenv/config';

console.log('--- Checking Environment Variables ---');
console.log('Attempting to read from .env file in the current directory...');

const privateKey = process.env.PRIVATE_KEY;
const rpcUrl = process.env.INJECTIVE_TESTNET_RPC_URL;

// For security, we will only show the length of the private key, not its value.
console.log(`\nFound PRIVATE_KEY: ${privateKey ? `A value of length ${privateKey.length}` : 'undefined'}`);
console.log(`Found INJECTIVE_TESTNET_RPC_URL: ${rpcUrl ? rpcUrl : 'undefined'}`);

if (!privateKey || !rpcUrl) {
    console.error('\n[Error] One or more environment variables are missing.');
    console.log('Please re-check the following:');
    console.log('1. Is the .env file in the project root directory (the same directory as package.json)?');
    console.log('2. Is the filename exactly ".env" and not ".env.txt"?');
    console.log('3. Are the variable names EXACTLY "PRIVATE_KEY" and "INJECTIVE_TESTNET_RPC_URL" (no extra spaces)?');
} else {
    console.log('\n[Success] Both environment variables were found successfully!');
}

console.log('------------------------------------'); 