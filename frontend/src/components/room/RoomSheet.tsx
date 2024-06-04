import React from "react";
import { AiOutlineUserAdd } from "react-icons/ai";
import { Button } from "../ui/button";
import { useLoadRoomMeta } from "@/hooks/useLoadRoomMeta";
import { RoomParticipantProfile } from "./RoomParticipantProfile";

type RoomSheetProps = {
  room: any;
};

export const RoomSheet: React.FC<RoomSheetProps> = ({ room }) => {
  return (
    <div className="w-full h-full flex flex-col gap-10 px-3">
      {/* <div className="w-full flex justify-between">
        <span className="font-semibold text-[20px] opacity-80">
          Groovy Community
        </span>
      </div> */}
      <div className="flex flex-col items-start flex-1">
        <span className="flex gap-2 h-6 opacity-80 text-[16px] font-semibold mb-7">
          Participants
          <span className="bg-dark flex items-center justify-center py-1 px-2 rounded-sm text-[12px] font-bold">
            {room.participants.length}
          </span>
        </span>
        <div className="flex flex-col items-start gap-6">
          {room.participants.map((p: any) => (
            <RoomParticipantProfile key={p.userId} roomParticipant={p} />
          ))}
        </div>
      </div>
    </div>
  );
};
