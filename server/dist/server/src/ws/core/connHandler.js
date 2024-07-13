"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const logger_1 = require("../../config/logger");
const bull_1 = require("../../config/bull");
const index_1 = require("../../../../shared/events/index");
const helpers_1 = require("../helpers");
const init = (io, socket) => {
    socket.on(index_1.WS_MESSAGE.WS_DISCONNECTING, () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            //@ts-ignore
            const user = (_a = socket.request) === null || _a === void 0 ? void 0 : _a.user;
            const currentRoom = Array.from(socket.rooms)[1];
            (0, helpers_1.setUserOffline)(user.userId, socket.id);
            if (!currentRoom) {
                logger_1.logger.info(`Disconnection socket wasn't in a room`);
                return;
            }
            bull_1.wsQueue.add("clean_up", {
                userId: user.userId,
                roomId: currentRoom !== null && currentRoom !== void 0 ? currentRoom : "",
                timeStamp: Date.now(),
            });
            io.to(currentRoom).emit(index_1.WS_MESSAGE.WS_PARTICIPANT_LEFT, {
                roomId: currentRoom,
                //@ts-ignore
                participantId: user.userId,
            });
            socket.leave(currentRoom);
            bull_1.sendQueue.add(index_1.RTC_MESSAGE.RTC_MS_RECV_CLOSE_PEER, {
                op: index_1.RTC_MESSAGE.RTC_MS_RECV_CLOSE_PEER,
                d: { peerId: socket.id, roomId: currentRoom, userId: user.userId },
            });
            logger_1.logger.info(`Disconnecting socket is in room, ${currentRoom}`);
        }
        catch (error) {
            throw error;
        }
    }));
    socket.on("ping", () => {
        socket.emit("pong");
    });
    socket.on(index_1.WS_MESSAGE.WS_DISCONNECT, () => {
        try {
            logger_1.logger.debug(`Peer disconnected, (${socket.id}) `);
        }
        catch (error) {
            throw error;
        }
    });
};
exports.init = init;
//# sourceMappingURL=connHandler.js.map