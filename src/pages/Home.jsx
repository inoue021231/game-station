import Header from "../components/Header";
import "./Home.scss";
import { useNavigate } from "react-router-dom";

import DROP_BLOCK_THUMBNAIL from "./../assets/thumbnails/drop_block_thumbnail.png";
import { useEffect, useState } from "react";

const Home = () => {
  const [dropblockStatus, setDropBlockStatus] = useState(false);

  const navigate = useNavigate();

  return (
    <div>
      <Header></Header>
      <div className="container">
        <div>
          <img
            className="box"
            src={DROP_BLOCK_THUMBNAIL}
            onClick={() => navigate("/game/dropbrock")}
            onMouseEnter={() => setDropBlockStatus(true)}
            onMouseLeave={() => setDropBlockStatus(false)}
            style={{
              filter: `brightness(${dropblockStatus ? 150 : 100}%)`,
            }}
            alt="落ち物パズルゲーム"
          ></img>
        </div>
        {/* <div>
          <img
            className="box"
            src={DROP_BLOCK_THUMBNAIL}
            alt="Coming soon..."
          ></img>
        </div>
        <div>
          <img
            className="box"
            src={DROP_BLOCK_THUMBNAIL}
            alt="Coming soon..."
          ></img>
        </div> */}
      </div>
    </div>
  );
};

export default Home;
