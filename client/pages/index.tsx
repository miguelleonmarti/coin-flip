import type { NextPage } from "next";
import { useState, useEffect } from "react";
import styles from "../styles/Home.module.scss";

// web3
import Web3Modal from "web3modal";
import Core from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3 from "web3";
import { AbiItem, toNumber } from "web3-utils";
import { Contract } from "web3-eth-contract";
import CoinFlip from "../contracts/CoinFlip.json";

// components
import Connect from "../components/Connect";
import Game from "../components/Game";
import Stats from "../components/Stats";

const Home: NextPage = () => {
  const [web3Modal, setWeb3Modal] = useState<Core | null>(null);
  const [address, setAddress] = useState("");
  const [contract, setContract] = useState<Contract>();
  const [stats, setStats] = useState({ gamesCount: 0, headsWins: 0, tailsWins: 0 });
  const [flip, setFlip] = useState(false);
  const [result, setResult] = useState(";)");

  // modal
  useEffect(() => {
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: process.env.REACT_APP_INFURA_PROJECT_SECRET,
        },
      },
    };

    const newWeb3Modal = new Web3Modal({
      cacheProvider: true,
      network: process.env.REACT_APP_NETWORK,
      providerOptions,
    });

    setWeb3Modal(newWeb3Modal);
  }, []);

  // connect automatically and without a popup if user is already connected
  useEffect(() => {
    if (web3Modal && web3Modal.cachedProvider) {
      connectWallet();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [web3Modal]);

  useEffect(() => {
    if (!contract) return;
    loadData();
    addContractListeners();
    return () => {
      contract.events.allEvents().off();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract]);

  async function connectWallet() {
    if (!web3Modal) return;
    const provider = await web3Modal.connect();
    addModalListeners(provider);
    const web3 = new Web3(provider);
    const accounts = await web3.eth.getAccounts();
    setAddress(accounts[0]);
    const contract = new web3.eth.Contract(CoinFlip.abi as AbiItem[], "0xc51881Fc2DCA03D514587BB8498A3F2136289e8f");
    setContract(contract);
  }

  async function loadData() {
    const [gamesCount, headsWins, tailsWins] = (
      await Promise.all([contract?.methods.gamesCount().call(), contract?.methods.headsWins().call(), contract?.methods.tailsWins().call()])
    ).map((e) => Number(e));
    setStats((object) => ({ ...object, gamesCount, headsWins, tailsWins }));
  }

  async function addModalListeners(web3ModalProvider: any) {
    web3ModalProvider.on("accountsChanged", (accounts: any) => {
      window.location.reload();
    });

    // Subscribe to chainId change
    web3ModalProvider.on("chainChanged", (chainId: any) => {
      window.location.reload();
    });
  }

  async function addContractListeners() {
    contract?.events.NeedToWait().on("data", (event: any) => {
      const { player } = event.returnValues;
      if (player === address) {
        setResult("?");
        setFlip(true);
      }
    });
    contract?.events.Result().on("data", (event: any) => {
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
          <Game play={play} flip={flip} setFlip={setFlip} result={result} />
        </>
      )}
    </div>
  );
};

export default Home;
