import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { WS_MESSAGE } from "../../../../shared/events/index";
import { logger } from "../../config/logger";
import { broadcastExcludeSender, getUser, setUserPosition } from "../helpers";

type SocketDTO = {
  roomId: string;
  userId?: string;
};

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
              isVideoOff: true,
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

  socket.on(WS_MESSAGE.WS_ROOM_MOVE, async (d) => {
    const user = getUser(socket);

    setUserPosition(d.roomId, user.userId, {
      posX: d.posX,
      posY: d.posY,
      dir: d.dir,
    });

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

    io.to(d.roomId).emit("active-speaker-change", {
      userId: d.userId,
      roomId: d.roomId,
      status: "speaking",
    });
  });

  socket.on(WS_MESSAGE.WS_USER_STOPPED_SPEAKING, (d) => {
    io.to(d.roomId).emit(WS_MESSAGE.WS_USER_STOPPED_SPEAKING, {
      //@ts-ignore
      participantId: d.userId,
    });

    io.to(d.roomId).emit("active-speaker-change", {
      userId: d.userId,
      roomId: d.roomId,
      status: "stopped",
    });
  });

  socket.on(WS_MESSAGE.WS_ROOM_REACTION, (d) => {
    io.to(d.roomId).emit(WS_MESSAGE.WS_ROOM_REACTION, {
      //@ts-ignore
      participantId: d.userId,
      reaction: d.reaction,
    });
  });

  socket.on("action:mute", ({ userId, roomId }: SocketDTO) => {
    try {
      io.to(roomId).emit("mute-changed", { userId, roomId });
    } catch (error) {
      throw error;
    }
  });

  socket.on("action:unmute", ({ userId, roomId }: SocketDTO) => {
    try {
      io.to(roomId).emit("mute-changed", { userId, roomId });
    } catch (error) {
      throw error;
    }
  });

  socket.on("action:videoOn", ({ userId, roomId }: SocketDTO) => {
    try {
      io.to(roomId).emit("video-changed", { userId, roomId });
    } catch (error) {
      throw error;
    }
  });

  socket.on("action:videoOff", ({ userId, roomId }: SocketDTO) => {
    try {
      io.to(roomId).emit("video-changed", { userId, roomId });
    } catch (error) {
      throw error;
    }
  });

  socket.on("item-update", (d) => {
    io.to(d.roomId).emit("item-update", d);
  });
};

export { init };
