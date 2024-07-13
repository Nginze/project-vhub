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
exports.getPeerId = exports.setUserOffline = exports.setUserOnline = exports.deleteRoom = exports.getRoomParticipants = exports.cleanUp = exports.broadcastExcludeSender = void 0;
const logger_1 = require("../config/logger");
const psql_1 = require("../config/psql");
const redis_1 = require("../config/redis");
const broadcastExcludeSender = (io, event) => {
    const clients = io.sockets.adapter.rooms.get(event.d.roomId);
    if (!clients) {
        return;
    }
    for (const sid of clients) {
        if (event.peerId == sid) {
            continue;
        }
        io.to(sid).emit(event.op, Object.assign({}, event.d));
    }
};
exports.broadcastExcludeSender = broadcastExcludeSender;
const cleanUp = (userId, roomId, timeStamp) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield psql_1.pool.connect();
    console.log("cleaning up user's room session", userId);
    try {
        yield client.query("BEGIN");
        //Set user's current room to null
        yield client.query(`
        UPDATE user_data
        SET current_room_id = NULL
        WHERE user_id = $1 
    `, [userId]);
        //Set user's last active
        yield client.query(`
      UPDATE user_data
      SET last_seen = NOW() AT TIME ZONE 'UTC'
      WHERE user_id = $1;
      `, [userId]);
        if (roomId !== "") {
            const { rows: roomStatus } = yield client.query(`
        SELECT * FROM room_status WHERE room_id = $1 and user_id = $2
      `, [roomId, userId]);
            const dbTimeStamp = new Date(roomStatus[0].created_at).getTime();
            console.log(timeStamp, dbTimeStamp, timeStamp < dbTimeStamp);
            // If the user's room status is older than the current room status (race-condition avoidance with main server)
            if (dbTimeStamp < timeStamp) {
                //Delete the user's room status
                yield client.query(`
        DELETE FROM
        room_status
        WHERE user_id = $1 and room_id = $2
    `, [userId, roomId]);
            }
            // Update last active log of room
            yield client.query(`
        UPDATE room
        SET last_active = NOW()
        WHERE room_id = $1
    `, [roomId]);
        }
        yield client.query("COMMIT");
    }
    catch (error) {
        yield client.query("ROLLBACK");
        logger_1.logger.error(error);
        throw error;
    }
    finally {
        client.release();
    }
});
exports.cleanUp = cleanUp;
const getRoomParticipants = (roomId) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield psql_1.pool.connect();
    try {
        const { rows: participants } = yield client.query(`
      SELECT user_id 
      FROM user_data
      WHERE current_room_id = $1
    `, [roomId]);
        return participants;
    }
    catch (error) {
        throw error;
    }
});
exports.getRoomParticipants = getRoomParticipants;
const deleteRoom = (roomId) => __awaiter(void 0, void 0, void 0, function* () {
    yield psql_1.pool.query(`
      DELETE FROM room
      WHERE room_id = $1`, [roomId]);
});
exports.deleteRoom = deleteRoom;
const setUserOnline = (userId, socketId) => {
    redis_1.redis.set(userId, socketId);
    redis_1.redis.sadd("onlineUsers", userId);
};
exports.setUserOnline = setUserOnline;
const setUserOffline = (userId, socketId) => {
    redis_1.redis.srem("onlineUsers", userId);
    redis_1.redis.del(userId);
};
exports.setUserOffline = setUserOffline;
const getPeerId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const peerId = yield redis_1.redis.get(userId);
    return peerId;
});
exports.getPeerId = getPeerId;
