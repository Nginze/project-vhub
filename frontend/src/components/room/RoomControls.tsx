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
import { VscReactions } from "react-icons/vsc";

type RoomControlsProps = {};

export const RoomControls: React.FC<RoomControlsProps> = () => {
  const { user } = useContext(userContext);

  return (
    <div className="w-full py-4 flex items-center">
      <div className="w-full mx-10 flex items-center justify-between">
        <div className="flex flex-col items-start opacity-80">
          <Logo withLogo={false} size="sm" />
          <span className="text-[9px] opacity-60">
            7ed9d5d3-8f22-42ae-b86a-b179b84a41b0
          </span>
        </div>
        <div className="flex items-center gap-5 bg-void opacity-95 px-10 py-3 rounded-3xl">
          <div className="flex items-center gap-2">
            <div>
              <Avatar className="w-10 h-10 cursor-pointer">
                <AvatarImage
                  className="object-cover"
                  src="https://i.pinimg.com/736x/bd/46/35/bd463547b9ae986ba4d44d717828eb09.jpg"
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
          </div>
          <Separator
            orientation="vertical"
            className="h-10 opacity-50  bg-veryLight"
          />
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
          {/* <RoomMediaControlButton
            tooltipText="Screen Share"
            iconOn={<MonitorUp />}
            iconOff={<MonitorUp />}
          /> */}
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
            bgColor="bg-light/50"
          />
          <RoomMediaControlButton
            tooltipText="Participants"
            iconOn={<BsFillPeopleFill size={24} color="white" />}
            iconOff={<BsFillPeopleFill size={24} color="white" />}
            bgColor="bg-light/50"
          />
        </div>
      </div>
    </div>
  );
};
