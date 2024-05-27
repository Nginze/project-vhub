import hark from "hark";
import { useContext, useEffect } from "react";
import { useVoiceStore } from "../store/VoiceStore";
import { userContext } from "@/context/UserContext";
import { WebSocketContext } from "@/context/WsContext";
import { WS_MESSAGE } from "@/engine/2d-renderer/events";

interface Props {}

export const ActiveSpeakerListener: React.FC<Props> = ({}) => {
  const { conn } = useContext(WebSocketContext);
  const { user, userLoading } = useContext(userContext);
  const { micStream, roomId } = useVoiceStore();

  useEffect(() => {
    if (!micStream || !conn || userLoading) {
      console.log("[LOGGING]: No mic stream or conn");
      return;
    }

    console.log("[LOGGING]: Setting up harker");

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
  }, [micStream, conn]);

  return null;
};
