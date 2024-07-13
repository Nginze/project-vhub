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
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const express_session_1 = __importDefault(require("express-session"));
const cors_1 = __importDefault(require("cors"));
const passport_1 = __importDefault(require("passport"));
const authRoutes_1 = require("./api/authRoutes");
const indexRoutes_1 = require("./api/indexRoutes");
const roomRoutes_1 = require("./api/roomRoutes");
const workerRoutes_1 = require("./api/workerRoutes");
const meRoutes_1 = require("./api/meRoutes");
const socket_io_1 = require("socket.io");
const logger_1 = require("./config/logger");
const corsMiddleware_1 = require("./middleware/corsMiddleware");
const sessionMiddleware_1 = require("./middleware/sessionMiddleware");
const errorHandler_1 = require("./middleware/errorHandler");
const httpLogger_1 = require("./middleware/httpLogger");
const ws_1 = require("./ws");
const utils_1 = require("./utils");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
exports.io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.NODE_ENV == "production"
            ? process.env.CLIENT_URI_PROD
            : process.env.CLIENT_URI,
        credentials: true,
    },
});
app.use((0, cors_1.default)(corsMiddleware_1.corsMiddleware));
app.use((0, express_session_1.default)(sessionMiddleware_1.sessionMiddleware));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use(express_1.default.json({ limit: "50mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "50mb" }));
app.use(httpLogger_1.httpLogger);
app.use("/", indexRoutes_1.router);
app.use("/auth", authRoutes_1.router);
app.use("/room", roomRoutes_1.router);
app.use("/worker", workerRoutes_1.router);
app.use("/me", meRoutes_1.router);
app.use(errorHandler_1.notFoundHandler);
// app.use(errorHandler);
exports.io.use((0, utils_1.wrap)((0, express_session_1.default)(sessionMiddleware_1.sessionMiddleware)));
exports.io.use((0, utils_1.wrap)(passport_1.default.initialize()));
exports.io.use((0, utils_1.wrap)(passport_1.default.session()));
server.listen(process.env.PORT || process.env.SERVER_PORT || 8080, () => {
    (function () {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, ws_1.setupWs)(exports.io);
            }
            catch (error) {
                logger_1.logger.error(error);
            }
        });
    })();
    logger_1.logger.debug(`Server Running on ...`);
    logger_1.logger.debug(`Server Port ${process.env.PORT || process.env.SERVER_PORT}...`);
    logger_1.logger.debug(`Environment: ${process.env.NODE_ENV}`);
});
//# sourceMappingURL=index.js.map