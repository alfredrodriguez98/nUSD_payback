// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./Stablecoin.sol";

contract Exchange is ERC20, Ownable, ReentrancyGuard {
    // Mapping each user address to their deposits
    mapping(address => uint256) private _deposits;
    // Mapping to check to total number of redemptions made
    mapping(address => uint256) private _redemptionCount;

    AggregatorV3Interface internal priceFeed;

    //Events
    event Deposit(
        address indexed user,
        uint256 ethDeposited,
        uint256 nUSDMinted
    );
    event Redemption(
        address indexed user,
        uint256 nUSDBurned,
        uint256 ethRedeemed
    );

    // Price Feed of ETH/USD
    constructor() ERC20("nUSD Stablecoin", "nUSD") {
        priceFeed = AggregatorV3Interface(
            0x0715A7794a1dc8e42615F059dD6e406A6594651A
        );
        _mint(msg.sender, 100000 * (10**uint256(decimals())));
    }

    //  Enables users to deposit ETH and obtain 50% of nUSD token as cashback
    function deposit() external payable nonReentrant {
        uint256 ethUsdPrice = getLatestPrice();
        // We use ETH's price in USD to determine the amount of nUSD tokens to mint.
        uint256 nUSDAmount = (msg.value * ethUsdPrice) / 2;

        // Ensure the user deposits more than zero ETH
        require(msg.value > 0, "Deposit amount should be greater than 0");

        // Ensure the contract has enough ETH to mint nUSD

        _mint(msg.sender, nUSDAmount);
        _deposits[msg.sender] += msg.value;

        emit Deposit(msg.sender, msg.value, nUSDAmount);
    }

    function maxPayback(uint256 nUSDBalance) public view returns (uint256) {
        uint256 ethUsdPrice = getLatestPrice();
        return nUSDBalance = (_deposits[msg.sender] * ethUsdPrice) / 2;
    }

    // Allows users to convert their nUSD back into either ETH at the current exchange.
    function redeem(uint256 nUSDBalance)
        external
        nonReentrant
        returns (uint256)
    {
        uint256 maxPayableCashback = maxPayback(nUSDBalance);
        require(
            nUSDBalance <= maxPayableCashback,
            "Payback amount should be less than or equal to max payable cashback"
        );
        // Ensure the user has enough nUSD to redeem
        require(nUSDBalance > 0, "Insufficient nUSD balance");

        //Burn nUSD tokens
        _burn(msg.sender, nUSDBalance);
        // Transfer ETH to user
        payable(msg.sender).transfer(nUSDBalance);

        emit Redemption(msg.sender, nUSDBalance, maxPayableCashback);
    }

    function depositsOf(address account) external view returns (uint256) {
        return _deposits[account];
    }

    //View functions
    // Get the latest ETH price in USD
    function getLatestPrice() public view returns (uint256) {
        (, int256 price, , , ) = priceFeed.latestRoundData();
        return uint256(price / 1e8);
    }

    function totalDepositsOf(address account) public view returns (uint256) {
        return _deposits[account];
    }

    function totalRedemptionsOf(address account)
        external
        view
        returns (uint256)
    {
        return _redemptionCount[account];
    }

    function totalEthBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function totalnUSDBalance() public view returns (uint256) {
        return totalEthBalance() / 2;
    }
}
