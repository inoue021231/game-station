import Header from "../components/Header";
import styles from "./home.module.scss";
import { useNavigate } from "react-router-dom";

import DROP_BLOCK_THUMBNAIL from "./../assets/thumbnails/drop_block_thumbnail.png";
import { useState } from "react";

const Home = () => {
  const [dropblockHovered, setDropblockHovered] = useState(false);
  const [minesweeperHovered, setMinesweeperHovered] = useState(false);
  const [blockbreakerHovered, setBlockBreakerHovered] = useState(false);

  const navigate = useNavigate();

  return (
    <div>
      <Header></Header>
      <div className={styles.container}>
        <div className={styles.box}>
          <img
            src={DROP_BLOCK_THUMBNAIL}
            onClick={() => navigate("/game/dropblock")}
            onMouseEnter={() => setDropblockHovered(true)}
            onMouseLeave={() => setDropblockHovered(false)}
            style={{
              filter: `brightness(${dropblockHovered ? 150 : 100}%)`,
            }}
            alt="落ち物パズルゲーム"
          ></img>
        </div>
        <div className={styles.box}>
          <img
            src={DROP_BLOCK_THUMBNAIL}
            onClick={() => navigate("/game/minesweeper")}
            onMouseEnter={() => setMinesweeperHovered(true)}
            onMouseLeave={() => setMinesweeperHovered(false)}
            style={{
              filter: `brightness(${minesweeperHovered ? 150 : 100}%)`,
            }}
            alt="マインスイーパー"
          ></img>
        </div>
        <div className={styles.box}>
          <img
            src={DROP_BLOCK_THUMBNAIL}
            onClick={() => navigate("/game/blockbreaker")}
            onMouseEnter={() => setBlockBreakerHovered(true)}
            onMouseLeave={() => setBlockBreakerHovered(false)}
            style={{
              filter: `brightness(${blockbreakerHovered ? 150 : 100}%)`,
            }}
            alt="ブロック崩し"
          ></img>
        </div>
      </div>
    </div>
  );
};

export default Home;
