import React from "react";
import { DropdownMenuGroup, DropdownMenuItem } from "../ui/dropdown-menu";
import { BsChatDots } from "react-icons/bs";
import { PiGavelDuotone } from "react-icons/pi";
import { ShieldAlert } from "lucide-react";
import { TbMessage2 } from "react-icons/tb";

type RoomParticipantProfileMenuProps = {};

export const RoomParticipantProfileMenu: React.FC<
  RoomParticipantProfileMenuProps
> = () => {
  return (
    <div className="font-sans">
      <DropdownMenuGroup>
        <DropdownMenuItem className="cursor-pointer py-2 px-3 rounded-xl focus:bg-light focus:text-white text-[16px]">
          <TbMessage2 size={20} className="mr-4" />
          <span>Message</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer py-2 px-3 rounded-xl focus:bg-light focus:text-white text-[16px]">
          <ShieldAlert size={20} className="mr-4" />
          <span>Kick Out</span>
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </div>
  );
};
