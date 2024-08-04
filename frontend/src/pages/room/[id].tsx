import AppDialog from "@/components/global/AppDialog";
import { AppIFrame } from "@/components/global/AppIFrame";
import { Logo } from "@/components/global/Logo";
import { MyContextMenu } from "@/components/global/MyContextMenu";
import { RoomControls } from "@/components/room/RoomControls";
import { RoomLayout } from "@/components/room/RoomLayout";
import { userContext } from "@/context/UserContext";
import { WebSocketContext } from "@/context/WsContext";
import { TwoDViewComponent } from "@/engine/2d-renderer/components/2DViewComponent";
import { WS_MESSAGE } from "@/engine/2d-renderer/events";
import { useRendererStore } from "@/engine/2d-renderer/store/RendererStore";
import { useRoomStore } from "@/global-store/RoomStore";
import { useLoadRoomMeta } from "@/hooks/useLoadRoomMeta";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useRef } from "react";
import { Room } from "../../../../shared/types";
import Whiteboard from "@/engine/2d-renderer/items/WhiteBoard";
import Loader from "@/components/global/Loader";
import { Grid } from "@/components/ui/grid";
import { useMediaStore } from "@/engine/rtc/store/MediaStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api";
import toast from "react-hot-toast";
import Head from "next/head";
import { withProtectedRoute } from "@/components/global/ProtectedRoute";
import { useUIStore } from "@/global-store/UIStore";

type RoomProps = {};

const RoomPage: React.FC<RoomProps> = () => {
  const router = useRouter();
  const hasJoined = useRef<boolean>(false);

  const { id: roomId } = router.query;
  const { conn } = useContext(WebSocketContext);
  const { user } = useContext(userContext);
  const { set, ready, whiteboardStore, currentWhiteboardId } =
    useRendererStore();
  const { set: setRoom, spaceName } = useRoomStore();
  const { roomIframeOpen } = useRoomStore();
  const { localStream } = useMediaStore();
  const { roomLoadStatusMessage } = useUIStore();

  const queryClient = useQueryClient();

  const {
    room,
    roomLoading,
    roomStatus,
    roomStatusLoading,
    chatMessages,
    chatLoading,
  } = useLoadRoomMeta(roomId as string, user, hasJoined.current);

  const profileMutation = useMutation({
    mutationFn: async (data: { spaceName: string }) => {
      try {
        const { data: res } = await api.patch("/me/update/spacename", data);
        return res;
      } catch (error) {
        console.log(error);
      }
    },

    onSuccess: async (data, variables: { spaceName: string }) => {
      console.log("Profile Updated, Space Name Set");

      await queryClient.invalidateQueries({ queryKey: ["user"] });
      await queryClient.invalidateQueries({ queryKey: ["room"] });

      // for regular room join
      conn?.emit(WS_MESSAGE.WS_ROOM_JOIN, {
        roomId: roomId,
        roomMeta: {
          isAutospeaker: room.autoSpeaker,
          isCreator: room.creatorId === user.userId,
          posX: roomStatus.posX,
          posY: roomStatus.posY,
          dir: roomStatus.dir,
          skin: roomStatus.skin,
          //@ts-ignore
          spaceName: spaceName as string,
          spriteUrl: user.spriteUrl,
        },
      });
    },

    onError: async () => {
      toast.error("Error Occured", {
        style: {
          borderRadius: "100px",
          background: "#333",
          padding: "14px",
          color: "#fff",
        },
      });

      await router.push("/home");
    },
  });
  useEffect(() => {
    if (!roomId || !room || !roomStatus) {
      return;
    }

    set({ currentRoomId: roomId as string });
    set({ room: room });
    set({ roomStatus: roomStatus });
    set({ qc: queryClient});

  }, [roomId, room, roomStatus]);

  useEffect(() => {
    if (!conn || !roomId || !room || !roomStatus || hasJoined.current) {
      return;
    }

    // should be for rtc server
    conn.emit(WS_MESSAGE.RTC_WS_JOIN_ROOM, {
      roomId,
      roomMeta: {
        isAutospeaker: true,
        isCreator: room!.creatorId === user.userId,
      },
    });

    profileMutation.mutateAsync({ spaceName });

    console.log("Emit to server");
    hasJoined.current = true;
  }, [roomId, roomStatus, conn]);

  if (room == "404") {
    return <div>Room not found</div>;
  }

  //add localstream.active for production (it blocks local tests)
  return room && roomStatus && true ? (
    <>
      <Head>
        <title>Holoverse | {room.roomName}</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
      </Head>
      <RoomLayout
        room={room}
        canvas={
          <div className="flex flex-row items-center">
            <TwoDViewComponent />
          </div>
        }
        footer={
          <RoomControls
            chatMessages={chatMessages}
            myRoomStatus={roomStatus}
            roomId={(room as Room).roomId as string}
            conn={conn!}
            room={room}
          />
        }
      />
      <AppDialog
        open={roomIframeOpen}
        onClose={() => {
          setRoom({ roomIframeOpen: false });
          const whiteboard = whiteboardStore[currentWhiteboardId] as Whiteboard;
          whiteboard.removeCurrentUser(user.userId as string);
          whiteboard.broadcastUpdate(user.userId as string, "leave");
        }}
        width={"sm:max-w-full"}
        content={
          <AppIFrame
            chatMessages={chatMessages}
            roomStatus={roomStatus}
            room={room}
          />
        }
        className="px-0 rounded-none bg-black h-screen"
      >
        <></>
      </AppDialog>
      <MyContextMenu
        myRoomStatus={roomStatus}
        roomId={(room as Room).roomId as string}
        conn={conn!}
        room={room}
      />
    </>
  ) : (
    <>
      <Grid />
      <div className="w-screen h-screen flex items-center justify-center bg-void">
        <div className="flex flex-col space-y-5 items-center">
          <div className="">
            <Logo size="md" withLogo={false} />
          </div>
          <Loader alt width={20} />
          <span className="text-[13px] opacity-50 text-white">
            {roomLoadStatusMessage}
          </span>
        </div>

        <div className="text-[12px] opacity-30 font-logo w-[500px] text-center absolute bottom-5">
          By Joining Holoverse you agree to the Terms of Service and Privacy
          Policy, and confirm you are 18 and over
        </div>
      </div>
    </>
  );
};

export default withProtectedRoute(RoomPage);
