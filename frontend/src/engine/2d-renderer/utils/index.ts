import { Socket } from "socket.io-client";
import { RoomScene } from "../scenes/RoomScene";
import { useRendererStore } from "@/engine/2d-renderer/store/RendererStore";
import { Room } from "../../../../../shared/types";
import { api } from "@/api";
import { GameObjects } from "phaser";
import { Direction, PhaserTileLayer } from "grid-engine";
import Chair from "../items/Chair";
import Computer from "../items/Computer";
import Whiteboard from "../items/WhiteBoard";
import VendingMachine from "../items/VendingMachine";
import Item from "../items/Item";
import { WS_MESSAGE } from "../events";
import { useRoomStore } from "@/global-store/RoomStore";

export const registerRendererEvents = (
  conn: Socket,
  scene: RoomScene,
  map: any
) => {
  conn.on(WS_MESSAGE.WS_NEW_USER_JOINED_ROOM, (d: any) => {
    console.log("[LOGGING]: new-user-joined-room", "data: ", d);

    if (!scene.gridEngine) {
      return;
    }

    if (scene.gridEngine.hasCharacter(d.user.userId)) {
      return;
    }

    const sprite = scene.physics.add.sprite(0, 0, d.user.skin.toLowerCase());

    const playerName = scene.add
      .dom(0, -20)
      .createFromHTML(
        `
      <div id="${d.user.userId}_indicator" style="display: flex; align-items: center; justify-content:center; color: rgba(255, 255, 255, 0.8); font-size: 10px; font-family: Inter; font-weight: bold; background: rgba(0, 0, 0, 0.4); padding: 2px 9px; border-radius: 50px; width: 67px; overflow: hidden;">
        <span id="${d.user.userId}_status_indicator" style="display: inline-block; width: 8px; height: 8px; background: #50C878; border-radius: 50%; margin-right: 3.9px;"></span>
        <span id="${d.user.userId}_speaker" style="margin-right: 5px; display:none; animation: dimInOut 3s infinite;">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="white" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-volume-2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
        </span>
        <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
          ${d.user.userName}
        </div>
      </div>
      `
      )
      .setOrigin(0.225);

    const playerIcon = scene.add
      .dom(5, -35)
      .createFromHTML(
        `<div id="${d.user.userId}_icon" style="position: relative; background: white; padding: 4px 10px; border-radius: 3px; text-align: center; font-size: 16px;">
            <span role="img" aria-label="emoji">👋</span>
            <div style="position: absolute; bottom: -3px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 5px solid white;"></div>
          </div>`
      )
      .setOrigin(0.225)
      .setVisible(false);

    const playerContainer = scene.add.container(d.user.posX, d.user.posY, [
      sprite,
      playerName,
      playerIcon,
    ]);

    sprite?.anims.play(
      `${sprite.texture.key.split("_")[0].toLowerCase()}_idle_${d.user.dir}`
    );

    scene.gridEngine.addCharacter({
      id: d.user.userId,
      sprite,
      container: playerContainer,
      startPosition: { x: d.user.posX, y: d.user.posY },
    });
  });

  conn.on(WS_MESSAGE.WS_PARTICIPANT_LEFT, (d: any) => {
    console.log("[LOGGING]: participant-left", "data: ", d);

    if (!scene.gridEngine) {
      return;
    }

    const container = scene.gridEngine.getContainer(d.participantId);
    scene.gridEngine.removeCharacter(d.participantId);
    container?.destroy();
  });

  conn.on(WS_MESSAGE.WS_PARTICIPANT_MOVED, (d: any) => {
    console.log("[LOGGING]: Participant-moved", "data: ", d);

    if (!scene.gridEngine) {
      return;
    }

    const user = useRendererStore.getState().user;

    if (d.participantId !== user.userId) {
      scene.gridEngine.moveTo(d.participantId, { x: d.posX, y: d.posY });
      scene.gridEngine.turnTowards(d.participantId, d.dir);
    }
  });

  conn.on(WS_MESSAGE.WS_USER_SPEAKING, (d: any) => {
    console.log("[LOGGING]: User speaking", d.participantId);
    const element = document.getElementById(`${d.participantId}_indicator`);
    const speakerIcon = document.getElementById(`${d.participantId}_speaker`);
    const statusIndicator = document.getElementById(
      `${d.participantId}_status_indicator`
    ); // Get the status indicator span
    if (element && speakerIcon && statusIndicator) {
      element.style.border = "1.3px solid #43b581";
      speakerIcon.style.display = "inline"; // Show the speaker icon
      statusIndicator.style.display = "none"; // Hide the status indicator
    }
  });

  conn.on(WS_MESSAGE.WS_USER_STOPPED_SPEAKING, (d: any) => {
    console.log("[LOGGING]: User stopped speaking", d.participantId);
    const element = document.getElementById(`${d.participantId}_indicator`);
    const speakerIcon = document.getElementById(`${d.participantId}_speaker`);
    const statusIndicator = document.getElementById(
      `${d.participantId}_status_indicator`
    ); // Get the status indicator span
    if (element && speakerIcon && statusIndicator) {
      element.style.border = "";
      speakerIcon.style.display = "none"; // Hide the speaker icon
      statusIndicator.style.display = "inline"; // Show the status indicator
    }
  });
};

export const registerSpriteAnimations32 = (scene: RoomScene) => {
  const animsFrameRate = 15;

  scene.anims.create({
    key: "nancy_idle_right",
    frames: scene.anims.generateFrameNames("nancy", {
      start: 0,
      end: 5,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  scene.anims.create({
    key: "nancy_idle_up",
    frames: scene.anims.generateFrameNames("nancy", {
      start: 6,
      end: 11,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  scene.anims.create({
    key: "nancy_idle_left",
    frames: scene.anims.generateFrameNames("nancy", {
      start: 12,
      end: 17,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  scene.anims.create({
    key: "nancy_idle_down",
    frames: scene.anims.generateFrameNames("nancy", {
      start: 18,
      end: 23,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  scene.anims.create({
    key: "nancy_run_right",
    frames: scene.anims.generateFrameNames("nancy", {
      start: 24,
      end: 29,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  });

  scene.anims.create({
    key: "nancy_run_up",
    frames: scene.anims.generateFrameNames("nancy", {
      start: 30,
      end: 35,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  });

  scene.anims.create({
    key: "nancy_run_left",
    frames: scene.anims.generateFrameNames("nancy", {
      start: 36,
      end: 41,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  });

  scene.anims.create({
    key: "nancy_run_down",
    frames: scene.anims.generateFrameNames("nancy", {
      start: 42,
      end: 47,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  });

  scene.anims.create({
    key: "nancy_sit_down",
    frames: scene.anims.generateFrameNames("nancy", {
      start: 48,
      end: 48,
    }),
    repeat: 0,
    frameRate: animsFrameRate,
  });

  scene.anims.create({
    key: "nancy_sit_left",
    frames: scene.anims.generateFrameNames("nancy", {
      start: 49,
      end: 49,
    }),
    repeat: 0,
    frameRate: animsFrameRate,
  });

  scene.anims.create({
    key: "nancy_sit_right",
    frames: scene.anims.generateFrameNames("nancy", {
      start: 50,
      end: 50,
    }),
    repeat: 0,
    frameRate: animsFrameRate,
  });

  scene.anims.create({
    key: "nancy_sit_up",
    frames: scene.anims.generateFrameNames("nancy", {
      start: 51,
      end: 51,
    }),
    repeat: 0,
    frameRate: animsFrameRate,
  });

  scene.anims.create({
    key: "lucy_idle_right",
    frames: scene.anims.generateFrameNames("lucy", {
      start: 0,
      end: 5,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  scene.anims.create({
    key: "lucy_idle_up",
    frames: scene.anims.generateFrameNames("lucy", {
      start: 6,
      end: 11,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  scene.anims.create({
    key: "lucy_idle_left",
    frames: scene.anims.generateFrameNames("lucy", {
      start: 12,
      end: 17,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  scene.anims.create({
    key: "lucy_idle_down",
    frames: scene.anims.generateFrameNames("lucy", {
      start: 18,
      end: 23,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  scene.anims.create({
    key: "lucy_run_right",
    frames: scene.anims.generateFrameNames("lucy", {
      start: 24,
      end: 29,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  });

  scene.anims.create({
    key: "lucy_run_up",
    frames: scene.anims.generateFrameNames("lucy", {
      start: 30,
      end: 35,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  });

  scene.anims.create({
    key: "lucy_run_left",
    frames: scene.anims.generateFrameNames("lucy", {
      start: 36,
      end: 41,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  });

  scene.anims.create({
    key: "lucy_run_down",
    frames: scene.anims.generateFrameNames("lucy", {
      start: 42,
      end: 47,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  });

  scene.anims.create({
    key: "lucy_sit_down",
    frames: scene.anims.generateFrameNames("lucy", {
      start: 48,
      end: 48,
    }),
    repeat: 0,
    frameRate: animsFrameRate,
  });

  scene.anims.create({
    key: "lucy_sit_left",
    frames: scene.anims.generateFrameNames("lucy", {
      start: 49,
      end: 49,
    }),
    repeat: 0,
    frameRate: animsFrameRate,
  });

  scene.anims.create({
    key: "lucy_sit_right",
    frames: scene.anims.generateFrameNames("lucy", {
      start: 50,
      end: 50,
    }),
    repeat: 0,
    frameRate: animsFrameRate,
  });

  scene.anims.create({
    key: "lucy_sit_up",
    frames: scene.anims.generateFrameNames("lucy", {
      start: 51,
      end: 51,
    }),
    repeat: 0,
    frameRate: animsFrameRate,
  });

  scene.anims.create({
    key: "ash_idle_right",
    frames: scene.anims.generateFrameNames("ash", {
      start: 0,
      end: 5,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  scene.anims.create({
    key: "ash_idle_up",
    frames: scene.anims.generateFrameNames("ash", {
      start: 6,
      end: 11,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  scene.anims.create({
    key: "ash_idle_left",
    frames: scene.anims.generateFrameNames("ash", {
      start: 12,
      end: 17,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  scene.anims.create({
    key: "ash_idle_down",
    frames: scene.anims.generateFrameNames("ash", {
      start: 18,
      end: 23,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  scene.anims.create({
    key: "ash_run_right",
    frames: scene.anims.generateFrameNames("ash", {
      start: 24,
      end: 29,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  });

  scene.anims.create({
    key: "ash_run_up",
    frames: scene.anims.generateFrameNames("ash", {
      start: 30,
      end: 35,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  });

  scene.anims.create({
    key: "ash_run_left",
    frames: scene.anims.generateFrameNames("ash", {
      start: 36,
      end: 41,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  });

  scene.anims.create({
    key: "ash_run_down",
    frames: scene.anims.generateFrameNames("ash", {
      start: 42,
      end: 47,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  });

  scene.anims.create({
    key: "ash_sit_down",
    frames: scene.anims.generateFrameNames("ash", {
      start: 48,
      end: 48,
    }),
    repeat: 0,
    frameRate: animsFrameRate,
  });

  scene.anims.create({
    key: "ash_sit_left",
    frames: scene.anims.generateFrameNames("ash", {
      start: 49,
      end: 49,
    }),
    repeat: 0,
    frameRate: animsFrameRate,
  });

  scene.anims.create({
    key: "ash_sit_right",
    frames: scene.anims.generateFrameNames("ash", {
      start: 50,
      end: 50,
    }),
    repeat: 0,
    frameRate: animsFrameRate,
  });

  scene.anims.create({
    key: "ash_sit_up",
    frames: scene.anims.generateFrameNames("ash", {
      start: 51,
      end: 51,
    }),
    repeat: 0,
    frameRate: animsFrameRate,
  });

  scene.anims.create({
    key: "adam_idle_right",
    frames: scene.anims.generateFrameNames("adam", {
      start: 0,
      end: 5,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  scene.anims.create({
    key: "adam_idle_up",
    frames: scene.anims.generateFrameNames("adam", {
      start: 6,
      end: 11,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  scene.anims.create({
    key: "adam_idle_left",
    frames: scene.anims.generateFrameNames("adam", {
      start: 12,
      end: 17,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  scene.anims.create({
    key: "adam_idle_down",
    frames: scene.anims.generateFrameNames("adam", {
      start: 18,
      end: 23,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  scene.anims.create({
    key: "adam_run_right",
    frames: scene.anims.generateFrameNames("adam", {
      start: 24,
      end: 29,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  });

  scene.anims.create({
    key: "adam_run_up",
    frames: scene.anims.generateFrameNames("adam", {
      start: 30,
      end: 35,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  });

  scene.anims.create({
    key: "adam_run_left",
    frames: scene.anims.generateFrameNames("adam", {
      start: 36,
      end: 41,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  });

  scene.anims.create({
    key: "adam_run_down",
    frames: scene.anims.generateFrameNames("adam", {
      start: 42,
      end: 47,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  });

  scene.anims.create({
    key: "adam_sit_down",
    frames: scene.anims.generateFrameNames("adam", {
      start: 48,
      end: 48,
    }),
    repeat: 0,
    frameRate: animsFrameRate,
  });

  scene.anims.create({
    key: "adam_sit_left",
    frames: scene.anims.generateFrameNames("adam", {
      start: 49,
      end: 49,
    }),
    repeat: 0,
    frameRate: animsFrameRate,
  });

  scene.anims.create({
    key: "adam_sit_right",
    frames: scene.anims.generateFrameNames("adam", {
      start: 50,
      end: 50,
    }),
    repeat: 0,
    frameRate: animsFrameRate,
  });

  scene.anims.create({
    key: "adam_sit_up",
    frames: scene.anims.generateFrameNames("adam", {
      start: 51,
      end: 51,
    }),
    repeat: 0,
    frameRate: animsFrameRate,
  });
};

export const registerSprites = (conn: Socket, scene: RoomScene, map: any) => {
  let me: Phaser.GameObjects.Sprite;
  const room = useRendererStore.getState().room as Room & {
    participants: any[];
  };
  const user = useRendererStore.getState().user;

  const characters = room.participants.map(
    (participant: any, index: number) => {
      let sprite = scene.physics.add.sprite(
        0,
        0,
        participant.skin.toLowerCase()
      );

      const playerName = scene.add
        .dom(0, -20)
        .createFromHTML(
          `
      <div id="${participant.userId}_indicator" style="display: flex; align-items: center; justify-content:center; color: rgba(255, 255, 255, 0.8); font-size: 10px; font-family: Inter; font-weight: bold; background: rgba(0, 0, 0, 0.4); padding: 2px 9px; border-radius: 50px; width: 67px; overflow: hidden;">
        <span id="${participant.userId}_status_indicator" style="display: inline-block; width: 8px; height: 8px; background: #50C878; border-radius: 50%; margin-right: 3.9px;"></span>
        <span id="${participant.userId}_speaker" style="margin-right: 5px; display:none; animation: dimInOut 3s infinite;">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="white" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-volume-2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
        </span>
        <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
          ${participant.userName}
        </div>
      </div>
      `
        )
        .setOrigin(0.225);
      const playerIcon = scene.add
        .dom(5, -35)
        .createFromHTML(
          `<div id="${participant.userId}_icon" style="position: relative; background: white; padding: 4px 10px; border-radius: 3px; text-align: center; font-size: 16px;">
            <span role="img" aria-label="emoji">👋</span>
            <div style="position: absolute; bottom: -3px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 5px solid white;"></div>
          </div>`
        )
        .setOrigin(0.225)
        .setVisible(false);

      const playerContainer = scene.add.container(
        participant.posX,
        participant.posY,
        [sprite, playerName, playerIcon]
      );

      playerContainer.setDataEnabled();

      playerContainer.setData("currentBehavior", PlayerBehaviour.IDLE);

      playerContainer.update = () => {
        updatePlayerContainer(scene);
      };

      sprite?.anims.play(
        `${sprite.texture.key.split("_")[0].toLowerCase()}_idle_${
          participant.dir
        }`
      );

      if (user.userId === participant.userId) {
        me = sprite;
        me.setInteractive();

        scene.cameras.main.startFollow(playerContainer, true);
        scene.cameras.main.setFollowOffset(-me.width, -me.height);

        me.on("pointerdown", (pointer: any) => {
          const ctxTrigger = document.querySelector("#ctx-menu-trigger");
          const event = new MouseEvent("contextmenu", {
            bubbles: true,
            cancelable: true,
            view: window,
            button: 2,
            buttons: 2,
            clientX: pointer.x,
            clientY: pointer.y,
          });
          ctxTrigger!.dispatchEvent(event);
          console.log("me clicked");
        });
      }

      return {
        id: participant.userId,
        sprite,
        container: playerContainer,
        startPosition: {
          x: participant.posX,
          y: participant.posY,
        },
      };
    }
  );

  const gridEngineConfig = {
    characters,
  };

  if (!scene.gridEngine) {
    return;
  }

  // initialize grid engine
  scene.gridEngine.create(map, gridEngineConfig);
};

export const registerGridEngineEvents = (conn: Socket, scene: RoomScene) => {
  if (!scene.gridEngine || !conn) {
    return;
  }

  const room = useRendererStore.getState().room as Room & {
    participants: any[];
  };

  // subscribe to movement events
  scene.gridEngine.movementStarted().subscribe(({ charId, direction }: any) => {
    if (!scene.gridEngine) {
      return;
    }

    const sprite = scene.gridEngine.getSprite(charId);
    const user = useRendererStore.getState().user;

    sprite?.anims.play(
      `${sprite.texture.key.split("_")[0].toLowerCase()}_run_${direction}`
    );

    const dir = scene.gridEngine.getFacingDirection(user.userId!!);
    const posX = scene.gridEngine.getPosition(user.userId!!).x;
    const posY = scene.gridEngine.getPosition(user.userId!!).y;

    if (charId === user.userId) {
      conn.emit(WS_MESSAGE.WS_ROOM_MOVE, {
        roomId: room.roomId,
        dir: scene.gridEngine.getFacingDirection(user.userId!!),
        posX: scene.gridEngine.getPosition(user.userId!!).x,
        posY: scene.gridEngine.getPosition(user.userId!!).y,
      });

      Promise.all([
        api.put(
          `/room/room-status/update/${user.userId}?roomId=${room.roomId}&state=pos_x&value=${posX}`
        ),
        api.put(
          `/room/room-status/update/${user.userId}?roomId=${room.roomId}&state=pos_y&value=${posY}`
        ),
        api.put(
          `/room/room-status/update/${user.userId}?roomId=${room.roomId}&state=dir&value=${dir}`
        ),
      ]).then(() => {});
    }
  });

  scene.gridEngine.movementStopped().subscribe(({ charId, direction }: any) => {
    if (!scene.gridEngine) {
      return;
    }

    const sprite = scene.gridEngine.getSprite(charId);
    const user = useRendererStore.getState().user;

    const dir = scene.gridEngine?.getFacingDirection(user.userId!!);
    const posX = scene.gridEngine?.getPosition(user.userId!!).x;
    const posY = scene.gridEngine?.getPosition(user.userId!!).y;

    sprite?.anims.stop();
    sprite?.anims.play(
      `${sprite.texture.key.split("_")[0].toLowerCase()}_idle_${direction}`
    );

    if (charId === user.userId) {
      conn.emit(WS_MESSAGE.WS_ROOM_MOVE, {
        roomId: room.roomId,
        dir: scene.gridEngine?.getFacingDirection(user.userId!!),
        posX: scene.gridEngine?.getPosition(user.userId!!).x,
        posY: scene.gridEngine?.getPosition(user.userId!!).y,
      });

      Promise.all([
        api.put(
          `/room/room-status/update/${user.userId}?roomId=${room.roomId}&state=pos_x&value=${posX}`
        ),
        api.put(
          `/room/room-status/update/${user.userId}?roomId=${room.roomId}&state=pos_y&value=${posY}`
        ),
        api.put(
          `/room/room-status/update/${user.userId}?roomId=${room.roomId}&state=dir&value=${dir}`
        ),
      ]).then(() => {});
    }
  });

  scene.gridEngine
    .directionChanged()
    .subscribe(({ charId, direction }: any) => {
      if (!scene.gridEngine) {
        return;
      }

      const sprite = scene.gridEngine.getSprite(charId);
      const user = useRendererStore.getState().user;

      const dir = scene.gridEngine?.getFacingDirection(user.userId!!);
      const posX = scene.gridEngine?.getPosition(user.userId!!).x;
      const posY = scene.gridEngine?.getPosition(user.userId!!).y;

      sprite?.anims.play(
        `${sprite.texture.key.split("_")[0]}_idle_${direction}`
      );

      if (charId === user.userId) {
        conn.emit(WS_MESSAGE.WS_ROOM_MOVE, {
          roomId: room.roomId,
          dir: scene.gridEngine?.getFacingDirection(user.userId!!),
          posX: scene.gridEngine?.getPosition(user.userId!!).x,
          posY: scene.gridEngine?.getPosition(user.userId!!).y,
        });

        Promise.all([
          api.put(
            `/room/room-status/update/${user.userId}?roomId=${room.roomId}&state=pos_x&value=${posX}`
          ),
          api.put(
            `/room/room-status/update/${user.userId}?roomId=${room.roomId}&state=pos_y&value=${posY}`
          ),
          api.put(
            `/room/room-status/update/${user.userId}?roomId=${room.roomId}&state=dir&value=${direction}`
          ),
        ]).then(() => {});
      }
    });
};

export const registerUserActionCollider = (scene: RoomScene) => {
  if (!scene.gridEngine || !scene.user) {
    console.log("user Action Collider not ready");
    return;
  }

  const myContainer = scene.gridEngine.getContainer(
    scene.user.userId as string
  );

  if (!myContainer) {
    console.log(
      "myContainer not found: Registering user action collider failed"
    );
    return;
  }

  scene.userActionCollider = createInteractiveGameObject(
    scene,
    myContainer.x,
    myContainer.y,
    32,
    32,
    true,
    "user-action-collider"
  ) as GameObjects.Rectangle;

  scene.userActionCollider.setDataEnabled();

  scene.userActionCollider.update = () => {
    updateActionCollider(scene);
  };
};

export const registerUserProximityCollider = (scene: RoomScene) => {
  if (!scene.gridEngine || !scene.user) {
    console.log("user Proximity Collider not ready");
    return;
  }

  const myContainer = scene.gridEngine.getContainer(
    scene.user.userId as string
  );

  if (!myContainer) {
    console.log(
      "myContainer not found: Registering user proximity collider failed"
    );
    return;
  }

  scene.userProximityCollider = createInteractiveGameObject(
    scene,
    myContainer.x,
    myContainer.y,
    256,
    256,
    true,
    "user-proximity-collider",
    { x: myContainer.originX - 0.05, y: myContainer.originY - 0.05 }
  ) as GameObjects.Rectangle;

  scene.userProximityCollider.setDataEnabled();

  scene.userProximityCollider.update = () => {
    updateProximityCollider(scene);
  };
};

export const updateProximityCollider = (scene: RoomScene) => {
  if (!scene.gridEngine || !scene.userProximityCollider) {
    return;
  }

  const myContainer = scene.gridEngine.getContainer(
    scene.user.userId as string
  );
  const userId = useRendererStore.getState().user.userId as string;
  const facingDirection = scene.gridEngine.getFacingDirection(userId!!);

  const me = scene.gridEngine.getContainer(
    userId as string
  ) as GameObjects.Container;

  switch (facingDirection) {
    case Direction.DOWN: {
      scene.userProximityCollider.setX(me.x);
      scene.userProximityCollider.setY(me.y);
      break;
    }

    case Direction.UP: {
      scene.userProximityCollider.setX(me.x);
      scene.userProximityCollider.setY(me.y);
      break;
    }

    case Direction.LEFT: {
      scene.userProximityCollider.setX(me.x);
      scene.userProximityCollider.setY(me.y);
      break;
    }

    case Direction.RIGHT: {
      scene.userProximityCollider.setX(me.x);
      scene.userProximityCollider.setY(me.y);
      break;
    }

    default: {
      // will never happen
      break;
    }
  }
};

export const registerItems = (scene: RoomScene) => {
  if (!scene.map) {
    return;
  }

  const set = useRendererStore.getState().set;

  // create chairs from object layer
  const chairs = scene.physics.add.staticGroup({ classType: Chair });
  const chairLayer = scene.map.getObjectLayer("Chair");
  chairLayer!.objects.forEach((chairObj: any) => {
    const item = scene.addObjectFromTiled(
      chairs,
      chairObj,
      "chairs",
      "chair"
    ) as Chair;
    item.itemDirection = chairObj.properties[0].value;
  });

  // create computers from object layer
  const computers = scene.physics.add.staticGroup({ classType: Computer });
  const computerLayer = scene.map.getObjectLayer("Computer");
  computerLayer!.objects.forEach((obj, i) => {
    const item = scene.addObjectFromTiled(
      computers,
      obj,
      "computers",
      "computer"
    ) as Computer;
    item.setDepth(item.y + item.height * 0.27);
    const id = `${i}`;
    item.id = id;
    set((state) => ({ computerStore: { ...state.computerStore, [id]: item } }));
  });

  // create whiteboards from object layer
  const whiteboards = scene.physics.add.staticGroup({ classType: Whiteboard });
  const whiteboardLayer = scene.map.getObjectLayer("Whiteboard");
  whiteboardLayer!.objects.forEach((obj, i) => {
    const item = scene.addObjectFromTiled(
      whiteboards,
      obj,
      "whiteboards",
      "whiteboard"
    ) as Whiteboard;
    const id = `${i}`;
    item.id = id;
    set((state) => ({
      whiteboardStore: { ...state.whiteboardStore, [id]: item },
    }));
  });

  // create vending machines from object layer
  const vendingMachines = scene.physics.add.staticGroup({
    classType: VendingMachine,
  });
  const vendingMachineLayer = scene.map.getObjectLayer("VendingMachine");
  vendingMachineLayer?.objects.forEach((obj, i) => {
    scene.addObjectFromTiled(
      vendingMachines,
      obj,
      "vendingmachines",
      "vendingmachine"
    );
  });

  scene.physics.add.collider(
    scene.userActionCollider,
    [chairs, computers, vendingMachines, whiteboards],
    (a, b) => {
      const selectedItem = [a, b].find(
        (obj) => obj !== scene.userActionCollider
      ) as Item;

      const currentItem = scene.userActionCollider.data.get("selectedItem");

      if (
        selectedItem === currentItem ||
        currentItem?.depth >= selectedItem.depth
      ) {
        return;
      }

      // If there's a current item and it's different from the selected item, deselect it
      if (currentItem && currentItem !== selectedItem) {
        currentItem.removeHiglight(scene.postFxPlugin);
        currentItem.clearDialogBox();
      }

      scene.userActionCollider.data.set("selectedItem", selectedItem);
      selectedItem.setHighlight(scene.postFxPlugin);
      switch (selectedItem.itemType) {
        case ItemType.CHAIR:
          selectedItem.setDialogBox(
            "<span>Press <kbd class='key'>E</kbd> to interact</span>"
          );
          break;
        case ItemType.COMPUTER:
          selectedItem.setDialogBox(
            "<span>Press <kbd class='key'>R</kbd> to interact</span>"
          );
          break;
        case ItemType.WHITEBOARD:
          selectedItem.setDialogBox(
            "<span>Press <kbd class='key'>R</kbd> to interact</span>"
          );
          break;
        case ItemType.VENDINGMACHINE:
          selectedItem.setDialogBox(
            "<span>Press <kbd class='key'>R</kbd> to interact</span>"
          );
          break;
        default:
          break;
      }
    }
  );
};

export const registerKeys = (scene: RoomScene) => {
  if (!scene || !scene.input || !scene.input.keyboard) {
    console.log("scene or scene.input.keyboard is null");
    return;
  }

  scene.cursors = {
    ...scene.input.keyboard.createCursorKeys(),
    ...(scene.input.keyboard.addKeys("W,S,A,D") as Keyboard),
  };

  scene.keyE = scene.input.keyboard.addKey("E");
  scene.keyR = scene.input.keyboard.addKey("R");
};

export const registerMapObjects = (scene: RoomScene) => {
  if (!scene.map) {
    return;
  }

  // import other static layer ground layer to Phaser
  scene.map.addTilesetImage("FloorAndGround", "tiles_wall")!;

  const groundLayer = scene.map.createLayer("Ground", "FloorAndGround");
  // groundLayer?.setCollisionByProperty({ ge_collide: false });

  // import other objects from Tiled map to Phaser
  scene.addGroupFromTiled("Wall", "tiles_wall", "FloorAndGround", false);
  scene.addGroupFromTiled(
    "Objects",
    "office",
    "Modern_Office_Black_Shadow",
    false
  );
  scene.addGroupFromTiled(
    "ObjectsOnCollide",
    "office",
    "Modern_Office_Black_Shadow",
    true
  );
  scene.addGroupFromTiled("GenericObjects", "generic", "Generic", false);
  scene.addGroupFromTiled(
    "GenericObjectsOnCollide",
    "generic",
    "Generic",
    true
  );
  scene.addGroupFromTiled("Basement", "basement", "Basement", true);
};

export const updatePlayerContainer = (scene: RoomScene) => {
  if (!scene.cursors) {
    return;
  }

  const selectedItem = scene.userActionCollider?.data.get(
    "selectedItem"
  ) as Item;

  if (!selectedItem) {
    return;
  }

  const { roomIframeOpen, set } = useRoomStore.getState();

  if (Phaser.Input.Keyboard.JustDown(scene.keyR!)) {
    switch (selectedItem.itemType) {
      case ItemType.COMPUTER:
        const computer = selectedItem as Computer;
        // computer.openDialog(this.playerId, network);
        break;
      case ItemType.WHITEBOARD:
        const whiteboard = selectedItem as Whiteboard;
        console.log("whiteboard clicked");
        set((state) => ({ roomIframeOpen: !state.roomIframeOpen }));
        // whiteboard.openDialog(network);
        break;
      case ItemType.VENDINGMACHINE:
        // hacky and hard-coded, but leaving it as is for now
        // const url = "https://www.buymeacoffee.com/skyoffice";
        // openURL(url);
        break;
    }
  }

  const myContainer = scene.gridEngine?.getContainer(
    scene.user.userId as string
  );

  const mySprite = scene.gridEngine?.getSprite(scene.user.userId as string);

  const currentBehaviour = myContainer?.getData(
    "currentBehavior"
  ) as PlayerBehaviour;

  switch (currentBehaviour) {
    case PlayerBehaviour.IDLE:
      // if press E in front of selected chair
      if (
        Phaser.Input.Keyboard.JustDown(scene.keyE!) &&
        selectedItem?.itemType === ItemType.CHAIR
      ) {
        const chairItem = selectedItem as Chair;
        /**
         * move player to the chair and play sit animation
         * a delay is called to wait for player movement (from previous velocity) to end
         * as the player tends to move one more frame before sitting down causing player
         * not sitting at the center of the chair
         */
        scene.time.addEvent({
          delay: 10,
          callback: () => {
            // update character velocity and position
            if (chairItem.itemDirection) {
              mySprite!
                .setPosition(
                  chairItem.x +
                    sittingShiftData[
                      chairItem.itemDirection as keyof typeof sittingShiftData
                    ][0],
                  chairItem.y +
                    sittingShiftData[
                      chairItem.itemDirection as keyof typeof sittingShiftData
                    ][1]
                )
                .setDepth(
                  chairItem.depth +
                    sittingShiftData[
                      chairItem.itemDirection as keyof typeof sittingShiftData
                    ][2]
                );
              myContainer!.setPosition(
                chairItem.x +
                  sittingShiftData[
                    chairItem.itemDirection as keyof typeof sittingShiftData
                  ][0],
                chairItem.y +
                  sittingShiftData[
                    chairItem.itemDirection as keyof typeof sittingShiftData
                  ][1] -
                  30
              );
            }

            mySprite?.anims.play(
              `${mySprite.texture.key.split("_")[0].toLowerCase()}_sit_${
                chairItem.itemDirection
              }`
            );

            scene.userActionCollider.setData("selectedItem", undefined);

            if (chairItem.itemDirection === "up") {
              scene.userActionCollider.setPosition(
                myContainer!.x,
                myContainer!.y - myContainer!.height
              );
            } else {
              scene.userActionCollider.setPosition(0, 0);
            }
            // send new location and anim to server (Here)
          },
          loop: false,
        });
        // set up new dialog as player sits down
        chairItem.clearDialogBox();
        chairItem.setDialogBox(
          "<span>Press <kbd class='key'>E</kbd> to Leave</span>"
        );
        myContainer?.setData("currentBehavior", PlayerBehaviour.SITTING);
        myContainer?.setData("chairOnSit", chairItem);
        return;
      }

      break;

    case PlayerBehaviour.SITTING:
      // back to idle if player press E while sitting
      if (Phaser.Input.Keyboard.JustDown(scene.keyE!)) {
        mySprite?.anims.play(
          `${mySprite.texture.key.split("_")[0].toLowerCase()}_idle_${
            Direction.UP
          }`
        );

        myContainer?.setData("currentBehavior", PlayerBehaviour.IDLE);
        const chairOnSit = myContainer?.getData("chairOnSit") as Chair;

        chairOnSit?.clearDialogBox();
        scene.userActionCollider.setPosition(myContainer!.x, myContainer!.y);
        // network.updatePlayer(this.x, this.y, this.anims.currentAnim.key);
      }
      break;
  }
};

export const updateActionCollider = (scene: RoomScene) => {
  if (!scene.gridEngine || !scene.userActionCollider) {
    return;
  }

  const userId = useRendererStore.getState().user.userId as string;
  const facingDirection = scene.gridEngine.getFacingDirection(userId!!);
  const me = scene.gridEngine.getContainer(
    userId as string
  ) as GameObjects.Container;

  switch (facingDirection) {
    case Direction.DOWN: {
      scene.userActionCollider.setX(me.x);
      scene.userActionCollider.setY(me.y + 48);
      break;
    }

    case Direction.UP: {
      scene.userActionCollider.setX(me.x);
      scene.userActionCollider.setY(me.y - 32);
      break;
    }

    case Direction.LEFT: {
      scene.userActionCollider.setX(me.x - 32);
      scene.userActionCollider.setY(me.y + 10);
      break;
    }

    case Direction.RIGHT: {
      scene.userActionCollider.setX(me.x + 32);
      scene.userActionCollider.setY(me.y + 10);
      break;
    }

    default: {
      // will never happen
      break;
    }
  }

  const currentItem = scene.userActionCollider.data.get("selectedItem") as Item;
  if (currentItem) {
    if (!scene.physics.overlap(scene.userActionCollider, currentItem)) {
      currentItem.removeHiglight(scene.postFxPlugin);
      currentItem.clearDialogBox();
      scene.userActionCollider.data.remove("selectedItem");
    }
  }
};

export const createInteractiveGameObject = (
  scene: RoomScene,
  x: number,
  y: number,
  width: number,
  height: number,
  isDebug: boolean = true,
  name: string,
  origin: { x: number; y: number } = { x: 0, y: 0 }
) => {
  if (!scene) {
    return;
  }

  const customCollider = new GameObjects.Rectangle(
    scene,
    x,
    y,
    width,
    height
  ).setOrigin(origin.x, origin.y);

  customCollider.name = name;

  if (isDebug) {
    customCollider.setFillStyle(0x741b47);
  }

  scene.physics.add.existing(customCollider);

  //@ts-ignore
  customCollider.body.setAllowGravity(false);
  //@ts-ignore
  customCollider.body.setImmovable(true);

  return customCollider;
};

export const setUserReaction = (scene: RoomScene) => {
  const myContainer = scene.gridEngine?.getContainer(
    scene.user.userId as string
  );

  if (!myContainer) {
    return;
  }

  const currentReaction = useRoomStore.getState().currentReaction;
  const playerName = myContainer.list[1] as GameObjects.DOMElement;
  const playerIcon = myContainer.list[2] as GameObjects.DOMElement;

  // if (!currentReaction) {
  //   playerName.setVisible(true);
  //   playerIcon.setVisible(false);
  //   return;
  // }

  // playerName.setVisible(false);
  // playerIcon.setVisible(true);
};

export type Keyboard = {
  W: Phaser.Input.Keyboard.Key;
  S: Phaser.Input.Keyboard.Key;
  A: Phaser.Input.Keyboard.Key;
  D: Phaser.Input.Keyboard.Key;
};

export enum ItemType {
  CHAIR,
  COMPUTER,
  WHITEBOARD,
  VENDINGMACHINE,
}

export enum PlayerBehaviour {
  IDLE,
  RUNNING,
  SITTING,
}

export type NavKeys = Keyboard & Phaser.Types.Input.Keyboard.CursorKeys;

// format: direction: [xShift, yShift, depthShift]
export const sittingShiftData = {
  up: [0, 3, -10],
  down: [0, 3, 1],
  left: [0, -8, 10],
  right: [0, -8, 10],
};
