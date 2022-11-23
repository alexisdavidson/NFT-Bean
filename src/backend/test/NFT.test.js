const { expect } = require("chai")
const helpers = require("@nomicfoundation/hardhat-network-helpers")

const toWei = (num) => ethers.utils.parseEther(num.toString())
const fromWei = (num) => parseInt(ethers.utils.formatEther(num))

describe("NFT & Planting", async function() {
    let deployer, addr1, addr2, nft
    let teamWallet = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
    let whitelist = []
    let price = 0.006

    beforeEach(async function() {
        // Get contract factories
        const NFT = await ethers.getContractFactory("NFT");
        const Planting = await ethers.getContractFactory("Planting");

        // Get signers
        [deployer, addr1, addr2, addr3] = await ethers.getSigners();
        whitelist = [addr1.address, addr2.address, addr3.address]

        // Deploy contracts
        nft = await NFT.deploy();
        planting = await Planting.deploy();
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

            await nft.connect(addr2).mint(2, { value: toWei(price * 2)});
            expect(await nft.balanceOf(addr2.address)).to.equal(2);

            await expect(nft.connect(addr3).mint(3, { value: toWei(price * 3)})).to.be.revertedWith('Each address may only mint x NFTs!');
        })
        it("Should perform owner functions", async function() {
            let newAmountMintPerAccount = 10
            let newPrice = 0

            await expect(nft.connect(addr1).setMintEnabled(true)).to.be.revertedWith('Ownable: caller is not the owner');
            await expect(nft.connect(addr1).setAmountMintPerAccount(newAmountMintPerAccount)).to.be.revertedWith('Ownable: caller is not the owner');
            await expect(nft.connect(addr1).setPrice(newPrice)).to.be.revertedWith('Ownable: caller is not the owner');
            await expect(nft.connect(addr1).withdraw()).to.be.revertedWith('Ownable: caller is not the owner');
            
            await nft.connect(deployer).setAmountMintPerAccount(newAmountMintPerAccount);
            expect(await nft.amountMintPerAccount()).to.equal(newAmountMintPerAccount);
            await nft.connect(deployer).setPrice(newPrice);
            expect(await nft.getPrice()).to.equal(newPrice);
        })
    })

    describe("Planting Deployment", function() {
        it("Should track the different initialized phases", async function() {
            expect(parseInt(await planting.phaseDuration(0))).to.equal(0)
            expect(parseInt(await planting.phaseDuration(1))).to.equal(4 * 3600)
            expect(parseInt(await planting.phaseDuration(2))).to.equal(18 * 3600)
            expect(parseInt(await planting.phaseDuration(3))).to.equal(48 * 3600)
            expect(parseInt(await planting.phaseDuration(4))).to.equal(96 * 3600)
        })

        it("Should plant through different phases", async function() {
            let currentPlant = await planting.getPlant(addr1.address)
            expect(currentPlant.phase).to.equal(0)
            expect(currentPlant.timestampPhaseStarted).to.equal(0)
            expect(await planting.currentPhaseFinished(addr1.address)).to.equal(true)

            // 1st plant
            await planting.connect(addr1).plant()
            currentPlant = await planting.getPlant(addr1.address)
            let currentTimestamp = await helpers.time.latest()
            expect(currentPlant.phase).to.equal(1)
            expect(currentPlant.timestampPhaseStarted).to.equal(currentTimestamp)
            expect(await planting.currentPhaseFinished(addr1.address)).to.equal(false)
            
            await helpers.time.increase(3 * 3600);
            expect(await planting.currentPhaseFinished(addr1.address)).to.equal(false)
            await expect(planting.connect(addr1).plant()).to.be.revertedWith('The current growing phase of your plant is not finished yet!');
            await helpers.time.increase(1 * 3600);
            expect(await planting.currentPhaseFinished(addr1.address)).to.equal(true)
            
            // 2nd plant
            await planting.connect(addr1).plant()
            currentPlant = await planting.getPlant(addr1.address)
            currentTimestamp = await helpers.time.latest()
            expect(currentPlant.phase).to.equal(2)
            expect(currentPlant.timestampPhaseStarted).to.equal(currentTimestamp)
            expect(await planting.currentPhaseFinished(addr1.address)).to.equal(false)
            
            await helpers.time.increase(17 * 3600);
            expect(await planting.currentPhaseFinished(addr1.address)).to.equal(false)
            await expect(planting.connect(addr1).plant()).to.be.revertedWith('The current growing phase of your plant is not finished yet!');
            await helpers.time.increase(1 * 3600);
            expect(await planting.currentPhaseFinished(addr1.address)).to.equal(true)

            // 3rd plant
            await planting.connect(addr1).plant()
            currentPlant = await planting.getPlant(addr1.address)
            currentTimestamp = await helpers.time.latest()
            expect(currentPlant.phase).to.equal(3)
            expect(currentPlant.timestampPhaseStarted).to.equal(currentTimestamp)
            expect(await planting.currentPhaseFinished(addr1.address)).to.equal(false)
            
            await helpers.time.increase(47 * 3600);
            expect(await planting.currentPhaseFinished(addr1.address)).to.equal(false)
            await expect(planting.connect(addr1).plant()).to.be.revertedWith('The current growing phase of your plant is not finished yet!');
            await helpers.time.increase(1 * 3600);
            expect(await planting.currentPhaseFinished(addr1.address)).to.equal(true)

            // 4th plant
            await planting.connect(addr1).plant()
            currentPlant = await planting.getPlant(addr1.address)
            currentTimestamp = await helpers.time.latest()
            expect(currentPlant.phase).to.equal(4)
            expect(currentPlant.timestampPhaseStarted).to.equal(currentTimestamp)
            expect(await planting.currentPhaseFinished(addr1.address)).to.equal(false)
            
            await helpers.time.increase(95 * 3600);
            expect(await planting.currentPhaseFinished(addr1.address)).to.equal(false)
            await expect(planting.connect(addr1).plant()).to.be.revertedWith('The current growing phase of your plant is not finished yet!');
            await helpers.time.increase(1 * 3600);
            expect(await planting.currentPhaseFinished(addr1.address)).to.equal(true)

            // 5th plant
            await expect(planting.connect(addr1).plant()).to.be.revertedWith('Your plant already reached maximum growth!');
            
        })
    })
})