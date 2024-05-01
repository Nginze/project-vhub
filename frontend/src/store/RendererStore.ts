import { Socket } from "socket.io-client";
import { create } from "zustand";
import { combine } from "zustand/middleware";
import { UserData } from "../../../shared/types";

export const useRendererStore = create(
  combine(
    {
      conn: null as unknown as Socket,
      user: null as unknown as UserData,
      room: {},
      roomStatus: {},
      currentRoomId: "",
    },
    (set) => ({
      set,
    })
  )
);
