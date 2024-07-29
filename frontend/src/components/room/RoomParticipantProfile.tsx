import React, { useContext, useEffect, useState } from "react";
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
import { AppDropDownMenu } from "../global/AppDropDownMenu";
import { RoomParticipantProfileMenu } from "./RoomParticipantProfileMenu";
import { cn, getSpritePreview } from "@/lib/utils";
import { userContext } from "@/context/UserContext";
import router from "next/router";

type RoomParticipantProfileProps = {
  roomParticipant: RoomParticipant;
};

export const RoomParticipantProfile: React.FC<RoomParticipantProfileProps> = ({
  roomParticipant,
}) => {
  const { user } = useContext(userContext);
  const [spritePreviewUrl, setSpritePreviewUrl] = useState<string>("");

  useEffect(() => {
    console.log(spritePreviewUrl);
    getSpritePreview(3, roomParticipant).then((previewUrl) =>
      setSpritePreviewUrl(previewUrl as string)
    );
  }, [user, router]);

  return (
    <div className="w-full flex items-center justify-between  py-3 rounded-lg cursor-pointer">
      <div className="flex items-center gap-4">
        <div>
          <Avatar
            className={cn(
              "w-9 h-9 cursor-pointer ",
              roomParticipant.indicatorOn && "border-2 border-appGreen"
            )}
          >
            <AvatarImage
              className="object-cover"
              src={spritePreviewUrl as string}
            />
            <AvatarFallback />
          </Avatar>
        </div>
        <div className="flex flex-col items-start">
          <span className="text-[15px] opacity-70 font-body font-semibold">
            {roomParticipant?.userId == user?.userId
              ? roomParticipant.userName + " (me)"
              : roomParticipant.userName}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <div className="flex items-center gap-1">
          {roomParticipant.isMuted && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="hover:bg-light p-1.5 rounded-lg button">
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
          )}
          {roomParticipant.isVideoOff && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="hover:bg-light p-1.5 rounded-lg button">
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
          )}
        </div>
        {/* <div className="flex items-center">
          <AppDropDownMenu
            className="bg-dark border border-light text-white rounded-xl w-[160px]"
            content={<RoomParticipantProfileMenu />}
          >
            <button className="hover:bg-light p-1.5 rounded-lg button">
              <HiEllipsisHorizontal size={16} className="text-white/50" />
            </button>
          </AppDropDownMenu>
        </div> */}
      </div>
    </div>
  );
};
