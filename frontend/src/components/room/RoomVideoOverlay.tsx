import React, { useState } from "react";
import { RoomVideoCard } from "./RoomVideoCard";
import { useMediaStore } from "@/engine/rtc/store/MediaStore";
import { useConsumerStore } from "@/engine/rtc/store/ConsumerStore";
import {
  useCreateVideoCards,
} from "@/hooks/useCreateVideoCards";
import { ChevronsDown } from "lucide-react";

type RoomVideoOverlayProps = {
  children: React.ReactNode;
};

export const RoomVideoOverlay: React.FC<RoomVideoOverlayProps> = ({
  children,
}) => {
  const { localStream } = useMediaStore();
  const { proximityList } = useConsumerStore();
  const remoteParticipants = useCreateVideoCards(proximityList);
  const [visibleRows, setVisibleRows] = useState(1);

  const localParticipant = (
    <RoomVideoCard
      className="w-36 h-[6rem]"
      stream={localStream}
      audioMuted={false}
      videoMuted={false}
    />
  );

  const visibleParticipants = remoteParticipants.slice(0, visibleRows * 6);

  return (
    <>
      <div className="relative h-auto">
        <div
          className={`flex flex-row items-center justify-center gap-4 py-8 w-full z-50 overflow-hidden absolute mx-auto flex-wrap`}
        >
          {visibleParticipants.map((participant, index) => (
            <div key={index}>{participant}</div>
          ))}
        </div>
        {proximityList.size > 0 && (
          <div className="absolute z-50 my-44 left-1/2">
            <button className="bg-white p-1.5 rounded-full">
              <ChevronsDown size={18} className="text-black" />
            </button>
          </div>
        )}
      </div>

      {<div className="absolute bottom-5 z-50 right-5">{localParticipant}</div>}
      {children}
    </>
  );
};
