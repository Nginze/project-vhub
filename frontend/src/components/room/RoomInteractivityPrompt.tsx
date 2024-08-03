import { useRendererStore } from "@/engine/2d-renderer/store/RendererStore";
import React from "react";

type RoomInteractivityPromptProps = {};

export const RoomInteractivityPrompt: React.FC<
  RoomInteractivityPromptProps
> = () => {
  const { interactivityPrompt } = useRendererStore();

  return (
    interactivityPrompt && (
      <>
        <div
          className="flex items-center px-4 py-2 w-[200px]  justify-center bg-dark shadow-canvasShadow overflow-hidden rounded-2xl relative"
          dangerouslySetInnerHTML={{ __html: interactivityPrompt }}
        ></div>
      </>
    )
  );
};
