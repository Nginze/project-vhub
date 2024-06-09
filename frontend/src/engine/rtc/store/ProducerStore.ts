import { create } from "zustand";
import { combine } from "zustand/middleware";
import { Producer } from "mediasoup-client/lib/Producer";

export const useProducerStore = create(
  combine(
    {
      producer: null as Producer | null,
      videoProducer: null as Producer | null,
      audioProducer: null as Producer | null,
      screenShareVideoProducer: null as Producer | null,
      screenShareAudioProducer: null as Producer | null,
    },
    (set) => ({
      add: (p: Producer) => {
        set((s) => {
          if (s.producer && !s.producer.closed) {
            s.producer.close();
          }

          if (p.appData.mediaTag === "cam-video") {
            return { videoProducer: p };
          } else if (p.appData.mediaTag === "cam-audio") {
            return { audioProducer: p };
          } else if (p.appData.mediaTag === "screen-video") {
            return { screenShareVideoProducer: p };
          } else if (p.appData.mediaTag === "screen-audio") {
            return { screenShareAudioProducer: p };
          }

          return { producer: p };
        });
      },
      close: () => {
        set((s) => {
          if (s.producer && !s.producer.closed) {
            s.producer.close();
          }
          return {
            // how will i close all the producers
            producer: null,
          };
        });
      },
    })
  )
);
