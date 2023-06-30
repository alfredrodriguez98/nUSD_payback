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

    // it("Should fail if no ETH is sent", async function () {
    //   await expect(
    //     exchange.connect(user1).deposit({ value: 0 })
    //   ).to.be.revertedWith("Deposit amount should be greater than 0");
    // });

    // it("Should fail if user tries to redeem more nUSD than they have", async function () {
    //   const nUSDAmount = ethers.utils.parseEther("1");
    //   await expect(
    //     exchange.connect(user1).redeem(nUSDAmount)
    //   ).to.be.revertedWith("Insufficient nUSD balance");
    // });

    it("Should fail if redemption exceeds total deposited amount", async function () {
      // deposit some ETH
      await exchange
        .connect(user1)
        .deposit({ value: ethers.utils.parseEther("1") });

      // try to redeem more than the deposited amount
      const nUSDAmount = ethers.utils.parseEther("3");
      await expect(
        exchange.connect(user1).redeem(nUSDAmount)
      ).to.be.revertedWith("Redemption exceeds total deposited amount");
    });

     it("Should deposit ETH and mint nUSD tokens", async function () {
       const depositValue = ethers.utils.parseEther("1");
       await exchange.connect(user1).deposit({ value: depositValue });
       const balance = await exchange.balanceOf(user1.address);
       expect(balance).to.not.equal(0);
     });

      it("Should burn nUSD tokens and redeem ETH", async function () {
        const depositValue = ethers.utils.parseEther("1");
        await exchange.connect(user1).deposit({ value: depositValue });
        const initialBalance = await exchange.balanceOf(user1.address);
        await exchange.connect(user1).redeem(initialBalance);
        const finalBalance = await exchange.balanceOf(user1.address);
        expect(finalBalance).to.equal(0);
      });


  });
});
