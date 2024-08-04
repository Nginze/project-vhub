import { useRendererStore } from "@/engine/2d-renderer/store/RendererStore";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { RoomParticipant } from "../../../../shared/types";

type RoomInteractivityPromptProps = {};

export const RoomInteractivityPrompt: React.FC<
  RoomInteractivityPromptProps
> = () => {
  const queryClient = useQueryClient();
  const { interactivityPrompt } = useRendererStore();
  const roomData = queryClient.getQueryData(["room"]);
  const isScreenSharing = (roomData as any).participants.some(
    (p: any) => p.isScreenSharing
  );

  return (
    interactivityPrompt && (
      <>
        <div
          className="flex items-center px-4 py-2 w-[250px]  justify-center border border-light/45 bg-white text-black shadow-canvasShadow overflow-hidden rounded-2xl relative"
          dangerouslySetInnerHTML={{ __html: interactivityPrompt }}
        >
          {/* <div className="flex items-center gap-2">
            <div className="text-black flex items-center gap-2"></div>
          </div> */}
        </div>
      </>
    )
  );
};
