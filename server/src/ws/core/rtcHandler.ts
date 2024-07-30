import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { sendQueue } from "../../config/bull";
import { broadcastExcludeSender } from "../helpers/";
import { getPeerId, getUser } from "../helpers/";
import { RTC_MESSAGE, WS_MESSAGE } from "../../../../shared/events/index";

const init = (
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  socket: Socket
) => {
  socket.on(WS_MESSAGE.RTC_WS_CREATE_ROOM, ({ roomId }) => {
    const user = getUser(socket);

    try {
      sendQueue.add(RTC_MESSAGE.RTC_MS_RECV_CREATE_ROOM, {
        op: RTC_MESSAGE.RTC_MS_RECV_CREATE_ROOM,
        d: { roomId, peerId: socket.id, userId: user.userId },
      });
    } catch (error) {
      throw error;
    }
  });

  socket.on(WS_MESSAGE.RTC_WS_JOIN_ROOM, ({ roomId }) => {
    const user = getUser(socket);
    try {
      sendQueue.add(RTC_MESSAGE.RTC_MS_RECV_JOIN_AS_NEW_PEER, {
        op: RTC_MESSAGE.RTC_MS_RECV_JOIN_AS_NEW_PEER,
        d: { peerId: socket.id, userId: user.userId, roomId },
      });
    } catch (error) {
      throw error;
    }
  });

  socket.on(WS_MESSAGE.RTC_WS_CONNECT_TRANSPORT, (d, cb) => {
    try {
      sendQueue.add(RTC_MESSAGE.RTC_MS_RECV_CONNECT_TRANSPORT, {
        op: RTC_MESSAGE.RTC_MS_RECV_CONNECT_TRANSPORT,
        d: { ...d, peerId: socket.id },
      });
      cb();
    } catch (error) {
      throw error;
    }
  });

  socket.on(WS_MESSAGE.RTC_WS_SEND_TRACK, (d) => {
    try {
      sendQueue.add(RTC_MESSAGE.RTC_MS_RECV_SEND_TRACK, {
        op: RTC_MESSAGE.RTC_MS_RECV_SEND_TRACK,
        d: { ...d, userId: d.peerId, peerId: socket.id },
      });
    } catch (error) {
      throw error;
    }
  });

  socket.on(
    WS_MESSAGE.RTC_WS_GET_RECV_TRACKS,
    async ({ roomId, peerId, rtpCapabilities }) => {
      try {
        sendQueue.add(RTC_MESSAGE.RTC_MS_RECV_GET_RECV_TRACKS, {
          op: RTC_MESSAGE.RTC_MS_RECV_GET_RECV_TRACKS,
          d: {
            roomId,
            peerId: socket.id,
            userId: peerId,
            rtpCapabilities,
          },
        });
      } catch (error) {
        throw error;
      }
    }
  );

  socket.on(WS_MESSAGE.RTC_WS_SEND_SCREEN, async (d) => {
    try {
      sendQueue.add(RTC_MESSAGE.RTC_MS_RECV_SEND_SCREEN, {
        op: RTC_MESSAGE.RTC_MS_RECV_SEND_SCREEN,
        d: { ...d, userId: d.peerId, peerId: socket.id },
      });
    } catch (error) {
      throw error;
    }
  });

  socket.on(
    WS_MESSAGE.RTC_WS_GET_RECV_SCREEN,
    async ({ roomId, peerId, rtpCapabilities }) => {
      try {
        sendQueue.add(RTC_MESSAGE.RTC_MS_RECV_GET_RECV_SCREEN, {
          op: RTC_MESSAGE.RTC_MS_RECV_GET_RECV_SCREEN,
          d: {
            roomId,
            peerId: socket.id,
            userId: peerId,
            rtpCapabilities,
          },
        });
      } catch (error) {
        throw error;
      }
    }
  );
};

export { init };

// DEPRACATED EVENT

// socket.on(WS_MESSAGE.RTC_WS_ADD_SPEAKER, async ({ roomId, userId }) => {
//   try {
//     const peerId = (await getPeerId(userId)) as string;

//     // connect users voice to voice server
//     sendQueue.add(RTC_MESSAGE.RTC_MS_RECV_ADD_SPEAKER, {
//       op: RTC_MESSAGE.RTC_MS_RECV_ADD_SPEAKER,
//       d: { roomId, peerId },
//     });

//     // notify all room members and receiving peer about room state change
//     io.to(roomId).emit("speaker-added", { roomId, userId });
//     io.to(peerId).emit("add-speaker-permissions", {
//       roomId,
//       userId,
//     });
//   } catch (error) {
//     throw error;
//   }
// });

// socket.on(WS_MESSAGE.RTC_WS_REMOVE_SPEAKER, async ({ roomId, userId }) => {
//   try {
//     logger.debug("Remove Speaker");
//     const peerId = (await getPeerId(userId)) as string;

//     // disconnect users voice from voice server
//     sendQueue.add(RTC_MESSAGE.RTC_MS_RECV_REMOVE_SPEAKER, {
//       op: RTC_MESSAGE.RTC_MS_RECV_REMOVE_SPEAKER,
//       d: { roomId, peerId },
//     });

//     // notify all room members and receiving peer about room state change
//     io.to(roomId).emit("speaker-removed", { roomId, userId });
//     io.to(peerId as string).emit("remove-speaker-permissions", {
//       roomId,
//       userId,
//     });
//   } catch (error) {
//     throw error;
//   }
// });
