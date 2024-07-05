import React from "react";
import { DropdownMenuGroup, DropdownMenuItem } from "../ui/dropdown-menu";

type RoomParticipantProfileMenuProps = {};

export const RoomParticipantProfileMenu: React.FC<
  RoomParticipantProfileMenuProps
> = () => {
  return (
    <div>
      <DropdownMenuGroup>
        <DropdownMenuItem className="py-2">
          <span>Message</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="py-2">
          <span>Kick</span>
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </div>
  );
};
