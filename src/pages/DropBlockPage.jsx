import DropBlock from "../components/DropBlock/DropBlock";
import Header from "../components/Header";

import styles from "./page.module.scss";

const DropBlockPage = () => {
  return (
    <div>
      <Header></Header>
      <div className={styles.container}>
        <div className={styles.box}>
          <DropBlock />
        </div>
      </div>
    </div>
  );
};

export default DropBlockPage;
