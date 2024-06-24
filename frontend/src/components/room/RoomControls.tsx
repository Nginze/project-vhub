import { userContext } from "@/context/UserContext";
import { useRendererStore } from "@/engine/2d-renderer/store/RendererStore";
import { useMediaStore } from "@/engine/rtc/store/MediaStore";
import { useRoomStore } from "@/global-store/RoomStore";
import { REACTIONS_MAP, _REACTION_MAP } from "@/lib/emoji";
import { ReactionBarSelector } from "@charkour/react-reactions";
import { useRouter } from "next/router";
import React, { useContext } from "react";
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
import { parseCamel } from "@/lib/utils";
import { WebSocketContext } from "@/context/WsContext";
import { Socket } from "socket.io-client";
import AppDialog from "../global/AppDialog";
import { RoomLeaveConfirmation } from "./RoomLeaveConfirmation";

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
  const { user } = useContext(userContext);
  const { set } = useRoomStore();
  const { scene } = useRendererStore();
  const { mic, vid, set: setMedia } = useMediaStore();

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
    <div className="w-full py-4 flex items-center">
      <div className="w-full mx-10 flex items-center justify-between">
        <div className="flex flex-col items-start opacity-80">
          <Logo withLogo={false} size="sm" />
          <span className="text-[9px] opacity-60">{roomId}</span>
        </div>
        <div className="flex items-center gap-5 px-5 py-3 bg-void rounded-full shadow-appShadow relative">
          <div className="flex items-center gap-3">
            <div>
              <Avatar className="w-8 h-8 cursor-pointer">
                <AvatarImage
                  className="object-cover"
                  src={user.avatarUrl as string}
                />
                <AvatarFallback />
              </Avatar>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[12px] opacity-70 font-body font-semibold">
                {user.userName}
              </span>
              <span className="text-[11px] opacity-70">Online</span>
            </div>
          </div>
          <Separator
            orientation="vertical"
            className="h-10 opacity-30  bg-veryLight"
          />
          <RoomMediaControlButton
            isOn={!myRoomStatus.isMuted as boolean}
            iconOn={<BiSolidMicrophone size={22} color="white" fill="white" />}
            iconOff={
              <BiSolidMicrophoneOff size={22} color="white" fill="white" />
            }
            tooltipText="Micorphone"
            onClick={async () => {
              await handleMute();
            }}
          />
          <RoomMediaControlButton
            isOn={!myRoomStatus.isVideoOff as boolean}
            iconOn={<BiSolidVideo size={22} color="white" fill="white" />}
            iconOff={<BiSolidVideoOff size={22} color="white" fill="white" />}
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
                      scene.players.get(user.userId as string)?.showReaction();
                    }}
                    reactions={REACTIONS_MAP}
                    iconSize={15}
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

          <AppSheet
            content={<RoomSheet room={room} />}
            title={<span>People</span>}
          >
            <RoomMediaControlButton
              onClick={() => {
                set((s) => ({ roomSheetOpen: !s.roomSheetOpen }));
              }}
              tooltipText="Settings"
              iconOn={<FaPeopleGroup size={24} color="white" />}
              iconOff={<FaPeopleGroup size={24} color="white" />}
            />
          </AppSheet>

          {/* <RoomMediaControlButton
            tooltipText="Settings"
            iconOn={<IoIosSettings size={24} color="white" />}
            iconOff={<IoIosSettings size={24} color="white" />}
          /> */}

          <AppDialog
            width={"sm:max-w-[450px]"}
            content={<RoomLeaveConfirmation />}
          >
            <RoomMediaControlButton
              tooltipText="Leave"
              iconOn={<BiExit size={24} />}
              iconOff={<BiExit size={24} />}
              bgColor="bg-appRed/90"
              textColor="text-white"
            />
          </AppDialog>
        </div>
        <div className="w-10"></div>
      </div>
    </div>
  );
};
