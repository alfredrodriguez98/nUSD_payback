const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = require("ethers");

describe("Checking the functionalities of Aggregator contract using MockAggregator", async () => {
  let stablecoin;
  let mockAggregator;
  let accounts;

  before(async () => {
    accounts = await ethers.getSigners(1);
    mockAggregator = await ethers.getContractFactory(
      "MockAggregatorV3Interface"
    );
    mockAggregator = await mockAggregator.deploy();
    await mockAggregator.deployed();

    stablecoin = await ethers.getContractFactory("Stablecoin");
    stablecoin = await stablecoin.deploy();
    await stablecoin.deployed();
  });

  it("Should have correct name and symbol of token from the constructor argument", async function () {
    expect(await stablecoin.name()).to.equal("nUSD");
    expect(await stablecoin.symbol()).to.equal("NUSD");
  });

  it("Should return the price of the stablecoin", async () => {
    const mockPrice = 100074652;

    await mockAggregator.setPrice(mockPrice);
    const latestPrice = await stablecoin.getLatestPrice();

    expect(latestPrice).to.be.equal(mockPrice);
  });

   it("Should get the latest price and not be zero", async function () {
     const price = await stablecoin.getLatestPrice();
     expect(price).to.not.equal(0);
   });
});
