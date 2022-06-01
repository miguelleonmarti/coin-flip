import type { NextPage } from "next";
import { useState, useEffect, SetStateAction, Dispatch } from "react";
import styles from "../styles/Coin.module.scss";

const Coin: NextPage<{ flip: boolean; setFlip: Dispatch<SetStateAction<boolean>>; result: string }> = ({ flip, setFlip, result }) => {
  const [text, setText] = useState(result);
  const classes = flip ? `${styles.outcome} ${styles.flip} ${styles.toss}` : `${styles.outcome}`;

  useEffect(() => {
    if (!flip) return;
    const timer = setTimeout(() => {
      setText(result);
      setFlip(false);
    }, 800);
    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flip]);

  return <div className={classes}>{text}</div>;
};

export default Coin;
