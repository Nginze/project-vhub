import { useMediaStore } from "@/engine/rtc/store/MediaStore";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef } from "react";
import { BiSolidMicrophoneOff, BiSolidVideoOff } from "react-icons/bi";
import { HiMicrophone } from "react-icons/hi2";

type RoomVideoCardProps = {
  stream: MediaStream | null;
  audioMuted: boolean;
  videoMuted: boolean;
  className?: string;
};

type VideoProps = React.DetailedHTMLProps<
  React.VideoHTMLAttributes<HTMLVideoElement>,
  HTMLVideoElement
> & {
  onRef: (v: HTMLVideoElement) => void;
};

const VideoComponent = ({ onRef, ...props }: VideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      onRef(videoRef.current);
    }
  }, [onRef]);

  return (
    <video
      ref={videoRef}
      muted={true}
      autoPlay
      playsInline
      style={{ width: "100%", height: "auto" }}
      {...props}
    />
  );
};

export const RoomVideoCard: React.FC<RoomVideoCardProps> = ({
  stream,
  audioMuted,
  videoMuted,
  className,
}) => {
  const videoRef = useRef<HTMLVideoElement>();

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div
      className={cn(
        "bg-light rounded-xl relative overflow-hidden w-52 h-[8rem]",
        className
      )}
    >
      <VideoComponent
        onRef={(v) => {
          v.muted = true;
          videoRef.current = v;
        }}
      />
      <div className="flex items-center gap-2 p-1 absolute bottom-1">
        <span>
          {audioMuted ? (
            <BiSolidMicrophoneOff size={16} />
          ) : (
            <HiMicrophone size={16} />
          )}
        </span>
        <span>
          {videoMuted ? (
            <BiSolidVideoOff size={16} />
          ) : (
            <BiSolidVideoOff size={16} />
          )}
        </span>
      </div>
    </div>
  );
};
