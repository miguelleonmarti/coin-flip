import { NextPage } from "next";
import { useState, useEffect, createContext, Children, Dispatch, SetStateAction } from "react";
import type { Contract } from "web3-eth-contract";
import Web3Modal from "web3modal";
import type Core from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3 from "web3";
import { AbiItem, toNumber } from "web3-utils";
import CoinFlip from "../contracts/CoinFlip.json";

export const Web3Context = createContext<IWeb3>(null!);

type IWeb3 = {
  modal?: Core;
  contract: Contract;
  address: string;
  chainId: number;
  connectWallet: () => Promise<void>;
  setWeb3: Dispatch<SetStateAction<IWeb3>>;
};

const Web3Provider: NextPage<{ children: any }> = ({ children }) => {
  const [{ modal, contract, address, chainId }, setWeb3] = useState<IWeb3>({} as IWeb3);

  // modal
  useEffect(() => {
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: process.env.NEXT_PUBLIC_INFURA_PROJECT_ID,
        },
      },
    };

    const web3Modal = new Web3Modal({
      cacheProvider: true,
      network: process.env.NEXT_PUBLIC_NETWORK,
      providerOptions,
    });

    setWeb3((prev: IWeb3) => ({ ...prev, modal: web3Modal }));
  }, []);

  // connect automatically and without a popup if user is already connected
  useEffect(() => {
    if (modal && modal.cachedProvider) {
      connectWallet();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modal]);

  async function connectWallet() {
    try {
      if (!modal) return;
      const provider = await modal.connect();
      addModalListeners(provider);
      const web3 = new Web3(provider);
      const chainId = await web3.eth.getChainId();
      if (chainId !== 1337) return;
      const accounts = await web3.eth.getAccounts();
      const contract = new web3.eth.Contract(CoinFlip.abi as AbiItem[], "0xc51881Fc2DCA03D514587BB8498A3F2136289e8f");
      setWeb3((prev: IWeb3) => ({ ...prev, contract, address: accounts[0], chainId }));
    } catch (error) {
      console.log(error);
    }
  }

  async function addModalListeners(provider: any) {
    provider.on("accountsChanged", (accounts: any) => {
      window.location.reload();
    });

    // Subscribe to chainId change
    provider.on("chainChanged", (chainId: any) => {
      window.location.reload();
    });

    provider.on("connect", (info: { chainId: number }) => {
      console.log("connect");
    });

    // Subscribe to provider disconnection
    provider.on("disconnect", (error: { code: number; message: string }) => {
      console.log("disconnect");
    });
  }

  return <Web3Context.Provider value={{ contract, address, chainId, connectWallet, setWeb3 }}>{children}</Web3Context.Provider>;
};

export default Web3Provider;
