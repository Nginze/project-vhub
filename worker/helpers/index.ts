import { logger } from "../config/logger";
import { pool } from "../config/psql";
import { redis } from "../config/redis";

export const broadcastExcludeSender = (io: any, event: any) => {
  const clients = io.sockets.adapter.rooms.get(event.d.roomId);
  if (!clients) {
    return;
  }
  for (const sid of clients) {
    if (event.peerId == sid) {
      continue;
    }
    io.to(sid).emit(event.op, { ...event.d });
  }
};

export const cleanUp = async (
  userId: string,
  roomId: string,
  timeStamp: number
) => {
  const client = await pool.connect();

  logger.warn(`Cleaning up user ${userId} from room ${roomId}`);

  try {
    await client.query("BEGIN");

    //Set user's current room to null
    await client.query(
      `
        UPDATE user_data
        SET current_room_id = NULL
        WHERE user_id = $1 
    `,
      [userId]
    );

    //Set user's last active
    await client.query(
      `
      UPDATE user_data
      SET last_seen = NOW() AT TIME ZONE 'UTC'
      WHERE user_id = $1;
      `,
      [userId]
    );

    if (roomId !== "") {
      const { rows: roomStatus } = await client.query(
        `
        SELECT * FROM room_status WHERE room_id = $1 and user_id = $2
      `,
        [roomId, userId]
      );

      await client.query(
        `
        DELETE FROM
        room_status
        WHERE user_id = $1 and room_id = $2
    `,
        [userId, roomId]
      );
      // Update last active log of room
      await client.query(
        `
        UPDATE room
        SET last_active = NOW()
        WHERE room_id = $1
    `,
        [roomId]
      );
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    logger.error(error);
    throw error;
  } finally {
    client.release();
  }
};

export const getRoomParticipants = async (roomId: string) => {
  const client = await pool.connect();
  try {
    const { rows: participants } = await client.query(
      `
      SELECT user_id 
      FROM user_data
      WHERE current_room_id = $1
    `,
      [roomId]
    );
    return participants;
  } catch (error) {
    throw error;
  }
};

export const deleteRoom = async (roomId: string) => {
  await pool.query(
    `
      DELETE FROM room
      WHERE room_id = $1`,
    [roomId]
  );
};

export const setUserOnline = (userId: string, socketId: string) => {
  redis.set(userId, socketId);
  redis.sadd("onlineUsers", userId);
};

export const setUserOffline = (userId: string, socketId: string) => {
  redis.srem("onlineUsers", userId);
  redis.del(userId);
};

export const getPeerId = async (userId: string) => {
  const peerId = await redis.get(userId);
  return peerId;
};

// OLD CODE TO HANDLE RACE CONDITIONS

// const dbTimeStamp = new Date(roomStatus[0].created_at).getTime();

// If the user's room status is older than the current room status (race-condition avoidance with main server)
//   if (dbTimeStamp < timeStamp) {
//     //Delete the user's room status
//     await client.query(
//       `
//     DELETE FROM
//     room_status
//     WHERE user_id = $1 and room_id = $2
// `,
//       [userId, roomId]
//     );
//   }
