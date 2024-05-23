import { cn } from "@/lib/utils";
import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";
import React, { useState } from "react";
import { Button } from "../ui/button";

type SetupButtonProps = {
  iconOn: React.ReactNode;
  iconOff: React.ReactNode;
  onClick?: () => void;
  bgColor?: string;
  bgColorActive?: string;
  hoverColor?: string;
  textColor?: string;
  tooltipText?: string;
};

export const SetupButton: React.FC<SetupButtonProps> = ({
  iconOn,
  iconOff,
  bgColor,
  bgColorActive,
  hoverColor,
  onClick,
  tooltipText,
  textColor,
}) => {
  const [isOn, setIsOn] = useState(false);
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={onClick}
          className="flex items-center overflow-hidden bg-white bg-opacity-55 rounded-full px-0 py-0 w-auto h-auto hover:text-white"
        >
          {isOn ? (
            <div
              className={cn(
                `p-3 text-black hover:text-white`,
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
                `p-3 text-black hover:text-white`,
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
