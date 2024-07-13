"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const winston_1 = require("winston");
const config = {
    levels: { error: 0, warn: 1, info: 2, http: 3, debug: 4 },
    colors: {
        http: "cyan",
        info: "bold blue",
        warn: "italic yellow",
        error: "bold red",
        debug: "magenta",
    },
};
(0, winston_1.addColors)(config.colors);
const f = winston_1.format.combine(winston_1.format.colorize({
    all: true,
}), winston_1.format.label({
    label: "[LOGGER]",
}), winston_1.format.timestamp({
    format: "YY-MM-DD HH:mm:ss",
}), winston_1.format.printf((info) => ` ${info.label}  ${info.timestamp}  ${info.level} : ${info.message}`));
const transport = process.env.NODE_ENV !== "production"
    ? new winston_1.transports.Console({ format: f })
    : new winston_1.transports.File({ filename: "server.log" });
exports.logger = (0, winston_1.createLogger)({
    level: "debug",
    transports: [transport],
});
//# sourceMappingURL=logger.js.map