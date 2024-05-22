import { Socket } from "socket.io-client";
import { RoomScene } from "../scenes/RoomScene";
import { useRendererStore } from "@/engine/2d-renderer/store/RendererStore";
import { Room } from "../../../../../shared/types";
import { api } from "@/api";
import { GameObjects } from "phaser";
import { Direction } from "grid-engine";
import Chair from "../items/Chair";
import Computer from "../items/Computer";
import Whiteboard from "../items/WhiteBoard";
import VendingMachine from "../items/VendingMachine";
import Item from "../items/Item";

export const registerRendererEvents = (
  conn: Socket,
  scene: RoomScene,
  map: any
) => {
  conn.on("new-user-joined-room", (d: any) => {
    console.log("event: new-user-joined-room", "data: ", d);
    if (!scene.gridEngine) {
      return;
    }

    if (scene.gridEngine.hasCharacter(d.user.userId)) {
      return;
    }

    const sprite = scene.physics.add.sprite(
      d.user.posX,
      d.user.posY,
      d.user.skin.toLowerCase()
    );

    sprite?.anims.play(
      `${sprite.texture.key.split("_")[0].toLowerCase()}_idle_${d.user.dir}`
    );

    scene.gridEngine.addCharacter({
      id: d.user.userId,
      sprite,
      startPosition: { x: d.user.posX, y: d.user.posY },
    });
  });

  conn.on("participant-left", (d: any) => {
    console.log("event: participant-left", "data: ", d);
    if (!scene.gridEngine) {
      return;
    }

    const sprite = scene.gridEngine.getSprite(d.participantId);
    scene.gridEngine.removeCharacter(d.participantId);
    sprite?.destroy();
  });

  conn.on("participant-moved", (d: any) => {
    console.log("event: participant-moved", "data: ", d);

    if (!scene.gridEngine) {
      return;
    }

    const sprite = scene.gridEngine.getSprite(d.participantId);
    const user = useRendererStore.getState().user;

    if (d.participantId !== user.userId) {
      scene.gridEngine.moveTo(d.participantId, { x: d.posX, y: d.posY });
    }
  });
};

export const registerSpriteAnimations = (scene: RoomScene) => {
  const characters = ["Adam", "Alex", "Amelia", "Bob"];
  const spriteTypes = ["idle", "phone", "run", "sit"];
  const directions = ["up", "down", "left", "right"];

  const anims = {
    idle: {
      right: { start: 0, end: 5 },
      up: { start: 6, end: 11 },
      left: { start: 12, end: 17 },
      down: { start: 18, end: 23 },
    },
    run: {
      right: { start: 0, end: 5 },
      up: { start: 6, end: 11 },
      left: { start: 12, end: 17 },
      down: { start: 18, end: 23 },
    },
    sit: {
      left_1: { start: 0, end: 5 },
      left_2: { start: 0, end: 5 },
      left_3: { start: 0, end: 5 },
      right_1: { start: 6, end: 11 },
      right_2: { start: 6, end: 11 },
      right_3: { start: 6, end: 11 },
    },
  };

  characters.forEach((character) => {
    spriteTypes.forEach((type) => {
      directions.forEach((direction) => {
        if (type === "sit") {
          for (let i = 0; i <= 2; i++) {
            const animationKey = `${character}_${type}${
              i > 0 ? i : ""
            }_${direction}`;
            const textureKey = `${character}_${type}${i > 1 ? i : ""}`;
            const frames =
              anims[type][`${direction}_${i}` as keyof typeof anims.sit];

            scene.anims.create({
              key: animationKey,
              frames: scene.anims.generateFrameNumbers(textureKey, frames),
              frameRate: 15 * 0.6,
              repeat: -1,

              yoyo: true,
            });
          }
        } else if (type === "idle") {
          const animationKey = `${character}_${type}_anim_${direction}`;
          const textureKey = `${character}_${type}_anim`;
          //@ts-ignore
          const frames = anims[type][direction];

          scene.anims.create({
            key: animationKey,
            frames: scene.anims.generateFrameNumbers(textureKey, frames),
            frameRate: 15 * 0.6,
            repeat: -1,
            yoyo: true,
          });
        } else if (type == "run") {
          const animationKey = `${character}_${type}_${direction}`;
          const textureKey = `${character}_${type}`;
          //@ts-ignore
          const frames = anims[type][direction];

          scene.anims.create({
            key: animationKey,
            frames: scene.anims.generateFrameNumbers(textureKey, frames),
            frameRate: 25 * 0.6,
            repeat: -1,
          });
        } else if (type == "phone") {
          const animationKey = `${character}_${type}_${direction}`;
          const textureKey = `${character}_${type}`;

          scene.anims.create({
            key: animationKey,
            frames: scene.anims.generateFrameNumbers(textureKey),
            frameRate: 15 * 0.6,
            repeat: -1,
            yoyo: true,
          });
        }
      });
    });
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
          <div style="display: flex; align-items: center; color: white; font-size: 10px; font-family: Arial; font-weight: bold; background: rgba(0, 0, 0, 0.4); padding: 2.5px 4px; border-radius: 8px">
            <span style="display: inline-block; width: 8px; height: 8px; background: lightgreen; border-radius: 50%; margin-right: 3.2px;"></span>
            ${participant.userName}
          </div>
          `
        )
        .setOrigin(0.225);

      // const playerIcon = scene.add
      //   .dom(8, -20)
      //   .createFromHTML(
      //     `<div style="position: relative; background: white; padding: 2px 4px; border-radius: 3px; text-align: center; font-size: 10px;">
      //       <span role="img" aria-label="emoji">👋</span>
      //       <div style="position: absolute; bottom: -3px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 5px solid white;"></div>
      //     </div>`
      //   )
      //   .setOrigin(0.5, 0.5);

      const playerContainer = scene.add.container(
        participant.posX,
        participant.posY,
        [sprite, playerName]
      );

      sprite?.anims.play(
        `${sprite.texture.key.split("_")[0].toLowerCase()}_idle_${
          participant.dir
        }`
      );

      if (user.userId === participant.userId) {
        me = sprite;
        me.setInteractive();

        // scene.cameras.main.zoom = 1.5;
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

  map.layers.forEach((layer, index) => {
    map.createLayer(index, ["FloorAndGround"], 0, 0);
    // if (layer.name === "Interactive") {
    //   console.log("Interactive layer found");
    //   scene.interactiveLayers.add(mapLayer);
    // }
  });

  // scene.physics.add.collider(me, scene.interactiveLayers);

  // initialize grid engine
  scene.gridEngine.create(map, gridEngineConfig);

  // subscribe to movement events
  scene.gridEngine.movementStarted().subscribe(({ charId, direction }: any) => {
    if (!scene.gridEngine) {
      return;
    }

    const sprite = scene.gridEngine.getSprite(charId);
    const roomId = useRendererStore.getState().currentRoomId as string;
    const user = useRendererStore.getState().user;
    sprite?.anims.play(
      `${sprite.texture.key.split("_")[0].toLowerCase()}_run_${direction}`
    );

    const dir = scene.gridEngine?.getFacingDirection(user.userId!!);
    const posX = scene.gridEngine?.getPosition(user.userId!!).x;
    const posY = scene.gridEngine?.getPosition(user.userId!!).y;

    if (charId === user.userId) {
      conn.emit("room:move", {
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

  scene.gridEngine.movementStopped().subscribe(({ charId, direction }: any) => {
    if (!scene.gridEngine) {
      return;
    }

    const sprite = scene.gridEngine.getSprite(charId);
    const roomId = useRendererStore.getState().currentRoomId as string;
    const user = useRendererStore.getState().user;

    const dir = scene.gridEngine?.getFacingDirection(user.userId!!);
    const posX = scene.gridEngine?.getPosition(user.userId!!).x;
    const posY = scene.gridEngine?.getPosition(user.userId!!).y;

    sprite?.anims.stop();
    sprite?.anims.play(
      `${sprite.texture.key.split("_")[0].toLowerCase()}_idle_${direction}`
    );

    if (charId === user.userId) {
      conn.emit("room:move", {
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
      const roomId = useRendererStore.getState().currentRoomId as string;
      const user = useRendererStore.getState().user;

      const dir = scene.gridEngine?.getFacingDirection(user.userId!!);
      const posX = scene.gridEngine?.getPosition(user.userId!!).x;
      const posY = scene.gridEngine?.getPosition(user.userId!!).y;

      sprite?.setFrame(`${sprite.texture.key}`);
      sprite?.anims.play(
        `${sprite.texture.key.split("_")[0]}_idle_${direction}`
      );

      if (charId === user.userId) {
        conn.emit("room:move", {
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
  scene.userProximityCollider.fillColor = 0x00ff00;

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
    console.log(item);
    // item.itemDirection = chairObj.properties[0].value;
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
      if (selectedItem === scene.userActionCollider.data.get("selectedItem")) {
        return;
      }

      scene.userActionCollider.data.set("selectedItem", selectedItem);
      selectedItem.setHighlight(scene.postFxPlugin);
      selectedItem.setDialogBox("Press [X] to interact");
      // switch (selectedItem.itemType) {
      //   case ItemType.CHAIR:
      //     selectedItem.setHighlight(scene.postFxPlugin);
      //     selectedItem.setDialogBox("Press X to interact");
      //     break;
      //   case ItemType.COMPUTER:
      //     selectedItem.setHighlight(scene.postFxPlugin);
      //     selectedItem.setDialogBox("Press X to interact");
      //     break;
      //   case ItemType.WHITEBOARD:
      //     selectedItem.setHighlight(scene.postFxPlugin);
      //     selectedItem.setDialogBox("Press X to interact");
      //     break;
      //   default:
      //     break;
      // }
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

  // scene.input.keyboard.disableGlobalCapture();
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

  const selectedItem = scene.userActionCollider.data.get(
    "selectedItem"
  ) as Item;
  if (selectedItem) {
    if (!scene.physics.overlap(scene.userActionCollider, selectedItem)) {
      selectedItem.removeHiglight(scene.postFxPlugin);
      selectedItem.clearDialogBox();
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

export type NavKeys = Keyboard & Phaser.Types.Input.Keyboard.CursorKeys;
