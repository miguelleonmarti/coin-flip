import type { NextPage } from "next";
import styles from "../styles/Stats.module.scss";

const Stats: NextPage<{ stats: { gamesCount: number; headsWins: number; tailsWins: number } }> = ({ stats }) => {
  function getPercentage(wins: number) {
    return ((wins * 100) / stats.gamesCount).toFixed(1);
  }
  return (
    <div className={styles.stats}>
      <div>
        H: {stats.headsWins} ({getPercentage(stats.headsWins)}%)
      </div>
      <div>Games: {stats.gamesCount}</div>
      <div>
        T: {stats.tailsWins} ({getPercentage(stats.tailsWins)}%)
      </div>
    </div>
  );
};

export default Stats;
