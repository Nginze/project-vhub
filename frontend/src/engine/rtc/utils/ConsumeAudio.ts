import { useConsumerStore } from "../store/ConsumerStore";
import { useVoiceStore } from "../store/VoiceStore";

export const consumeAudio = async (consumerParameters: any, peerId: string) => {
  const { recvTransport } = useVoiceStore.getState();
  if (!recvTransport) {
    console.log("skipping consumeAudio because recvTransport is null");
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
  console.log("finished creating consumer");
  useConsumerStore.getState().add(consumer, peerId);

  return true;
};
