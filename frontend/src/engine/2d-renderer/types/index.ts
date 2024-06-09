export enum AnimationType {
  IDLE = "idle",
  RUN = "run",
  SIT = "sit",
}

export enum ProxmityActionType {
  ADD,
  REMOVE,
}

export type Keyboard = {
  W: Phaser.Input.Keyboard.Key;
  S: Phaser.Input.Keyboard.Key;
  A: Phaser.Input.Keyboard.Key;
  D: Phaser.Input.Keyboard.Key;
};

export enum ItemType {
  CHAIR,
  COMPUTER,
  WHITEBOARD,
  VENDINGMACHINE,
}

export enum PlayerBehaviour {
  IDLE,
  RUNNING,
  SITTING,
}

export type NavKeys = Keyboard & Phaser.Types.Input.Keyboard.CursorKeys;
