// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SimplePetNFT
 * @dev 一个为宠物领养平台设计的简单、清晰的 ERC721 NFT 合约。
 * 兼容 OpenZeppelin 5.0+
 */
contract SimplePetNFT is ERC721, ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    // 在部署时，将合约的创建者设置为所有者
    constructor(address initialOwner)
        ERC721("Pet Adoption NFT", "PET")
        Ownable(initialOwner)
    {}

    /**
     * @dev 铸造一个新的 NFT。
     * 为简单起见，此函数是公开的，任何人都可以调用。
     * @param to 接收新铸造的 NFT 的地址。
     * @param uri 新 NFT 的元数据 URI。
     * @return 新铸造的代币的 ID。
     */
    function mint(address to, string memory uri) public returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _mint(to, tokenId);
        _setTokenURI(tokenId, uri);
        return tokenId;
    }

    /**
     * @dev 批量铸造 NFT (仅限合约所有者)。
     * @param to 接收新铸造的 NFT 的地址。
     * @param baseURI NFT 元数据的基础 URI，tokenId 将被附加在后面。
     * @param quantity 要铸造的 NFT 数量。
     */
    function batchMint(address to, string memory baseURI, uint256 quantity) public onlyOwner {
        for (uint256 i = 0; i < quantity; i++) {
            uint256 tokenId = _nextTokenId++;
            _mint(to, tokenId);
            // 注意：为了区分每个 NFT，我们在这里没有设置 tokenURI。
            // 实际应用中，您可以在前端生成多个唯一的 URI 或在链上拼接。
            // 为简单起见，我们暂时留空，依赖前端来处理元数据。
        }
    }

    /**
     * @dev 返回已铸造的代币总数。
     */
    function totalSupply() public view returns (uint256) {
        return _nextTokenId;
    }

    // --- 以下是 Solidity 要求的重写函数 ---

    /**
     * @dev See {IERC721-tokenURI}.
     */
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
} 