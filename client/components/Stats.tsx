import type { NextPage } from "next";
import styles from "../styles/Stats.module.scss";

const Stats: NextPage<{ stats: { gamesCount: number; headsWins: number; tailsWins: number } }> = ({ stats }) => {
  return (
    <div className={styles.stats}>
      <div>Games: {stats.gamesCount}</div>
      <div>Heads wins: {stats.headsWins}</div>
      <div>Tails wins: {stats.tailsWins}</div>
    </div>
  );
};

export default Stats;
