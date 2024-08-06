import { useRendererStore } from "@/engine/2d-renderer/store/RendererStore";
import { useConsumerStore } from "@/engine/rtc/store/ConsumerStore";
import { useCreateVideoCards } from "@/hooks/useCreateVideoCards";
import { Link } from "lucide-react";
import React, { useContext, useRef, useState } from "react";
import { Room } from "../../../../shared/types";
import { RoomControls } from "../room/RoomControls";
import { WebSocketContext } from "@/context/WsContext";
import { RoomVideoOverlay } from "../room/RoomVideoOverlay";
import { RoomFrameVideoOverlay } from "../room/RoomFrameVideoOverlay";
import { Input } from "../ui/input";
import { Consumer } from "mediasoup-client/lib/types";

type AppIFrameProps = {
  chatMessages: any;
  room: Room;
  roomStatus: any;
};

export const AppIFrame: React.FC<AppIFrameProps> = ({
  room,
  roomStatus,
  chatMessages,
}) => {
  const { currentWhiteboardSrc, set: setRenderer } = useRendererStore();
  const [showInput, setShowInput] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const { conn } = useContext(WebSocketContext);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const { proximityList } = useConsumerStore();

  const remoteParticipants = useCreateVideoCards(proximityList, room);

  const visibleParticipants = remoteParticipants.slice(0, 5);

  const handleLinkClick = () => {
    setShowInput(!showInput);
  };

  const handleInputFocus = () => {
    setShowButton(true);
  };

  const handleInputBlur = () => {
    setShowButton(false);
  };

  function getEmbedUrl(url: string) {
    const match = url.match(
      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)$/
    );
    if (match) {
      // add parameters to hide controls and info
      return `https://www.youtube.com/embed/${match[1]}?controls=0&showinfo=0&modestbranding=1&rel=0`;
    } else {
      return url;
    }
  }
  return (
    <RoomFrameVideoOverlay room={room}>
      <>
        <div
          className={`flex flex-row items-center justify-center gap-6 py-5 w-full overflow-hidden absolute mx-auto flex-wrap`}
        >
          {visibleParticipants.map((participant, index) => (
            <div key={index}>{participant}</div>
          ))}
        </div>
        <div className="h-3/4 transition-width duration-500 ease-in-out my-auto w-full flex items-center justify-center bg-white relative ">
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
              } transition-width duration-500 ease-in-out font-logo text-[14px] text-opacity-70 bg-transparent opacity-90 text-black`}
            >
              <Input
                value={currentWhiteboardSrc}
                onChange={(e) => {
                  const embedUrl = getEmbedUrl(e.target.value);
                  setRenderer({ currentWhiteboardSrc: embedUrl });
                }}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                className="w-full outline-none bg-white  placeholder-text-black/70"
              />
            </div>
            {/* {showButton && (
              <button
                onClick={() => {
                  iframeRef?.current?.contentWindow?.location.reload();
                }}
                className="bg-appGreen hover:ring hover:opacity-85 active:opacity-40 px-4 py-2 font-logo rounded-xl"
              >
                Set
              </button>
            )} */}
          </div>
          <iframe
            ref={iframeRef}
            key={currentWhiteboardSrc}
            src={currentWhiteboardSrc}
            className="w-full h-full border-none"
          />
        </div>

        <div className="absolute bottom-0 w-full">
          <RoomControls
            noExtra={true}
            chatMessages={chatMessages}
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
