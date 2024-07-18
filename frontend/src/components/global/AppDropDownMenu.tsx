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
import { Room } from "../../../../shared/types";
import { cn } from "@/lib/utils";

type AppDropDownMenuProps = {
  children: React.ReactNode;
  content: React.ReactNode;
  className?: string;
};

export const AppDropDownMenu: React.FC<AppDropDownMenuProps> = ({
  children,
  content,
  className,
}) => {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent className={cn("w-40", className)}>
          {content}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
