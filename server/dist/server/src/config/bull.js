"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wsQueue = exports.sendQueue = exports.connection = void 0;
const bullmq_1 = require("bullmq");
exports.connection = {
    host: process.env.QUEUE_HOST,
    port: process.env.QUEUE_PORT,
    password: process.env.QUEUE_PASSWORD,
};
exports.sendQueue = new bullmq_1.Queue("recvqueue", {
    connection: exports.connection,
});
exports.wsQueue = new bullmq_1.Queue("sendqueue", { connection: exports.connection });
//# sourceMappingURL=bull.js.map