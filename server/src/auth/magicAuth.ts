import "dotenv/config";
import passport from "passport";
import { Stragegy as MagicLinkStrategy } from "passport-magic-link";
import { pool } from "../config/psql";
import { logger } from "../config/logger";
import { UserData } from "../../../shared/types";
import { generateUsername } from "../utils";
import { sendMail } from "../config/mail";

const magicLinkStrategyMiddleware = new MagicLinkStrategy(
  {
    secret: "keyboard cat",
    userFields: ["email"],
    tokenField: "token",
    verifyUserAfterToken: true,
  },
  async (user, token) => {
    const link = "http://localhost:3000/login/email/verify?token=" + token;
    return sendMail({});
  },
  async (user) => {
    return new Promise((resolve, reject) => {
      db.get(
        "SELECT * FROM users WHERE email = ?",
        [user.email],
        function (err, row) {
          if (err) {
            return reject(err);
          }
          if (!row) {
            db.run(
              "INSERT INTO users (email, email_verified) VALUES (?, ?)",
              [user.email, 1],
              function (err) {
                if (err) {
                  return reject(err);
                }
                var id = this.lastID;
                var obj = {
                  id: id,
                  email: user.email,
                };
                return resolve(obj);
              }
            );
          } else {
            return resolve(row);
          }
        }
      );
    });
  }
);
