import { Request, Response, Router } from "express";
import "dotenv/config";

export const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.redirect("/health");
});

router.get("/health", (req: Request, res: Response) => {
  // I will render the status of all backend services here
});

