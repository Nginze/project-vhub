import { TransportOptions } from "mediasoup-client/lib/types";
import { useVoiceStore } from "../store/VoiceStore";
import { RTC_MESSAGE, WS_MESSAGE } from "@/engine/2d-renderer/events";
// import { useRTCStore } from "../store/useRTCStore";
// import { useProducerStore } from "../store/useProducerStore";

export async function createTransport(
  conn: any,
  _roomId: string,
  userid: string,
  direction: "recv" | "send",
  transportOptions: TransportOptions
) {
  console.log(`[LOGGING]: Creating my ${direction} transport`);

  const { device, set, roomId } = useVoiceStore.getState();

  console.log("[LOGGING]: Transport options (from MS)", transportOptions);

  const transport =
    direction === "recv"
      ? await device!.createRecvTransport(transportOptions)
      : await device!.createSendTransport(transportOptions);

  transport.on("connect", ({ dtlsParameters }, callback, errback) => {
    conn.emit(
      WS_MESSAGE.RTC_WS_CONNECT_TRANSPORT,
      {
        roomId,
        transportId: transportOptions.id,
        dtlsParameters,
        peerId: userid,
        direction,
      },
      () => callback()
    );
  });

  if (direction === "send") {
    // sending transports will emit a produce event when a new track
    // needs to be set up to start sending. the producer's appData is
    // passed as a parameter
    transport.on(
      "produce",
      ({ kind, rtpParameters, appData }, callback, errback) => {
        console.log("[LOGGING]: Transport produce event", appData.mediaTag);
        // we may want to start out paused (if the checkboxes in the ui
        // aren't checked, for each media type. not very clean code, here
        // but, you know, this isn't a real application.)
        // let paused = false;
        // if (appData.mediaTag === "cam-video") {
        //   paused = getCamPausedState();
        // } else if (appData.mediaTag === "cam-audio") {
        //   paused = getMicPausedState();
        // }
        // tell the server what it needs to know from us in order to set
        // up a server-side producer object, and get back a
        // producer.id. call callback() on success or errback() on
        // failure.
        conn.once(RTC_MESSAGE.RTC_MS_SEND_SEND_TRACK_DONE, (d: any) => {
          console.log("[LOGGING]: @send-track-done");
          callback({ id: d.id });
        });


        console.log("testing us erid", userid)
        conn.emit(
          WS_MESSAGE.RTC_WS_SEND_TRACK,
          {
            roomId,
            peerId: userid,
            transportId: transportOptions.id,
            kind,
            rtpParameters,
            rtpCapabilities: device!.rtpCapabilities,
            paused: false,
            appData,
            direction,
          },
          (id: any) => callback({ id })
        );
      }
    );
  }

  // for this simple demo, any time a transport transitions to closed,
  // failed, or disconnected, leave the room and reset

  transport.on("connectionstatechange", (state) => {
    console.log(
      `[LOGGING]: ${direction} transport ${transport.id} connectionstatechange ${state}`
    );
  });

  if (direction === "recv") {
    set({ recvTransport: transport });
  } else {
    set({ sendTransport: transport });
  }
}
