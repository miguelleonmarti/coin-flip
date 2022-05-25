import type { NextPage } from "next";
import { useState, useEffect } from "react";
import styles from "../styles/Coin.module.scss";

const Coin: NextPage<{ flip: boolean; result: string }> = ({ flip, result }) => {
  const [text, setText] = useState("");
  const classes = flip ? `${styles.outcome} ${styles[".flip"]} ${styles.toss}` : `${styles.outcome} ${styles.flip}`;

  useEffect(() => {
    if (!flip) return;
    const timer = setTimeout(() => {
      setText(result);
    }, 800);
    return () => clearTimeout(timer);
  }, [flip]);

  return <div className={classes}>{text}</div>;
};

export default Coin;
