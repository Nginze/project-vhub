import { Socket } from "socket.io-client";
import { create } from "zustand";
import { combine } from "zustand/middleware";
import { UserData } from "../../../shared/types";
import Computer from "@/engine/2d-renderer/items/Computer";
import Whiteboard from "@/engine/2d-renderer/items/WhiteBoard";
import Chair from "@/engine/2d-renderer/items/Chair";

export const useRendererStore = create(
  combine(
    {
      conn: null as unknown as Socket,
      user: null as unknown as UserData,
      currentRoomId: "",
      room: {},
      roomStatus: {},
      computerStore: {} as Record<string, Computer>,
      whiteboardStore: {} as Record<string, Whiteboard>,
      chairStore: {} as Record<string, Chair>,
    },
    (set) => ({
      set,
    })
  )
);
