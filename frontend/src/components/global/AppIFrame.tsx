import { useRendererStore } from "@/engine/2d-renderer/store/RendererStore";
import React from "react";

type AppIFrameProps = {};

export const AppIFrame: React.FC<AppIFrameProps> = () => {
  const { currentWhiteboardSrc } = useRendererStore();
  return (
    <div className="h-screen w-full flex items-center justify-center bg-black">
      <iframe src={currentWhiteboardSrc} className="w-full h-4/5" />
    </div>
  );
};
