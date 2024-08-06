import { Peer } from "../types/Peer";

export const closePeer = (state: Peer) => {
  state.audioProducer?.close();
  state.videoProducer?.close();
  state.screenShareAudioProducer?.close();
  state.screenShareVideoProducer?.close();
  state.recvTransport?.close();
  state.sendTransport?.close();
  state.consumers.forEach((c) => c.close());
};
