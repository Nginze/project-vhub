"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wsAuthMiddleware = void 0;
const wsAuthMiddleware = (socket, next) => {
    var _a;
    //@ts-ignore
    const user = (_a = socket.request) === null || _a === void 0 ? void 0 : _a.user;
    if (!user) {
        const error = new Error("Unauthorized connection to ws");
        return next(error);
    }
    next();
};
exports.wsAuthMiddleware = wsAuthMiddleware;
//# sourceMappingURL=wsAuth.js.map