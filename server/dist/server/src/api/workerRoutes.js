"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const processMessage_1 = require("../ws/helpers/processMessage");
const __1 = require("..");
const http_errors_1 = __importDefault(require("http-errors"));
exports.router = (0, express_1.Router)();
exports.router.post("/process", (req, res, next) => {
    try {
        const { event } = req.body;
        if (!event) {
            throw (0, http_errors_1.default)(400, "Bad/Invalid credentials");
        }
        console.log("/worker/process");
        (0, processMessage_1.processMessage)(event, event.peerId, __1.io);
        res.status(200).json({ msg: "processed event" });
    }
    catch (error) {
        next(error);
    }
});
exports.router.post("/invalidate", (req, res, next) => {
    try {
        const { peerId } = req.body;
        if (!peerId) {
            throw (0, http_errors_1.default)(400, "Bad/Invalid credentials");
        }
        console.log("/worker/invalidate");
        __1.io.to(peerId).emit("invalidate-feed", {});
        res.status(200).json({ msg: "invalidated user feed" });
    }
    catch (error) {
        next(error);
    }
});
//# sourceMappingURL=workerRoutes.js.map