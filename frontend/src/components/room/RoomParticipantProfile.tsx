import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  HiEllipsisHorizontal,
  HiEllipsisHorizontalCircle,
  HiMicrophone,
  HiMiniMicrophone,
} from "react-icons/hi2";
import {
  BiExit,
  BiMicrophoneOff,
  BiSolidMicrophone,
  BiSolidMicrophoneOff,
  BiSolidVideo,
  BiSolidVideoOff,
} from "react-icons/bi";
import { EllipsisVertical } from "lucide-react";
import { RoomParticipant } from "../../../../shared/types";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

type RoomParticipantProfileProps = {
  roomParticipant: RoomParticipant;
};

export const RoomParticipantProfile: React.FC<RoomParticipantProfileProps> = ({
  roomParticipant,
}) => {
  return (
    <div className="w-full flex items-center justify-between  py-3 rounded-lg cursor-pointer">
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
      <div className="flex items-center gap-1">
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="hover:bg-light p-1.5 rounded-lg">
                {roomParticipant.isMuted ? (
                  <BiSolidMicrophoneOff
                    className="opacity-70 text-appRed"
                    size={20}
                  />
                ) : (
                  <BiSolidMicrophone className="opacity-70" size={20} />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent className="">
              {roomParticipant.isMuted ? "Muted" : "Unmuted"}
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="hover:bg-light p-1.5 rounded-lg">
                {roomParticipant.isVideoOff ? (
                  <BiSolidVideoOff
                    className="opacity-70 text-appRed"
                    size={20}
                  />
                ) : (
                  <BiSolidVideo className="opacity-70 " size={20} />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent>
              {roomParticipant.isVideoOff ? "Video Off" : "Video On"}
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="flex items-center">
          <button className="hover:bg-light p-1.5 rounded-lg">
            <HiEllipsisHorizontal size={16} className="text-white/50" />
          </button>
        </div>
      </div>
    </div>
  );
};
