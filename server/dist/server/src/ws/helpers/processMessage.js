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
exports.processMessage = void 0;
const _1 = require("./");
const processMessage = (event, sid, io) => __awaiter(void 0, void 0, void 0, function* () {
    switch (event === null || event === void 0 ? void 0 : event.op) {
        case "room-created":
            io.to(sid).emit(event.op, Object.assign({}, event.d));
            break;
        case "you-joined-as-a-speaker":
            io.to(sid).emit(event.op, Object.assign(Object.assign({}, event.d), { roomId: event.d.roomId, peerId: event.d.peerId, userid: event.userid }));
            break;
        case "you-joined-as-a-peer":
            io.to(sid).emit(event.op, Object.assign(Object.assign({}, event.d), { roomId: event.d.roomId, peerId: event.d.peerId, userid: event.userid }));
            break;
        case "new-peer-speaker":
            io.to(event.peerId).emit(event.op, Object.assign({}, event.d));
            break;
        case "@send-track-done":
            console.log("@send-track-done fired to", sid);
            io.to(sid).emit(event.op, {
                d: event.d,
            });
            break;
        case "@get-recv-tracks-done":
            console.log("@get-recv-tracks-done fired to", sid);
            io.to(sid).emit(event.op, Object.assign({}, event.d));
            break;
        case "you-are-now-a-speaker":
            console.log("you are now a speaker fired to ", sid);
            io.to(sid).emit(event.op, Object.assign({}, event.d));
            break;
        case "user-left-room":
            (0, _1.broadcastExcludeSender)(io, event);
        default:
            break;
    }
});
exports.processMessage = processMessage;
//# sourceMappingURL=processMessage.js.map