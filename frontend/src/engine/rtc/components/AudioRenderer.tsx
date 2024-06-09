import React, { useEffect, useRef, useState } from "react";
import { useConsumerStore } from "../store/ConsumerStore";
import AppDialog from "@/components/global/AppDialog";
import { DialogClose } from "@radix-ui/react-dialog";

interface AudioRenderProps {}

type Props = React.DetailedHTMLProps<
  React.AudioHTMLAttributes<HTMLAudioElement>,
  HTMLAudioElement
> & {
  onRef: (a: HTMLAudioElement) => void;
  volume: number;
};

const AudioComponent = ({ volume, onRef, ...props }: Props) => {
  const myRef = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    if (myRef.current) {
      myRef.current.volume = volume;
    }
  }, [volume]);
  return (
    <audio
      ref={(r) => {
        if (r && !myRef.current) {
          (myRef as any).current = r;
          onRef(r);
        }
      }}
      {...props}
    ></audio>
  );
};
export const AudioRenderer: React.FC<AudioRenderProps> = () => {
  const { audioConsumerMap, setAudioRef } = useConsumerStore();
  const audioRefs = useRef<Array<[string, HTMLAudioElement]>>([]);
  const [showAutoPlayModal, setShowAutoPlayModal] = useState(false);
  return (
    <>
      {Object.keys(audioConsumerMap).map((k) => {
        const {
          consumer,
          volume: peerVolume,
          audioGraph,
        } = audioConsumerMap[k];
        return (
          <AudioComponent
            key={consumer.id}
            volume={0.8}
            onRef={(a) => {
              setAudioRef(k, a);
              audioRefs.current.push([k, a]);

              a.muted = true;
              // a.srcObject = new MediaStream([consumer.track]);

              a.play().catch((err) => {
                console.log(err);
                setShowAutoPlayModal(true);
              });
            }}
          />
        );
      })}
      {showAutoPlayModal && (
        <>
          <AppDialog
            defaultOpen={true}
            content={
              <>
                <div className={`flex text-left mb-4 mt-4 text-primary-100`}>
                  Browsers require user interaction before they will play audio.
                  Just click okay to continue.
                </div>
                <DialogClose>
                  <button
                    className="bg-app_cta p-3 flex items-center justify-center font-bold rounded-md w-full active:bg-sky-800 focus:outline-none focus:ring focus:ring-sky-300"
                    onClick={() => {
                      setShowAutoPlayModal(false);
                      audioRefs.current.forEach(([_, a]) => {
                        a.play().catch((err) => {
                          console.warn(err);
                        });
                      });
                    }}
                  >
                    okay
                  </button>
                </DialogClose>
              </>
            }
          >
            <></>
          </AppDialog>
        </>
      )}
    </>
  );
};
