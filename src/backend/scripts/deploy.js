async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Fill with correct data and uncomment the correct network before deploy!
  // const teamWallet = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"; // localhost
  // const whitelistedAddresses = ["0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"]; // localhost
  // const teamWallet = "0xD71E736a7eF7a9564528D41c5c656c46c18a2AEd"; // goerli
  // const whitelistedAddresses = ["0xD71E736a7eF7a9564528D41c5c656c46c18a2AEd", "0x7327ccC29B7cd5f0Bdc1957c5E32BE1f6Bf31446"]; // goerli
  // const teamWallet = "0x127cd7eaAE73229413da41eb3767dce9a869eB33"; // mainnet
  // const whitelistedAddresses = []; // mainnet

  // const whitelistRoot = "0xbc31375dd73e024b8d6b153e29ec5567ba006493bdac3e2099d4f347c3309d06" // goerli
  const whitelistRoot = "0xc7edeb3be27541bbaa4ae0c4e4391bda1d3043fdc5db9c1aa6559917bd19d028" // mainnet
  
  const NFT = await ethers.getContractFactory("NFT");
  const nft = await NFT.deploy(whitelistRoot);
  console.log("NFT contract address", nft.address)
  
  saveFrontendFiles(nft, "NFT");

  console.log("Frontend files saved")
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
