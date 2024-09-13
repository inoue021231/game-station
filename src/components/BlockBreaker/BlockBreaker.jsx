import { useState, useEffect } from "react";

const BlockBreaker = () => {
  const MAX_WIDTH = 600;
  const MAX_HEIGHT = 600;
  const FIELD_WIDTH = 8;
  const FIELD_HEIGHT = 3;
  const BLOCK_SIZE = 60;
  const BLOCK_COUNT = 24;
  const BALL_SIZE = 10;

  const [blocks, setBlocks] = useState(
    [...Array(FIELD_HEIGHT).keys()]
      .map((y) => {
        return [...Array(FIELD_WIDTH).keys()].map((x) => {
          return {
            x: x * BLOCK_SIZE + BLOCK_SIZE,
            y: (y * BLOCK_SIZE * 3) / 2 + BLOCK_SIZE / 2,
            isAlive: true,
          };
        });
      })
      .flat()
  );
  const [ballPosX, setBallPosX] = useState(MAX_WIDTH / 2);
  const [ballPosY, setBallPosY] = useState(MAX_HEIGHT - BALL_SIZE);
  const [dx, setDx] = useState(1);
  const [dy, setDy] = useState(-2);

  useEffect(() => {
    const interval = setInterval(() => {
      setBallPosX((prevX) => {
        let newX = prevX + dx;

        // 壁にぶつかった場合の反射（X軸）
        if (newX <= BALL_SIZE / 2 || newX >= MAX_WIDTH - BALL_SIZE / 2) {
          setDx((prevDx) => -prevDx);
          newX = prevX + -dx;
        }
        return newX;
      });

      setBallPosY((prevY) => {
        let newY = prevY + dy;

        // 壁にぶつかった場合の反射（Y軸）
        if (newY <= BALL_SIZE / 2 || newY >= MAX_HEIGHT - BALL_SIZE / 2) {
          setDy((prevDy) => -prevDy);
          newY = prevY + -dy;
        }
        return newY;
      });

      // ブロックとの衝突判定
      setBlocks((prevBlocks) => {
        return prevBlocks.map((block) => {
          if (!block.isAlive) return block;

          // ボールがブロックに衝突したかどうかを確認
          const isCollidingX =
            ballPosX + BALL_SIZE / 2 >= block.x &&
            ballPosX - BALL_SIZE / 2 <= block.x + BLOCK_SIZE;
          const isCollidingY =
            ballPosY + BALL_SIZE / 2 >= block.y &&
            ballPosY - BALL_SIZE / 2 <= block.y + BLOCK_SIZE / 2;

          if (isCollidingX && isCollidingY) {
            // X軸方向に衝突した場合
            if (
              ballPosX + BALL_SIZE / 2 >= block.x &&
              ballPosX - BALL_SIZE / 2 <= block.x + BLOCK_SIZE
            ) {
              setDx((prevDx) => -prevDx);
            } else if (
              ballPosY + BALL_SIZE / 2 >= block.y &&
              ballPosY - BALL_SIZE / 2 <= block.y + BLOCK_SIZE / 2
            ) {
              setDy((prevDy) => -prevDy);
            }

            return { ...block, isAlive: false }; // 衝突したブロックを消す
          }

          return block;
        });
      });
    }, 10);

    return () => clearInterval(interval);
  }, [dx, dy, ballPosX, ballPosY]);

  return (
    <div>
      <svg
        width="600"
        height="600"
        viewBox="0, 0, 600, 600"
        xmlns="http://www.w3.org/2000/svg"
        style={{ backgroundColor: "black" }}
      >
        {blocks.length !== 0 &&
          blocks.map((block, index) => {
            return (
              <g transform={`translate(${block.x},${block.y})`} key={index}>
                {block.isAlive && (
                  <rect
                    x="0"
                    y="0"
                    width={BLOCK_SIZE}
                    height={BLOCK_SIZE / 2}
                    stroke="white"
                    fill="lightgray"
                  ></rect>
                )}
              </g>
            );
          })}
        <circle
          cx={ballPosX}
          cy={ballPosY}
          r={BALL_SIZE}
          fill="magenta"
        ></circle>
      </svg>
    </div>
  );
};

export default BlockBreaker;
