// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Stablecoin is ERC20, Ownable {
    AggregatorV3Interface internal priceFeed;

    constructor() ERC20("nUSD", "NUSD") {
        // Set the address for the Chainlink Price Feed.
        priceFeed = AggregatorV3Interface(0x92C09849638959196E976289418e5973CC96d645);
    }

    // Get the latest price of USD in ETH.
    function getLatestPrice() public view returns (int) {
        (,int price,,,) = priceFeed.latestRoundData();
        require(price != 0, "Price cannot be zero");
        return price;
    }

    // Adjust the supply of the coin based on the price of USD.
    function adjustSupply() public {
        int price = getLatestPrice();
         require(price != 0, "Price cannot be zero");

        // If price is greater than 1, mint new coins.
        if (price > 100016141) {
            _mint(owner(), uint256(price - 1 * 10 ** 18));
        }
        // If price is less than 1, burn coins.
        else if (price < 100016141) {
            _burn(owner(), uint256(1 * 10 ** 18 - price));
        }
    }
}