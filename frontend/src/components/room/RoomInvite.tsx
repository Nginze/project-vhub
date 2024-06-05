import React from "react";
import { Button } from "../ui/button";
import { Link, Share, Share2 } from "lucide-react";

type RoomInviteProps = {};

export const RoomInvite: React.FC<RoomInviteProps> = () => {
  return (
    <div className="font-logo">
      <div className="w-full flex flex-col items-start gap-2 mb-5">
        <span className="flex items-center gap-3 font-semibold text-2xl">
          Share this link 🎉
        </span>
        <span className="text-[14px] opacity-70">
          Try inviting some of your favourite buddies to come hangout
        </span>
      </div>
      <div>
        <Button className="flex items-center gap-2 py-6 w-full bg-appGreen">
          <Link />
          Copy Link
        </Button>
      </div>
    </div>
  );
};
