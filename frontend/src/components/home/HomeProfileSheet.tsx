import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { AiOutlineUserAdd } from "react-icons/ai";
import { Button } from "../ui/button";
import { useLoadRoomMeta } from "@/hooks/useLoadRoomMeta";
import { SheetHeader } from "../ui/sheet";
import {
  AiOutlineUsergroupAdd,
  AiOutlineCalendar,
  AiOutlineSearch,
} from "react-icons/ai";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { Activity, GitBranch, Pencil, Wrench, X } from "lucide-react";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import AppDialog from "../global/AppDialog";
import { RoomParticipant } from "../../../../shared/types";
import { useRouter } from "next/router";
import { userContext } from "@/context/UserContext";
import { Logo } from "../global/Logo";
import { Switch } from "../ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { BiImageAdd, BiMicrophone } from "react-icons/bi";
import { BsPersonPlus, BsSoundwave, BsWrench } from "react-icons/bs";
import { FaPerson } from "react-icons/fa6";
import { PiDressFill } from "react-icons/pi";
import { HomeCharacterCustomizer } from "./HomeCharacterCustomizer";
import { useSettingStore, getMicrophones } from "@/global-store/SettingStore";
import { useToast } from "../ui/use-toast";
import { LiveAudioVisualizer } from "react-audio-visualize";
import { api } from "@/api";
import Loader from "../global/Loader";
import FileUploader from "../global/AppFileUploader";

type HomeProfileSheetProps = {
  setSheetOpen: Dispatch<SetStateAction<boolean>>;
};

export const HomeProfileSheet: React.FC<HomeProfileSheetProps> = ({
  setSheetOpen,
}) => {
  const { user, userLoading } = useContext(userContext);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [newBio, setBio] = useState(user.bio);
  const [uploaderOpen, setUploaderOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [isTestingAudio, setIsTestingAudio] = useState(false);
  const [microphones, setMicrophones] = useState<
    { value: string; label: string }[]
  >([]);
  const [bioOpen, setBioOpen] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>();
  const [blob, setBlob] = useState<Blob>();
  const router = useRouter();
  const { toast } = useToast();

  const {
    spatialAudio,
    statsForNerds,
    noiseCancellation,
    soundEffects,
    selectedMicDevice,
    updateNoiseCancellation,
    updateSoundEffects,
    updateSpatialAudio,
    updateStatsForNerds,
    set: setSettings,
  } = useSettingStore();

  const handleBioChange = async () => {
    if (user.bio !== newBio) {
      toast({
        description: "Syncing Bio",
      });
      // await toast.promise(profileMutation.mutateAsync(), {
      //   loading: "Syncing Bio",
      //   success: "Bio Updated",
      //   error: "Sync failed",
      // });
    }
  };

  const handleBlur = async (e: any) => {
    await handleBioChange();
  };

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      await api.post("/auth/logout");
      await router.push("/auth/login");
    } catch (error) {
      console.log(error);
      // toast.error("logout failed");
      setLogoutLoading(false);
    }
  };

  const handleAudioTest = async () => {
    if (!selectedMicDevice) {
      return toast({
        description: "Please select a microphone",
        type: "error",
      });
    }

    if (isTestingAudio && mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      setMediaStream(null);
      setMediaRecorder(null);
    } else {
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

  useEffect(() => {
    (async () => {
      const microphones = await getMicrophones();
      setMicrophones(microphones);
    })();
  }, []);

  return (
    <>
      <div className="mt-5 relative h-full px-3 font-sans">
        <div
          style={{ height: "calc(100vh - 6rem)" }}
          className="chat w-full sheet overflow-auto"
        >
          <div className="space-y-3 mb-5">
            <div className="flex items-center space-x-5">
              <div className="flex relative items-center h-16 w-16 rounded-3xl cursor-pointer group">
                <img
                  className="inline-block h-16 w-16 rounded-3xl cursor-pointer object-cover"
                  src={user.avatarUrl as string}
                  alt=""
                />
                <AppDialog
                  open={uploaderOpen}
                  setOpenChange={setUploaderOpen}
                  content={<FileUploader setUploaderOpen={setUploaderOpen} />}
                >
                  <div className="hidden group-hover:flex absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 justify-center items-center rounded-3xl">
                    <BiImageAdd size={30} color="white" opacity={40} />
                  </div>
                </AppDialog>
              </div>
            </div>
            <div className="flex flex-col items-start w-full mt-4 mb-7 text-sm">
              <div className="flex items-center w-full justify-between">
                <div className="flex flex-col items-staPt space-y-1 mb-5">
                  <span className="font-semibold text-[20px]">
                    {user.displayName}
                  </span>
                  <span className="font-normal text-[16px] opacity-40">
                    @{user.userName}
                  </span>
                </div>

                <AppDialog
                  width={"sm:max-w-[450px]"}
                  content={<HomeCharacterCustomizer />}
                >
                  <button className="flex items-center gap-2  text-blue-600 rounded-xl  py-3 outline-none focus:outline-none">
                    <PiDressFill />
                    Customize
                  </button>
                </AppDialog>
              </div>

              <Separator className="bg-light opacity-40 w-full mx-auto" />
            </div>
          </div>
          <div className="w-full space-y-1 mb-4">
            <span className="font-semibold text-[15px] flex flex-col items-start space-y-2">
              <span className="flex items-center flex-col"> 🌟 About </span>
              <span className="text-[13px] font-sans font-normal opacity-30">
                Describe yourself
              </span>
            </span>
            <div>
              {!user.bio && !bioOpen ? (
                <div className="text-center py-4">
                  <p className="text-gray-500">No bio available</p>
                  <button
                    onClick={() => {
                      setBio("Enter your bio here");
                      setBioOpen(true);
                    }}
                    className="mt-2 text-blue-600"
                  >
                    Add a bio
                  </button>
                </div>
              ) : (
                <textarea
                  className="chat cursor-text bg-transparent italic text-[14px] text-white outline-none  border-none w-full rounded-md hover:shadow-sm"
                  value={newBio as string}
                  onChange={(e) => {
                    setBio(e.target.value);
                  }}
                  onBlur={handleBlur}
                />
              )}
            </div>
            {/* <div className="mb-6 text-[14px] opacity-70">
              Joined April 25th 2023
            </div> */}
          </div>
          {/* <div className="mb-6 space-y-3">
          <span className="font-semibold text-[15px] flex items-start flex-col">
            <span className="flex items-center flex-col">Topics ✨</span>

            <span className="text-[13px] opacity-30">
              Topics influence what you see on your feed
            </span>
          </span>
          <div className="chat w-full  space-y-1 max-h-[120px] overflow-y-auto">
            {categories.slice(1, 5).map(category => (
              <Toggle
                className="bg-app_bg_deep mr-1 rounded-sm shadow-app_shadow"
                key={category}
                value={category}
                aria-label="Toggle italic"
              >
                <span>{category}</span>
              </Toggle>
            ))}
          </div>
        </div> */}

          <div className="space-y-3">
            <span className="font-semibold text-[15px] flex items-center">
              ⚙ Preferences{/* <Settings2Icon className="ml-2" /> */}
            </span>
            <div className="flex flex-col items-start space-y-3">
              <div className="w-full flex flex-col items-start space-y-2">
                {/* <Select
                  options={microphones}
                  isSearchable={true}
                  isDisabled={router.pathname.includes("/room")}
                  value={micAsObj}
                  defaultValue={microphones[0]}
                  onChange={(newMic) => {
                    console.log(newMic);
                    updateSelectedMic(newMic);
                  }}
                  className="text-black"
                /> */}

                <Select
                  onValueChange={(v) => {
                    setSettings({ selectedMicDevice: v });
                  }}
                  defaultValue={selectedMicDevice}
                >
                  <SelectTrigger className="w-full px-5 py-6 rounded-xl bg-light hover:bg-deep border-none ring-0 outline-none focus:outline-none focus:ring-0">
                    <SelectValue
                      placeholder={
                        <div className="flex items-center gap-2">
                          <BiMicrophone size={20} />
                          <span className="flex items-center gap-2">
                            <span className="text-[16px] font-semibold opacity-70">
                              Select a Microphone
                            </span>
                          </span>
                        </div>
                      }
                    />
                  </SelectTrigger>

                  <SelectContent>
                    {microphones.map(({ value, label }) => (
                      <SelectItem
                        value={value}
                        className="text-[16px] font-semibold opacity-70"
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-[16px] font-semibold opacity-70">
                            {label}
                          </span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                      <div>
                        {mediaRecorder && (
                          <LiveAudioVisualizer
                            mediaRecorder={mediaRecorder}
                            barColor={"#43b581"}
                            width={300}
                            height={50}
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between w-full">
                <label className="cursor-pointer text-sm" htmlFor="invites">
                  Spatial Audio
                </label>
                <Switch
                  checked={spatialAudio}
                  onCheckedChange={() => updateSpatialAudio(!spatialAudio)}
                  id="spatial_audio"
                />
              </div>
              <div className="flex items-center justify-between w-full">
                <label className="cursor-pointer text-sm" htmlFor="invites">
                  Noise Cancelation
                </label>
                <Switch
                  checked={noiseCancellation}
                  onCheckedChange={() =>
                    updateNoiseCancellation(!noiseCancellation)
                  }
                  id="noise_cancellation"
                />
              </div>
              <div className="flex items-center justify-between w-full">
                <label
                  className="cursor-pointer text-sm"
                  htmlFor="sound-effects"
                >
                  Sound FX
                </label>
                <Switch
                  checked={soundEffects}
                  onCheckedChange={() => updateSoundEffects(!soundEffects)}
                  id="sound-effects"
                />
              </div>

              <div className="flex items-center justify-between w-full">
                <label
                  className="cursor-pointer text-sm"
                  htmlFor="sound-effects"
                >
                  Stats For Nerds
                </label>
                <Switch
                  checked={statsForNerds}
                  onCheckedChange={() => updateStatsForNerds(!soundEffects)}
                  id="stats_for_nerds"
                />
              </div>
            </div>
          </div>
          <div className="w-full mt-16 space-y-3">
            <Button
              disabled={logoutLoading}
              onClick={async () => {
                await handleLogout();
              }}
              className="w-full rounded-sm flex-1 py-1 px-2 bg-appRed"
            >
              {logoutLoading ? <Loader alt={true} width={15} /> : "Logout"}
            </Button>

            <Button
              onClick={() => setSheetOpen(false)}
              className="rounded-sm flex-1 py-1 px-2 bg-light w-full shadow-app_shadow"
            >
              Close
            </Button>
          </div>
        </div>

        <div className="py-4 px-2 absolute bottom-0 w-full flex items-center justify-between">
          <h1 className="font-logo text-[1.5rem] leading-[2.3rem] opacity-10 flex items-center relative">
            <Logo withLogo={false} size="sm" />
          </h1>
          <div className="flex items-center space-x-10  leading=[2.3em]">
            <a className="text-sm flex items-center text-[#424549] ">
              <GitBranch className="mr-1" color="#424549" size={17} />
              v.1.0.0
            </a>
          </div>
        </div>
      </div>
    </>
  );
};
