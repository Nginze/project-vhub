import { Socket } from "socket.io-client";
import { RoomScene } from "../scenes/RoomScene";
import { useRendererStore } from "@/store/RendererStore";
import { Room } from "../../../../../shared/types";
import { api } from "@/api";
import { GameObjects } from "phaser";

export const subscribeToRendererEvents = (
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
      d.user.skin,
      1
    );

    sprite?.anims.play(
      `${sprite.texture.key.split("_")[0]}_idle_anim_${d.user.dir}`
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

export const registerSprites = (conn: Socket, scene: RoomScene, map: any) => {
  let me: any;
  const room = useRendererStore.getState().room as Room & {
    participants: any[];
  };
  const user = useRendererStore.getState().user;

  const characters = room.participants.map(
    (participant: any, index: number) => {
      let sprite = scene.physics.add.sprite(
        participant.posX,
        participant.posY,
        participant.skin,
        1
      );

      // // add playerName to playerContainer
      // const playerName = scene.add
      //   .text(0, 0, participant.userName)
      //   // .setAlign("center")
      //   // .setFontFamily("Arial")
      //   // .setFontSize(7)
      //   .setColor("#000000");

      // const container = scene.add.container(0, 0, [sprite, playerName]);

      sprite?.anims.play(
        `${sprite.texture.key.split("_")[0]}_idle_anim_${participant.dir}`
      );

      if (user.userId === participant.userId) {
        console.log("That is me!!");

        me = sprite;
        scene.cameras.main.startFollow(sprite, true);
        scene.cameras.main.setFollowOffset(-me.width, -me.height);
      }

      return {
        id: participant.userId,
        sprite,
        startPosition: { x: participant.posX, y: participant.posY },
      };
    }
  );

  const gridEngineConfig = {
    characters,
  };

  console.log(characters);

  if (!scene.gridEngine) {
    return;
  }

  map.layers.forEach((layer, index) => {
    const mapLayer = map.createLayer(
      index,
      ["modern-tileset-16", "modern-extra-tileset-16"],
      0,
      0
    );

    if (layer.name === "Interactive") {
      console.log("Interactive layer found");
      scene.interactiveLayers.add(mapLayer);
    }
  });

  scene.physics.add.collider(me, scene.interactiveLayers);

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
    sprite?.anims.play(`${sprite.texture.key.split("_")[0]}_run_${direction}`);

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
      `${sprite.texture.key.split("_")[0]}_idle_anim_${direction}`
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
        `${sprite.texture.key.split("_")[0]}_idle_anim_${direction}`
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

export const updateActionCollider = (scene: RoomScene) => {
  if (!scene.gridEngine || !scene.userActionCollider) {
    return;
  }

  const userId = useRendererStore.getState().user.userId as string;
  const facingDirection = scene.gridEngine.getFacingDirection(userId!!);
  const me = scene.gridEngine.getSprite(userId as string) as GameObjects.Sprite;

  switch (facingDirection) {
    case "down": {
      scene.userActionCollider.setX(me.x);
      scene.userActionCollider.setY(me.y + 30);
      break;
    }

    case "up": {
      scene.userActionCollider.setX(me.x);
      scene.userActionCollider.setY(me.y - 13);
      break;
    }

    case "left": {
      scene.userActionCollider.setX(me.x - 16);
      scene.userActionCollider.setY(me.y + 10);
      break;
    }

    case "right": {
      scene.userActionCollider.setX(me.x + 16);
      scene.userActionCollider.setY(me.y + 10);
      break;
    }

    default: {
      // will never happen
      break;
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
  origin: { x: 0; y: 0 } = { x: 0, y: 0 }
) => {
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

export type NavKeys = Keyboard & Phaser.Types.Input.Keyboard.CursorKeys;
