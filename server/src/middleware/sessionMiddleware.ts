import { SessionOptions } from "express-session";
import Store from "connect-redis";
import { redis } from "../config/redis";

let REDIS_STORE = new Store({
  client: redis,
  prefix: "holo:",
});

export const sessionMiddleware = {
  secret: "secret",
  resave: false,
  store: REDIS_STORE,
  saveUninitialized: true,
  cookie: {
    maxAge: 72 * 60 * 60 * 1000,
  },
};
