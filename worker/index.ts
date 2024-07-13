import { setupWsWorker } from "./core/";
import "./config/sentry";

try {
  setupWsWorker();
} catch (error) {
  console.log(error);
}

