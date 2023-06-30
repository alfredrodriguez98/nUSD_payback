const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Exchange contract Unit Testing", () => {
  let exchange;
  let user1;
  let mockAggregator;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    const Exchange = await ethers.getContractFactory("Exchange");
    exchange = await Exchange.deploy();
    await exchange.deployed();

    mockAggregator = await ethers.getContractFactory(
      "MockAggregatorV3Interface"
    );
    mockAggregator = await mockAggregator.deploy();
    await mockAggregator.deployed();
  });

  describe("\n Should deposit and redeem", async () => {
    it("Should have correct name and symbol", async function () {
      expect(await exchange.name()).to.equal("nUSD Stablecoin");
      expect(await exchange.symbol()).to.equal("nUSD");
    });

    it("Should allow the user to deposit ETH", async function () {
      let balanceBefore = await exchange.balanceOf(user1.address);
      await exchange
        .connect(user1)
        .deposit({ value: ethers.utils.parseEther("1") });

      let balanceAfter = await exchange.balanceOf(user1.address);
      expect(balanceAfter).to.be.greaterThan(balanceBefore);
    });

    it("Should deposit ETH and mint nUSD tokens", async function () {
      const depositValue = ethers.utils.parseEther("1");
      await exchange.connect(user1).deposit({ value: depositValue });
      const balance = await exchange.balanceOf(user1.address);
      expect(balance).to.not.equal(0);
    });

    it("Should return the price of pegged coin from oracle", async () => {
      const updatedPrice = await exchange.getLatestPrice();
      const latestPrice = await exchange.getLatestPrice();
      expect(latestPrice).to.be.equal(updatedPrice);
    });

    it("Should return all the deposits of user", async () => {
      await exchange
        .connect(user1)
        .deposit({ value: ethers.utils.parseEther("1") });
      await exchange
        .connect(user1)
        .deposit({ value: ethers.utils.parseEther("1") });

      const deposits = await exchange.totalDepositsOf(user1.address);
      const depositInEth = ethers.utils.formatEther(deposits);
      console.log("Total deposits of user1: ", depositInEth);
      expect(parseFloat(depositInEth)).to.equal(2);
    });

    it("Should return the total ETH balance of a user", async () => {
      await exchange
        .connect(user1)
        .deposit({ value: ethers.utils.parseEther("3") });
      await exchange
        .connect(user1)
        .deposit({ value: ethers.utils.parseEther("5") });

      const balance = await exchange.connect(user1).totalEthBalance();
      const balanceInEth = ethers.utils.formatEther(balance);
      console.log("Total ETH balance of user1: ", balanceInEth);
      expect(parseFloat(balanceInEth)).to.equal(8);
    });

    it("Should return the total nUSD balance of a user", async () => {
      await exchange
        .connect(user1)
        .deposit({ value: ethers.utils.parseEther("3") });
      await exchange
        .connect(user1)
        .deposit({ value: ethers.utils.parseEther("5") });

      const balance = await exchange.connect(user1).totalnUSDBalance();
      const balanceInEth = ethers.utils.formatEther(balance);
      expect(parseFloat(balanceInEth)).to.equal(4);
    });

    it("Should not allow the user to deposit ETH if amount is 0", async function () {
      await expect(
        exchange.connect(user1).deposit({ value: ethers.utils.parseEther("0") })
      ).to.be.revertedWith("Deposit amount should be greater than 0");
    });
  });
});
