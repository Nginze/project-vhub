import { setupWsWorker } from "./core/";
import "./config/sentry";
import { logger } from "./config/logger";

const logEnvStatus = () => {
  const currentTime = new Date();
  logger.warn(`Async worker process started at ${currentTime}`);
  logger.warn(`Current Environment Setup: (${process.env.NODE_ENV})`);
};

try {
  logEnvStatus();
  setupWsWorker();
} catch (error) {
  console.log(error);
}
