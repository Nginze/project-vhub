import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { sendQueue } from "../../config/bull";
import { broadcastExcludeSender } from "../helpers/";
import { getPeerId, getUser } from "../helpers/";
import { RTC_MESSAGE, WS_MESSAGE } from "../../../../shared/events/index";
import { logger } from "../../config/logger";

const init = (
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  socket: Socket
) => {
  socket.on(WS_MESSAGE.RTC_WS_CREATE_ROOM, ({ roomId }) => {
    logger.debug("Create Room");

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

  socket.on(
    WS_MESSAGE.RTC_WS_JOIN_ROOM,
    ({ roomId, roomMeta: { isAutospeaker, isCreator } }) => {
      logger.debug("Join Room");
      const user = getUser(socket);
      try {
        sendQueue.add(RTC_MESSAGE.RTC_MS_RECV_JOIN_AS_SPEAKER, {
          op:
            isAutospeaker || isCreator
              ? RTC_MESSAGE.RTC_MS_RECV_JOIN_AS_SPEAKER
              : RTC_MESSAGE.RTC_MS_RECV_JOIN_AS_NEW_PEER,
          d: { peerId: socket.id, userId: user.userId, roomId },
        });
      } catch (error) {
        throw error;
      }
    }
  );

  socket.on(WS_MESSAGE.RTC_WS_CONNECT_TRANSPORT, (d, cb) => {
    logger.debug("Connect Transport");
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
    logger.debug("Send Track");
    console.log(d);
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
      logger.debug("Get Recv Tracks");
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

  socket.on(WS_MESSAGE.RTC_WS_ADD_SPEAKER, async ({ roomId, userId }) => {
    try {
      logger.debug("Add Speaker");
      const peerId = (await getPeerId(userId)) as string;

      // connect users voice to voice server
      sendQueue.add(RTC_MESSAGE.RTC_MS_RECV_ADD_SPEAKER, {
        op: RTC_MESSAGE.RTC_MS_RECV_ADD_SPEAKER,
        d: { roomId, peerId },
      });

      // notify all room members and receiving peer about room state change
      io.to(roomId).emit("speaker-added", { roomId, userId });
      io.to(peerId).emit("add-speaker-permissions", {
        roomId,
        userId,
      });
    } catch (error) {
      throw error;
    }
  });

  socket.on(WS_MESSAGE.RTC_WS_REMOVE_SPEAKER, async ({ roomId, userId }) => {
    try {
      logger.debug("Remove Speaker");
      const peerId = (await getPeerId(userId)) as string;

      // disconnect users voice from voice server
      sendQueue.add(RTC_MESSAGE.RTC_MS_RECV_REMOVE_SPEAKER, {
        op: RTC_MESSAGE.RTC_MS_RECV_REMOVE_SPEAKER,
        d: { roomId, peerId },
      });

      // notify all room members and receiving peer about room state change
      io.to(roomId).emit("speaker-removed", { roomId, userId });
      io.to(peerId as string).emit("remove-speaker-permissions", {
        roomId,
        userId,
      });
    } catch (error) {
      throw error;
    }
  });
};

export { init };
