import React, { useContext, useState } from "react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { Dice2, Dices } from "lucide-react";
import { userContext } from "@/context/UserContext";
import AppDialog from "../global/AppDialog";
import { HomeCharacterCustomizer } from "../home/HomeCharacterCustomizer";
import { useMediaStore } from "@/engine/rtc/store/MediaStore";
import { useSettingStore } from "@/global-store/SettingStore";
import { BsWrench } from "react-icons/bs";
import { LiveAudioVisualizer } from "react-audio-visualize";
import toast from "react-hot-toast";
import {
  BiMicrophone,
  BiMicrophoneOff,
  BiSolidMicrophone,
} from "react-icons/bi";
import { useRouter } from "next/router";
import Loader from "../global/Loader";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/api";
import { useRoomStore } from "@/global-store/RoomStore";

type SetupFormProps = {};

export const SetupForm: React.FC<SetupFormProps> = () => {
  const { user } = useContext(userContext);
  const [spaceName, setSpaceName] = useState(user.userName);

  const [isTestingAudio, setIsTestingAudio] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>();
  const { selectedMicDevice } = useSettingStore();

  const router = useRouter();
  const { roomId } = router.query;
  const [joinLoading, setJoinLoading] = useState(false);
  const { set } = useRoomStore();

  const handleAudioTest = async () => {
    if (!selectedMicDevice) {
      toast("No Mic Selected", {
        icon: <BiMicrophoneOff size={19} />,
        style: {
          borderRadius: "100px",
          background: "#333",
          padding: "14px",
          color: "#fff",
        },
      });
    }

    if (isTestingAudio && mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      setMediaStream(null);
      setMediaRecorder(null);
    } else {
      toast(
        `Using ${
          selectedMicDevice == "Default" ? "Default" : "Custom"
        } Microphone`,
        {
          icon: <BsWrench size={19} />,
          style: {
            borderRadius: "100px",
            background: "#333",
            padding: "14px",
            color: "#fff",
          },
        }
      );
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId: { exact: selectedMicDevice } },
      });
      const recorder = new MediaRecorder(stream);
      setMediaStream(stream);
      setMediaRecorder(recorder);
      recorder.start();
    }
    setIsTestingAudio(!isTestingAudio);
  };

  return (
    <div className="w-full py-3">
      <div className="flex flex-col items-end gap-5 w-full">
        <div className="flex items-center gap-3 w-full">
          <AppDialog
            className="p-0"
            width={"sm:max-w-[450px]"}
            content={<HomeCharacterCustomizer />}
          >
            <Avatar className="w-8 h-8 cursor-pointer">
              <AvatarImage
                className="object-cover"
                src={user?.avatarUrl as string}
              />
              <AvatarFallback />
            </Avatar>
          </AppDialog>
          <div className="flex flex-col items-start gap-2 w-full">
            <Input
              value={spaceName}
              onChange={(e) => setSpaceName(e.target.value)}
              className="w-full bg-deep rounded-lg placeholder:text-white/50 border-light outline-none text-white"
              placeholder="Enter your username"
            />
            <span className="text-[10px] opacity-40">
              Change your in-game username{" "}
              <span className="text-red-500">*</span>
            </span>
          </div>
        </div>
        <div className="w-full">
          <Button
            size={"lg"}
            className="bg-[#43B581] rounded-xl text-white w-full flex items-center  gap-2 justify-center"
            onClick={async () => {
              set({ spaceName });
              setJoinLoading(true);
              await router.push(`/room/${roomId}`);
              // profileMutation.mutateAsync({ spaceName });
            }}
          >
            {joinLoading ? (
              <Loader width={20} alt />
            ) : (
              <>
                <Dices size={16} />
                Join
              </>
            )}
          </Button>
        </div>

        <div className="flex items-center justify-between w-full flex-col">
          <span className="text-[13px] opacity-30 ">
            Control your audio & video input
          </span>
          {!isTestingAudio ? (
            <button
              className="flex items-center gap-2 opacity-100  text-blue-600 rounded-xl  py-3 outline-none focus:outline-none"
              onClick={() => {
                handleAudioTest();
                setIsTestingAudio(true);
              }}
            >
              <BsWrench />
              Test Audio
            </button>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <button
                className="flex items-center gap-2 opacity-100  text-blue-600 rounded-xl  py-3 outline-none focus:outline-none"
                onClick={() => {
                  handleAudioTest();
                  setIsTestingAudio(false);
                }}
              >
                Cancel Test
              </button>
              <div className="flex flex-col items-center">
                {mediaRecorder && (
                  <LiveAudioVisualizer
                    mediaRecorder={mediaRecorder}
                    barColor={"#43b581"}
                    width={300}
                    height={50}
                  />
                )}

                <span className="text-[13px] opacity-30 mt-2">
                  Check for playing waveforms
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
