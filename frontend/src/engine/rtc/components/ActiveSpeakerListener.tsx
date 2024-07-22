import hark from "hark";
import { useContext, useEffect } from "react";
import { useMediaStore } from "../store/MediaStore";
import { userContext } from "@/context/UserContext";
import { WebSocketContext } from "@/context/WsContext";
import { WS_MESSAGE } from "@/engine/2d-renderer/events";

interface Props {}

export const ActiveSpeakerListener: React.FC<Props> = ({}) => {
  const { conn } = useContext(WebSocketContext);
  const { user, userLoading } = useContext(userContext);
  const { localStream, roomId } = useMediaStore();

  useEffect(() => {
    if (!localStream || !conn || userLoading) {
      return;
    }

    // console.log("[LOGGING]: Setting up harker");

    const micStream = new MediaStream([localStream.getAudioTracks()[0]]);
    const harker = hark(micStream);

    harker.on("speaking", () => {
      console.log("[LOGGING]: Started speaking");
      conn.emit(WS_MESSAGE.WS_USER_SPEAKING, { userId: user.userId, roomId });
    });

    harker.on("stopped_speaking", () => {
      console.log("[LOGGING]: Stopped speaking");
      conn.emit(WS_MESSAGE.WS_USER_STOPPED_SPEAKING, {
        userId: user.userId,
        roomId,
      });
    });

    return () => {
      harker.stop();
    };
  }, [localStream, conn]);

  return null;
};
