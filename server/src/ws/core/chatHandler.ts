import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { WS_MESSAGE } from "../../../../shared/events";

const init = (
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  socket: Socket
) => {
  socket.on(WS_MESSAGE.WS_CHAT_GLOBAL_NEW_MESSAGE, ({ roomId, message }) => {
    console.log("new message", message);
    
    io.to(roomId).emit("new-chat-message", { roomId, message });
  });
};

export { init };
