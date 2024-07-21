import React, { useContext, useState } from "react";
import { BiSolidSmile } from "react-icons/bi";
import { SheetHeader } from "../ui/sheet";
import { useUIStore } from "@/global-store/UIStore";
import { TbHomeCog, TbMessage2, TbUsers, TbUsersGroup } from "react-icons/tb";
import AppDialog from "../global/AppDialog";
import { RoomInvite } from "./RoomInvite";
import { AiOutlineUserAdd } from "react-icons/ai";
import { cn } from "@/lib/utils";
import { AtSign, X } from "lucide-react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { Input } from "../ui/input";
import { PiSmiley } from "react-icons/pi";
import { customEmojis, emoteMap } from "../../engine/chat/EmoteData";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { WebSocketContext } from "@/context/WsContext";
import { userContext } from "@/context/UserContext";

type RoomGlobalChatSheetProps = {
  room: any;
};

export const RoomGlobalChatSheet: React.FC<RoomGlobalChatSheetProps> = ({
  room,
}) => {
  const { activeRoomSheet, set: setUI } = useUIStore();
  const [message, setMessage] = useState("");
  return (
    <div className="w-full h-full flex flex-col px-3.5 font-logo">
      <SheetHeader className="flex flex-row w-full mb-8 items-center space-y-0 justify-between">
        <span
          className="text-lg opacity-80 truncate"
          style={{ maxWidth: "150px" }}
        >
          {room.roomName}
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setUI({ activeRoomSheet: "participant" })}
            className={cn(
              "hover:bg-light p-1.5 rounded-lg button",
              activeRoomSheet === "participant" ? "bg-light" : ""
            )}
          >
            <TbHomeCog size={20} className="opacity-70" />
          </button>

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
      <div className="flex-1 flex flex-col items-start overflow-auto scrollable gap-3  mb-5">
        <RoomMessage />
        <RoomMessage />
        <RoomMessage />
        <RoomMessage />
        <RoomMessage />
        <RoomMessage />
        <RoomMessage />
        <RoomMessage />
        <RoomMessage />
        <RoomMessage />
        <RoomMessage />
        <RoomMessage />
        <RoomMessage />
        <RoomMessage />
        <RoomMessage />
        <RoomMessage />
        <RoomMessage />
        <RoomMessage />
        <RoomMessage />
        <RoomMessage />
      </div>
      <RoomChatInput message={message} setMessage={setMessage} />
    </div>
  );
};
type RoomMessageProps = {
  message?: any;
};

export const RoomMessage: React.FC<RoomMessageProps> = ({ message }) => {
  return (
    <>
      <div>
        <span>xMany:</span>
        <span>
          this is a random message about pedofilia stop pedo PLEASE!!!
        </span>
      </div>
    </>
  );
};

type RoomChatInputProps = {
  message: string;
  setMessage: any;
};

export const RoomChatInput: React.FC<RoomChatInputProps> = ({
  message,
  setMessage,
}) => {
  const [showPicker, setPicker] = useState<boolean>(false);
  const chatInputRef = React.useRef<HTMLInputElement>(null);
  const addEmoji = (e: any) => {
    const emoji = e.native ? e.native : ` ${e.shortcodes} `;
    chatInputRef.current?.focus();
    setMessage((chatContent: string) => chatContent + emoji);
  };

  const { conn } = useContext(WebSocketContext);
  const { user, userLoading } = useContext(userContext);

  const handleChatSend = (e: any) => {
    e.preventDefault();
    setPicker(false);
    const message: ChatMessage = {
      ...user,
      reply,
      content: chatContent,
      createdAt: new Date(),
      color: userColor,
      read: false,
    };
    conn?.emit("chat:global_new_message", { roomId: room.roomId, message });
    setMessage("");
  };
  return (
    <div className="relative w-full">
      <div className="absolute bottom-16 z-70 -left-10">
        {showPicker && (
          <Picker data={data} custom={customEmojis} onEmojiSelect={addEmoji} />
        )}
      </div>
      <form onSubmit={handleChatSend}>
        <Input
          ref={chatInputRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full bg-transparent py-6 text-[14px] border-[hsla(0,0%,100%,.1)] bg-dark placeholder:text-white placeholder:opacity-60 outline-none text-white pl-3 pr-10"
          placeholder="Send a message"
        />
        <div className="absolute inset-y-0 right-3 flex items-center">
          <button
            onClick={() => {
              chatInputRef.current?.focus();
              setPicker(!showPicker);
            }}
            className="hover:bg-light p-1.5 rounded-lg button"
          >
            <PiSmiley size={20} className="opacity-70" />
          </button>
        </div>
      </form>
    </div>
  );
};
