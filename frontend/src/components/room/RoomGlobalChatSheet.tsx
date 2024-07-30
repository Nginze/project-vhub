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
import { useSettingStore } from "@/global-store/SettingStore";
import { WS_MESSAGE } from "@/engine/2d-renderer/events";

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
      </div>
      {/* <RoomChatInput message={message} setMessage={setMessage} /> */}
    </div>
  );
};
type RoomMessageProps = {
  message?: any;
};

export const RoomMessage: React.FC<RoomMessageProps> = ({ message }) => {
  const parseMessage = (msg: string): React.ReactNode[] => {
    const tokens = msg.split(" ");
    const parsedMessage: (React.ReactNode | string)[] = [];

    tokens.forEach((t) => {
      const parsedToken = t.replaceAll(":", "");

      if (emoteMap[parsedToken] && t.indexOf(":") > -1) {
        parsedMessage.push(
          <img
            className="inline align-baseline"
            src={emoteMap[parsedToken]}
            alt={parsedToken}
          />
        );
        parsedMessage.push(" ");
      } else if (t.startsWith("http://") || t.startsWith("https://")) {
        parsedMessage.push(
          <a
            href={t}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500"
          >
            {t}
          </a>
        );
        parsedMessage.push(" ");
      } else if (t.startsWith("@")) {
        parsedMessage.push(
          <span className="bg-orange-400 p-1 rounded-sm text-xs">{t}</span>
        );
        parsedMessage.push(" ");
      } else {
        parsedMessage.push(t);
        parsedMessage.push(" ");
      }
    });

    return parsedMessage;
  };
  return (
    <>
      <div className="flex flex-col items-start">
        <span style={{ color: message.color }}>{message.userName}</span>
        <span className="font-sans text-[14px] opacity-80">
          {parseMessage(message.content)}
        </span>
      </div>
    </>
  );
};

type RoomChatInputProps = {
  message: string;
  setMessage: any;
  room: any;
};

export const RoomChatInput: React.FC<RoomChatInputProps> = ({
  message: chatContent,
  setMessage,
  room,
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
  const { userColor } = useSettingStore();

  const handleChatSend = (e: any) => {
    e.preventDefault();
    setPicker(false);
    const message: any = {
      ...user,
      content: chatContent,
      createdAt: new Date(),
      color: userColor,
      read: false,
    };
    console.log(message, room.roomId);
    conn?.emit(WS_MESSAGE.WS_CHAT_GLOBAL_NEW_MESSAGE, {
      roomId: room.roomId,
      message,
    });
    setMessage("");
  };

  return (
    <div className="w-full">
      <div className="absolute bottom-16 z-70 right-[24rem]">
        {showPicker && (
          <Picker data={data} custom={customEmojis} onEmojiSelect={addEmoji} />
        )}
      </div>
      <form onSubmit={handleChatSend} className="relative mb-2">
        <Input
          ref={chatInputRef}
          value={chatContent}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full bg-transparent py-6 text-[14px] border-[hsla(0,0%,100%,.1)] bg-semiUltra rounded-2xl placeholder:text-white placeholder:opacity-60 outline-none text-white pl-3 pr-10"
          placeholder="Send a message"
        />
        <div className="absolute inset-y-0 right-3 flex items-center">
          <button
            type="button"
            onClick={(e) => {
              // e.preventDefault();
              e.stopPropagation();
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
