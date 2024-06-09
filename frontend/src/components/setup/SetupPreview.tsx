import React, { useEffect, useRef, useState } from "react";
import { SetupButton } from "./SetupButton";
import { Mic, MicOff, Video, VideoOff } from "lucide-react";
import {
  BiSolidMicrophone,
  BiSolidMicrophoneOff,
  BiSolidVideo,
  BiSolidVideoOff,
} from "react-icons/bi";
import { HiMicrophone } from "react-icons/hi2";
import { RotatingLines } from "react-loader-spinner";
import { cn } from "@/lib/utils";

type SetupPreviewProps = {};

export const SetupPreview: React.FC<SetupPreviewProps> = () => {
  const [videoLoading, setVideoLoading] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);

  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (videoRef.current && videoStream) {
      videoRef.current.srcObject = videoStream;
    }
  }, [videoStream]);

  useEffect(() => {
    if (audioRef.current && audioStream) {
      audioRef.current.srcObject = audioStream;
    }
  }, [audioStream]);

  async function testVideo() {
    setVideoLoading(true);
    try {
      if (videoStream) {
        videoStream.getTracks().forEach((track) => track.stop());
        setVideoStream(null);
      } else {
        const constraints = { video: true };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        setVideoStream(stream);
      }

      setTimeout(() => setVideoLoading(false), 1000);
    } catch (error) {
      console.error("Error accessing media devices.", error);

      setTimeout(() => setVideoLoading(false), 1000);
      throw error;
    }
  }

  async function testAudio() {
    setAudioLoading(true);
    try {
      if (audioStream) {
        audioStream.getTracks().forEach((track) => track.stop());
        setAudioStream(null);
      } else {
        const constraints = { audio: true };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        setAudioStream(stream);
      }

      setTimeout(() => setAudioLoading(false), 500);
    } catch (error) {
      console.error("Error accessing media devices.", error);
      setTimeout(() => setAudioLoading(false), 500);
      throw error;
    }
  }

  return (
    <div className="w-full flex flex-col items-center gap-5">
      <div className="w-full border border-[#7289DA] relative overflow-hidden h-[200px] rounded-md bg-black/20 gap-3 text-center flex flex-col items-center justify-center">
        {!audioStream && (
          <span className={cn("text-sm opacity-40 z-10")}>You are muted</span>
        )}
        {!videoStream && (
          <span className="text-sm opacity-40 z-10">Your camera is Off</span>
        )}
        {videoStream && (
          <video className="w-full " ref={videoRef} autoPlay muted />
        )}
        {audioStream && <audio ref={audioRef} autoPlay />}
      </div>
      <div className="flex items-center gap-5">
        <SetupButton
          isOn={audioStream !== null}
          isLoading={audioLoading}
          onClick={testAudio}
          iconOn={
            <BiSolidMicrophone size={19} color="#43b581" fill="#43b581" />
          }
          iconOff={
            <BiSolidMicrophoneOff size={19} color="#ff3049" fill="#ff3049" />
          }
          tooltipText="Micorphone"
        />
        <SetupButton
          isOn={videoStream !== null}
          isLoading={videoLoading}
          onClick={testVideo}
          iconOn={<BiSolidVideo size={19} color="#43b581" fill="#43b581" />}
          iconOff={<BiSolidVideoOff size={19} color="#ff3049" fill="#ff3049" />}
          tooltipText="Camera"
        />
      </div>
    </div>
  );
};
