import { useContext } from "react";
import type { NextPage } from "next";
import styles from "../styles/Info.module.scss";
import { Web3Context } from "../hooks/Web3Context";

const Info: NextPage = () => {
  const { address, chainId } = useContext(Web3Context);

  return (
    <div className={styles.info}>
      <div>Address: {address}</div>
      <div>Chain ID: {chainId}</div>
    </div>
  );
};

export default Info;
