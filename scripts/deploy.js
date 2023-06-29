const hre = require("hardhat");

async function main() {
  const Exchange = await hre.ethers.getContractFactory("Exchange");
  const exchange = await Exchange.deploy();
  await exchange.deployed();

  console.log("Exchange contract deployed to:", exchange.address);

  const Stablecoin = await hre.ethers.getContractFactory("Stablecoin");
  const stablecoin = await Stablecoin.deploy();
  await stablecoin.deployed();

  console.log("Stablecoin contract deployed to:", stablecoin.address);

   const MockAggregatorV3 = await hre.ethers.getContractFactory(
     "MockAggregatorV3"
   );
   const mockAggregatorV3 = await MockAggregatorV3.deploy();
   await mockAggregatorV3.deployed();

   console.log(
     "MockAggregatorV3 contract deployed to:",
     mockAggregatorV3.address
   );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
