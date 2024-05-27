import { Router } from "mediasoup/node/lib/Router";
import { Worker } from "mediasoup/node/lib/Worker";
import { Rooms } from "../types/RoomState";
import { closePeer } from "../utils/closePeer";
import { createConsumer } from "../utils/createConsumer";
import { createTransport, transportToOptions } from "../utils/createTransport";
import { deleteRoom } from "../utils/deleteRoom";
import { startMediasoup } from "../utils/startMediasoup";
import { HandlerMap } from "../utils/startBull";
import {
  MediaKind,
  RtpCapabilities,
  RtpParameters,
} from "mediasoup/node/lib/RtpParameters";
import { startBull } from "../utils/startBull";
import { RTC_MESSAGE } from "../../../shared/events/";

export async function main() {
  let workers: Array<{ worker: Worker; router: Router }> = [];
  const rooms: Rooms = {};
  let workerIdx = 0;

  try {
    workers = await startMediasoup();
  } catch (err) {
    console.log(err);
    throw err;
  }

  const getNextWorker = () => {
    const w = workers[workerIdx];
    workerIdx++;
    workerIdx %= workers.length;
    return w;
  };

  const createRoom = () => {
    const { router, worker } = getNextWorker();
    return { worker, router, state: {} };
  };

  const handler = {
    [RTC_MESSAGE.RTC_MS_RECV_CREATE_ROOM]: async ({ roomId, peerId }, send) => {
      if (!(roomId in rooms)) {
        rooms[roomId] = createRoom();
      }

      send({ op: RTC_MESSAGE.RTC_MS_SEND_ROOM_CREATED, d: { roomId }, peerId });
    },

    [RTC_MESSAGE.RTC_MS_RECV_JOIN_AS_SPEAKER]: async (
      { roomId, peerId },
      send
    ) => {
      if (!(roomId in rooms)) {
        rooms[roomId] = createRoom();
      }

      const { router, state } = rooms[roomId];
      const [recvTransport, sendTransport] = await Promise.all([
        createTransport("recv", router, peerId),
        createTransport("send", router, peerId),
      ]);

      if (state[peerId]) {
        closePeer(state[peerId]);
      }

      rooms[roomId].state[peerId] = {
        recvTransport,
        sendTransport,
        consumers: [],
        producer: null,
      };

      send({
        op: RTC_MESSAGE.RTC_MS_SEND_YOU_JOINED_AS_A_SPEAKER,
        peerId,
        d: {
          roomId,
          routerRtpCapabilities: rooms[roomId].router.rtpCapabilities,
          recvTransportOptions: transportToOptions(recvTransport),
          sendTransportOptions: transportToOptions(sendTransport),
        },
      });
    },
    [RTC_MESSAGE.RTC_MS_RECV_JOIN_AS_NEW_PEER]: async (
      { roomId, peerId },
      send
    ) => {
      if (!(roomId in rooms)) {
        rooms[roomId] = createRoom();
      }

      const { router, state } = rooms[roomId];
      const recvTransport = await createTransport("recv", router, peerId);

      if (state[peerId]) {
        closePeer(state[peerId]);
      }

      rooms[roomId].state[peerId] = {
        recvTransport,
        sendTransport: null,
        consumers: [],
        producer: null,
      };
      send({
        op: RTC_MESSAGE.RTC_MS_SEND_YOU_JOINED_AS_A_PEER,
        peerId,
        d: {
          roomId,
          routerRtpCapabilities: rooms[roomId].router.rtpCapabilities,
          recvTransportOptions: transportToOptions(recvTransport),
        },
      });
    },
    [RTC_MESSAGE.RTC_MS_RECV_ADD_SPEAKER]: async ({ roomId, peerId }, send) => {
      if (!rooms[roomId]?.state[peerId]) {
        return;
      }

      const { router } = rooms[roomId];
      const sendTransport = await createTransport("send", router, peerId);
      rooms[roomId].state[peerId].sendTransport?.close();
      rooms[roomId].state[peerId].sendTransport = sendTransport;
      send({
        op: RTC_MESSAGE.RTC_MS_SEND_YOU_ARE_NOW_A_SPEAKER,
        peerId,
        d: {
          sendTransportOptions: transportToOptions(sendTransport),
          roomId,
        },
      });
    },
    [RTC_MESSAGE.RTC_MS_RECV_REMOVE_SPEAKER]: async ({ roomId, peerId }) => {
      if (roomId in rooms) {
        const peer = rooms[roomId].state[peerId];
        peer?.producer?.close();
        peer?.sendTransport?.close();
      }
    },
    [RTC_MESSAGE.RTC_MS_RECV_CLOSE_PEER]: async (
      { roomId, peerId, userId },
      send
    ) => {
      if (roomId in rooms) {
        if (peerId in rooms[roomId].state) {
          closePeer(rooms[roomId].state[peerId]);
          delete rooms[roomId].state[peerId];
        }
        if (Object.keys(rooms[roomId].state).length === 0) {
          deleteRoom(roomId, rooms);
        }
      }
      send({
        peerId: peerId,
        op: RTC_MESSAGE.RTC_MS_SEND_USER_LEFT_ROOM,
        d: { roomId, kicked: false, userId },
      });
    },
    [RTC_MESSAGE.RTC_MS_RECV_DESTROY_ROOM]: async ({ roomId }) => {
      console.log("destroying room", roomId);
      if (roomId in rooms) {
        for (const peer of Object.values(rooms[roomId].state)) {
          closePeer(peer);
        }
      }
      deleteRoom(roomId, rooms);
    },
    [RTC_MESSAGE.RTC_MS_RECV_CONNECT_TRANSPORT]: async (
      { roomId, peerId, direction, dtlsParameters },
      send
    ) => {
      if (!rooms[roomId]?.state[peerId]) {
        return;
      }
      const { state } = rooms[roomId];
      const transport =
        direction === "recv"
          ? state[peerId].recvTransport
          : state[peerId].sendTransport;

      if (!transport) {
        console.log("no transport");
        return;
      }

      try {
        await transport.connect({ dtlsParameters });
      } catch (err) {
        console.log(err);
      }

      send({
        op: `@connect-transport-${direction}-done` as const,
        peerId,
        d: { roomId },
      });
    },
    [RTC_MESSAGE.RTC_MS_RECV_GET_RECV_TRACKS]: async (
      { roomId, peerId, rtpCapabilities },
      send
    ) => {
      console.log("getting recv tracks for ", roomId, peerId);
      const consumerParametersArr = [];
      if (!rooms[roomId]?.state[peerId]?.recvTransport) {
        return;
      }

      const { state, router } = rooms[roomId];
      const transport = state[peerId].recvTransport;
      if (!transport) {
        return;
      }

      for (const theirPeerId of Object.keys(state)) {
        const peerState = state[theirPeerId];
        if (theirPeerId === peerId || !peerState || !peerState.producer) {
          continue;
        }
        try {
          const { producer } = peerState;
          consumerParametersArr.push(
            await createConsumer(
              router,
              producer,
              rtpCapabilities as RtpCapabilities,
              transport,
              peerId,
              state[theirPeerId]
            )
          );
        } catch (err) {
          console.log(err);
          continue;
        }
      }
      send({
        op: RTC_MESSAGE.RTC_MS_SEND_GET_RECV_TRACKS_DONE,
        peerId,
        d: { consumerParametersArr, roomId },
      });
    },
    [RTC_MESSAGE.RTC_MS_RECV_SEND_TRACK]: async (
      {
        roomId,
        transportId,
        peerId,
        kind,
        rtpParameters,
        rtpCapabilities,
        paused,
        appData,
      },
      send
    ) => {
      if (!(roomId in rooms)) {
        return;
      }

      const { state } = rooms[roomId];
      const {
        sendTransport,
        producer: previousProducer,
        consumers,
      } = state[peerId];
      const transport = sendTransport;
      if (!transport) {
        return;
      }

      try {
        if (previousProducer) {
          previousProducer.close();
          consumers.forEach((c) => c.close());
          send({
            op: RTC_MESSAGE.RTC_MS_SEND_CLOSE_CONSUMER,
            d: { producerId: previousProducer!.id, roomId },
          });
        }

        const producer = await transport.produce({
          kind: kind as MediaKind,
          rtpParameters: rtpParameters as RtpParameters,
          paused,
          appData: { ...appData, peerId, transportId },
        });

        rooms[roomId].state[peerId].producer = producer;
        for (const theirPeerId of Object.keys(state)) {
          if (theirPeerId === peerId) {
            continue;
          }
          const peerTransport = state[theirPeerId]?.recvTransport;
          if (!peerTransport) {
            continue;
          }
          try {
            const consumer = await createConsumer(
              rooms[roomId].router,
              producer,
              rtpCapabilities as RtpCapabilities,
              peerTransport,
              peerId,
              state[theirPeerId]
            );

            send({
              peerId: theirPeerId,
              op: RTC_MESSAGE.RTC_MS_SEND_NEW_PEER_SPEAKER,
              d: { roomId, ...consumer },
            });
          } catch (err) {
            console.log(err);
          }
        }

        send({
          op: `@send-track-done` as const,
          peerId,
          d: {
            id: producer.id,
            roomId,
          },
        });
      } catch (err) {
        console.log(err);
        send({
          op: `@send-track-done` as const,
          peerId,
          d: {
            error: err,
            roomId,
          },
        });
        send({
          op: RTC_MESSAGE.RTC_MS_SEND_ERROR,
          peerId,
          d: "error connecting to voice server | " + err,
        });
        return;
      }
    },
  } as HandlerMap;

  startBull(handler);
}
