import {
  RtpCapabilities,
  RtpParameters,
} from "mediasoup-client/lib/RtpParameters";
import {
  DtlsParameters,
  Transport,
  TransportOptions,
} from "mediasoup-client/lib/Transport";
import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";
import { ActiveSpeakerListener } from "./components/ActiveSpeakerListener";
import { useVoiceStore } from "./store/VoiceStore";
import { consumeAudio } from "./utils/ConsumeAudio";
import { createTransport } from "./utils/CreateTransport";
import { joinRoom } from "./utils/JoinRoom";
import { receiveVoice } from "./utils/ReceiveVoice";
import { sendVoice } from "./utils/SendVoice";
import { userContext } from "@/context/UserContext";
import { WebSocketContext } from "@/context/WsContext";
import { AudioRenderer } from "./components/AudioRenderer";
import { RTC_MESSAGE } from "../2d-renderer/events";

interface Props {}

export type RecvDTO = {
  roomId: string;
  peerId: string;
  routerRtpCapabilities?: RtpCapabilities;
  recvTransportOptions?: TransportOptions;
  sendTransportOptions?: TransportOptions;
  sendTransport?: Transport;
  dtlsParameters?: DtlsParameters;
  rtpCapabilities?: RtpCapabilities;
  rtpParameters?: RtpParameters;
  consumerParameters?: {
    producerId: string;
    id: string;
    kind: string;
    rtpParameters: RtpParameters;
    type: any;
    producerPaused: boolean;
  };
  consumerParametersArr?: any[];
  kicked?: boolean;
  userId?: string;
  transportId?: string;
  producerId?: String;
  direction?: string;
  kind?: string;
  paused?: boolean;
  appData?: any;
  error?: any;
  id?: string;
};

export function closeVoiceConnections(_roomId: string | null) {
  const { roomId, mic, nullify } = useVoiceStore.getState();
  if (_roomId === null || _roomId === roomId) {
    if (mic) {
      console.log("[LOGGING]: Stopping Microphone");
      mic.stop();
    }
    console.log("[LOGGING]: Nullify All Transports");
    nullify();
  }
}

const WebrtcApp: React.FC<Props> = () => {
  const { conn } = useContext(WebSocketContext);
  const { user, userLoading } = useContext(userContext);
  const router = useRouter();

  useEffect(() => {
    if (!conn || userLoading) {
      return;
    }

    conn.on(RTC_MESSAGE.RTC_MS_SEND_ROOM_CREATED, async (d: RecvDTO) => {
      console.log(
        "[LOGGING]: Room created on ms server routing to roomId",
        d.roomId
      );
      await router.push(`/room/${d.roomId}`);
      //   useRTCStore.getState().set({ createRoomLoading: false });
    });

    conn.on(RTC_MESSAGE.RTC_MS_SEND_NEW_PEER_SPEAKER, async (d: RecvDTO) => {
      console.log("[LOGGING]: Received new speaker params");
      const { roomId, recvTransport } = useVoiceStore.getState();

      if (recvTransport && roomId === d.roomId) {
        await consumeAudio(d.consumerParameters, d.peerId);
      }
    });

    conn.on(
      RTC_MESSAGE.RTC_MS_SEND_YOU_ARE_NOW_A_SPEAKER,
      async (d: RecvDTO) => {
        if (d.roomId !== useVoiceStore.getState().roomId) {
          return;
        }

        console.log("[LOGGING]: Setting up your producer transport");

        try {
          await createTransport(
            conn,
            d.roomId,
            user.userId as string,
            "send",
            d.sendTransportOptions as TransportOptions
          );
        } catch (err) {
          console.log(err);
          return;
        }

        console.log(
          "[LOGGING]: Producing on producer transport (sending voice to MS)"
        );

        try {
          await sendVoice();
        } catch (err) {
          console.log(err);
        }
      }
    );

    conn.on(
      RTC_MESSAGE.RTC_MS_SEND_YOU_JOINED_AS_A_PEER,
      async (d: RecvDTO) => {
        console.log("[LOGGING]: You joined as a peer");

        // Close all connections and add user to room
        closeVoiceConnections(null);
        useVoiceStore.getState().set({ roomId: d.roomId });

        console.log("[LOGGING]: Creating a MS device");

        // Create MS device
        try {
          await joinRoom(d.routerRtpCapabilities as RtpCapabilities);
        } catch (err) {
          console.log("[LOGGING]: Error creating a device | ", err);
          return;
        }

        // Create MS transport (for receiving only)
        try {
          await createTransport(
            conn,
            d.roomId,
            d.userId as string,
            "recv",
            d.recvTransportOptions as TransportOptions
          );
        } catch (err) {
          console.log("[ERROR]: Error creating recv transport | ", err);
          return;
        }

        // Start consuming audio tracks of participants
        receiveVoice(conn, () => {}, user.userId as string);
      }
    );

    conn.on(
      RTC_MESSAGE.RTC_MS_SEND_YOU_JOINED_AS_A_SPEAKER,
      async (d: RecvDTO) => {
        console.log("[LOGGING]: You joined as a peer");

        // Close all connections and add user to room
        closeVoiceConnections(null);
        useVoiceStore.getState().set({ roomId: d.roomId });

        console.log("[LOGGING]: Creating a device");

        // Create MS device
        try {
          await joinRoom(d.routerRtpCapabilities as RtpCapabilities);
        } catch (err) {
          console.log("[ERROR]: Error creating a device | ", err);
          return;
        }

        // Create MS transport (for send only)
        try {
          await createTransport(
            conn,
            d.roomId,
            d.userId as string,
            "send",
            d.sendTransportOptions as TransportOptions
          );
        } catch (err) {
          console.log("[ERROR]: Error creating send transport | ", err);
          return;
        }

        console.log(
          "[LOGGING]: Producing on producer transport (sending voice to MS)"
        );

        // Send Voice on MS producer transport
        try {
          await sendVoice();
        } catch (err) {
          console.log("error sending voice | ", err);
          return;
        }

        // Create transport for receiving audio
        await createTransport(
          conn,
          d.roomId,
          user.userId as string,
          "recv",
          d.recvTransportOptions as TransportOptions
        );

        // Consume audio of everyone in the room
        receiveVoice(conn, () => {}, user.userId as string);
      }
    );

    return () => {
      conn.off(RTC_MESSAGE.RTC_MS_SEND_NEW_PEER_SPEAKER);
      conn.off(RTC_MESSAGE.RTC_MS_SEND_YOU_ARE_NOW_A_SPEAKER);
      conn.off(RTC_MESSAGE.RTC_MS_SEND_YOU_JOINED_AS_A_PEER);
      conn.off(RTC_MESSAGE.RTC_MS_SEND_YOU_JOINED_AS_A_SPEAKER);
    };
  }, [conn, userLoading]);

  return (
    <>
      <AudioRenderer />
      <ActiveSpeakerListener />
    </>
  );
};

export default WebrtcApp;
