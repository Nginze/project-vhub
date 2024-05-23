import React from "react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { Dice2, Dices } from "lucide-react";

type SetupFormProps = {};

export const SetupForm: React.FC<SetupFormProps> = () => {
  return (
    <div className="w-full py-3">
      <div className="flex flex-col items-end gap-5 w-full">
        <div className="flex items-center gap-3 w-full">
          <Avatar className="w-8 h-8 cursor-pointer">
            <AvatarImage
              className="object-cover"
              src="https://i.pinimg.com/736x/bd/46/35/bd463547b9ae986ba4d44d717828eb09.jpg"
            />
            <AvatarFallback />
          </Avatar>
          <div className="flex flex-col items-start gap-2 w-full">
            <Input
              className="w-full bg-transparent border-[#7289DA] outline-none text-white"
              placeholder="Enter your username"
            />
            <span className="text-[10px] opacity-40">
              Change your in-game username{" "}
              <span className="text-red-500">*</span>
            </span>
          </div>
        </div>
        <div className="w-full">
          <Button className="bg-[#43B581] text-white w-full flex items-center gap-2 justify-center">
            <Dices size={16} />
            Join
          </Button>
        </div>
      </div>
    </div>
  );
};
