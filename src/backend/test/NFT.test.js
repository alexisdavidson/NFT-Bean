const { expect } = require("chai")

const toWei = (num) => ethers.utils.parseEther(num.toString())
const fromWei = (num) => ethers.utils.formatEther(num)

describe("NFT", async function() {
    let deployer, addr1, addr2, nft
    let teamWallet = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
    let whitelist = []
    let price = 0.006

    beforeEach(async function() {
        // Get contract factories
        const NFT = await ethers.getContractFactory("NFT");

        // Get signers
        [deployer, addr1, addr2] = await ethers.getSigners();
        whitelist = [addr1.address, addr2.address]

        // Deploy contracts
        nft = await NFT.deploy();
    });

    describe("Deployment", function() {
        it("Should track name and symbol of the nft collection", async function() {
            expect(await nft.name()).to.equal("Bean")
            expect(await nft.symbol()).to.equal("BB")
        })
    })

    describe("Mint", function() {
        it("Should mint NFTs correctly", async function() {
            await expect(nft.connect(addr1).mint(1, { value: toWei(price)})).to.be.revertedWith('Minting is not enabled');
            await nft.connect(deployer).setMintEnabled(true);

            await expect(nft.connect(addr1).mint(3, { value: toWei(price * 3)})).to.be.revertedWith('Each address may only mint x NFTs!');
            await expect(nft.connect(addr1).mint(10000, { value: toWei(price)})).to.be.revertedWith('Cannot mint more than max supply');
            await expect(nft.connect(addr1).mint(1)).to.be.revertedWith('Not enough ETH sent; check price!');

            await nft.connect(addr1).mint(1, { value: toWei(price)});
            expect(await nft.balanceOf(addr1.address)).to.equal(1);

        })
    })
})