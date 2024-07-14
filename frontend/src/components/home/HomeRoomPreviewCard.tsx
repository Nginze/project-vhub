import React from "react";
import { Button } from "../ui/button";
import { EllipsisVertical, Plus } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { Room } from "../../../../shared/types";
import { AppDropDownMenu } from "../global/AppDropDownMenu";
import { HomePreviewCardMenu } from "./HomePreviewCardMenu";
import { useRouter } from "next/router";
import { FaPlay } from "react-icons/fa";

type HomeRoomPreviewCardProps = {
  room: any;
};

export const HomeRoomPreviewCard: React.FC<HomeRoomPreviewCardProps> = ({
  room,
}) => {
  const router = useRouter();
  return (
    <div
      onClick={() => {
        router.push(
          `/room/setup?roomId=${room.roomId}&&roomName=${room.roomName}`
        );
      }}
      className="flex overflow-hidden flex-col group shadow-appShadow relative bg-deep/50 rounded-xl card car"
    >
      <div className="flex-grow h-44 bg-dark overflow-hidden rounded-xl relative rounded-b-none  cursor-pointer">
        <div className="bg-black bg-opacity-30 cursor-pointer flex items-center justify-center  w-full h-full absolute overlay">
          <div className="zoomReveal">
            <div>
              <FaPlay size={32} className="button" />
            </div>
          </div>
          <button className="absolute p-3 button rounded-xl hover:text-appYellow group bg-deep right-2 top-2">
            <Plus size={16} className="" />
          </button>
        </div>
        <img
          src="/mock_prev.jpg"
          className="w-full h-full object-cover rounded-xl rounded-b-none"
        />
      </div>
      <div className="flex flex-col items-start gap-2 py-4 px-3 cursor-pointer ">
        <div className="w-full flex items-center justify-between z-30">
          <span className="font-semibold text-[16px]">{room.roomName}</span>
          <AppDropDownMenu content={<HomePreviewCardMenu room={room} />}>
            <button className="hover:bg-light rounded-xl p-3 button">
              <EllipsisVertical size={15} />
            </button>
          </AppDropDownMenu>
        </div>
        <span className="text-[13px] opacity-90 font-sans overflow-hidden overflow-ellipsis h-10 w-full">
          {room.roomDesc}
        </span>
        <span className="text-[13px] opacity-90 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-appGreen"></div>
          {room.participants ? room.participants.length : 0} online
        </span>
      </div>
    </div>
  );
};

export const HomeRoomPreviewCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col">
      <Skeleton className="flex-grow h-44 bg-dark rounded-xl cursor-pointer"></Skeleton>
      <div className="flex flex-col items-start gap-3 py-4">
        <div className="w-full flex items-center justify-between">
          <Skeleton className="bg-dark rounded-md h-4 w-3/4" />
          <Skeleton className="bg-dark rounded-full h-4 w-4" />
        </div>
        <Skeleton className="bg-dark rounded-md h-4 w-1/2" />
      </div>
    </div>
  );
};
