import { useState, useEffect } from "react";
import Gamepad from "react-gamepad";

const Tetris = () => {
  const FIELD_WIDTH = 12;
  const FIELD_HEIGHT = 21;
  const BLOCK_SIZE = 15;
  const X0 = 210;
  const Y0 = 240;

  const MAX_HP = [3, 5, 7, 12, 10, 15];
  const ATTACK_COUNT = [7, 5, 4, 3, 5, 2];

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

  const EASY_ENEMY = "src/assets/slime.png";
  const NORMAL_ENEMY = "src/assets/mummy.png";
  const HARD_ENEMY = "src/assets/devil.png";
  const EXPERT_ENEMY = "src/assets/shinigami.png";
  const SECRET1_ENEMY = "src/assets/mao.png";
  const SECRET2_ENEMY = "src/assets/dragon.png";
  const ENDLESS_ENEMY = "src/assets/heishi.png";

  const CHARA_YUSHA = "src/assets/yusha.png";
  const CHARA_SENSHI = "src/assets/senshi.png";
  const CHARA_MAHOTSUKAI = "src/assets/mahotsukai.png";

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

  const [timer, setTimer] = useState(0);

  const [x, setX] = useState(4);
  const [y, setY] = useState(0);
  const [rotStatus, setRotStatus] = useState(0);
  const [selectLevel, setSelectLevel] = useState(0);
  const [selectChara, setSelectChara] = useState(false);
  const [charaIdx, setCharaIdx] = useState(0);
  const [skillCount, setSkillCount] = useState(5);
  const [hp, setHp] = useState(MAX_HP[selectLevel]);
  const [atCount, setAtCount] = useState(ATTACK_COUNT[selectLevel]);
  const [minoIdx, setMinoIdx] = useState(0);
  const [holdIdx, setHoldIdx] = useState(-1);
  const [nextMino, setNextMino] = useState([-1, -1, -1]);
  const [prevMino, setPrevMino] = useState([0, 0, 0, 0, 0, 0, 0]);

  const [gameStatus, setGameStatus] = useState(0);

  const [gameOverFlag, setGameOverFlag] = useState(false);
  const [gameClearFlag, setGameClearFlag] = useState(false);
  const [gameReadyFlag, setGameReadyFlag] = useState(false);
  const [holdFlag, setHoldFlag] = useState(true);
  const [tspinFlag, setTspinFlag] = useState(false);
  const [secretFlag, setSecretFlag] = useState(false);

  const canMove = (dx, dy, rot) => {
    const mino = MINO[minoIdx][rot];
    return !mino.find((m, i) => minoStatus[dy + m[1]][dx + m[0]] >= 1);
  };

  const hold = () => {
    if (holdIdx === -1) {
      setHoldIdx(minoIdx);
      newMino(-1);
    } else {
      const tmp = holdIdx;
      setHoldIdx(minoIdx);
      newMino(tmp);
    }
  };

  const handleKeyFunction = (event, button) => {
    const k = event ? event.keyCode : button;
    console.log(k);

    let dx = 4;
    let dy = 0;
    let rot = 0;

    if (gameStatus === 0) {
      if (k === 13) {
        setGameStatus(1);
      }
    } else if (gameStatus === 1) {
      if (k === 13) {
        if (selectLevel <= -1) {
          setSelectChara(true);
        }
        setGameStatus(2);
      } else if (k === 27) {
        setGameStatus(0);
      } else if (k === 40) {
        if (
          selectLevel === 0 ||
          selectLevel === 1 ||
          selectLevel === 3 ||
          selectLevel === 4
        ) {
          setSelectLevel((prevLevel) => prevLevel + 1);
        } else if (selectLevel === 2) {
          setSelectLevel(-1);
        } else if (selectLevel === 5) {
          setSelectLevel(-2);
        }
      } else if (k === 38) {
        if (
          selectLevel === 1 ||
          selectLevel === 2 ||
          selectLevel === 4 ||
          selectLevel === 5
        ) {
          setSelectLevel((prevLevel) => prevLevel - 1);
        } else if (selectLevel === -1) {
          setSelectLevel(2);
        } else if (selectLevel === -2) {
          setSelectLevel(5);
        }
      } else if (k === 39) {
        if (selectLevel >= 0 && selectLevel <= 2) {
          setSelectLevel((prevLevel) => prevLevel + 3);
        } else if (selectLevel === -1) {
          setSelectLevel(-2);
        }
      } else if (k === 37) {
        if (selectLevel >= 3 && selectLevel <= 5) {
          setSelectLevel((prevLevel) => prevLevel - 3);
        } else if (selectLevel === -2) {
          setSelectLevel(-1);
        }
      }
    } else {
      if (k === 27 && !gameReadyFlag) {
        setGameStatus(1);
      }
    }

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
          dy--;
          setHoldFlag(true);
          setTspinFlag(false);

          setupField(dy);
          deleteLine();
          newMino(-1);
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
            setHoldFlag(false);
            hold();
            dx = 4;
            dy = 0;
            rot = 0;
          }
        } else if (k === 81 && skillCount === 0) {
          skill();
          setSkillCount(5);
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

  const setupField = (dy = 0) => {
    const mino = MINO[minoIdx][rotStatus];
    let newMinoStatus = [...minoStatus];
    mino.forEach((m) => {
      newMinoStatus[dy === 0 ? y + m[1] : dy + m[1]][x + m[0]] = minoIdx + 2;
    });
    setMinoStatus(newMinoStatus);
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

  const attack = () => {
    if (atCount === 0) {
      let at = [1, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 1];
      const randomIndex = Math.floor(Math.random() * 10);
      at[randomIndex + 1] = 0;
      const newStatus = [...minoStatus];
      newStatus.splice(0, 1);
      newStatus.splice(FIELD_HEIGHT - 2, 0, at);
      setMinoStatus(newStatus);
      setAtCount(ATTACK_COUNT[selectLevel]);
    } else {
      setAtCount((prevCount) => prevCount - 1);
    }
  };

  const skill = () => {
    if (charaIdx === 0) {
      const newMinoStatus = [...minoStatus];
      newMinoStatus.splice(FIELD_HEIGHT - 6, 5);
      newMinoStatus.splice(
        0,
        0,
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]
      );
      setMinoStatus(newMinoStatus);
    } else if (charaIdx === 1) {
      setHp((prevY) => prevY - 3);
    } else if (charaIdx === 2) {
      setAtCount((prevCount) => prevCount + 5);
    }
  };

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

    if (holdFlag) {
      attack();
    }
  };

  const downCheck = () => {
    if (canMove(x, y + 1, rotStatus)) {
      setY((prevY) => prevY + 1);
    } else {
      setHoldFlag(true);
      setTspinFlag(false);

      setupField();
      deleteLine();
      newMino(-1);
    }
  };

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
                fill={!gameOverFlag || m <= 1 ? COLOR[m] : "black"}
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
              fill={!gameOverFlag ? col : "black"}
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
    return (
      <g>
        {!gameOverFlag &&
          mino.map((m, i) => {
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
          y={Y0 + BLOCK_SIZE}
          fill="white"
          fontSize={BLOCK_SIZE}
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
        <text
          x={X0 - 55}
          y={Y0 + BLOCK_SIZE}
          fill="white"
          fontSize={BLOCK_SIZE}
        >
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

  const DrawEnemy = () => {
    const enemy = () => {
      switch (selectLevel) {
        case 0:
          return <image href={EASY_ENEMY} width={100} height={100}></image>;
        case 1:
          return <image href={NORMAL_ENEMY} width={100} height={100}></image>;
        case 2:
          return <image href={HARD_ENEMY} width={100} height={100}></image>;
        case 3:
          return <image href={EXPERT_ENEMY} width={100} height={100}></image>;
        case 4:
          return !secretFlag ? (
            <image href={SECRET1_ENEMY} width={100} height={100}></image>
          ) : (
            <image
              href={SECRET2_ENEMY}
              x={-BLOCK_SIZE * 3 - 5}
              y={-BLOCK_SIZE * 4}
              width={200}
              height={200}
            ></image>
          );
        case 5:
          return <image href={ENDLESS_ENEMY} width={100} height={100}></image>;
      }
    };
    return (
      <g
        transform={`translate(${X0 + BLOCK_SIZE * 2.5},${Y0 - BLOCK_SIZE * 9})`}
      >
        {enemy()}
      </g>
    );
  };

  const DrawHp = () => {
    return (
      <g transform={`translate(${X0}, ${Y0 - BLOCK_SIZE * 2.5})`}>
        <rect
          width={canvasWidth}
          height={BLOCK_SIZE * 1.5}
          stroke="green"
        ></rect>
        {selectLevel <= 3 ? (
          hp >= 0 &&
          [...Array(hp)].map((_, i) => {
            return (
              <rect
                x={i * (canvasWidth / MAX_HP[selectLevel])}
                width={canvasWidth / MAX_HP[selectLevel]}
                height={BLOCK_SIZE * 1.5}
                fill="green"
                stroke="transparent"
                key={i}
              ></rect>
            );
          })
        ) : (
          <g>
            {hp >= 0 &&
              [...Array(hp)].map((_, i) => {
                return (
                  <rect
                    x={i * (canvasWidth / MAX_HP[!secretFlag ? 4 : 5])}
                    width={canvasWidth / MAX_HP[!secretFlag ? 4 : 5]}
                    height={BLOCK_SIZE * 1.5}
                    fill="green"
                    stroke="transparent"
                    key={i}
                  ></rect>
                );
              })}
          </g>
        )}
      </g>
    );
  };

  const DrawAttack = () => {
    const col = atCount === 0 ? "red" : atCount === 1 ? "yellow" : "green";
    return (
      <g
        transform={`translate(${X0 - BLOCK_SIZE * 4 - 5},${
          Y0 + BLOCK_SIZE * 4 + 5
        })`}
      >
        <rect
          width={BLOCK_SIZE * 4}
          height={BLOCK_SIZE * 6}
          stroke="white"
        ></rect>
        <text x={6} y={BLOCK_SIZE} fontSize={BLOCK_SIZE - 1} fill="white">
          ENEMY
        </text>
        <text x={2} y={BLOCK_SIZE * 2} fontSize={BLOCK_SIZE - 1} fill="white">
          ATTACK
        </text>
        <text
          x={BLOCK_SIZE * 1.5}
          y={BLOCK_SIZE * 4}
          fontSize={BLOCK_SIZE * 1.5}
          fill={col}
        >
          {atCount}
        </text>
      </g>
    );
  };

  const DrawSkill = () => {
    const chara = () => {
      switch (charaIdx) {
        case 0:
          return (
            <image
              href={CHARA_YUSHA}
              x={5}
              y={BLOCK_SIZE * 4}
              width={50}
              height={50}
            ></image>
          );
        case 1:
          return (
            <image
              href={CHARA_SENSHI}
              x={5}
              y={BLOCK_SIZE * 4}
              width={50}
              height={50}
            ></image>
          );
        case 2:
          return (
            <image
              href={CHARA_MAHOTSUKAI}
              x={5}
              y={BLOCK_SIZE * 4}
              width={50}
              height={50}
            ></image>
          );
      }
    };
    return (
      <g
        transform={`translate(${X0 - BLOCK_SIZE * 4 - 5},${
          Y0 + BLOCK_SIZE * 13
        })`}
      >
        <rect
          width={BLOCK_SIZE * 4}
          height={BLOCK_SIZE * 8}
          stroke="white"
        ></rect>
        <text x={10} y={BLOCK_SIZE} fill="white" fontSize={BLOCK_SIZE}>
          SKILL
        </text>
        <text
          x={BLOCK_SIZE * 1.5}
          y={BLOCK_SIZE * 3}
          fill="white"
          fontSize={BLOCK_SIZE * 1.5}
        >
          {skillCount}
        </text>
        {chara()}
      </g>
    );
  };

  const DrawReady = () => {
    return (
      <g transform={`translate(${X0 + BLOCK_SIZE * 2},${Y0 + BLOCK_SIZE * 8})`}>
        <rect
          x={0}
          y={0}
          width={BLOCK_SIZE * 8}
          height={BLOCK_SIZE * 4}
          fill="black"
          stroke="white"
        ></rect>
        <text
          x={BLOCK_SIZE * 1.5}
          y={BLOCK_SIZE * 2.25}
          fontSize="20"
          fill="white"
        >
          Ready?
        </text>
      </g>
    );
  };

  const DrawGameclear = () => {
    return (
      <g transform={`translate(${X0 + BLOCK_SIZE * 2},${Y0 + BLOCK_SIZE * 8})`}>
        <rect
          x={0}
          y={0}
          width={BLOCK_SIZE * 8}
          height={BLOCK_SIZE * 4}
          fill="black"
          stroke="white"
        ></rect>
        <text
          x={BLOCK_SIZE * 0.25}
          y={BLOCK_SIZE * 1.5}
          fontSize="20"
          fill="white"
        >
          GameClear!
        </text>
        <text
          x={BLOCK_SIZE * 1.5}
          y={BLOCK_SIZE * 3.5}
          fontSize={BLOCK_SIZE}
          fill="white"
        >
          Press Esc
        </text>
      </g>
    );
  };

  const DrawGameover = () => {
    return (
      <g transform={`translate(${X0 + BLOCK_SIZE * 2},${Y0 + BLOCK_SIZE * 8})`}>
        <rect
          x={0}
          y={0}
          width={BLOCK_SIZE * 8}
          height={BLOCK_SIZE * 4}
          fill="black"
          stroke="white"
        ></rect>
        <text
          x={BLOCK_SIZE * 0.25}
          y={BLOCK_SIZE * 1.5}
          fontSize="20"
          fill="white"
        >
          Game Over
        </text>
        <text
          x={BLOCK_SIZE * 1.5}
          y={BLOCK_SIZE * 3.5}
          fontSize={BLOCK_SIZE}
          fill="white"
        >
          Press Esc
        </text>
      </g>
    );
  };

  const DrawTitle = () => {
    return (
      <g>
        <text x={125} y={100} fill="white" fontSize={50}>
          TETRIS QUEST
        </text>
        <image href={CHARA_YUSHA} x="100" y="150" width={100} height={100} />
        <image href={CHARA_SENSHI} x="250" y="150" width={100} height={100} />
        <image
          href={CHARA_MAHOTSUKAI}
          x="400"
          y="150"
          width={100}
          height={100}
        />
        <image href={EASY_ENEMY} x="100" y="300" width={100} height={100} />
        <image href={NORMAL_ENEMY} x="250" y="300" width={100} height={100} />
        <image href={EXPERT_ENEMY} x="400" y="300" width={100} height={100} />
        <text x={225} y={500} fill="white" fontSize={30}>
          Press Enter
        </text>
      </g>
    );
  };

  const DrawSelect = () => {
    return (
      <g>
        <text
          x="590"
          y="30"
          fontSize="20"
          dominantBaseline="Hanging"
          textAnchor="end"
          fill="white"
        >
          illust:DOT ILLUST
        </text>
        <text
          x="590"
          y="10"
          fontSize="20"
          dominantBaseline="Hanging"
          textAnchor="end"
          fill="white"
        >
          music:魔王魂
        </text>

        <g transform="translate(0,-70)">
          <g transform="translate(10,150)">
            <image href={EASY_ENEMY} y="0" width={100} height={100} />
            <image href={NORMAL_ENEMY} y="150" width={100} height={100} />
            <image href={HARD_ENEMY} y="300" width={100} height={100} />
          </g>
          <g transform="translate(150, 210)" fill="white" fontSize="30">
            <text
              x="20"
              y="0"
              style={{
                textDecoration: selectLevel === 0 && "underline",
              }}
            >
              EASY
            </text>

            <text
              x="0"
              y="150"
              style={{ textDecoration: selectLevel === 1 && "underline" }}
            >
              NORMAL
            </text>
            <text
              x="20"
              y="300"
              style={{ textDecoration: selectLevel === 2 && "underline" }}
            >
              HARD
            </text>
            <text
              x="-70"
              y="420"
              style={{ textDecoration: selectLevel === -1 && "underline" }}
            >
              How To Play
            </text>
          </g>

          <g transform="translate(300,150)">
            <image href={EXPERT_ENEMY} y="0" width={100} height={100} />
            <image href={SECRET1_ENEMY} y="150" width={100} height={100} />
            <image href={ENDLESS_ENEMY} y="300" width={100} height={100} />
          </g>
          <g transform="translate(440,210)" fill="white" fontSize="30">
            <text
              x="0"
              y="0"
              style={{ textDecoration: selectLevel === 3 && "underline" }}
            >
              EXPERT
            </text>
            <text
              x="0"
              y="150"
              fill="yellow"
              style={{ textDecoration: selectLevel === 4 && "underline" }}
            >
              SECRET
            </text>
            <text
              x="-10"
              y="300"
              style={{
                textDecoration: selectLevel === 5 && "underline",
              }}
            >
              ENDLESS
            </text>
            <text
              x="-70"
              y="420"
              style={{ textDecoration: selectLevel === -2 && "underline" }}
            >
              Select Chara
            </text>
          </g>
        </g>
        <line
          x1="0"
          y1="500"
          x2="600"
          y2="500"
          stroke="white"
          strokeDasharray="15"
        ></line>
      </g>
    );
  };

  const DrawGame = () => {
    return (
      <g>
        <DrawField></DrawField>

        {!gameReadyFlag && (
          <g>
            <DrawMino></DrawMino>
            <DrawForecast></DrawForecast>
          </g>
        )}

        <DrawNext></DrawNext>
        <DrawHold></DrawHold>
        <DrawEnemy></DrawEnemy>
        <DrawHp></DrawHp>
        <DrawAttack></DrawAttack>
        <DrawSkill></DrawSkill>

        {gameReadyFlag && <DrawReady></DrawReady>}
        {gameClearFlag && <DrawGameclear></DrawGameclear>}
        {gameOverFlag && <DrawGameover></DrawGameover>}
      </g>
    );
  };

  useEffect(() => {
    if (gameStatus === 2) {
      setGameReadyFlag(true);
      setX(4);
      setY(0);
      setRotStatus(0);
      setSkillCount(5);
      setHp(MAX_HP[selectLevel]);
      setAtCount(ATTACK_COUNT[selectLevel]);
      setMinoIdx(0);
      setHoldIdx(-1);
      setNextMino([-1, -1, -1]);
      setPrevMino([0, 0, 0, 0, 0, 0, 0]);
      setGameOverFlag(false);
      setGameClearFlag(false);
      setHoldFlag(true);
      setTspinFlag(false);
      setSecretFlag(false);
      setMinoStatus([
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
    }
    const timeoutId = setTimeout(() => {
      setGameReadyFlag(false);
      next();
    }, 2000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [gameStatus]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyFunction);
    return () => {
      document.removeEventListener("keydown", handleKeyFunction);
    };
  }, [handleKeyFunction]);

  useEffect(() => {
    next();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!gameReadyFlag) {
        if (hp <= 0) {
          if (!secretFlag && selectLevel === 4) {
            // secret第二スタート
          } else {
            //ゲームクリア
            setGameClearFlag(true);
          }
        } else if (canMove(x, y, rotStatus)) {
          downCheck();
        } else {
          console.log("gameover");
          setGameOverFlag(true);
        }
      }
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [y, canMove]);

  return (
    <Gamepad
      onA={() => {
        if (gameStatus === 1) {
          handleKeyFunction(false, 27);
        } else {
          handleKeyFunction(false, 65);
        }
      }}
      onB={() => {
        if (gameStatus === 0 || gameStatus === 1) {
          handleKeyFunction(false, 13);
        } else {
          handleKeyFunction(false, 68);
        }
      }}
      onX={() => {
        handleKeyFunction(false, 81);
      }}
      onY={() => {
        handleKeyFunction(false, 81);
      }}
      onUp={() => {
        handleKeyFunction(false, 38);
      }}
      onDown={() => {
        handleKeyFunction(false, 40);
      }}
      onLeft={() => {
        handleKeyFunction(false, 37);
      }}
      onRight={() => {
        handleKeyFunction(false, 39);
      }}
      onLB={() => {
        handleKeyFunction(false, 83);
      }}
      onLT={() => {
        handleKeyFunction(false, 83);
      }}
      onRB={() => {
        handleKeyFunction(false, 83);
      }}
      onRT={() => {
        handleKeyFunction(false, 83);
      }}
      onStart={() => {
        handleKeyFunction(false, 27);
      }}
      onBack={() => {
        handleKeyFunction(false, 27);
      }}
    >
      <svg
        width="600"
        height="600"
        viewBox="0, 0, 600, 600"
        xmlns="http://www.w3.org/2000/svg"
        style={{ backgroundColor: "black" }}
      >
        {gameStatus === 0 && <DrawTitle></DrawTitle>}
        {gameStatus === 1 && <DrawSelect></DrawSelect>}
        {gameStatus === 2 && <DrawGame></DrawGame>}
      </svg>
    </Gamepad>
  );
};

export default Tetris;
