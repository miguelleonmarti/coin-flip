import type { NextPage } from "next";
import styles from "../styles/Connect.module.scss";

const Connect: NextPage<{ connectWallet: () => Promise<void> }> = ({ connectWallet }) => {
  return (
    <div className={styles.connectButton}>
      <svg className={styles.svg} xmlns="http://www.w3.org/2000/svg" version="1.1">
        <defs>
          <filter id="button">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
            <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="highContrastGraphic" />
            <feComposite in="SourceGraphic" in2="highContrastGraphic" operator="atop" />
          </filter>
        </defs>
      </svg>

      <button className={styles.button} onClick={connectWallet}>
        Connect
        <span className={styles.bubbles}>
          <span className={styles.bubble}></span>
          <span className={styles.bubble}></span>
          <span className={styles.bubble}></span>
          <span className={styles.bubble}></span>
          <span className={styles.bubble}></span>
          <span className={styles.bubble}></span>
          <span className={styles.bubble}></span>
          <span className={styles.bubble}></span>
          <span className={styles.bubble}></span>
          <span className={styles.bubble}></span>
        </span>
      </button>
    </div>
  );
};

export default Connect;
