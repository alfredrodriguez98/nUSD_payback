const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Exchange contract Unit Testing", () => {
  let exchange;
  let user1;
  let user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    const Exchange = await ethers.getContractFactory("Exchange");
    exchange = await Exchange.deploy();
    await exchange.deployed();
  });

  describe("\n Should deposit and redeem", async () => {
    it("Should allow the user to deposit ETH", async function () {
      let balanceBefore = await exchange.balanceOf(user1.address);
      await exchange
        .connect(user1)
        .deposit({ value: ethers.utils.parseEther("1") });

      let balanceAfter = await exchange.balanceOf(user1.address);
      expect(balanceAfter).to.be.greaterThan(balanceBefore);
    });

    it("Should not redeem the amount received in nUSD", async () => {
      let balanceBefore = await exchange.balanceOf(user1.address);
      await exchange
        .connect(user1)
        .deposit({ value: ethers.utils.parseEther("1") });

      let balanceAfter = await exchange.balanceOf(user1.address);
      expect(balanceAfter).to.be.greaterThan(balanceBefore);

      


    });
  });
});
