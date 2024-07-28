import { api } from "@/api";
import { Button } from "@/components/ui/button";
import { userContext } from "@/context/UserContext";
import { WebSocketContext } from "@/context/WsContext";
import { useQueryClient } from "@tanstack/react-query";
import { Check, X } from "lucide-react";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useConsumerStore } from "../rtc/store/ConsumerStore";
import { useMediaStore } from "../rtc/store/MediaStore";
import { useProducerStore } from "../rtc/store/ProducerStore";
import { RoomParticipant } from "../../../../shared/types";
import { RTC_MESSAGE, WS_MESSAGE } from "../2d-renderer/events";

type Props = {
  children: React.ReactNode;
};

export const MainWsHandler = ({ children }: Props) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { userLoading, user } = useContext(userContext);
  const { conn } = useContext(WebSocketContext);

  const { nullify, mic, vid, screenMic, screenVid } = useMediaStore();
  const { closeAll } = useConsumerStore();
  const { close } = useProducerStore();
  const { proximityList } = useConsumerStore();

  useEffect(() => {
    if (!conn) {
      return;
    }

    conn.on("active-speaker-change", ({ userId, roomId, status }) => {
      if (status == "speaking") {
        queryClient.setQueryData(["room"], (data: any) => ({
          ...data,
          participants: data?.participants.map((p: RoomParticipant) =>
            p.userId === userId
              ? {
                  ...p,
                  indicatorOn:
                    p.isSpeaker || data.creatorId === userId ? true : false,
                }
              : p
          ),
        }));
      } else {
        queryClient.setQueryData(["room"], (data: any) => ({
          ...data,
          participants: data?.participants.map((p: RoomParticipant) =>
            p.userId === userId
              ? {
                  ...p,
                  indicatorOn: false,
                }
              : p
          ),
        }));
      }
    });

    conn.on("new-user-joined-room", ({ user, roomId }) => {
      console.log("new user joined fired");
      queryClient.setQueryData(["room"], (data: any) => {
        const exists = data?.participants.some(
          (p: RoomParticipant) => p.userId === user.userId
        );
        if (!exists) {
          return {
            ...data,
            participants: [...data.participants, user],
          };
        } else {
          return data;
        }
      });
    });

    conn.on("mute-changed", ({ userId, roomId }) => {
      console.log("User muted mic");
      queryClient.setQueryData(["room"], (data: any) => ({
        ...data,
        participants: data?.participants.map((p: RoomParticipant) =>
          p.userId === userId
            ? {
                ...p,
                isMuted: !p.isMuted,
              }
            : p
        ),
      }));
    });

    conn.on("video-changed", ({ userId, roomId }) => {
      console.log("User toggled vid");
      queryClient.setQueryData(["room"], (data: any) => ({
        ...data,
        participants: data?.participants.map((p: RoomParticipant) =>
          p.userId === userId
            ? {
                ...p,
                isVideoOff: !p.isVideoOff,
              }
            : p
        ),
      }));
    });

    conn.on("mod-added", ({ userId, roomId }) => {
      console.log("user promoted to mod");
      queryClient.setQueryData(["room"], (data: any) => ({
        ...data,
        participants: data?.participants.map((p: RoomParticipant) =>
          p.userId === userId
            ? {
                ...p,
                isMod: true,
              }
            : p
        ),
      }));
    });

    conn.on("mod-removed", ({ userId, roomId }) => {
      console.log("user demoted from mod");
      queryClient.setQueryData(["room"], (data: any) => ({
        ...data,
        participants: data?.participants.map((p: RoomParticipant) =>
          p.userId === userId
            ? {
                ...p,
                isMod: false,
              }
            : p
        ),
      }));
    });

    conn.on("you-are-now-a-mod", ({ roomId }) => {
      console.log("i am now a mod");
      queryClient.setQueryData(["room-status", roomId], (data: any) => ({
        ...data,
        isMod: true,
      }));
    });

    conn.on("you-are-no-longer-a-mod", ({ roomId }) => {
      queryClient.setQueryData(["room-status", roomId], (data: any) => ({
        ...data,
        isMod: false,
      }));
    });

    conn.on("toggle-room-chat", ({ roomId }) => {
      console.log("chat is about to be toggled");
      queryClient.setQueryData(["room"], (data: any) => ({
        ...data,
        chatEnabled: !data.chatEnabled,
      }));
    });

    conn.on("toggle-hand-raise-enabled", ({ roomId }) => {
      console.log("handraise is about to be toggled");
      queryClient.setQueryData(["room"], (data: any) => ({
        ...data,
        handRaiseEnabled: !data.handRaiseEnabled,
      }));
    });

    conn.on("invalidate-feed", async () => {
      console.log("invalidating feed");
      try {
        await queryClient.refetchQueries({
          queryKey: ["rooms-public"],
          exact: true,
        });
      } catch (error) {
        console.error('Error refetching "rooms-public":', error);
      }
      try {
        await queryClient.invalidateQueries({ queryKey: ["user"] });
      } catch (error) {
        console.error('Error invalidating "user":', error);
      }
      queryClient.removeQueries({ queryKey: ["room"] });
      queryClient.removeQueries({ queryKey: ["room-status"] });
    });

    conn.on(WS_MESSAGE.WS_PARTICIPANT_LEFT, ({ roomId, participantId }) => {
      console.log("[MainWSHandler]: participant left");
      queryClient.setQueryData(["room"], (data: any) => ({
        ...data,
        participants: data?.participants.filter(
          (p: RoomParticipant) => p.userId !== participantId
        ),
      }));
      proximityList.delete(participantId);
    });


    return () => {
      conn.off("mod-added");
      conn.off("you-are-now-a-mod");
      conn.off("active-speaker-change");
      conn.off("room-destroyed");
      conn.off("speaker-removed");
      conn.off("speaker-added");
      conn.off("user-left-room");
      conn.off("new-user-joined-room");
      conn.off("hand-raised");
      conn.off("hand-down");
      conn.off("mute-changed");
      conn.off("add-speaker-permissions");
      conn.off("remove-speaker-permissions");
      conn.off("invalidate-participants");
      conn.off("toggle-room-chat");
      conn.off("toggle-hand-raise-enabled");
      conn.off("leave-room-all");
      conn.off("leave-room");
      conn.off("invalidate-feed");
      conn.off("room-invite");
      conn.off("ban-list-change");
      conn.off("kicked-from-room");
    };
  }, [conn, userLoading]);
  return <>{children}</>;
};
