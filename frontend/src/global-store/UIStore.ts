import { create } from "zustand";
import { combine } from "zustand/middleware";

export const useUIStore = create(
  combine(
    {
      sheetOpen: false,
      activeRoomSheet: "participant",
      roomLoadStatusMessage: "Connecting to Server",
      mapKey: "map",
      roomSize: 10,
      passcode: "",
      privacy: "public",
      spaceName: "",
      spaceDescription: ""
    },
    (set) => ({
      set,
    })
  )
);
