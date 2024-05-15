export enum WS_MESSAGE {
  PLAYER_JOINED = "player-joined",
}

export enum RTC_MESSAGE {}

export type MESSAGE = WS_MESSAGE| RTC_MESSAGE;
