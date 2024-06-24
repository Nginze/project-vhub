import React from "react";
import {
  HomeRoomPreviewCard,
  HomeRoomPreviewCardSkeleton,
} from "./HomeRoomPreviewCard";

type HomeGridProps = {
  rooms: any;
  roomsLoading: boolean;
};

export const HomeGrid: React.FC<HomeGridProps> = ({ rooms, roomsLoading }) => {
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
    <div className="grid grid-cols-5 gap-10 overflow-y-auto">
      {rooms && rooms.map((room: any) => (
        <HomeRoomPreviewCard key={room.id} room={room} />
      ))}
    </div>
  );
};
