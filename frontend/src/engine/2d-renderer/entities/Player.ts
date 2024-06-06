import { RoomStatus, UserData } from "../../../../../shared/types";
import { RoomScene } from "../scenes/RoomScene";
import { createPlayerIcon, createPlayerName } from "../templates";
import { Direction } from "grid-engine";
import { AnimationType, ItemType, PlayerBehaviour } from "../types";
import { useRoomStore } from "@/global-store/RoomStore";
import { Socket } from "socket.io-client";
import { useRendererStore } from "../store/RendererStore";
import { WS_MESSAGE } from "../events";
import { api } from "@/api";
import PlayerSelector from "./PlayerSelector";
import Computer from "../items/Computer";
import Whiteboard from "../items/WhiteBoard";
import Chair from "../items/Chair";
import { SITTING_OFFSET } from "../utils/constants";

export default class Player extends Phaser.GameObjects.Container {
  public playerSprite: Phaser.GameObjects.Sprite;
  public playerContainer: Phaser.GameObjects.Container;
  public playerName: Phaser.GameObjects.DOMElement;
  public playerIcon: Phaser.GameObjects.DOMElement;
  public playerBehavior: PlayerBehaviour;
  public playerData: UserData & RoomStatus;
  public playerSelector: PlayerSelector;

  reactionTimeoutId: NodeJS.Timeout | null = null;

  constructor(scene: RoomScene, user: UserData & RoomStatus) {
    const { posX, posY, skin, dir } = user;
    super(scene, posX, posY);

    this.playerData = user;
    this.playerBehavior = PlayerBehaviour.IDLE;
    this.playerSprite = scene.physics.add
      .sprite(0, 0, skin.toLowerCase())
      .setInteractive();

    this.playerName = scene.add
      .dom(0, -20)
      .createFromHTML(createPlayerName(this.playerData))
      .setOrigin(0.225);

    this.playerIcon = scene.add
      .dom(-3, -39)
      .createFromHTML(createPlayerIcon(this.playerData))
      .setOrigin(0.225)
      .setVisible(false);

    this.playerContainer = scene.add
      .container(posX, posY, [
        this.playerSprite,
        this.playerName,
        this.playerIcon,
      ])
      .setDataEnabled();

    this.playerSelector = new PlayerSelector(
      scene,
      this.playerContainer.x,
      this.playerContainer.y
    );

    this.playAnimation(AnimationType.IDLE, dir as Direction);
    this.setCtxMenu();
  }

  update() {
    this.handleUserInput();
  }

  setCtxMenu() {
    this.playerSprite.on("pointerdown", (pointer: any) => {
      const ctxTrigger = document.querySelector("#ctx-menu-trigger");
      const event = new MouseEvent("contextmenu", {
        bubbles: true,
        cancelable: true,
        view: window,
        button: 2,
        buttons: 2,
        clientX: pointer.x,
        clientY: pointer.y,
      });
      ctxTrigger!.dispatchEvent(event);
    });
  }

  playAnimation(animationType: AnimationType, direction: Direction) {
    switch (animationType) {
      case AnimationType.IDLE:
        this.playerSprite.anims.play(
          `${this.playerSprite.texture.key
            .split("_")[0]
            .toLowerCase()}_idle_${direction}`
        );
        break;

      case AnimationType.RUN:
        this.playerSprite.anims.play(
          `${this.playerSprite.texture.key
            .split("_")[0]
            .toLowerCase()}_run_${direction}`
        );
        break;

      case AnimationType.SIT:
        this.playerSprite.anims.play(
          `${this.playerSprite.texture.key
            .split("_")[0]
            .toLowerCase()}_sit_${direction}`
        );
        break;

      default:
        break;
    }
  }

  stopAnimation() {
    this.playerSprite.anims.stop();
  }

  showReaction() {
    const { set } = useRoomStore.getState();

    this.playerIcon.setHTML(createPlayerIcon(this.playerData));
    this.playerIcon.setVisible(true);
    this.playerName.setVisible(false);

    // Clear any existing timeout
    if (this.reactionTimeoutId) {
      clearTimeout(this.reactionTimeoutId);
    }

    // Set a new timeout
    this.reactionTimeoutId = setTimeout(() => {
      this.playerIcon.setVisible(false);
      this.playerName.setVisible(true);
      set(() => ({ currentReaction: "" }));
      this.reactionTimeoutId = null; // Clear the timeout ID
    }, 5000); // 5000 milliseconds = 5 seconds
  }

  updateSkin(skin: string) {
    this.playerSprite.setTexture(skin.toLowerCase());
  }

  async broadcastMovement(
    charId: string,
    roomId: string,
    conn: Socket,
    payload: { posX: number; posY: number; dir: Direction }
  ) {
    const {
      user: { userId },
    } = useRendererStore.getState();
    const { posX, posY, dir } = payload;

    if (charId === userId) {
      conn.emit(WS_MESSAGE.WS_ROOM_MOVE, {
        roomId,
        ...payload,
      });

      await Promise.all([
        api.put(
          `/room/room-status/update/${userId}?roomId=${roomId}&state=pos_x&value=${posX}`
        ),
        api.put(
          `/room/room-status/update/${userId}?roomId=${roomId}&state=pos_y&value=${posY}`
        ),
        api.put(
          `/room/room-status/update/${userId}?roomId=${roomId}&state=dir&value=${dir}`
        ),
      ]);
    }
  }

  handleUserInput = () => {
    const scene = this.scene as RoomScene;

    if (!scene.cursors) {
      return;
    }

    const {
      user: { userId },
    } = useRendererStore.getState();
    const { roomIframeOpen, set } = useRoomStore.getState();

    const selectedItem = scene.players.get(userId as string)?.playerSelector
      .selectedItem;

    if (!selectedItem) {
      return;
    }

    if (Phaser.Input.Keyboard.JustDown(scene.keyR!)) {
      switch (selectedItem.itemType) {
        case ItemType.COMPUTER:
          const computer = selectedItem as Computer;
          // computer.openDialog(this.playerId, network);
          break;
        case ItemType.WHITEBOARD:
          const whiteboard = selectedItem as Whiteboard;
          console.log("whiteboard clicked");
          set((state) => ({ roomIframeOpen: !state.roomIframeOpen }));
          // whiteboard.openDialog(network);
          break;
        case ItemType.VENDINGMACHINE:
          // hacky and hard-coded, but leaving it as is for now
          // const url = "https://www.buymeacoffee.com/skyoffice";
          // openURL(url);
          break;
      }
    }

    const player = scene.players.get(userId as string);

    switch (player?.playerBehavior) {
      case PlayerBehaviour.IDLE:
        // if press E in front of selected chair
        if (
          Phaser.Input.Keyboard.JustDown(scene.keyE!) &&
          selectedItem?.itemType === ItemType.CHAIR
        ) {
          const chairItem = selectedItem as Chair;
          scene.time.addEvent({
            delay: 10,
            callback: () => {
              if (chairItem.itemDirection) {
                player
                  .playerSprite!.setPosition(
                    chairItem.x +
                      SITTING_OFFSET[
                        chairItem.itemDirection as keyof typeof SITTING_OFFSET
                      ][0],
                    chairItem.y +
                      SITTING_OFFSET[
                        chairItem.itemDirection as keyof typeof SITTING_OFFSET
                      ][1]
                  )
                  .setDepth(
                    chairItem.depth +
                      SITTING_OFFSET[
                        chairItem.itemDirection as keyof typeof SITTING_OFFSET
                      ][2]
                  );
                player.playerContainer.setPosition(
                  chairItem.x +
                    SITTING_OFFSET[
                      chairItem.itemDirection as keyof typeof SITTING_OFFSET
                    ][0],
                  chairItem.y +
                    SITTING_OFFSET[
                      chairItem.itemDirection as keyof typeof SITTING_OFFSET
                    ][1] -
                    30
                );
              }

              player.playAnimation(
                AnimationType.SIT,
                chairItem.itemDirection as Direction
              );

              player.playerSelector.selectedItem = null;

              if (chairItem.itemDirection === "up") {
                player.playerSelector.selector.setPosition(
                  player.playerContainer!.x,
                  player.playerContainer!.y - player.playerContainer!.height
                );
              } else {
                player.playerSelector.selector.setPosition(0, 0);
              }
              // send new location and anim to server (Here)
            },
            loop: false,
          });

          // set up new dialog as player sits down
          chairItem.clearDialogBox();
          chairItem.setDialogBox(
            "<span>Press <kbd class='key'>E</kbd> to Leave</span>"
          );

          player.playerBehavior = PlayerBehaviour.SITTING;
          player.playerContainer.setData("chairOnSit", chairItem);
          return;
        }

        break;

      case PlayerBehaviour.SITTING:
        // back to idle if player press E while sitting
        if (Phaser.Input.Keyboard.JustDown(scene.keyE!)) {
          player.playAnimation(AnimationType.IDLE, Direction.DOWN);

          player.playerBehavior = PlayerBehaviour.IDLE;
          const chairOnSit = player.playerContainer.getData(
            "chairOnSit"
          ) as Chair;

          chairOnSit?.clearDialogBox();
          player.playerSelector.setPosition(
            player.playerContainer!.x,
            player.playerContainer!.y
          );
          // network.updatePlayer(this.x, this.y, this.anims.currentAnim.key);
        }
        break;
    }
  };
}
