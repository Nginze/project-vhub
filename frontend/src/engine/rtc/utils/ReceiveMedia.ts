import { Socket } from "socket.io-client";
import { useMediaStore } from "../store/MediaStore";
import { consumeAudio } from "./ConsumeAudio";
import { RTC_MESSAGE, WS_MESSAGE } from "@/engine/2d-renderer/events";

export const receiveMedia = (
  conn: Socket | null,
  flushQueue: () => void,
  userId: string
) => {
  const { roomId } = useMediaStore.getState();
  if (!conn) {
    return;
  }
  conn.once(
    RTC_MESSAGE.RTC_MS_SEND_GET_RECV_TRACKS_DONE,
    ({ consumerParametersArr }: any) => {
      console.log(
        "[LOGGING]: Received consumer parameters array",
        consumerParametersArr
      );

      try {
        for (const { userId, consumerParameters } of consumerParametersArr) {
          consumeAudio(consumerParameters, userId);
        }
      } catch (err) {
        console.log(err);
      } finally {
        flushQueue();
      }
    }
  );

  conn.emit(WS_MESSAGE.RTC_WS_GET_RECV_TRACKS, {
    rtpCapabilities: useMediaStore.getState().device!.rtpCapabilities,
    roomId,
    peerId: userId,
  });
};
