import { useRendererStore } from "@/store/RendererStore";
import GridEngine from "grid-engine";
import { Room, UserData } from "../../../../../shared/types";
import { Socket } from "socket.io-client";
import {
  registerSpriteAnimations,
  registerSprites,
  subscribeToRendererEvents,
} from "../utils";

export class RoomScene extends Phaser.Scene {
  constructor() {
    super("room-scene");
  }

  public gridEngine: GridEngine | null = null;
  private conn: Socket = useRendererStore.getState().conn as Socket;
  private room: Room = useRendererStore.getState().room as Room;
  private roomStatus: any = useRendererStore.getState().roomStatus;
  private user: UserData = useRendererStore.getState().user;

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
    map.addTilesetImage("modern-tileset");
    map.addTilesetImage("modern-tileset-extra");

    map.layers.forEach((layer, index) => {
      map.createLayer(index, ["modern-tileset", "modern-tileset-extra"], 0, 0);
    });

    registerSprites(this.conn, this, map);
    registerSpriteAnimations(this);
    subscribeToRendererEvents(this.conn, this, map);
  }

  update() {
    const cursors = this.input!.keyboard!.createCursorKeys();
    const userId = this.user.userId as string;

    if (cursors.left.isDown) {
      //@ts-ignore
      this.gridEngine?.move(userId, "left");
    } else if (cursors.right.isDown) {
      //@ts-ignore
      this.gridEngine?.move(userId, "right");
    } else if (cursors.up.isDown) {
      //@ts-ignore
      this.gridEngine?.move(userId, "up");
    } else if (cursors.down.isDown) {
      //@ts-ignore
      this.gridEngine?.move(userId, "down");
    }

    // if (this.gridEngine) {
    // }
  }

  createHeroWalkingAnimation(direction: string, frames: any[]) {
    const frameRate = 15;
    this.anims.create({
      key: direction,
      frames,
      frameRate: 0.6 * frameRate,
      repeat: -1,
      yoyo: true,
    });
  }
}

// this.createHeroWalkingAnimation(
//   "up",
//   this.anims.generateFrameNumbers("adam", { start: 9, end: 11 })
// );
// this.createHeroWalkingAnimation(
//   "down",
//   this.anims.generateFrameNumbers("adam", { start: 0, end: 2 })
// );
// this.createHeroWalkingAnimation(
//   "left",
//   this.anims.generateFrameNumbers("adam", { start: 3, end: 5 })
// );
// this.createHeroWalkingAnimation(
//   "right",
//   this.anims.generateFrameNumbers("adam", { start: 6, end: 8 })
// );
