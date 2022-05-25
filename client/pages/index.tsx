import type { NextPage } from "next";
import { useState, useEffect } from "react";
import styles from "../styles/Home.module.scss";

// web3
import { ethers, providers } from "ethers";
import Web3Modal from "web3modal";
import Core from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";

// components
import Connect from "../components/Connect";
import Game from "../components/Game";

const Home: NextPage = () => {
  const [web3Modal, setWeb3Modal] = useState<Core | null>(null);
  const [address, setAddress] = useState("");

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

  useEffect(() => {
    // connect automatically and without a popup if user is already connected
    if (web3Modal && web3Modal.cachedProvider) {
      connectWallet();
    }
  }, [web3Modal]);

  async function connectWallet() {
    if (!web3Modal) return;
    const provider = await web3Modal.connect();
    addListeners(provider);
    const ethersProvider = new providers.Web3Provider(provider);
    const userAddress = await ethersProvider.getSigner().getAddress();
    setAddress(userAddress);
  }

  async function addListeners(web3ModalProvider: any) {
    web3ModalProvider.on("accountsChanged", (accounts: any) => {
      window.location.reload();
    });

    // Subscribe to chainId change
    web3ModalProvider.on("chainChanged", (chainId: any) => {
      window.location.reload();
    });
  }

  return <div className={styles.container}>{!address ? <Connect connectWallet={connectWallet} /> : <Game />}</div>;
};

export default Home;
