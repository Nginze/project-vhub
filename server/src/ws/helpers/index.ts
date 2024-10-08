import { Socket } from "socket.io";
import { logger } from "../../config/logger";
import { pool } from "../../config/psql";
import { redis } from "../../config/redis";

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

export const cleanUp = async (userId: string, roomId: string) => {
  const client = await pool.connect();

  console.log("cleaning up user's room session", userId);

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
      //Delete the user's room status
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

export const setUserOnline = async (userId: string, socketId: string) => {
  await redis.set(userId, socketId);
  await redis.sadd("onlineUsers", userId);
};

export const setUserOffline = async (userId: string, socketId: string) => {
  await redis.srem("onlineUsers", userId);
  await redis.del(userId);
};

export const getPeerId = async (userId: string) => {
  const peerId = await redis.get(userId);
  return peerId;
};

export const getUser = (socket: Socket) => {
  //@ts-ignore
  return socket.request.user;
};

export const setUserPosition = async (
  roomId: string,
  userId: string,
  posData: any
) => {
  await redis.hset(roomId, userId, JSON.stringify(posData));
};

export const getUserPosition = async (roomId: string, userId: string) => {
  const posData = await redis.hget(roomId, userId);
  return JSON.parse(posData as string);
};
