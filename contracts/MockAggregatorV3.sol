// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @title Mock Aggregator V3 Interface
/// @author Alfred Rodriguez
/// @notice This contract is used to mock the Aggregator V3 Interface for testing purposes only

interface AggregatorV3Interface {
    function latestRoundData()
        external
        view
        returns (
            uint80,
            int256,
            uint256,
            uint256,
            uint80
        );
}

contract MockAggregatorV3Interface is AggregatorV3Interface {
    MockAggregatorV3Interface internal priceFeed;

    uint80 private roundId;
    int256 private price;
    uint256 private updatedAt;

    constructor() {
        roundId = 1;
        price = 30000000; // Setting an initial price for testing
        updatedAt = block.timestamp;
    }

    /// @notice This function is used to set the price for the mock aggregator contract
    /// @param _price The price to set for the mock aggregator contract
    /// @dev This function is used for testing purposes only

    function setPrice(int256 _price) external {
        require(_price > 0, "Price cannot be zero");

        price = _price;
        updatedAt = block.timestamp;
        roundId++;
    }

    /// @notice This function is used to get the latest price from the aggregator contract
    /// @dev This function is used for testing purposes only

    function latestRoundData()
        external
        view
        override
        returns (
            uint80,
            int256,
            uint256,
            uint256,
            uint80
        )
    {
        return (roundId, price, updatedAt, updatedAt, roundId);
    }
}
