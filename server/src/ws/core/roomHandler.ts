import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { logger } from "../../config/logger";
import { broadcastExcludeSender, getUser } from "../helpers";

const init = (
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  socket: Socket
) => {
  socket.on(
    "room:join",
    async ({
      roomId,
      roomMeta: { isAutospeaker, isCreator, posX, posY, skin, dir },
    }) => {
      logger.info(`Peer (${socket.id}) joined room ${roomId}`);
      try {
        const user = getUser(socket);
        socket.join(roomId);

        const joinEvent = {
          op: "new-user-joined-room",
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

      // // confirm room join
      // io.to(socket.id).emit("you-joined-room");

      // // send new clients data to all other clients
      // io.to(d.roomId).emit("new-participant", {
      //   //@ts-ignore
      //   userId: socket.request.user.userId,
      //   ...d,
      // });

      // // join room on server
      // socket.join(d.roomId);
    }
  );

  socket.on("room:move", (d) => {
    io.to(d.roomId).emit("participant-moved", {
      //@ts-ignore
      participantId: socket.request.user.userId,
      ...d,
    });
  });
};

export { init };
