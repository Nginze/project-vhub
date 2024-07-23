import { CorsOptions } from "cors";
import "dotenv/config";

export const corsMiddleware: CorsOptions = {
  origin:
    process.env.NODE_ENV == "production"
      ? (process.env.CLIENT_URI_PROD as string)
      : (process.env.CLIENT_URI as string),
  credentials: true,
};
