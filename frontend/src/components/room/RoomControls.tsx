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
import React from "react";
import { AppSheet } from "../global/AppSheet";
import { Logo } from "../global/Logo";
import { RoomMediaControlButton } from "./RoomMediaControlButton";
import { RoomSheet } from "./RoomSheet";

type RoomControlsProps = {};

export const RoomControls: React.FC<RoomControlsProps> = () => {
  return (
    <div className="w-full py-4 flex items-center">
      <div className="w-full mx-10 flex items-center justify-between">
        <div className="flex flex-col items-start">
          <Logo withLogo={false} size="sm" />
          <span className="text-[10px] opacity-60">
            7ed9d5d3-8f22-42ae-b86a-b179b84a41b0
          </span>
        </div>
        <div className="flex items-center gap-5">
          <RoomMediaControlButton
            iconOn={<Mic />}
            iconOff={<MicOff />}
            tooltipText="Micorphone"
          />
          <RoomMediaControlButton
            iconOn={<Video />}
            iconOff={<VideoOff />}
            tooltipText="Camera"
          />
          <RoomMediaControlButton
            tooltipText="Screen Share"
            iconOn={<MonitorUp />}
            iconOff={<MonitorUp />}
          />
          <RoomMediaControlButton
            tooltipText="Emote"
            iconOn={<SmilePlus />}
            iconOff={<SmilePlus />}
          />
          <RoomMediaControlButton
            tooltipText="Leave"
            iconOn={<LogOut />}
            iconOff={<LogOut />}
            bgColor="bg-red-500"
            textColor="text-white"
          />
        </div>
        <div className="flex items-center gap-5">
          <AppSheet content={<RoomSheet />}>
            <RoomMediaControlButton
              tooltipText="Participants"
              iconOn={<UsersRound />}
              iconOff={<UsersRound />}
            />
          </AppSheet>
          <RoomMediaControlButton
            tooltipText="Settings"
            iconOn={<Settings />}
            iconOff={<Settings />}
          />
        </div>
      </div>
    </div>
  );
};
