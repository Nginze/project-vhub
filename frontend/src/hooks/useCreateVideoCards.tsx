import { useRef } from "react";
import { RoomVideoCard } from "@/components/room/RoomVideoCard";
import { useMediaStore } from "@/engine/rtc/store/MediaStore";
import { Consumer } from "mediasoup-client/lib/types";

export const useCreateVideoCards = (proximityList: Map<string, Consumer>) => {
  const streamsRef = useRef<Map<string, MediaStream>>(new Map());

  return Array.from(proximityList.values()).map((consumer) => {
    if (!streamsRef.current.has(consumer.id)) {
      streamsRef.current.set(consumer.id, new MediaStream([consumer.track]));
    }
    const vidStream = streamsRef.current.get(consumer.id);

    return (
      <RoomVideoCard stream={vidStream!} audioMuted={false} videoMuted={false} />
    );
  });
};
