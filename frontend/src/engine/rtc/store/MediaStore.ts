import { Device } from "mediasoup-client";
import { detectDevice, Transport } from "mediasoup-client/lib/types";
import { create } from "zustand";
import { combine } from "zustand/middleware";

export const getDevice = () => {
  try {
    let handlerName = detectDevice();
    if (!handlerName) {
      console.warn(
        "mediasoup does not recognize this device, so ben has defaulted it to Chrome74"
      );
      handlerName = "Chrome74";
    }
    return new Device({ handlerName });
  } catch {
    return null;
  }
};

export const useMediaStore = create(
  combine(
    {
      roomId: "",

      // Local stream
      localStream: null as MediaStream | null,
      vid: null as MediaStreamTrack | null,
      mic: null as MediaStreamTrack | null,

      // Screen share stream
      screenStream: null as MediaStream | null,
      screenVid: null as MediaStreamTrack | null,
      screenMic: null as MediaStreamTrack | null,


      recvTransport: null as Transport | null,
      sendTransport: null as Transport | null,
      device: getDevice(),
    },
    (set) => ({
      nullify: () =>
        set({
          recvTransport: null,
          sendTransport: null,
          roomId: "",
          mic: null,
          vid: null,
          localStream: null,
        }),
      set,
    })
  )
);
