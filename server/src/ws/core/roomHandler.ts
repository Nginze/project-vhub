import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { logger } from "../../config/logger";
import { broadcastExcludeSender, getUser } from "../helpers";
import { RTC_MESSAGE, WS_MESSAGE } from "../../../../shared/events/index";

const init = (
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  socket: Socket
) => {
  socket.on(
    WS_MESSAGE.WS_ROOM_JOIN,
    async ({
      roomId,
      roomMeta: { isAutospeaker, isCreator, posX, posY, skin, dir },
    }) => {
      logger.info(`Peer (${socket.id}) joined room ${roomId}`);

      try {
        const user = getUser(socket);

        socket.join(roomId);

        const joinEvent = {
          op: WS_MESSAGE.WS_NEW_USER_JOINED_ROOM,
          peerId: socket.id,
          d: {
            roomId,
            user: {
              ...user,
              isSpeaker: isAutospeaker || isCreator,
              isMuted: true,
              raisedHand: false,
              isMod: isCreator,
              posX,
              posY,
              dir,
              skin,
            },
          },
        };

        broadcastExcludeSender(io, joinEvent);
      } catch (error) {
        throw error;
      }
    }
  );

  socket.on(WS_MESSAGE.WS_ROOM_MOVE, (d) => {
    io.to(d.roomId).emit(WS_MESSAGE.WS_PARTICIPANT_MOVED, {
      //@ts-ignore
      participantId: socket.request.user.userId,
      ...d,
    });
  });

  socket.on(WS_MESSAGE.WS_USER_SPEAKING, (d) => {
    io.to(d.roomId).emit(WS_MESSAGE.WS_USER_SPEAKING, {
      //@ts-ignore
      participantId: d.userId,
    });
  });

  socket.on(WS_MESSAGE.WS_USER_STOPPED_SPEAKING, (d) => {
    io.to(d.roomId).emit(WS_MESSAGE.WS_USER_STOPPED_SPEAKING, {
      //@ts-ignore
      participantId: d.userId,
    });
  });
};

export { init };
