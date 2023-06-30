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
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
