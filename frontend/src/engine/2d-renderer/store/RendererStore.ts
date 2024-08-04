import { Socket } from "socket.io-client";
import { create } from "zustand";
import { combine } from "zustand/middleware";
import { Room, RoomStatus, UserData } from "../../../../../shared/types";
import Computer from "@/engine/2d-renderer/items/Computer";
import Whiteboard from "@/engine/2d-renderer/items/WhiteBoard";
import Chair from "@/engine/2d-renderer/items/Chair";
import { RoomScene } from "../scenes/RoomScene";
import { QueryClient, useQueryClient } from "@tanstack/react-query";

export const useRendererStore = create(
  combine(
    {
      conn: null as unknown as Socket,
      user: null as unknown as UserData,
      currentRoomId: "",
      currentWhiteboardSrc: "https://wbo.ophir.dev/boards/adasdf",
      room: {} as Room & {
        participants: any[];
      },

      currentWhiteboardId: "",
      game: null as Phaser.Game | null,
      currentComputerId: "",
      ready: false,

      qc: null as unknown as QueryClient,
      roomStatus: {} as RoomStatus,
      scene: null as unknown as RoomScene,
      computerStore: {} as Record<string, Computer>,
      whiteboardStore: {} as Record<string, Whiteboard>,
      chairStore: {} as Record<string, Chair>,
      interactivityPrompt: "",
    },
    (set) => ({
      set,
    })
  )
);
