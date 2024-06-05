import { useRendererStore } from "@/engine/2d-renderer/store/RendererStore";
import { Link } from "lucide-react";
import React, { useState } from "react";

type AppIFrameProps = {};

export const AppIFrame: React.FC<AppIFrameProps> = () => {
  const { currentWhiteboardSrc } = useRendererStore();
  const [showInput, setShowInput] = useState(false);
  const [showButton, setShowButton] = useState(false);

  const handleLinkClick = () => {
    setShowInput(!showInput);
  };

  const handleInputFocus = () => {
    setShowButton(true);
  };

  const handleInputBlur = () => {
    setShowButton(false);
  };

  return (
    <div className="h-3/4 transition-width duration-500 ease-in-out my-auto w-full flex items-center justify-center bg-white relative">
      <div className="absolute top-5 left-10 flex items-center gap-2">
        <button
          onClick={handleLinkClick}
          className="bg-veryLight shadow-appShadow p-2.5 rounded-xl opacity-90"
        >
          <Link />
        </button>
        <div
          className={` rounded-xl overflow-hidden max-w-[280px] ${
            showInput ? "w-[280px] p-3" : "p-0 w-0"
          } transition-width duration-500 ease-in-out font-logo text-[14px] text-opacity-70 bg-neutral-200 opacity-90 text-black`}
        >
          <input
            value={currentWhiteboardSrc}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            className="bg-transparent w-full outline-none border-none focus:outline-none placeholder-text-black/70"
          />
        </div>
        {showButton && (
          <button className="bg-appGreen px-4 py-2 font-logo rounded-xl">
            Set
          </button>
        )}
      </div>
      <iframe src={"https://excalidraw.com/"} className="w-full h-full" />
    </div>
  );
};
