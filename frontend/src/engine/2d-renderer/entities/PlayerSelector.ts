import { Game, GameObjects } from "phaser";
import { RoomScene } from "../scenes/RoomScene";
import { createInteractiveGameObject } from "../utils";
import { useRendererStore } from "../store/RendererStore";
import { Direction } from "grid-engine";
import Player from "./Player";
import Item from "../items/Item";
import { ItemType } from "../types";
import Whiteboard from "../items/WhiteBoard";
import Computer from "../items/Computer";

export default class PlayerSelector extends GameObjects.Rectangle {
  public selectedItem = null as Item | null;
  public selector: GameObjects.Rectangle = null as any;

  constructor(scene: RoomScene, x: number, y: number) {
    super(scene, x, y);
    this.selector = createInteractiveGameObject(
      scene,
      x,
      y,
      32,
      32,
      true,
      "selector"
    ) as GameObjects.Rectangle;
  }

  update() {
    const {
      user: { userId },
    } = useRendererStore.getState();

    const scene = this.scene as RoomScene;

    if (!scene.gridEngine) {
      return;
    }

    const facingDirection = scene.gridEngine.getFacingDirection(userId!);

    const myContainer = scene.gridEngine.getContainer(
      userId as string
    ) as GameObjects.Container;

    switch (facingDirection) {
      case Direction.DOWN: {
        this.selector.setX(myContainer.x);
        this.selector.setY(myContainer.y + 48);
        break;
      }

      case Direction.UP: {
        this.selector.setX(myContainer.x);
        this.selector.setY(myContainer.y - 32);
        break;
      }

      case Direction.LEFT: {
        this.selector.setX(myContainer.x - 32);
        this.selector.setY(myContainer.y + 10);
        break;
      }

      case Direction.RIGHT: {
        this.selector.setX(myContainer.x + 32);
        this.selector.setY(myContainer.y + 10);
        break;
      }

      default: {
        break;
      }
    }
    this.addPhysics();
  }

  registerPhysics() {
    const scene = this.scene as RoomScene;
    const setRenderer = useRendererStore.getState().set;
    const {
      user: { userId },
    } = useRendererStore.getState();

    scene.physics.add.collider(
      this.selector,
      Array.from(scene.objectGroups.values()),
      (a, b) => {
        const selectedItem = [a, b].find(
          (obj) => obj !== this.selector
        ) as Item;

        const currentItem = this.selectedItem as Item;

        if (
          selectedItem === currentItem ||
          currentItem?.depth >= selectedItem.depth
        ) {
          return;
        }

        // If there's a current item and it's different from the selected item, deselect it
        if (currentItem && currentItem !== selectedItem) {
          currentItem.removeHiglight(scene.postFxPlugin);
          currentItem.clearDialogBox();
        }

        this.selectedItem = selectedItem;
        selectedItem.setHighlight(scene.postFxPlugin);

        switch (selectedItem.itemType) {
          case ItemType.CHAIR:
            selectedItem.setDialogBox(
              "<span>Press <kbd class='key-cap'>E</kbd> to interact</span>"
            );
            setRenderer({
              interactivityPrompt:
                "<span>Press <kbd class='key-cap'>E</kbd> to interact</span>",
            });
            break;
          case ItemType.COMPUTER:
            const computer = selectedItem as Computer;
            if (computer.currentUsers.size === 0) {
              computer.setDialogBox(
                "<span>Press <kbd class='key-cap'>R</kbd> to interact</span>"
              );

              setRenderer({
                interactivityPrompt:
                  "<span>Press <kbd class='key-cap'>R</kbd> to interact</span>",
              });
            } else {
              selectedItem.setDialogBox(
                "<span>Press <kbd class='key-cap'>R</kbd> to interact</span>"
              );

              setRenderer({
                interactivityPrompt:
                  "<span>Press <kbd class='key-cap'>R</kbd> to interact</span>",
              });
            }
            break;
          case ItemType.WHITEBOARD:
            const whiteboard = selectedItem as Whiteboard;
            if (whiteboard.currentUsers.size === 0) {
              console.log(
                "whiteboard.currentUsers.size",
                whiteboard.currentUsers.size
              );
              whiteboard.setDialogBox(
                "<span>Press <kbd class='key-cap'>R</kbd> to use</span>"
              );

              setRenderer({
                interactivityPrompt:
                  "<span>Press <kbd class='key-cap'>R</kbd> to interact</span>",
              });
            } else {
              console.log(
                "whiteboard.currentUsers.size",
                whiteboard.currentUsers.size
              );
              whiteboard.setDialogBox(
                "<span>Press <kbd class='key-cap'>R</kbd> to join</span>"
              );

              setRenderer({
                interactivityPrompt:
                  "<span>Press <kbd class='key-cap'>R</kbd> to interact</span>",
              });
            }

            break;
          case ItemType.VENDINGMACHINE:
            selectedItem.setDialogBox(
              "<span>Press <kbd class='key-cap'>R</kbd> to interact</span>"
            );

            setRenderer({
              interactivityPrompt:
                "<span>Press <kbd class='key-cap'>R</kbd> to interact</span>",
            });
            break;
          default:
            break;
        }
      }
    );
  }

  addPhysics() {
    const scene = this.scene as RoomScene;
    const currentItem = this.selectedItem as Item;
    const setRenderer = useRendererStore.getState().set;

    if (currentItem) {
      if (!scene.physics.overlap(this.selector, currentItem)) {
        currentItem.removeHiglight(scene.postFxPlugin);
        currentItem.clearDialogBox();
        this.selectedItem = null;
        setRenderer({ interactivityPrompt: "" });
      }
    }
  }
}
