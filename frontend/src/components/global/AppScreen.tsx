import { useConsumerStore } from "@/engine/rtc/store/ConsumerStore";
import { useRoomStore } from "@/global-store/RoomStore";
import { useRef, useEffect } from "react";

type VideoProps = React.DetailedHTMLProps<
  React.VideoHTMLAttributes<HTMLVideoElement>,
  HTMLVideoElement
> & {
  onRef: (v: HTMLVideoElement) => void;
};

type AppScreenProps = {};

const VideoComponent = ({ onRef, ...props }: VideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      onRef(videoRef.current);
    }
  }, [onRef]);

  return (
    <video
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
      ref={videoRef}
      {...props}
    />
  );
};

export const AppScreen: React.FC<AppScreenProps> = () => {
  const { screenShareVideoConsumerMap, screenShareAudioConsumerMap } =
    useConsumerStore();
  const { roomScreenUserId } = useRoomStore();

  const videoRef = useRef<HTMLVideoElement>();
  const audioRef = useRef<HTMLAudioElement>();

  useEffect(() => {
    if (roomScreenUserId) {
      const videoConsumer =
        screenShareVideoConsumerMap[roomScreenUserId]?.consumer;
      const audioConsumer =
        screenShareAudioConsumerMap[roomScreenUserId]?.consumer;

      if (videoConsumer && videoRef.current) {
        videoRef.current.srcObject = new MediaStream([videoConsumer.track]);
      }

      if (audioConsumer && audioRef.current) {
        audioRef.current.srcObject = new MediaStream([audioConsumer.track]);
      }
    }
  }, [
    roomScreenUserId,
    screenShareVideoConsumerMap,
    screenShareAudioConsumerMap,
  ]);

  return (
    <>
      <div className="h-3/4 transition-width duration-500 ease-in-out w-full flex items-center justify-center bg-white relative ">
        <VideoComponent
          autoPlay
          muted
          onRef={(v) => {
            v.muted = true;
            videoRef.current = v;
          }}
        />
        <audio ref={audioRef} autoPlay />
      </div>
    </>
  );
};
