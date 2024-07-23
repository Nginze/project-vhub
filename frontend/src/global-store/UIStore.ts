import { create } from "zustand";
import { combine } from "zustand/middleware";

export const useUIStore = create(
  combine(
    {
      sheetOpen: false,
      activeRoomSheet: "participant",
      roomLoadStatusMessage: "Connecting to Server",
    },
    (set) => ({
      set,
    })
  )
);
