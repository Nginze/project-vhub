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
exports.router = void 0;
require("dotenv/config");
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
require("../auth/githubAuth");
require("../auth/googleAuth");
const http_errors_1 = __importDefault(require("http-errors"));
const psql_1 = require("../config/psql");
const googleAuth_1 = require("../auth/googleAuth");
exports.router = (0, express_1.Router)();
exports.router.get("/github", passport_1.default.authenticate("github"));
exports.router.get("/github/callback", passport_1.default.authenticate("github", {
    successRedirect: process.env.NODE_ENV == "production"
        ? process.env.CLIENT_URI_CALLBACK_PROD
        : process.env.CLIENT_URI_CALLBACK,
    failureRedirect: "/failure",
}));
exports.router.get("/google", passport_1.default.authenticate("google"));
exports.router.get("/google/callback", passport_1.default.authenticate("google", {
    successRedirect: process.env.NODE_ENV == "production"
        ? process.env.CLIENT_URI_CALLBACK_PROD
        : process.env.CLIENT_URI_CALLBACK,
    failureRedirect: "/failure",
}));
exports.router.get("/me", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.isAuthenticated()) {
            throw (0, http_errors_1.default)(401, "Unauthorized");
        }
        const { rows } = yield psql_1.pool.query(`
      SELECT u.*,ap.google_id
      FROM user_data u
      JOIN auth_provider ap
      ON u.user_id = ap.user_id
      WHERE u.user_id = $1;
      `, [req.user.userId]);
        const parsedUserData = (0, googleAuth_1.parseToUserDTO)(rows[0]);
        res.status(200).json(parsedUserData !== null && parsedUserData !== void 0 ? parsedUserData : null);
    }
    catch (error) {
        next(error);
    }
}));
exports.router.post("/logout", (req, res, next) => {
    try {
        req.logOut(() => req.session.destroy((error) => {
            if (error) {
                throw (0, http_errors_1.default)(400, "Bad/Invalid logout request");
            }
        }));
        res.status(200).json({
            isAuth: req.isAuthenticated(),
            message: req.isAuthenticated()
                ? "Currently authenicated"
                : " Currently unauthenticated",
        });
    }
    catch (error) {
        next(error);
    }
});
//# sourceMappingURL=authRoutes.js.map