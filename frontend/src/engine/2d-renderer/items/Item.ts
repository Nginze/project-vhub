import Phaser from "phaser";
import { ItemType } from "../types";
import { RoomScene } from "../scenes/RoomScene";
export default class Item extends Phaser.Physics.Arcade.Sprite {
  private dialogBox!: Phaser.GameObjects.Container;
  private statusBox!: Phaser.GameObjects.Container;
  itemType!: ItemType;
  isHighlighted!: boolean;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    super(scene, x, y, texture, frame);

    // add dialogBox and statusBox containers on top of everything which we can add text in later
    this.dialogBox = this.scene.add.container().setDepth(10000);
    this.statusBox = this.scene.add.container().setDepth(10000);
  }

  setHighlight(fx: any) {
    if (this.isHighlighted) {
      return;
    }

    fx.add(this, {
      thickness: 3.5,
      outlineColor: 0xffff00,
    });

    this.isHighlighted = true;
  }

  removeHiglight(fx: any) {
    if (!this.isHighlighted) {
      return;
    }

    fx.remove(this);

    this.isHighlighted = false;
  }

  // add texts into dialog box container
  setDialogBox(text: string) {
    // const dialogBox = this.scene.add.dom(this.x, this.y + this.height * 0.5)
    //   .createFromHTML(`
    //     <div class='item-dialog'>
    //       <div style="white-space: nowrap;">
    //         ${text}
    //       </div>
    //     </div>
    //   `);

    // // Add the DOMElement to the dialogBox
    // this.dialogBox.add(dialogBox);

    // // Add the DOMElement to the dialogBox
    // this.dialogBox.add(dialogBox);
  }

  // remove everything in the dialog box container
  clearDialogBox() {
    this.dialogBox.removeAll(true);
  }

  // add text into status box container
  setStatusBox(text: string) {
    const innerText = this.scene.add
      .text(0, 0, text)
      .setFontFamily("Arial")
      .setFontSize(12)
      .setColor("#000000");

    // set dialogBox slightly larger than the text in it
    const statusBoxWidth = innerText.width + 4;
    const statusBoxHeight = innerText.height + 2;
    const statusBoxX = this.x - statusBoxWidth * 0.5;
    const statusBoxY = this.y - this.height * 0.25;
    this.statusBox.add(
      this.scene.add
        .graphics()
        .fillStyle(0xffffff, 1)
        .fillRoundedRect(
          statusBoxX,
          statusBoxY,
          statusBoxWidth,
          statusBoxHeight,
          3
        )
        .lineStyle(1.5, 0x000000, 1)
        .strokeRoundedRect(
          statusBoxX,
          statusBoxY,
          statusBoxWidth,
          statusBoxHeight,
          3
        )
    );
    this.statusBox.add(innerText.setPosition(statusBoxX + 2, statusBoxY));
  }

  // remove everything in the status box container
  clearStatusBox() {
    this.statusBox.removeAll(true);
  }
}
