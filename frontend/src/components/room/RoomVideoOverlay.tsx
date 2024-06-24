import React, { useContext, useState } from "react";
import { RoomVideoCard } from "./RoomVideoCard";
import { useMediaStore } from "@/engine/rtc/store/MediaStore";
import { useConsumerStore } from "@/engine/rtc/store/ConsumerStore";
import { useCreateVideoCards } from "@/hooks/useCreateVideoCards";
import { ChevronsDown } from "lucide-react";
import { Room } from "../../../../shared/types";
import { userContext } from "@/context/UserContext";

type RoomVideoOverlayProps = {
  room: Room;
  children: React.ReactNode;
};

export const RoomVideoOverlay: React.FC<RoomVideoOverlayProps> = ({
  room,
  children,
}) => {
  const { localStream, mic, vid } = useMediaStore();
  const { proximityList } = useConsumerStore();
  const remoteParticipants = useCreateVideoCards(proximityList, room);
  const { user } = useContext(userContext);
  const [visibleRows, setVisibleRows] = useState(1);

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
        {/* {proximityList.size > 0 && (
          <div className="absolute z-50 my-44 left-1/2">
            <button className="bg-white p-1.5 rounded-full">
              <ChevronsDown size={18} className="text-black" />
            </button>
          </div>
        )} */}
      </div>

      {
        <div className="absolute bottom-4 z-50 right-5">
          <RoomVideoCard
            className="w-36 h-[6rem]"
            indicatorOn={false}
            userName={user.userName as string}
            stream={localStream}
            audioMuted={mic?.enabled ? false : true}
            videoMuted={vid?.enabled ? false : true}
          />
        </div>
      }
      {children}
    </>
  );
};
