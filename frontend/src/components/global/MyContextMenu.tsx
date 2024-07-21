import React, { useContext } from "react";
import {
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenu,
} from "../ui/context-menu";
import { FaClockRotateLeft } from "react-icons/fa6";
import { PiShirtFoldedDuotone } from "react-icons/pi";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { userContext } from "@/context/UserContext";
import { Shirt, UserRoundCog } from "lucide-react";
import {
  BiExit,
  BiSolidMicrophone,
  BiSolidMicrophoneOff,
  BiSolidVideo,
  BiSolidVideoOff,
} from "react-icons/bi";
import { Separator } from "../ui/separator";
import { BsFillGearFill } from "react-icons/bs";
import AppDialog from "./AppDialog";
import { HomeCharacterCustomizer } from "../home/HomeCharacterCustomizer";
import { api } from "@/api";
import { useRendererStore } from "@/engine/2d-renderer/store/RendererStore";
import { useMediaStore } from "@/engine/rtc/store/MediaStore";
import { useRoomStore } from "@/global-store/RoomStore";
import { useSoundEffectStore } from "@/global-store/SoundFxStore";
import { parseCamel } from "@/lib/utils";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { Room, RoomStatus } from "../../../../shared/types";
import { Socket } from "socket.io-client";

type MyContextMenuProps = {
  room: Room;
  conn: Socket;
  myRoomStatus: RoomStatus;
  roomId: String;
};

export const MyContextMenu: React.FC<MyContextMenuProps> = ({
  room,
  conn,
  myRoomStatus,
  roomId,
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { localStream } = useMediaStore();
  const { user } = useContext(userContext);
  const { set } = useRoomStore();
  const { scene } = useRendererStore();
  const { mic, vid, set: setMedia } = useMediaStore();
  const { playSoundEffect } = useSoundEffectStore();

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
      <ContextMenu>
        <ContextMenuTrigger>
          <div id="ctx-menu-trigger"></div>
        </ContextMenuTrigger>
        <ContextMenuContent className="bg-dark border border-light font-sans text-white rounded-xl w-[200px]">
          <ContextMenuItem className="cursor-pointer py-2 px-3 gap-4 rounded-xl focus:bg-light focus:text-white text-[16px]">
            <UserRoundCog size={16} className=" opacity-70" />
            <span className="opacity-70 font-semibold">Edit Skin</span>
          </ContextMenuItem>

          <ContextMenuItem
            onClick={() => {
              handleMute();
            }}
            className="cursor-pointer py-2 px-3 gap-4 rounded-xl focus:bg-light focus:text-white text-[16px]"
          >
            {mic?.enabled ? (
              <>
                <BiSolidMicrophoneOff className="opacity-70 " size={16} />
                <span className="opacity-70 font-semibold">Mute </span>
              </>
            ) : (
              <>
                <BiSolidMicrophone className="opacity-70 " size={16} />
                <span className="opacity-70 font-semibold">Unmute</span>
              </>
            )}
          </ContextMenuItem>

          <ContextMenuItem
            onClick={() => {
              handleVideo();
            }}
            className="cursor-pointer py-2 px-3 rounded-xl gap-4 focus:bg-light focus:text-white text-[16px]"
          >
            {vid?.enabled ? (
              <>
                <BiSolidVideoOff className="opacity-70 " size={16} />
                <span className="opacity-70 font-semibold">Video Off</span>
              </>
            ) : (
              <>
                <BiSolidVideo className="opacity-70 " size={16} />
                <span className="opacity-70 font-semibold">Video On</span>
              </>
            )}
          </ContextMenuItem>
          <Separator className="bg-black w-full mx-auto" />
          <ContextMenuItem className="cursor-pointer py-2 px-3 gap-4 rounded-xl focus:bg-light focus:text-white text-[16px]">
            <BsFillGearFill className="opacity-70 " size={16} />
            <span className="opacity-70 font-semibold">Settings</span>
          </ContextMenuItem>
          <ContextMenuItem className="cursor-pointer py-2 px-3 gap-4 rounded-xl focus:bg-light focus:text-white text-[16px]">
            <BiExit className="opacity-70 " size={16} />
            <span className="opacity-70 font-semibold">Leave Room</span>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </>
  );
};
