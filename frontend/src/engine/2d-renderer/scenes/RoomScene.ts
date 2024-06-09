import { useRendererStore } from "@/engine/2d-renderer/store/RendererStore";
import GridEngine, { Direction, Position } from "grid-engine";
import { Socket } from "socket.io-client";
import { Room, RoomStatus, UserData } from "../../../../../shared/types";
import {
  registerGridEngineEvents,
  registerItems,
  registerKeys,
  registerMapObjects,
  registerRendererEvents,
  registerSprites,
} from "../utils";

import { useConsumerStore } from "@/engine/rtc/store/ConsumerStore";
import { clamp } from "framer-motion";
import { registerSpriteAnimations32 } from "../anims";
import Player from "../entities/Player";
import { WS_MESSAGE } from "../events";
import { NavKeys, ProxmityActionType } from "../types";

export class RoomScene extends Phaser.Scene {
  constructor() {
    super("room-scene");
  }

  // App State
  public conn: Socket = useRendererStore.getState().conn;
  public room: Room = useRendererStore.getState().room;
  public roomStatus: RoomStatus = useRendererStore.getState().roomStatus;
  public user: UserData = useRendererStore.getState().user;
  public players: Map<string, Player> = new Map<string, Player>();

  // Colliders and Layers
  public gridEngine: GridEngine | null = null;
  public postFxPlugin: any = null;
  public objectGroups = new Map<string, Phaser.Physics.Arcade.StaticGroup>();
  public map: Phaser.Tilemaps.Tilemap | undefined;

  // Game Controls & Keys
  public cursors: NavKeys | undefined;
  public keyE: Phaser.Input.Keyboard.Key | undefined;
  public keyR: Phaser.Input.Keyboard.Key | undefined;
  public keys = new Map<string, Phaser.Input.Keyboard.Key>();

  // Other constants
  public earshotDistance = 8;

  create() {
    this.conn.emit(WS_MESSAGE.WS_ROOM_JOIN, {
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

    // import other static layer ground layer to Phaser
    this.map.addTilesetImage("FloorAndGround", "tiles_wall")!;
    this.map.createLayer("Ground", "FloorAndGround");

    registerKeys(this);
    registerSprites(this);
    registerMapObjects(this);
    registerSpriteAnimations32(this);
    registerGridEngineEvents(this);
    registerRendererEvents(this);
    registerItems(this);

    const { set } = useRendererStore.getState();
    set({ scene: this });
  }

  update() {
    if (!this.gridEngine || !this.cursors || !this.user) {
      console.log("[LOGGING]: Scene not ready yet.");
      return;
    }

    const myUserId = this.user.userId as string;
    const myPlayer = this.players.get(myUserId) as Player;

    myPlayer.update();
    myPlayer.playerSelector.update();
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

      const sprite = group.get(
        actualX,
        actualY,
        key,
        object.gid! - this.map.getTileset(tilesetName)!.firstgid
      );
      sprite.setDepth(actualY);
    });
  }

  proximityUpdateForMedia() {
    if (!this.gridEngine) {
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
        // this.updateAudio(pm.gain, pm.pan, charId);
        this.updateVideo(charId, ProxmityActionType.ADD);
        return;
      }

      // mute stream or pause consumer or something
      this.updateVideo(charId, ProxmityActionType.REMOVE);
      // useConsumerStore.getState().setMute(charId, true);
    });
  }

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
    const { audioConsumerMap, setGain, setPan, setMute } =
      useConsumerStore.getState();

    if (!(userId in audioConsumerMap)) {
      console.log("[LOGGING]: No audio graph");
      return;
    }

    const { audioGraph, audioRef } = audioConsumerMap[userId];

    if (!audioGraph) {
      console.log(
        "[LOGGIN]: peer doesn't have an audio graph creating one ..."
      );
      this.createAudioNodes(gainValue, panValue, userId);
    }

    if (audioRef?.muted) {
      console.log("[LOGGING]: umuting audio stream");
      setMute(userId, false);
    }

    console.log("[LOGGING]: updating new gain and new pan");
    setGain(userId, gainValue);
    setPan(userId, panValue);
  }

  updateVideo(userId: string, action: ProxmityActionType) {
    const { videoConsumerMap, proximityList, set } =
      useConsumerStore.getState();

    if (!(userId in videoConsumerMap)) {
      return;
    }

    if (action === ProxmityActionType.ADD) {
      set({
        proximityList: proximityList.set(
          userId,
          videoConsumerMap[userId].consumer
        ),
      });
    } else {
      set((state) => {
        const newProximityList = new Map(state.proximityList);
        newProximityList.delete(userId);
        return { proximityList: newProximityList };
      });
    }
  }
}
