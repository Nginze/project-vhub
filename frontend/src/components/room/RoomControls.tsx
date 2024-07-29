import { userContext } from "@/context/UserContext";
import { useRendererStore } from "@/engine/2d-renderer/store/RendererStore";
import { useMediaStore } from "@/engine/rtc/store/MediaStore";
import { useRoomStore } from "@/global-store/RoomStore";
import { REACTIONS_MAP, _REACTION_MAP } from "@/lib/emoji";
import { ReactionBarSelector } from "@charkour/react-reactions";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import {
  BiExit,
  BiSolidMicrophone,
  BiSolidMicrophoneOff,
  BiSolidVideo,
  BiSolidVideoOff,
} from "react-icons/bi";
import { FaPeopleGroup } from "react-icons/fa6";
import { HiMicrophone } from "react-icons/hi2";
import { VscReactions } from "react-icons/vsc";
import { Room, RoomStatus } from "../../../../shared/types";
import { AppSheet } from "../global/AppSheet";
import { Logo } from "../global/Logo";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";
import { RoomMediaControlButton } from "./RoomMediaControlButton";
import { RoomReactionsButton } from "./RoomReactionsButton";
import { RoomSheet } from "./RoomSheet";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api";
import { getSpritePreview, parseCamel } from "@/lib/utils";
import { WebSocketContext } from "@/context/WsContext";
import { Socket } from "socket.io-client";
import AppDialog from "../global/AppDialog";
import { RoomLeaveConfirmation } from "./RoomLeaveConfirmation";
import { HomeProfileSheet } from "../home/HomeProfileSheet";
import { useSettingStore } from "@/global-store/SettingStore";
import { useSoundEffectStore } from "@/global-store/SoundFxStore";
import { useUIStore } from "@/global-store/UIStore";
import { RoomGlobalChatSheet } from "./RoomGlobalChatSheet";
import { RoomZoomControls } from "./RoomZoomControls";
import { Check, Monitor, Smile } from "lucide-react";
import { FaHandPaper, FaSmile } from "react-icons/fa";
import { RiUserShared2Fill } from "react-icons/ri";
import { IoHandRightSharp } from "react-icons/io5";

type RoomControlsProps = {
  room: Room;
  conn: Socket;
  myRoomStatus: RoomStatus;
  roomId: String;
};

export const RoomControls: React.FC<RoomControlsProps> = ({
  room,
  roomId,
  myRoomStatus,
  conn,
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { localStream } = useMediaStore();
  const { user } = useContext(userContext);
  const { set } = useRoomStore();
  const { scene } = useRendererStore();
  const { mic, vid, set: setMedia } = useMediaStore();
  const { playSoundEffect } = useSoundEffectStore();
  const { set: setUI, sheetOpen, activeRoomSheet } = useUIStore();

  const [spritePreviewUrl, setSpritePreviewUrl] = useState<string>("");

  useEffect(() => {
    console.log(spritePreviewUrl);
    getSpritePreview(3, user).then((previewUrl) =>
      setSpritePreviewUrl(previewUrl as string)
    );
  }, [user, router]);

  const statusMutation = useMutation({
    mutationFn: async (params: {
      state: string;
      value: boolean;
      userId: string;
    }) => {
      await api.put(
        `/room/room-status/update/${params.userId}?state=${params.state}&value=${params.value}&roomId=${roomId}`
      );
    },

    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ["room-status", roomId] });

      const previousRoomStatus = queryClient.getQueryData([
        "room-status",
        roomId,
      ]);

      if (variables.userId === user.userId) {
        queryClient.setQueryData(["room-status", roomId], (data: any) => ({
          ...data,
          [parseCamel(variables.state)]: variables.value,
        }));
      }

      return { previousRoomStatus };
    },

    onSuccess: () => {},

    onError: (error, variables, context) => {
      if (variables.userId === user.userId) {
        queryClient.setQueryData(
          ["room-status", roomId],
          context!.previousRoomStatus
        );
      }
    },
  });

  const handleMute = async () => {
    if (!conn || !mic) {
      console.log("no conn or mic", conn, mic);
      return;
    }

    const event = myRoomStatus.isMuted ? "action:unmute" : "action:mute";
    // myRoomStatus.isMuted ? playSoundEffect("unmute") : playSoundEffect("mute");
    event === "action:mute"
      ? playSoundEffect("mute")
      : playSoundEffect("unmute");

    conn.emit(event, { roomId, userId: user.userId });
    mic?.enabled ? (mic.enabled = false) : (mic.enabled = true);

    try {
      statusMutation.mutateAsync({
        state: "is_muted",
        value: !myRoomStatus.isMuted,
        userId: user.userId as string,
      });
    } catch (err) {}
  };

  const handleVideo = async () => {
    if (!conn || !vid) {
      return;
    }
    const event = myRoomStatus.isVideoOff
      ? "action:videoOn"
      : "action:videoOff";

    event === "action:videoOff"
      ? playSoundEffect("mute")
      : playSoundEffect("unmute");

    conn.emit(event, { roomId, userId: user.userId });
    vid?.enabled ? (vid.enabled = false) : (vid.enabled = true);

    try {
      statusMutation.mutateAsync({
        state: "is_video_off",
        value: !myRoomStatus.isVideoOff,
        userId: user.userId as string,
      });
    } catch (err) {}
  };

  return (
    <>
      <RoomZoomControls />
      <div className="w-full py-4 flex items-center">
        <div className="w-full px-10 flex items-center justify-between">
          {/* <div className="flex flex-col items-start opacity-80">
            <Logo withLogo={false} size="sm" />
            <span className="text-[9px] opacity-60">{roomId}</span>
          </div> */}

          <div className="flex-1 flex justify-center">
            <div className="flex items-center pr-5 p-0.5 bg-ultra shadow-canvasShadow overflow-hidden rounded-full relative">
              <AppDialog
                width={"sm:max-w-[450px]"}
                className="p-0 pb-5"
                height={"sm:max-h-auto h-auto"}
                content={
                  <HomeProfileSheet
                    setSheetOpen={() => {}}
                    dontShowXtra={true}
                  />
                }
              >
                <div className="flex items-center gap-3 px-5 py-3 hover:bg-dark active:bg-deep cursor-pointer w-[180px]">
                  <div className="relative">
                    <Avatar className="w-8 h-8 cursor-pointer">
                      <AvatarImage
                        className="object-cover"
                        src={spritePreviewUrl as string}
                      />
                      <AvatarFallback />
                    </Avatar>
                    <div className="bg-appGreen p-0.5 border border-light absolute bottom-0 -right-1 rounded-full">
                      <Check size={10} />
                    </div>
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-[12px] opacity-70 font-body font-semibold">
                      {user.userName}
                    </span>
                    <span className="text-[11px] opacity-70">Online</span>
                  </div>
                </div>
              </AppDialog>
              <Separator
                orientation="vertical"
                className="h-10 opacity-30 mr-5 bg-veryLight"
              />
              <div className="flex items-center p-0.5 gap-2 bg-void overflow-hidden rounded-full">
                {/* <RoomMediaControlButton
                  isOn={!myRoomStatus.isMuted as boolean}
                  isLoading={!localStream || !localStream.active}
                  iconOn={
                    <BiSolidMicrophone
                      size={22}
                      color="#43b581"
                      fill="#43b581"
                    />
                  }
                  iconOff={
                    <BiSolidMicrophoneOff
                      size={22}
                      color="#f04747"
                      fill="#f04747"
                    />
                  }
                  tooltipText="Microphone"
                  onClick={async () => {
                    await handleMute();
                  }}
                />
                <RoomMediaControlButton
                  isOn={!myRoomStatus.isVideoOff as boolean}
                  isLoading={!localStream || !localStream.active}
                  iconOn={
                    <BiSolidVideo size={22} color="#43b581" fill="#43b581" />
                  }
                  iconOff={
                    <BiSolidVideoOff size={22} color="#f04747" fill="#f04747" />
                  }
                  tooltipText="Camera"
                  onClick={async () => {
                    await handleVideo();
                  }}
                />
                <div>
                  <RoomReactionsButton
                    tooltipText="Emote"
                    iconOff={<VscReactions size={24} color="white" />}
                    iconOn={
                      <div className="flex items-center">
                        <VscReactions size={24} color="white" />
                        <ReactionBarSelector
                          onSelect={(reaction: string) => {
                            console.log(reaction);
                            set((s) => ({
                              //@ts-ignore
                              currentReaction: _REACTION_MAP[reaction],
                            }));
                            scene.players
                              .get(user.userId as string)
                              ?.showReaction();
                          }}
                          reactions={REACTIONS_MAP}
                          iconSize={17}
                          style={{
                            background: "transparent",
                            boxShadow: "none",
                            padding: "0",
                            margin: "0",
                            boxSizing: "border-box",
                          }}
                        />
                      </div>
                    }
                  />
                </div> */}

                <AppSheet
                  open={sheetOpen}
                  onOpenChange={(open: boolean) =>
                    setUI({ sheetOpen: !sheetOpen })
                  }
                  className=""
                  content={
                    activeRoomSheet == "participant" ? (
                      <RoomSheet room={room} />
                    ) : (
                      <RoomGlobalChatSheet room={room} />
                    )
                  }
                  title={<span>People</span>}
                >
                  <RoomMediaControlButton
                    bgColor="bg-ultra"
                    onClick={() => {
                      set((s) => ({ roomSheetOpen: !s.roomSheetOpen }));
                    }}
                    tooltipText="Settings"
                    iconOn={<RiUserShared2Fill size={24} color="white" />}
                    iconOff={<RiUserShared2Fill size={24} color="white" />}
                  />
                </AppSheet>

                {/* <AppDialog
                  width={"sm:max-w-[450px]"}
                  content={<RoomLeaveConfirmation />}
                >
                  <RoomMediaControlButton
                    useDefaultBg
                    onClick={() => {}}
                    tooltipText="Leave"
                    iconOn={<BiExit size={24} color="white" />}
                    iconOff={<BiExit size={24} color="white" />}
                  />
                </AppDialog> */}

                <RoomMediaControlButton
                  bgColor="bg-ultra"
                  onClick={() => {}}
                  tooltipText="Share Screen"
                  iconOn={<Monitor size={26} color="white" />}
                  iconOff={<Monitor size={26} color="white" />}
                />

                <RoomMediaControlButton
                  bgColor="bg-ultra"
                  onClick={() => {}}
                  tooltipText="Raise Hand"
                  iconOn={<FaHandPaper size={24} color="white" />}
                  iconOff={<FaHandPaper size={24} color="white" />}
                />
                <div>
                  <RoomReactionsButton
                    bgColor="bg-ultra"
                    tooltipText="Emote"
                    iconOff={<FaSmile size={24} color="white" />}
                    iconOn={
                      <div className="flex items-center">
                        <FaSmile size={24} color="white" />
                        <ReactionBarSelector
                          onSelect={(reaction: string) => {
                            console.log(reaction);
                            set((s) => ({
                              //@ts-ignore
                              currentReaction: _REACTION_MAP[reaction],
                            }));
                            scene.players
                              .get(user.userId as string)
                              ?.showReaction();
                          }}
                          reactions={REACTIONS_MAP}
                          iconSize={17}
                          style={{
                            background: "transparent",
                            boxShadow: "none",
                            padding: "0",
                            margin: "0",
                            boxSizing: "border-box",
                          }}
                        />
                      </div>
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
