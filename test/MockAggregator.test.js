const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = require("ethers");

describe("Checking the functionalities of Aggregator contract using MockAggregator", async () => {
  let stablecoin;
  let mockAggregator;

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

  it("Should return the price of the stablecoin", async () => {
    const mockPrice = 100016352;

    await mockAggregator.setPrice(mockPrice);
    const latestPrice = await stablecoin.getLatestPrice();

    expect(latestPrice).to.equal(mockPrice);
  });

  
});
