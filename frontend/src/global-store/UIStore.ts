import { create } from "zustand";
import { combine } from "zustand/middleware";

export const useUIStore = create(
  combine(
    {
      sheetOpen: false,
    },
    (set) => ({
      set,
    })
  )
);
