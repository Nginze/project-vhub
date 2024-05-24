import React from "react";
import {
  HomeRoomPreviewCard,
  HomeRoomPreviewCardSkeleton,
} from "./HomeRoomPreviewCard";

type HomeGridProps = {};

export const HomeGrid: React.FC<HomeGridProps> = () => {
  return (
    <div className="grid grid-cols-5 gap-10 overflow-y-auto">
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
      <HomeRoomPreviewCardSkeleton />
    </div>
  );
};
