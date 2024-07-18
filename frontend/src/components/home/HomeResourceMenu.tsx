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
import {
  MdBrowserUpdated,
  MdOutlinePayments,
  MdOutlineTipsAndUpdates,
} from "react-icons/md";

type HomeResourceMenuProps = {};

export const HomeResourceMenu: React.FC<HomeResourceMenuProps> = () => {
  return (
    <div className="font-sans">
      <DropdownMenuGroup>
        <DropdownMenuItem className="cursor-pointer py-2 px-3 rounded-xl focus:bg-light focus:text-white text-[16px]">
          <MdOutlineTipsAndUpdates size={20} className="mr-4" />
          <span>Updates</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer py-2 px-3 rounded-xl focus:bg-light focus:text-white text-[16px]">
          <MdOutlinePayments size={20} className="mr-4" />
          <span>Pricing</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer py-2 px-3 rounded-xl focus:bg-light focus:text-white text-[16px]">
          <HelpCircle size={20} className="mr-4" />
          <span>Help Center</span>
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </div>
  );
};
