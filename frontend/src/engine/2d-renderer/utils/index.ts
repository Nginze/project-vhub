import { api } from "@/api";
import { useRendererStore } from "@/engine/2d-renderer/store/RendererStore";
import { useRoomStore } from "@/global-store/RoomStore";
import { CollisionStrategy, Direction } from "grid-engine";
import { GameObjects } from "phaser";
import { Socket } from "socket.io-client";
import { Room, RoomStatus, UserData } from "../../../../../shared/types";
import { WS_MESSAGE } from "../events";
import Chair from "../items/Chair";
import Computer from "../items/Computer";
import Item from "../items/Item";
import VendingMachine from "../items/VendingMachine";
import Whiteboard from "../items/WhiteBoard";
import { RoomScene } from "../scenes/RoomScene";
import { AnimationType, ItemType, Keyboard, PlayerBehaviour } from "../types";
import { SITTING_OFFSET } from "./constants";
import Player from "../entities/Player";
import { registerCustomSpriteAnimations } from "../anims";

export const registerRendererEvents = (scene: RoomScene) => {
  const { conn } = scene;

  conn.on(WS_MESSAGE.WS_NEW_USER_JOINED_ROOM, (d: any) => {
    console.log("[LOGGING]: new-user-joined-room", "data: ", d);

    const { posX, posY, userId, skin } = d.user;

    if (!scene.gridEngine || scene.gridEngine.hasCharacter(userId)) {
      return;
    }

    const player = new Player(scene, d.user);
    scene.players.set(userId, player);

    scene.gridEngine.addCharacter({
      id: userId,
      sprite: player.playerSprite,
      container: player.playerContainer,
      startPosition: { x: posX, y: posY },
    });

    registerCustomSpriteAnimations(scene);
  });

  conn.on(WS_MESSAGE.WS_PARTICIPANT_LEFT, (d: any) => {
    console.log("[LOGGING]: participant-left", "data: ", d);

    if (!scene.gridEngine) {
      return;
    }

    const { participantId } = d;

    const playerContainer = scene.gridEngine.getContainer(participantId);
    scene.gridEngine.removeCharacter(participantId);
    scene.players.delete(participantId);

    playerContainer?.destroy();
  });

  conn.on(WS_MESSAGE.WS_PARTICIPANT_MOVED, (d: any) => {
    console.log("[LOGGING]: Participant-moved", "data: ", d);

    if (!scene.gridEngine) {
      return;
    }

    const {
      user: { userId },
    } = useRendererStore.getState();
    const { participantId, posX, posY, dir } = d;

    if (participantId !== userId) {
      scene.gridEngine.moveTo(participantId, { x: posX, y: posY });
      scene.gridEngine.turnTowards(participantId, dir);
    }
  });

  conn.on(WS_MESSAGE.WS_USER_SPEAKING, (d: any) => {
    console.log("[LOGGING]: User speaking", d.participantId);

    const { participantId } = d;

    const element = document.getElementById(`${participantId}_indicator`);
    const speakerIcon = document.getElementById(`${participantId}_speaker`);
    const statusIndicator = document.getElementById(
      `${participantId}_status_indicator`
    );

    if (element && speakerIcon && statusIndicator) {
      element.style.border = "1.3px solid #43b581";
      speakerIcon.style.display = "inline";
      statusIndicator.style.display = "none";
    }
  });

  conn.on(WS_MESSAGE.WS_USER_STOPPED_SPEAKING, (d: any) => {
    console.log("[LOGGING]: User stopped speaking", d.participantId);

    const { participantId } = d;

    const element = document.getElementById(`${participantId}_indicator`);
    const speakerIcon = document.getElementById(`${participantId}_speaker`);
    const statusIndicator = document.getElementById(
      `${participantId}_status_indicator`
    );

    if (element && speakerIcon && statusIndicator) {
      element.style.border = "";
      speakerIcon.style.display = "none";
      statusIndicator.style.display = "inline";
    }
  });

  conn.on(WS_MESSAGE.WS_ROOM_REACTION, (d: any) => {
    console.log("[LOGGING]: Room reaction", d);

    const { participantId, reaction } = d;

    const player = scene.players.get(participantId);
    player?.playReaction(reaction);
  });

  conn.on("item-update", (d: any) => {
    const {
      computerStore,
      whiteboardStore,
      user: { userId },
    } = useRendererStore.getState();

    console.log("[LOGGING]: item-update", d);

    if (d.userId == userId) {
      return;
    }

    switch (d.itemType) {
      case ItemType.COMPUTER:
        const computer = computerStore[d.itemId];
        if (d.action == "join") {
          computer.addCurrentUser(d.userId);
        } else {
          computer.removeCurrentUser(d.userId);
        }
        break;
      case ItemType.WHITEBOARD:
        const whiteboard = whiteboardStore[d.itemId];
        console.log("whiteboard", whiteboard);
        if (d.action == "join") {
          whiteboard.addCurrentUser(d.userId);
        } else {
          whiteboard.removeCurrentUser(d.userId);
        }
        break;
    }
    //handle the item update here
  });
};

export const registerSprites = (scene: RoomScene) => {
  const {
    room,
    user: { userId },
  } = useRendererStore.getState();

  if (!scene.gridEngine) {
    return;
  }

  const characters = room.participants.map(
    (participant: UserData & RoomStatus, index: number) => {
      const player = new Player(scene, participant);
      scene.players.set(participant.userId, player);

      if (userId === participant.userId) {
        scene.cameras.main.startFollow(player.playerContainer, true);
        scene.cameras.main.setFollowOffset(
          -player.playerSprite.width,
          -player.playerSprite.height
        );
      }


      return {
        id: participant.userId,
        sprite: player.playerSprite,
        container: player.playerContainer,
        startPosition: {
          x: participant.posX,
          y: participant.posY,
        },
      };
    }
  );

  // initialize grid engine
  scene.gridEngine.create(scene.map!, {
    characters,
    characterCollisionStrategy: CollisionStrategy.BLOCK_ONE_TILE_AHEAD,
  });
};

export const registerGridEngineEvents = (scene: RoomScene) => {
  if (!scene.gridEngine || !scene.conn) {
    return;
  }

  const { conn } = scene;
  const {
    room: { roomId },
    user: { userId },
  } = useRendererStore.getState();

  scene.gridEngine
    .movementStarted()
    .subscribe(async ({ charId, direction }) => {
      if (!scene.gridEngine) {
        return;
      }

      const player = scene.players.get(charId) as Player;
      player.playAnimation(AnimationType.RUN, direction);

      const dir = scene.gridEngine.getFacingDirection(userId!);
      const posX = scene.gridEngine.getPosition(userId!).x;
      const posY = scene.gridEngine.getPosition(userId!).y;

      player.broadcastMovement(charId, roomId!, conn, { posX, posY, dir });
    });

  scene.gridEngine
    .movementStopped()
    .subscribe(async ({ charId, direction }: any) => {
      if (!scene.gridEngine) {
        return;
      }

      const player = scene.players.get(charId) as Player;

      player.stopAnimation();
      player.playAnimation(AnimationType.IDLE, direction);

      const dir = scene.gridEngine.getFacingDirection(userId!);
      const posX = scene.gridEngine.getPosition(userId!).x;
      const posY = scene.gridEngine.getPosition(userId!).y;

      player.broadcastMovement(charId, roomId!, conn, { posX, posY, dir });
    });

  scene.gridEngine
    .directionChanged()
    .subscribe(({ charId, direction }: any) => {
      if (!scene.gridEngine) {
        return;
      }

      const player = scene.players.get(charId) as Player;

      const dir = scene.gridEngine.getFacingDirection(userId!);
      const posX = scene.gridEngine.getPosition(userId!).x;
      const posY = scene.gridEngine.getPosition(userId!).y;

      player.playAnimation(AnimationType.IDLE, direction);
      player.broadcastMovement(charId, roomId!, conn, { posX, posY, dir });
    });
};

// export const registerUserActionCollider = (scene: RoomScene) => {
//   if (!scene.gridEngine || !scene.user) {
//     console.log("user Action Collider not ready");
//     return;
//   }

//   const myContainer = scene.gridEngine.getContainer(
//     scene.user.userId as string
//   );

//   if (!myContainer) {
//     console.log(
//       "myContainer not found: Registering user action collider failed"
//     );
//     return;
//   }

//   scene.userActionCollider = createInteractiveGameObject(
//     scene,
//     myContainer.x,
//     myContainer.y,
//     32,
//     32,
//     true,
//     "user-action-collider"
//   ) as GameObjects.Rectangle;

//   scene.userActionCollider.setDataEnabled();

//   scene.userActionCollider.update = () => {
//     updateActionCollider(scene);
//   };
// };

// export const registerUserProximityCollider = (scene: RoomScene) => {
//   if (!scene.gridEngine || !scene.user) {
//     console.log("user Proximity Collider not ready");
//     return;
//   }

//   const myContainer = scene.gridEngine.getContainer(
//     scene.user.userId as string
//   );

//   if (!myContainer) {
//     console.log(
//       "myContainer not found: Registering user proximity collider failed"
//     );
//     return;
//   }

//   scene.userProximityCollider = createInteractiveGameObject(
//     scene,
//     myContainer.x,
//     myContainer.y,
//     256,
//     256,
//     true,
//     "user-proximity-collider",
//     { x: myContainer.originX - 0.05, y: myContainer.originY - 0.05 }
//   ) as GameObjects.Rectangle;

//   scene.userProximityCollider.setDataEnabled();

//   scene.userProximityCollider.update = () => {
//     updateProximityCollider(scene);
//   };
// };

// export const updateProximityCollider = (scene: RoomScene) => {
//   if (!scene.gridEngine || !scene.userProximityCollider) {
//     return;
//   }

//   const myContainer = scene.gridEngine.getContainer(
//     scene.user.userId as string
//   );
//   const userId = useRendererStore.getState().user.userId as string;
//   const facingDirection = scene.gridEngine.getFacingDirection(userId!!);

//   const me = scene.gridEngine.getContainer(
//     userId as string
//   ) as GameObjects.Container;

//   switch (facingDirection) {
//     case Direction.DOWN: {
//       scene.userProximityCollider.setX(me.x);
//       scene.userProximityCollider.setY(me.y);
//       break;
//     }

//     case Direction.UP: {
//       scene.userProximityCollider.setX(me.x);
//       scene.userProximityCollider.setY(me.y);
//       break;
//     }

//     case Direction.LEFT: {
//       scene.userProximityCollider.setX(me.x);
//       scene.userProximityCollider.setY(me.y);
//       break;
//     }

//     case Direction.RIGHT: {
//       scene.userProximityCollider.setX(me.x);
//       scene.userProximityCollider.setY(me.y);
//       break;
//     }

//     default: {
//       // will never happen
//       break;
//     }
//   }
// };

export const registerItems = (scene: RoomScene) => {
  if (!scene.map) {
    return;
  }

  const { set } = useRendererStore.getState();
  const {
    user: { userId },
  } = useRendererStore.getState();
  const player = scene.players.get(userId as string);

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

  if (!player) {
    console.log("[LOGGING]: player not found");
    return;
  }

  console.log("[LOGGING]: player found", player);

  scene.physics.add.collider(
    [player, player.playerContainer, player.playerSprite],
    vendingMachines,
    () => console.log("collided with vending machine")
  );

  scene.objectGroups.set("chairs", chairs);
  scene.objectGroups.set("computers", computers);
  scene.objectGroups.set("whiteboards", whiteboards);
  scene.objectGroups.set("vendingmachines", vendingMachines);

  player.playerSelector.registerPhysics();
};

export const registerKeys = (scene: RoomScene) => {
  if (!scene || !scene.input || !scene.input.keyboard) {
    console.log("[LOGGING]: scene or scene.input.keyboard is null");
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

// export const handleUserInput = (scene: RoomScene) => {
//   if (!scene.cursors) {
//     return;
//   }

//   const {
//     user: { userId },
//   } = useRendererStore.getState();

//   const { roomIframeOpen, set } = useRoomStore.getState();

//   const selectedItem = scene.players.get(userId as string)?.playerSelector
//     .selectedItem;

//   if (!selectedItem) {
//     return;
//   }

//   if (Phaser.Input.Keyboard.JustDown(scene.keyR!)) {
//     switch (selectedItem.itemType) {
//       case ItemType.COMPUTER:
//         const computer = selectedItem as Computer;
//         // computer.openDialog(this.playerId, network);
//         break;
//       case ItemType.WHITEBOARD:
//         const whiteboard = selectedItem as Whiteboard;
//         console.log("whiteboard clicked");
//         set((state) => ({ roomIframeOpen: !state.roomIframeOpen }));
//         // whiteboard.openDialog(network);
//         break;
//       case ItemType.VENDINGMACHINE:
//         // hacky and hard-coded, but leaving it as is for now
//         // const url = "https://www.buymeacoffee.com/skyoffice";
//         // openURL(url);
//         break;
//     }
//   }

//   const myContainer = scene.gridEngine?.getContainer(
//     scene.user.userId as string
//   );

//   const mySprite = scene.gridEngine?.getSprite(scene.user.userId as string);

//   const currentBehaviour = myContainer?.getData(
//     "currentBehavior"
//   ) as PlayerBehaviour;

//   switch (currentBehaviour) {
//     case PlayerBehaviour.IDLE:
//       // if press E in front of selected chair
//       if (
//         Phaser.Input.Keyboard.JustDown(scene.keyE!) &&
//         selectedItem?.itemType === ItemType.CHAIR
//       ) {
//         const chairItem = selectedItem as Chair;
//         /**
//          * move player to the chair and play sit animation
//          * a delay is called to wait for player movement (from previous velocity) to end
//          * as the player tends to move one more frame before sitting down causing player
//          * not sitting at the center of the chair
//          */
//         scene.time.addEvent({
//           delay: 10,
//           callback: () => {
//             // update character velocity and position
//             if (chairItem.itemDirection) {
//               mySprite!
//                 .setPosition(
//                   chairItem.x +
//                     SITTING_OFFSET[
//                       chairItem.itemDirection as keyof typeof SITTING_OFFSET
//                     ][0],
//                   chairItem.y +
//                     SITTING_OFFSET[
//                       chairItem.itemDirection as keyof typeof SITTING_OFFSET
//                     ][1]
//                 )
//                 .setDepth(
//                   chairItem.depth +
//                     SITTING_OFFSET[
//                       chairItem.itemDirection as keyof typeof SITTING_OFFSET
//                     ][2]
//                 );
//               myContainer!.setPosition(
//                 chairItem.x +
//                   SITTING_OFFSET[
//                     chairItem.itemDirection as keyof typeof SITTING_OFFSET
//                   ][0],
//                 chairItem.y +
//                   SITTING_OFFSET[
//                     chairItem.itemDirection as keyof typeof SITTING_OFFSET
//                   ][1] -
//                   30
//               );
//             }

//             mySprite?.anims.play(
//               `${mySprite.texture.key.split("_")[0].toLowerCase()}_sit_${
//                 chairItem.itemDirection
//               }`
//             );

//             scene.userActionCollider.setData("selectedItem", undefined);

//             if (chairItem.itemDirection === "up") {
//               scene.userActionCollider.setPosition(
//                 myContainer!.x,
//                 myContainer!.y - myContainer!.height
//               );
//             } else {
//               scene.userActionCollider.setPosition(0, 0);
//             }
//             // send new location and anim to server (Here)
//           },
//           loop: false,
//         });
//         // set up new dialog as player sits down
//         chairItem.clearDialogBox();
//         chairItem.setDialogBox(
//           "<span>Press <kbd class='key'>E</kbd> to Leave</span>"
//         );
//         myContainer?.setData("currentBehavior", PlayerBehaviour.SITTING);
//         myContainer?.setData("chairOnSit", chairItem);
//         return;
//       }

//       break;

//     case PlayerBehaviour.SITTING:
//       // back to idle if player press E while sitting
//       if (Phaser.Input.Keyboard.JustDown(scene.keyE!)) {
//         mySprite?.anims.play(
//           `${mySprite.texture.key.split("_")[0].toLowerCase()}_idle_${
//             Direction.UP
//           }`
//         );

//         myContainer?.setData("currentBehavior", PlayerBehaviour.IDLE);
//         const chairOnSit = myContainer?.getData("chairOnSit") as Chair;

//         chairOnSit?.clearDialogBox();
//         scene.userActionCollider.setPosition(myContainer!.x, myContainer!.y);
//         // network.updatePlayer(this.x, this.y, this.anims.currentAnim.key);
//       }
//       break;
//   }
// };

// export const updateActionCollider = (scene: RoomScene) => {
//   if (!scene.gridEngine || !scene.userActionCollider) {
//     return;
//   }

//   const userId = useRendererStore.getState().user.userId as string;
//   const facingDirection = scene.gridEngine.getFacingDirection(userId!!);
//   const me = scene.gridEngine.getContainer(
//     userId as string
//   ) as GameObjects.Container;

//   switch (facingDirection) {
//     case Direction.DOWN: {
//       scene.userActionCollider.setX(me.x);
//       scene.userActionCollider.setY(me.y + 48);
//       break;
//     }

//     case Direction.UP: {
//       scene.userActionCollider.setX(me.x);
//       scene.userActionCollider.setY(me.y - 32);
//       break;
//     }

//     case Direction.LEFT: {
//       scene.userActionCollider.setX(me.x - 32);
//       scene.userActionCollider.setY(me.y + 10);
//       break;
//     }

//     case Direction.RIGHT: {
//       scene.userActionCollider.setX(me.x + 32);
//       scene.userActionCollider.setY(me.y + 10);
//       break;
//     }

//     default: {
//       // will never happen
//       break;
//     }
//   }

//   const currentItem = scene.userActionCollider.data.get("selectedItem") as Item;
//   if (currentItem) {
//     if (!scene.physics.overlap(scene.userActionCollider, currentItem)) {
//       currentItem.removeHiglight(scene.postFxPlugin);
//       currentItem.clearDialogBox();
//       scene.userActionCollider.data.remove("selectedItem");
//     }
//   }
// };

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

  scene.physics.add.existing(customCollider);

  //@ts-ignore
  customCollider.body.setAllowGravity(false);
  //@ts-ignore
  customCollider.body.setImmovable(true);

  return customCollider;
};
