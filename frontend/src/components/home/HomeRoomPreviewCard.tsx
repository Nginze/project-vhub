import React from "react";
import { Button } from "../ui/button";
import { EllipsisVertical } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { Room } from "../../../../shared/types";
import { AppDropDownMenu } from "../global/AppDropDownMenu";
import { HomePreviewCardMenu } from "./HomePreviewCardMenu";

type HomeRoomPreviewCardProps = {
  room: Room;
};

export const HomeRoomPreviewCard: React.FC<HomeRoomPreviewCardProps> = ({
  room,
}) => {
  return (
    <div className="flex flex-col group">
      <div className="flex-grow h-44 bg-dark overflow-hidden rounded-xl group-hover:rounded-none cursor-pointer">
        <img
          src="/mock_prev.jpg"
          className="w-full h-full object-cover rounded-xl group-hover:rounded-none"
        />
      </div>
      <div className="flex flex-col items-start gap-2 py-4">
        <div className="w-full flex items-center justify-between">
          <span className="font-semibold text-[16px]">Groovy Room</span>
          <AppDropDownMenu content={<HomePreviewCardMenu />}>
            <button className="hover:bg-light rounded-xl p-3">
              <EllipsisVertical size={15} />
            </button>
          </AppDropDownMenu>
        </div>
        <span className="text-[13px] opacity-70">{room.roomDesc}</span>
        <span className="text-[13px] opacity-70 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-appGreen"></div>
          66,560 online
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
