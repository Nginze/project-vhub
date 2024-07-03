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

type RoomProps = {};

const RoomPage: React.FC<RoomProps> = () => {
  const router = useRouter();
  const hasJoined = useRef<boolean>(false);

  const { id: roomId } = router.query;
  const { conn } = useContext(WebSocketContext);
  const { user } = useContext(userContext);
  const { set, ready, whiteboardStore, currentWhiteboardId } =
    useRendererStore();
  const { set: setRoom } = useRoomStore();
  const { roomIframeOpen } = useRoomStore();
  const { localStream } = useMediaStore();

  const { room, roomLoading, roomStatus, roomStatusLoading } = useLoadRoomMeta(
    roomId as string,
    user,
    hasJoined.current
  );

  useEffect(() => {
    if (!roomId || !room || !roomStatus) {
      return;
    }

    set({ currentRoomId: roomId as string });
    set({ room: room });
    set({ roomStatus: roomStatus });
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

    // for regular room join
    conn.emit(WS_MESSAGE.WS_ROOM_JOIN, {
      roomId: roomId,
      roomMeta: {
        isAutospeaker: room.autoSpeaker,
        isCreator: room.creatorId === user.userId,
        posX: roomStatus.posX,
        posY: roomStatus.posY,
        dir: roomStatus.dir,
        skin: roomStatus.skin,
      },
    });

    console.log("Emit to server");
    hasJoined.current = true;
  }, [roomId, roomStatus, conn]);

  if (room == "404") {
    return <div>Room not found</div>;
  }

  return room && roomStatus && localStream && localStream.active ? (
    <>
      <RoomLayout
        room={room}
        canvas={
          <div className="flex flex-row items-center">
            <TwoDViewComponent />
          </div>
        }
        footer={
          <RoomControls
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
        content={<AppIFrame room={room} />}
        className="px-0 rounded-none bg-black h-screen"
      >
        <></>
      </AppDialog>
      <MyContextMenu />
    </>
  ) : (
    <>
      <Grid />
      <div className="w-screen h-screen flex items-center justify-center bg-void">
        <div className="flex flex-col space-y-5 items-center">
          <div className="flex items-center justify-center">
            <img src="/login_infog.png" className="w-2/4" />
          </div>
          <div className="animate-bounce">
            <Logo size="md" withLogo />
          </div>
        </div>

        <div className="text-[12px] opacity-30 font-logo w-[500px] text-center absolute bottom-5">
          By Joining Holoverse you agree to the Terms of Service and Privacy
          Policy, and confirm you are 18 and over
        </div>
      </div>
    </>
  );
};

export default RoomPage;
