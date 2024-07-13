import { logger } from "./config/logger";
import { main } from "./modules/main";
import "dotenv/config";
import "./config/sentry";

(async function () {
  try {
    await main();
  } catch (error) {
    logger.error(error);
  }
})();
