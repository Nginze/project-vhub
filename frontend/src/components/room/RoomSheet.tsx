import React, { useState } from "react";
import { AiOutlineUserAdd } from "react-icons/ai";
import { Button } from "../ui/button";
import { useLoadRoomMeta } from "@/hooks/useLoadRoomMeta";
import { RoomParticipantProfile } from "./RoomParticipantProfile";
import { SheetHeader } from "../ui/sheet";
import {
  AiOutlineUsergroupAdd,
  AiOutlineCalendar,
  AiOutlineSearch,
} from "react-icons/ai";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { ChevronLeft, X } from "lucide-react";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import AppDialog from "../global/AppDialog";
import { RoomInvite } from "./RoomInvite";
import { RoomParticipant } from "../../../../shared/types";
import { TbMessage2 } from "react-icons/tb";
import { useUIStore } from "@/global-store/UIStore";
import { cn } from "@/lib/utils";
import { RoomChatInput, RoomMessage } from "./RoomGlobalChatSheet";
import { emoteMap } from "@/engine/chat/EmoteData";

type RoomSheetProps = {
  room: any;
  chatMessages: any;
};

export const RoomSheet: React.FC<RoomSheetProps> = ({ room, chatMessages }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { activeRoomSheet, set: setUI } = useUIStore();
  const [message, setMessage] = useState("");

  const filteredParticipants = room.participants.filter(
    (participant: RoomParticipant) =>
      participant.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const chatEndRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  return (
    <div className="w-full h-full flex flex-col font-logo">
      <SheetHeader className="flex flex-row w-full mb-4 items-center space-y-0 justify-between px-5">
        <span
          className="text-[22px] opacity-80 truncate"
          style={{ maxWidth: "150px" }}
        >
          {room.roomName}
        </span>
        <div className="flex items-center gap-3">
          {/* <button
            onClick={() => setUI({ activeRoomSheet: "message" })}
            className={cn(
              "hover:bg-light p-1.5 rounded-lg button",
              activeRoomSheet === "message" ? "bg-light" : ""
            )}
          >
            <TbMessage2 size={20} className="opacity-70" />
          </button> */}

          <AppDialog
            content={<RoomInvite />}
            width={"sm:max-w-[450px]"}
            className="absolute top-28 left-60"
          >
            <button className="hover:bg-light p-1.5 rounded-lg button ">
              <AiOutlineUserAdd size={20} className="opacity-70" />
            </button>
          </AppDialog>

          <SheetPrimitive.Close className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
            <X size={20} />
            <span className="sr-only">Close</span>
          </SheetPrimitive.Close>
        </div>
      </SheetHeader>
      <div className="w-full mb-5 px-5">
        <div className="flex bg-ultra px-4 py-1 rounded-2xl gap-2 items-center border border-light focus-within:border-appPrimary">
          <AiOutlineSearch size={20} />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent py-0 outline-none border-none focus:outline-none focus:outline-0 placeholder:text-white/70"
            placeholder="Search Participants"
          />
        </div>
      </div>
      <div className="flex flex-col items-start flex-1 h-1/2 max-h-1/2 overflow-auto">
        <span className="flex gap-2 h-6 opacity-80 text-[16px] font-semibold font-sans mb-3 px-5">
          Participants
          <span className="bg-light flex items-center justify-center px-2 py-0.5 rounded-sm text-[10px]">
            {room.participants.length}
          </span>
        </span>
        <div className="flex flex-col items-start  w-full px-5">
          {filteredParticipants.map((p: RoomParticipant) => (
            <RoomParticipantProfile key={p.userId} roomParticipant={p} />
          ))}
        </div>
      </div>
      <Separator
        className="opacity-30 mr-5 bg-veryLight"
        orientation="horizontal"
      />
      <div className="flex flex-col flex-1 overflow-y-auto  chat ">
        <div className="text-lg w-full flex flex-row items-center gap-2 py-3 px-5 opacity-80 ">
          <span className="text-[16px] flex gap-2 items-center">
            <TbMessage2 size={20} className="opacity-70" />
            Global Chat
          </span>
        </div>
        <div className="flex flex-col flex-1 items-start overflow-auto gap-1 mb-5 w-full px-5">
          {chatMessages?.messages
            .slice()
            .reverse()
            .map((msg: any, index: number) => (
              <RoomMessage key={index} message={msg} />
            ))}
          <div ref={chatEndRef} />
        </div>
        <div className="px-5">
          <RoomChatInput
            room={room}
            message={message}
            setMessage={setMessage}
          />
        </div>
      </div>
    </div>
  );
};
