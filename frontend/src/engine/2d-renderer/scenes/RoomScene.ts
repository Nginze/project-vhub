import { useRendererStore } from "@/engine/2d-renderer/store/RendererStore";
import GridEngine, { Direction, Position } from "grid-engine";
import { Room, UserData } from "../../../../../shared/types";
import { Socket } from "socket.io-client";
import {
  NavKeys,
  registerGridEngineEvents,
  registerItems,
  registerKeys,
  registerMapObjects,
  registerRendererEvents,
  registerSpriteAnimations32,
  registerSprites,
  registerUserActionCollider,
  registerUserProximityCollider,
} from "../utils";
import { GameObjects } from "phaser";
import { useConsumerStore } from "@/engine/rtc/store/ConsumerStore";
import { clamp } from "framer-motion";

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

  // Other constants
  public earshotDistance = 8;

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

    registerKeys(this);
    registerMapObjects(this);
    registerSpriteAnimations32(this);
    registerSprites(this.conn, this, this.map);
    registerGridEngineEvents(this.conn, this);
    registerRendererEvents(this.conn, this, this.map);
    registerUserActionCollider(this);
    registerUserProximityCollider(this);
    registerItems(this);
  }

  update() {
    if (!this.gridEngine || !this.cursors || !this.user) {
      console.log("[LOGGING]: Scene not ready yet.");
      return;
    }

    const myUserId = this.user.userId as string;

    this.userProximityCollider.update();
    this.userActionCollider.update();

    this.proximityUpdateForMedia();

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

  addGroupFromTiled(
    objectLayerName: string,
    key: string,
    tilesetName: string,
    collidable: boolean
  ) {
    if (!this.map) {
      return;
    }

    const group = this.physics.add.staticGroup();
    const objectLayer = this.map.getObjectLayer(objectLayerName);

    objectLayer?.objects.forEach((object) => {
      const actualX = object.x! + object.width! * 0.5;
      const actualY = object.y! - object.height! * 0.5;

      if (!this.map) {
        console.log("[LOGGING]: Couldn't load object layer, tileset not found");
        return;
      }

      group
        .get(
          actualX,
          actualY,
          key,
          object.gid! - this.map.getTileset(tilesetName)!.firstgid
        )
        .setDepth(actualY);
    });
  }
  proximityUpdateForMedia() {
    if (!this.gridEngine || !this.userActionCollider) {
      return;
    }

    this.gridEngine.getAllCharacters().forEach((charId: string) => {
      if (!this.gridEngine || charId == this.user.userId) {
        return;
      }

      const myPosition = this.gridEngine.getPosition(
        this.user.userId as string
      );
      const charPosition = this.gridEngine.getPosition(charId);

      if (!charPosition || !myPosition) {
        return;
      }

      const distance = Math.round(
        Math.hypot(charPosition.x - myPosition.x, charPosition.y - myPosition.y)
      );

      if (distance <= this.earshotDistance) {
        const pm = this.getAudioMod(distance, myPosition, charPosition);
        this.updateAudio(pm.gain, pm.pan, charId);
        //go into the consumer map and update gain and pan of audio ref and play the audio

        return;
      }

      // mute stream or pause consumer or something
      useConsumerStore.getState().setMute(charId, true);
    });
  }

  proximityUpdateForWorld() {}

  getAudioMod(
    distance: number,
    myPos: Position,
    otherPos: Position
  ): { gain: number; pan: number } {
    let gainValue = clamp(
      0,
      0.5,
      ((this.earshotDistance - distance) * 0.5) / this.earshotDistance
    );

    const dx = otherPos.x - myPos.x;
    const panValue = (1 * dx) / this.earshotDistance;

    return {
      gain: gainValue,
      pan: panValue,
    };
  }

  createAudioNodes(gainValue: number, panValue: number, userId: string) {
    const stream = useConsumerStore.getState().initAudioGraph(userId);
    const { setGain, setPan, setMute, setStream, playAudio } =
      useConsumerStore.getState();

    setGain(userId, gainValue);
    setPan(userId, panValue);

    setMute(userId, false);
    setStream(userId, stream!);
    playAudio(userId);
  }

  updateAudio(gainValue: number, panValue: number, userId: string) {
    const { consumerMap, setGain, setPan, setMute } =
      useConsumerStore.getState();

    if (!(userId in consumerMap)) {
      return;
    }

    const { audioGraph, audioRef } = consumerMap[userId];

    if (!audioGraph) {
      this.createAudioNodes(gainValue, panValue, userId);
    }

    if (audioRef?.muted) {
      setMute(userId, false);
    }

    setGain(userId, gainValue);
    setPan(userId, panValue);
  }
}
