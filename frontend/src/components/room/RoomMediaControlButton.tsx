import { cn } from "@/lib/utils";
import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { TooltipArrow } from "@radix-ui/react-tooltip";
import { Button } from "../ui/button";

type RoomMediaControlButtonProps = {
  iconOn: React.ReactNode;
  iconOff: React.ReactNode;
  onClick?: () => void;
  bgColor?: string;
  bgColorActive?: string;
  hoverColor?: string;
  textColor?: string;
  tooltipText?: string;
};

export const RoomMediaControlButton: React.FC<RoomMediaControlButtonProps> = ({
  iconOn,
  iconOff,
  bgColor,
  hoverColor,
  textColor,
  tooltipText,
  onClick,
}) => {
  const [isOn, setIsOn] = React.useState(false);
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={onClick}
          className="flex items-center overflow-hidden bg-light  rounded-full px-0 py-0 w-auto h-auto hover:text-white shadow-appShadow"
        >
          {isOn ? (
            <div
              className={cn(
                `p-2 text-black hover:text-white`,
                bgColor && bgColor,
                hoverColor && hoverColor,
                textColor && textColor
              )}
            >
              {iconOn}
            </div>
          ) : (
            <div
              className={cn(
                `p-2 text-black hover:text-white`,
                bgColor && bgColor,
                hoverColor && hoverColor,
                textColor && textColor
              )}
            >
              {iconOff}
            </div>
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltipText}</p>
      </TooltipContent>
    </Tooltip>
  );
};
