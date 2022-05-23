const CoinFlip = artifacts.require("CoinFlip");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("CoinFlip", function (accounts) {
  it("shoud initialize the variables", async function () {
    const instance = await CoinFlip.deployed();

    const betPrice = await instance.betPrice.call();
    assert.equal(BigInt(betPrice), 200000000000000000);

    const balance = BigInt(await instance.balance.call());
    assert.equal(balance, 0);

    const gamesCount = BigInt(await instance.gamesCount.call());
    assert.equal(gamesCount, 0);

    const headsWins = BigInt(await instance.headsWins.call());
    assert.equal(headsWins, 0);

    const tailsWins = BigInt(await instance.tailsWins.call());
    assert.equal(tailsWins, 0);
  });

  it("should enqueue the first player", async function () {
    const instance = await CoinFlip.deployed();

    let balance = BigInt(await instance.balance.call());
    assert.equal(balance, 0);

    await instance.play(0, { from: accounts[0], value: 200000000000000000 });
    balance = BigInt(await instance.balance.call());
    assert.equal(balance, 200000000000000000);
  });

  it("should flip a coin and send the prize to the winner", async function () {
    const instance = await CoinFlip.deployed();

    // const firstBalanceBefore = BigInt(await web3.eth.getBalance(accounts[0]));
    // const secondBalanceBefore = BigInt(await web3.eth.getBalance(accounts[1]));

    const results = await instance.play(1, { from: accounts[1], value: 200000000000000000 });

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

    // const firstBalanceAfter = BigInt(await web3.eth.getBalance(accounts[0]));
    // const secondBalanceAfter = BigInt(await web3.eth.getBalance(accounts[1]));
  });
});
