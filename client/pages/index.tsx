import type { NextPage } from "next";
import { useState, useEffect, useContext } from "react";
import styles from "../styles/Home.module.scss";

// web3
import Web3 from "web3";
import { Web3Context } from "../hooks/Web3Context";

// components
import Connect from "../components/Connect";
import Game from "../components/Game";
import Stats from "../components/Stats";
import Info from "../components/Info";

const Home: NextPage = () => {
  const [stats, setStats] = useState({ gamesCount: 0, headsWins: 0, tailsWins: 0 });
  const [flip, setFlip] = useState(false);
  const [result, setResult] = useState(";)");

  const { contract, address, connectWallet } = useContext(Web3Context);

  useEffect(() => {
    if (!contract) return;
    loadData();
    addContractListeners();
    return () => {
      // contract.events.allEvents().off();
      contract.events.NeedToWait().off();
      contract.events.Result().off();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract]);

  async function loadData() {
    try {
      const [gamesCount, headsWins, tailsWins] = (
        await Promise.all([
          contract?.methods.gamesCount().call(),
          contract?.methods.headsWins().call(),
          contract?.methods.tailsWins().call(),
        ])
      ).map((e) => Number(e));
      setStats((object) => ({ ...object, gamesCount, headsWins, tailsWins }));
    } catch (error) {
      console.log("hola:", error);
    }
  }

  async function addContractListeners() {
    contract.events.NeedToWait().on("data", (event: any) => {
      const { player } = event.returnValues;
      if (player === address) {
        setResult("?");
        setFlip(true);
      }
    });
    contract.events.Result().on("data", (event: any) => {
      const { winner, loser, result } = event.returnValues;
      const isPlayer = winner === address || loser === address;
      if (result === "0") {
        setStats((object) => {
          return { ...object, gamesCount: object.gamesCount + 1, headsWins: object.headsWins + 1 };
        });
        if (!isPlayer) return;
        setResult("HEADS");
      } else {
        setStats((object) => {
          return { ...object, gamesCount: object.gamesCount + 1, tailsWins: object.tailsWins + 1 };
        });
        if (!isPlayer) return;
        setResult("TAILS");
      }
      setFlip(true);
    });
  }

  async function play(coinOption: number) {
    if (![0, 1].includes(coinOption)) return;
    await contract?.methods.play(coinOption).send({ from: address, value: Web3.utils.toWei("0.2", "ether") });
  }

  return (
    <div className={styles.container}>
      {!address ? (
        <Connect connectWallet={connectWallet} />
      ) : (
        <>
          <Stats stats={stats} />
          <Info />
          <Game play={play} flip={flip} setFlip={setFlip} result={result} />
        </>
      )}
    </div>
  );
};

export default Home;
