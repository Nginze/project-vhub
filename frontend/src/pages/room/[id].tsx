import { userContext } from "@/context/UserContext";
import { WebSocketContext } from "@/context/WsContext";
import { TwoDViewComponent } from "@/engine/2d-renderer/components/2DViewComponent";
import { useLoadRoomMeta } from "@/hooks/useLoadRoomMeta";
import { useRendererStore } from "@/store/RendererStore";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useRef } from "react";

type RoomProps = {};

const Room: React.FC<RoomProps> = () => {
  const router = useRouter();
  const hasJoined = useRef<boolean>(false);

  const { id: roomId } = router.query;
  const { conn } = useContext(WebSocketContext);
  const { user } = useContext(userContext);
  const { set } = useRendererStore();

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

    // conn.emit("room:join", {
    //   roomId,
    //   roomMeta: {
    //     isAutospeaker: room!.autoSpeaker,
    //     isCreator: room!.creatorId === user.userId,
    //   },
    // });
  }, [roomId, room, conn]);

  if (room == "404") {
    return <div>Room not found</div>;
  }

  return room ? (
    <TwoDViewComponent />
  ) : (
    <div className="w-screen h-screen flex items-center justify-center">
      Loading...
    </div>
  );
};

export default Room;
