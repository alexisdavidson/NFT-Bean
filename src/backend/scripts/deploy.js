const fromWei = (num) => ethers.utils.formatEther(num)

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", fromWei(await deployer.getBalance()));
  
  // const NFT = await ethers.getContractFactory("NFT");
  // const nft = await NFT.deploy();
  // console.log("NFT contract address", nft.address)
  // saveFrontendFiles(nft, "NFT");

  // const Planting = await ethers.getContractFactory("Planting");
  // const planting = await Planting.deploy(nft.address);
  // console.log("Planting contract address", planting.address)
  // saveFrontendFiles(planting, "Planting");
  
  // await nft.setPlantingAddress(planting.address);

  // console.log("setPlantingAddress called")

  // // For testing
  // await nft.setMintEnabled(true);
  // await nft.setPrice(0);
  // await nft.mint(1, { value: 0});
  // console.log("Goerli test functions called")

  // Phase 2 deployment code
  // const plantingAddress = "0x2792a863fcD0e2ad62272f6aD6E8746DBC527aF6" // Goerli
  const plantingAddress = "0xEBfCF2708F4DA3E07Eb55c8D599e97fEE4c2ACF5" // Mainnet

  const NFT_Goose = await ethers.getContractFactory("NFT_Goose");
  const Token_Egg = await ethers.getContractFactory("Token_Egg");
  const Castle = await ethers.getContractFactory("Castle");

  const nftGoose = await NFT_Goose.deploy();
  console.log("nftGoose contract address", nftGoose.address)
  saveFrontendFiles(nftGoose, "NFT_Goose");

  const castle = await Castle.deploy(plantingAddress, nftGoose.address);
  console.log("castle contract address", castle.address)
  saveFrontendFiles(castle, "Castle");

  const tokenEgg = await Token_Egg.deploy(castle.address, deployer.address);
  console.log("tokenEgg contract address", tokenEgg.address)
  saveFrontendFiles(tokenEgg, "Token_Egg");

  await nftGoose.setCastleAddress(castle.address);
  await castle.setTokenAddress(tokenEgg.address);
  console.log("Set address functions called")
}

function saveFrontendFiles(contract, name) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../../frontend/contractsData";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + `/${name}-address.json`,
    JSON.stringify({ address: contract.address }, undefined, 2)
  );

  const contractArtifact = artifacts.readArtifactSync(name);

  fs.writeFileSync(
    contractsDir + `/${name}.json`,
    JSON.stringify(contractArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
