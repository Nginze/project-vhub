"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const events_1 = require("../../../../shared/events");
const init = (io, socket) => {
    socket.on(events_1.WS_MESSAGE.WS_CHAT_GLOBAL_NEW_MESSAGE, ({ roomId, message }) => {
        io.to(roomId).emit("new-chat-message", { roomId, message });
    });
};
exports.init = init;
//# sourceMappingURL=chatHandler.js.map