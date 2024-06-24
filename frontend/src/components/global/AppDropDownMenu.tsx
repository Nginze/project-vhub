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
} from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

type AppDropDownMenuProps = {
  children: React.ReactNode;
  content: React.ReactNode;
};

export const AppDropDownMenu: React.FC<AppDropDownMenuProps> = ({
  children,
  content,
}) => {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent className="w-40">{content}</DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
