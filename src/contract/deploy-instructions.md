# 🚀 Injective EVM 测试网 NFT 合约部署指南

## 📋 前置准备

1. **获取测试币**
   - 访问 [Injective 测试网水龙头](https://testnet.faucet.injective.network/)
   - 连接你的钱包并获取测试 INJ 代币

2. **安装 Hardhat（推荐）**
   ```bash
   npm install --save-dev hardhat @openzeppelin/contracts
   ```

## 🔧 快速部署方法

### 方法一：使用 Remix IDE（推荐新手）

1. **打开 Remix IDE**
   - 访问 [https://remix.ethereum.org/](https://remix.ethereum.org/)

2. **创建合约文件**
   - 在 `contracts` 文件夹中创建 `SimpleNFT.sol`
   - 复制 `SimpleNFT.sol` 中的代码

3. **编译合约**
   - 在 "Solidity Compiler" 选项卡中
   - 选择 Solidity 版本 `0.8.20` 或更高
   - 点击 "Compile SimpleNFT.sol"

4. **连接到 Injective EVM 测试网**
   - 在 "Deploy & Run Transactions" 选项卡中
   - Environment 选择 "Injected Provider - MetaMask"
   - 确保 MetaMask 连接到 Injective EVM 测试网：
     - 网络名称: Injective EVM Testnet
     - RPC URL: https://k8s.testnet.json-rpc.injective.network/
     - Chain ID: 1439
     - 符号: INJ
     - 区块浏览器: https://testnet.blockscout.injective.network/

5. **部署合约**
   - 选择 `SimpleNFT` 合约
   - 点击 "Deploy"
   - 确认 MetaMask 交易

6. **获取合约地址**
   - 部署成功后，复制合约地址
   - 更新 `src/contract/nftContract.js` 中的 `NFT_CONTRACT_ADDRESS`

### 方法二：使用 Hardhat

1. **初始化 Hardhat 项目**
   ```bash
   mkdir nft-deployment
   cd nft-deployment
   npx hardhat init
   ```

2. **安装依赖**
   ```bash
   npm install @openzeppelin/contracts
   ```

3. **配置 Hardhat**
   创建 `hardhat.config.js`:
   ```javascript
   require("@nomicfoundation/hardhat-toolbox");

   module.exports = {
     solidity: "0.8.20",
     networks: {
       injectiveTestnet: {
         url: "https://k8s.testnet.json-rpc.injective.network/",
         accounts: ["YOUR_PRIVATE_KEY"], // 替换为你的私钥
         chainId: 1439,
       }
     }
   };
   ```

4. **创建部署脚本**
   在 `scripts/deploy.js`:
   ```javascript
   const hre = require("hardhat");

   async function main() {
     const SimpleNFT = await hre.ethers.getContractFactory("SimpleNFT");
     const nft = await SimpleNFT.deploy();
     await nft.deployed();

     console.log("SimpleNFT deployed to:", nft.address);
   }

   main().catch((error) => {
     console.error(error);
     process.exitCode = 1;
   });
   ```

5. **部署合约**
   ```bash
   npx hardhat run scripts/deploy.js --network injectiveTestnet
   ```

## 📝 部署后步骤

1. **更新合约地址**
   - 复制部署后的合约地址
   - 在 `src/contract/nftContract.js` 中替换 `NFT_CONTRACT_ADDRESS`

2. **验证合约（可选）**
   - 访问 [Injective 测试网浏览器](https://testnet.blockscout.injective.network/)
   - 搜索你的合约地址
   - 可以在浏览器中验证合约源码

## 🎨 测试 NFT 铸造

1. **连接钱包到前端**
   - 确保 MetaMask 连接到 Injective EVM 测试网
   - 在前端点击连接钱包

2. **铸造 NFT**
   - 在领养方主页点击 "铸造新 NFT"
   - 填写 NFT 信息
   - 点击铸造并确认交易

## 🔍 故障排除

**常见问题：**

1. **Gas 费用不足**
   - 确保钱包有足够的测试 INJ 代币
   - 从水龙头获取更多测试币

2. **网络连接问题**
   - 检查 MetaMask 是否连接到正确的网络
   - 确认 RPC URL 和 Chain ID 正确

3. **合约交互失败**
   - 确认合约地址已正确更新
   - 检查合约是否成功部署

## 📚 有用链接

- [Injective 测试网水龙头](https://testnet.faucet.injective.network/)
- [Injective 测试网浏览器](https://testnet.blockscout.injective.network/)
- [Remix IDE](https://remix.ethereum.org/)
- [OpenZeppelin 文档](https://docs.openzeppelin.com/)
- [Hardhat 文档](https://hardhat.org/docs)

## ⚡ 快速开始模板

```solidity
// 最简单的NFT合约模板
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract QuickNFT is ERC721 {
    uint256 public tokenCounter;
    
    constructor() ERC721("Quick NFT", "QNFT") {
        tokenCounter = 0;
    }
    
    function mint() public returns (uint256) {
        uint256 newTokenId = tokenCounter;
        _safeMint(msg.sender, newTokenId);
        tokenCounter++;
        return newTokenId;
    }
}
```

这个模板更简单，可以作为快速测试使用。 