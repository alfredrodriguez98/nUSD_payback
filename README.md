# nUSD Stablecoin Project

This project contains three main contracts.
The Exchange contract contains the logic for operations to deposit and redeem payback. It has several view functions which facilitate in testing the contract.
The Stablecoin contract contains the logic for hard-pegging the coin to USD. It uses price oracle from chainlink to fetch the current price of USD in terms of ETH, and thereby adjust's the supply based on value of USD.
The MockAggregator contract is a dummy contract used to test the operations of price oracle.


To running the project in local environment, you'll need to fork polygon testnet to your local hardhat environment.

To receive test MATIC visit the link below:
https://mumbaifaucet.com/

## Tech Stack used
**Backend:** Solidity, Hardhat, JavaScript, MATIC forked net, ethers.js

Before running tests:

```bash
npm install
```

To run tests:

```bash
npx hardhat node
```
```bash
npx hardhat test
```

To deploy the contract:
```bash
npx hardhat run scripts/deploy.js --network MATIC_MUMBAI
```

Deployed contract addresses:
Exchange contract deployed to: 0x3B3606a4B3f40C5dBCEB3200De802CEc86f5d6B1
Stablecoin contract deployed to: 0x78cE831139c6AbBf54f92801f313531067259Cad



