import {
  CircleHelp,
  LogOut,
  Mic,
  MicOff,
  MonitorUp,
  Settings,
  SmilePlus,
  UsersRound,
  Video,
  VideoOff,
} from "lucide-react";
import React, { useContext } from "react";
import { AppSheet } from "../global/AppSheet";
import { Logo } from "../global/Logo";
import { RoomMediaControlButton } from "./RoomMediaControlButton";
import { RoomSheet } from "./RoomSheet";
import { userContext } from "@/context/UserContext";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";
import { IoIosSettings } from "react-icons/io";
import { BsFillPeopleFill } from "react-icons/bs";
import { HiMicrophone, HiMiniMicrophone } from "react-icons/hi2";
import {
  BiExit,
  BiMicrophoneOff,
  BiSolidMicrophoneOff,
  BiSolidVideo,
  BiSolidVideoOff,
} from "react-icons/bi";
import { FaPeopleGroup, FaPeopleLine } from "react-icons/fa6";
import { VscReactions } from "react-icons/vsc";
import { useRoomStore } from "@/global-store/RoomStore";
import { useLoadRoomMeta } from "@/hooks/useLoadRoomMeta";
import { useRouter } from "next/router";

type RoomControlsProps = {
  room: any;
};

export const RoomControls: React.FC<RoomControlsProps> = ({ room }) => {
  return (
    <div className="w-full py-4 flex items-center">
      <div className="w-full mx-10 flex items-center justify-between">
        <div className="flex flex-col items-start opacity-80">
          <Logo withLogo={false} size="sm" />
          <span className="text-[9px] opacity-60">
            7ed9d5d3-8f22-42ae-b86a-b179b84a41b0
          </span>
        </div>
        <div className="flex items-center gap-5 px-5 py-3 bg-void rounded-full">
          {/* <div className="flex items-center">
            <div>
              <Avatar className="w-10 h-10 cursor-pointer">
                <AvatarImage
                  className="object-cover"
                  src={user.avatarUrl as string}
                />
                <AvatarFallback />
              </Avatar>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[15px] opacity-70 font-body font-semibold">
                {user.userName}
              </span>
              <span className="text-[11px] font-semibold opacity-70">
                Online
              </span>
            </div>
          </div> */}
          {/* <Separator
            orientation="vertical"
            className="h-10 opacity-50  bg-veryLight"
          /> */}
          <RoomMediaControlButton
            iconOn={<HiMicrophone size={22} color="white" fill="white" />}
            iconOff={
              <BiSolidMicrophoneOff size={22} color="white" fill="white" />
            }
            tooltipText="Micorphone"
          />
          <RoomMediaControlButton
            iconOn={<BiSolidVideo size={22} color="white" fill="white" />}
            iconOff={<BiSolidVideoOff size={22} color="white" fill="white" />}
            tooltipText="Camera"
          />
          <RoomMediaControlButton
            tooltipText="Emote"
            iconOn={<VscReactions size={24} color="white" />}
            iconOff={<VscReactions size={24} color="white" />}
          />
          <RoomMediaControlButton
            tooltipText="Leave"
            iconOn={<BiExit size={24} />}
            iconOff={<BiExit size={24} />}
            bgColor="bg-appRed/90"
            textColor="text-white"
          />
        </div>
        <div className="flex items-center gap-5">
          <RoomMediaControlButton
            tooltipText="Settings"
            iconOn={<IoIosSettings size={24} color="white" />}
            iconOff={<IoIosSettings size={24} color="white" />}
          />

          <AppSheet content={<RoomSheet room={room} />}>
            <RoomMediaControlButton
              tooltipText="Settings"
              iconOn={<FaPeopleGroup size={24} color="white" />}
              iconOff={<FaPeopleGroup size={24} color="white" />}
            />
          </AppSheet>
        </div>
      </div>
    </div>
  );
};
