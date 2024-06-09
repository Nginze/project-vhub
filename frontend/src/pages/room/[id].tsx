import { AppIFrame } from "@/components/global/AppIFrame";
import { MyContextMenu } from "@/components/global/MyContextMenu";
import { userContext } from "@/context/UserContext";
import { WebSocketContext } from "@/context/WsContext";
import { TwoDViewComponent } from "@/engine/2d-renderer/components/2DViewComponent";
import { useLoadRoomMeta } from "@/hooks/useLoadRoomMeta";
import { useRendererStore } from "@/engine/2d-renderer/store/RendererStore";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useRef } from "react";
import { RoomLayout } from "@/components/room/RoomLayout";
import { RoomControls } from "@/components/room/RoomControls";
import { WS_MESSAGE } from "@/engine/2d-renderer/events";
import { RoomSheet } from "@/components/room/RoomSheet";
import { useRoomStore } from "@/global-store/RoomStore";
import AppDialog from "@/components/global/AppDialog";
import { RoomVideoOverlay } from "@/components/room/RoomVideoOverlay";
import { Logo } from "@/components/global/Logo";
import { read } from "fs";

type RoomProps = {};

const Room: React.FC<RoomProps> = () => {
  const router = useRouter();
  const hasJoined = useRef<boolean>(false);

  const { id: roomId } = router.query;
  const { conn } = useContext(WebSocketContext);
  const { user } = useContext(userContext);
  const { set, ready } = useRendererStore();
  const { roomIframeOpen } = useRoomStore();

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
    if (!conn || !roomId || !room || hasJoined.current) {
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
  }, [roomId, room, conn]);

  if (room == "404") {
    return <div>Room not found</div>;
  }

  return room && ready ? (
    <>
      <RoomLayout
        canvas={
          <div className="flex flex-row items-center">
            <TwoDViewComponent />
          </div>
        }
        footer={<RoomControls room={room} />}
      />

      <AppDialog
        open={roomIframeOpen}
        width={"sm:max-w-full"}
        content={<AppIFrame />}
        className="px-0 rounded-none bg-black h-screen"
      >
        <></>
      </AppDialog>
      <MyContextMenu />
    </>
  ) : (
    <>
      <div className="w-screen h-screen flex items-center justify-center bg-void">
        <div className="animate-bounce">
          <Logo size="md" withLogo />
        </div>
        <div className="text-[12px] opacity-30 font-logo w-[500px] text-center absolute bottom-5">
          By Joining Holoverse you agree to the Terms of Service and Privacy
          Policy, and confirm you are 18 and over
        </div>
      </div>

      {/* <div className="hidden">
        <TwoDViewComponent />
      </div> */}
    </>
  );
};

export default Room;
