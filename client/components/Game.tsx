import type { NextPage } from "next";
import { useState } from "react";
import styles from "../styles/Game.module.scss";

const Game: NextPage = () => {
  const [option, setOption] = useState<number>(0);

  return (
    <div className={styles.gameContainer}>
      <div className={styles.options}>
        <div aria-disabled={option !== 0} className={styles.heads} onClick={() => setOption(0)}>
          <p>HEADS</p>
        </div>
        <div aria-disabled={option !== 1} className={styles.tails} onClick={() => setOption(1)}>
          <p>TAILS</p>
        </div>
      </div>
      <div className={styles.buttons}>
        <button className={styles.play}>PLAY</button>
      </div>
    </div>
  );
};

export default Game;
