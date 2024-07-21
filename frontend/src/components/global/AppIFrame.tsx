import { useRendererStore } from "@/engine/2d-renderer/store/RendererStore";
import { useConsumerStore } from "@/engine/rtc/store/ConsumerStore";
import { useCreateVideoCards } from "@/hooks/useCreateVideoCards";
import { Link } from "lucide-react";
import React, { useContext, useState } from "react";
import { Room } from "../../../../shared/types";
import { RoomControls } from "../room/RoomControls";
import { WebSocketContext } from "@/context/WsContext";
import { RoomVideoOverlay } from "../room/RoomVideoOverlay";
import { RoomFrameVideoOverlay } from "../room/RoomFrameVideoOverlay";

type AppIFrameProps = {
  room: Room;
  roomStatus: any;
};

export const AppIFrame: React.FC<AppIFrameProps> = ({ room, roomStatus }) => {
  const { currentWhiteboardSrc } = useRendererStore();
  const [showInput, setShowInput] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const { conn } = useContext(WebSocketContext);

  const { proximityList } = useConsumerStore();
  const remoteParticipants = useCreateVideoCards(proximityList, room);

  const visibleParticipants = remoteParticipants.slice(0, 6);

  const handleLinkClick = () => {
    setShowInput(!showInput);
  };

  const handleInputFocus = () => {
    setShowButton(true);
  };

  const handleInputBlur = () => {
    setShowButton(false);
  };

  return (
    <RoomFrameVideoOverlay room={room}>
      <>
        <div
          className={`flex flex-row items-center justify-center gap-4 py-8 w-full overflow-hidden absolute mx-auto flex-wrap`}
        >
          {visibleParticipants.map((participant, index) => (
            <div key={index}>{participant}</div>
          ))}
        </div>
        <div className="h-3/4 transition-width duration-500 ease-in-out my-auto w-full flex items-center justify-center bg-white relative">
          <div className="absolute top-5 left-10 flex items-center gap-2">
            <button
              onClick={handleLinkClick}
              className="bg-veryLight shadow-appShadow p-2.5 rounded-xl opacity-90"
            >
              <Link />
            </button>
            <div
              className={` rounded-xl overflow-hidden max-w-[280px] ${
                showInput ? "w-[280px] p-3" : "p-0 w-0"
              } transition-width duration-500 ease-in-out font-logo text-[14px] text-opacity-70 bg-neutral-200 opacity-90 text-black`}
            >
              <input
                value={currentWhiteboardSrc}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                className="bg-transparent w-full outline-none border-none focus:outline-none placeholder-text-black/70"
              />
            </div>
            {showButton && (
              <button className="bg-appGreen px-4 py-2 font-logo rounded-xl">
                Set
              </button>
            )}
          </div>
          <iframe src={currentWhiteboardSrc} className="w-full h-full" />
        </div>

        <div className="absolute bottom-0 w-full">
          <RoomControls
            myRoomStatus={roomStatus}
            roomId={(room as Room).roomId as string}
            conn={conn!}
            room={room}
          />
        </div>
      </>
    </RoomFrameVideoOverlay>
  );
};
