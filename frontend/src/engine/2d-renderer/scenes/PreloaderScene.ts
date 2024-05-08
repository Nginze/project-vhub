import { useRendererStore } from "@/store/RendererStore";
import { Room } from "../../../../../shared/types";

export class Preloader extends Phaser.Scene {
  constructor() {
    super("pre-loader-scene");
  }

  private assetsPath: string = "/assets";
  private room: Room = useRendererStore.getState().room as Room;

  preload() {
    // Here we load all assets we need for the 2d game view
    // Maps are probably gonna be served statically from public
    // Same with characters but possiblity of a character builder so idk how that will pan out
    // But one thing is for sure we are going to create keys and paths for each loadable entity in the renderer
    // That will be referenced here in the preloader

    this.loadMap();
    this.loadSprites();
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
  }
  loadSprites() {
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
}
