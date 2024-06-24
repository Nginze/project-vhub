import { Socket } from "socket.io-client";
import { create } from "zustand";
import { combine } from "zustand/middleware";

export const useCreateFormStore = create(
  combine(
    {
      selectFormOpen: false,
      createFormOpen: false,
      selectedMapTemplate: false,
      mapTemplate: "",
      spaceName: "",
      spacePermissions: "",
    },
    (set) => ({
      set,
    })
  )
);
