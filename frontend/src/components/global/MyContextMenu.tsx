import React, { useContext } from "react";
import {
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenu,
} from "../ui/context-menu";
import { FaClockRotateLeft } from "react-icons/fa6";
import { PiShirtFoldedDuotone } from "react-icons/pi";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { userContext } from "@/context/UserContext";
import { Shirt, UserRoundCog } from "lucide-react";
import { BiExit, BiSolidMicrophone, BiSolidVideo } from "react-icons/bi";
import { Separator } from "../ui/separator";
import { BsFillGearFill } from "react-icons/bs";

type MyContextMenuProps = {};

export const MyContextMenu: React.FC<MyContextMenuProps> = () => {
  const { user } = useContext(userContext);
  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger>
          <div id="ctx-menu-trigger"></div>
        </ContextMenuTrigger>
        <ContextMenuContent className="">
          <ContextMenuItem className="cursor-pointer flex items-center gap-2">
            <UserRoundCog size={16} className=" opacity-70" />
            <span className="opacity-70 font-semibold">Edit Skin</span>
          </ContextMenuItem>

          <ContextMenuItem className="cursor-pointer flex items-center gap-2 ">
            <BiSolidMicrophone className="opacity-70 " size={16} />
            <span className="opacity-70 font-semibold">Mute Mic</span>
          </ContextMenuItem>

          <ContextMenuItem className="cursor-pointer flex items-center gap-2 ">
            <BiSolidVideo className="opacity-70 " size={16} />
            <span className="opacity-70 font-semibold">Turn On Video</span>
          </ContextMenuItem>
          <Separator className="bg-light w-4/5 mx-auto" />
          <ContextMenuItem className="cursor-pointer flex items-center gap-2 ">
            <BsFillGearFill className="opacity-70 " size={16} />
            <span className="opacity-70 font-semibold">Settings</span>
          </ContextMenuItem>
          <ContextMenuItem className="cursor-pointer flex items-center gap-2 ">
            <BiExit className="opacity-70 " size={16} />
            <span className="opacity-70 font-semibold">Leave Room</span>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </>
  );
};
