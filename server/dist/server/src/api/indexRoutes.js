"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
require("dotenv/config");
exports.router = (0, express_1.Router)();
exports.router.get("/", (req, res) => {
    res.send("Welcome to the Vhub API");
});
//# sourceMappingURL=indexRoutes.js.map