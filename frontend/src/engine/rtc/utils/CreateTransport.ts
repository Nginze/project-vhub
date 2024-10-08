import { TransportOptions } from "mediasoup-client/lib/types";
import { useMediaStore } from "../store/MediaStore";
import { RTC_MESSAGE, WS_MESSAGE } from "@/engine/2d-renderer/events";
import { useUIStore } from "@/global-store/UIStore";

export async function createTransport(
  conn: any,
  _roomId: string,
  userid: string,
  direction: "recv" | "send",
  transportOptions: TransportOptions
) {
  console.log(`[LOGGING]: Creating my ${direction} transport`);

  const { device, set, roomId } = useMediaStore.getState();
  const { set: setUI } = useUIStore.getState();

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
        console.log(
          "[LOGGING]: Transport produce event",
          appData.mediaTag,
          userid
        );

        if (
          appData.mediaTag === "screen-video" ||
          appData.mediaTag === "screen-audio"
        ) {
          conn.once(RTC_MESSAGE.RTC_MS_SEND_SEND_SCREEN_DONE, (d: any) => {
            console.log("[LOGGING]: @send-screen-done");
            // setUI({ roomLoadStatusMessage: "Track Connected" });
            callback({ id: d.id });
          });

          conn.emit(
            WS_MESSAGE.RTC_WS_SEND_SCREEN,
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
        }else {
          conn.once(RTC_MESSAGE.RTC_MS_SEND_SEND_TRACK_DONE, (d: any) => {
            console.log("[LOGGING]: @send-track-done");
            setUI({ roomLoadStatusMessage: "Track Connected" });
            callback({ id: d.id });
          });

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
      }
    );
  }

  // for this simple demo, any time a transport transitions to closed,
  // failed, or disconnected, leave the room and reset

  transport.on("connectionstatechange", (state) => {
    console.log(
      `[LOGGING]: ${direction} transport ${transport.id} connectionstatechange ${state}`
    );

    // @todo: this is a hack to get the transport to reconnect
  });

  if (direction === "recv") {
    set({ recvTransport: transport });
  } else {
    set({ sendTransport: transport });
  }
}
