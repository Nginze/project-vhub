import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type RoomProfileButtonProps = {};

export const RoomProfileButton: React.FC<RoomProfileButtonProps> = () => {
  return (
    <>
      <div className="bg-slate-300 max-w-[200px] flex rounded-sm cursor-pointer">
        <div className="py-1 px-4 flex items-center justify-center">
          <Avatar className="w-6 h-6">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col items-start py-1 pl-2 pr-10">
          <span className="text-[14px]">Jonathan Kuug</span>
          <span className="text-[12px]">Available</span>
        </div>
      </div>
    </>
  );
};
