import express, { Request, Response } from "express";
import http from "http";
import session from "express-session";
import cors from "cors";
import passport from "passport";

import { router as authRoutes } from "./api/authRoutes";
import { router as indexRoutes } from "./api/indexRoutes";
import { router as roomRoutes } from "./api/roomRoutes";
import { router as workerRoutes } from "./api/workerRoutes";
import { router as meRoutes } from "./api/meRoutes";

import { Server } from "socket.io";
import { logger } from "./config/logger";
import { corsMiddleware } from "./middleware/corsMiddleware";
import { sessionMiddleware } from "./middleware/sessionMiddleware";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { httpLogger } from "./middleware/httpLogger";
import { setupWs } from "./ws";
import { wrap } from "./utils";

const app = express();
const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin:
      process.env.NODE_ENV == "production"
        ? process.env.CLIENT_URI_PROD
        : process.env.CLIENT_URI,
    credentials: true,
  },
});

app.use(cors(corsMiddleware));
app.use(session(sessionMiddleware));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use(httpLogger);

app.use("/", indexRoutes);
app.use("/auth", authRoutes);
app.use("/room", roomRoutes);
app.use("/worker", workerRoutes);
app.use("/me", meRoutes);

app.use(notFoundHandler);
// app.use(errorHandler);

io.use(wrap(session(sessionMiddleware)));
io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));

server.listen(process.env.PORT || 8000, () => {
  (async function () {
    try {
      setupWs(io);
    } catch (error) {
      logger.error(error);
    }
  })();
  logger.debug("Server Running ...");
  logger.debug(`Environment: ${process.env.NODE_ENV}`);
});
