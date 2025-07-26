// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract SimplePetNFT is ERC721, ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    constructor(address initialOwner)
        ERC721("Pet Adoption NFT", "PET")
        Ownable(initialOwner)
    {}

    /**
     * @dev Mints a new NFT with a specific URI.
     * @param to The address to receive the newly minted NFT.
     * @param uri The metadata URI for the new NFT. This should be a link (e.g., to IPFS).
     * @return The ID of the newly minted token.
     */
    function mint(address to, string memory uri) public returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _mint(to, tokenId);
        _setTokenURI(tokenId, uri);
        return tokenId;
    }

    /**
     * @dev Returns the total number of tokens minted so far.
     */
    function totalSupply() public view returns (uint256) {
        return _nextTokenId;
    }

    // The following functions are overrides required by Solidity.

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
} 