import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { logger } from "../../config/logger";
import { sendQueue, wsQueue } from "../../config/bull";
import { RTC_MESSAGE, WS_MESSAGE } from "../../../../shared/events/index";
import { setUserOffline } from "../helpers";

const init = (
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  socket: Socket
) => {
  socket.on(WS_MESSAGE.WS_DISCONNECTING, async () => {
    try {
      //@ts-ignore
      const user = socket.request?.user;
      const currentRoom = Array.from(socket.rooms)[1];

      setUserOffline(user.userId, socket.id);

      if (!currentRoom) {
        logger.info(`Disconnection socket wasn't in a room`);
        return;
      }

      wsQueue.add("clean_up", {
        userId: user.userId,
        roomId: currentRoom ?? "",
      });

      io.to(currentRoom).emit("participant-left", {
        roomId: currentRoom,
        //@ts-ignore
        participantId: user.userId,
      });

      socket.leave(currentRoom);

      sendQueue.add(RTC_MESSAGE.RTC_MS_RECV_CLOSE_PEER, {
        op: RTC_MESSAGE.RTC_MS_RECV_CLOSE_PEER,
        d: { peerId: socket.id, roomId: currentRoom, userId: user.userId },
      });

      logger.info(`Disconnecting socket is in room, ${currentRoom}`);
    } catch (error) {
      throw error;
    }
  });

  socket.on(WS_MESSAGE.WS_DISCONNECT, () => {
    try {
      logger.debug(`Peer disconnected, (${socket.id}) `);
    } catch (error) {
      throw error;
    }
  });
};

export { init };
