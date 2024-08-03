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
import {
  registerCustomSpriteAnimations,
  registerSpriteAnimations32,
} from "../anims";
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
  public gesturesPlugin: any = null;
  public camera = this.cameras;
  public objectGroups = new Map<string, Phaser.Physics.Arcade.StaticGroup>();
  public map: Phaser.Tilemaps.Tilemap | undefined;

  // Game Controls & Keys
  public cursors: NavKeys | undefined;
  public keyE: Phaser.Input.Keyboard.Key | undefined;
  public keyR: Phaser.Input.Keyboard.Key | undefined;
  public keys = new Map<string, Phaser.Input.Keyboard.Key>();

  // Other constants
  public earshotDistance = 8;
  public zoomLevel: number = 1;
  public maxZoomIn: number = 2;
  public minZoomOut: number = 0.5;

  create() {
    this.postFxPlugin = this.plugins.get("rexoutlinepipelineplugin");
    this.map = this.make.tilemap({ key: "map" });

    this.zoomLevel = 1; // Initialize zoom level
    this.maxZoomIn = 2; // Set maximum zoom in level
    this.minZoomOut = 0.5; // Set minimum zoom out level

    // import other static layer ground layer to Phaser
    this.map.addTilesetImage("FloorAndGround", "tiles_wall")!;
    this.map.createLayer("Ground", "FloorAndGround");

    registerKeys(this);
    registerSprites(this);
    registerMapObjects(this);
    registerGridEngineEvents(this);
    registerRendererEvents(this);
    registerItems(this);
    registerSpriteAnimations32(this);

    console.log("[LOGGING]: Loading complete");

    const { set } = useRendererStore.getState();
    set({ scenel: this });
    set({ ready: true });
  }

  update() {
    if (!this.gridEngine || !this.cursors || !this.user) {
      console.log("[LOGGING]: Scene not ready yet.");
      return;
    }

    const myUserId = this.user.userId as string;
    const myPlayer = this.players.get(myUserId) as Player;

    myPlayer?.update();
    myPlayer?.playerSelector.update();
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
        this.updateAudio(pm.gain, pm.pan, charId);
        this.updateVideo(charId, ProxmityActionType.ADD);
        useConsumerStore.getState().setMute(charId, false); // Unmute the audio
        return;
      }

      // mute stream or pause consumer or something
      this.updateVideo(charId, ProxmityActionType.REMOVE);
      useConsumerStore.getState().setMute(charId, true);
    });
  }

  getAudioMod(
    distance: number,
    myPos: Position,
    otherPos: Position
  ): { gain: number; pan: number } {
    let gainValue = clamp(
      0,
      0.7,
      ((this.earshotDistance - distance) * 0.5) / this.earshotDistance
    );

    const dx = otherPos.x - myPos.x;
    const panValue = (1 * dx) / this.earshotDistance;

    return {
      gain: gainValue,
      pan: panValue,
    };
  }

  // createAudioNodes(gainValue: number, panValue: number, userId: string) {
  //   const stream = useConsumerStore.getState().initAudioGraph(userId);
  //   const { setGain, setPan, setMute, setStream, playAudio } =
  //     useConsumerStore.getState();

  //   setGain(userId, gainValue);
  //   setPan(userId, panValue);

  //   setMute(userId, false);
  //   setStream(userId, stream!);
  //   playAudio(userId);
  // }

  createSpatialAudio(
    userId: string,
    stream: MediaStream,
    gainValue: number,
    panValue: number
  ) {
    // Create a new AudioContext
    const audioContext = new AudioContext();

    // Create a new MediaStreamAudioSourceNode
    const source = audioContext.createMediaStreamSource(stream);

    // Create a new GainNode
    const gainNode = audioContext.createGain();
    gainNode.gain.value = gainValue;

    // Create a new StereoPannerNode
    const panNode = audioContext.createStereoPanner();
    panNode.pan.value = panValue;

    const compressorNode = audioContext.createDynamicsCompressor();

    // Connect the nodes
    source
      .connect(gainNode)
      .connect(panNode)
      .connect(compressorNode)
      .connect(audioContext.destination);

    // Store the audio graph in the state
    useConsumerStore.getState().setAudioGraph(userId, {
      source,
      gain: gainNode,
      pan: panNode,
      context: audioContext,
    });
  }

  updateAudio(gainValue: number, panValue: number, userId: string) {
    const { audioConsumerMap, setMute, setPan, setGain, setStream } =
      useConsumerStore.getState();

    if (!(userId in audioConsumerMap)) {
      // console.log("[LOGGING]: No audio graph");
      return;
    }

    const { audioGraph, audioRef, consumer } = audioConsumerMap[userId];
    const stream = new MediaStream([consumer.track]);

    if (!audioGraph) {
      console.log(
        "[LOGGING]: peer doesn't have an audio graph creating one ..."
      );
      // Create the audio graph if it doesn't exist
      this.createSpatialAudio(userId, stream, gainValue, panValue);
    }

    if (audioRef?.muted) {
      console.log("[LOGGING]: unmuting audio stream");
      setMute(userId, false);
    }

    setGain(userId, gainValue);
    setPan(userId, panValue);
    setStream(userId, stream);
  }

  // updateAudio(gainValue: number, panValue: number, userId: string) {
  //   const { audioConsumerMap, setGain, setPan, setMute, playAudio } =
  //     useConsumerStore.getState();

  //   if (!(userId in audioConsumerMap)) {
  //     console.log("[LOGGING]: No audio graph");
  //     return;
  //   }

  //   const { audioGraph, audioRef } = audioConsumerMap[userId];

  //   if (!audioGraph) {
  //     console.log(
  //       "[LOGGING]: peer doesn't have an audio graph creating one ..."
  //     );
  //     // Create the audio graph if it doesn't exist
  //     this.createAudioNodes(gainValue, panValue, userId);
  //   }

  //   if (audioRef?.muted) {
  //     console.log("[LOGGING]: unmuting audio stream");
  //     setMute(userId, false);
  //   }

  //   // Update gain and pan values
  //   setGain(userId, gainValue);
  //   setPan(userId, panValue);
  // }

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

  zoomIn() {
    if (this.zoomLevel < this.maxZoomIn) {
      this.zoomLevel += 0.1; // Adjust this value to control the zoom speed
      this.cameras.main.zoomTo(this.zoomLevel, 500); // 500 is the duration in ms
    }
  }

  zoomOut() {
    if (this.zoomLevel > this.minZoomOut) {
      this.zoomLevel -= 0.1; // Adjust this value to control the zoom speed
      this.cameras.main.zoomTo(this.zoomLevel, 500); // 500 is the duration in ms
    }
  }

  locatePlayer(targetUserId: string) {
    if (!this.gridEngine) {
      return;
    }

    console.log("called locate player");

    // Get the target user's position
    const targetPosition = this.gridEngine.getPosition(targetUserId);

    // Center the camera on the target user
    this.cameras.main.centerOn(targetPosition.x, targetPosition.y);

    // Zoom in on the target user
    // this.cameras.main.zoomTo(2, 500); // 2 is the zoom level, 500 is the duration in ms
  }
}
