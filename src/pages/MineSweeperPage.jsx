import MineSweeper from "../components/MineSweeper/MineSweeper";
import Header from "../components/Header";

import styles from "./page.module.scss";

const MineSweeperPage = () => {
  return (
    <div>
      <Header></Header>
      <div className={styles.container}>
        <div className={styles.box}>
          <MineSweeper />
        </div>
      </div>
    </div>
  );
};

export default MineSweeperPage;
