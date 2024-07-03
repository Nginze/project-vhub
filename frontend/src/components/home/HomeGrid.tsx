import React from "react";
import {
  HomeRoomPreviewCard,
  HomeRoomPreviewCardSkeleton,
} from "./HomeRoomPreviewCard";

type HomeGridProps = {
  filterQuery: string;
  rooms: any;
  roomsLoading: boolean;
};

export const HomeGrid: React.FC<HomeGridProps> = ({
  rooms,
  filterQuery,
  roomsLoading,
}) => {
  return roomsLoading ? (
    <div className="grid grid-cols-5 gap-10 overflow-y-auto h-full">
      <HomeRoomPreviewCardSkeleton />
      <HomeRoomPreviewCardSkeleton />
      <HomeRoomPreviewCardSkeleton />
      <HomeRoomPreviewCardSkeleton />
      <HomeRoomPreviewCardSkeleton />
      <HomeRoomPreviewCardSkeleton />
      <HomeRoomPreviewCardSkeleton />
      <HomeRoomPreviewCardSkeleton />
      <HomeRoomPreviewCardSkeleton />
      <HomeRoomPreviewCardSkeleton />
      <HomeRoomPreviewCardSkeleton />
      <HomeRoomPreviewCardSkeleton />
    </div>
  ) : (
    <div className="grid grid-cols-5 gap-10 overflow-visible">
      {rooms &&
        rooms
          .filter((room: any) => room.roomDesc.includes(filterQuery))
          .map((room: any) => (
            <HomeRoomPreviewCard key={room.id} room={room} />
          ))}
    </div>
  );
};
