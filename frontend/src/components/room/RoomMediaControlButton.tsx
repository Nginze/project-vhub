import { cn } from "@/lib/utils";
import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { TooltipArrow } from "@radix-ui/react-tooltip";

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
        <button
          onClick={onClick}
          className="flex items-center overflow-hidden bg-white rounded-full"
        >
          {isOn ? (
            <div
              className={cn(
                `p-3 text-black`,
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
                `p-3 text-black`,
                bgColor && bgColor,
                hoverColor && hoverColor,
                textColor && textColor
              )}
            >
              {iconOff}
            </div>
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltipText}</p>
      </TooltipContent>
    </Tooltip>
  );
};
