import { create } from "zustand";
import { combine } from "zustand/middleware";
import { Consumer } from "mediasoup-client/lib/Consumer";

type AudioGraph = {
  source: MediaStreamAudioSourceNode;
  destination: MediaStreamAudioDestinationNode;
  gain: GainNode;
  stereoPanner: StereoPannerNode;
  compressor: DynamicsCompressorNode;
  loopback: any;
};

export const useConsumerStore = create(
  combine(
    {
      consumerMap: {} as Record<
        string,
        {
          consumer: Consumer;
          volume: number;
          audioRef?: HTMLAudioElement;
          audioGraph: AudioGraph;
        }
      >,
    },
    (set) => ({
      setAudioRef: (userId: string, audioRef: HTMLAudioElement) => {
        set((s) => {
          if (userId in s.consumerMap) {
            return {
              consumerMap: {
                ...s.consumerMap,
                [userId]: {
                  ...s.consumerMap[userId],
                  audioRef,
                },
              },
            };
          }

          console.log("could not find consumer for ", userId);
          return s;
        });
      },
      setVolume: (userId: string, volume: number) => {
        set((s) =>
          userId in s.consumerMap
            ? {
                consumerMap: {
                  ...s.consumerMap,
                  [userId]: {
                    ...s.consumerMap[userId],
                    volume,
                  },
                },
              }
            : s
        );
      },
      setMute: (userId: string, muted: boolean) => {
        set((s) => {
          if (userId in s.consumerMap) {
            const x = s.consumerMap[userId];
            if (x.audioRef) {
              x.audioRef.muted = muted;
            }
          }
          return s;
        });
      },
      setGain: (userId: string, gain: number) => {
        set((s) => {
          if (userId in s.consumerMap) {
            const x = s.consumerMap[userId];
            if (x.audioGraph) {
              x.audioGraph.gain.gain.value = gain;
            }
          }
          return s;
        });
      },
      setStream: (userId: string, stream: MediaStream) => {
        set((s) => {
          if (userId in s.consumerMap) {
            const x = s.consumerMap[userId];
            if (x.audioRef) {
              x.audioRef.srcObject = stream;
            }
          }
          return s;
        });
      },
      setPan: (userId: string, pan: number) => {
        set((s) => {
          if (userId in s.consumerMap) {
            const x = s.consumerMap[userId];
            if (x.audioGraph) {
              x.audioGraph.stereoPanner.pan.value = pan;
            }
          }
          return s;
        });
      },
      playAudio: (userId: string) => {
        set((s) => {
          if (userId in s.consumerMap) {
            const x = s.consumerMap[userId];
            if (x.audioRef) {
              console.log("[LOGGING]: about to play audio graph")
              x.audioRef.play().catch((err) => console.log(err));
            }
          }
          return s;
        });
      },
      add: (c: Consumer, userId: string) =>
        set((s) => {
          let volume = 100;
          if (userId in s.consumerMap) {
            const x = s.consumerMap[userId];
            volume = x.volume;
            x.consumer.close();
          }
          return {
            consumerMap: {
              ...s.consumerMap,
              [userId]: { consumer: c, volume },
            },
          };
        }),
      initAudioGraph: (userId: string) => {
        let streamSrc: MediaStream | null = null;

        set((s) => {
          if (!(userId in s.consumerMap)) {
            console.log("could not find consumer for ", userId);
            return s;
          }
          s.consumerMap[userId].audioGraph = {} as AudioGraph;

          const { consumer, audioGraph, audioRef } = s.consumerMap[userId];
          const inputStream = new MediaStream([consumer.track]);

          const audioContext = new AudioContext();

          audioGraph.gain = audioContext.createGain();
          audioGraph.stereoPanner = audioContext.createStereoPanner();
          audioGraph.compressor = audioContext.createDynamicsCompressor();
          audioGraph.source = audioContext.createMediaStreamSource(inputStream);
          audioGraph.destination = audioContext.createMediaStreamDestination();

          audioGraph.source.connect(audioGraph.gain);
          audioGraph.gain.connect(audioGraph.stereoPanner);
          audioGraph.stereoPanner.connect(audioGraph.compressor);
          audioGraph.compressor.connect(audioGraph.destination);

          streamSrc = audioGraph!.destination.stream;

          return s;
        });

        return streamSrc;
      },
      closeAll: () =>
        set((s) => {
          Object.values(s.consumerMap).forEach(
            ({ consumer: c }) => !c.closed && c.close()
          );
          return {
            consumerMap: {},
          };
        }),
    })
  )
);
