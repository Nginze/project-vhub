import { NextFunction, Request, Response, Router } from "express";
import { pool } from "../config/psql";
import { generateSkinName, parseCamel } from "../utils/";
import createHttpError from "http-errors";
import { Room, UserData } from "../../../shared/types";
import { getUserPosition } from "../ws/helpers";

export const router = Router();

router.post(
  "/create",
  async (req: Request, res: Response, next: NextFunction) => {
    const client = await pool.connect();
    try {
      const roomInfo = {
        ...req.body,
        creatorId: (req.user as UserData).userId,
      } as Room;
      const {
        roomDesc,
        creatorId,
        isPrivate,
        autoSpeaker,
        chatEnabled,
        handRaiseEnabled,
        mapKey,
      } = roomInfo;

      if (!roomInfo) {
        throw createHttpError(400, "Bad request, invalid credentials sent");
      }

      await client.query(`BEGIN`);

      const { rows } = await client.query(
        `
      INSERT INTO room (room_desc, is_private, auto_speaker, creator_id, chat_enabled, hand_raise_enabled, map_key)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING room_id;
        `,
        [
          roomDesc,
          isPrivate,
          autoSpeaker,
          creatorId,
          chatEnabled,
          handRaiseEnabled,
          mapKey,
        ]
      );

      await client.query("COMMIT");

      if (rows.length > 0) {
        res.status(200).json(parseCamel(rows[0]));
      } else {
        throw createHttpError(500, "Internal Server Error");
      }
    } catch (error) {
      next(error);
    } finally {
      client.release();
    }
  }
);

router.get(
  "/:roomId",
  async (req: Request, res: Response, next: NextFunction) => {
    const { roomId } = req.params;
    const { userId } = req.query;

    if (!roomId || !userId) {
      return res
        .status(400)
        .json({ msg: "Bad request, incorrect credentials sent" });
    }

    const { rows: room } = await pool.query(
      `
      SELECT *
      FROM room
      WHERE room_id = $1;
      `,
      [roomId]
    );

    const { rows: banned } = await pool.query(
      `
      SELECT *
      FROM room_ban
      WHERE user_id = $1
      AND room_id = $2
      AND ban_type = $3
    `,
      [userId, roomId, "room_ban"]
    );

    if (!room[0]) {
      return res.status(200).json("404");
    }

    if (banned[0]) {
      return res.status(200).json("403");
    }

    const posData = await getUserPosition(roomId, userId as string);

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      await client.query(
        `
          UPDATE room
          SET ended = false
          WHERE room_id = $1
        `,
        [roomId]
      );

      await client.query(
        `
          UPDATE user_data
          SET current_room_id = $1
          WHERE user_id = $2;
        `,
        [roomId, userId]
      );

      const { rows: room } = await client.query(
        `
          SELECT *
          FROM room
          WHERE room_id = $1;
        `,
        [roomId]
      );

      await client.query(
        `
          DELETE FROM room_status
          WHERE user_id = $1
          AND room_id = $2
        `,
        [userId, roomId]
      );

      await client.query(
        `
          INSERT INTO room_status (room_id, user_id, is_speaker, is_mod, raised_hand, is_muted, pos_x, pos_y, skin, dir, is_video_off)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        `,
        [
          roomId,
          userId,
          parseCamel(room[0])?.autoSpeaker ||
            parseCamel(room[0])?.creatorId == userId,
          parseCamel(room[0])?.creatorId === userId,
          false,
          true,
          15,
          15,
          generateSkinName(),
          posData ? posData.dir : "down",
          true,
        ]
      );

      const { rows: participants } = await client.query(
        `
          SELECT *,
              (SELECT COUNT(f.is_following) FROM user_follows f WHERE f.is_following = user_data.user_id) AS followers,
              (SELECT COUNT(f.user_id) FROM user_follows f WHERE f.user_id = user_data.user_id) AS following,
              EXISTS (SELECT 1 FROM user_follows f WHERE f.user_id = $2 AND f.is_following = user_data.user_id) AS follows_me 
          FROM user_data
          INNER JOIN room_status AS rs ON rs.user_id = user_data.user_id
          WHERE rs.room_id = $1;
        `,
        [roomId, userId]
      );

      await client.query("COMMIT");
      return res.status(200).json({
        ...parseCamel(room[0]),
        participants: parseCamel(participants),
      });
    } catch (error) {
      await client.query("ROLLBACK");
      next(error);
    } finally {
      client.release();
    }
  }
);

router.get(
  "/room-status/:roomId/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { roomId, userId } = req.params;

      if (!roomId || !userId) {
        return res
          .status(400)
          .json({ msg: "Bad request, invalid credentials sent" });
      }

      const { rows } = await pool.query(
        `
          SELECT u.user_id, is_speaker, is_mod, raised_hand, is_muted,is_video_off, pos_x, pos_y, skin, dir 
          FROM room_status rs
          INNER JOIN user_data u ON rs.user_id = u.user_id
          WHERE rs.user_id = $1 AND room_id = $2
        `,
        [userId, roomId]
      );

      return res.status(200).json(parseCamel(rows[0]));
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/leave",
  async (req: Request, res: Response, next: NextFunction) => {
    const client = await pool.connect();
    try {
      const { userId } = (req.user as UserData)
        ? (req.user as UserData)
        : req.query;
      const { roomId } = req.query;

      if (!roomId || !userId) {
        return res
          .status(400)
          .json({ msg: "Bad request, invalid credentials sent" });
      }

      console.log(roomId, userId);

      await client.query("BEGIN");

      await client.query(
        `
          UPDATE user_data
          SET current_room_id = $1,last_seen = NOW()
          WHERE user_id = $2;
        `,
        [null, userId]
      );

      await client.query(
        `
          DELETE FROM room_status
          WHERE user_id = $1 AND room_id = $2;
        `,
        [userId, roomId]
      );

      await client.query("COMMIT");
      return res.status(200).json({ msg: "user session cleaned up" });
    } catch (error) {
      await client.query("ROLLBACK");
      next(error);
    } finally {
      client.release();
    }
  }
);

router.put(
  "/room-status/update/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { state, value, roomId } = req.query;
      const { userId } = req.params;

      if (!roomId || !userId || !state || !value) {
        return res
          .status(400)
          .json({ msg: "Bad request, invalid credentials sent" });
      }

      await pool.query(
        `
          UPDATE room_status
          SET ${state} = $1
          WHERE user_id = $2 AND room_id = $3
        `,
        [value, userId, roomId]
      );

      res.status(200).json({ msg: "Permissions updated" });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/rooms/live",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { rows: rooms } = await pool.query(
        `
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
        `
      );

      return res.status(200).json(parseCamel(rooms));
    } catch (error) {
      next(error);
    }
  }
);
