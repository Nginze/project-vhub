import React from "react";
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { CreditCard, HelpCircle } from "lucide-react";
import { MdBrowserUpdated } from "react-icons/md";

type HomePreviewCardMenuProps = {};

export const HomePreviewCardMenu: React.FC<HomePreviewCardMenuProps> = () => {
  return (
    <div>
      <DropdownMenuGroup>
        <DropdownMenuItem>
          <span>Visit</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <span>Copy URL</span>
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </div>
  );
};
