import { useEffect, useCallback, useState } from "react";

const Tetris = () => {
  const FIELD_WIDTH = 12;
  const FIELD_HEIGHT = 21;
  const BLOCK_SIZE = 15;
  const X0 = 235;
  const Y0 = 220;

  const MINO = [
    // Imino
    [
      [
        [0, 0],
        [1, 0],
        [2, 0],
        [3, 0],
      ],
      [
        [2, 0],
        [2, 1],
        [2, 2],
        [2, 3],
      ],
      [
        [0, 1],
        [1, 1],
        [2, 1],
        [3, 1],
      ],
      [
        [1, 0],
        [1, 1],
        [1, 2],
        [1, 3],
      ],
    ],
    // Tmino
    [
      [
        [1, 0],
        [0, 1],
        [1, 1],
        [2, 1],
      ],
      [
        [1, 0],
        [1, 1],
        [2, 1],
        [1, 2],
      ],
      [
        [0, 1],
        [1, 1],
        [2, 1],
        [1, 2],
      ],
      [
        [1, 0],
        [0, 1],
        [1, 1],
        [1, 2],
      ],
    ],
    // Omino
    [
      [
        [1, 0],
        [2, 0],
        [1, 1],
        [2, 1],
      ],
      [
        [1, 0],
        [2, 0],
        [1, 1],
        [2, 1],
      ],
      [
        [1, 0],
        [2, 0],
        [1, 1],
        [2, 1],
      ],
      [
        [1, 0],
        [2, 0],
        [1, 1],
        [2, 1],
      ],
    ],
    // Smino
    [
      [
        [1, 0],
        [2, 0],
        [0, 1],
        [1, 1],
      ],
      [
        [0, 0],
        [0, 1],
        [1, 1],
        [1, 2],
      ],
      [
        [1, 0],
        [2, 0],
        [0, 1],
        [1, 1],
      ],
      [
        [0, 0],
        [0, 1],
        [1, 1],
        [1, 2],
      ],
    ],
    // Zmino
    [
      [
        [0, 0],
        [1, 0],
        [1, 1],
        [2, 1],
      ],
      [
        [1, 0],
        [0, 1],
        [1, 1],
        [0, 2],
      ],
      [
        [0, 0],
        [1, 0],
        [1, 1],
        [2, 1],
      ],
      [
        [1, 0],
        [0, 1],
        [1, 1],
        [0, 2],
      ],
    ],
    // Jmino
    [
      [
        [0, 0],
        [0, 1],
        [1, 1],
        [2, 1],
      ],
      [
        [0, 0],
        [1, 0],
        [0, 1],
        [0, 2],
      ],
      [
        [0, 0],
        [1, 0],
        [2, 0],
        [2, 1],
      ],
      [
        [1, 0],
        [1, 1],
        [0, 2],
        [1, 2],
      ],
    ],
    // Lmino
    [
      [
        [2, 0],
        [0, 1],
        [1, 1],
        [2, 1],
      ],
      [
        [0, 0],
        [0, 1],
        [0, 2],
        [1, 2],
      ],
      [
        [0, 0],
        [1, 0],
        [2, 0],
        [0, 1],
      ],
      [
        [0, 0],
        [1, 0],
        [1, 1],
        [1, 2],
      ],
    ],
  ];

  const COLOR = [
    "darkgray",
    "black",
    "cyan",
    "darkviolet",
    "yellow",
    "green",
    "red",
    "blue",
    "orange",
    "dimgray",
  ];

  const canvasWidth = FIELD_WIDTH * BLOCK_SIZE;
  const canvasHeight = FIELD_HEIGHT * BLOCK_SIZE;

  const [minoStatus, setMinoStatus] = useState([
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ]);

  const [timer, setTimer] = useState(false);

  const [x, setX] = useState(4);
  const [y, setY] = useState(0);
  const [rotStatus, setRotStatus] = useState(0);
  const [minoIdx, setMinoIdx] = useState(0);
  const [holdIdx, setHoldIdx] = useState(-1);
  const [nextMino, setNextMino] = useState([-1, -1, -1]);
  const [prevMino, setPrevMino] = useState([0, 0, 0, 0, 0, 0, 0]);

  const [gameStatus, setGameStatus] = useState(2);

  const [gameOverFlag, setGameOverFlag] = useState(false);
  const [gameReadyFlag, setGameReadyFlag] = useState(false);
  const [holdFlag, setHoldFlag] = useState(true);
  const [canUpFlag, setCanUpFlag] = useState(true);
  const [tspinFlag, setTspinFlag] = useState(false);

  const canMove = (dx, dy, rot) => {
    const mino = MINO[minoIdx][rot];
    return !mino.find((m, i) => minoStatus[dy + m[1]][dx + m[0]] >= 1);
  };

  const hold = () => {
    if (holdIdx === -1) {
      setHoldIdx(minoIdx);
      setHoldFlag(false);
      newMino(-1);
    } else {
      const tmp = holdIdx;
      setHoldIdx(minoIdx);
      setHoldFlag(false);
      newMino(tmp);
    }
  };

  const handleKeyFunction = (event) => {
    const k = event.keyCode;

    let dx = 4;
    let dy = 0;
    let rot = 0;

    if (gameStatus === 2) {
      dx = x;
      dy = y;
      rot = rotStatus;
    }

    if (gameStatus === 2) {
      if (!gameOverFlag && !gameReadyFlag) {
        if (k === 37) {
          dx--;
        } else if (k === 39) {
          dx++;
        } else if (k === 38) {
          while (canMove(x, dy, rotStatus)) {
            dy++;
          }
          downCheck(1);
          dy--;

          setCanUpFlag(true);
        } else if (k === 40) {
          dy++;
        } else if (k === 65) {
          rot--;
          if (rot === -1) rot = 3;
        } else if (k === 68) {
          rot++;
          if (rot === 4) rot = 0;
        } else if (k === 83) {
          if (holdFlag) {
            // hold.sound()
            hold();
          }
        }
      }

      // tspin

      if (canMove(dx, dy, rot)) {
        setX(dx);
        setY(dy);
        setRotStatus(rot);
        if (
          ((k >= 37 && k <= 40) || k == 65 || k == 68) &&
          k != 38 &&
          k != 83
        ) {
          // move_sound.play()
        }
      }
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyFunction);
    return () => {
      document.removeEventListener("keydown", handleKeyFunction);
    };
  }, [handleKeyFunction]);

  const setupField = () => {
    const mino = MINO[minoIdx][rotStatus];
    const col = COLOR[minoIdx + 2];
    let newMinoStatus = [...minoStatus];
    mino.forEach((m) => {
      newMinoStatus[y + m[1]][x + m[0]] = minoIdx + 2;
    });
    setMinoStatus(newMinoStatus);
  };

  const setupRandomMino = () => {
    const count = prevMino.filter((item) => item === 1).length;
    let newPrevMino = [...prevMino];
    if (count === 7) {
      newPrevMino = [0, 0, 0, 0, 0, 0, 0];
    }

    while (true) {
      const randomIndex = Math.floor(Math.random() * 7);
      if (newPrevMino[randomIndex] === 0) {
        newPrevMino[randomIndex] = 1;
        break;
      }
    }

    setPrevMino(newPrevMino);
    return;
  };

  const next = () => {
    const count = nextMino.filter((item) => item === -1).length;
    if (count === 3) {
      let newPrevMino = [0, 0, 0, 0, 0, 0, 0];

      let firstIndex = Math.floor(Math.random() * 7);
      newPrevMino[firstIndex] = 1;

      setMinoIdx(firstIndex);

      const newNextMino = nextMino.map(() => {
        let randomIndex;
        while (true) {
          randomIndex = Math.floor(Math.random() * 7);
          if (newPrevMino[randomIndex] === 0) {
            newPrevMino[randomIndex] = 1;
            break;
          }
        }
        return randomIndex;
      });
      setNextMino(newNextMino);
      setPrevMino(newPrevMino);
    } else {
      let newPrevMino =
        prevMino.filter((item) => item === 1).length === 7
          ? [0, 0, 0, 0, 0, 0, 0]
          : [...prevMino];

      let randomIndex;
      while (true) {
        randomIndex = Math.floor(Math.random() * 7);
        if (newPrevMino[randomIndex] === 0) {
          newPrevMino[randomIndex] = 1;
          break;
        }
      }
      setMinoIdx(nextMino[0]);
      setNextMino([nextMino[1], nextMino[2], randomIndex]);
      setPrevMino(newPrevMino);
    }
  };

  const attack = () => {};

  const deleteLine = () => {
    let newMinoStatus = [...minoStatus];
    newMinoStatus.forEach((items, i) => {
      let count = items.filter((item) => item >= 1).length;
      if (count === FIELD_WIDTH && i !== FIELD_HEIGHT - 1) {
        newMinoStatus.splice(i, 1);
        newMinoStatus.splice(0, 0, [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]);
      }
    });
    setMinoStatus(newMinoStatus);
    // damage_sound.play()
  };

  const newMino = (index) => {
    setX(4);
    setY(0);
    setRotStatus(0);
    if (index === -1) {
      setMinoIdx(nextMino[0]);
      next();
    } else {
      setMinoIdx(index);
    }

    /* if(holdFlag) {
        attack();
    } */
  };

  // index = 1 急降下、 index = 0 降下中
  const downCheck = (index) => {
    if (canMove(x, y + 1, rotStatus)) {
      setY((prevY) => prevY + 1);
    } else {
      setHoldFlag(true);
      setTspinFlag(false);
      if (index === 1) {
        setCanUpFlag(false);
      }
      setupField();
      deleteLine();
      newMino(-1);
    }
  };

  useEffect(() => {
    next();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      downCheck(0);
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [y]);

  const DrawField = () => {
    return (
      <g>
        {minoStatus.map((mino, y) => {
          return mino.map((m, x) => {
            const x1 = x * BLOCK_SIZE + X0;
            const y1 = y * BLOCK_SIZE + Y0;
            return (
              <rect
                x={x1}
                y={y1}
                width={BLOCK_SIZE}
                height={BLOCK_SIZE}
                fill={COLOR[m]}
                stroke="white"
                key={`field${y}-${x}`}
              ></rect>
            );
          });
        })}
      </g>
    );
  };

  const DrawMino = () => {
    const mino = MINO[minoIdx][rotStatus];
    const col = COLOR[minoIdx + 2];
    return (
      <g>
        {mino.map((m, i) => {
          const x1 = (x + m[0]) * BLOCK_SIZE + X0;
          const y1 = (y + m[1]) * BLOCK_SIZE + Y0;
          return (
            <rect
              x={x1}
              y={y1}
              width={BLOCK_SIZE}
              height={BLOCK_SIZE}
              stroke="white"
              fill={col}
              key={`mino${i}`}
            ></rect>
          );
        })}
      </g>
    );
  };

  const DrawForecast = () => {
    const mino = MINO[minoIdx][rotStatus];
    const col = COLOR[minoIdx + 2];
    let dy = y;
    while (canMove(x, dy, rotStatus)) {
      dy++;
    }
    dy--;
    console.log(y);
    return (
      <g>
        {mino.map((m, i) => {
          const x1 = (x + m[0]) * BLOCK_SIZE + X0;
          const y1 = (dy + m[1]) * BLOCK_SIZE + Y0;
          return (
            <rect
              x={x1}
              y={y1}
              width={BLOCK_SIZE}
              height={BLOCK_SIZE}
              stroke={col}
              fill="transparent"
              key={`forecast${i}`}
            ></rect>
          );
        })}
      </g>
    );
  };

  const DrawNext = () => {
    const dx = 1.5;
    const dy = 2.5;
    const flag = nextMino.find((item) => item === -1);
    const smallBlockSize = (BLOCK_SIZE * 2) / 3;
    return (
      <g>
        <rect
          x={X0 + canvasWidth + 5}
          y={Y0}
          width={BLOCK_SIZE * 4}
          height={BLOCK_SIZE * 12}
          fill="black"
          stroke="white"
        ></rect>
        <text
          x={X0 + canvasWidth + BLOCK_SIZE}
          y={Y0 + 15}
          fill="white"
          fontSize="15"
        >
          NEXT
        </text>
        {!flag &&
          nextMino.map((index, i) => {
            const mino = MINO[index][0];
            const col = COLOR[index + 2];

            return mino.map((m, j) => {
              const x1 =
                index === 2 || index === 0
                  ? (dx + m[0] - 0.5) * smallBlockSize + X0 + canvasWidth + 5
                  : (dx + m[0]) * smallBlockSize + X0 + canvasWidth + 5;
              const y1 = (dy + m[1]) * smallBlockSize + Y0 + i * BLOCK_SIZE * 4;
              return (
                <rect
                  x={x1}
                  y={y1}
                  width={smallBlockSize}
                  height={smallBlockSize}
                  stroke="white"
                  fill={col}
                  key={`next${i}-${j}`}
                ></rect>
              );
            });
          })}
      </g>
    );
  };

  const DrawHold = () => {
    const dx = 3;
    const dy = 3;
    const smallBlockSize = (BLOCK_SIZE * 2) / 3;
    return (
      <g>
        <rect
          x={X0 - 65}
          y={Y0}
          width={BLOCK_SIZE * 4}
          height={BLOCK_SIZE * 4}
          fill="black"
          stroke="white"
        ></rect>
        <text x={X0 - 55} y={Y0 + 15} fill="white" fontSize="15">
          HOLD
        </text>
        {holdIdx !== -1 &&
          MINO[holdIdx][0].map((m, i) => {
            const x1 =
              holdIdx === 2 || holdIdx === 0
                ? (dx + m[0] - 0.5) * smallBlockSize + X0 - BLOCK_SIZE * 5 - 5
                : (dx + m[0]) * smallBlockSize + X0 - BLOCK_SIZE * 5 - 5;
            const y1 = (dy + m[1]) * smallBlockSize + Y0 - 5;
            return (
              <rect
                x={x1}
                y={y1}
                width={smallBlockSize}
                height={smallBlockSize}
                stroke="white"
                fill={COLOR[holdIdx + 2]}
                key={`hold${i}`}
              ></rect>
            );
          })}
      </g>
    );
  };

  return (
    <svg
      width="600"
      height="540"
      viewBox="0, 0, 600, 540"
      xmlns="http://www.w3.org/2000/svg"
      style={{ backgroundColor: "black" }}
    >
      <DrawField></DrawField>
      <DrawForecast></DrawForecast>
      <DrawMino></DrawMino>

      <DrawNext></DrawNext>
      <DrawHold></DrawHold>
    </svg>
  );
};

export default Tetris;
