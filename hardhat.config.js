require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-gas-reporter");
require("dotenv").config();

module.exports = {
  solidity: "0.8.13",
  networks: {
     hardhat: {
      chainId: 31337
     },
     goerli: {
       url: process.env.REACT_APP_API_URL_GOERLI_INFURA,
       accounts: ['0x' + process.env.REACT_APP_PRIVATE_KEY_GOERLI],
       allowUnlimitedContractSize: true,
       gas: 2100000,
       gasPrice: 8000000000,
     },
     mainnet: {
      url: process.env.REACT_APP_API_URL_MAINNET_INFURA,
      accounts: [process.env.REACT_APP_PRIVATE_KEY_MAINNET_KENNY_2],
      gas: 2100000,
      gasPrice: 30000000000
    }
  },
  paths: {
    artifacts: "./src/backend/artifacts",
    sources: "./src/backend/contracts",
    cache: "./src/backend/cache",
    tests: "./src/backend/test"
  },
  etherscan: {
    apiKey: process.env.REACT_APP_ETHERSCAN_API_KEY_KENNY
    // apiKey: process.env.REACT_APP_POLYGONSCAN_API_KEY
  }
};
