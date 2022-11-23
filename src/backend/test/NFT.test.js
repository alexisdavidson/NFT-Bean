const { expect } = require("chai")

const toWei = (num) => ethers.utils.parseEther(num.toString())
const fromWei = (num) => ethers.utils.formatEther(num)

describe("NFT", async function() {
    let deployer, addr1, addr2, nft, token
    let teamWallet = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
    let whitelist = []

    beforeEach(async function() {
        // Get contract factories
        const NFT = await ethers.getContractFactory("NFT");
        const Token = await ethers.getContractFactory("Token");

        // Get signers
        [deployer, addr1, addr2] = await ethers.getSigners();
        whitelist = [addr1.address, addr2.address]

        const subscriptionId = 473; // mainnet

        // Deploy contracts
        token = await Token.deploy([teamWallet]);
        nft = await NFT.deploy(token.address, subscriptionId);
    });

    describe("Deployment", function() {
        it("Should track name and symbol of the nft collection", async function() {
            expect(await nft.name()).to.equal("Old Farm Man")
            expect(await nft.symbol()).to.equal("OFM")
        })
    })

    describe("Initialize arrays", function() {
        it("Should initialize arrays correctly", async function() {
            await nft.initializeTokens(1000);
            expect(await nft.getTokensInitializedCount()).to.equal(1000);
            expect(await nft.getAvailableTokensCount()).to.equal(1000);

            await nft.initializeTokens(1000);
            expect(await nft.getTokensInitializedCount()).to.equal(2000);
            expect(await nft.getAvailableTokensCount()).to.equal(2000);

            await nft.initializeTokens(3000);
            expect(await nft.getTokensInitializedCount()).to.equal(5000);
            expect(await nft.getAvailableTokensCount()).to.equal(5000);

            await expect(nft.initializeTokens(1)).to.be.revertedWith('Cannot initialize more tokens than the max_supply');
            
        })
    })

    describe("Aidrop NFTs", function() {
        it("Should track each airdop NFT", async function() {
            // addr1 airdrops an nft
            await nft.airdrop(addr1.address, 1);
            expect(await nft.balanceOf(addr1.address)).to.equal(1);
        })
    })

    describe("Redeem NFTs", function() {
        it("Should track each redeemed NFT", async function() {
            // addr1 airdrops an nft
            await nft.airdrop(addr1.address, 1);
            expect(await nft.balanceOf(addr1.address)).to.equal(1);

            await nft.airdrop(addr2.address, 5);
            expect(await nft.balanceOf(addr2.address)).to.equal(1);
            
            await nft.connect(addr1).redeemAndBurn(1);
            expect(await nft.balanceOf(addr1.address)).to.equal(0);
            
            await nft.connect(addr2).redeemAndBurn(5);
            expect(await nft.balanceOf(addr2.address)).to.equal(0);

            expect(await nft.getRedeemedTokensUser()).to.have.all.members([addr1.address, addr2.address]);
            expect(await nft.getRedeemedTokensTokenId()).to.have.all.members([1, 5]);
        })
    })
})