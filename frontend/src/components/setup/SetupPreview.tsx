import React from "react";
import { SetupButton } from "./SetupButton";
import { Mic, MicOff, Video, VideoOff } from "lucide-react";

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
          iconOn={<Mic strokeWidth={1.25} />}
          iconOff={<MicOff strokeWidth={1.25} />}
          tooltipText="Micorphone"
        />
        <SetupButton
          iconOn={<Video strokeWidth={1.25} />}
          iconOff={<VideoOff strokeWidth={1.25} />}
          tooltipText="Camera"
        />
      </div>
    </div>
  );
};
