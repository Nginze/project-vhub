import { useRendererStore } from "@/engine/2d-renderer/store/RendererStore";
import GridEngine, { Direction } from "grid-engine";
import { Room, UserData } from "../../../../../shared/types";
import { Socket } from "socket.io-client";
import {
  NavKeys,
  registerItems,
  registerKeys,
  registerRendererEvents,
  registerSpriteAnimations32,
  registerSprites,
  registerUserActionCollider,
  registerUserProximityCollider,
} from "../utils";
import { GameObjects } from "phaser";

export class RoomScene extends Phaser.Scene {
  constructor() {
    super("room-scene");
  }

  // App State
  public conn: Socket = useRendererStore.getState().conn as Socket;
  public room: Room = useRendererStore.getState().room as Room;
  public roomStatus: any = useRendererStore.getState().roomStatus;
  public user: UserData = useRendererStore.getState().user;

  // Colliders and Layers
  public gridEngine: GridEngine | null = null;
  public postFxPlugin: any = null;
  public userActionCollider: GameObjects.Rectangle = null as any;
  public userProximityCollider: GameObjects.Rectangle = null as any;
  public map: Phaser.Tilemaps.Tilemap | undefined;

  // Game Controls & Keys
  public cursors: NavKeys | undefined;
  public keyE: Phaser.Input.Keyboard.Key | undefined;
  public keyR: Phaser.Input.Keyboard.Key | undefined;

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

    this.postFxPlugin = this.plugins.get("rexoutlinepipelineplugin");

    this.map = this.make.tilemap({ key: "map" });

    this.map.addTilesetImage("FloorAndGround", "tiles_wall");
    // this.map.addTilesetImage("office");
    // this.map.addTilesetImage("basement");
    // this.map.addTilesetImage("generic");

    registerKeys(this);
    registerSpriteAnimations32(this);
    registerSprites(this.conn, this, this.map);
    registerRendererEvents(this.conn, this, this.map);
    registerUserActionCollider(this);
    registerUserProximityCollider(this);
    registerItems(this);
  }

  update() {
    if (!this.gridEngine || !this.cursors || !this.user) {
      console.log("Scene: Not ready yet");
      return;
    }

    const myUserId = this.user.userId as string;

    this.userActionCollider.update();
    this.userProximityCollider.update();


    if (this.cursors.left.isDown || this.cursors.A.isDown) {
      this.gridEngine.move(myUserId, Direction.LEFT);
    } else if (this.cursors.right.isDown || this.cursors.D.isDown) {
      this.gridEngine.move(myUserId, Direction.RIGHT);
    } else if (this.cursors.up.isDown || this.cursors.W.isDown) {
      this.gridEngine.move(myUserId, Direction.UP);
    } else if (this.cursors.down.isDown || this.cursors.S.isDown) {
      this.gridEngine.move(myUserId, Direction.DOWN);
    }
  }

  addObjectFromTiled(
    group: Phaser.Physics.Arcade.StaticGroup,
    object: Phaser.Types.Tilemaps.TiledObject,
    key: string,
    tilesetName: string
  ) {
    if (!this.map) {
      return;
    }

    const actualX = object.x! + object.width! * 0.5;
    const actualY = object.y! - object.height! * 0.5;
    const obj = group
      .get(
        actualX,
        actualY,
        key,
        object.gid! - this.map.getTileset(tilesetName)!.firstgid
      )
      .setDepth(actualY);
    return obj;
  }
}
