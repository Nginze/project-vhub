import * as Sentry from "@sentry/node";
import { logger } from "./config/logger";
import { main } from "./modules/main";
import "dotenv/config";
import "./config/sentry";

const logEnvStatus = () => {
  const currentTime = new Date();
  logger.warn(`Media server started at ${currentTime}`);
  logger.warn(`Current Environment Setup: (${process.env.NODE_ENV})`);
  logger.info(`Queue Host: ${process.env.QUEUE_HOST}`);
  logger.info(`Queue Port: ${process.env.QUEUE_PORT}`);
  logger.info(
    `WebRTC Listen IP (Public IP): ${
      process.env.NODE_ENV == "development"
        ? "127.0.0.1"
        : process.env.WEBRTC_LISTEN_IP
    }`
  );
  logger.info(
    `Mediasoup Listen IP (Private IP): ${
      process.env.NODE_ENV == "development"
        ? "0.0.0.0"
        : process.env.MEDIASOUP_LISTEN_IP
    }`
  );
};

(async function () {
  try {
    logEnvStatus();
    await main();
  } catch (error) {
    process.env.NODE_ENV === "development"
      ? null
      : Sentry.captureException(error);
    console.log(error);
  }
})();
