import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import * as connHandler from "./core/connHandler";
import * as roomHandler from "./core/roomHandler";
import { wsAuthMiddleware } from "./middleware/wsAuth";
import { logger } from "../config/logger";
import { setUserOnline } from "./helpers";

export const setupWs = (
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  logger.debug("Ws Running ...");
  try {
    io.use(wsAuthMiddleware);
    io.on("connection", async (socket: Socket) => {
      logger.debug(`Peer (${socket.id}) connected to socket server`);

      //@ts-ignore
      const user = socket.request?.user;
      setUserOnline(user.userId, socket.id);

      connHandler.init(io, socket);
      roomHandler.init(io, socket);
    });
  } catch (error) {
    logger.error(error);
    throw error;
  }
};
