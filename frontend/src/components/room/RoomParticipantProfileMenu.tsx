import React, { useContext } from "react";
import { DropdownMenuGroup, DropdownMenuItem } from "../ui/dropdown-menu";
import { BsChatDots } from "react-icons/bs";
import { PiGavelDuotone } from "react-icons/pi";
import { ShieldAlert } from "lucide-react";
import { TbMessage2 } from "react-icons/tb";
import { FiTarget } from "react-icons/fi";
import { useRendererStore } from "@/engine/2d-renderer/store/RendererStore";
import { RoomScene } from "@/engine/2d-renderer/scenes/RoomScene";
import { userContext } from "@/context/UserContext";

type RoomParticipantProfileMenuProps = {
  participant: any;
};

export const RoomParticipantProfileMenu: React.FC<
  RoomParticipantProfileMenuProps
> = ({ participant }) => {
  const { game } = useRendererStore();
  const { user } = useContext(userContext);

  return (
    <div className="font-sans">
      <DropdownMenuGroup>
        {user.userId === participant.userId ? (
          <>
            <DropdownMenuItem className="cursor-pointer py-2 px-3 rounded-xl focus:bg-light focus:text-white text-[16px]">
              <ShieldAlert className="text-appRed mr-4" size={20} />
              <span className="text-appRed">Leave</span>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem
              onClick={() => {
                (game?.scene.getScene("room-scene") as RoomScene).locatePlayer(
                  participant.userId
                );

                console.log("Locate player");
              }}
              className="cursor-pointer py-2 px-3 rounded-xl focus:bg-light focus:text-white text-[16px]"
            >
              <FiTarget size={20} className="mr-4" />
              <span>Locate</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer py-2 px-3 rounded-xl focus:bg-light focus:text-white text-[16px]">
              <ShieldAlert size={20} className="mr-4" />
              <span>Kick Out</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuGroup>
    </div>
  );
};
