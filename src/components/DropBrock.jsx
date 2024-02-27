import { useState, useEffect } from "react";
import Gamepad from "react-gamepad";
import useSound from "use-sound";

import CLEAR_MARK from "./../assets/crown.png";
import EASY_ENEMY from "./../assets/slime.png";
import NORMAL_ENEMY from "./../assets/mummy.png";
import HARD_ENEMY from "./../assets/devil.png";
import EXPERT_ENEMY from "./../assets/shinigami.png";
import SECRET1_ENEMY from "./../assets/mao.png";
import SECRET2_ENEMY from "./../assets/dragon.png";
import ENDLESS_ENEMY from "./../assets/heishi.png";
import CHARA_YUSHA from "./../assets/yusha.png";
import CHARA_SENSHI from "./../assets/senshi.png";
import CHARA_MAHOTSUKAI from "./../assets/mahotsukai.png";

import EASY_BGM from "./../assets/easy.mp3";
import NORMAL_BGM from "./../assets/normal.mp3";
import HARD_BGM from "./../assets/hard.mp3";
import EXPERT_BGM from "./../assets/expert.mp3";
import SECRET1_BGM from "./../assets/secret1.mp3";
import SECRET2_BGM from "./../assets/secret2.mp3";
import ENDLESS_BGM from "./../assets/endless.mp3";
import MENU_BGM from "./../assets/menu.mp3";
import GAMECLEAR_BGM from "./../assets/gameclear.mp3";
import GAMEOVER_BGM from "./../assets/gameover.mp3";

import CANCEL_SOUND from "./../assets/cancel.mp3";
import DAMAGE_SOUND from "./../assets/damage.mp3";
import HOLD_SOUND from "./../assets/hold.mp3";
import MOVE_SOUND from "./../assets/move.mp3";
import SELECT_SOUND from "./../assets/select.mp3";
import SKILL_SOUND from "./../assets/skill.mp3";
import TSPIN_SOUND from "./../assets/tspin.mp3";
import UP_SOUND from "./../assets/up.mp3";
import ATTACK_SOUND from "./../assets/attack.mp3";

const DropBrock = () => {
  const FIELD_WIDTH = 12;
  const FIELD_HEIGHT = 23;
  const BLOCK_SIZE = 15;
  const X0 = 210;
  const Y0 = 240;

  const MAX_HP = [3, 5, 7, 12, 10, 15, 999999];
  const ATTACK_COUNT = [7, 5, 4, 3, 5, 2, 999999];

  const BLOCK = [
    // Iblock
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
    // Tblock
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
    // Oblock
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
    // Sblock
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
    // Zblock
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
    // Jblock
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
    // Lblock
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
    "blue",
    "red",
    "green",
    "yellow",
    "darkviolet",
    "cyan",
    "orange",
    "dimgray",
  ];

  const canvasWidth = FIELD_WIDTH * BLOCK_SIZE;
  const canvasHeight = FIELD_HEIGHT * BLOCK_SIZE;

  const [blockStatus, setBlockStatus] = useState([
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
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ]);

  const [x, setX] = useState(4);
  const [y, setY] = useState(0);
  const [rotStatus, setRotStatus] = useState(0);
  const [selectLevel, setSelectLevel] = useState(0);
  const [selectChara, setSelectChara] = useState(false);
  const [selectHowto, setSelectHowto] = useState(false);
  const [charaIdx, setCharaIdx] = useState(0);
  const [skillCount, setSkillCount] = useState(5);
  const [clearStages, setClearStages] = useState([false, false, false, false]);
  const [hp, setHp] = useState(MAX_HP[selectLevel]);
  const [ren, setRen] = useState(0);
  const [atCount, setAtCount] = useState(ATTACK_COUNT[selectLevel]);
  const [blockIdx, setBlockIdx] = useState({ block: 0, color: 2 });
  const [holdIdx, setHoldIdx] = useState({ block: -1, color: 2 });
  const [nextBlock, setNextBlock] = useState([
    { block: -1, color: 2 },
    { block: -1, color: 2 },
    { block: -1, color: 2 },
  ]);
  const [prevBlock, setPrevBlock] = useState([0, 0, 0, 0, 0, 0, 0]);

  const [gameStatus, setGameStatus] = useState(0);

  const [gameOverFlag, setGameOverFlag] = useState(false);
  const [gameClearFlag, setGameClearFlag] = useState(false);
  const [gameReadyFlag, setGameReadyFlag] = useState(false);
  const [holdFlag, setHoldFlag] = useState(true);
  const [renFlag, setRenFlag] = useState(false);
  const [btbFlag, setBtbFlag] = useState(false);
  const [tspinFlag, setTspinFlag] = useState(false);
  const [secretFlag, setSecretFlag] = useState(false);

  const [easyBgmPlay, { stop: easyBgmStop, isLoaded }] = useSound(EASY_BGM, {
    loop: true,
  });
  const [normalBgmPlay, { stop: normalBgmStop }] = useSound(NORMAL_BGM, {
    loop: true,
  });
  const [hardBgmPlay, { stop: hardBgmStop }] = useSound(HARD_BGM, {
    loop: true,
  });
  const [expertBgmPlay, { stop: expertBgmStop }] = useSound(EXPERT_BGM, {
    loop: true,
  });
  const [secret1BgmPlay, { stop: secret1BgmStop }] = useSound(SECRET1_BGM, {
    loop: true,
  });
  const [secret2BgmPlay, { stop: secret2BgmStop }] = useSound(SECRET2_BGM, {
    loop: true,
  });
  const [endlessBgmPlay, { stop: endlessBgmStop }] = useSound(ENDLESS_BGM, {
    loop: true,
  });
  const [menuBgmPlay, { stop: menuBgmStop }] = useSound(MENU_BGM, {
    loop: true,
  });
  const [gameclearBgmPlay, { stop: gameclearBgmStop }] = useSound(
    GAMECLEAR_BGM,
    {
      loop: true,
    }
  );
  const [gameoverBgmPlay, { stop: gameoverBgmStop }] = useSound(GAMEOVER_BGM, {
    loop: true,
  });

  const [cancelSoundPlay, { stop: cancelSoundStop }] = useSound(CANCEL_SOUND);
  const [damageSoundPlay, { stop: damageSoundStop }] = useSound(DAMAGE_SOUND);
  const [holdSoundPlay, { stop: holdSoundStop }] = useSound(HOLD_SOUND);
  const [moveSoundPlay, { stop: moveSoundStop }] = useSound(MOVE_SOUND);
  const [selectSoundPlay, { stop: selectSoundStop }] = useSound(SELECT_SOUND);
  const [skillSoundPlay, { stop: skillSoundStop }] = useSound(SKILL_SOUND);
  const [tspinSoundPlay, { stop: tspinSoundStop }] = useSound(TSPIN_SOUND);
  const [upSoundPlay, { stop: upSoundStop }] = useSound(UP_SOUND);
  const [attackSoundPlay, { stop: attackSoundStop }] = useSound(ATTACK_SOUND);

  const canMove = (dx, dy, rot) => {
    const block = BLOCK[blockIdx.block][rot];
    return !block.find((m) => blockStatus[dy + m[1]][dx + m[0]] >= 1);
  };

  const hold = () => {
    if (holdIdx.block === -1) {
      setHoldIdx({ block: blockIdx.block, color: blockIdx.color });
      newBlock();
    } else {
      const tmp = holdIdx;
      setHoldIdx({ block: blockIdx.block, color: blockIdx.color });
      newBlock(tmp);
    }
  };

  const handleKeyFunction = (event, button) => {
    const k = event ? event.keyCode : button;
    const secretFlag = clearStages.filter((item) => !item).length === 0;
    let dx = 4;
    let dy = 0;
    let rot = 0;

    if (k === 13 && gameStatus !== 2) {
      selectSoundPlay();
    }

    if (gameStatus === 0) {
      if (k === 13) {
        setGameStatus(1);
      }
    } else if (gameStatus === 1) {
      if (selectChara) {
        if (k === 13 || k === 27) {
          setSelectChara(false);
          if (k === 27) {
            cancelSoundPlay();
          }
        } else if ((charaIdx === 1 || charaIdx === 2) && k === 37) {
          moveSoundPlay();
          setCharaIdx((prevIdx) => prevIdx - 1);
        } else if ((charaIdx === 0 || charaIdx === 1) && k === 39) {
          moveSoundPlay();
          setCharaIdx((prevIdx) => prevIdx + 1);
        }
      } else if (selectHowto) {
        if (k === 13 || k === 27) {
          setSelectHowto(false);
          if (k === 27) {
            cancelSoundPlay();
          }
        }
      } else {
        if (k === 13) {
          if (selectLevel === -2) {
            setSelectChara(true);
          } else if (selectLevel === -1) {
            setSelectHowto(true);
          } else {
            if (selectLevel === 5) {
              setSelectLevel(6);
            }
            setGameStatus(2);
            menuBgmStop();
          }
        } else if (k === 27) {
          setGameStatus(0);
          menuBgmStop();
          cancelSoundPlay();
        } else if (k === 40) {
          if (
            selectLevel === 0 ||
            selectLevel === 1 ||
            selectLevel === 3 ||
            selectLevel === 4
          ) {
            if (!secretFlag && selectLevel === 3) {
              setSelectLevel(5);
            } else {
              setSelectLevel((prevLevel) => prevLevel + 1);
            }
            moveSoundPlay();
          } else if (selectLevel === 2) {
            setSelectLevel(-1);
            moveSoundPlay();
          } else if (selectLevel === 5) {
            setSelectLevel(-2);
            moveSoundPlay();
          }
        } else if (k === 38) {
          if (
            selectLevel === 1 ||
            selectLevel === 2 ||
            selectLevel === 4 ||
            selectLevel === 5
          ) {
            if (!secretFlag && selectLevel === 5) {
              setSelectLevel(3);
            } else {
              setSelectLevel((prevLevel) => prevLevel - 1);
            }
            moveSoundPlay();
          } else if (selectLevel === -1) {
            setSelectLevel(2);
            moveSoundPlay();
          } else if (selectLevel === -2) {
            setSelectLevel(5);
            moveSoundPlay();
          }
        } else if (k === 39) {
          if (selectLevel >= 0 && selectLevel <= 2) {
            if (!(!secretFlag && selectLevel === 1)) {
              setSelectLevel((prevLevel) => prevLevel + 3);
              moveSoundPlay();
            }
          } else if (selectLevel === -1) {
            setSelectLevel(-2);
            moveSoundPlay();
          }
        } else if (k === 37) {
          if (selectLevel >= 3 && selectLevel <= 5) {
            setSelectLevel((prevLevel) => prevLevel - 3);
            moveSoundPlay();
          } else if (selectLevel === -2) {
            setSelectLevel(-1);
            moveSoundPlay();
          }
        }
      }
    } else {
      if (k === 27 && !gameReadyFlag) {
        if (selectLevel === 6) {
          setSelectLevel(5);
        } else if (selectLevel === 5 && secretFlag) {
          setSelectLevel(4);
        }
        setGameClearFlag(false);
        setGameOverFlag(false);
        setSecretFlag(false);
        setGameStatus(1);
        setHp(0);
        cancelSoundPlay();
        easyBgmStop();
        normalBgmStop();
        hardBgmStop();
        expertBgmStop();
        secret1BgmStop();
        secret2BgmStop();
        endlessBgmStop();
        gameclearBgmStop();
        gameoverBgmStop();
      }
    }

    if (gameStatus === 2) {
      dx = x;
      dy = y;
      rot = rotStatus;
    }

    if (gameStatus === 2) {
      if (!gameOverFlag && !gameReadyFlag && !gameClearFlag) {
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

          upSoundPlay();

          const attackStatus = attack();
          const newStatus = setupField(attackStatus, dy - (atCount === 0 && 1));
          deleteLine(newStatus);
          newBlock();
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
            setHoldFlag(false);
            hold();
            dx = 4;
            dy = 0;
            rot = 0;
            holdSoundPlay();
          }
        } else if (k === 81 && skillCount === 0) {
          skill();
          setSkillCount(5);
          skillSoundPlay();
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
          moveSoundPlay();
        }
      }
    }
  };

  const setupField = (newStatus, dy = 0) => {
    const block = BLOCK[blockIdx.block][rotStatus];
    let newBlockStatus = [...newStatus];
    block.forEach((m) => {
      newBlockStatus[dy === 0 ? y + m[1] : dy + m[1]][x + m[0]] =
        blockIdx.color + 2;
    });
    setBlockStatus(newBlockStatus);
    return newBlockStatus;
  };

  const next = (index = 0) => {
    if (index === -1) {
      let newPrevBlock = [0, 0, 0, 0, 0, 0, 0];

      let firstIndex = Math.floor(Math.random() * 7);
      const colorIndex = Math.floor(Math.random() * 3);
      newPrevBlock[firstIndex] = 1;

      setBlockIdx({ block: firstIndex, color: colorIndex });

      const newNextBlock = nextBlock.map(() => {
        let randomIndex;
        while (true) {
          randomIndex = Math.floor(Math.random() * 7);
          if (newPrevBlock[randomIndex] === 0) {
            newPrevBlock[randomIndex] = 1;
            break;
          }
        }
        const nextColorIndex = Math.floor(Math.random() * 3);
        return { block: randomIndex, color: nextColorIndex };
      });
      setNextBlock(newNextBlock);
      setPrevBlock(newPrevBlock);
    } else {
      let newPrevBlock =
        prevBlock.filter((item) => item === 1).length === 7
          ? [0, 0, 0, 0, 0, 0, 0]
          : [...prevBlock];

      let randomIndex;
      while (true) {
        randomIndex = Math.floor(Math.random() * 7);
        if (newPrevBlock[randomIndex] === 0) {
          newPrevBlock[randomIndex] = 1;
          break;
        }
      }
      const nextColorIndex = Math.floor(Math.random() * 3);
      setBlockIdx({ block: nextBlock[0].block, color: nextBlock[0].color });
      setNextBlock([
        { block: nextBlock[1].block, color: nextBlock[1].color },
        { block: nextBlock[2].block, color: nextBlock[2].color },
        { block: randomIndex, color: nextColorIndex },
      ]);
      setPrevBlock(newPrevBlock);
    }
  };

  const attack = () => {
    const newStatus = [...blockStatus];
    if (atCount === 0) {
      let at = [1, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 1];
      const randomIndex = Math.floor(Math.random() * 10);
      at[randomIndex + 1] = 0;

      newStatus.splice(0, 1);
      newStatus.splice(FIELD_HEIGHT - 2, 0, at);
      attackSoundPlay();
      setBlockStatus(newStatus);
      setAtCount(ATTACK_COUNT[selectLevel]);
    } else {
      setAtCount((prevCount) => prevCount - 1);
    }
    return newStatus;
  };

  const skill = () => {
    if (charaIdx === 0) {
      const newBlockStatus = [...blockStatus];
      newBlockStatus.splice(FIELD_HEIGHT - 6, 5);
      newBlockStatus.splice(
        0,
        0,
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]
      );
      setBlockStatus(newBlockStatus);
    } else if (charaIdx === 1) {
      setHp((prevY) => prevY - 3);
    } else if (charaIdx === 2) {
      setAtCount((prevCount) => prevCount + 5);
    }
  };

  const deleteLine = (newStatus) => {
    let newBlockStatus = [...newStatus];
    let lineCount = 0;
    let damage = 0;
    let perfectFlag = true;

    const allEqual = (arr) => {
      const referenceValue = arr[0];
      if (arr[0] <= 1) {
        return false;
      }
      return arr.every((value) => value === referenceValue);
    };

    newBlockStatus.forEach((items, i) => {
      const modelArray = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
      let count = items.filter((item) => item >= 1).length;
      const is1color = allEqual(items.slice(1, FIELD_WIDTH - 1));
      if (is1color) {
        damage += 3;
      }
      if (count === FIELD_WIDTH && i !== FIELD_HEIGHT - 1) {
        newBlockStatus.splice(i, 1);
        newBlockStatus.splice(0, 0, [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]);
        lineCount++;
      }
      if (i !== FIELD_HEIGHT - 1) {
      }
      items.map((item, j) => {
        if (item !== modelArray[j]) {
          perfectFlag = false;
        }
      });
    });

    if (skillCount < lineCount) {
      setSkillCount(0);
    } else {
      setSkillCount((prevCount) => prevCount - lineCount);
    }

    if (perfectFlag) {
      damage += 10;
      setBtbFlag(false);
    } else if (lineCount === 0) {
      setRen(0);
      setRenFlag(false);
    } else if (lineCount === 1) {
      if (tspinFlag) {
        if (btbFlag) {
          damage += 3;
        } else {
          damage += 2;
        }
        setBtbFlag(true);
      } else {
        setBtbFlag(false);
      }
    } else if (lineCount === 2) {
      if (tspinFlag) {
        if (btbFlag) {
          damage += 5;
        } else {
          damage += 4;
        }
        setBtbFlag(true);
      } else {
        damage += 1;
        setBtbFlag(false);
      }
    } else if (lineCount === 3) {
      if (tspinFlag) {
        if (btbFlag) {
          damage += 7;
        } else {
          damage += 6;
        }
        setBtbFlag(true);
      } else {
        damage += 2;
        setBtbFlag(false);
      }
    } else if (lineCount === 4) {
      if (btbFlag) {
        damage += 5;
      } else {
        damage += 4;
      }
      setBtbFlag(true);
    }
    if (renFlag) {
      if (ren <= 1) {
      } else if (ren <= 3) {
        damage += 1;
      } else if (ren <= 5) {
        damage += 2;
      } else if (ren <= 7) {
        damage += 3;
      } else if (ren <= 10) {
        damage += 4;
      } else {
        damage += 5;
      }
    }
    setBlockStatus(newBlockStatus);
    setHp((prevHp) => prevHp - damage);
    if (damage > 0) {
      damageSoundPlay();
    }
    return newBlockStatus;
  };

  const newBlock = (index = -1) => {
    setX(4);
    setY(0);
    setRotStatus(0);
    if (index === -1) {
      setBlockIdx({ block: nextBlock[0].block, color: nextBlock[0].color });
      next();
    } else {
      setBlockIdx({ block: index.block, color: index.color });
    }
  };

  const downCheck = () => {
    if (canMove(x, y + 1, rotStatus)) {
      setY((prevY) => prevY + 1);
    } else {
      setHoldFlag(true);
      setTspinFlag(false);

      const attackStatus = attack();
      const newStatus = setupField(attackStatus, y - (atCount === 0 && 1));
      deleteLine(newStatus);
      newBlock();
    }
  };

  const DrawField = () => {
    return (
      <g>
        {blockStatus.map((block, y) => {
          return block.map((m, x) => {
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

  const DrawBlock = () => {
    const block = BLOCK[blockIdx.block][rotStatus];
    const col = COLOR[blockIdx.color + 2];
    return (
      <g>
        {block.map((m, i) => {
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
              key={`block${i}`}
            ></rect>
          );
        })}
      </g>
    );
  };

  const DrawForecast = () => {
    const block = BLOCK[blockIdx.block][rotStatus];
    const col = COLOR[blockIdx.color + 2];
    let dy = y;
    while (canMove(x, dy, rotStatus)) {
      dy++;
    }
    dy--;
    return (
      <g>
        {!gameOverFlag &&
          block.map((m, i) => {
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
    const flag = nextBlock.find((item) => item.block === -1);
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
          nextBlock.map((index, i) => {
            const block = BLOCK[index.block][0];
            const col = COLOR[index.color + 2];

            return block.map((m, j) => {
              const x1 =
                index.block === 2 || index.block === 0
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
        {holdIdx.block !== -1 &&
          BLOCK[holdIdx.block][0].map((m, i) => {
            const x1 =
              holdIdx.block === 2 || holdIdx.block === 0
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
                fill={COLOR[holdIdx.color + 2]}
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
          return <image href={SECRET1_ENEMY} width={100} height={100}></image>;
        case 5:
          return (
            <image
              href={SECRET2_ENEMY}
              x={-BLOCK_SIZE * 3 - 5}
              y={-BLOCK_SIZE * 4}
              width={200}
              height={200}
            ></image>
          );
        case 6:
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
          strokeWidth={1.5}
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
                stroke="green"
                strokeWidth={1.5}
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
                    stroke="green"
                    strokeWidth={1.5}
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
        {skillCount !== 0 ? (
          <text
            x={BLOCK_SIZE * 1.5}
            y={BLOCK_SIZE * 3}
            fill="white"
            fontSize={BLOCK_SIZE * 1.5}
          >
            {skillCount}
          </text>
        ) : (
          <text
            x={BLOCK_SIZE * 1}
            y={BLOCK_SIZE * 3}
            fill="white"
            fontSize={BLOCK_SIZE * 1.5}
          >
            OK
          </text>
        )}

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
        {secretFlag ? (
          <g>
            <rect
              x={0}
              y={0}
              width={BLOCK_SIZE * 8}
              height={BLOCK_SIZE * 6}
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
              x={BLOCK_SIZE * 0.75}
              y={BLOCK_SIZE * 3}
              fontSize={BLOCK_SIZE}
              fill="white"
            >
              THANK YOU
            </text>
            <text
              x={BLOCK_SIZE * 0.75}
              y={BLOCK_SIZE * 4.25}
              fontSize={BLOCK_SIZE}
              fill="white"
            >
              FOR PLAYING!
            </text>
            <text
              x={BLOCK_SIZE * 1.5}
              y={BLOCK_SIZE * 5.5}
              fontSize={BLOCK_SIZE}
              fill="white"
            >
              Press Esc
            </text>
          </g>
        ) : (
          <g>
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
        )}
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

  const DrawEsc = () => {
    return (
      <g>
        <text
          x={20}
          y={10}
          fontSize={20}
          fill="white"
          dominantBaseline="Hanging"
        >
          ⇐ESC
        </text>
      </g>
    );
  };

  const DrawTitle = () => {
    return (
      <g>
        <text x={125} y={100} fill="white" fontSize={50}>
          BLOCK QUEST
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
    const secretFlag = clearStages.filter((item) => !item).length === 0;

    return (
      <g>
        <DrawEsc></DrawEsc>
        {selectHowto && <DrawSelectHowto></DrawSelectHowto>}
        {selectChara && <DrawSelectChara></DrawSelectChara>}
        {!selectHowto && !selectChara && (
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
                <image
                  href={EASY_ENEMY}
                  y={selectLevel === 0 ? -10 : 0}
                  width={100}
                  height={100}
                />

                <image
                  href={NORMAL_ENEMY}
                  y={selectLevel === 1 ? 140 : 150}
                  width={100}
                  height={100}
                />
                <image
                  href={HARD_ENEMY}
                  y={selectLevel === 2 ? 290 : 300}
                  width={100}
                  height={100}
                />
                <g transform="translate(90,0)">
                  {clearStages[0] && (
                    <image href={CLEAR_MARK} y={90} width={20} height={20} />
                  )}
                  {clearStages[1] && (
                    <image href={CLEAR_MARK} y={240} width={20} height={20} />
                  )}
                  {clearStages[2] && (
                    <image href={CLEAR_MARK} y={390} width={20} height={20} />
                  )}
                </g>
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
                <image
                  href={EXPERT_ENEMY}
                  y={selectLevel === 3 ? -10 : 0}
                  width={100}
                  height={100}
                />
                {secretFlag && (
                  <image
                    href={SECRET1_ENEMY}
                    y={selectLevel === 4 ? 140 : 150}
                    width={100}
                    height={100}
                  />
                )}
                <image
                  href={ENDLESS_ENEMY}
                  y={selectLevel === 5 ? 290 : 300}
                  width={100}
                  height={100}
                />
                <g transform="translate(90,0)">
                  {clearStages[3] && (
                    <image href={CLEAR_MARK} y={90} width={20} height={20} />
                  )}
                </g>
              </g>
              <g transform="translate(440,210)" fill="white" fontSize="30">
                <text
                  x="0"
                  y="0"
                  style={{ textDecoration: selectLevel === 3 && "underline" }}
                >
                  EXPERT
                </text>
                {secretFlag && (
                  <text
                    x="0"
                    y="150"
                    fill="yellow"
                    style={{ textDecoration: selectLevel === 4 && "underline" }}
                  >
                    SECRET
                  </text>
                )}

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
        )}
      </g>
    );
  };

  const DrawSelectHowto = () => {
    return (
      <g transform="translate(150,0)" fill="white">
        <text y={100} fontSize={40}>
          HOW TO PLAY
        </text>
        <text x={80} y={200}>
          ← → : MOVE
        </text>
        <text x={80} y={230}>
          ↑ : DIVE
        </text>
        <text x={80} y={260}>
          ↓ : DROP
        </text>
        <text x={80} y={290}>
          D : RIGHT SPIN
        </text>
        <text x={80} y={320}>
          A : LEFT SPIN
        </text>
        <text x={80} y={350}>
          S : HOLD
        </text>
        <text x={80} y={380}>
          Q : SKILL
        </text>
      </g>
    );
  };

  const DrawSelectChara = () => {
    return (
      <g>
        <text x={150} y={100} fill="white" fontSize={40}>
          SELECT CHARA
        </text>
        <image
          href={CHARA_YUSHA}
          x={100}
          y={charaIdx === 0 ? 130 : 150}
          width={100}
          height={100}
        />
        <image
          href={CHARA_SENSHI}
          x={250}
          y={charaIdx === 1 ? 130 : 150}
          width={100}
          height={100}
        />
        <image
          href={CHARA_MAHOTSUKAI}
          x={400}
          y={charaIdx === 2 ? 130 : 150}
          width={100}
          height={100}
        />
        <text x={100} y={400} fill="white" fontSize={30}>
          SKILL :
        </text>
        {charaIdx === 0 && (
          <text x={220} y={400} fill="white" fontSize={30}>
            DELETE LINE
          </text>
        )}
        {charaIdx === 1 && (
          <text x={220} y={400} fill="white" fontSize={30}>
            ATTACK ENEMY
          </text>
        )}
        {charaIdx === 2 && (
          <text x={220} y={400} fill="white" fontSize={30}>
            DELAY TURN
          </text>
        )}
      </g>
    );
  };

  const DrawGame = () => {
    return (
      <g>
        <DrawEsc></DrawEsc>
        <DrawField></DrawField>

        {!gameReadyFlag && (
          <g>
            <DrawForecast></DrawForecast>
            <DrawBlock></DrawBlock>
          </g>
        )}

        <DrawNext></DrawNext>
        <DrawHold></DrawHold>
        {!gameClearFlag && (
          <g>
            <DrawEnemy></DrawEnemy>

            {selectLevel !== 6 && <DrawHp></DrawHp>}
          </g>
        )}

        {selectLevel !== 6 && <DrawAttack></DrawAttack>}
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
      setRen(0);
      setAtCount(ATTACK_COUNT[selectLevel]);
      setBlockIdx({ block: 0, color: 2 });
      setHoldIdx({ block: -1, color: 2 });
      setNextBlock([
        { block: -1, color: 2 },
        { block: -1, color: 2 },
        { block: -1, color: 2 },
      ]);
      setPrevBlock([0, 0, 0, 0, 0, 0, 0]);
      setGameOverFlag(false);
      setGameClearFlag(false);
      setHoldFlag(true);
      setTspinFlag(false);
      setRenFlag(false);
      setBtbFlag(false);
      setBlockStatus([
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
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      ]);
    }
    const timeoutId = setTimeout(() => {
      if (gameStatus === 2) {
        setGameReadyFlag(false);
        next(-1);
        switch (selectLevel) {
          case 0:
            easyBgmPlay();
            break;
          case 1:
            normalBgmPlay();
            break;
          case 2:
            hardBgmPlay();
            break;
          case 3:
            expertBgmPlay();
            break;
          case 4:
            secret1BgmPlay();
            break;
          case 5:
            secret2BgmPlay();
            break;
          case 6:
            endlessBgmPlay();
            break;
        }
      }
    }, 2000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [gameStatus, secretFlag]);

  useEffect(() => {
    if (gameStatus === 0) {
    } else if (gameStatus === 1) {
      menuBgmPlay();
    }
  }, [gameStatus]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyFunction);
    return () => {
      document.removeEventListener("keydown", handleKeyFunction);
    };
  }, [handleKeyFunction]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!gameReadyFlag && gameStatus === 2) {
        if (hp <= 0) {
          if (!secretFlag && selectLevel === 4) {
            setSecretFlag(true);
            setSelectLevel(5);
            secret1BgmStop();
          } else {
            //ゲームクリア
            setClearStages(
              clearStages.map((item, i) => (i === selectLevel ? true : item))
            );
            setGameClearFlag(true);
            easyBgmStop();
            normalBgmStop();
            hardBgmStop();
            expertBgmStop();
            secret1BgmStop();
            secret2BgmStop();
            endlessBgmStop();
          }
        } else if (canMove(x, y, rotStatus)) {
          downCheck();
        } else {
          setGameOverFlag(true);
          easyBgmStop();
          normalBgmStop();
          hardBgmStop();
          expertBgmStop();
          secret1BgmStop();
          secret2BgmStop();
          endlessBgmStop();
        }
      }
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [y, canMove, hp]);

  useEffect(() => {
    if (gameClearFlag) {
      gameclearBgmPlay();
    } else if (gameOverFlag) {
      gameoverBgmPlay();
    }
  }, [gameClearFlag, gameOverFlag]);

  return (
    <div>
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
    </div>
  );
};

export default DropBrock;
