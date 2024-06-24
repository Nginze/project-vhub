import React from "react";
import {
  User,
  CreditCard,
  Settings,
  Keyboard,
  Users,
  UserPlus,
  Mail,
  MessageSquare,
  PlusCircle,
  Plus,
  Github,
  LifeBuoy,
  Cloud,
  LogOut,
  PackagePlus,
  HelpCircle,
} from "lucide-react";
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "../ui/dropdown-menu";
import { MdBrowserUpdated } from "react-icons/md";

type HomeResourceMenuProps = {};

export const HomeResourceMenu: React.FC<HomeResourceMenuProps> = () => {
  return (
    <div>
      <DropdownMenuLabel>More Services</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem>
          <MdBrowserUpdated className="mr-2 h-4 w-4" />
          <span>Product Updates</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <CreditCard className="mr-2 h-4 w-4" />
          <span>Pricing</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <HelpCircle className="mr-2 h-4 w-4" />
          <span>Help Center</span>
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </div>
  );
};
