import {
  ConsumerType,
  Producer,
  Router,
  RtpCapabilities,
  RtpParameters,
  Transport,
} from "mediasoup/node/lib/types";
import { Peer } from "../types/Peer";
import { AppData } from "mediasoup-client/lib/types";

export const createConsumer = async (
  router: Router,
  producer: Producer,
  rtpCapabilities: RtpCapabilities,
  transport: Transport,
  peerId: string,
  userId: string,
  peerConsuming: Peer
): Promise<Consumer> => {
  if (!router.canConsume({ producerId: producer.id, rtpCapabilities })) {
    throw new Error(
      `recv-track: client cannot consume ${producer.appData.peerId}`
    );
  }

  const consumer = await transport.consume({
    producerId: producer.id,
    rtpCapabilities,
    paused: false, // see note above about always starting paused
    appData: { peerId, mediaPeerId: producer.appData.peerId },
  });
   
  peerConsuming.consumers.push(consumer);

  return {
    peerId: producer.appData.peerId as string,
    userId,
    consumerParameters: {
      producerId: producer.id,
      id: consumer.id,
      kind: consumer.kind,
      rtpParameters: consumer.rtpParameters,
      type: consumer.type,
      producerPaused: consumer.producerPaused,
      appData: { mediaTag: producer.appData.mediaTag },
    },
  };
};

export interface Consumer {
  peerId: string;
  userId: string;
  consumerParameters: {
    producerId: string;
    id: string;
    kind: string;
    rtpParameters: RtpParameters;
    type: ConsumerType;
    producerPaused: boolean;
    appData: AppData;
  };
}
