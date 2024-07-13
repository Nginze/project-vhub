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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const psql_1 = require("../config/psql");
const utils_1 = require("../utils/");
const http_errors_1 = __importDefault(require("http-errors"));
const helpers_1 = require("../ws/helpers");
exports.router = (0, express_1.Router)();
exports.router.post("/create", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield psql_1.pool.connect();
    try {
        const roomInfo = Object.assign(Object.assign({}, req.body), { creatorId: req.user.userId });
        const { roomDesc, creatorId, isPrivate, autoSpeaker, chatEnabled, handRaiseEnabled, mapKey, } = roomInfo;
        if (!roomInfo) {
            throw (0, http_errors_1.default)(400, "Bad request, invalid credentials sent");
        }
        yield client.query(`BEGIN`);
        const { rows } = yield client.query(`
      INSERT INTO room (room_desc, is_private, auto_speaker, creator_id, chat_enabled, hand_raise_enabled, map_key)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING room_id;
        `, [
            roomDesc,
            isPrivate,
            autoSpeaker,
            creatorId,
            chatEnabled,
            handRaiseEnabled,
            mapKey,
        ]);
        yield client.query("COMMIT");
        if (rows.length > 0) {
            res.status(200).json((0, utils_1.parseCamel)(rows[0]));
        }
        else {
            throw (0, http_errors_1.default)(500, "Internal Server Error");
        }
    }
    catch (error) {
        next(error);
    }
    finally {
        client.release();
    }
}));
exports.router.get("/:roomId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const { roomId } = req.params;
    const { userId } = req.query;
    if (!roomId || !userId) {
        return res
            .status(400)
            .json({ msg: "Bad request, incorrect credentials sent" });
    }
    const { rows: room } = yield psql_1.pool.query(`
      SELECT *
      FROM room
      WHERE room_id = $1;
      `, [roomId]);
    const { rows: banned } = yield psql_1.pool.query(`
      SELECT *
      FROM room_ban
      WHERE user_id = $1
      AND room_id = $2
      AND ban_type = $3
    `, [userId, roomId, "room_ban"]);
    if (!room[0]) {
        return res.status(200).json("404");
    }
    if (banned[0]) {
        return res.status(200).json("403");
    }
    const posData = yield (0, helpers_1.getUserPosition)(roomId, userId);
    const client = yield psql_1.pool.connect();
    try {
        yield client.query("BEGIN");
        yield client.query(`
          UPDATE room
          SET ended = false
          WHERE room_id = $1
        `, [roomId]);
        yield client.query(`
          UPDATE user_data
          SET current_room_id = $1
          WHERE user_id = $2;
        `, [roomId, userId]);
        const { rows: room } = yield client.query(`
          SELECT *
          FROM room
          WHERE room_id = $1;
        `, [roomId]);
        yield client.query(`
          DELETE FROM room_status
          WHERE user_id = $1
          AND room_id = $2
        `, [userId, roomId]);
        yield client.query(`
          INSERT INTO room_status (room_id, user_id, is_speaker, is_mod, raised_hand, is_muted, pos_x, pos_y, skin, dir, is_video_off)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        `, [
            roomId,
            userId,
            ((_a = (0, utils_1.parseCamel)(room[0])) === null || _a === void 0 ? void 0 : _a.autoSpeaker) ||
                ((_b = (0, utils_1.parseCamel)(room[0])) === null || _b === void 0 ? void 0 : _b.creatorId) == userId,
            ((_c = (0, utils_1.parseCamel)(room[0])) === null || _c === void 0 ? void 0 : _c.creatorId) === userId,
            false,
            true,
            posData ? posData.posX : 3,
            posData ? posData.posY : 3,
            (0, utils_1.generateSkinName)(),
            posData ? posData.dir : "down",
            true,
        ]);
        const { rows: participants } = yield client.query(`
          SELECT *,
              (SELECT COUNT(f.is_following) FROM user_follows f WHERE f.is_following = user_data.user_id) AS followers,
              (SELECT COUNT(f.user_id) FROM user_follows f WHERE f.user_id = user_data.user_id) AS following,
              EXISTS (SELECT 1 FROM user_follows f WHERE f.user_id = $2 AND f.is_following = user_data.user_id) AS follows_me 
          FROM user_data
          INNER JOIN room_status AS rs ON rs.user_id = user_data.user_id
          WHERE rs.room_id = $1;
        `, [roomId, userId]);
        yield client.query("COMMIT");
        return res.status(200).json(Object.assign(Object.assign({}, (0, utils_1.parseCamel)(room[0])), { participants: (0, utils_1.parseCamel)(participants) }));
    }
    catch (error) {
        yield client.query("ROLLBACK");
        next(error);
    }
    finally {
        client.release();
    }
}));
exports.router.get("/room-status/:roomId/:userId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { roomId, userId } = req.params;
        if (!roomId || !userId) {
            return res
                .status(400)
                .json({ msg: "Bad request, invalid credentials sent" });
        }
        const { rows } = yield psql_1.pool.query(`
          SELECT u.user_id, is_speaker, is_mod, raised_hand, is_muted,is_video_off, pos_x, pos_y, skin, dir 
          FROM room_status rs
          INNER JOIN user_data u ON rs.user_id = u.user_id
          WHERE rs.user_id = $1 AND room_id = $2
        `, [userId, roomId]);
        return res.status(200).json((0, utils_1.parseCamel)(rows[0]));
    }
    catch (error) {
        next(error);
    }
}));
exports.router.post("/leave", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield psql_1.pool.connect();
    try {
        const { userId } = req.user
            ? req.user
            : req.query;
        const { roomId } = req.query;
        if (!roomId || !userId) {
            return res
                .status(400)
                .json({ msg: "Bad request, invalid credentials sent" });
        }
        console.log(roomId, userId);
        yield client.query("BEGIN");
        yield client.query(`
          UPDATE user_data
          SET current_room_id = $1,last_seen = NOW()
          WHERE user_id = $2;
        `, [null, userId]);
        yield client.query(`
          DELETE FROM room_status
          WHERE user_id = $1 AND room_id = $2;
        `, [userId, roomId]);
        yield client.query("COMMIT");
        return res.status(200).json({ msg: "user session cleaned up" });
    }
    catch (error) {
        yield client.query("ROLLBACK");
        next(error);
    }
    finally {
        client.release();
    }
}));
exports.router.put("/room-status/update/:userId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { state, value, roomId } = req.query;
        const { userId } = req.params;
        if (!roomId || !userId || !state || !value) {
            return res
                .status(400)
                .json({ msg: "Bad request, invalid credentials sent" });
        }
        yield psql_1.pool.query(`
          UPDATE room_status
          SET ${state} = $1
          WHERE user_id = $2 AND room_id = $3
        `, [value, userId, roomId]);
        res.status(200).json({ msg: "Permissions updated" });
    }
    catch (error) {
        next(error);
    }
}));
exports.router.get("/rooms/live", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rows: rooms } = yield psql_1.pool.query(`
          SELECT *,
          (SELECT user_name FROM user_data WHERE user_id = room.creator_id) as creator,
          (
            SELECT json_agg(json_build_object('user_name', ud.user_name, 'avatar_url', ud.avatar_url))
            FROM user_data ud
            WHERE ud.current_room_id = room.room_id
          ) AS participants,
          ARRAY(SELECT category FROM room_category WHERE room_id = room.room_id) AS categories
          FROM room
          WHERE ended = false
          LIMIT 5
        `);
        return res.status(200).json((0, utils_1.parseCamel)(rooms));
    }
    catch (error) {
        next(error);
    }
}));
//# sourceMappingURL=roomRoutes.js.map