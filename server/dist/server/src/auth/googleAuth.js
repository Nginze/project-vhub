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
exports.parseToUserDTO = void 0;
require("dotenv/config");
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const psql_1 = require("../config/psql");
const logger_1 = require("../config/logger");
const utils_1 = require("../utils");
const parseToUserDTO = (params) => {
    const parsed = {
        userId: params.user_id,
        email: params.email,
        userName: params.user_name,
        avatarUrl: params.avatar_url,
        spriteUrl: params.sprite_url,
        displayName: params.display_name,
        bio: params.bio,
        currentRoomId: params.current_room_id,
        lastSeen: params.last_seen,
        createdAt: params.created_at,
    };
    return parsed;
};
exports.parseToUserDTO = parseToUserDTO;
const googleStrategyMiddleware = new passport_google_oauth20_1.Strategy({
    clientID: process.env.NODE_ENV == "production"
        ? process.env.GOOGLE_CLIENT_ID_PROD
        : process.env.GOOGLE_CLIENT_ID_PROD,
    clientSecret: process.env.NODE_ENV == "production"
        ? process.env.GOOGLE_CLIENT_SECRET_PROD
        : process.env.GOOGLE_CLIENT_SECRET_PROD,
    callbackURL: process.env.NODE_ENV == "production"
        ? process.env.GOOGLE_CALLBACK_URL_PROD
        : process.env.GOOGLE_CALLBACK_URL,
    scope: ["profile", "email"],
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { rows } = yield psql_1.pool.query(`
      SELECT u.*, ap.google_id
      FROM user_data u
      JOIN auth_provider ap ON u.user_id = ap.user_id 
      WHERE ap.google_id = $1 or u.email = $2;
      `, [profile.id, profile.emails[0].value]);
    if (rows.length > 0) {
        const parsedUser = (0, exports.parseToUserDTO)(rows[0]);
        console.log("parsed User", parsedUser);
        done(null, parsedUser);
    }
    else {
        console.log("User doesn't exist creating it now ...");
        if (profile.photos && profile.emails) {
            const client = yield psql_1.pool.connect();
            try {
                yield client.query("BEGIN");
                const { rows: userDataRows } = yield client.query(`
            INSERT INTO user_data (email, user_name, avatar_url, display_name, bio)
              VALUES ($1, $2, $3, $4, $5)
            RETURNING *
            `, [
                    profile.emails[0].value,
                    (0, utils_1.generateUsername)((_b = (_a = profile._json.family_name) === null || _a === void 0 ? void 0 : _a.toLowerCase()) !== null && _b !== void 0 ? _b : ""),
                    profile.photos[0].value,
                    profile.displayName,
                    profile._json.bio,
                ]);
                const { rows: authProviderRows } = yield client.query(`
            INSERT INTO auth_provider (user_id, google_id)
            VALUES ($1, $2)
            RETURNING google_id 
            `, [userDataRows[0].user_id, profile.id]);
                yield client.query("COMMIT");
                const unParsedUserData = Object.assign(Object.assign({}, userDataRows[0]), { google_id: authProviderRows[0].google_id });
                const parsedUserData = (0, exports.parseToUserDTO)(unParsedUserData);
                done(null, parsedUserData);
            }
            catch (err) {
                yield client.query("ROLLBACK");
                logger_1.logger.log({ level: "error", message: `${err}` });
                throw err;
            }
            finally {
                client.release();
            }
        }
    }
}));
const serializeMiddleware = (user, done) => {
    process.nextTick(() => {
        done(null, user.userId);
    });
};
const deserializeMiddleware = (userId, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        process.nextTick(() => __awaiter(void 0, void 0, void 0, function* () {
            const { rows } = yield psql_1.pool.query(`
      SELECT u.*,ap.google_id
      FROM user_data u
      JOIN auth_provider ap
      ON u.user_id = ap.user_id
      WHERE u.user_id = $1;
      `, [userId]);
            const parsedUserData = (0, exports.parseToUserDTO)(rows[0]);
            done(null, parsedUserData);
        }));
    }
    catch (err) {
        logger_1.logger.log({ level: "error", message: `${err}` });
        done(err, null);
    }
});
passport_1.default.use(googleStrategyMiddleware);
passport_1.default.serializeUser(serializeMiddleware);
passport_1.default.deserializeUser(deserializeMiddleware);
//# sourceMappingURL=googleAuth.js.map