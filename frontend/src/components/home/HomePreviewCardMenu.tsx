import React, { useEffect, useRef, useState } from "react";
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { CreditCard, HelpCircle } from "lucide-react";
import { MdBrowserUpdated } from "react-icons/md";
import { Room } from "../../../../shared/types";
import { useRouter } from "next/router";
import { BiLinkExternal } from "react-icons/bi";
import { IoCheckmarkCircleOutline, IoCopyOutline } from "react-icons/io5";

type HomePreviewCardMenuProps = {
  room: any;
};

export const HomePreviewCardMenu: React.FC<HomePreviewCardMenuProps> = ({
  room,
}) => {
  const router = useRouter();
  const urlRef = useRef<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    urlRef.current = `http://localhost:3000/room/setup?roomId=${room.roomId}&roomName=${room.roomName}`;
  }, [room]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(urlRef.current);
      console.log("Link copied to clipboard");
      setCopied(true);
      setTimeout(() => setCopied(false), 500);
    } catch (err) {
      console.log("Failed to copy text: ", err);
    }
  };
  return (
    <div>
      <DropdownMenuGroup>
        <DropdownMenuItem
          className="cursor-pointer py-2 px-3 rounded-xl focus:bg-light focus:text-white text-[16px]"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            router.push(
              `/room/setup?roomId= ${room.roomId} && roomName=${room.roomName}`
            );
          }}
        >
          <BiLinkExternal size={20} className="mr-4" />
          <span>Visit</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer py-2 px-3 rounded-xl focus:bg-light focus:text-white text-[16px]"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            copyToClipboard();
          }}
        >
          {copied ? (
            <IoCheckmarkCircleOutline size={20} className="mr-4 text-appGreen" />
          ) : (
            <IoCopyOutline size={20} className="mr-4" />
          )}
          <span>{copied ? "Copied" : "Copy Link"}</span>
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </div>
  );
};
