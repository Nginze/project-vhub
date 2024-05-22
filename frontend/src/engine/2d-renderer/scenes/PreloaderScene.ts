import { useRendererStore } from "@/engine/2d-renderer/store/RendererStore";
import { Room } from "../../../../../shared/types";

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
    this.load.image(
      "modern-extra-tileset-16",
      `${this.assetsPath}/tilesets/modern-extra-tileset-16.png`
    );
    this.load.image(
      "modern-tileset-16",
      `${this.assetsPath}/tilesets/modern-tileset-16.png`
    );
    this.load.image("tiles_wall", "/assets/tilesets/FloorAndGround.png");
    this.load.image(
      "office",
      "/assets/tilesets/Modern_Office_Black_Shadow.png"
    );
    this.load.image("basement", "/assets/tilesets/Basement.png");
    this.load.image("generic", "/assets/tilesets/Generic.png");
  }
  loadCharacters() {
    const characters = ["Adam", "Alex", "Amelia", "Bob"];
    const spriteTypes = ["dir", "idle", "phone", "run", "sit"];

    characters.forEach((character) => {
      spriteTypes.forEach((type) => {
        let spritePath;
        if (type === "dir") {
          spritePath = `/assets/sprites/characters/${type}/${character}_idle_16x16.png`;
          this.load.spritesheet(character, spritePath, {
            frameWidth: 16,
            frameHeight: 32,
          });
        } else {
          spritePath = `/assets/sprites/characters/${type}/${character}_${type}_16x16.png`;
          if (type === "sit") {
            spritePath = `/assets/sprites/characters/${type}/${character}_${type}_16x16.png`;
            this.load.spritesheet(`${character}_${type}`, spritePath, {
              frameWidth: 16,
              frameHeight: 32,
            });
            for (let i = 2; i <= 3; i++) {
              spritePath = `/assets/sprites/characters/${type}/${character}_${type}${i}_16x16.png`;
              this.load.spritesheet(`${character}_${type}${i}`, spritePath, {
                frameWidth: 16,
                frameHeight: 32,
              });
            }
          } else if (type === "idle") {
            spritePath = `/assets/sprites/characters/${type}/${character}_${type}_anim_16x16.png`;
            this.load.spritesheet(`${character}_${type}_anim`, spritePath, {
              frameWidth: 16,
              frameHeight: 32,
            });
          } else {
            this.load.spritesheet(`${character}_${type}`, spritePath, {
              frameWidth: 16,
              frameHeight: 32,
            });
          }
        }
      });
    });
  }

  loadCharacters32() {
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
