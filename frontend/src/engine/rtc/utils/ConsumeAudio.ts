import { useConsumerStore } from "../store/ConsumerStore";
import { useMediaStore } from "../store/MediaStore";

export const consumeAudio = async (consumerParameters: any, peerId: string) => {
  const { recvTransport } = useMediaStore.getState();
  if (!recvTransport) {
    console.log(
      "[LOGGING]: Skipping audio consume because recv transport no setup / is null"
    );
    return false;
  }

  console.log("Consumer Parameters", consumerParameters);

  const consumer = await recvTransport.consume({
    ...consumerParameters,
    appData: {
      peerId,
      producerId: consumerParameters.producerId,
      mediaTag: consumerParameters.appData.mediaTag,
    },
  });

  console.log("[LOGGING]: Finished creating consumer");

  console.log("THis is the consumers media tag", consumer.appData.mediaTag);

  useConsumerStore.getState().add(consumer, peerId);

  return true;
};
