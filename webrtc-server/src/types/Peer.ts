import { Consumer, Producer, Transport } from "mediasoup/node/lib/types";

export type Peer = {
  sendTransport: Transport | null;
  recvTransport: Transport | null;
  videoProducer: Producer | null;
  audioProducer: Producer | null;
  screenShareVideoProducer: Producer | null;
  screenShareAudioProducer: Producer | null;
  consumers: Consumer[];
  userId: string;
};
