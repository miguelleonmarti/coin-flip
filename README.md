# CoinFlip 🎲

[![Tests](https://github.com/miguelleonmarti/coin-flip/actions/workflows/test.yml/badge.svg)](https://github.com/miguelleonmarti/coin-flip/actions/workflows/test.yml)

Decentralized app that emulates the typical flip a coin game using solidity smart contracts.

## How does it work?

It is a multiplayer game so you play against other online players. Once you have connected your wallet and chosen **HEADS** or **TAILS** the client will request you to pay the bet. You need to have funds in order to bet. Then the smart contract will find you another player that has chosen the opposite as you. If there are no people at that time you will be enqueue, and you will have to wait for someone to bet against your decision. Else, the smart contract will pair you with another user and flip a coin. The winner will be rewarded with the loser's money.

## Tools

- Solidity
- web3.js
- NextJS
- Chai
- Ganache
