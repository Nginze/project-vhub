import { NextFunction, Request, Response, Router } from "express";
import { pool } from "../config/psql";
import { redis } from "../config/redis";
import createHttpError from "http-errors";
import { parseCamel } from "../utils";
import { UserData } from "../../../shared/types";

export const router = Router();

router.patch(
  "/update/bio",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.user as UserData;
      const { bio } = req.body;

      if (!userId || !req.body) {
        return res
          .status(400)
          .json({ msg: "Bad request, incorrect credentials sent" });
      }

      await pool.query(
        `
      UPDATE user_data
      SET bio = $1
      WHERE user_id = $2
    `,
        [bio, userId]
      );

      res.status(200).json({ msg: "updated user data" });
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  "/update/avatar",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.user as UserData;

      const { avatarUrl } = req.body;

      if (!userId || !req.body) {
        return res
          .status(400)
          .json({ msg: "Bad request, incorrect credentials sent" });
      }

      await pool.query(
        `
          UPDATE user_data
          SET avatar_url = $1
          WHERE user_id = $2
        `,
        [avatarUrl, userId]
      );

      res.status(200).json({ msg: "updated user data" });
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  "/update/sprite",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // const { userId } = req.user as UserData;

      const { spriteUrl, userId } = req.body;

      if (!userId || !req.body) {
        return res
          .status(400)
          .json({ msg: "Bad request, incorrect credentials sent" });
      }

      await pool.query(
        `
          UPDATE user_data
          SET sprite_url = $1
          WHERE user_id = $2
        `,
        [spriteUrl, userId]
      );

      res.status(200).json({ msg: "updated user data" });
    } catch (error) {
      next(error);
    }
  }
);
