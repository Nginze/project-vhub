import React, { useEffect, useRef } from "react";
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

type HomePreviewCardMenuProps = {
  room: any;
};

export const HomePreviewCardMenu: React.FC<HomePreviewCardMenuProps> = ({
  room,
}) => {
  const router = useRouter();
  const urlRef = useRef<string>("");

  useEffect(() => {
    urlRef.current = `http://localhost:3000/room/setup?roomId=${room.roomId}&roomName=${room.roomName}`;
  }, [room]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(urlRef.current);
      console.log("Link copied to clipboard");
    } catch (err) {
      console.log("Failed to copy text: ", err);
    }
  };
  return (
    <div>
      <DropdownMenuGroup>
        <DropdownMenuItem
          onClick={() =>
            router.push(
              `/room/setup?roomId= ${room.roomId} && roomName=${room.roomName}`
            )
          }
        >
          <span>Visit</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => copyToClipboard()}>
          <span>Copy URL</span>
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </div>
  );
};
