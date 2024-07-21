import { Check, Headset, TriangleAlert, X } from "lucide-react";
import Image from "next/image";
import React from "react";
import { Logo } from "../global/Logo";
import { BiCamera, BiMicrophone, BiSpeaker, BiVideo } from "react-icons/bi";
import { useSettingStore } from "@/global-store/SettingStore";
import { cn } from "@/lib/utils";

type HomeDeviceIssueProps = {};

export const HomeDeviceIssue: React.FC<HomeDeviceIssueProps> = () => {
  const { hasCameraIssue, hasMicIssue, hasSpeakerIssue } = useSettingStore();
  return (
    <div className="overflow-hidden w-full h-full rounded-lg font-sans">
      <div className="w-full relative">
        <img
          className="w-full object-cover h-28"
          src={"/gradient_bg4.webp"}
          alt=""
        />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Logo size="lg" withLogo={false} />
        </div>
      </div>
      <div className="p-4">
        <span className="text-[18px] font-semibold flex items-center gap-2 mb-1">
          Device Issue
          <TriangleAlert size={15} className="inline-block text-appYellow" />
        </span>
        <div className="text-[13px] opacity-50 mb-3">
          We have detected an issue with one of your devices. Please check the
          device and try again.
        </div>
        <div className="text-[14px] mb-2">Device Status</div>
        <div className="flex flex-col gap-4 items-start text-[14px] opacity-50">
          <div className="flex items-center justify-between w-full">
            <span className="flex items-center gap-2 ">
              <BiMicrophone size={15} />
              Microphone{" "}
            </span>
            <div
              className={cn(
                "border border-appGreen rounded-full bg-appGreen/20 p-1",
                hasMicIssue && "border-appRed bg-appRed/20"
              )}
            >
              {hasMicIssue ? <X size={15} /> : <Check size={10} />}
            </div>
          </div>

          <div className="flex items-center justify-between w-full">
            <span className="flex items-center gap-2 ">
              <BiVideo size={15} />
              WebCam{" "}
            </span>
            <div
              className={cn(
                "border border-appGreen rounded-full bg-appGreen/20 p-1",
                hasCameraIssue && "border-appRed bg-appRed/20"
              )}
            >
              {hasMicIssue ? <X size={15} /> : <Check size={10} />}
            </div>
          </div>
          <div className="flex items-center justify-between w-full">
            <span className="flex items-center gap-2 ">
              <BiSpeaker size={15} />
              Speaker{" "}
            </span>
            <div
              className={cn(
                "border border-appGreen rounded-full bg-appGreen/20 p-1",
                hasSpeakerIssue && "border-appRed bg-appRed/20"
              )}
            >
              {hasMicIssue ? <X size={15} /> : <Check size={10} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
