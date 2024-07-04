import React from "react";
import { RoomVideoOverlay } from "./RoomVideoOverlay";
import { Room } from "../../../../shared/types";
import { RoomPerfStats } from "./RoomPerfStats";
import { useSettingStore } from "@/global-store/SettingStore";

type RoomLayoutProps = {
  room: Room;
  footer: React.ReactNode;
  canvas: React.ReactNode;
};

export const RoomLayout: React.FC<RoomLayoutProps> = ({
  canvas,
  footer,
  room,
}) => {
  const { statsForNerds } = useSettingStore();
  return (
    <main className="relative w-screen h-screen">
      <RoomVideoOverlay room={room}>
        <main className="w-full flex relative overflow-hidden">
          <div className="w-full">
            <div className="w-full">{canvas}</div>
            <div className="absolute bottom-0 w-full">{footer}</div>
          </div>
        </main>
        {statsForNerds && <RoomPerfStats />}
      </RoomVideoOverlay>
    </main>
  );
};
