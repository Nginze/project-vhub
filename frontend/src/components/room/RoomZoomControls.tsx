import { RoomScene } from "@/engine/2d-renderer/scenes/RoomScene";
import { useRendererStore } from "@/engine/2d-renderer/store/RendererStore";
import React from "react";
import { BiMinus, BiPlus } from "react-icons/bi";

type RoomZoomControlsProps = {};

export const RoomZoomControls: React.FC<RoomZoomControlsProps> = () => {
  const { game } = useRendererStore();
  return (
    <div className="absolute left-10 bottom-28 bg-white/10 rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 flex-col">
        <button
          onClick={() => {
            (game?.scene.getScene("room-scene") as RoomScene).zoomIn();
          }}
          className="button hover:bg-white/50 hover:text-black px-2 py-2"
        >
          <BiPlus size={20} />
        </button>
        <button
          onClick={() => {
            (game?.scene.getScene("room-scene") as RoomScene).zoomOut();
          }}
          className="button hover:bg-white/50 hover:text-black px-2 py-2"
        >
          <BiMinus size={20} />
        </button>
      </div>
    </div>
  );
};
