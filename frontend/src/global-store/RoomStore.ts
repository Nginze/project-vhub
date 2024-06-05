import { Socket } from "socket.io-client";
import { create } from "zustand";
import { combine } from "zustand/middleware";

export const useRoomStore = create(
  combine(
    {
      roomSheetOpen: false,
      roomIframeOpen: false,
      currentReaction: "",
    },
    (set) => ({
      
      set,
    })
  )
);
