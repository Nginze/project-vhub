import hark from "hark";
import { useContext, useEffect } from "react";
import { useVoiceStore } from "../store/VoiceStore";
import { useProducerStore } from "../store/ProducerStore";
import { userContext } from "@/context/UserContext";
import { WebSocketContext } from "@/context/WsContext";

interface Props {}

export const ActiveSpeakerListener: React.FC<Props> = ({}) => {
  const { conn } = useContext(WebSocketContext);
  const { micStream, roomId } = useVoiceStore();
  const { producer } = useProducerStore();

  const { user, userLoading } = useContext(userContext);

  useEffect(() => {
    if (!micStream || !conn || userLoading) {
      return;
    }

    const harker = hark(micStream);

    harker.on("speaking", () => {
      conn.emit("presence:speaking", { userId: user.userId, roomId });
    });

    harker.on("stopped_speaking", () => {
      conn.emit("presence:not_speaking", { userId: user.userId, roomId });
    });

    return () => {
      harker.stop();
    };
  }, [micStream, conn]);

  return null;
};
