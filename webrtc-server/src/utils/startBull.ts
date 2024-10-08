import { Job, Queue, Worker } from "bullmq";
import { logger } from "../config/logger";
import { RecvDTO, SendParams } from "../types/Misc";
import "dotenv/config";

type OperationHandler = (
  data: RecvDTO,
  send: (data: SendParams) => void
) => Promise<void>;

export type HandlerMap = Record<string, OperationHandler>;

const connection = {
  host: process.env.QUEUE_HOST as string,
  port: process.env.QUEUE_PORT as unknown as number,
  password: process.env.QUEUE_PASSWORD as string,
};

export const sendQueue = new Queue("sendqueue", {
  connection,
});

export const startBull = (handler: HandlerMap) => {
  const msWorker = new Worker(
    "recvqueue",
    async (job) => {
      try {
        const { op, d } = job.data;

        logger.info(op);
        handler[op as keyof HandlerMap](d, send);
      } catch (err) {
        throw err;
      }
    },
    {
      connection,
    }
  );

  msWorker.on("failed", (job: any, err: any) => {
    logger.error(`Job ${job.id} failed with ${err.message}`);
  });

  logger.warn("\nWorker Created, Waiting for Jobs ...\n");
};

const send = (params: SendParams) => {
  sendQueue.add("rtc_event", params);
};
