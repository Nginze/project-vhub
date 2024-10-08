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
import { MediaTag } from "../types/Misc";

// --------------------------------------------------------
// MEDIASOUP ROUTER is generated from pre-generated workers
// these workers are generated based on the number of cores
// on host.
// --------------------------------------------------------

// -------------------------------------------------------
// Cycle through already created workers when a room request
// is made
// -------------------------------------------------------

export async function main() {
  let workers: Array<{ worker: Worker; router: Router }> = [];
  const rooms: Rooms = {};
  let workerIdx = 0;

  try {
    workers = await startMediasoup();
  } catch (err) {
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

  /**
   * @peerId is the socket id of the peer
   * @userId is the user id of the peer
   */
  const handler = {
    // Create Room State on Server (Starts Creation Flow)
    [RTC_MESSAGE.RTC_MS_RECV_CREATE_ROOM]: async ({ roomId, peerId }, send) => {
      if (!(roomId in rooms)) {
        rooms[roomId] = createRoom();
      }

      if (!roomId || !peerId) {
        send({
          op: RTC_MESSAGE.RTC_MS_SEND_ERROR,
          d: {
            op: RTC_MESSAGE.RTC_MS_RECV_CREATE_ROOM,
            message: "roomId or peerId is missing",
          },
          peerId,
        });
        return;
      }

      send({ op: RTC_MESSAGE.RTC_MS_SEND_ROOM_CREATED, d: { roomId }, peerId });
    },

    // Create Peer State For Initiating User
    [RTC_MESSAGE.RTC_MS_RECV_JOIN_AS_NEW_PEER]: async (
      { roomId, userId, peerId },
      send
    ) => {
      if (!(roomId in rooms)) {
        rooms[roomId] = createRoom();
      }

      if (!userId || !peerId) {
        send({
          op: RTC_MESSAGE.RTC_MS_SEND_ERROR,
          d: {
            op: RTC_MESSAGE.RTC_MS_RECV_JOIN_AS_NEW_PEER,
            message: "userId or peerId is missing",
          },
          peerId,
        });
        return;
      }

      const { router, state } = rooms[roomId];
      const existingPeerConn = state[peerId];

      const [recvTransport, sendTransport] = await Promise.all([
        createTransport("recv", router, peerId),
        createTransport("send", router, peerId),
      ]);

      if (existingPeerConn) {
        closePeer(existingPeerConn);
      }

      rooms[roomId].state[peerId] = {
        recvTransport,
        sendTransport,
        consumers: [],
        audioProducer: null,
        videoProducer: null,
        screenShareAudioProducer: null,
        screenShareVideoProducer: null,
        userId: userId as string,
      };

      send({
        op: RTC_MESSAGE.RTC_MS_SEND_YOU_JOINED_AS_A_PEER,
        peerId,
        d: {
          roomId,
          routerRtpCapabilities: router.rtpCapabilities,
          sendTransportOptions: transportToOptions(sendTransport),
          recvTransportOptions: transportToOptions(recvTransport),
        },
      });
    },

    // Close Peer When User Exiting Room (Erradicate Room If Particpants == 0)
    [RTC_MESSAGE.RTC_MS_RECV_CLOSE_PEER]: async (
      { roomId, peerId, userId },
      send
    ) => {
      if (!roomId || !peerId || !userId) {
        send({
          op: RTC_MESSAGE.RTC_MS_SEND_ERROR,
          d: {
            op: RTC_MESSAGE.RTC_MS_RECV_CLOSE_PEER,
            message: "roomId, peerId or userId is missing",
          },
          peerId,
        });
        return;
      }

      const { state } = rooms[roomId];

      if (roomId in rooms) {
        if (peerId in state) {
          closePeer(state[peerId]);
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

    // Explicit Event to Destroy Room State
    [RTC_MESSAGE.RTC_MS_RECV_DESTROY_ROOM]: async ({ roomId }) => {
      if (roomId in rooms) {
        for (const peer of Object.values(rooms[roomId].state)) {
          closePeer(peer);
        }
      }
      deleteRoom(roomId, rooms);
    },

    // Connect Transports For Connecting Peer (Refered: After Joining as Peer Event)
    [RTC_MESSAGE.RTC_MS_RECV_CONNECT_TRANSPORT]: async (
      { roomId, peerId, direction, dtlsParameters },
      send
    ) => {
      // Exit early if peer is not part of room
      if (!rooms[roomId]?.state[peerId]) {
        return;
      }

      const { state } = rooms[roomId];

      const transport =
        direction === "recv"
          ? state[peerId].recvTransport
          : state[peerId].sendTransport;

      if (!transport) {
        console.error("no transport found.");
        return;
      }

      try {
        await transport.connect({ dtlsParameters });
      } catch (err) {
        throw err;
      }

      send({
        op:
          direction === "recv"
            ? RTC_MESSAGE.RTC_MS_SEND_CONNECT_TRANSPORT_RECV_DONE
            : RTC_MESSAGE.RTC_MS_SEND_CONNECT_TRANSPORT_SEND_DONE,
        peerId,
        d: { roomId },
      });
    },

    // Event To Get Consumable Mediatracks available in Room
    [RTC_MESSAGE.RTC_MS_RECV_GET_RECV_TRACKS]: async (
      { roomId, peerId, rtpCapabilities },
      send
    ) => {
      const consumerParametersArr = [];

      // Recv transport is required to consume producer
      if (!rooms[roomId]?.state[peerId]?.recvTransport) {
        console.log("No Recv Transport to Consume On For Peer");
        return;
      }

      const { state, router } = rooms[roomId];
      const transport = state[peerId].recvTransport;

      if (!transport) {
        console.log("No Transport Found For Peer");
        return;
      }

      for (const theirPeerId of Object.keys(state)) {
        const peerState = state[theirPeerId];
        if (
          theirPeerId === peerId ||
          !peerState ||
          !peerState.audioProducer ||
          !peerState.videoProducer
        ) {
          continue;
        }

        try {
          const { audioProducer, videoProducer, userId } = peerState;
          const [videoConsumer, audioConsumer] = await Promise.all([
            createConsumer(
              router,
              audioProducer,
              rtpCapabilities as RtpCapabilities,
              transport,
              peerId,
              userId,
              state[theirPeerId]
            ),
            createConsumer(
              router,
              videoProducer,
              rtpCapabilities as RtpCapabilities,
              transport,
              peerId,
              userId,
              state[theirPeerId]
            ),
          ]);
          consumerParametersArr.push(videoConsumer);
          consumerParametersArr.push(audioConsumer);
        } catch (err) {
          throw err;
        }
      }

      send({
        op: RTC_MESSAGE.RTC_MS_SEND_GET_RECV_TRACKS_DONE,
        peerId,
        d: { consumerParametersArr, roomId },
      });
    },

    // Send MediaTrack to Server For Processing
    [RTC_MESSAGE.RTC_MS_RECV_SEND_TRACK]: async (
      {
        roomId,
        transportId,
        peerId,
        userId,
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
        audioProducer: previousAudioProducer,
        videoProducer: previousVideoProducer,
        consumers,
      } = state[peerId];

      const transport = sendTransport;

      if (!transport) {
        return;
      }

      try {
        if (appData.mediaTag === MediaTag.CAM_AUDIO && previousAudioProducer) {
          previousAudioProducer.close();
          consumers.forEach((c) => c.close());
          send({
            op: RTC_MESSAGE.RTC_MS_SEND_CLOSE_CONSUMER,
            d: { producerId: previousAudioProducer!.id, roomId },
          });
        }

        if (appData.mediaTag === MediaTag.CAM_VIDEO && previousVideoProducer) {
          previousVideoProducer.close();
          consumers.forEach((c) => c.close());
          send({
            op: RTC_MESSAGE.RTC_MS_SEND_CLOSE_CONSUMER,
            d: { producerId: previousVideoProducer!.id, roomId },
          });
        }

        const producer = await transport.produce({
          kind: kind as MediaKind,
          rtpParameters: rtpParameters as RtpParameters,
          paused,
          appData: { ...appData, peerId, transportId },
        });

        if (appData.mediaTag === MediaTag.CAM_AUDIO) {
          rooms[roomId].state[peerId].audioProducer = producer;
        }

        if (appData.mediaTag === MediaTag.CAM_VIDEO) {
          rooms[roomId].state[peerId].videoProducer = producer;
        }

        for (const theirPeerId of Object.keys(state)) {
          if (theirPeerId === peerId) {
            console.log("Send track initialized by", state[theirPeerId].userId);
            continue;
          }

          const myUserId = state[peerId].userId;

          const peerTransport = state[theirPeerId]?.recvTransport;

          if (!peerTransport) {
            console.log("no peer transport");
            continue;
          }

          try {
            let consumer;
            if (appData.mediaTag === MediaTag.CAM_AUDIO) {
              consumer = await createConsumer(
                rooms[roomId].router,
                producer,
                rtpCapabilities as RtpCapabilities,
                peerTransport,
                peerId,
                myUserId,
                state[theirPeerId]
              );
            }

            if (appData.mediaTag === MediaTag.CAM_VIDEO) {
              consumer = await createConsumer(
                rooms[roomId].router,
                producer,
                rtpCapabilities as RtpCapabilities,
                peerTransport,
                peerId,
                myUserId,
                state[theirPeerId]
              );
            }

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
          op: RTC_MESSAGE.RTC_MS_SEND_SEND_TRACK_DONE,
          peerId,
          d: {
            id: producer.id,
            roomId,
          },
        });
      } catch (err) {
        console.error(err);
        send({
          op: RTC_MESSAGE.RTC_MS_SEND_ERROR,
          peerId,
          d: {
            op: RTC_MESSAGE.RTC_MS_RECV_SEND_TRACK,
            message: "Error sending track",
          },
        });
        return;
      }
    },

    // Send Screen Tracks to Server to Processing
    [RTC_MESSAGE.RTC_MS_RECV_SEND_SCREEN]: async (
      {
        roomId,
        transportId,
        peerId,
        userId,
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
        screenShareAudioProducer: previousScreenShareAudioProducer,
        screenShareVideoProducer: previousScreenShareVideoProducer,
        consumers,
      } = state[peerId];

      const transport = sendTransport;

      if (!transport) {
        return;
      }

      try {
        if (
          appData.mediaTag === MediaTag.SCREEN_AUDIO &&
          previousScreenShareAudioProducer
        ) {
          previousScreenShareAudioProducer.close();
          consumers.forEach((c) => c.close());
          send({
            op: RTC_MESSAGE.RTC_MS_SEND_CLOSE_CONSUMER,
            d: { producerId: previousScreenShareAudioProducer!.id, roomId },
          });
        }

        if (
          appData.mediaTag === MediaTag.SCREEN_VIDEO &&
          previousScreenShareVideoProducer
        ) {
          previousScreenShareVideoProducer.close();
          consumers.forEach((c) => c.close());
          send({
            op: RTC_MESSAGE.RTC_MS_SEND_CLOSE_CONSUMER,
            d: { producerId: previousScreenShareVideoProducer!.id, roomId },
          });
        }

        const producer = await transport.produce({
          kind: kind as MediaKind,
          rtpParameters: rtpParameters as RtpParameters,
          paused,
          appData: { ...appData, peerId, transportId },
        });

        if (appData.mediaTag === MediaTag.SCREEN_AUDIO) {
          rooms[roomId].state[peerId].screenShareAudioProducer = producer;
        }

        if (appData.mediaTag === MediaTag.SCREEN_VIDEO) {
          rooms[roomId].state[peerId].screenShareVideoProducer = producer;
        }

        for (const theirPeerId of Object.keys(state)) {
          if (theirPeerId === peerId) {
            console.log(
              "Send Screen initialized by",
              state[theirPeerId].userId
            );
            continue;
          }

          const myUserId = state[peerId].userId;

          const peerTransport = state[theirPeerId]?.recvTransport;
          if (!peerTransport) {
            console.log("no peer transport");
            continue;
          }
          try {
            let consumer;
            if (appData.mediaTag === MediaTag.SCREEN_AUDIO) {
              consumer = await createConsumer(
                rooms[roomId].router,
                producer,
                rtpCapabilities as RtpCapabilities,
                peerTransport,
                peerId,
                myUserId,
                state[theirPeerId]
              );
            }

            if (appData.mediaTag === MediaTag.SCREEN_VIDEO) {
              consumer = await createConsumer(
                rooms[roomId].router,
                producer,
                rtpCapabilities as RtpCapabilities,
                peerTransport,
                peerId,
                myUserId,
                state[theirPeerId]
              );
            }

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
          op: RTC_MESSAGE.RTC_MS_SEND_SEND_SCREEN_DONE,
          peerId,
          d: {
            id: producer.id,
            roomId,
          },
        });
      } catch (err) {
        console.error(err);
        send({
          op: RTC_MESSAGE.RTC_MS_SEND_ERROR,
          peerId,
          d: {
            op: RTC_MESSAGE.RTC_MS_RECV_SEND_SCREEN,
            message: "Error sending screen",
          },
        });
        return;
      }
    },

    // Event To Get Consumable Screen Track available in Room
    [RTC_MESSAGE.RTC_MS_RECV_GET_RECV_SCREEN]: async (
      { roomId, peerId, rtpCapabilities },
      send
    ) => {
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
        if (
          theirPeerId === peerId ||
          !peerState ||
          !peerState.screenShareAudioProducer ||
          !peerState.screenShareVideoProducer
        ) {
          continue;
        }
        try {
          const { screenShareAudioProducer, screenShareVideoProducer, userId } =
            peerState;
          const [videoConsumer, audioConsumer] = await Promise.all([
            createConsumer(
              router,
              screenShareAudioProducer,
              rtpCapabilities as RtpCapabilities,
              transport,
              peerId,
              userId,
              state[theirPeerId]
            ),
            createConsumer(
              router,
              screenShareVideoProducer,
              rtpCapabilities as RtpCapabilities,
              transport,
              peerId,
              userId,
              state[theirPeerId]
            ),
          ]);
          consumerParametersArr.push(videoConsumer);
          consumerParametersArr.push(audioConsumer);
        } catch (err) {
          throw err;
          continue;
        }
      }

      send({
        op: RTC_MESSAGE.RTC_MS_SEND_GET_RECV_TRACKS_DONE,
        peerId,
        d: { consumerParametersArr, roomId },
      });
    },
  } as HandlerMap;

  startBull(handler);
}

// -------------------------------------
// OLD RTC EVENTS (NOT RELEVANT YET)
// ADD NEW EVENTS ONLY AS NEEDED
// --------------------------------------

// [RTC_MESSAGE.RTC_MS_RECV_JOIN_AS_SPEAKER]: async (
//   { roomId, userId, peerId },
//   send
// ) => {
//   if (!(roomId in rooms)) {
//     rooms[roomId] = createRoom();
//   }

//   if (!userId || !peerId) {
//     send({
//       op: RTC_MESSAGE.RTC_MS_SEND_ERROR,
//       d: {
//         op: RTC_MESSAGE.RTC_MS_RECV_JOIN_AS_SPEAKER,
//         message: "userId or peerId is missing",
//       },
//       peerId,
//     });
//     return;
//   }

//   const { router, state } = rooms[roomId];
//   const existingPeerConn = state[peerId];
//   const [recvTransport, sendTransport] = await Promise.all([
//     createTransport("recv", router, peerId),
//     createTransport("send", router, peerId),
//   ]);

//   if (existingPeerConn) {
//     closePeer(existingPeerConn);
//   }

//   rooms[roomId].state[peerId] = {
//     recvTransport,
//     sendTransport,
//     consumers: [],
//     audioProducer: null,
//     videoProducer: null,
//     screenShareAudioProducer: null,
//     screenShareVideoProducer: null,
//     userId: userId as string,
//   };

//   send({
//     op: RTC_MESSAGE.RTC_MS_SEND_YOU_JOINED_AS_A_SPEAKER,
//     peerId,
//     d: {
//       roomId,
//       routerRtpCapabilities: rooms[roomId].router.rtpCapabilities,
//       recvTransportOptions: transportToOptions(recvTransport),
//       sendTransportOptions: transportToOptions(sendTransport),
//     },
//   });
// },

// [RTC_MESSAGE.RTC_MS_RECV_ADD_SPEAKER]: async ({ roomId, peerId }, send) => {
//   if (!roomId || !peerId) {
//     send({
//       op: RTC_MESSAGE.RTC_MS_SEND_ERROR,
//       d: {
//         op: RTC_MESSAGE.RTC_MS_RECV_ADD_SPEAKER,
//         message: "roomId or peerId is missing",
//       },
//       peerId,
//     });
//     return;
//   }

//   if (!rooms[roomId]?.state[peerId]) {
//     send({
//       op: RTC_MESSAGE.RTC_MS_SEND_ERROR,
//       d: {
//         op: RTC_MESSAGE.RTC_MS_RECV_ADD_SPEAKER,
//         message: "user not found in room",
//       },
//       peerId,
//     });
//     return;
//   }

//   const { router } = rooms[roomId];
//   const sendTransport = await createTransport("send", router, peerId);

//   rooms[roomId].state[peerId].sendTransport?.close();
//   rooms[roomId].state[peerId].sendTransport = sendTransport;

//   send({
//     op: RTC_MESSAGE.RTC_MS_SEND_YOU_ARE_NOW_A_SPEAKER,
//     peerId,
//     d: {
//       sendTransportOptions: transportToOptions(sendTransport),
//       roomId,
//     },
//   });
// },
// [RTC_MESSAGE.RTC_MS_RECV_REMOVE_SPEAKER]: async (
//   { roomId, peerId },
//   send
// ) => {
//   if (!roomId || !peerId) {
//     send({
//       op: RTC_MESSAGE.RTC_MS_SEND_ERROR,
//       d: {
//         op: RTC_MESSAGE.RTC_MS_RECV_REMOVE_SPEAKER,
//         message: "roomId or peerId is missing",
//       },
//       peerId,
//     });
//     return;
//   }

//   if (roomId in rooms) {
//     const peer = rooms[roomId].state[peerId];
//     peer?.audioProducer?.close();
//     peer?.sendTransport?.close();
//   }

//   send({
//     op: RTC_MESSAGE.RTC_MS_SEND_SUCCESS,
//     d: {
//       op: RTC_MESSAGE.RTC_MS_RECV_REMOVE_SPEAKER,
//       message: "speaker has been removed",
//     },
//     peerId,
//   });
// },
