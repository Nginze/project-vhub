import React, { useContext, useState } from "react";
import { RoomVideoCard } from "./RoomVideoCard";
import { useMediaStore } from "@/engine/rtc/store/MediaStore";
import { useConsumerStore } from "@/engine/rtc/store/ConsumerStore";
import { useCreateVideoCards } from "@/hooks/useCreateVideoCards";
import { ChevronsDown, Expand, Fullscreen, Maximize } from "lucide-react";
import { Room } from "../../../../shared/types";
import { userContext } from "@/context/UserContext";
import { Button } from "../ui/button";
import { BiExpand } from "react-icons/bi";

type RoomFrameVideoOverlayProps = {
  room: Room;
  children: React.ReactNode;
};

export const RoomFrameVideoOverlay: React.FC<RoomFrameVideoOverlayProps> = ({
  room,
  children,
}) => {
  const { localStream, mic, vid } = useMediaStore();
  const { proximityList } = useConsumerStore();
  const [isMinimized, setIsMinimized] = useState(false);
  const remoteParticipants = useCreateVideoCards(
    proximityList,
    room,
    isMinimized
  );
  const { user } = useContext(userContext);
  const [visibleRows, setVisibleRows] = useState(1);

  const visibleParticipants = isMinimized
    ? remoteParticipants
    : remoteParticipants.slice(0, visibleRows * 6);

  if (isMinimized) {
    const numParticipants = visibleParticipants.length;
    const numColumns = Math.ceil(Math.sqrt(numParticipants));

    return (
      <>
        <button
          onClick={() => {
            setIsMinimized(!isMinimized);
          }}
          className="absolute hover:opacity-80 top-10 left-10 z-50 "
        >
          <Maximize size={20} />
        </button>
        <div
          className={`grid grid-cols-${numColumns} gap-4 px-10 py-5 w-full h-4/5 overflow-auto my-auto relative mx-auto`}
        >
          {visibleParticipants.map((participant, index) => (
            <div key={index}>{participant}</div>
          ))}
        </div>

        {
          <>
            <div className="absolute bottom-4 z-50 right-5">
              <RoomVideoCard
                className="w-36 h-[6rem] border border-deep"
                indicatorOn={false}
                userName={user.userName as string}
                stream={localStream}
                audioMuted={mic?.enabled ? false : true}
                videoMuted={vid?.enabled ? false : true}
              />
            </div>
          </>
        }
      </>
    );
  }

  return (
    <>
      <div className="h-auto absolute">
        <div
          className={`flex flex-row items-center justify-center gap-4 py-8 w-full z-50 overflow-hidden absolute mx-auto flex-wrap`}
        >
          {visibleParticipants.map((participant, index) => (
            <div key={index}>{participant}</div>
          ))}
        </div>

        {true && (
          <div className="absolute z-50 my-40 w-screen flex justify-center animate-bounce">
            <button
              onClick={() => {
                setIsMinimized(!isMinimized);
              }}
              className="bg-white p-1 rounded-full"
            >
              <ChevronsDown size={18} className="text-black" />
            </button>
          </div>
        )}
      </div>

      {
        <div className="absolute bottom-4 z-50 right-5">
          <RoomVideoCard
            className="w-36 h-[6rem] border border-deep"
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
