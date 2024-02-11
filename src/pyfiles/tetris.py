import asyncio
import random
import sys
import tkinter as tk
import tkinter.messagebox

import threading
import pygame
from pygame.locals import *
from PIL import Image, ImageTk

###
FIELD_WIDTH = 12
###
FIELD_HEIGHT = 21
###
BLOCK_SIZE = 15
###
X0 = 235
###
Y0 = 220
MAX_HP = [3, 5, 7, 12, 10, 15]
ATTACK_COUNT = [7, 5, 4, 3, 5, 2]

###
MINO = [
    # Imino
    [
        [[0, 0], [1, 0], [2, 0], [3, 0]],
        [[2, 0], [2, 1], [2, 2], [2, 3]],
        [[0, 1], [1, 1], [2, 1], [3, 1]],
        [[1, 0], [1, 1], [1, 2], [1, 3]],
    ],
    # Tmino
    [
        [[1, 0], [0, 1], [1, 1], [2, 1]],
        [[1, 0], [1, 1], [2, 1], [1, 2]],
        [[0, 1], [1, 1], [2, 1], [1, 2]],
        [[1, 0], [0, 1], [1, 1], [1, 2]],
    ],
    # Omino
    [
        [[1, 0], [2, 0], [1, 1], [2, 1]],
        [[1, 0], [2, 0], [1, 1], [2, 1]],
        [[1, 0], [2, 0], [1, 1], [2, 1]],
        [[1, 0], [2, 0], [1, 1], [2, 1]],
    ],
    # Smino
    [
        [[1, 0], [2, 0], [0, 1], [1, 1]],
        [[0, 0], [0, 1], [1, 1], [1, 2]],
        [[1, 0], [2, 0], [0, 1], [1, 1]],
        [[0, 0], [0, 1], [1, 1], [1, 2]],
    ],
    # Zmino
    [
        [[0, 0], [1, 0], [1, 1], [2, 1]],
        [[1, 0], [0, 1], [1, 1], [0, 2]],
        [[0, 0], [1, 0], [1, 1], [2, 1]],
        [[1, 0], [0, 1], [1, 1], [0, 2]],
    ],
    # Jmino
    [
        [[0, 0], [0, 1], [1, 1], [2, 1]],
        [[0, 0], [1, 0], [0, 1], [0, 2]],
        [[0, 0], [1, 0], [2, 0], [2, 1]],
        [[1, 0], [1, 1], [0, 2], [1, 2]],
    ],
    # Lmino
    [
        [[2, 0], [0, 1], [1, 1], [2, 1]],
        [[0, 0], [0, 1], [0, 2], [1, 2]],
        [[0, 0], [1, 0], [2, 0], [0, 1]],
        [[0, 0], [1, 0], [1, 1], [1, 2]],
    ],
]

###
COLOR = [
    "dark gray",
    "black",
    "cyan",
    "dark violet",
    "yellow",
    "green",
    "red",
    "blue",
    "orange",
    "dim gray",
]

canvas_width = FIELD_WIDTH * BLOCK_SIZE
canvas_height = FIELD_HEIGHT * BLOCK_SIZE


class SystemHandler:
    def __init__(self, root, canvas):
        self.root = root
        self.canvas = canvas
        self.game_status = 0  # 0=title, 1=select 2=game
        self.id = None
        self.menu_flag = 1
        self.select_idx = 0
        self.chara_idx = 0
        self.ready_flag = 0
        self.secret_flag = [0, 0, 0, 0]
        self.field = Field(canvas)
        self.sound = Sound()
        self.running = True
        self.loop = None
        """ self.start()
        self.root.protocol("WM_DELETE_WINDOW", self.close) """
        self.main_proc()

    def main_proc(self):
        if self.menu_flag == 1:
            self.sound.menu(True)
            self.menu_flag = 0
        if self.game_status == 0:  # title
            self.title_main_proc()
        elif self.game_status == 1:  # select
            self.select_main_proc()
        elif self.game_status == 2:  # game
            self.sound.menu(False)
            self.game = Game(
                self.id,
                self.select_idx,
                self.chara_idx,
                all(element == 1 for element in self.secret_flag),
                self.root,
                self.canvas,
                self.sound,
            )

    def title_main_proc(self):
        self.canvas.delete("all")
        self.field.draw_title()
        self.id = self.root.after(1000, self.title_main_proc)

    def select_main_proc(self):
        self.canvas.delete("all")
        self.field.draw_select(
            self.select_idx,
            self.chara_idx,
            all(element == 1 for element in self.secret_flag),
        )
        self.id = self.root.after(100, self.select_main_proc)

    def game_status_change(self, n):
        if self.game_status == 2:
            self.game.root.after_cancel(self.game.id)
            if self.game.game_over_flag == 2 and self.select_idx <= 3:
                self.secret_flag[self.select_idx] = 1
        else:
            self.root.after_cancel(self.id)
        g = self.game_status + n
        if g != -1 and g != 3:
            self.game_status = g
        self.main_proc()

    def clickend(self):
        end = tk.messagebox.askokcancel("終了", "ゲームを終了しますか？")
        if end:
            self.close()

    def close(self):
        self.running = False
        sys.exit()

    def key(self, k):
        self.key_pressed(k.keycode)

    def key_pressed(self, k):
        dx = 0
        dy = 0
        rot = 0

        if self.game_status == 2:
            dx = self.game.x
            dy = self.game.y
            rot = self.game.rot_status

        if self.game_status == 1 and (k == 38 or k == 40):
            if (
                k == 38
                and self.select_idx != 0
                and self.select_idx != -3
                and (
                    self.field.credit_flag
                    or self.field.charaselect_flag
                    or self.field.description_flag
                )
                == False
            ):
                self.select_idx -= 1
                self.sound.move_sound.play()
            elif (
                (
                    (k == 40 and self.select_idx <= 2)
                    or k == 40
                    and self.select_idx == 3
                    and all(element == 1 for element in self.secret_flag)
                )
                and self.select_idx != -1
                and (
                    self.field.credit_flag
                    or self.field.charaselect_flag
                    or self.field.description_flag
                )
                == False
            ):
                self.select_idx += 1
                self.sound.move_sound.play()

        elif (
            self.game_status == 1
            and (k == 37 or k == 39)
            and self.field.charaselect_flag == False
        ):
            if k == 37:
                if self.select_idx == -1:
                    self.select_idx = 3
                    self.sound.move_sound.play()
                elif self.select_idx == -2:
                    self.select_idx = 2
                    self.sound.move_sound.play()
                elif self.select_idx == -3:
                    self.select_idx = 1
                    self.sound.move_sound.play()
            elif k == 39:
                if self.select_idx == 0 or self.select_idx == 1:
                    self.select_idx = -3
                    self.sound.move_sound.play()
                elif self.select_idx == 2:
                    self.select_idx = -2
                    self.sound.move_sound.play()
                elif self.select_idx == 3 or self.select_idx == 4:
                    self.select_idx = -1
                    self.sound.move_sound.play()
        elif (
            self.game_status == 1
            and (k == 37 or k == 39)
            and self.field.charaselect_flag
        ):
            if k == 37 and self.chara_idx != 0:
                self.chara_idx -= 1
                self.sound.tspin_sound.play()
            elif k == 39 and self.chara_idx != 2:
                self.chara_idx += 1
                self.sound.damage_sound.play()

        if k == 27 and self.game_status != 2:  # esc
            if self.game_status == 0:
                self.clickend()
            elif (
                self.field.credit_flag
                or self.field.charaselect_flag
                or self.field.description_flag
            ) and self.game_status == 1:
                self.field.credit_flag = False
                self.field.charaselect_flag = False
                self.field.description_flag = False
            else:
                self.game_status_change(-1)

            self.sound.cancel_sound.play()

        elif k == 27 and self.game.ready_flag == 0:
            self.menu_flag = 1
            self.game_status_change(-1)
            if self.select_idx == 0:
                self.sound.easy(False)
            elif self.select_idx == 1:
                self.sound.normal(False)
            elif self.select_idx == 2:
                self.sound.hard(False)
            elif self.select_idx == 3:
                self.sound.expert(False)
            elif self.select_idx == 4 and self.game.select_idx != 5:
                self.sound.secret1(False)
            elif self.game.select_idx == 5:
                self.sound.secret2(False)
            self.sound.cancel_sound.play()

        elif (
            k == 13
            and self.game_status != 2
            and (
                self.field.credit_flag
                or self.field.charaselect_flag
                or self.field.description_flag
            )
            == False
        ):  # enter
            if self.select_idx >= 0:
                self.game_status_change(1)

            elif self.select_idx == -1:
                self.field.credit_flag = True
            elif self.select_idx == -2:
                self.field.charaselect_flag = True
            elif self.select_idx == -3:
                self.field.description_flag = True
            self.sound.select_sound.play()

        if self.game_status == 2:
            if self.game.game_over_flag == 0 and self.game.ready_flag == 0:
                if k == 37:  # left
                    dx -= 1
                elif k == 39:  # right
                    dx += 1
                elif k == 38:  # up
                    while self.game.can_up_flag == 1:
                        self.game.down_check(1)
                        dx = 4
                        dy = 0
                        rot = self.game.rot_status
                    self.sound.up_sound.play()
                    self.game.can_up_flag = 1
                elif k == 40:  # down
                    dy += 1
                elif k == 65:
                    rot -= 1
                    if rot == -1:
                        rot = 3
                elif k == 68:
                    rot += 1
                    if rot == 4:
                        rot = 0
                elif k == 83:
                    if self.game.hold_flag == 1:
                        self.sound.hold_sound.play()
                        self.game.mino_hold()
                    dx = self.game.x
                    dy = self.game.y
                    rot = self.game.rot_status

                elif k == 81 and self.game.skill_count == 0:
                    self.game.skill(self.chara_idx)
                    self.game.skill_count = 5

                # Tspin triple
                if self.game.mino_idx == 1 and self.game.rot_status == 0:
                    # right
                    if rot == 1:
                        if self.game.mino_status[self.game.y][
                            self.game.x
                        ] >= 1 and self.game.can_move(
                            self.game.x - 1, self.game.y + 2, rot
                        ):
                            dx -= 1
                            dy += 2
                            self.game.tspin_flag = True
                            self.sound.tspin_sound.play()
                    # left
                    elif rot == 3:
                        if self.game.mino_status[self.game.y][
                            self.game.x + 2
                        ] >= 1 and self.game.can_move(
                            self.game.x + 1, self.game.y + 2, rot
                        ):
                            dx += 1
                            dy += 2
                            self.game.tspin_flag = True
                            self.sound.tspin_sound.play()

                elif (
                    self.game.mino_idx == 1
                    and rot != self.game.rot_status
                    and self.game.can_move(dx, dy, rot)
                ):
                    count = 0
                    if self.game.mino_status[self.game.y][self.game.x] >= 1:
                        count += 1
                    if self.game.mino_status[self.game.y + 2][self.game.x] >= 1:
                        count += 1
                    if self.game.mino_status[self.game.y][self.game.x + 2] >= 1:
                        count += 1
                    if self.game.mino_status[self.game.y + 2][self.game.x + 2] >= 1:
                        count += 1
                    if count >= 3:
                        self.game.tspin_flag = True
                        self.sound.tspin_sound.play()

                # Tspin single left
                elif (
                    self.game.mino_idx == 1
                    and self.game.rot_status == 1
                    and rot == 0
                    and self.game.can_move(self.game.x, self.game.y, rot) == False
                ):
                    if (
                        self.game.mino_status[self.game.y + 2][self.game.x + 2] == 0
                        and self.game.mino_status[self.game.y + 2][self.game.x + 3] == 0
                        and self.game.mino_status[self.game.y + 1][self.game.x + 3] >= 1
                    ):
                        dx += 1
                        dy += 1
                        self.game.tspin_flag = True
                        self.sound.tspin_sound.play()

                # Tspin single right
                elif (
                    self.game.mino_idx == 1
                    and self.game.rot_status == 3
                    and rot == 0
                    and self.game.can_move(self.game.x, self.game.y, rot) == False
                ):
                    if (
                        self.game.mino_status[self.game.y + 2][self.game.x - 1] == 0
                        and self.game.mino_status[self.game.y + 2][self.game.x] == 0
                        and self.game.mino_status[self.game.y + 1][self.game.x - 1] >= 1
                    ):
                        dx -= 1
                        dy += 1
                        self.game.tspin_flag = True
                        self.sound.tspin_sound.play()

                # Sspin right
                elif self.game.mino_idx == 3 and self.game.rot_status == 1 and rot == 2:
                    if self.game.mino_status[self.game.y + 2][
                        self.game.x
                    ] >= 1 and self.game.can_move(self.game.x, self.game.y + 2, rot):
                        dy += 2

                # Sspin left
                elif self.game.mino_idx == 3 and self.game.rot_status == 3 and rot == 2:
                    if (
                        self.game.mino_status[self.game.y + 1][self.game.x - 1] >= 1
                        and self.game.mino_status[self.game.y + 1][self.game.x + 2] >= 1
                        and self.game.can_move(self.game.x - 1, self.game.y + 2, rot)
                    ):
                        dx -= 1
                        dy += 2

                # Zspin left
                elif self.game.mino_idx == 4 and self.game.rot_status == 3 and rot == 2:
                    if self.game.mino_status[self.game.y + 2][
                        self.game.x + 1
                    ] >= 1 and self.game.can_move(
                        self.game.x - 1, self.game.y + 2, rot
                    ):
                        dx -= 1
                        dy += 2

                # Zspin right
                elif self.game.mino_idx == 4 and self.game.rot_status == 1 and rot == 2:
                    if (
                        self.game.mino_status[self.game.y + 1][self.game.x - 1] >= 1
                        and self.game.mino_status[self.game.y + 1][self.game.x + 2] >= 1
                        and self.game.can_move(self.game.x, self.game.y + 2, rot)
                    ):
                        dy += 2

                # Jspin left
                elif self.game.mino_idx == 5 and self.game.rot_status == 1 and rot == 0:
                    if (
                        self.game.mino_status[self.game.y + 1][self.game.x + 1] >= 1
                        and self.game.mino_status[self.game.y + 1][self.game.x + 2] >= 1
                        and self.game.can_move(self.game.x, self.game.y + 1, rot)
                    ):
                        dy += 1

                # Lspin right
                elif self.game.mino_idx == 6 and self.game.rot_status == 3 and rot == 0:
                    if (
                        self.game.mino_status[self.game.y + 1][self.game.x - 1] >= 1
                        and self.game.mino_status[self.game.y + 1][self.game.x] >= 1
                        and self.game.can_move(self.game.x - 1, self.game.y + 1, rot)
                    ):
                        dx -= 1
                        dy += 1

                elif self.game.can_move(self.game.x, self.game.y, rot) == False:
                    dy -= 1

                if self.game.can_move(dx, dy, rot):
                    self.game.x = dx
                    self.game.y = dy
                    self.game.rot_status = rot
                    if ((k >= 37 and k <= 40) or k == 65 or k == 68) and (
                        k != 38 and k != 83
                    ):
                        self.sound.move_sound.play()

                self.game.create_game_scene()

    """ def joy(self):
        pygame.init()
        pygame.joystick.init()
        joystick_count = pygame.joystick.get_count()
        if joystick_count != 0:
            joys = pygame.joystick.Joystick(0)
            joys.init()
            self.joy_pressed() """

    """ async def joy_pressed(self):
        pygame.init()
        pygame.joystick.init()
        joystick_count = pygame.joystick.get_count()
        if joystick_count != 0:
            joys = pygame.joystick.Joystick(0)
            joys.init()
        while self.running:
            eventlist = pygame.event.get()
            for event in eventlist:
                if event.type == pygame.locals.JOYBUTTONDOWN:
                    if event.button == 1:
                        if self.game_status != 2:
                            self.key_pressed(13)
                        else:
                            self.key_pressed(68)
                    elif event.button == 0:
                        if self.game_status != 2:
                            self.key_pressed(27)
                        else:
                            self.key_pressed(65)
                    elif event.button == 11:
                        self.key_pressed(38)
                    elif event.button == 12:
                        self.key_pressed(40)
                    elif event.button == 13:
                        self.key_pressed(37)
                    elif event.button == 14:
                        self.key_pressed(39)
                    elif event.button == 9 or event.button == 10:
                        self.key_pressed(83)
            await asyncio.sleep(0.1) """

    """ def start(self):
        self.loop = asyncio.get_event_loop()
        self.loop.run_until_complete(self.joy_pressed())

    def stop(self):
        self.running = False
        self.loop.stop()
        self.loop.close() """


class Game:
    def __init__(self, id, select_idx, chara_idx, secret_flag, root, canvas, sound):
        self.id = id
        self.select_idx = select_idx
        self.chara_idx = chara_idx
        self.secret_flag = secret_flag
        self.root = root
        self.canvas = canvas
        self.sound = sound
        self.x = 4
        self.y = 0
        self.rot_status = 0
        self.hp = MAX_HP[select_idx]
        self.at_count = ATTACK_COUNT[select_idx]
        self.mino_idx = random.randint(0, 6)
        self.hold_idx = -1
        self.hold_flag = 1
        self.can_up_flag = 1
        self.game_over_flag = 0
        self.music_flag = 1
        self.ready_flag = 1
        self.skill_count = 5
        self.ren = 0
        self.ren_flag = False
        self.btb_flag = False
        self.tspin_flag = False
        self.prev_mino = [0, 0, 0, 0, 0, 0, 0]
        self.next_mino = [-1, -1, -1]
        self.mino_status = [
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
        ]

        self.new_mino(self.mino_idx)
        self.next()
        self.col_idx = self.mino_idx + 2
        self.field = Field(canvas)
        self.create_game_scene()
        self.ready()

    def attack(self):
        if self.at_count == 0:
            at = [1]
            idx = random.randint(0, 9)
            for i in range(10):
                if idx == i:
                    at.append(0)
                else:
                    at.append(9)
            at.append(1)
            del self.mino_status[0]
            self.mino_status.insert(19, at)
            self.at_count = ATTACK_COUNT[self.select_idx] - 1
        else:
            self.at_count -= 1

    ###
    def new_mino(self, idx):
        self.x = 4
        self.y = 0
        self.rot_status = 0
        if idx == -1:
            self.mino_idx = self.next_mino[0]
            self.next()
        else:
            self.mino_idx = idx
            # ?
        self.col_idx = self.mino_idx + 2
        if self.hold_flag != 0:
            self.attack()

    ###
    def next(self):
        count = 0
        for i in range(3):
            if self.next_mino[i] == -1:
                count += 1
        if count == 3:
            self.mino_idx = self.set_random_mino(self.mino_idx)
            self.next_mino[0] = self.set_random_mino(self.mino_idx)
            self.next_mino[1] = self.set_random_mino(self.next_mino[0])
            self.next_mino[2] = self.set_random_mino(self.next_mino[1])
        else:
            self.next_mino[0] = self.next_mino[1]
            self.next_mino[1] = self.next_mino[2]
            self.next_mino[2] = self.set_random_mino(self.next_mino[1])

    def delete(self):
        perfect_flag = True
        line_cnt = 0
        for y in range(FIELD_HEIGHT - 1):
            count = 0
            for x in range(FIELD_WIDTH):
                if self.mino_status[y][x] >= 1:
                    count += 1
            if count == FIELD_WIDTH:
                del self.mino_status[y]
                self.mino_status.insert(0, [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1])
                # やる
                line_cnt += 1
                if self.skill_count > 0:
                    self.skill_count -= 1
            # やる
            if self.mino_status[y] != [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]:
                perfect_flag = False
        # やる
        if perfect_flag:
            self.hp -= 10
            self.btb_flag = False
        elif line_cnt == 0:
            self.ren = 0
            self.ren_flag = False
        elif line_cnt == 1:
            if self.tspin_flag:
                if self.btb_flag:
                    self.hp -= 3
                else:
                    self.hp -= 2
                self.btb_flag = True
            else:
                self.btb_flag = False
        elif line_cnt == 2:
            if self.tspin_flag:
                if self.btb_flag:
                    self.hp -= 5
                else:
                    self.hp -= 4
                self.btb_flag = True
            else:
                self.hp -= 1
                self.btb_flag = False
        elif line_cnt == 3:
            if self.tspin_flag:
                if self.btb_flag:
                    self.hp -= 7
                else:
                    self.hp -= 6
                self.btb_flag = True
            else:
                self.hp -= 2
                self.btb_flag = False
        elif line_cnt == 4:
            if self.btb_flag:
                self.hp -= 5
            else:
                self.hp -= 4
            self.btb_flag = True
        if self.ren_flag:
            if self.ren <= 1:
                pass
            elif self.ren <= 3:
                line_cnt += 1
            elif self.ren <= 5:
                line_cnt += 2
            elif self.ren <= 7:
                line_cnt += 3
            elif self.ren <= 10:
                line_cnt += 4
            else:
                line_cnt += 5
        if line_cnt >= 1:
            self.sound.damage_sound.play()

    ###
    def set_random_mino(self, idx):
        count = 0

        for i in range(7):
            if self.prev_mino[i] == 1:
                count += 1
        if count == 7:
            self.prev_mino = [0, 0, 0, 0, 0, 0, 0]

        while True:
            idx = random.randint(0, 6)
            if self.prev_mino[idx] == 0:
                break

        self.prev_mino[idx] = 1

        return idx

    ###
    def down_check(self, idx):
        dy = self.y + 1
        if self.can_move(self.x, dy, self.rot_status):
            self.y = dy
        else:
            self.hold_flag = 1
            self.tspin_flag = False
            if idx == 1:
                self.can_up_flag = 0
            self.set_field()
            self.delete()
            self.new_mino(-1)

    def mino_hold(self):
        if self.hold_idx == -1:
            self.hold_idx = self.mino_idx
            self.hold_flag = 0
            self.new_mino(-1)
        else:
            tmp = self.hold_idx
            self.hold_idx = self.mino_idx
            self.hold_flag = 0
            self.new_mino(tmp)

    ###
    def can_move(self, x, y, rot):
        m = MINO[self.mino_idx][rot]
        for i in range(4):
            if self.mino_status[y + m[i][1]][x + m[i][0]] >= 1:
                return False
        return True

    def create_game_scene(self):
        self.canvas.delete("all")
        self.field.draw_background(self.select_idx)
        self.field.draw_field(self.mino_status)
        if self.game_over_flag == 0:
            dy = self.y
            while self.can_move(self.x, dy + 1, self.rot_status):
                dy += 1
            self.field.draw_chara(self.chara_idx, self.skill_count)
            self.field.draw_forecast(
                self.x, dy, self.rot_status, self.mino_idx, self.col_idx
            )
            self.field.draw_mino(
                self.x, self.y, self.rot_status, self.mino_idx, self.col_idx
            )
            self.field.draw_hp(self.hp, self.select_idx)
            self.field.draw_hold(self.hold_idx)
            self.field.draw_next(self.next_mino)
            self.field.draw_attack(self.at_count)

    def secret_change(self):
        self.root.after_cancel(self.id)
        self.sound.secret1(False)
        self.select_idx += 1
        self.hp = MAX_HP[self.select_idx]
        self.at_count = ATTACK_COUNT[self.select_idx]
        self.game_over_flag = 0
        self.music_flag = 1
        self.ready_flag = 1
        self.create_game_scene()
        self.ready()

    def skill(self, idx):
        if idx == 0:
            for _ in range(6):

                del self.mino_status[FIELD_HEIGHT - 2]
                self.mino_status.insert(0, [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1])
            self.btb_flag = True
        elif idx == 1:
            self.hp -= 3
        elif idx == 2:
            self.at_count += 5
        self.sound.skill_sound.play()

    def ready(self):
        self.canvas.create_text(
            canvas_width / 2 + X0,
            canvas_height / 2 + Y0 - 30,
            text="Ready?",
            fill="black",
            font=self.field.clear_fnt,
        )
        self.id = self.root.after(2000, self.game_main_proc)

    def set_field(self):
        m = MINO[self.mino_idx][self.rot_status]
        for i in range(4):
            self.mino_status[self.y + m[i][1]][self.x + m[i][0]] = self.col_idx

    def game_main_proc(self):
        self.ready_flag = 0
        if self.music_flag == 1:
            if self.select_idx == 0:
                self.sound.easy(True)
            elif self.select_idx == 1:
                self.sound.normal(True)
            elif self.select_idx == 2:
                self.sound.hard(True)
            elif self.select_idx == 3:
                self.sound.expert(True)
            elif self.select_idx == 4:
                self.sound.secret1(True)
            elif self.select_idx == 5:
                self.sound.secret2(True)
            self.music_flag = 0
        self.down_check(0)
        self.create_game_scene()
        if self.hp <= 0:
            if self.secret_flag and self.select_idx == 4:
                self.secret_change()
            else:
                self.game_over_flag = 2
                self.create_game_scene()
                self.field.draw_gameclear()
        elif self.can_move(self.x, self.y, self.rot_status):
            self.id = self.root.after(1000, self.game_main_proc)
        else:
            self.game_over_flag = 1
            self.create_game_scene()
            self.field.draw_gameover()


class Field:
    def __init__(self, canvas):
        self.canvas = canvas
        chara1_pre_img = Image.open("./src/pyfiles/data/yusha.png")
        chara1_pre_img = chara1_pre_img.resize((70, 70))
        chara1_pre_icon_img = chara1_pre_img.resize((50, 50))
        self.chara1_icon_img = ImageTk.PhotoImage(chara1_pre_icon_img)
        self.chara1_img = ImageTk.PhotoImage(chara1_pre_img)
        chara2_pre_img = Image.open("./src/pyfiles/data/senshi.png")
        chara2_pre_img = chara2_pre_img.resize((70, 70))
        chara2_pre_icon_img = chara2_pre_img.resize((50, 50))
        self.chara2_icon_img = ImageTk.PhotoImage(chara2_pre_icon_img)
        self.chara2_img = ImageTk.PhotoImage(chara2_pre_img)
        chara3_pre_img = Image.open("./src/pyfiles/data/mahotsukai.png")
        chara3_pre_img = chara3_pre_img.resize((70, 70))
        chara3_pre_icon_img = chara3_pre_img.resize((50, 50))
        self.chara3_icon_img = ImageTk.PhotoImage(chara3_pre_icon_img)
        self.chara3_img = ImageTk.PhotoImage(chara3_pre_img)
        easy_pre_img = Image.open("./src/pyfiles/data/slime.png")
        easy_pre_img = easy_pre_img.resize((70, 70))
        self.easy_img = ImageTk.PhotoImage(easy_pre_img)
        normal_pre_img = Image.open("./src/pyfiles/data/mummy.png")
        normal_pre_img = normal_pre_img.resize((70, 70))
        self.normal_img = ImageTk.PhotoImage(normal_pre_img)
        hard_pre_img = Image.open("./src/pyfiles/data/devil.png")
        hard_pre_img = hard_pre_img.resize((70, 70))
        self.hard_img = ImageTk.PhotoImage(hard_pre_img)
        expert_pre_img = Image.open("./src/pyfiles/data/shinigami.png")
        expert_pre_img = expert_pre_img.resize((70, 70))
        self.expert_img = ImageTk.PhotoImage(expert_pre_img)
        secret1_pre_img = Image.open("./src/pyfiles/data/mao.png")
        secret1_pre_img = secret1_pre_img.resize((70, 70))
        self.secret1_img = ImageTk.PhotoImage(secret1_pre_img)
        secret2_pre_img = Image.open("./src/pyfiles/data/dragon.png")
        secret2_pre_img = secret2_pre_img.resize((140, 120))
        self.secret2_img = ImageTk.PhotoImage(secret2_pre_img)
        self.description_flag = False
        self.charaselect_flag = False
        self.credit_flag = False
        self.fnt = ("Times New Roman", 10)
        self.clear_fnt = ("Times New Roman", BLOCK_SIZE + 10)
        self.press_fnt = ("Times New Roman", BLOCK_SIZE)

    def draw_background(self, select_idx):
        if select_idx == 0:
            self.canvas.create_image(325, 150, image=self.easy_img)
        elif select_idx == 1:
            self.canvas.create_image(325, 150, image=self.normal_img)
        elif select_idx == 2:
            self.canvas.create_image(325, 150, image=self.hard_img)
        elif select_idx == 3:
            self.canvas.create_image(325, 150, image=self.expert_img)
        elif select_idx == 4:
            self.canvas.create_image(325, 150, image=self.secret1_img)
        else:
            self.canvas.create_image(325, 120, image=self.secret2_img)

    def draw_description(self):
        self.canvas.create_rectangle(
            100, 100, 500, 500, outline="white", width=1, fill="black"
        )
        self.canvas.create_text(
            310, 150, text="操作方法", fill="white", font=("Times New Roman", 25)
        )
        self.canvas.create_text(
            310, 200, text="左右キー:移動", fill="white", font=("Times New Roman", 10)
        )
        self.canvas.create_text(
            310, 220, text="上キー:急降下", fill="white", font=("Times New Roman", 10)
        )
        self.canvas.create_text(
            310, 240, text="下キー:落下", fill="white", font=("Times New Roman", 10)
        )
        self.canvas.create_text(
            310, 260, text="Dキー:右回転", fill="white", font=("Times New Roman", 10)
        )
        self.canvas.create_text(
            310, 280, text="Aキー:左回転", fill="white", font=("Times New Roman", 10)
        )
        self.canvas.create_text(
            310, 300, text="Sキー:ホールド", fill="white", font=("Times New Roman", 10)
        )
        self.canvas.create_text(
            310, 320, text="Qキー:技", fill="white", font=("Times New Roman", 10)
        )

    def draw_charaselect(self, idx):
        self.canvas.create_rectangle(
            100, 100, 500, 500, outline="white", width=1, fill="black"
        )

        self.canvas.create_text(
            310,
            150,
            text="CHARACTER SELECT",
            fill="white",
            font=("Times New Roman", 25),
        )
        if idx == 0:
            self.canvas.create_image(150, 250, image=self.chara1_img)
            self.canvas.create_image(300, 300, image=self.chara2_img)
            self.canvas.create_image(450, 300, image=self.chara3_img)
        elif idx == 1:
            self.canvas.create_image(150, 300, image=self.chara1_img)
            self.canvas.create_image(300, 250, image=self.chara2_img)
            self.canvas.create_image(450, 300, image=self.chara3_img)
        elif idx == 2:
            self.canvas.create_image(150, 300, image=self.chara1_img)
            self.canvas.create_image(300, 300, image=self.chara2_img)
            self.canvas.create_image(450, 250, image=self.chara3_img)

    def draw_credit(self):
        self.canvas.create_rectangle(
            100, 100, 500, 500, outline="white", width=1, fill="black"
        )
        self.canvas.create_text(
            310, 150, text="CREDIT", fill="white", font=("Times New Roman", 30)
        )
        self.canvas.create_text(
            310, 250, text="music:魔王魂", fill="white", font=("Times New Roman", 25)
        )
        self.canvas.create_text(
            310,
            390,
            text="Illust:DOT ILLUST",
            fill="white",
            font=("Times New Roman", 25),
        )

    def draw_chara(self, idx, skill_count):
        self.canvas.create_rectangle(
            X0 - 65,
            Y0 + 70 + (BLOCK_SIZE * 5),
            X0 - 5,
            Y0 + 65 + (BLOCK_SIZE * 5) + (BLOCK_SIZE * 8),
            fill="",
            outline="white",
        )
        self.canvas.create_text(
            X0 - 35,
            Y0 + 80 + (BLOCK_SIZE * 5),
            text="SKILL",
            fill="white",
            font=self.fnt,
        )
        count = str(skill_count)
        if skill_count == 0:
            count = "OK"
        if idx == 0:
            self.canvas.create_image(
                X0 - 35, Y0 + 150 + (BLOCK_SIZE * 5), image=self.chara1_icon_img
            )
        elif idx == 1:
            self.canvas.create_image(
                X0 - 35, Y0 + 150 + (BLOCK_SIZE * 5), image=self.chara2_icon_img
            )
        else:
            self.canvas.create_image(
                X0 - 35, Y0 + 150 + (BLOCK_SIZE * 5), image=self.chara3_icon_img
            )
        self.canvas.create_text(
            X0 - 35,
            Y0 + 80 + (BLOCK_SIZE * 5) + 20,
            text=str(count),
            font=("Times New Roman", 20),
            fill="white",
        )

    ###
    def draw_field(self, mino_status):
        for y in range(FIELD_HEIGHT):
            for x in range(FIELD_WIDTH):
                x1 = x * BLOCK_SIZE + X0
                y1 = y * BLOCK_SIZE + Y0
                x2 = x1 + BLOCK_SIZE
                y2 = y1 + BLOCK_SIZE
                self.canvas.create_rectangle(
                    x1,
                    y1,
                    x2,
                    y2,
                    outline="white",
                    width=1,
                    fill=COLOR[mino_status[y][x]],
                )

    ###
    def draw_forecast(self, x, dy, rot_status, mino_idx, col_idx):
        m = MINO[mino_idx][rot_status]
        col = COLOR[col_idx]
        for i in range(4):
            x1 = (x + m[i][0]) * BLOCK_SIZE + X0
            y1 = (dy + m[i][1]) * BLOCK_SIZE + Y0
            x2 = x1 + BLOCK_SIZE
            y2 = y1 + BLOCK_SIZE
            self.canvas.create_rectangle(
                x1, y1, x2, y2, outline=col, width=1, fill="dark gray"
            )

    ###
    def draw_mino(self, x, y, rot_status, mino_idx, col_idx):
        m = MINO[mino_idx][rot_status]
        col = COLOR[col_idx]
        for i in range(4):
            x1 = (x + m[i][0]) * BLOCK_SIZE + X0
            y1 = (y + m[i][1]) * BLOCK_SIZE + Y0
            x2 = x1 + BLOCK_SIZE
            y2 = y1 + BLOCK_SIZE
            self.canvas.create_rectangle(
                x1, y1, x2, y2, outline="white", width=1, fill=col
            )

    def draw_hp(self, hp, select_idx):
        hp_x = X0 + BLOCK_SIZE
        bar = (canvas_width - (BLOCK_SIZE * 2)) / MAX_HP[select_idx]
        for i in range(hp):
            self.canvas.create_rectangle(
                hp_x, Y0 - 30, hp_x + bar, Y0 - 10, fill="green"
            )
            hp_x += bar

    ###
    def draw_hold(self, hold_idx):
        x = 3
        y = 3
        col = COLOR[hold_idx + 2]
        m = MINO[hold_idx][0]
        self.canvas.create_rectangle(
            X0 - 65, Y0, X0 - 5, Y0 + (BLOCK_SIZE * 4), fill="", outline="white"
        )
        self.canvas.create_text(
            X0 - 35, Y0 + 10, text="HOLD", fill="white", font=self.fnt
        )
        if hold_idx != -1:
            for i in range(4):
                if hold_idx == 2:
                    x1 = (x + m[i][0] - 0.5) * (BLOCK_SIZE * 2 / 3) + 155
                else:
                    x1 = (x + m[i][0]) * (BLOCK_SIZE * 2 / 3) + 155
                y1 = Y0 + (y + m[i][1] + 0.5) * (BLOCK_SIZE * 2 / 3) - 13
                x2 = x1 + (BLOCK_SIZE * 2 / 3)
                y2 = y1 + (BLOCK_SIZE * 2 / 3)
                self.canvas.create_rectangle(
                    x1, y1, x2, y2, outline="white", width=1, fill=col
                )

    ###
    def draw_next(self, next_mino):
        x = 1.5
        y = 2.5
        self.canvas.create_rectangle(
            X0 + canvas_width + 5,
            Y0,
            X0 + canvas_width + 65,
            Y0 + (BLOCK_SIZE * 12),
            fill="",
            outline="white",
        )
        self.canvas.create_text(
            X0 + canvas_width + 35, Y0 + 10, text="NEXT", fill="white", font=self.fnt
        )
        for i in range(3):
            m = MINO[next_mino[i]][0]
            col = COLOR[next_mino[i] + 2]
            for j in range(4):
                if next_mino[i] == 2:
                    x1 = (
                        (x + m[j][0] - 0.5) * (BLOCK_SIZE * 2 / 3)
                        + X0
                        + canvas_width
                        + 5
                    )
                else:
                    x1 = (x + m[j][0]) * (BLOCK_SIZE * 2 / 3) + X0 + canvas_width + 5
                y1 = (y + m[j][1]) * (BLOCK_SIZE * 2 / 3) + Y0
                x2 = x1 + (BLOCK_SIZE * 2 / 3)
                y2 = y1 + (BLOCK_SIZE * 2 / 3)
                self.canvas.create_rectangle(
                    x1, y1, x2, y2, outline="white", width=1, fill=col
                )
            y += 5

    def draw_attack(self, at_count):
        col = "green"
        self.canvas.create_rectangle(
            X0 - 65,
            Y0 + 65,
            X0 - 5,
            Y0 + 65 + (BLOCK_SIZE * 5),
            fill="",
            outline="white",
        )
        self.canvas.create_text(
            X0 - 35, Y0 + 75, text="ENEMY", font=self.fnt, fill="white"
        )
        self.canvas.create_text(
            X0 - 35, Y0 + 90, text="ATTACK", font=self.fnt, fill="white"
        )
        if at_count + 1 == 1:
            col = "red"
        elif at_count + 1 == 2:
            col = "yellow"
        self.canvas.create_text(
            X0 - 35,
            Y0 + 115,
            text=str(at_count + 1),
            font=("Times New Roman", 20),
            fill=col,
        )

    def draw_gameclear(self):
        self.canvas.create_text(
            canvas_width / 2 + X0,
            canvas_height / 2 + Y0 - 30,
            text="GameClear!",
            fill="black",
            font=self.clear_fnt,
        )
        self.canvas.create_text(
            canvas_width / 2 + X0,
            canvas_height / 2 + Y0 + 20,
            text="Press ESC",
            fill="black",
            font=self.press_fnt,
        )

    def draw_gameover(self):
        self.canvas.create_text(
            canvas_width / 2 + X0,
            canvas_height / 2 + Y0 - 30,
            text="Game Over",
            fill="black",
            font=self.clear_fnt,
        )
        self.canvas.create_text(
            canvas_width / 2 + X0,
            canvas_height / 2 + Y0 + 20,
            text="Press ESC",
            fill="black",
            font=self.press_fnt,
        )

    def draw_title(self):
        self.canvas.create_text(
            310, 100, text="TETRIS QUEST", fill="white", font=("Times New Roman", 40)
        )
        self.canvas.create_text(
            310, 450, text="Press Enter", fill="white", font=("Times New Roman", 20)
        )
        self.canvas.create_image(100, 200, image=self.chara1_img)
        self.canvas.create_image(300, 200, image=self.chara2_img)
        self.canvas.create_image(500, 200, image=self.chara3_img)
        self.canvas.create_image(100, 350, image=self.easy_img)
        self.canvas.create_image(300, 350, image=self.normal_img)
        self.canvas.create_image(500, 350, image=self.hard_img)

    def draw_select(self, select_idx, chara_idx, secret_flag):
        if self.description_flag:
            self.draw_description()
        elif self.charaselect_flag:
            self.draw_charaselect(chara_idx)
        elif self.credit_flag:
            self.draw_credit()
        else:
            if select_idx == -3:
                # des
                self.canvas.create_line(470, 160, 530, 160, fill="white")
                self.canvas.create_image(80, 120, image=self.easy_img)
                self.canvas.create_image(80, 210, image=self.normal_img)
                self.canvas.create_image(80, 300, image=self.hard_img)
                self.canvas.create_image(80, 390, image=self.expert_img)
                if secret_flag:
                    self.canvas.create_image(80, 480, image=self.secret1_img)
            elif select_idx == -2:
                # chara
                self.canvas.create_line(450, 310, 550, 310, fill="white")
                self.canvas.create_image(80, 120, image=self.easy_img)
                self.canvas.create_image(80, 210, image=self.normal_img)
                self.canvas.create_image(80, 300, image=self.hard_img)
                self.canvas.create_image(80, 390, image=self.expert_img)
                if secret_flag:
                    self.canvas.create_image(80, 480, image=self.secret1_img)
            elif select_idx == -1:
                self.canvas.create_line(450, 460, 550, 460, fill="white")
                self.canvas.create_image(80, 120, image=self.easy_img)
                self.canvas.create_image(80, 210, image=self.normal_img)
                self.canvas.create_image(80, 300, image=self.hard_img)
                self.canvas.create_image(80, 390, image=self.expert_img)
                if secret_flag:
                    self.canvas.create_image(80, 480, image=self.secret1_img)
            elif select_idx == 0:
                self.canvas.create_line(160, 130, 240, 130, fill="white")
                self.canvas.create_image(80, 110, image=self.easy_img)
                self.canvas.create_image(80, 210, image=self.normal_img)
                self.canvas.create_image(80, 300, image=self.hard_img)
                self.canvas.create_image(80, 390, image=self.expert_img)
                if secret_flag:
                    self.canvas.create_image(80, 480, image=self.secret1_img)
            elif select_idx == 1:
                self.canvas.create_line(140, 220, 260, 220, fill="white")
                self.canvas.create_image(80, 120, image=self.easy_img)
                self.canvas.create_image(80, 200, image=self.normal_img)
                self.canvas.create_image(80, 300, image=self.hard_img)
                self.canvas.create_image(80, 390, image=self.expert_img)
                if secret_flag:
                    self.canvas.create_image(80, 480, image=self.secret1_img)
            elif select_idx == 2:
                self.canvas.create_line(160, 310, 240, 310, fill="white")
                self.canvas.create_image(80, 120, image=self.easy_img)
                self.canvas.create_image(80, 210, image=self.normal_img)
                self.canvas.create_image(80, 290, image=self.hard_img)
                self.canvas.create_image(80, 390, image=self.expert_img)
                if secret_flag:
                    self.canvas.create_image(80, 480, image=self.secret1_img)
            elif select_idx == 3:
                self.canvas.create_line(140, 400, 260, 400, fill="white")
                self.canvas.create_image(80, 120, image=self.easy_img)
                self.canvas.create_image(80, 210, image=self.normal_img)
                self.canvas.create_image(80, 300, image=self.hard_img)
                self.canvas.create_image(80, 380, image=self.expert_img)
                if secret_flag:
                    self.canvas.create_image(80, 480, image=self.secret1_img)
            elif select_idx == 4:
                self.canvas.create_line(140, 490, 260, 490, fill="white")
                self.canvas.create_image(80, 120, image=self.easy_img)
                self.canvas.create_image(80, 210, image=self.normal_img)
                self.canvas.create_image(80, 300, image=self.hard_img)
                self.canvas.create_image(80, 390, image=self.expert_img)
                if secret_flag:
                    self.canvas.create_image(80, 470, image=self.secret1_img)
            self.canvas.create_text(
                500, 150, text="HOW", fill="white", font=("Times New Roman", 20)
            )
            self.canvas.create_text(
                500, 300, text="CHARA", fill="white", font=("Times New Roman", 20)
            )
            self.canvas.create_text(
                500, 450, text="CREDIT", fill="white", font=("Times New Roman", 20)
            )
            self.canvas.create_text(
                200, 120, text="EASY", fill="white", font=("Times New Roman", 20)
            )
            self.canvas.create_text(
                200, 210, text="NORMAL", fill="white", font=("Times New Roman", 20)
            )
            self.canvas.create_text(
                200, 300, text="HARD", fill="white", font=("Times New Roman", 20)
            )
            self.canvas.create_text(
                200, 390, text="EXPERT", fill="white", font=("Times New Roman", 20)
            )
            if secret_flag:
                self.canvas.create_text(
                    200, 480, text="SECRET", fill="yellow", font=("Times New Roman", 20)
                )


class Sound:
    def __init__(self):
        pygame.mixer.init()
        self.menu_bgm = pygame.mixer.Sound("./src/pyfiles/data/menu.mp3")
        self.easy_bgm = pygame.mixer.Sound("./src/pyfiles/data/easy.mp3")
        self.normal_bgm = pygame.mixer.Sound("./src/pyfiles/data/normal.mp3")
        self.hard_bgm = pygame.mixer.Sound("./src/pyfiles/data/hard.mp3")
        self.expert_bgm = pygame.mixer.Sound("./src/pyfiles/data/expert.mp3")
        self.secret1_bgm = pygame.mixer.Sound("./src/pyfiles/data/secret1.mp3")
        self.secret2_bgm = pygame.mixer.Sound("./src/pyfiles/data/secret2.mp3")
        self.select_sound = pygame.mixer.Sound("./src/pyfiles/data/select.mp3")
        self.cancel_sound = pygame.mixer.Sound("./src/pyfiles/data/cancel.mp3")
        self.move_sound = pygame.mixer.Sound("./src/pyfiles/data/move.mp3")
        self.tspin_sound = pygame.mixer.Sound("./src/pyfiles/data/tspin.mp3")
        self.hold_sound = pygame.mixer.Sound("./src/pyfiles/data/hold.mp3")
        self.damage_sound = pygame.mixer.Sound("./src/pyfiles/data/damage.mp3")
        self.up_sound = pygame.mixer.Sound("./src/pyfiles/data/up.mp3")
        self.skill_sound = pygame.mixer.Sound("./src/pyfiles/data/skill.mp3")
        self.tspin_sound = pygame.mixer.Sound("./src/pyfiles/data/tspin.mp3")

    def menu(self, play):
        if play:
            self.menu_bgm.play(loops=-1)
        else:
            pygame.mixer.Sound.stop(self.menu_bgm)

    def easy(self, play):
        if play:
            self.easy_bgm.play(loops=-1)
        else:
            pygame.mixer.Sound.stop(self.easy_bgm)

    def normal(self, play):
        if play:
            self.normal_bgm.play(loops=-1)
        else:
            pygame.mixer.Sound.stop(self.normal_bgm)

    def hard(self, play):
        if play:
            self.hard_bgm.play(loops=-1)
        else:
            pygame.mixer.Sound.stop(self.hard_bgm)

    def expert(self, play):
        if play:
            self.expert_bgm.play(loops=-1)
        else:
            pygame.mixer.Sound.stop(self.expert_bgm)

    def secret1(self, play):
        if play:
            self.secret1_bgm.play(loops=-1)
        else:
            pygame.mixer.Sound.stop(self.secret1_bgm)

    def secret2(self, play):
        if play:
            self.secret2_bgm.play(loops=-1)
        else:
            pygame.mixer.Sound.stop(self.secret2_bgm)


def main():
    root = tk.Tk()
    root.title("tetris quest")
    root.resizable(False, False)
    root.geometry("600x540+300+50")

    canvas = tk.Canvas(root, width=620, height=560, bg="black")
    canvas.place(x=-10, y=-10)

    system_handler = SystemHandler(root, canvas)
    root.bind("<KeyPress>", system_handler.key)
    root.mainloop()


if __name__ == "__main__":
    main()
