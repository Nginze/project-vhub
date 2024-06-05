import { cn } from "@/lib/utils";
import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { TooltipArrow } from "@radix-ui/react-tooltip";
import { Button } from "../ui/button";

type RoomReactionsButtonProps = {
  iconOn: React.ReactNode;
  iconOff: React.ReactNode;
  onClick?: () => void;
  bgColor?: string;
  bgColorActive?: string;
  hoverColor?: string;
  textColor?: string;
  tooltipText?: string;
};

export const RoomReactionsButton: React.FC<RoomReactionsButtonProps> = ({
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
          onClick={() => {
            setIsOn(!isOn);
            onClick && onClick();
          }}
          className="flex items-center overflow-hidden bg-light  rounded-full px-0 py-0 w-auto h-auto hover:text-white shadow-appShadow"
        >
          <div
            className={cn(
              `p-2 text-black hover:text-white
                ${isOn ? "w-[200px]" : "w-10"}
              transition-width duration-500 ease-in-out`,
              bgColor && bgColor,
              hoverColor && hoverColor,
              textColor && textColor
            )}
          >
            {isOn ? iconOn : iconOff}
          </div>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltipText}</p>
      </TooltipContent>
    </Tooltip>
  );
};
