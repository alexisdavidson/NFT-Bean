const { expect } = require("chai")
const helpers = require("@nomicfoundation/hardhat-network-helpers")

const toWei = (num) => ethers.utils.parseEther(num.toString())
const fromWei = (num) => parseInt(ethers.utils.formatEther(num))

describe("NFT & Planting", async function() {
    let deployer, addr1, addr2, nft, planting, nftGoose, tokenEgg, castle
    let price = 0.01

    beforeEach(async function() {
        // Get contract factories
        const NFT = await ethers.getContractFactory("NFT");
        const Planting = await ethers.getContractFactory("Planting");
        const NFT_Goose = await ethers.getContractFactory("NFT_Goose");
        const Token_Egg = await ethers.getContractFactory("Token_Egg");
        const Castle = await ethers.getContractFactory("Castle");

        // Get signers
        [deployer, addr1, addr2, addr3] = await ethers.getSigners();
        whitelist = [addr1.address, addr2.address, addr3.address]

        // Deploy contracts
        nft = await NFT.deploy();
        planting = await Planting.deploy(nft.address);
        nft.setPlantingAddress(planting.address);

        nftGoose = await NFT_Goose.deploy();
        castle = await Castle.deploy(planting.address, nftGoose.address);
        tokenEgg = await Token_Egg.deploy(castle.address, deployer.address);
        nftGoose.setCastleAddress(castle.address);
        castle.setTokenAddress(tokenEgg.address);
    });

    describe("Deployment", function() {
        it("Should track name and symbol of the nft collection", async function() {
            expect(await nft.name()).to.equal("Beanstalker")
            expect(await nft.symbol()).to.equal("BEAN")
            expect(await nftGoose.name()).to.equal("Goose")
            expect(await nftGoose.symbol()).to.equal("GOOSE")
            expect(await tokenEgg.name()).to.equal("$TALE")
            expect(await tokenEgg.symbol()).to.equal("$TALE")
            expect(await tokenEgg.totalSupply()).to.equal(500_000)
            expect(await tokenEgg.balanceOf(deployer.address)).to.equal(495_000)
            expect(await tokenEgg.balanceOf(castle.address)).to.equal(5_000)
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
            expect(await nft.totalSupply()).to.equal(1);

            await expect(nft.connect(addr3).mint(2, { value: toWei(price * 2)})).to.be.revertedWith('Each address may only mint x NFTs!');
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
    
    describe("Castle Loot", function() {
        it("Should loot the castle", async function() {
            await expect(castle.connect(addr1).setTokenAddress(addr1.address)).to.be.revertedWith("Ownable: caller is not the owner");
            await expect(castle.connect(addr1).loot(1)).to.be.revertedWith("The user is not at the last planting phase.");
            // await expect(nftGoose.connect(addr1).mintForUser(addr1.address)).to.be.revertedWith("Only the castle can mint a Goose!");

            // Go through planting
            await nft.connect(deployer).setMintEnabled(true);
            await nft.connect(addr1).mint(1, { value: toWei(price)});
            await planting.connect(addr1).plant(1)
            await helpers.time.increase(6 * 3600);
            await planting.connect(addr1).plant(0)
            await helpers.time.increase(18 * 3600);
            await planting.connect(addr1).plant(0)
            await helpers.time.increase(48 * 3600);
            await expect(castle.connect(addr1).loot(1)).to.be.revertedWith("The user is not at the last planting phase.");
            await planting.connect(addr1).plant(0)
            await expect(castle.connect(addr1).loot(1)).to.be.revertedWith("The user has not finished its planting phase");
            await helpers.time.increase(96 * 3600);
            
            await expect(castle.connect(addr1).loot(0)).to.be.revertedWith("Invalid choice");
            await castle.connect(addr1).loot(1); // Treasure (Token)
            await expect(castle.connect(addr1).loot(1)).to.be.revertedWith("This user already looted the castle.");
            expect(await tokenEgg.balanceOf(castle.address)).to.equal(5_000 - 1)
            expect(await tokenEgg.balanceOf(addr1.address)).to.equal(1)

            // Now same but loot an NFT
            await nft.connect(addr2).mint(1, { value: toWei(price)});
            await planting.connect(addr2).plant(2)
            await helpers.time.increase(6 * 3600);
            await planting.connect(addr2).plant(0)
            await helpers.time.increase(18 * 3600);
            await planting.connect(addr2).plant(0)
            await helpers.time.increase(48 * 3600);
            await planting.connect(addr2).plant(0)
            await expect(castle.connect(addr2).loot(2)).to.be.revertedWith("The user has not finished its planting phase");
            await helpers.time.increase(96 * 3600);
            
            await castle.connect(addr2).loot(2); // Goose (NFT)
            await expect(castle.connect(addr2).loot(2)).to.be.revertedWith("This user already looted the castle.");
            expect(await tokenEgg.balanceOf(castle.address)).to.equal(5_000 - 1)
            expect(await nftGoose.ownerOf(1)).to.equal(addr2.address)
        })
    })

    describe("Planting Deployment", function() {
        it("Should track the different initialized phases", async function() {
            expect(parseInt(await planting.phaseDuration(0))).to.equal(0)
            // expect(parseInt(await planting.phaseDuration(1))).to.equal(6 * 3600)
            // expect(parseInt(await planting.phaseDuration(2))).to.equal(18 * 3600)
            // expect(parseInt(await planting.phaseDuration(3))).to.equal(48 * 3600)
            // expect(parseInt(await planting.phaseDuration(4))).to.equal(96 * 3600)
        })

        it("Should plant through different phases", async function() {
            const phaseFinishedEarly = true
            let currentPlant = await planting.getPlant(addr1.address)
            expect(currentPlant.phase).to.equal(0)
            expect(currentPlant.timestampPhaseStarted).to.equal(0)
            expect(await planting.currentPhaseFinished(addr1.address)).to.equal(true)
            await nft.connect(deployer).setMintEnabled(true);

            // 1st plant
            await nft.connect(addr2).mint(1, { value: toWei(price)});
            expect(await nft.totalSupply()).to.equal(1);
            await expect(planting.connect(addr1).plant(1)).to.be.revertedWith("You don't own this bean!");
            await nft.connect(addr1).mint(1, { value: toWei(price)});
            expect(await nft.totalSupply()).to.equal(2);
            await planting.connect(addr1).plant(2)
            expect(await nft.totalSupply()).to.equal(1);
            expect(await nft.balanceOf(addr1.address)).to.equal(0);
            currentPlant = await planting.getPlant(addr1.address)
            let currentTimestamp = await helpers.time.latest()
            expect(currentPlant.phase).to.equal(1)
            expect(currentPlant.timestampPhaseStarted).to.equal(currentTimestamp)
            expect(await planting.currentPhaseFinished(addr1.address)).to.equal(false)
            
            await helpers.time.increase(5 * 3600);
            expect(await planting.currentPhaseFinished(addr1.address)).to.equal(phaseFinishedEarly)
            if (!phaseFinishedEarly) await expect(planting.connect(addr1).plant(3)).to.be.revertedWith('The current growing phase of your plant is not finished yet!');
            await helpers.time.increase(1 * 3600);
            expect(await planting.currentPhaseFinished(addr1.address)).to.equal(true)
            
            // 2nd plant
            await planting.connect(addr1).plant(3)
            currentPlant = await planting.getPlant(addr1.address)
            currentTimestamp = await helpers.time.latest()
            expect(currentPlant.phase).to.equal(2)
            expect(currentPlant.timestampPhaseStarted).to.equal(currentTimestamp)
            expect(await planting.currentPhaseFinished(addr1.address)).to.equal(false)
            
            await helpers.time.increase(17 * 3600);
            expect(await planting.currentPhaseFinished(addr1.address)).to.equal(phaseFinishedEarly)
            if (!phaseFinishedEarly) await expect(planting.connect(addr1).plant(4)).to.be.revertedWith('The current growing phase of your plant is not finished yet!');
            await helpers.time.increase(1 * 3600);
            expect(await planting.currentPhaseFinished(addr1.address)).to.equal(true)

            // 3rd plant
            await planting.connect(addr1).plant(4)
            currentPlant = await planting.getPlant(addr1.address)
            currentTimestamp = await helpers.time.latest()
            expect(currentPlant.phase).to.equal(3)
            expect(currentPlant.timestampPhaseStarted).to.equal(currentTimestamp)
            expect(await planting.currentPhaseFinished(addr1.address)).to.equal(false)
            
            await helpers.time.increase(47 * 3600);
            expect(await planting.currentPhaseFinished(addr1.address)).to.equal(phaseFinishedEarly)
            if (!phaseFinishedEarly) await expect(planting.connect(addr1).plant(5)).to.be.revertedWith('The current growing phase of your plant is not finished yet!');
            await helpers.time.increase(1 * 3600);
            expect(await planting.currentPhaseFinished(addr1.address)).to.equal(true)

            // 4th plant
            await planting.connect(addr1).plant(5)
            currentPlant = await planting.getPlant(addr1.address)
            currentTimestamp = await helpers.time.latest()
            expect(currentPlant.phase).to.equal(4)
            expect(currentPlant.timestampPhaseStarted).to.equal(currentTimestamp)
            expect(await planting.currentPhaseFinished(addr1.address)).to.equal(false)
            
            await nft.connect(addr1).mint(1, { value: toWei(price)});
            await helpers.time.increase(95 * 3600);
            expect(await planting.currentPhaseFinished(addr1.address)).to.equal(phaseFinishedEarly)
            if (!phaseFinishedEarly) await expect(planting.connect(addr1).plant(6)).to.be.revertedWith('The current growing phase of your plant is not finished yet!');
            await helpers.time.increase(1 * 3600);
            expect(await planting.currentPhaseFinished(addr1.address)).to.equal(true)

            // 5th plant
            await expect(planting.connect(addr1).plant(6)).to.be.revertedWith('Your plant already reached maximum growth!');
            
            // Different user
            currentPlant = await planting.getPlant(addr2.address)
            expect(currentPlant.phase).to.equal(0)
        })
    })
})