"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.setupWs = void 0;
const connHandler = __importStar(require("./core/connHandler"));
const roomHandler = __importStar(require("./core/roomHandler"));
const chatHandler = __importStar(require("./core/chatHandler"));
const rtcHandler = __importStar(require("./core/rtcHandler"));
const wsAuth_1 = require("./middleware/wsAuth");
const logger_1 = require("../config/logger");
const helpers_1 = require("./helpers");
const setupWs = (io) => {
    logger_1.logger.debug("Ws Running ...");
    try {
        io.use(wsAuth_1.wsAuthMiddleware);
        io.on("connection", (socket) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            logger_1.logger.debug(`Peer (${socket.id}) connected to socket server`);
            //@ts-ignore
            const user = (_a = socket.request) === null || _a === void 0 ? void 0 : _a.user;
            (0, helpers_1.setUserOnline)(user.userId, socket.id);
            connHandler.init(io, socket);
            roomHandler.init(io, socket);
            chatHandler.init(io, socket);
            rtcHandler.init(io, socket);
        }));
    }
    catch (error) {
        logger_1.logger.error(error);
        throw error;
    }
};
exports.setupWs = setupWs;
//# sourceMappingURL=index.js.map