import { Socket } from "socket.io";

export const wsAuthMiddleware = (socket: Socket, next: any) => {
  //@ts-ignore
  const user: any = socket.request?.user;

  if (!user) {
    const error = new Error("Unauthorized connection to ws");
    return next(error);
  }

  next();
};
