import React from "react";
import { SetupButton } from "./SetupButton";
import { Mic, MicOff, Video, VideoOff } from "lucide-react";
import {
  BiSolidMicrophoneOff,
  BiSolidVideo,
  BiSolidVideoOff,
} from "react-icons/bi";
import { HiMicrophone } from "react-icons/hi2";

type SetupPreviewProps = {};

export const SetupPreview: React.FC<SetupPreviewProps> = () => {
  return (
    <div className="w-full flex flex-col items-center gap-5">
      <div className="w-full border border-[#7289DA] h-[200px] rounded-md bg-[#2f3136] gap-3 text-center flex flex-col items-center justify-center">
        <span className="text-sm opacity-40">You are muted</span>
        <span className="text-sm opacity-40">Your camera is Off</span>
      </div>
      <div className="flex items-center gap-5">
        <SetupButton
          iconOn={<HiMicrophone size={22} color="white" fill="white" />}
          iconOff={
            <BiSolidMicrophoneOff size={22} color="white" fill="white" />
          }
          bgColor="bg-appRed"
          tooltipText="Micorphone"
        />
        <SetupButton
          iconOn={<BiSolidVideo size={22} color="white" fill="white" />}
          iconOff={<BiSolidVideoOff size={22} color="white" fill="white" />}
          bgColor="bg-appRed"
          tooltipText="Camera"
        />
      </div>
    </div>
  );
};
