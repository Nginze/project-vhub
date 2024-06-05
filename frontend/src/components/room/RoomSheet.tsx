import React from "react";
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
import { X } from "lucide-react";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import AppDialog from "../global/AppDialog";
import { RoomInvite } from "./RoomInvite";

type RoomSheetProps = {
  room: any;
};

export const RoomSheet: React.FC<RoomSheetProps> = ({ room }) => {
  return (
    <div className="w-full h-full flex flex-col px-3.5 font-logo">
      <SheetHeader className="flex flex-row w-full mb-8 items-center space-y-0 justify-between">
        <span
          className="text-lg opacity-80 truncate"
          style={{ maxWidth: "150px" }}
        >
          Groovy Community
        </span>
        <div className="flex items-center gap-3">
          <button className="hover:bg-light p-1.5 rounded-lg">
            <AiOutlineCalendar size={20} className="opacity-70" />
          </button>

          <AppDialog
            content={<RoomInvite />}
            width={"sm:max-w-[450px]"}
            className="absolute top-28 left-60"
          >
            <button className="hover:bg-light p-1.5 rounded-lg ">
              <AiOutlineUserAdd size={20} className="opacity-70" />
            </button>
          </AppDialog>

          <SheetPrimitive.Close className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
            <X size={20} />
            <span className="sr-only">Close</span>
          </SheetPrimitive.Close>
        </div>
      </SheetHeader>
      <div className="w-full mb-5">
        <div className="flex bg-deep px-4 py-0 rounded-lg gap-2 items-center border-2 border-appPrimary">
          <AiOutlineSearch size={20} />
          <Input
            className="w-full bg-transparent py-0 outline-none border-none focus:outline-none placeholder:text-white/70"
            placeholder="Search Participants"
          />
        </div>
      </div>
      <div className="flex flex-col items-start flex-1">
        <span className="flex gap-2 h-6 opacity-80 text-[16px] font-semibold mb-3">
          On the Call
          <span className="bg-light flex items-center justify-center px-2 py-0.5 rounded-sm text-[10px]">
            {room.participants.length}
          </span>
        </span>
        <div className="flex flex-col items-start gap-1.5 w-full">
          {room.participants.map((p: any) => (
            <RoomParticipantProfile key={p.userId} roomParticipant={p} />
          ))}
        </div>
      </div>
    </div>
  );
};
