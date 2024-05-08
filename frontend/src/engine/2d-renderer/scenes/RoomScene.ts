import { useRendererStore } from "@/store/RendererStore";
import GridEngine from "grid-engine";
import { Room, UserData } from "../../../../../shared/types";
import { Socket } from "socket.io-client";
import {
  Keyboard,
  createInteractiveGameObject,
  registerSpriteAnimations,
  registerSprites,
  subscribeToRendererEvents,
  updateActionCollider,
} from "../utils";
import { GameObjects } from "phaser";

export class RoomScene extends Phaser.Scene {
  constructor() {
    super("room-scene");
  }

  public gridEngine: GridEngine | null = null;
  private conn: Socket = useRendererStore.getState().conn as Socket;
  private room: Room = useRendererStore.getState().room as Room;
  private roomStatus: any = useRendererStore.getState().roomStatus;
  private user: UserData = useRendererStore.getState().user;
  public userActionCollider: GameObjects.Rectangle = null as any;
  public interactiveLayers: GameObjects.Group = null as any;

  create() {
    this.conn.emit("room:join", {
      roomId: this.room.roomId,
      roomMeta: {
        isAutospeaker: this.room.autoSpeaker,
        isCreator: this.room.creatorId === this.user.userId,
        posX: this.roomStatus.posX,
        posY: this.roomStatus.posY,
        dir: this.roomStatus.dir,
        skin: this.roomStatus.skin,
      },
    });

    const map = this.make.tilemap({ key: "map" });
    this.interactiveLayers = this.add.group();

    map.addTilesetImage("modern-tileset-16");
    map.addTilesetImage("modern-extra-tileset-16");

    registerSpriteAnimations(this);
    registerSprites(this.conn, this, map);
    subscribeToRendererEvents(this.conn, this, map);

    const me = this.gridEngine?.getSprite(this.user.userId as string);

    if (!me) {
      return;
    }

    this.userActionCollider = createInteractiveGameObject(
      this,
      me?.x,
      me?.y,
      16,
      16,
      true,
      "user-action-collider"
    );

    this.userActionCollider.update = () => {
      updateActionCollider(this);
    };

    this.physics.add.overlap(
      this.userActionCollider,
      this.interactiveLayers,
      (a, b) => {
        const tile = [a, b].find((obj) => obj !== this.userActionCollider);
        // console.log(tile);
        if (tile?.index > 0 && !tile?.wasHandled) {
          switch (tile?.layer.name) {
            case "Interactive":
              //outline the tile to make it clear that it's interactive
              //show prompt tooltip to interact with the tile
              console.log("Interactive tile", tile);

              break;

            default:
              break;
          }
        }
      }
    );
  }

  update() {
    const cursors = {
      ...this.input!.keyboard!.createCursorKeys(),
      ...(this.input!.keyboard!.addKeys("W,S,A,D") as Keyboard),
    };

    const userId = this.user.userId as string;

    this.userActionCollider.update();

    if (cursors.left.isDown || cursors.A.isDown) {
      //@ts-ignore
      this.gridEngine?.move(userId, "left");
    } else if (cursors.right.isDown || cursors.D.isDown) {
      //@ts-ignore
      this.gridEngine?.move(userId, "right");
    } else if (cursors.up.isDown || cursors.W.isDown) {
      //@ts-ignore
      this.gridEngine?.move(userId, "up");
    } else if (cursors.down.isDown || cursors.S.isDown) {
      //@ts-ignore
      this.gridEngine?.move(userId, "down");
    }
  }
}
