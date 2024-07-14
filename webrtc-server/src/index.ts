import * as Sentry from "@sentry/node";
import { logger } from "./config/logger";
import { main } from "./modules/main";
import "dotenv/config";
import "./config/sentry";

(async function () {
  try {
    await main();
    logger.debug("Mediasoup server started ...");
    logger.debug(process.env.QUEUE_HOST);
    logger.debug(process.env.QUEUE_PORT);
  } catch (error) {
    process.env.NODE_ENV === "development"
      ? null
      : Sentry.captureException(error);
    console.log(error)
  }
})();
