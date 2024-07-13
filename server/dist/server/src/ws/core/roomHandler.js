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
const index_1 = require("../../../../shared/events/index");
const logger_1 = require("../../config/logger");
const helpers_1 = require("../helpers");
const init = (io, socket) => {
    socket.on(index_1.WS_MESSAGE.WS_ROOM_JOIN, ({ roomId, roomMeta: { isAutospeaker, isCreator, posX, posY, skin, dir, spaceName }, }) => __awaiter(void 0, void 0, void 0, function* () {
        logger_1.logger.info(`Peer (${socket.id}) joined room ${roomId}`);
        try {
            const user = (0, helpers_1.getUser)(socket);
            socket.join(roomId);
            const joinEvent = {
                op: index_1.WS_MESSAGE.WS_NEW_USER_JOINED_ROOM,
                peerId: socket.id,
                d: {
                    roomId,
                    user: Object.assign(Object.assign({}, user), { isSpeaker: isAutospeaker || isCreator, isMuted: true, isVideoOff: true, raisedHand: false, isMod: isCreator, posX,
                        posY,
                        dir,
                        skin,
                        spaceName }),
                },
            };
            (0, helpers_1.broadcastExcludeSender)(io, joinEvent);
        }
        catch (error) {
            throw error;
        }
    }));
    socket.on(index_1.WS_MESSAGE.WS_ROOM_MOVE, (d) => __awaiter(void 0, void 0, void 0, function* () {
        const user = (0, helpers_1.getUser)(socket);
        (0, helpers_1.setUserPosition)(d.roomId, user.userId, {
            posX: d.posX,
            posY: d.posY,
            dir: d.dir,
        });
        io.to(d.roomId).emit(index_1.WS_MESSAGE.WS_PARTICIPANT_MOVED, Object.assign({ 
            //@ts-ignore
            participantId: socket.request.user.userId }, d));
    }));
    socket.on(index_1.WS_MESSAGE.WS_USER_SPEAKING, (d) => {
        io.to(d.roomId).emit(index_1.WS_MESSAGE.WS_USER_SPEAKING, {
            //@ts-ignore
            participantId: d.userId,
        });
        io.to(d.roomId).emit("active-speaker-change", {
            userId: d.userId,
            roomId: d.roomId,
            status: "speaking",
        });
    });
    socket.on(index_1.WS_MESSAGE.WS_USER_STOPPED_SPEAKING, (d) => {
        io.to(d.roomId).emit(index_1.WS_MESSAGE.WS_USER_STOPPED_SPEAKING, {
            //@ts-ignore
            participantId: d.userId,
        });
        io.to(d.roomId).emit("active-speaker-change", {
            userId: d.userId,
            roomId: d.roomId,
            status: "stopped",
        });
    });
    socket.on(index_1.WS_MESSAGE.WS_ROOM_REACTION, (d) => {
        io.to(d.roomId).emit(index_1.WS_MESSAGE.WS_ROOM_REACTION, {
            //@ts-ignore
            participantId: d.userId,
            reaction: d.reaction,
        });
    });
    socket.on("action:mute", ({ userId, roomId }) => {
        try {
            io.to(roomId).emit("mute-changed", { userId, roomId });
        }
        catch (error) {
            throw error;
        }
    });
    socket.on("action:unmute", ({ userId, roomId }) => {
        try {
            io.to(roomId).emit("mute-changed", { userId, roomId });
        }
        catch (error) {
            throw error;
        }
    });
    socket.on("action:videoOn", ({ userId, roomId }) => {
        try {
            io.to(roomId).emit("video-changed", { userId, roomId });
        }
        catch (error) {
            throw error;
        }
    });
    socket.on("action:videoOff", ({ userId, roomId }) => {
        try {
            io.to(roomId).emit("video-changed", { userId, roomId });
        }
        catch (error) {
            throw error;
        }
    });
    socket.on("item-update", (d) => {
        io.to(d.roomId).emit("item-update", d);
    });
};
exports.init = init;
//# sourceMappingURL=roomHandler.js.map