import { useState } from "react";

const MineSweeper = () => {
  const FIELD_WIDTH = 10;
  const FIELD_HEIGHT = 10;
  const BLOCK_SIZE = 60;
  const MINE_COUNT = 20;

  const [field, setField] = useState(
    [...Array(FIELD_HEIGHT).keys()].map(() => {
      return [...Array(FIELD_WIDTH).keys()].map(() => {
        return 1; // 1 = 未開封
      });
    })
  );

  const [mineField, setMineField] = useState(
    [...Array(FIELD_HEIGHT).keys()].map(() => {
      return [...Array(FIELD_WIDTH).keys()].map(() => {
        return 0; // 0 = 地雷なし
      });
    })
  );

  const [initialFlag, setInitialFlag] = useState(true);

  const checkEmptyField = (x, y, newField) => {
    if (x < 0 || x >= FIELD_WIDTH || y < 0 || y >= FIELD_HEIGHT) return;
    if (newField[y][x] !== 1) return; // 既に開いているマス
    if (mineField[y][x] !== 0) return; // 地雷があるマス

    // 開けるマスをリストに追加
    newField[y][x] = 0;

    // 8方向を再帰的にチェック
    checkEmptyField(x - 1, y - 1, newField);
    checkEmptyField(x, y - 1, newField);
    checkEmptyField(x + 1, y - 1, newField);
    checkEmptyField(x + 1, y, newField);
    checkEmptyField(x + 1, y + 1, newField);
    checkEmptyField(x, y + 1, newField);
    checkEmptyField(x - 1, y + 1, newField);
    checkEmptyField(x - 1, y, newField);
  };

  const handleFieldClick = (event, x, y) => {
    if (initialFlag) {
      if (event.button === 2) return;

      const buffField = [...field];
      const buffMineField = [...mineField];

      // 地雷の配置
      for (let i = 0; i < MINE_COUNT; i++) {
        while (true) {
          const newMineX = Math.floor(Math.random() * FIELD_WIDTH);
          const newMineY = Math.floor(Math.random() * FIELD_HEIGHT);
          if (
            !(newMineX === x && newMineY === y) &&
            buffMineField[newMineY][newMineX] === 0
          ) {
            buffMineField[newMineY][newMineX] = -1;

            // 8方向の地雷数カウント
            for (let i = -1; i <= 1; i++) {
              for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) continue;
                const nx = newMineX + i;
                const ny = newMineY + j;
                if (
                  nx >= 0 &&
                  nx < FIELD_WIDTH &&
                  ny >= 0 &&
                  ny < FIELD_HEIGHT &&
                  buffMineField[ny][nx] !== -1
                ) {
                  buffMineField[ny][nx]++;
                }
              }
            }
            break;
          }
        }
      }

      setInitialFlag(false);
      setMineField(buffMineField);

      // 初回クリック時に周囲を開ける
      if (buffMineField[y][x] === 0) {
        const newField = [...field];
        checkEmptyField(x, y, newField);
        setField(newField);
      } else {
        buffField[y][x] = 0;
        setField(buffField);
      }
    } else {
      if (event.button === 2) {
        const buffField = [...field];
        buffField[y][x] = buffField[y][x] === 1 ? 2 : 1;
        setField(buffField);
      } else {
        const buffField = [...field];
        buffField[y][x] = 0;
        const newField = [...buffField];
        checkEmptyField(x, y, newField);
        setField(newField);
      }
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
                          transform={`translate(${BLOCK_SIZE / 2}, ${
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
