import { create } from "zustand";
import { combine } from "zustand/middleware";
import { Consumer } from "mediasoup-client/lib/Consumer";

// type AudioGraph = {
//   source: MediaStreamAudioSourceNode;
//   destination: MediaStreamAudioDestinationNode;
//   gain: GainNode;
//   stereoPanner: StereoPannerNode;
//   compressor: DynamicsCompressorNode;
//   loopback: any;
// };
type AudioGraph = {
  source: MediaStreamAudioSourceNode;
  gain: GainNode;
  pan: StereoPannerNode;
  context: AudioContext;
};

export const useConsumerStore = create(
  combine(
    {
      videoConsumerMap: {} as Record<
        string,
        {
          consumer: Consumer;
          videoRef?: HTMLVideoElement;
        }
      >,
      audioConsumerMap: {} as Record<
        string,
        {
          consumer: Consumer;
          volume: number;
          audioRef?: HTMLAudioElement;
          audioGraph: AudioGraph;
        }
      >,
      screenShareVideoConsumerMap: {} as Record<
        string,
        {
          consumer: Consumer;
          videoRef?: HTMLVideoElement;
        }
      >,

      screenShareAudioConsumerMap: {} as Record<
        string,
        {
          consumer: Consumer;
          volume: number;
          audioRef?: HTMLAudioElement;
        }
      >,

      proximityList: new Map<string, Consumer>(),
    },
    (set) => ({
      setAudioRef: (userId: string, audioRef: HTMLAudioElement) => {
        set((s) => {
          if (userId in s.audioConsumerMap) {
            return {
              audioConsumerMap: {
                ...s.audioConsumerMap,
                [userId]: {
                  ...s.audioConsumerMap[userId],
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
          userId in s.audioConsumerMap
            ? {
                audioConsumerMap: {
                  ...s.audioConsumerMap,
                  [userId]: {
                    ...s.audioConsumerMap[userId],
                    volume,
                  },
                },
              }
            : s
        );
      },
      setMute: (userId: string, muted: boolean) => {
        set((s) => {
          if (userId in s.audioConsumerMap) {
            const x = s.audioConsumerMap[userId];
            if (x.audioRef) {
              x.audioRef.muted = muted;
            }
          }
          return s;
        });
      },
      setGain: (userId: string, gain: number) => {
        set((s) => {
          if (userId in s.audioConsumerMap) {
            const x = s.audioConsumerMap[userId];
            if (x.audioGraph) {
              x.audioGraph.gain.gain.value = gain;
            }
          }
          return s;
        });
      },
      // setGain: (userId: string, gainValue: number) => {
      //   set((s) => {
      //     if (userId in s.audioConsumerMap) {
      //       const x = s.audioConsumerMap[userId];
      //       if (x.audioGraph && x.audioGraph.gain) {
      //         // Update the gain node of the audio graph
      //         x.audioGraph.gain.gain.value = gainValue;
      //       }
      //     }
      //     return s;
      //   });
      // },

      setStream: (userId: string, stream: MediaStream) => {
        set((s) => {
          if (userId in s.audioConsumerMap) {
            const x = s.audioConsumerMap[userId];
            if (x.audioRef) {
              x.audioRef.srcObject = stream;
            }
          }
          return s;
        });
      },
      setPan: (userId: string, pan: number) => {
        set((s) => {
          if (userId in s.audioConsumerMap) {
            const x = s.audioConsumerMap[userId];
            if (x.audioGraph) {
              x.audioGraph.pan.pan.value = pan;
            }
          }
          return s;
        });
      },
      setAudioGraph: (userId: string, audioGraph: any) =>
        set((state) => ({
          audioConsumerMap: {
            ...state.audioConsumerMap,
            [userId]: {
              ...(state.audioConsumerMap[userId] || {}),
              audioGraph,
            },
          },
        })),

      // setPan: (userId: string, pan: number) => {
      //   set((s) => {
      //     if (userId in s.audioConsumerMap) {
      //       const x = s.audioConsumerMap[userId];
      //       if (x.audioGraph) {
      //         x.audioGraph.stereoPanner.pan.value = pan;
      //       }
      //     }
      //     return s;
      //   });
      // },
      playAudio: (userId: string) => {
        set((s) => {
          if (userId in s.audioConsumerMap) {
            const x = s.audioConsumerMap[userId];
            if (x.audioRef) {
              console.log("[LOGGING]: about to play audio graph");
              x.audioRef.play().catch((err) => console.warn(err));
            }
          }
          return s;
        });
      },
      add: (c: Consumer, userId: string) =>
        set((s) => {
          let volume = 100;

          if (c.appData.mediaTag === "cam-video") {
            if (userId in s.videoConsumerMap) {
              const x = s.videoConsumerMap[userId];
              x.consumer.close();
            }
            return {
              videoConsumerMap: {
                ...s.videoConsumerMap,
                [userId]: {
                  consumer: c,
                  volume,
                  videoRef: null,
                },
              },
            };
          } else if (c.appData.mediaTag === "cam-audio") {
            if (userId in s.audioConsumerMap) {
              const x = s.audioConsumerMap[userId];
              x.volume = volume;
              x.consumer.close();
            }
            return {
              audioConsumerMap: {
                ...s.audioConsumerMap,
                [userId]: {
                  consumer: c,
                  volume,
                  audioGraph: null,
                  audioRef: null,
                },
              },
            };
          } else if (c.appData.mediaTag === "screen-video") {
            if (userId in s.screenShareVideoConsumerMap) {
              const x = s.screenShareVideoConsumerMap[userId];
              x.consumer.close();
            }
            return {
              screenShareVideoConsumerMap: {
                ...s.screenShareVideoConsumerMap,
                [userId]: {
                  consumer: c,
                  volume,
                  videoRef: null,
                },
              },
            };
          } else if (c.appData.mediaTag === "screen-audio") {
            if (userId in s.screenShareAudioConsumerMap) {
              const x = s.screenShareAudioConsumerMap[userId];
              x.volume = volume;
              x.consumer.close();
            }
            return {
              screenShareAudioConsumerMap: {
                ...s.screenShareAudioConsumerMap,
                [userId]: {
                  consumer: c,
                  volume,
                  audioRef: null,
                },
              },
            };
          }
        }),
      // initAudioGraph: (userId: string) => {
      //   let streamSrc: MediaStream | null = null;

      //   set((s) => {
      //     if (!(userId in s.audioConsumerMap)) {
      //       console.log("could not find consumer for ", userId);
      //       return s;
      //     }
      //     s.audioConsumerMap[userId].audioGraph = {} as AudioGraph;

      //     const { consumer, audioGraph, audioRef } = s.audioConsumerMap[userId];
      //     const inputStream = new MediaStream([consumer.track]);

      //     const audioContext = new AudioContext();

      //     audioGraph.gain = audioContext.createGain();
      //     audioGraph.stereoPanner = audioContext.createStereoPanner();
      //     audioGraph.compressor = audioContext.createDynamicsCompressor();
      //     audioGraph.source = audioContext.createMediaStreamSource(inputStream);
      //     audioGraph.destination = audioContext.createMediaStreamDestination();

      //     audioGraph.source.connect(audioGraph.gain);
      //     audioGraph.gain.connect(audioGraph.stereoPanner);
      //     audioGraph.stereoPanner.connect(audioGraph.compressor);
      //     audioGraph.compressor.connect(audioGraph.destination);

      //     streamSrc = audioGraph!.destination.stream;

      //     return s;
      //   });

      //   return streamSrc;
      // },
      closeAll: () =>
        set((s) => {
          Object.values(s.audioConsumerMap).forEach(
            ({ consumer: c }) => !c.closed && c.close()
          );
          return {
            audioConsumerMap: {},
          };
        }),

      set,
    })
  )
);
