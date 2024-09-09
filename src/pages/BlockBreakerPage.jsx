import BlockBreaker from "../components/BlockBreaker/BlockBreaker";
import Header from "../components/Header";

import styles from "./page.module.scss";

const BlockBreakerPage = () => {
  return (
    <div>
      <Header></Header>
      <div className={styles.container}>
        <div className={styles.box}>
          <BlockBreaker />
        </div>
      </div>
    </div>
  );
};

export default BlockBreakerPage;
