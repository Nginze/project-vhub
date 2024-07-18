import { create } from "zustand";
import { combine } from "zustand/middleware";

export const keyMap = {
  emote: ["1", "2", "3", "4", "5", "6", "7"],
  "raised hand": "h",
  dance: "z",
  funfetti: "f",
  "ghost mode": "g",
  "interact with an object": "x",
  "close interaction": "esc",
  "show shortcuts": "?",
  "open settings menu": "ctrl+p",
  "microphone on/off": "ctrl+shift+a",
  "camera on/off": "ctrl+shift+v",
  "walk to my desk": "ctrl+d",
  "status: available": "ctrl+o",
  "status: busy": "ctrl+i",
  "status: do not disturb": "ctrl+u",
  "look around map": "alt+drag",
  "debug mode on/off": "ctrl+shift+d",
  "network diagnostics on/off": "ctrl+n",
  "zoom in": "=",
  "zoom out": "-",
  "show my location": "ctrl+l",
  "toggle minimal/immersive view": "m",
};

export const useKeyBindStore = create(
  combine(
    {
      sheetOpen: false,
    },
    (set) => ({
      set,
    })
  )
);
