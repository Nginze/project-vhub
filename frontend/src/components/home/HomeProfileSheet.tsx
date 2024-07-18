import { api } from "@/api";
import { userContext } from "@/context/UserContext";
import {
  getMicrophones,
  getCameras,
  getSpeakers,
  useSettingStore,
} from "@/global-store/SettingStore";
import { GitBranch, Speaker } from "lucide-react";
import { useRouter } from "next/router";
import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
//@ts-ignore
import { LiveAudioVisualizer } from "react-audio-visualize";
import {
  BiCamera,
  BiImageAdd,
  BiMicrophone,
  BiMicrophoneOff,
  BiSpeaker,
  BiWrench,
} from "react-icons/bi";
import {
  BsOpticalAudio,
  BsSoundwave,
  BsSpeaker,
  BsWrench,
} from "react-icons/bs";
import { PiDressFill } from "react-icons/pi";
import AppDialog from "../global/AppDialog";
import FileUploader from "../global/AppFileUploader";
import Loader from "../global/Loader";
import { Logo } from "../global/Logo";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";
import { Switch } from "../ui/switch";
import { HomeCharacterCustomizer } from "./HomeCharacterCustomizer";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { stat } from "fs";
import { useSoundEffectStore } from "@/global-store/SoundFxStore";
import {
  HiMicrophone,
  HiMiniSpeakerWave,
  HiMiniVideoCamera,
} from "react-icons/hi2";
import { CgLogOut } from "react-icons/cg";
import { HomeKeyboardShortcuts } from "./HomeKeyboardShortcuts";
import { appToast } from "@/lib/utils";

type HomeProfileSheetProps = {
  setSheetOpen?: Dispatch<SetStateAction<boolean>>;
  dontShowXtra?: boolean;
};

export const HomeProfileSheet: React.FC<HomeProfileSheetProps> = ({
  dontShowXtra,
  setSheetOpen,
}) => {
  const { user, userLoading } = useContext(userContext);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [newBio, setBio] = useState(user.bio);
  const [uploaderOpen, setUploaderOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [isTestingAudio, setIsTestingAudio] = useState(false);
  const [isTestingMic, setIsTestingMic] = useState(false);
  const [microphones, setMicrophones] = useState<
    { value: string; label: string }[]
  >([]);

  const [speakers, setSpeakers] =
    useState<{ value: string; label: string }[]>();
  const [cameras, setCameras] = useState<{ value: string; label: string }[]>();

  const [bioOpen, setBioOpen] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>();
  const [blob, setBlob] = useState<Blob>();
  const { playSoundEffect } = useSoundEffectStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    spatialAudio,
    statsForNerds,
    noiseCancellation,
    soundEffects,
    selectedMicDevice,
    selectedCameraDevice,
    selectedSpeakerDevice,
    updateNoiseCancellation,
    updateSoundEffects,
    updateSpatialAudio,
    updateStatsForNerds,
    set: setSettings,
  } = useSettingStore();

  const profileMutation = useMutation({
    mutationFn: async () => {
      try {
        await api.patch("/me/update/bio", {
          bio: newBio,
        });
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["user"] });
      appToast("Bio Updated", null, "bottom-center");
    },
    onError: async () => {
      appToast("Bio Update Failed", null, "bottom-center");
    },
  });

  const handleBioChange = async () => {
    if (user.bio !== newBio) {
      profileMutation.mutateAsync();
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
      toast.error("logout failed");
      setLogoutLoading(false);
    }
  };

  const handleMicTest = async () => {
    if (!selectedMicDevice) {
      return appToast(
        "No Mic Selected",
        <BiMicrophoneOff size={19} />,
        "bottom-center"
      );
    }

    if (isTestingMic && mediaStream) {
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
    setIsTestingAudio(!isTestingMic);
  };

  const handleAudioTest = async () => {
    setIsTestingAudio(true);
    if (!selectedSpeakerDevice) {
      return appToast(
        "No Speaker Selected",
        <BiMicrophoneOff size={19} />,
        "bottom-center"
      );
    }

    if (isTestingAudio && mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      setMediaStream(null);
      setMediaRecorder(null);
    } else {
      playSoundEffect("roomInvite");
      setTimeout(() => {
        setIsTestingAudio(false);
      }, 1000);
    }
  };

  useEffect(() => {
    (async () => {
      const microphones = await getMicrophones();
      const cameras = await getCameras();
      const speakers = await getSpeakers();

      if (!microphones || !cameras || !speakers) {
        appToast("No devices found", <BiWrench size={19} />, "bottom-center");
      }

      if (
        selectedMicDevice === "default" ||
        selectedMicDevice === "undefined"
      ) {
        setSettings({ selectedMicDevice: microphones[0].value });
      }

      if (
        selectedCameraDevice === "default" ||
        selectedCameraDevice === "undefined"
      ) {
        setSettings({ selectedCameraDevice: cameras[0].value});
      }

      if (
        selectedSpeakerDevice === "default" ||
        selectedSpeakerDevice === "undefined"
      ) {
        setSettings({ selectedSpeakerDevice: speakers[0].value });
      }

      setMicrophones(microphones);
      setCameras(cameras);
      setSpeakers(speakers);
    })();
  }, []);

  if (!user || !microphones || !cameras || !speakers) {
    return (
      <>
        <div className="mt-5 w-full  relative font-sans">
          <div
            style={{
              height: !dontShowXtra
                ? "calc(100vh - 6rem)"
                : "calc(100vh - 15rem)",
            }}
            className="chat w-full sheet overflow-auto px-5 flex items-center justify-center py-4 scrollable"
          >
            <Loader alt width={20} />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mt-5 w-full  relative font-sans">
        <div
          style={{
            height: !dontShowXtra
              ? "calc(100vh - 6rem)"
              : "calc(100vh - 15rem)",
          }}
          className="chat w-full sheet overflow-auto px-5 py-4 scrollable"
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
                  width={"sm:max-w-[600px]"}
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
              <div className="flex items-start w-full justify-between">
                <div className="flex flex-col items-staPt space-y-1 mb-5">
                  <span className="font-semibold text-[20px]">
                    {user.displayName}
                  </span>
                  <span className="font-normal text-[16px] opacity-40">
                    @{user.userName}
                  </span>
                </div>

                <div className="flex gap-2">
                  <AppDialog
                    width={"sm:max-w-[450px]"}
                    className="p-0"
                    content={<HomeCharacterCustomizer />}
                  >
                    <button className="flex items-center gap-2  text-white rounded-xl active:bg-void bg-void hover:bg-dark transition-all px-3 border border-light  py-2  outline-none focus:outline-none">
                      ✨
                    </button>
                  </AppDialog>

                  <AppDialog
                    width={"sm:max-w-[450px]"}
                    className="p-0"
                    content={<HomeKeyboardShortcuts />}
                  >
                    <button className="flex items-center gap-2  text-white rounded-xl active:bg-void bg-void hover:bg-dark transition-all px-3 border border-light  py-2  outline-none focus:outline-none">
                      🖮
                    </button>
                  </AppDialog>
                </div>
              </div>

              <Separator className="bg-light opacity-40 w-full mx-auto" />
            </div>
          </div>
          <div className="w-full space-y-1 mb-4">
            <span className="font-semibold text-[15px] flex flex-col items-start space-y-2">
              <span className="flex items-center flex-col"> About </span>
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
                  className="chat cursor-text border bg-transparent italic text-[14px] text-white outline-none  border-none w-full rounded-md hover:shadow-sm"
                  value={newBio as string}
                  onChange={(e) => {
                    setBio(e.target.value);
                  }}
                  onBlur={handleBlur}
                />
              )}
            </div>
          </div>
          <div className="space-y-3">
            <span className="font-semibold text-[15px] flex items-center">
              Devices
            </span>

            <div className="flex flex-col items-start space-y-3">
              <div className="w-full flex flex-col space-y-2">
                <div className="flex items-center gap-4">
                  <HiMicrophone size={20} />
                  <Select
                    onValueChange={(v) => {
                      setSettings({ selectedMicDevice: v });
                    }}
                    defaultValue={selectedMicDevice}
                  >
                    <SelectTrigger className="w-full px-5 py-6 rounded-xl bg-[#282b30] hover:bg-light border-none ring-0 outline-none focus:outline-none focus:ring-0">
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
                      {microphones?.map(({ value, label }) => (
                        <SelectItem
                          key={value}
                          value={value}
                          className="text-[16px] font-semibold opacity-70"
                        >
                          <span className="flex items-center text-left w-full gap-2">
                            <span className="text-[16px] font-semibold opacity-70 truncate">
                              {label}
                            </span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-4">
                  <HiMiniVideoCamera size={20} />
                  <Select
                    onValueChange={(v) => {
                      setSettings({ selectedCameraDevice: v });
                    }}
                    defaultValue={selectedCameraDevice}
                  >
                    <SelectTrigger className="w-full px-5 py-6 rounded-xl bg-[#282b30] hover:bg-light border-none ring-0 outline-none focus:outline-none focus:ring-0">
                      <SelectValue
                        placeholder={
                          <div className="flex items-center gap-2">
                            <BiCamera size={20} />
                            <span className="flex items-center gap-2">
                              <span className="text-[16px] font-semibold opacity-70 truncate">
                                Select a Camera
                              </span>
                            </span>
                          </div>
                        }
                      />
                    </SelectTrigger>

                    <SelectContent>
                      {cameras?.map(({ value, label }) => (
                        <SelectItem
                          key={value}
                          value={value}
                          className="text-[16px] font-semibold opacity-70"
                        >
                          <span className="flex items-center text-left w-full gap-2">
                            <span className="text-[16px] font-semibold text-left w-full opacity-70 truncate">
                              {label}
                            </span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-4">
                  <HiMiniSpeakerWave size={20} />
                  <Select
                    onValueChange={(v) => {
                      setSettings({ selectedSpeakerDevice: v });
                    }}
                    defaultValue={selectedSpeakerDevice}
                  >
                    <SelectTrigger className="w-full px-5 py-6 rounded-xl bg-[#282b30] hover:bg-light border-none ring-0 outline-none focus:outline-none focus:ring-0">
                      <SelectValue
                        placeholder={
                          <div className="flex items-center gap-2">
                            <BiSpeaker size={20} />
                            <span className="flex items-center gap-2">
                              <span className="text-[16px] font-semibold opacity-70 truncate">
                                Select a Speaker
                              </span>
                            </span>
                          </div>
                        }
                      />
                    </SelectTrigger>

                    <SelectContent>
                      {speakers?.map(({ value, label }) => (
                        <SelectItem
                          key={value}
                          value={value}
                          className="text-[16px] font-semibold opacity-70"
                        >
                          <span className="flex items-start text-left w-full gap-2">
                            <span className="text-[16px] font-semibold text-left opacity-70 truncate">
                              {label}
                            </span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between w-full flex-col">
                  <span className="text-[13px] opacity-30 ">
                    Control your audio & video input
                  </span>

                  {!isTestingMic || !isTestingAudio ? (
                    <div className="flex items-center gap-5">
                      <button
                        className="flex items-center gap-2 opacity-100  text-blue-600 rounded-xl  py-3 outline-none focus:outline-none"
                        onClick={() => {
                          handleMicTest();
                          setIsTestingMic(true);
                        }}
                      >
                        <BsWrench />
                        Test Mic
                      </button>

                      <button
                        className="flex items-center gap-2 opacity-100  text-blue-600 rounded-xl  py-3 outline-none focus:outline-none"
                        onClick={() => {
                          handleAudioTest();
                        }}
                      >
                        {isTestingAudio ? (
                          <>
                            <BsSoundwave />
                            Testing Audio
                            <Loader alt width={13} />
                          </>
                        ) : (
                          <>
                            <BsSoundwave />
                            Test Audio
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <button
                        className="flex items-center gap-2 opacity-100  text-blue-600 rounded-xl  py-3 outline-none focus:outline-none"
                        onClick={() => {
                          handleMicTest();
                          setIsTestingMic(false);
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
                          Check for playing waveforms or Fx play back (for audio
                          test)
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <span className="font-semibold text-[15px] flex items-center">
                Preferences
              </span>

              <div className="flex items-center justify-between w-full">
                <label
                  className="cursor-pointer text-sm flex flex-col items-start"
                  htmlFor="invites"
                >
                  Spatial Audio
                  <span className="opacity-30 text-[13px]">
                    Turn on to hear based on direction{" "}
                  </span>
                </label>
                <Switch
                  checked={spatialAudio}
                  onCheckedChange={() => updateSpatialAudio(!spatialAudio)}
                  id="spatial_audio"
                />
              </div>
              <div className="flex items-center justify-between w-full">
                <label
                  className="cursor-pointer flex flex-col items-start text-sm"
                  htmlFor="invites"
                >
                  Noise Cancelation
                  <span className="opacity-30 text-[13px]">
                    Enhanced audio with AI
                  </span>
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
                  className="cursor-pointer text-sm flex flex-col items-start"
                  htmlFor="sound-effects"
                >
                  Sound FX
                  <span className="opacity-30 text-[13px]">
                    Enable/Disable sound effects
                  </span>
                </label>
                <Switch
                  checked={soundEffects}
                  onCheckedChange={() => updateSoundEffects(!soundEffects)}
                  id="sound-effects"
                />
              </div>

              <div className="flex items-center justify-between w-full">
                <label
                  className="cursor-pointer text-sm flex flex-col items-start"
                  htmlFor="sound-effects"
                >
                  Debug Mode
                  <span className="opacity-30 text-[13px]">
                    Show extra stats for nerds
                  </span>
                </label>
                <Switch
                  checked={statsForNerds}
                  onCheckedChange={() => updateStatsForNerds(!statsForNerds)}
                  id="stats_for_nerds"
                />
              </div>
            </div>
          </div>

          {!dontShowXtra && (
            <div className="w-full mt-6 space-y-3">
              <Button
                disabled={logoutLoading}
                onClick={async () => {
                  await handleLogout();
                }}
                className="w-full rounded-lg flex-1 py-1 px-2 bg-appRed"
              >
                {logoutLoading ? (
                  <Loader alt={true} width={15} />
                ) : (
                  <>
                    <CgLogOut size={20} className="mr-2" />
                    Logout
                  </>
                )}
              </Button>

              {/* <Button
                onClick={() => setSheetOpen(false)}
                className="rounded-sm flex-1 py-1 px-2 bg-light w-full shadow-app_shadow"
              >
                Close
              </Button> */}
            </div>
          )}
        </div>

        <div className="absolute px-5 py-6 w-full flex items-center justify-between">
          <h1 className="font-logo text-[1.5rem] leading-[2.3rem] opacity-10 flex items-center relative">
            <Logo withLogo={false} size="sm" />
          </h1>
          {!dontShowXtra && false && (
            <div className="flex items-center space-x-10  leading=[2.3em]">
              <a className="text-sm flex items-center text-[#424549] ">
                <GitBranch className="mr-1" color="#424549" size={17} />
                v.1.0.0
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
