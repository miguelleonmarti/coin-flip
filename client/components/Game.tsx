import type { NextPage } from "next";
import { Dispatch, SetStateAction, useState } from "react";
import styles from "../styles/Game.module.scss";
import Coin from "./Coin";

const Game: NextPage<{
  play: (coinOption: number) => Promise<void>;
  result: string;
  flip: boolean;
  setFlip: Dispatch<SetStateAction<boolean>>;
}> = ({ play, result, flip, setFlip }) => {
  const [option, setOption] = useState<number>(0);

  return (
    <div className={styles.gameContainer}>
      <div className={styles.coin}>
        <Coin flip={flip} setFlip={setFlip} result={result} />
      </div>
      <div className={styles.options}>
        <div aria-disabled={option !== 0} className={styles.heads} onClick={() => setOption(0)}>
          <p>HEADS</p>
        </div>
        <div aria-disabled={option !== 1} className={styles.tails} onClick={() => setOption(1)}>
          <p>TAILS</p>
        </div>
      </div>
      <div className={styles.buttons}>
        <button className={styles.play} onClick={() => play(option)}>
          PLAY
        </button>
      </div>
    </div>
  );
};

export default Game;
