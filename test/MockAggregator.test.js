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

  it("Should return the price of pegged coin from oracle", async () => {
    const updatedPrice = await stablecoin.getLatestPrice();
    const latestPrice = await stablecoin.getLatestPrice();
    expect(latestPrice).to.be.equal(updatedPrice);
  });

  it("Should get the latest price and not be zero", async function () {
    const price = await stablecoin.getLatestPrice();
    expect(price).to.not.equal(0);
  });

  it("Should adjust the supply", async function () {
    await stablecoin.adjustSupply();
    const benchmarkPrice = 100016141;
    const price = await stablecoin.getLatestPrice();
    const totalSupply = await stablecoin.totalSupply();
    if (price > benchmarkPrice) {
      expect(totalSupply).to.be.gt(BigNumber.from("1000000000000000000"));
    } else if (price < benchmarkPrice) {
      expect(totalSupply).to.be.lt(BigNumber.from("1000000000000000000"));
    } else {
      expect(totalSupply).to.be.eq(BigNumber.from("1000000000000000000"));
    }
  });
});
