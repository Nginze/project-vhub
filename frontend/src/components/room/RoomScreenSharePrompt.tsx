import { useRendererStore } from "@/engine/2d-renderer/store/RendererStore";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { RoomParticipant } from "../../../../shared/types";
import { Monitor, X } from "lucide-react";
import { useRoomStore } from "@/global-store/RoomStore";

type RoomScreenSharePromptProps = {};

export const RoomScreenSharePrompt: React.FC<
  RoomScreenSharePromptProps
> = () => {
  const queryClient = useQueryClient();
  const { interactivityPrompt } = useRendererStore();
  const roomData = queryClient.getQueryData(["room"]);
  const isScreenSharing = (roomData as any).participants.some(
    (p: any) => p.isScreenSharing
  );
  const participant = (roomData as any).participants.find(
    (p: any) => p.isScreenSharing
  ) as RoomParticipant;
  const { roomScreenOpen, set } = useRoomStore();

  return (
    isScreenSharing && (
      <>
        <div
          onClick={() => {
            set((state) => ({ roomScreenOpen: !state.roomScreenOpen }));
            set((state) => ({ roomScreenUserId: participant.userId }));
          }}
          className="flex cursor-pointer items-center px-4 py-2 w-[250px]  justify-center bg-white shadow-canvasShadow overflow-hidden rounded-2xl relative"
        >
          <div className="flex items-center gap-2">
            <div className="text-black flex items-center gap-2">
              <Monitor size={20} color="black" className="" />
              Watch <span className="font-bold">{participant.userName}'s</span>
              Screen
            </div>
          </div>
        </div>
      </>
    )
  );
};
