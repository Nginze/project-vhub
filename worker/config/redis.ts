import Redis from "ioredis";
import "dotenv/config";
import { logger } from "./logger";

const redis = new Redis(process.env.REDIS_URI as string, {
  password: process.env.REDIS_PASSWORD,
});

redis.on("error", (err) => {
  logger.log({ level: "error", message: `${err}` });
});

redis.on("ready", () => {
  logger.log({ level: "info", message: "connected to redis instance" });
});

export { redis };
