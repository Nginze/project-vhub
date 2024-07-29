import { RoomScene } from "@/engine/2d-renderer/scenes/RoomScene";
import { useRendererStore } from "@/engine/2d-renderer/store/RendererStore";
import React from "react";
import { BiMinus, BiPlus } from "react-icons/bi";

type RoomZoomControlsProps = {};

export const RoomZoomControls: React.FC<RoomZoomControlsProps> = () => {
  const { game } = useRendererStore();
  return (
    <div className="absolute left-10 bottom-8 bg-void/70 rounded-xl overflow-hidden">
      <div className="flex items-center  flex-col">
        <button
          onClick={() => {
            (game?.scene.getScene("room-scene") as RoomScene).zoomIn();
          }}
          className=" hover:bg-void/20 focus:border-none focus:outline-none outline-none  hover:text-white px-4 py-4"
        >
          <BiPlus size={20} />
        </button>
        <button
          onClick={() => {
            (game?.scene.getScene("room-scene") as RoomScene).zoomOut();
          }}
          className="hover:bg-void/20 focus:border-none focus:outline-none outline-none hover:text-white px-4 py-4"
        >
          <BiMinus size={20} />
        </button>
      </div>
    </div>
  );
};
