import { useConsumerStore } from "../store/ConsumerStore";
import { useVoiceStore } from "../store/VoiceStore";

export const consumeAudio = async (consumerParameters: any, peerId: string) => {
  const { recvTransport } = useVoiceStore.getState();
  if (!recvTransport) {
    console.log(
      "[LOGGING]: Skipping audio consume because recv transport no setup / is null"
    );
    return false;
  }

  const consumer = await recvTransport.consume({
    ...consumerParameters,
    appData: {
      peerId,
      producerId: consumerParameters.producerId,
      mediaTag: "cam-audio",
    },
  });

  console.log("[LOGGING]: Finished creating consumer");

  useConsumerStore.getState().add(consumer, peerId);

  return true;
};
