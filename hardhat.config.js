require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

module.exports = {
  solidity: "0.8.18",
  networks: {
    hardhat: {
      // forking: {
      //   url: "https://polygon-mumbai.g.alchemy.com/v2/5TG6upjsaz2IKmFo29-cKxNUDlCFoZ51",
      // },
    },
    MATIC_MUMBAI: {
      url: "https://polygon-mumbai.g.alchemy.com/v2/5TG6upjsaz2IKmFo29-cKxNUDlCFoZ51",
      accounts: [process.env.PRIVATE_KEY],
      gas: "auto",
      gasPrice: "auto",
    },
  },
  
};
