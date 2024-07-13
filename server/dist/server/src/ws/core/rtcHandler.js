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
const bull_1 = require("../../config/bull");
const helpers_1 = require("../helpers/");
const index_1 = require("../../../../shared/events/index");
const logger_1 = require("../../config/logger");
const init = (io, socket) => {
    socket.on(index_1.WS_MESSAGE.RTC_WS_CREATE_ROOM, ({ roomId }) => {
        logger_1.logger.debug("Create Room");
        const user = (0, helpers_1.getUser)(socket);
        try {
            bull_1.sendQueue.add(index_1.RTC_MESSAGE.RTC_MS_RECV_CREATE_ROOM, {
                op: index_1.RTC_MESSAGE.RTC_MS_RECV_CREATE_ROOM,
                d: { roomId, peerId: socket.id, userId: user.userId },
            });
        }
        catch (error) {
            throw error;
        }
    });
    socket.on(index_1.WS_MESSAGE.RTC_WS_JOIN_ROOM, ({ roomId, roomMeta: { isAutospeaker, isCreator } }) => {
        logger_1.logger.debug("Join Room");
        const user = (0, helpers_1.getUser)(socket);
        try {
            bull_1.sendQueue.add(index_1.RTC_MESSAGE.RTC_MS_RECV_JOIN_AS_SPEAKER, {
                op: isAutospeaker || isCreator
                    ? index_1.RTC_MESSAGE.RTC_MS_RECV_JOIN_AS_SPEAKER
                    : index_1.RTC_MESSAGE.RTC_MS_RECV_JOIN_AS_NEW_PEER,
                d: { peerId: socket.id, userId: user.userId, roomId },
            });
        }
        catch (error) {
            throw error;
        }
    });
    socket.on(index_1.WS_MESSAGE.RTC_WS_CONNECT_TRANSPORT, (d, cb) => {
        logger_1.logger.debug("Connect Transport");
        try {
            bull_1.sendQueue.add(index_1.RTC_MESSAGE.RTC_MS_RECV_CONNECT_TRANSPORT, {
                op: index_1.RTC_MESSAGE.RTC_MS_RECV_CONNECT_TRANSPORT,
                d: Object.assign(Object.assign({}, d), { peerId: socket.id }),
            });
            cb();
        }
        catch (error) {
            throw error;
        }
    });
    socket.on(index_1.WS_MESSAGE.RTC_WS_SEND_TRACK, (d) => {
        logger_1.logger.debug("Send Track");
        const user = (0, helpers_1.getUser)(socket);
        console.log("userId: ", d.peerId, "peerId: ", socket.id, user);
        try {
            bull_1.sendQueue.add(index_1.RTC_MESSAGE.RTC_MS_RECV_SEND_TRACK, {
                op: index_1.RTC_MESSAGE.RTC_MS_RECV_SEND_TRACK,
                d: Object.assign(Object.assign({}, d), { userId: d.peerId, peerId: socket.id }),
            });
        }
        catch (error) {
            throw error;
        }
    });
    socket.on(index_1.WS_MESSAGE.RTC_WS_GET_RECV_TRACKS, ({ roomId, peerId, rtpCapabilities }) => __awaiter(void 0, void 0, void 0, function* () {
        logger_1.logger.debug("Get Recv Tracks");
        try {
            bull_1.sendQueue.add(index_1.RTC_MESSAGE.RTC_MS_RECV_GET_RECV_TRACKS, {
                op: index_1.RTC_MESSAGE.RTC_MS_RECV_GET_RECV_TRACKS,
                d: {
                    roomId,
                    peerId: socket.id,
                    userId: peerId,
                    rtpCapabilities,
                },
            });
        }
        catch (error) {
            throw error;
        }
    }));
    socket.on(index_1.WS_MESSAGE.RTC_WS_ADD_SPEAKER, ({ roomId, userId }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            logger_1.logger.debug("Add Speaker");
            const peerId = (yield (0, helpers_1.getPeerId)(userId));
            // connect users voice to voice server
            bull_1.sendQueue.add(index_1.RTC_MESSAGE.RTC_MS_RECV_ADD_SPEAKER, {
                op: index_1.RTC_MESSAGE.RTC_MS_RECV_ADD_SPEAKER,
                d: { roomId, peerId },
            });
            // notify all room members and receiving peer about room state change
            io.to(roomId).emit("speaker-added", { roomId, userId });
            io.to(peerId).emit("add-speaker-permissions", {
                roomId,
                userId,
            });
        }
        catch (error) {
            throw error;
        }
    }));
    socket.on(index_1.WS_MESSAGE.RTC_WS_REMOVE_SPEAKER, ({ roomId, userId }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            logger_1.logger.debug("Remove Speaker");
            const peerId = (yield (0, helpers_1.getPeerId)(userId));
            // disconnect users voice from voice server
            bull_1.sendQueue.add(index_1.RTC_MESSAGE.RTC_MS_RECV_REMOVE_SPEAKER, {
                op: index_1.RTC_MESSAGE.RTC_MS_RECV_REMOVE_SPEAKER,
                d: { roomId, peerId },
            });
            // notify all room members and receiving peer about room state change
            io.to(roomId).emit("speaker-removed", { roomId, userId });
            io.to(peerId).emit("remove-speaker-permissions", {
                roomId,
                userId,
            });
        }
        catch (error) {
            throw error;
        }
    }));
};
exports.init = init;
//# sourceMappingURL=rtcHandler.js.map