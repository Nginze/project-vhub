import { useRendererStore } from "@/engine/2d-renderer/store/RendererStore";
import { Room } from "../../../../../shared/types";
import { use } from "matter";

export class Preloader extends Phaser.Scene {
  constructor() {
    super("pre-loader-scene");
  }

  private assetsPath: string = "/assets";
  private room: Room = useRendererStore.getState().room as Room;

  preload() {
    // fx plugin
    this.load.plugin(
      "rexoutlinepipelineplugin",
      "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexoutlinepipelineplugin.min.js",
      true
    );

    // load world assets
    this.loadMap();
    this.loadCharacters32();
    this.loadItems();
  }

  create() {
    this.scene.start("room-scene");
  }

  loadMap() {
    this.load.tilemapTiledJSON(
      "map",
      `${this.assetsPath}/maps/${this.room.mapKey}.json`
    );
    this.load.spritesheet("tiles_wall", "/assets/tilesets/FloorAndGround.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet(
      "office",
      "/assets/tilesets/Modern_Office_Black_Shadow.png",
      {
        frameWidth: 32,
        frameHeight: 32,
      }
    );
    this.load.spritesheet("basement", "/assets/tilesets/Basement.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("generic", "/assets/tilesets/Generic.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
  }

  loadCharacters32() {
    const { user } = useRendererStore.getState();

    this.load.spritesheet("adam", "/assets/sprites/characters/new32/adam.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
    this.load.spritesheet("ash", "/assets/sprites/characters/new32/ash.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
    this.load.spritesheet("lucy", "/assets/sprites/characters/new32/lucy.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
    this.load.spritesheet(
      "nancy",
      "/assets/sprites/characters/new32/nancy.png",
      {
        frameWidth: 32,
        frameHeight: 48,
      }
    );
  }

  loadItems() {
    this.load.spritesheet("chairs", "/assets/sprites/items/chair.png", {
      frameWidth: 32,
      frameHeight: 64,
    });
    this.load.spritesheet("computers", "/assets/sprites/items/computer.png", {
      frameWidth: 96,
      frameHeight: 64,
    });
    this.load.spritesheet(
      "whiteboards",
      "/assets/sprites/items/whiteboard.png",
      {
        frameWidth: 64,
        frameHeight: 64,
      }
    );
    this.load.spritesheet(
      "vendingmachines",
      "/assets/sprites/items/vendingmachine.png",
      {
        frameWidth: 48,
        frameHeight: 72,
      }
    );
  }
}
