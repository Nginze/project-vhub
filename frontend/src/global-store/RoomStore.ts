import { create } from "zustand";
import { combine } from "zustand/middleware";

export const useRoomStore = create(
  combine(
    {
      roomSheetOpen: false,
      roomIframeOpen: false,
      roomScreenOpen: false,
      roomScreenUserId: "",
      currentReaction: "",
      spaceName: "",
      wantsMicOn: false,
      wantsVideoOn: false,
    },
    (set) => ({
      set,
    })
  )
);
