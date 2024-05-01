import { setupWsWorker } from "./core/";
try {
  setupWsWorker();
} catch (error) {
  console.log(error);
}
