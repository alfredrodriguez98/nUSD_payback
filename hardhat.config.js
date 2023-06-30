require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ethers");

module.exports = {
  networks: {
    hardhat: {
      forking: {
        url: "https://polygon-mumbai.g.alchemy.com/v2/5TG6upjsaz2IKmFo29-cKxNUDlCFoZ51",
      },
    },
  },
  solidity: "0.8.18",
};
