import { RoomScene } from "../scenes/RoomScene";
import { ItemType } from "../types";
import Item from "./Item";

export default class Computer extends Item {
  id?: string;
  currentUsers = new Set<string>();

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    super(scene, x, y, texture, frame);

    this.itemType = ItemType.COMPUTER;
  }

  private updateStatus() {
    if (!this.currentUsers) return;
    const numberOfUsers = this.currentUsers.size;
    this.clearStatusBox();
    if (numberOfUsers === 1) {
      this.setStatusBox(`${numberOfUsers} user`);
    } else if (numberOfUsers > 1) {
      this.setStatusBox(`${numberOfUsers} users`);
    }
  }

  onOverlapDialog() {
    if (this.currentUsers.size === 0) {
      this.setDialogBox("Press R to use computer");
    } else {
      this.setDialogBox("Press R join");
    }
  }

  addCurrentUser(userId: string) {
    if (!this.currentUsers || this.currentUsers.has(userId)) return;
    this.currentUsers.add(userId);
    // const computerState = store.getState().computer;
    // if (computerState.computerId === this.id) {
    //   computerState.shareScreenManager?.onUserJoined(userId);
    // }
    // this.updateStatus();
  }

  removeCurrentUser(userId: string) {
    if (!this.currentUsers || !this.currentUsers.has(userId)) return;
    this.currentUsers.delete(userId);
    // const computerState = store.getState().computer;
    // if (computerState.computerId === this.id) {
    //   computerState.shareScreenManager?.onUserLeft(userId);
    // }
    // this.updateStatus();
  }

  openDialog(playerId: string) {
    //handle logic later
  }

  broadcastUpdate(userId: string, action: string) {
    const scene = this.scene as RoomScene;
    const roomId = scene.room.roomId;

    scene.conn.emit("item-update", {
      userId,
      roomId,
      itemType: this.itemType,
      itemId: this.id,
      action: action,
    });
  }
}
