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
exports.router = void 0;
const express_1 = require("express");
const psql_1 = require("../config/psql");
exports.router = (0, express_1.Router)();
exports.router.patch("/update/bio", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.user;
        const { bio } = req.body;
        if (!userId || !req.body) {
            return res
                .status(400)
                .json({ msg: "Bad request, incorrect credentials sent" });
        }
        yield psql_1.pool.query(`
      UPDATE user_data
      SET bio = $1
      WHERE user_id = $2
    `, [bio, userId]);
        res.status(200).json({ msg: "updated user data" });
    }
    catch (error) {
        next(error);
    }
}));
exports.router.patch("/update/avatar", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.user;
        const { avatarUrl } = req.body;
        if (!userId || !req.body) {
            return res
                .status(400)
                .json({ msg: "Bad request, incorrect credentials sent" });
        }
        yield psql_1.pool.query(`
          UPDATE user_data
          SET avatar_url = $1
          WHERE user_id = $2
        `, [avatarUrl, userId]);
        res.status(200).json({ msg: "updated user data" });
    }
    catch (error) {
        next(error);
    }
}));
exports.router.patch("/update/sprite", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const { userId } = req.user as UserData;
        const { spriteUrl, userId } = req.body;
        if (!userId || !req.body) {
            return res
                .status(400)
                .json({ msg: "Bad request, incorrect credentials sent" });
        }
        yield psql_1.pool.query(`
          UPDATE user_data
          SET sprite_url = $1
          WHERE user_id = $2
        `, [spriteUrl, userId]);
        res.status(200).json({ msg: "updated user data" });
    }
    catch (error) {
        next(error);
    }
}));
exports.router.patch("/update/spacename", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.user;
        const { spaceName } = req.body;
        if (!userId || !req.body) {
            return res
                .status(400)
                .json({ msg: "Bad request, incorrect credentials sent" });
        }
        yield psql_1.pool.query(`
        UPDATE user_data 
        SET space_name = $1
        WHERE user_id = $2
      `, [spaceName, userId]);
        res.status(200).json({ msg: "updated user data" });
    }
    catch (error) {
        next(error);
    }
}));
//# sourceMappingURL=meRoutes.js.map