// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "erc721a/contracts/ERC721A.sol";
import {DefaultOperatorFilterer} from "./DefaultOperatorFilterer.sol";

contract NFT is Ownable, ERC721A, DefaultOperatorFilterer {
    string public uriPrefix = '';
    string public uriSuffix = '.json';
    uint256 public max_supply = 5000;
    address private plantingAddress;

    uint256 public amountMintPerAccount = 2;
    bool public mintEnabled;
    uint256 public price = 0.08 ether;

    mapping(address => uint256[]) tokenIdsByAddress;

    event MintSuccessful(address user);

    constructor() ERC721A("Beanstalker", "BEAN") { }

    function mint(uint256 quantity) external payable {
        require(mintEnabled, 'Minting is not enabled');
        require(totalSupply() + quantity < max_supply, 'Cannot mint more than max supply');
        require(balanceOf(msg.sender) + quantity <= amountMintPerAccount, 'Each address may only mint x NFTs!');
        require(msg.value >= getPrice() * quantity, "Not enough ETH sent; check price!");
        
        uint256 _nextTokenId = totalSupply() + 1;
        for(uint256 i = 0; i < quantity;) {
            tokenIdsByAddress[msg.sender].push(_nextTokenId + i);
            unchecked { ++i; }
        }

        _mint(msg.sender, quantity);

        emit MintSuccessful(msg.sender);
    }

    function tokenURI(uint256 _tokenId) public view virtual override returns (string memory) {
        require(_exists(_tokenId), 'ERC721Metadata: URI query for nonexistent token');

        string memory currentBaseURI = _baseURI();
        return bytes(currentBaseURI).length > 0
            ? string(abi.encodePacked(currentBaseURI, Strings.toString(_tokenId), uriSuffix))
            : '';
    }

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://QmZnXGbXgpBNjAJaaaoWsH5VYoTNkVgpVmbpgFXnTUyQ5d/";
    }
    
    function baseTokenURI() public pure returns (string memory) {
        return _baseURI();
    }

    function contractURI() public pure returns (string memory) {
        return "ipfs://QmQyzT57qahsGY2qp6fZ3G1TEUzciDmA7xcPaiyS1QswLr/";
    }

    function setAmountMintPerAccount(uint _amountMintPerAccount) public onlyOwner {
        amountMintPerAccount = _amountMintPerAccount;
    }

    function getPrice() view public returns(uint) {
        return price;
    }

    function setPrice(uint _price) public onlyOwner {
        price = _price;
    }

    function setMintEnabled(bool _state) public onlyOwner {
        mintEnabled = _state;
    }

    function transferFrom(address from, address to, uint256 tokenId) public override onlyAllowedOperator(from) {
        super.transferFrom(from, to, tokenId);
    }

    function safeTransferFrom(address from, address to, uint256 tokenId) public override onlyAllowedOperator(from) {
        super.safeTransferFrom(from, to, tokenId);
    }

    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data)
        public
        override
        onlyAllowedOperator(from)
    {
        super.safeTransferFrom(from, to, tokenId, data);
    }
    
    function withdraw() external onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }
    
    function _startTokenId() internal view override returns (uint256) {
        return 1;
    }

    function setPlantingAddress(address _address) public onlyOwner {
        plantingAddress = _address;
    }

    function burn(uint256 _tokenId) public {
        require(plantingAddress == msg.sender, "You don't have the right to burn this NFT");
        require(tokenIdsByAddress[msg.sender].length > 0, "This user doesn't own any NFT");
        
        address _nftOwner = ownerOf(_tokenId);
        uint256 _tokenIndex = 0;
        bool _tokenFound;
        for(uint256 i = 0; i < tokenIdsByAddress[msg.sender].length;) {
            if (tokenIdsByAddress[msg.sender][i] == _tokenId) {
                _tokenIndex = i;
                _tokenFound = true;
            }
            unchecked { ++i; }
        }

        require(_tokenFound, "This NFT is not listed for this user");

        tokenIdsByAddress[msg.sender][0] = tokenIdsByAddress[msg.sender][_tokenIndex];
        tokenIdsByAddress[msg.sender].pop();

        _burn(_tokenId);
    }

    function getTokenIdsByAddress(address _address) public view returns(uint256[] memory) {
        return tokenIdsByAddress[_address];
    }
}
