const { assert } = require("chai");

require("chai").use(require("chai-as-promised")).should();
const CoinFlip = artifacts.require("CoinFlip");

// constants
const BET_PRICE = 200000000000000000;

contract("CoinFlip", function (accounts) {
  it("should initialize the variables", async function () {
    const instance = await CoinFlip.deployed();

    const betPrice = await instance.betPrice.call();
    assert.equal(BigInt(betPrice), BET_PRICE);

    const balance = BigInt(await instance.balance.call());
    assert.equal(balance, 0);

    const gamesCount = BigInt(await instance.gamesCount.call());
    assert.equal(gamesCount, 0);

    const headsWins = BigInt(await instance.headsWins.call());
    assert.equal(headsWins, 0);

    const tailsWins = BigInt(await instance.tailsWins.call());
    assert.equal(tailsWins, 0);
  });

  it("should be rejected because bet price and msg.value are not equal", async function () {
    // const instance = await CoinFlip.deployed();

    await instance.play(0, { from: accounts[0], value: 2 * BET_PRICE }).should.be.rejectedWith("Invalid price");
  });

  it("should be rejected due to invalid coin option", async function () {
    const instance = await CoinFlip.deployed();

    await instance.play(2, { from: accounts[0], value: BET_PRICE }).should.be.rejectedWith("Invalid coin option");
  });

  it("should enqueue the first player in the heads queue", async function () {
    const instance = await CoinFlip.deployed();

    let balance = BigInt(await instance.balance.call());
    assert.equal(balance, 0);

    await instance.play(0, { from: accounts[0], value: BET_PRICE });
    balance = BigInt(await instance.balance.call());
    assert.equal(balance, BET_PRICE);

    const isPlayerInQueue = await instance.isPlayerInQueue(accounts[0]);
    assert.equal(isPlayerInQueue, true);
  });

  it("should be rejected because first player is already in queue", async function () {
    const instance = await CoinFlip.deployed();

    await instance.play(1, { from: accounts[0], value: BET_PRICE }).should.be.rejectedWith("You are in queue already");
  });

  it("should flip a coin and send the prize to the winner", async function () {
    const instance = await CoinFlip.deployed();

    // const firstBalanceBefore = BigInt(await web3.eth.getBalance(accounts[0]));
    // const secondBalanceBefore = BigInt(await web3.eth.getBalance(accounts[1]));

    const results = await instance.play(1, { from: accounts[1], value: BET_PRICE });

    assert.equal(results.logs.length, 1);
    assert.equal(results.logs[0].event, "Result");
    const { winner, loser, result } = results.logs[0].args;

    const headsWins = await instance.headsWins.call();
    const tailsWins = await instance.tailsWins.call();

    if (result.toNumber() === 0) {
      assert.equal(headsWins.toNumber(), 1);
      assert.equal(tailsWins.toNumber(), 0);
      assert.equal(winner, accounts[0]);
      assert.equal(loser, accounts[1]);
    } else {
      assert.equal(tailsWins.toNumber(), 1);
      assert.equal(headsWins.toNumber(), 0);
      assert.equal(loser, accounts[0]);
      assert.equal(winner, accounts[1]);
    }

    const gamesCount = BigInt(await instance.gamesCount.call());
    assert.equal(gamesCount, 1);

    const isFirstPlayerInQueue = await instance.isPlayerInQueue(accounts[0]);
    assert.equal(isFirstPlayerInQueue, false);

    const isSecondPlayerInQueue = await instance.isPlayerInQueue(accounts[1]);
    assert.equal(isSecondPlayerInQueue, false);

    // const firstBalanceAfter = BigInt(await web3.eth.getBalance(accounts[0]));
    // const secondBalanceAfter = BigInt(await web3.eth.getBalance(accounts[1]));
  });

  it("should enqueue the another first player in the tails queue", async function () {
    const instance = await CoinFlip.deployed();

    await instance.play(1, { from: accounts[0], value: BET_PRICE });

    const isPlayerInQueue = await instance.isPlayerInQueue(accounts[0]);
    assert.equal(isPlayerInQueue, true);
  });

  it("should flip a coin again and send the prize to the winner", async function () {
    const instance = await CoinFlip.deployed();

    // const firstBalanceBefore = BigInt(await web3.eth.getBalance(accounts[0]));
    // const secondBalanceBefore = BigInt(await web3.eth.getBalance(accounts[1]));

    const results = await instance.play(0, { from: accounts[1], value: BET_PRICE });

    assert.equal(results.logs.length, 1);
    assert.equal(results.logs[0].event, "Result");
    const { winner, loser, result } = results.logs[0].args;

    if (result.toNumber() === 1) {
      assert.equal(winner, accounts[0]);
      assert.equal(loser, accounts[1]);
    } else {
      assert.equal(loser, accounts[0]);
      assert.equal(winner, accounts[1]);
    }

    const gamesCount = BigInt(await instance.gamesCount.call());
    assert.equal(gamesCount, 2);

    const isFirstPlayerInQueue = await instance.isPlayerInQueue(accounts[0]);
    assert.equal(isFirstPlayerInQueue, false);

    const isSecondPlayerInQueue = await instance.isPlayerInQueue(accounts[1]);
    assert.equal(isSecondPlayerInQueue, false);

    // const firstBalanceAfter = BigInt(await web3.eth.getBalance(accounts[0]));
    // const secondBalanceAfter = BigInt(await web3.eth.getBalance(accounts[1]));
  });
});
