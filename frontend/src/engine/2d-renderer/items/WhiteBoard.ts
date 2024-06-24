import { RoomScene } from "../scenes/RoomScene";
import { useRendererStore } from "../store/RendererStore";
import { ItemType } from "../types";
import Item from "./Item";

export default class Whiteboard extends Item {
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

    this.itemType = ItemType.WHITEBOARD;
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
      this.setDialogBox("Press R to use whiteboard");
    } else {
      this.setDialogBox("Press R join");
    }
  }

  addCurrentUser(userId: string) {
    if (!this.currentUsers || this.currentUsers.has(userId)) return;
    this.currentUsers.add(userId);
    this.updateStatus();
    const { user, room, set } = useRendererStore.getState();
    if (user.userId == userId) {
      set({
        currentWhiteboardSrc: `https://wbo.ophir.dev/boards/${room.roomId}_${this.id}`,
      });
      useRendererStore.getState().set({ currentWhiteboardId: this.id });
    }
  }

  removeCurrentUser(userId: string) {
    if (!this.currentUsers || !this.currentUsers.has(userId)) return;
    this.currentUsers.delete(userId);
    this.updateStatus();
    const { user, set } = useRendererStore.getState();
    if (user.userId == userId) {
      useRendererStore.getState().set({ currentWhiteboardId: "" });
    }
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
