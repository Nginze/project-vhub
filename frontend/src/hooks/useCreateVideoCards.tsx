import { useRef } from "react";
import { RoomVideoCard } from "@/components/room/RoomVideoCard";
import { useMediaStore } from "@/engine/rtc/store/MediaStore";
import { Consumer } from "mediasoup-client/lib/types";
import { Room, RoomParticipant } from "../../../shared/types";

export const useCreateVideoCards = (
  proximityList: Map<string, Consumer>,
  room: any,
  isMinimized?: boolean
) => {
  // const defaultCardProps = {
  //   videoMuted: true,
  //   audioMuted: true,
  //   userName: "Default User",
  //   indicatorOn: false,
  //   stream: null,
  // };

  // // Return an array of RoomVideoCard components with default props
  // return Array(12)
  //   .fill(null)
  //   .map((_, index) =>
  //     isMinimized ? (
  //       <RoomVideoCard
  //         className="w-full h-full"
  //         key={index}
  //         {...defaultCardProps}
  //       />
  //     ) : (
  //       <RoomVideoCard
  //         className="w-40 h-[6rem]"
  //         key={index}
  //         {...defaultCardProps}
  //       />
  //     )
  //   );
  const streamsRef = useRef<Map<string, MediaStream>>(new Map());

  return Array.from(proximityList.entries()).map(
    ([participantId, consumer]) => {
      if (!streamsRef.current.has(consumer.id)) {
        streamsRef.current.set(consumer.id, new MediaStream([consumer.track]));
      }
      const vidStream = streamsRef.current.get(consumer.id);

      const videoMuted = room.participants.find(
        (p: RoomParticipant) => p.userId === participantId
      )?.isVideoOff;
      const audioMuted = room.participants.find(
        (p: RoomParticipant) => p.userId === participantId
      )?.isMuted;
      const userName = room.participants.find(
        (p: RoomParticipant) => p.userId === participantId
      )?.userName;

      const indicatorOn = room.participants.find(
        (p: RoomParticipant) => p.userId === participantId
      )?.indicatorOn;

      return (
        <RoomVideoCard
          key={participantId}
          className="w-40 h-[6rem]"
          indicatorOn={indicatorOn}
          userName={userName}
          stream={vidStream!}
          audioMuted={audioMuted}
          videoMuted={videoMuted}
        />
      );
    }
  );
};
