import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type RoomParticipantProfileProps = {
  roomParticipant: any;
};

export const RoomParticipantProfile: React.FC<RoomParticipantProfileProps> = ({
  roomParticipant,
}) => {
  console.log(roomParticipant.avatarUrl);
  return (
    <div className="flex items-center gap-4">
      <div>
        <Avatar className="w-9 h-9 cursor-pointer">
          <AvatarImage
            className="object-cover"
            src={roomParticipant.avatarUrl as string}
          />
          <AvatarFallback />
        </Avatar>
      </div>
      <div className="flex flex-col items-start">
        <span className="text-[15px] opacity-70 font-body font-semibold">
          {roomParticipant.userName}
        </span>
      </div>
    </div>
  );
};
