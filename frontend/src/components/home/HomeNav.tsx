import React from "react";
import { Logo } from "../global/Logo";
import { Button } from "../ui/button";
import {
  Calendar,
  CircleHelp,
  Info,
  Plus,
  PlusCircle,
  PlusIcon,
  Sparkles,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";

type HomeNavProps = {};

export const HomeNav: React.FC<HomeNavProps> = () => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-5">
        <Logo withLogo={true} size="md" />
      </div>
      <div className="flex items-center gap-10">
        {/* <Button className="bg-[#36393F] rounded-full w-10 h-10 py-0 px-0">
          <Info size={24} className="opacity-40" />
        </Button> */}
        <Button className="flex items-center gap-2 bg-appGreen rounded-[0.6rem]">
          <PlusCircle size={18} />
          <span className="font-semibold">Create Space</span>
        </Button>
        <Avatar className="w-8 h-8 cursor-pointer ring ">
          <AvatarImage
            className="object-cover"
            src="https://i.pinimg.com/736x/bd/46/35/bd463547b9ae986ba4d44d717828eb09.jpg"
          />
          <AvatarFallback />
        </Avatar>
      </div>
    </div>
  );
};
