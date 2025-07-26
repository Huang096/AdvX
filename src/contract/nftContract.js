// 兼容 OpenZeppelin 5.0+
export const NFT_ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "initialOwner", "type": "address" }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "to", "type": "address" },
      { "internalType": "string", "name": "uri", "type": "string" }
    ],
    "name": "mint",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "to", "type": "address" },
      { "internalType": "string", "name": "baseURI", "type": "string" },
      { "internalType": "uint256", "name": "quantity", "type": "uint256" }
    ],
    "name": "batchMint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
    "name": "tokenURI",
    "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
    "name": "ownerOf",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  }
];

// 部署合约后请替换这个地址
export const NFT_CONTRACT_ADDRESS = "0x89324a04533925f36ba4d21396b42a9b2bc09f4f"; // <-- 已转换为全小写以绕过校验问题

// 简单的 NFT 元数据模板
export const createNFTMetadata = (name, description, imageUrl) => ({
  name,
  description,
  image: imageUrl,
  attributes: [
    {
      trait_type: "Type",
      value: "Pet Adoption NFT"
    },
    {
      trait_type: "Created",
      value: new Date().toISOString()
    }
  ]
});

// Injective EVM 测试网配置
export const INJECTIVE_TESTNET = {
  chainId: 1439,
  name: 'Injective EVM Testnet',
  rpcUrl: 'https://k8s.testnet.json-rpc.injective.network/',
  explorerUrl: 'https://testnet.blockscout.injective.network/',
  faucetUrl: 'https://testnet.faucet.injective.network/'
}; 