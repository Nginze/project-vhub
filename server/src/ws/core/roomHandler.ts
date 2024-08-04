import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { RTC_MESSAGE, WS_MESSAGE } from "../../../../shared/events/index";
import { logger } from "../../config/logger";
import {
  broadcastExcludeSender,
  getPeerId,
  getUser,
  setUserPosition,
} from "../helpers";
import { sendQueue, wsQueue } from "../../config/bull";

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
      roomMeta: {
        isAutospeaker,
        isCreator,
        posX,
        posY,
        skin,
        dir,
        spaceName,
        spriteUrl,
      },
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
              isSpeaker: true,
              isMuted: true,
              isVideoOff: true,
              raisedHand: false,
              isMod: isCreator,
              posX,
              posY,
              dir,
              skin,
              spaceName,
              spriteUrl,
            },
          },
        };

        const joinEventNonRenderer = {
          op: "new-user-joined-room",
          peerId: socket.id,
          d: {
            roomId,
            user: {
              ...user,
              isSpeaker: true,
              isMuted: true,
              isVideoOff: true,
              raisedHand: false,
              isMod: isCreator,
              posX,
              posY,
              dir,
              skin,
              spaceName,
              spriteUrl,
            },
          },
        };

        broadcastExcludeSender(io, joinEvent);
        // broadcastExcludeSender(io, joinEventNonRenderer);
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

  socket.on("action:hand_raise", ({ userId, roomId }: SocketDTO) => {
    console.log("hand raised", { userId, roomId });
    try {
      io.to(roomId).emit("hand-raised", { userId, roomId });
    } catch (error) {
      throw error;
    }
  });

  socket.on("action:hand_down", ({ userId, roomId }: SocketDTO) => {
    console.log("hand down", { userId, roomId });
    try {
      io.to(roomId).emit("hand-down", { userId, roomId });
    } catch (error) {
      throw error;
    }
  });

  socket.on(
    "action:screen_share",
    async ({ roomId, userId, proximityList }) => {
      console.log(
        "SCREEN SHARE STARTED -----------------------------------------------------------------------"
      );
      console.log("screen share started", { userId, roomId, proximityList });
      proximityList.forEach(async (theirUserId: string) => {
        const peerId = await getPeerId(theirUserId);
        console.log(
          "This peer in proximity sending screen share event",
          peerId,
          theirUserId
        );
        try {
          io.to(peerId as string).emit("screen-share-started", {
            userId,
            roomId,
          });
        } catch (error) {
          throw error;
        }
      });
    }
  );

  socket.on("leave-room", async ({ roomId, userId }: SocketDTO) => {
    await wsQueue.add("clean_up", {
      peerId: socket.id,
      userId: userId,
      roomId: roomId ?? "",
      timeStamp: Date.now(),
    });

    socket.leave(roomId);

    io.to(roomId).emit(WS_MESSAGE.WS_PARTICIPANT_LEFT, {
      roomId,
      //@ts-ignore
      participantId: userId,
    });

    await sendQueue.add(RTC_MESSAGE.RTC_MS_RECV_CLOSE_PEER, {
      op: RTC_MESSAGE.RTC_MS_RECV_CLOSE_PEER,
      d: { peerId: socket.id, roomId: roomId, userId: userId },
    });
  });
};

export { init };
