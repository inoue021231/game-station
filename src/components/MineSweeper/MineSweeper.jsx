import { useState } from "react";

const MineSweeper = () => {
  const FIELD_WIDTH = 10;
  const FIELD_HEIGHT = 10;
  const BLOCK_SIZE = 60;
  const MINE_COUNT = 20;
  const COLOR = [
    "darkgray",
    "black",
    "blue", //1
    "red", //3
    "green", //2
    "yellow",
    "darkviolet",
    "cyan",
    "orange",
    "dimgray",
  ];

  const [field, setField] = useState(
    [...Array(FIELD_HEIGHT).keys()].map(() => {
      return [...Array(FIELD_HEIGHT).keys()].map(() => {
        return 1;
      });
    })
  );

  const [mineField, setMineField] = useState(
    [...Array(FIELD_HEIGHT).keys()].map(() => {
      return [...Array(FIELD_HEIGHT).keys()].map(() => {
        return 0;
      });
    })
  );

  const [initialFlag, setInitialFlag] = useState(true);

  const handleFieldClick = (event, x, y) => {
    if (initialFlag) {
      if (event.button === 2) return;
      const buffField = [...field];
      buffField[y][x] = 0;
      const buffMineField = [...mineField];
      for (let i = 0; i < MINE_COUNT; i++) {
        while (true) {
          const newMineX = Math.floor(Math.random() * FIELD_WIDTH);
          const newMineY = Math.floor(Math.random() * FIELD_HEIGHT);
          if (
            !(newMineX === x && newMineY === y) &&
            buffMineField[newMineY][newMineX] === 0
          ) {
            buffMineField[newMineY][newMineX] = -1;
            // 左上
            if (
              newMineX !== 0 &&
              newMineY !== 0 &&
              buffMineField[newMineY - 1][newMineX - 1] !== -1
            ) {
              buffMineField[newMineY - 1][newMineX - 1]++;
            }
            // 上
            if (
              newMineY !== 0 &&
              buffMineField[newMineY - 1][newMineX] !== -1
            ) {
              buffMineField[newMineY - 1][newMineX]++;
            }
            // 右上
            if (
              newMineX !== FIELD_WIDTH - 1 &&
              newMineY !== 0 &&
              buffMineField[newMineY - 1][newMineX + 1] !== -1
            ) {
              buffMineField[newMineY - 1][newMineX + 1]++;
            }
            // 右
            if (
              newMineX !== FIELD_WIDTH - 1 &&
              buffMineField[newMineY][newMineX + 1] !== -1
            ) {
              buffMineField[newMineY][newMineX + 1]++;
            }
            // 右下
            if (
              newMineX !== FIELD_WIDTH - 1 &&
              newMineY !== FIELD_HEIGHT - 1 &&
              buffMineField[newMineY + 1][newMineX + 1] !== -1
            ) {
              buffMineField[newMineY + 1][newMineX + 1]++;
            }
            // 下
            if (
              newMineY !== FIELD_HEIGHT - 1 &&
              buffMineField[newMineY + 1][newMineX] !== -1
            ) {
              buffMineField[newMineY + 1][newMineX]++;
            }
            // 左下
            if (
              newMineX !== 0 &&
              newMineY !== FIELD_HEIGHT - 1 &&
              buffMineField[newMineY + 1][newMineX - 1] !== -1
            ) {
              buffMineField[newMineY + 1][newMineX - 1]++;
            }
            // 左
            if (
              newMineX !== 0 &&
              buffMineField[newMineY][newMineX - 1] !== -1
            ) {
              buffMineField[newMineY][newMineX - 1]++;
            }
            break;
          }
        }
      }
      setInitialFlag(false);
      setField(buffField);
      setMineField(buffMineField);
    }
    if (event.button === 2) {
      const buffField = [...field];
      buffField[y][x] = buffField[y][x] === 1 ? 2 : 1;
      setField(buffField);
    } else {
      const buffField = [...field];
      buffField[y][x] = 0;
      setField(buffField);
    }
  };

  return (
    <div style={{ color: "white" }}>
      <svg
        width="600"
        height="600"
        viewBox="0, 0, 600, 600"
        xmlns="http://www.w3.org/2000/svg"
        style={{ backgroundColor: "black" }}
        onContextMenu={(e) => e.preventDefault()}
      >
        {[...Array(FIELD_HEIGHT).keys()].map((y) => {
          return (
            <g key={y}>
              {[...Array(FIELD_WIDTH).keys()].map((x) => {
                return (
                  <g
                    transform={`translate(${x * BLOCK_SIZE}, ${
                      y * BLOCK_SIZE
                    })`}
                    style={{ cursor: "pointer" }}
                    key={`${y}-${x}`}
                  >
                    {field[y][x] ? (
                      <g>
                        <rect
                          x="0"
                          y="0"
                          width={BLOCK_SIZE}
                          height={BLOCK_SIZE}
                          stroke="white"
                          fill="dimgray"
                          onClick={(event) => handleFieldClick(event, x, y)}
                          onContextMenu={(event) =>
                            handleFieldClick(event, x, y)
                          }
                        ></rect>
                        {field[y][x] === 2 && (
                          <text
                            x={BLOCK_SIZE / 2}
                            y={BLOCK_SIZE / 2}
                            fill="white"
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            F
                          </text>
                        )}
                      </g>
                    ) : (
                      <g>
                        <rect
                          x="0"
                          y="0"
                          width={BLOCK_SIZE}
                          height={BLOCK_SIZE}
                          stroke="white"
                          fill={mineField[y][x] !== -1 ? "lightgray" : "red"}
                        ></rect>
                        <g
                          transform={`translate(${BLOCK_SIZE / 2},${
                            BLOCK_SIZE / 2
                          })`}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fontSize="30px"
                        >
                          {mineField[y][x] >= 0 ? (
                            <text
                              fill={
                                mineField[y][x] === 1
                                  ? "blue"
                                  : mineField[y][x] === 2
                                  ? "green"
                                  : mineField[y][x] >= 3
                                  ? "red"
                                  : "transparent"
                              }
                            >
                              {mineField[y][x]}
                            </text>
                          ) : (
                            <text fill="white">-</text>
                          )}
                        </g>
                      </g>
                    )}
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default MineSweeper;
