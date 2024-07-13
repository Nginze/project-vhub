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
exports.setupWsWorker = exports.sendQueue = exports.connection = void 0;
const bullmq_1 = require("bullmq");
require("dotenv/config");
const api_1 = require("../config/api");
const logger_1 = require("../config/logger");
const helpers_1 = require("../helpers");
exports.connection = {
    host: process.env.QUEUE_HOST,
    port: process.env.QUEUE_PORT,
    password: process.env.QUEUE_PASSWORD,
};
exports.sendQueue = new bullmq_1.Queue("recvqueue", {
    connection: exports.connection,
});
const setupWsWorker = () => {
    const wsWorker = new bullmq_1.Worker("sendqueue", (job) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId, roomId } = job.data;
        try {
            if (job.name == "clean_up") {
                console.log("new ws job", job.data);
                yield (0, helpers_1.cleanUp)(userId, roomId, job.data.timeStamp);
                const peerId = yield (0, helpers_1.getPeerId)(userId);
                // await api.post("/worker/invalidate", {
                //   peerId,
                // });
                // const participants = await getRoomParticipants(roomId);
                // if (participants.length < 1) {
                //   sendQueue.add("destroy_room", {
                //     op: "destroy-room",
                //     d: { roomId },
                //   });
                //   await deleteRoom(roomId);
                // }
            }
            else {
                const event = job.data;
                yield api_1.api.post("/worker/process", {
                    event,
                });
            }
        }
        catch (error) {
            logger_1.logger.error(error);
            throw error;
        }
    }), {
        connection: exports.connection,
        concurrency: 5,
    });
    wsWorker.on("completed", (job) => {
        logger_1.logger.info(`${job.name} task done processing`);
    });
    wsWorker.on("ready", () => {
        logger_1.logger.info(`Worker ready`);
    });
    wsWorker.on("stalled", () => {
        logger_1.logger.info(`Worker stalled`);
    });
};
exports.setupWsWorker = setupWsWorker;
